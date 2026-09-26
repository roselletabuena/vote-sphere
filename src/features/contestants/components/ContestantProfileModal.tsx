"use client";

import React, { useState } from "react";
import { X, Sparkles, MapPin, Ruler, Heart, Video, Image as ImageIcon } from "lucide-react";
import type { ContestantDto } from "../types";
import { PhotoGalleryCarousel } from "./PhotoGalleryCarousel";
import { VideoReelPlayer } from "./VideoReelPlayer";

const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface ContestantProfileModalProps {
  contestant: ContestantDto | null;
  isOpen: boolean;
  onClose: () => void;
  onVoteClick?: ((contestant: ContestantDto) => void) | undefined;
}

export const ContestantProfileModal: React.FC<ContestantProfileModalProps> = ({
  contestant,
  isOpen,
  onClose,
  onVoteClick,
}) => {
  const [activeMediaTab, setActiveMediaTab] = useState<"photos" | "video">("photos");

  if (!isOpen || !contestant) return null;

  const videoMedia = contestant.media.find((m) => m.mediaType === "VIDEO_EMBED");
  const photosMedia = contestant.media.filter((m) => m.mediaType === "PHOTO");

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/60 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-sm font-bold text-amber-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Candidate #{String(contestant.contestantNumber).padStart(2, "0")}</span>
            </div>
            <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium text-slate-300 capitalize">
              {contestant.division.toLowerCase()} Division
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="grid scrollbar-thin scrollbar-thumb-white/20 grid-cols-1 gap-6 overflow-y-auto p-6 md:grid-cols-12">
          {/* Left Column: Visual Media Showcase (Carousel or Video Reel) */}
          <div className="flex flex-col gap-3 md:col-span-6">
            {/* Media Selector Tabs (if both photos and video exist) */}
            {videoMedia && (
              <div className="flex items-center rounded-xl border border-white/10 bg-slate-950/80 p-1">
                <button
                  type="button"
                  onClick={() => setActiveMediaTab("photos")}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                    activeMediaTab === "photos"
                      ? "bg-amber-500 text-slate-950 shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span>Photos ({photosMedia.length || 1})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMediaTab("video")}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                    activeMediaTab === "video"
                      ? "bg-rose-500 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Video className="h-3.5 w-3.5" />
                  <span>Video Reel</span>
                </button>
              </div>
            )}

            {/* Display Active Media Tab */}
            {activeMediaTab === "video" && videoMedia ? (
              <VideoReelPlayer media={videoMedia} candidateName={contestant.name} />
            ) : (
              <PhotoGalleryCarousel
                media={
                  photosMedia.length > 0
                    ? photosMedia
                    : [
                        {
                          id: "cov",
                          mediaType: "PHOTO",
                          url: contestant.avatarUrl,
                          embedPlatform: "NONE",
                          displayOrder: 0,
                          aspectRatio: "4:5",
                          isCover: true,
                        },
                      ]
                }
                candidateName={contestant.name}
              />
            )}
          </div>

          {/* Right Column: Candidate Dossier & Biography */}
          <div className="flex flex-col justify-between gap-6 md:col-span-6">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                  {contestant.name}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                  {contestant.hometown && (
                    <div className="flex items-center gap-1 text-slate-300">
                      <MapPin className="h-3.5 w-3.5 text-amber-400" />
                      <span>{contestant.hometown}</span>
                    </div>
                  )}
                  {contestant.heightCm && (
                    <div className="flex items-center gap-1 font-mono text-slate-300">
                      <Ruler className="h-3.5 w-3.5 text-amber-400" />
                      <span>{contestant.heightCm} cm</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Award Categories */}
              {contestant.categories.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                    Nominated Award Categories
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {contestant.categories.map((cat) => (
                      <span
                        key={cat.id}
                        className="rounded-lg border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-300"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Advocacy Statement */}
              {contestant.advocacy && (
                <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
                  <h4 className="mb-1.5 flex items-center gap-1 text-xs font-bold tracking-wider text-amber-400 uppercase">
                    <Sparkles className="h-3 w-3" />
                    <span>Official Advocacy</span>
                  </h4>
                  <p className="font-serif text-sm leading-relaxed text-slate-200 italic">
                    &ldquo;{contestant.advocacy}&rdquo;
                  </p>
                </div>
              )}

              {/* Biography Details */}
              {contestant.bio && (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                    About Candidate
                  </span>
                  <p className="text-sm leading-relaxed whitespace-pre-line text-slate-300">
                    {contestant.bio}
                  </p>
                </div>
              )}

              {/* Verified Social Media Channels */}
              {(contestant.instagramUrl || contestant.tiktokUrl || contestant.facebookUrl) && (
                <div className="flex flex-col gap-2 border-t border-white/5 pt-2">
                  <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                    Official Social Channels
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {contestant.instagramUrl && (
                      <a
                        href={contestant.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-lg border border-pink-500/30 bg-linear-to-r from-purple-500/20 to-pink-500/20 px-3 py-1.5 text-xs font-medium text-pink-300 transition-all hover:brightness-125"
                      >
                        <InstagramIcon className="h-3.5 w-3.5" />
                        <span>Instagram</span>
                      </a>
                    )}
                    {contestant.tiktokUrl && (
                      <a
                        href={contestant.tiktokUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition-all hover:bg-white/10"
                      >
                        <span className="text-xs font-bold">TikTok</span>
                      </a>
                    )}
                    {contestant.facebookUrl && (
                      <a
                        href={contestant.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300 transition-all hover:bg-blue-500/20"
                      >
                        <span className="text-xs font-bold">Facebook</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Modal CTA Bar */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <div>
                <span className="text-xs text-slate-400">Current Standing</span>
                <p className="text-lg font-bold text-amber-400">
                  {contestant.voteCount.toLocaleString()}{" "}
                  <span className="text-xs font-normal text-slate-400">Votes</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onVoteClick) onVoteClick(contestant);
                }}
                className="flex items-center gap-2 rounded-xl bg-linear-to-r from-amber-500 via-amber-400 to-amber-600 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <Heart className="h-4 w-4 fill-slate-950" />
                <span>Vote for {contestant.name.split(" ")[0]}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
