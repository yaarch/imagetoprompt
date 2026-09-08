import React, { useState } from "react";
import {
  Copy,
  Check,
  Wand2,
  Download,
  Terminal,
  Palette,
  Camera,
  Sun,
  Eye,
  Sparkles,
  Sliders,
  FileText,
  Tag,
  Share2,
} from "lucide-react";
import { GeneratedPromptData, TargetModel } from "../types";
import { STYLE_TAGS } from "../data/presets";
import { exportPromptAsTxt, exportPromptAsJson } from "../utils";

interface PromptResultsProps {
  data: GeneratedPromptData;
  activeModelTab: string;
  setActiveModelTab: (tab: string) => void;
  onOpenRefineModal: (promptToRefine: string) => void;
  onUpdateActivePrompt: (model: string, newText: string) => void;
}

export const PromptResults: React.FC<PromptResultsProps> = ({
  data,
  activeModelTab,
  setActiveModelTab,
  onOpenRefineModal,
  onUpdateActivePrompt,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeVariationIndex, setActiveVariationIndex] = useState(0);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const handleAppendTag = (tag: string) => {
    let current = "";
    if (activeModelTab === "midjourney") current = data.midjourney.fullPrompt;
    else if (activeModelTab === "flux") current = data.flux.prompt;
    else if (activeModelTab === "stablediffusion") current = data.stableDiffusion.positivePrompt;
    else if (activeModelTab === "dalle3") current = data.dalle3.prompt;
    else return;

    // Avoid double appending
    if (current.includes(tag)) return;

    const separator = tag.startsWith("--") ? " " : ", ";
    const updated = current.trim() + separator + tag;
    onUpdateActivePrompt(activeModelTab, updated);
  };

  const tabs = [
    { id: "midjourney", label: "Midjourney v6", icon: Terminal, badge: "Parameters" },
    { id: "flux", label: "Flux.1", icon: Sparkles, badge: "Natural" },
    { id: "stablediffusion", label: "Stable Diffusion", icon: Sliders, badge: "+Negative" },
    { id: "dalle3", label: "DALL-E 3", icon: Eye, badge: "Narrative" },
    { id: "breakdown", label: "Visual Breakdown", icon: Palette, badge: "Analysis" },
    { id: "variations", label: "Variations", icon: Wand2, badge: "3 Styles" },
  ];

  const getActivePromptForRefine = () => {
    if (activeModelTab === "midjourney") return data.midjourney.fullPrompt;
    if (activeModelTab === "flux") return data.flux.prompt;
    if (activeModelTab === "stablediffusion") return data.stableDiffusion.positivePrompt;
    if (activeModelTab === "dalle3") return data.dalle3.prompt;
    if (activeModelTab === "variations") return data.variations[activeVariationIndex]?.prompt || "";
    return data.midjourney.fullPrompt;
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 sm:p-6 shadow-xl space-y-5">
      {/* Title & Summary */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800/80 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {data.title}
            </h2>
            <span className="rounded-md border border-neutral-700 bg-neutral-800 px-2 py-0.5 text-xs font-mono text-neutral-300">
              {data.aspectRatio}
            </span>
            {data.provider && (
              <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                {data.provider}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs sm:text-sm text-neutral-400 max-w-2xl">
            {data.summary}
          </p>
        </div>

        {/* Global actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            id="btn-edit-with-ai"
            onClick={() => onOpenRefineModal(getActivePromptForRefine())}
            className="flex items-center gap-1.5 rounded-lg border border-orange-500/40 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-300 hover:bg-orange-500/20 hover:text-white transition-colors"
          >
            <Wand2 className="h-3.5 w-3.5" />
            <span>Edit with AI</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              id="btn-download-txt"
              onClick={() => exportPromptAsTxt(data)}
              className="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
              title="Download all prompts as TXT"
            >
              <FileText className="h-3.5 w-3.5 text-neutral-400" />
              <span>TXT</span>
            </button>
            <button
              type="button"
              id="btn-download-json"
              onClick={() => exportPromptAsJson(data)}
              className="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
              title="Download structured JSON"
            >
              <Download className="h-3.5 w-3.5 text-neutral-400" />
              <span>JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tags Row */}
      {data.tags && data.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <Tag className="h-3.5 w-3.5 text-neutral-500 mr-0.5" />
          {data.tags.map((tag, idx) => (
            <span
              key={idx}
              className="rounded-md border border-neutral-800 bg-neutral-950/70 px-2 py-0.5 text-[11px] font-medium text-neutral-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Tabs Header */}
      <div className="flex overflow-x-auto border-b border-neutral-800 scrollbar-none gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeModelTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              type="button"
              onClick={() => setActiveModelTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
                isActive
                  ? "border-orange-500 text-orange-400 bg-orange-500/5"
                  : "border-transparent text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              <span
                className={`hidden sm:inline-block rounded px-1.5 py-0.2 text-[10px] font-semibold ${
                  isActive ? "bg-orange-500/20 text-orange-300" : "bg-neutral-800 text-neutral-500"
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="min-h-[220px]">
        {/* 1. MIDJOURNEY */}
        {activeModelTab === "midjourney" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-300">Prompt + Parameters</span>
                <span className="rounded bg-neutral-800 px-2 py-0.5 text-[10px] font-mono text-orange-400">
                  {data.midjourney.parameters}
                </span>
              </div>
              <button
                type="button"
                id="btn-copy-midjourney"
                onClick={() => handleCopy(data.midjourney.fullPrompt, "mj")}
                className="flex items-center gap-1.5 rounded-lg border border-orange-500/40 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-300 hover:bg-orange-500 hover:text-white transition-all shadow-sm"
              >
                {copiedKey === "mj" ? <Check className="h-3.5 w-3.5 text-white" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === "mj" ? "Copied to Clipboard!" : "Copy Full Prompt"}</span>
              </button>
            </div>

            <div className="relative">
              <textarea
                value={data.midjourney.fullPrompt}
                onChange={(e) => onUpdateActivePrompt("midjourney", e.target.value)}
                rows={5}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-4 font-mono text-xs sm:text-sm text-neutral-200 leading-relaxed focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="Midjourney prompt..."
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-500">
              <span>Ready to paste directly into Discord <kbd className="rounded bg-neutral-800 px-1 text-neutral-400">/imagine</kbd> command</span>
              <span>Parameters automatically matched from image</span>
            </div>
          </div>
        )}

        {/* 2. FLUX.1 */}
        {activeModelTab === "flux" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-300">Flux.1 Natural Language Prompt</span>
                <span className="text-[11px] text-neutral-400">({data.flux.recommendedSettings})</span>
              </div>
              <button
                type="button"
                id="btn-copy-flux"
                onClick={() => handleCopy(data.flux.prompt, "flux")}
                className="flex items-center gap-1.5 rounded-lg border border-orange-500/40 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-300 hover:bg-orange-500 hover:text-white transition-all shadow-sm"
              >
                {copiedKey === "flux" ? <Check className="h-3.5 w-3.5 text-white" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === "flux" ? "Copied!" : "Copy Prompt"}</span>
              </button>
            </div>

            <textarea
              value={data.flux.prompt}
              onChange={(e) => onUpdateActivePrompt("flux", e.target.value)}
              rows={5}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-xs sm:text-sm text-neutral-200 leading-relaxed focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="Flux prompt..."
            />

            <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-2.5 text-xs text-neutral-400 flex items-center justify-between">
              <span>💡 <strong>Flux Pro Tip:</strong> Flux responds best to rich conversational descriptions rather than stacked comma tags.</span>
            </div>
          </div>
        )}

        {/* 3. STABLE DIFFUSION */}
        {activeModelTab === "stablediffusion" && (
          <div className="space-y-4">
            {/* Positive Prompt */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Positive Prompt
                </span>
                <button
                  type="button"
                  id="btn-copy-sd-positive"
                  onClick={() => handleCopy(data.stableDiffusion.positivePrompt, "sd-pos")}
                  className="flex items-center gap-1 rounded-md border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-xs font-medium text-neutral-300 hover:text-white"
                >
                  {copiedKey === "sd-pos" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedKey === "sd-pos" ? "Copied" : "Copy Positive"}</span>
                </button>
              </div>
              <textarea
                value={data.stableDiffusion.positivePrompt}
                onChange={(e) => onUpdateActivePrompt("stablediffusion", e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 font-mono text-xs text-neutral-200 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Negative Prompt */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                  Negative Prompt
                </span>
                <button
                  type="button"
                  id="btn-copy-sd-negative"
                  onClick={() => handleCopy(data.stableDiffusion.negativePrompt, "sd-neg")}
                  className="flex items-center gap-1 rounded-md border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-xs font-medium text-neutral-300 hover:text-white"
                >
                  {copiedKey === "sd-neg" ? <Check className="h-3 w-3 text-rose-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedKey === "sd-neg" ? "Copied" : "Copy Negative"}</span>
                </button>
              </div>
              <textarea
                value={data.stableDiffusion.negativePrompt}
                readOnly
                rows={2}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 p-3 font-mono text-xs text-neutral-400"
              />
            </div>

            {/* Recommended settings pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
              <div className="rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-neutral-300">
                Sampler: <span className="text-orange-400">{data.stableDiffusion.sampler}</span>
              </div>
              <div className="rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-neutral-300">
                Steps: <span className="text-orange-400">{data.stableDiffusion.steps}</span>
              </div>
              <div className="rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-neutral-300">
                CFG Scale: <span className="text-orange-400">{data.stableDiffusion.cfgScale}</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. DALL-E 3 */}
        {activeModelTab === "dalle3" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-300">DALL-E 3 Narrative Prompt</span>
              <button
                type="button"
                id="btn-copy-dalle3"
                onClick={() => handleCopy(data.dalle3.prompt, "dalle")}
                className="flex items-center gap-1.5 rounded-lg border border-orange-500/40 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-300 hover:bg-orange-500 hover:text-white transition-all"
              >
                {copiedKey === "dalle" ? <Check className="h-3.5 w-3.5 text-white" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === "dalle" ? "Copied!" : "Copy Prompt"}</span>
              </button>
            </div>

            <textarea
              value={data.dalle3.prompt}
              onChange={(e) => onUpdateActivePrompt("dalle3", e.target.value)}
              rows={5}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-xs sm:text-sm text-neutral-200 leading-relaxed focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        )}

        {/* 5. VISUAL BREAKDOWN */}
        {activeModelTab === "breakdown" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 mb-1.5">
                <Eye className="h-4 w-4" />
                <span>Primary Subject</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">{data.elements.subject}</p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 mb-1.5">
                <Palette className="h-4 w-4" />
                <span>Art Style & Medium</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                <strong>{data.elements.medium}:</strong> {data.elements.artStyle}
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 mb-1.5">
                <Sun className="h-4 w-4" />
                <span>Lighting & Atmosphere</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">{data.elements.lighting}</p>
              <p className="mt-1 text-xs text-neutral-400 italic">Mood: {data.elements.moodAndAtmosphere}</p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 mb-1.5">
                <Camera className="h-4 w-4" />
                <span>Camera, Angle & Framing</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {data.elements.cameraAndComposition}
              </p>
              {data.elements.texturesAndMaterials && (
                <p className="mt-1 text-xs text-neutral-400">
                  Textures: {data.elements.texturesAndMaterials}
                </p>
              )}
            </div>

            {/* Color Swatches */}
            {data.elements.colorPalette && data.elements.colorPalette.length > 0 && (
              <div className="md:col-span-2 rounded-xl border border-neutral-800 bg-neutral-950 p-3.5">
                <span className="text-xs font-semibold text-orange-400 block mb-2">
                  Dominant Color Palette
                </span>
                <div className="flex flex-wrap gap-2">
                  {data.elements.colorPalette.map((color, i) => {
                    const isHex = color.startsWith("#");
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleCopy(color, `color-${i}`)}
                        className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs text-neutral-300 hover:border-neutral-700 transition-colors"
                        title="Click to copy color"
                      >
                        {isHex && (
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-neutral-700"
                            style={{ backgroundColor: color }}
                          />
                        )}
                        <span className="font-mono">{color}</span>
                        {copiedKey === `color-${i}` && <Check className="h-3 w-3 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. VARIATIONS */}
        {activeModelTab === "variations" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {data.variations.map((v, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveVariationIndex(index)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    activeVariationIndex === index
                      ? "border-orange-500 bg-orange-500/20 text-orange-300"
                      : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white"
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>

            {data.variations[activeVariationIndex] && (
              <div className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-950 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400 italic">
                    {data.variations[activeVariationIndex].description}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(data.variations[activeVariationIndex].prompt, "var-copy")
                    }
                    className="flex items-center gap-1 text-xs font-medium text-orange-400 hover:text-orange-300"
                  >
                    {copiedKey === "var-copy" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>Copy</span>
                  </button>
                </div>
                <p className="font-mono text-xs sm:text-sm text-neutral-200 leading-relaxed">
                  {data.variations[activeVariationIndex].prompt}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Style Modifiers (Appendable pills) */}
      <div className="border-t border-neutral-800/80 pt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-400">
            Quick Style Modifiers (Click to append into active prompt):
          </span>
          <span className="text-[11px] text-neutral-500">Instant fine-tuning</span>
        </div>

        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
          {STYLE_TAGS.flatMap((g) => g.tags).map((tag, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAppendTag(tag)}
              className="rounded-md border border-neutral-800 bg-neutral-900/90 px-2 py-1 text-[11px] font-mono text-neutral-400 transition-colors hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-300"
              title={`Append "${tag}"`}
            >
              + {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
