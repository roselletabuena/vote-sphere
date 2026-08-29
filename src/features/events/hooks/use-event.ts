"use client";

import { useQuery } from "@tanstack/react-query";

import type { ApiResponse } from "@/lib/api/response";
import type { PublicEventDto } from "../types";

export async function fetchEventBySlug(slug: string): Promise<PublicEventDto> {
  const response = await fetch(`/api/events/${slug}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ApiResponse<never>;
    throw new Error(errorData.error || `Failed to load event: ${response.statusText}`);
  }

  const result = (await response.json()) as ApiResponse<PublicEventDto>;
  if (!result.data) {
    throw new Error("Event payload missing from server response");
  }

  return result.data;
}

export function useEvent(slug: string, initialData?: PublicEventDto) {
  return useQuery({
    queryKey: ["event", slug],
    queryFn: () => fetchEventBySlug(slug),
    initialData,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: (query) => {
      const state = query.state.data?.operationalState;
      // Refetch faster if Active or Scheduled to catch timeline transitions
      return state === "Active" || state === "Scheduled" ? 1000 * 15 : false;
    },
  });
}
