import React from "react";

export default function EventLoading(): React.JSX.Element {
  return (
    <div className="bg-background min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl animate-pulse space-y-8">
        {/* Banner Skeleton */}
        <div className="bg-muted/60 h-80 w-full rounded-3xl" />

        {/* Countdown Skeleton */}
        <div className="bg-muted/40 h-28 w-full rounded-2xl" />

        {/* Contestant Grid Skeleton */}
        <div className="space-y-4">
          <div className="bg-muted/60 h-8 w-48 rounded-lg" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-muted/40 aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
