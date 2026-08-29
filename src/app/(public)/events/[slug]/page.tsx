import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import React, { Suspense } from "react";
import type { Metadata } from "next";

import { EventPageClient } from "@/features/events/components/EventPageClient";
import { DraftPassphraseModal } from "@/features/events/components/DraftPassphraseModal";
import { getMockEventBySlug } from "@/features/events/utils/mock-data";
import { verifyPreviewToken } from "@/features/events/utils/preview-token";
import { getSession } from "@/lib/auth/get-session";
import EventLoading from "./loading";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const event = getMockEventBySlug(slug);

  if (!event) {
    return {
      title: "Event Not Found | VoteSphere",
      description: "The requested voting event could not be found.",
    };
  }

  if (event.operationalState === "Draft") {
    return {
      title: `[Draft Preview] ${event.title} | VoteSphere`,
      description: event.description,
    };
  }

  return {
    title: `${event.title} | Official Contest Voting`,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      images: [{ url: event.bannerUrl }],
    },
  };
}

export default async function EventPage(props: PageProps): Promise<React.JSX.Element> {
  const { slug } = await props.params;
  const event = getMockEventBySlug(slug);

  if (!event) {
    notFound();
  }

  // Draft state authorization gates
  if (event.operationalState === "Draft") {
    const session = await getSession();
    if (session) {
      return (
        <main>
          <Suspense fallback={<EventLoading />}>
            <EventPageClient initialEvent={event} isDraftPreview accessMode="organizer" />
          </Suspense>
        </main>
      );
    }

    const cookieStore = await cookies();
    const previewCookie = cookieStore.get(`vs_preview_${slug}`)?.value;

    if (previewCookie && verifyPreviewToken(previewCookie, slug)) {
      return (
        <main>
          <Suspense fallback={<EventLoading />}>
            <EventPageClient initialEvent={event} isDraftPreview accessMode="guest" />
          </Suspense>
        </main>
      );
    }

    // Unauthenticated guest reviewer without token: render Passphrase unlock prompt
    return (
      <main className="py-12">
        <DraftPassphraseModal slug={slug} />
      </main>
    );
  }

  return (
    <main>
      <Suspense fallback={<EventLoading />}>
        <EventPageClient initialEvent={event} />
      </Suspense>
    </main>
  );
}
