import { useQuery } from "@tanstack/react-query";
import type { AwardCategoryDto } from "../types";
import type { ApiResponse } from "@/lib/api/response";

export function useCategories(slug: string) {
  return useQuery({
    queryKey: ["categories", slug],
    queryFn: async (): Promise<AwardCategoryDto[]> => {
      const res = await fetch(`/api/events/${encodeURIComponent(slug)}/categories`);
      if (!res.ok) {
        throw new Error(`Failed to fetch categories: ${res.statusText}`);
      }

      const json: ApiResponse<AwardCategoryDto[]> = await res.json();
      if (!json.success || !json.data) {
        throw new Error(json.error || "Failed to retrieve categories");
      }

      return json.data;
    },
    enabled: Boolean(slug),
    staleTime: 60_000,
  });
}
