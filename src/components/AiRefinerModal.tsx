import React, { useState } from "react";
import { X, Wand2, Sparkles, Check } from "lucide-react";
import { refinePromptInBrowser } from "../utils/clientVisionEngine";

interface AiRefinerModalProps {
  isOpen: boolean;
  onClose: () => void;
  basePrompt: string;
  targetModel: string;
  onApplyRefinedPrompt: (newPrompt: string) => void;
}

export const AiRefinerModal: React.FC<AiRefinerModalProps> = ({
  isOpen,
  onClose,
  basePrompt,
  targetModel,
  onApplyRefinedPrompt,
}) => {
  const [instruction, setInstruction] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [result, setResult] = useState<{ refinedPrompt: string; changesMade: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPresets = [
    "Transform into cyberpunk neon rain at twilight",
    "Change style to Studio Ghibli whimsical watercolor",
    "Add dramatic cinematic lighting with 35mm lens & anamorphic bokeh",
    "Convert into vintage 1970s film photograph with grain and warm tint",
    "Make it a hyper-detailed Unreal Engine 5 3D render",
  ];

  const handleRefine = async (customInstruction?: string) => {
    const textToRun = customInstruction || instruction;
    if (!textToRun.trim()) return;

    setIsRefining(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/refine-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          basePrompt,
          instruction: textToRun,
          targetModel,
        }),
      });

      if (!res.ok) {
        // Fallback for static hosts like Cloudflare Pages
        const clientResult = refinePromptInBrowser(basePrompt, textToRun, targetModel);
        setResult(clientResult);
        return;
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to refine prompt");
      }
      setResult(data.data);
    } catch {
      // If network fails (e.g. static Cloudflare Pages hosting), run in-browser
      const clientResult = refinePromptInBrowser(basePrompt, textToRun, targetModel);
      setResult(clientResult);
    } finally {
      setIsRefining(false);
    }
  };

  const handleApply = () => {
    if (result) {
      onApplyRefinedPrompt(result.refinedPrompt);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400">
              <Wand2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Edit with AI</h3>
              <p className="text-xs text-neutral-400">
                Describe desired changes to tune or transform the prompt
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Prompt preview */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-neutral-400">
            Original Prompt
          </label>
          <div className="max-h-24 overflow-y-auto rounded-lg border border-neutral-800 bg-neutral-950 p-2.5 font-mono text-xs text-neutral-300">
            {basePrompt}
          </div>
        </div>

        {/* Quick presets */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-400">
            Quick Magic Enhancements:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {quickPresets.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setInstruction(preset);
                  handleRefine(preset);
                }}
                className="rounded-md border border-neutral-800 bg-neutral-950/80 px-2.5 py-1 text-[11px] text-neutral-300 hover:border-orange-500 hover:text-orange-300 transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Custom instruction input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-400">
            Or type your custom instruction:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRefine()}
              placeholder="e.g. Add golden hour backlighting, remove neon, make it painterly"
              className="flex-1 rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-200 placeholder-neutral-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <button
              type="button"
              id="btn-run-refine"
              onClick={() => handleRefine()}
              disabled={isRefining || !instruction.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 transition-colors"
            >
              {isRefining ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span>Refine</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Refined Result */}
        {result && (
          <div className="space-y-3 rounded-xl border border-orange-500/30 bg-orange-500/5 p-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                Refined Prompt
              </span>
              <span className="text-[11px] text-neutral-400 italic">
                {result.changesMade}
              </span>
            </div>
            <p className="rounded-lg bg-neutral-950 p-3 font-mono text-xs sm:text-sm text-neutral-200 leading-relaxed">
              {result.refinedPrompt}
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-neutral-800 px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-apply-refined-prompt"
                onClick={handleApply}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Apply to Active Prompt</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
