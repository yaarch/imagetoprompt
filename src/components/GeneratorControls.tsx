import React from "react";
import { Sparkles, SlidersHorizontal, Globe, Wand2 } from "lucide-react";
import { TargetModel, DetailLevel, StyleFocus } from "../types";

interface GeneratorControlsProps {
  targetModel: TargetModel;
  setTargetModel: (m: TargetModel) => void;
  detailLevel: DetailLevel;
  setDetailLevel: (d: DetailLevel) => void;
  styleFocus: StyleFocus;
  setStyleFocus: (s: StyleFocus) => void;
  language: string;
  setLanguage: (l: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  hasImage: boolean;
}

export const GeneratorControls: React.FC<GeneratorControlsProps> = ({
  targetModel,
  setTargetModel,
  detailLevel,
  setDetailLevel,
  styleFocus,
  setStyleFocus,
  language,
  setLanguage,
  onGenerate,
  isLoading,
  hasImage,
}) => {
  const models: { id: TargetModel; name: string; badge: string }[] = [
    { id: "all", name: "All Models", badge: "Universal" },
    { id: "midjourney", name: "Midjourney v6", badge: "Aesthetic" },
    { id: "flux", name: "Flux.1", badge: "Realistic" },
    { id: "stablediffusion", name: "SDXL / SD", badge: "+Negative" },
    { id: "dalle3", name: "DALL-E 3", badge: "Narrative" },
  ];

  const detailLevels: { id: DetailLevel; label: string; desc: string }[] = [
    { id: "detailed", label: "Detailed", desc: "Balanced & descriptive" },
    { id: "cinematic", label: "Cinematic", desc: "Atmosphere & lighting focus" },
    { id: "concise", label: "Concise", desc: "Short & punchy tokens" },
    { id: "keywords", label: "Keywords", desc: "Comma-separated tags" },
  ];

  const styleFoci: { id: StyleFocus; label: string }[] = [
    { id: "all", label: "All Elements" },
    { id: "photorealistic", label: "Photography & Lens" },
    { id: "artistic", label: "Art Style & Painting" },
    { id: "lighting", label: "Lighting & Atmosphere" },
    { id: "character", label: "Subject & Character" },
  ];

  const languages = [
    { code: "en", name: "English (Default)" },
    { code: "es", name: "Spanish (Español)" },
    { code: "fr", name: "French (Français)" },
    { code: "de", name: "German (Deutsch)" },
    { code: "ja", name: "Japanese (日本語)" },
    { code: "zh", name: "Chinese (中文)" },
  ];

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 sm:p-5 shadow-xl space-y-5">
      {/* Target Model Selection */}
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            <SlidersHorizontal className="h-3.5 w-3.5 text-orange-400" />
            <span>Target AI Model</span>
          </label>
          <span className="text-[11px] text-neutral-500">Outputs syntax optimized for each generator</span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {models.map((m) => {
            const isSelected = targetModel === m.id;
            return (
              <button
                key={m.id}
                id={`model-select-${m.id}`}
                type="button"
                onClick={() => setTargetModel(m.id)}
                className={`flex flex-col items-start justify-between rounded-xl border p-2.5 text-left transition-all ${
                  isSelected
                    ? "border-orange-500 bg-orange-500/10 text-white shadow-sm shadow-orange-500/20 ring-1 ring-orange-500/50"
                    : "border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-850 hover:text-neutral-200"
                }`}
              >
                <div className="w-full flex items-center justify-between">
                  <span className="text-xs font-bold leading-none">{m.name}</span>
                  <span
                    className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                      isSelected ? "bg-orange-500 text-white" : "bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    {m.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail Level & Focus Options */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Detail Level */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Prompt Detail
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {detailLevels.map((dl) => (
              <button
                key={dl.id}
                type="button"
                id={`detail-level-${dl.id}`}
                onClick={() => setDetailLevel(dl.id)}
                className={`rounded-lg border px-2.5 py-1.5 text-left transition-colors ${
                  detailLevel === dl.id
                    ? "border-orange-500/80 bg-orange-500/10 text-orange-300 font-medium"
                    : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:bg-neutral-850 hover:text-neutral-300"
                }`}
              >
                <div className="text-xs">{dl.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Style Focus */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Analysis Focus
          </label>
          <select
            id="select-style-focus"
            value={styleFocus}
            onChange={(e) => setStyleFocus(e.target.value as StyleFocus)}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs font-medium text-neutral-200 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            {styleFoci.map((sf) => (
              <option key={sf.id} value={sf.id}>
                {sf.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-[11px] text-neutral-500">
            Emphasizes specific visual characteristics in prompt breakdown
          </p>
        </div>

        {/* Language */}
        <div>
          <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            <Globe className="h-3.5 w-3.5 text-orange-400" />
            <span>Output Language</span>
          </label>
          <select
            id="select-language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs font-medium text-neutral-200 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.name}>
                {l.name}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-[11px] text-neutral-500">
            Extracts prompts and breakdowns in your preferred language
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="pt-2 space-y-2">
        <button
          type="button"
          id="btn-generate-prompt"
          onClick={onGenerate}
          disabled={!hasImage || isLoading}
          className={`flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 px-6 font-semibold shadow-lg transition-all ${
            !hasImage
              ? "cursor-not-allowed border border-neutral-800 bg-neutral-900 text-neutral-500"
              : isLoading
              ? "cursor-wait bg-gradient-to-r from-orange-600 to-amber-600 text-white opacity-85 shadow-orange-500/20"
              : "bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 text-white shadow-orange-500/30 hover:brightness-110 active:scale-[0.99]"
          }`}
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Analyzing Image & Synthesizing Prompts...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Generate Prompts Instantly</span>
              <Wand2 className="h-4 w-4 text-orange-200" />
            </>
          )}
        </button>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          <span>100% Free In-Browser • Works on Cloudflare Pages • No API Key Needed</span>
        </div>
      </div>
    </div>
  );
};
