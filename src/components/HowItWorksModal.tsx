import React from "react";
import { X, Sparkles, HelpCircle, Terminal, Sliders, ShieldCheck, Zap } from "lucide-react";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400">
              <HelpCircle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">How Image to Prompt Works</h3>
              <p className="text-xs text-neutral-400">
                Reverse engineering visual aesthetics into AI generation prompts
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

        {/* Core Explanations */}
        <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
            <h4 className="flex items-center gap-1.5 font-bold text-orange-400 text-sm">
              <Sparkles className="h-4 w-4" />
              <span>What is Reverse Prompt Engineering?</span>
            </h4>
            <p>
              Image to Prompt analyzes any picture using high-precision computer vision and artificial intelligence to extract its subject, lighting conditions, artistic style, medium, camera lenses, color palettes, and emotional atmosphere. It converts these elements into optimal prompts tailored for Midjourney, Flux.1, Stable Diffusion, and DALL-E.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5 space-y-1.5">
              <h5 className="flex items-center gap-1.5 font-semibold text-white">
                <Terminal className="h-4 w-4 text-orange-400" />
                <span>Midjourney v6</span>
              </h5>
              <p className="text-xs text-neutral-400">
                Uses comma-separated sensory descriptors, artistic movements, camera lenses (e.g. 85mm f/1.4), film stocks, and automated parameters like <code className="text-orange-300">--ar 16:9 --v 6.1 --stylize 250</code>.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5 space-y-1.5">
              <h5 className="flex items-center gap-1.5 font-semibold text-white">
                <Zap className="h-4 w-4 text-amber-400" />
                <span>Flux.1</span>
              </h5>
              <p className="text-xs text-neutral-400">
                Flux thrives on rich, natural language sentences depicting real-world textures, lighting bounce, and nuanced spatial arrangements rather than isolated keyword spam.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5 space-y-1.5">
              <h5 className="flex items-center gap-1.5 font-semibold text-white">
                <Sliders className="h-4 w-4 text-emerald-400" />
                <span>Stable Diffusion / SDXL</span>
              </h5>
              <p className="text-xs text-neutral-400">
                Produces an emphasis-weighted positive prompt, accompanied by a targeted negative prompt and recommended sampler/CFG/step values to prevent artifacts.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5 space-y-1.5">
              <h5 className="flex items-center gap-1.5 font-semibold text-white">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
                <span>Privacy First</span>
              </h5>
              <p className="text-xs text-neutral-400">
                Uploaded images are streamed directly into the vision model in memory and are never retained, sold, or shared on server disks.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-orange-500 px-5 py-2 text-xs font-semibold text-white hover:bg-orange-600 transition-colors"
          >
            Got it, Let's Prompt!
          </button>
        </div>
      </div>
    </div>
  );
};
