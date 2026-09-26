"use client";

import React from "react";
import { Award, Users } from "lucide-react";
import type { ContestantDivision, AwardCategoryDto } from "../types";

interface CategoryFilterBarProps {
  selectedDivision: ContestantDivision | "ALL";
  onSelectDivision: (division: ContestantDivision | "ALL") => void;
  categories: AwardCategoryDto[];
  selectedCategoryId: string | "ALL";
  onSelectCategory: (categoryId: string | "ALL") => void;
}

const DIVISIONS: { label: string; value: ContestantDivision | "ALL" }[] = [
  { label: "All Candidates", value: "ALL" },
  { label: "Female", value: "FEMALE" },
  { label: "Male", value: "MALE" },
  { label: "LGBTQ+", value: "LGBTQ" },
  { label: "Teen", value: "TEEN" },
];

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedDivision,
  onSelectDivision,
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Primary Division Pill Tabs */}
      <div className="flex scrollbar-none items-center gap-2 overflow-x-auto pb-1">
        <div className="mr-1 flex shrink-0 items-center gap-1.5 text-xs font-semibold text-slate-400">
          <Users className="h-3.5 w-3.5 text-amber-400" />
          <span>Division:</span>
        </div>
        {DIVISIONS.map((div) => {
          const isSelected = selectedDivision === div.value;
          return (
            <button
              key={div.value}
              type="button"
              onClick={() => onSelectDivision(div.value)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                isSelected
                  ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {div.label}
            </button>
          );
        })}
      </div>

      {/* Award Category Filter Track */}
      {categories.length > 0 && (
        <div className="flex scrollbar-none items-center gap-2 overflow-x-auto pb-1">
          <div className="mr-1 flex shrink-0 items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Award className="h-3.5 w-3.5 text-amber-400" />
            <span>Award Track:</span>
          </div>
          <button
            type="button"
            onClick={() => onSelectCategory("ALL")}
            className={`shrink-0 rounded-lg px-3 py-1 text-xs font-medium transition-all ${
              selectedCategoryId === "ALL"
                ? "border border-amber-400/40 bg-slate-800 text-amber-300 shadow-sm"
                : "border border-white/5 bg-slate-900/40 text-slate-400 hover:text-white"
            }`}
          >
            All Awards
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`shrink-0 rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                  isSelected
                    ? "border border-amber-400/50 bg-amber-400/20 text-amber-300 shadow-sm"
                    : "border border-white/5 bg-slate-900/40 text-slate-400 hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
