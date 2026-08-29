import Image from "next/image";
import React from "react";
import { Calendar, Globe2, Sparkles } from "lucide-react";

import { EventStateBadge } from "./EventStateBadge";
import type { PublicEventDto } from "../types";

export interface EventBannerProps {
  event: PublicEventDto;
}

export function EventBanner({ event }: EventBannerProps): React.JSX.Element {
  const formattedStartsAt = new Date(event.startsAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const formattedEndsAt = new Date(event.endsAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return (
    <header className="border-border/60 bg-card/60 relative w-full overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-xl">
      {/* Banner Backdrop Image */}
      <div className="relative h-72 w-full overflow-hidden md:h-96">
        <Image
          src={event.bannerUrl}
          alt={event.title}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="scale-105 transform object-cover object-center transition-transform duration-700 hover:scale-100"
        />
        {/* Sleek Dark Vignette and Gradient Overlay */}
        <div className="from-background via-background/60 absolute inset-0 bg-gradient-to-t to-transparent" />
        <div className="from-background/80 to-background/40 absolute inset-0 bg-gradient-to-r via-transparent" />
      </div>

      {/* Content Header Container */}
      <div className="relative -mt-24 space-y-6 px-6 pb-8 md:-mt-32 md:px-10">
        <div className="flex flex-wrap items-center gap-3">
          <EventStateBadge state={event.operationalState} />
          <span className="bg-secondary/80 text-secondary-foreground border-border/40 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-md">
            <Globe2 className="text-muted-foreground size-3" />
            vote-sphere.io/events/{event.slug}
          </span>
          <span className="bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium">
            <Sparkles className="text-primary size-3" />
            Official Contest
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-foreground text-3xl font-extrabold tracking-tight drop-shadow-sm md:text-5xl">
            {event.title}
          </h1>
          <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed md:text-base">
            {event.description}
          </p>
        </div>

        <div className="border-border/40 text-muted-foreground flex flex-wrap items-center gap-6 border-t pt-2 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="text-primary size-4" />
            <span>
              <strong className="text-foreground">Opens:</strong> {formattedStartsAt}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="text-primary size-4" />
            <span>
              <strong className="text-foreground">Closes:</strong> {formattedEndsAt}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
