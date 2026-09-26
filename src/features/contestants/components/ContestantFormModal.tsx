"use client";

import React, { useState } from "react";
import { X, Sparkles, Trash2 } from "lucide-react";
import type {
  ContestantDto,
  ContestantDivision,
  AwardCategoryDto,
  ContestantMediaDto,
  CreateContestantInput,
} from "../types";
import { ImageCropper } from "./ImageCropper";
import { parseVideoEmbedUrl } from "../utils/parse-video-embed";

interface ContestantFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateContestantInput) => Promise<void>;
  categories: AwardCategoryDto[];
  initialData?: ContestantDto | null;
}

export const ContestantFormModal: React.FC<ContestantFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  initialData,
}) => {
  const [contestantNumber, setContestantNumber] = useState<number>(
    initialData?.contestantNumber ?? 1,
  );
  const [name, setName] = useState(initialData?.name ?? "");
  const [division, setDivision] = useState<ContestantDivision>(initialData?.division ?? "FEMALE");
  const [hometown, setHometown] = useState(initialData?.hometown ?? "");
  const [heightCm, setHeightCm] = useState<number | undefined>(initialData?.heightCm ?? undefined);
  const [bio, setBio] = useState(initialData?.bio ?? "");
  const [advocacy, setAdvocacy] = useState(initialData?.advocacy ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatarUrl ?? "");
  const [videoUrl, setVideoUrl] = useState(
    initialData?.media.find((m) => m.mediaType === "VIDEO_EMBED")?.url ?? "",
  );
  const [instagramUrl, setInstagramUrl] = useState(initialData?.instagramUrl ?? "");
  const [tiktokUrl, setTiktokUrl] = useState(initialData?.tiktokUrl ?? "");
  const [facebookUrl, setFacebookUrl] = useState(initialData?.facebookUrl ?? "");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    initialData?.categories.map((c) => c.id) ?? [],
  );
  const [galleryUrls, setGalleryUrls] = useState<string[]>(
    initialData?.media.filter((m) => m.mediaType === "PHOTO").map((m) => m.url) ?? [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleCategory = (catId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId],
    );
  };

  const handleAddCroppedPhoto = (croppedDataUrl: string) => {
    if (!avatarUrl) {
      setAvatarUrl(croppedDataUrl);
    }
    if (galleryUrls.length < 10) {
      setGalleryUrls((prev) => [...prev, croppedDataUrl]);
    } else {
      alert("Maximum of 10 photos reached.");
    }
  };

  const handleRemovePhoto = (index: number) => {
    setGalleryUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Candidate name is required.");
      return;
    }
    if (!avatarUrl && galleryUrls.length === 0) {
      setErrorMsg("Please upload at least one portrait photo.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const mediaPayload: Omit<ContestantMediaDto, "id" | "contestantId">[] = galleryUrls.map(
        (url, idx) => ({
          mediaType: "PHOTO",
          url,
          embedPlatform: "NONE",
          embedId: null,
          displayOrder: idx,
          aspectRatio: "4:5",
          isCover: idx === 0,
        }),
      );

      if (videoUrl.trim()) {
        const parsed = parseVideoEmbedUrl(videoUrl.trim());
        mediaPayload.push({
          mediaType: "VIDEO_EMBED",
          url: videoUrl.trim(),
          embedPlatform: parsed ? parsed.platform : "NONE",
          embedId: parsed ? parsed.embedId : null,
          displayOrder: mediaPayload.length,
          aspectRatio: "9:16",
          isCover: false,
        });
      }

      await onSubmit({
        contestantNumber: Number(contestantNumber),
        name: name.trim(),
        division,
        hometown: hometown.trim() || undefined,
        heightCm: heightCm ? Number(heightCm) : undefined,
        bio: bio.trim() || undefined,
        advocacy: advocacy.trim() || undefined,
        avatarUrl: avatarUrl || galleryUrls[0] || "",
        instagramUrl: instagramUrl.trim() || undefined,
        tiktokUrl: tiktokUrl.trim() || undefined,
        facebookUrl: facebookUrl.trim() || undefined,
        categoryIds: selectedCategoryIds,
        media: mediaPayload,
      });

      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to save contestant.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/60 px-6 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <h3 className="text-lg font-bold text-white">
              {initialData ? "Edit Contestant Profile" : "Register New Contestant"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto p-6">
          {errorMsg && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* Identity Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Candidate Number *
              </label>
              <input
                type="number"
                min={1}
                required
                value={contestantNumber}
                onChange={(e) => setContestantNumber(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-300">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Maria Clara Santos"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">Division *</label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value as ContestantDivision)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              >
                <option value="FEMALE">Female</option>
                <option value="MALE">Male</option>
                <option value="LGBTQ">LGBTQ+</option>
                <option value="TEEN">Teen</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Hometown / Province
              </label>
              <input
                type="text"
                placeholder="e.g. Vigan, Ilocos Sur"
                value={hometown}
                onChange={(e) => setHometown(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">Height (cm)</label>
              <input
                type="number"
                min={50}
                max={250}
                placeholder="e.g. 175"
                value={heightCm ?? ""}
                onChange={(e) => setHeightCm(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Photo Gallery & Cropper */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Photo Gallery (Up to 10 Photos, 4:5 Aspect Ratio)
              </label>
              <span className="text-[11px] text-slate-400">{galleryUrls.length} / 10 added</span>
            </div>

            {/* Display Current Thumbnails */}
            {galleryUrls.length > 0 && (
              <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                {galleryUrls.map((url, i) => (
                  <div
                    key={i}
                    className="group relative aspect-4/5 overflow-hidden rounded-lg border border-white/10 bg-slate-950"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(i)}
                      className="absolute inset-0 flex items-center justify-center bg-rose-950/80 text-rose-300 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 rounded bg-amber-400 px-1 text-[8px] font-bold text-slate-950">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {galleryUrls.length < 10 && (
              <ImageCropper onCropComplete={handleAddCroppedPhoto} aspectRatio={4 / 5} />
            )}
          </div>

          {/* Video Embed */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-300">
              Video Reel URL (YouTube Shorts, TikTok, Instagram Reel, Facebook Video)
            </label>
            <input
              type="url"
              placeholder="https://www.youtube.com/shorts/... or https://tiktok.com/@user/video/..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Advocacy & Bio */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-300">
              Official Advocacy Statement
            </label>
            <textarea
              rows={2}
              maxLength={1000}
              placeholder="Official environmental or cultural advocacy message..."
              value={advocacy}
              onChange={(e) => setAdvocacy(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-300">
              Biography / Fun Facts
            </label>
            <textarea
              rows={3}
              maxLength={1000}
              placeholder="Tell the voters more about the candidate..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Award Categories Assignment */}
          {categories.length > 0 && (
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-300">
                Nominate for Award Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const checked = selectedCategoryIds.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleToggleCategory(cat.id)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        checked
                          ? "border-amber-400 bg-amber-400/20 text-amber-300"
                          : "border-white/10 bg-slate-950 text-slate-400 hover:text-white"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Social Links */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Instagram Handle/URL
              </label>
              <input
                type="text"
                placeholder="@username"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                TikTok Handle/URL
              </label>
              <input
                type="text"
                placeholder="@username"
                value={tiktokUrl}
                onChange={(e) => setTiktokUrl(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Facebook Handle/URL
              </label>
              <input
                type="text"
                placeholder="facebook.com/..."
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-amber-400 px-6 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-amber-300 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : initialData ? "Update Profile" : "Register Contestant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
