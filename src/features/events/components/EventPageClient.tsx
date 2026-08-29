"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { ContestantGrid } from "./ContestantGrid";
import { DraftPreviewBanner } from "./DraftPreviewBanner";
import { EventBanner } from "./EventBanner";
import { EventCountdown } from "./EventCountdown";
import type { ContestantDto, EventOperationalState, PublicEventDto } from "../types";

export interface EventPageClientProps {
  initialEvent: PublicEventDto;
  isDraftPreview?: boolean;
  accessMode?: "organizer" | "guest";
}

export function EventPageClient({
  initialEvent,
  isDraftPreview = false,
  accessMode = "guest",
}: EventPageClientProps): React.JSX.Element {
  const router = useRouter();
  const [event, setEvent] = useState<PublicEventDto>(initialEvent);

  const handleStateTransition = (): void => {
    // When countdown hits zero, immediately recalculate state and revalidate
    const nextState: EventOperationalState =
      event.operationalState === "Scheduled" ? "Active" : "Closed";

    setEvent((prev) => ({
      ...prev,
      operationalState: nextState,
    }));

    router.refresh();
  };

  const handleSelectCandidate = (candidate: ContestantDto): void => {
    // Voting interaction triggers (to be integrated with payment/vote flow)
    console.warn(`Selected Candidate #${candidate.contestantNumber} - ${candidate.name}`);
  };

  return (
    <div className="bg-background text-foreground min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {(isDraftPreview || event.operationalState === "Draft") && (
          <DraftPreviewBanner accessMode={accessMode} />
        )}

        <EventBanner event={event} />

        <EventCountdown
          operationalState={event.operationalState}
          startsAt={event.startsAt}
          endsAt={event.endsAt}
          serverTime={event.serverTime}
          onStateTransition={handleStateTransition}
        />

        <ContestantGrid
          contestants={event.contestants}
          operationalState={event.operationalState}
          showResultsOnClose={event.showResultsOnClose}
          onSelectCandidate={handleSelectCandidate}
        />
      </div>
    </div>
  );
}
