import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ImageUploader } from "./components/ImageUploader";
import { GeneratorControls } from "./components/GeneratorControls";
import { PromptResults } from "./components/PromptResults";
import { AiRefinerModal } from "./components/AiRefinerModal";
import { HistoryDrawer } from "./components/HistoryDrawer";
import { HowItWorksModal } from "./components/HowItWorksModal";
import {
  TargetModel,
  DetailLevel,
  StyleFocus,
  GeneratedPromptData,
  HistoryItem,
} from "./types";
import {
  loadHistory,
  saveHistoryItem,
  deleteHistoryItem,
} from "./utils";
import { analyzeImageInBrowser } from "./utils/clientVisionEngine";
import {
  Sparkles,
  Layers,
  Wand2,
  Terminal,
  ShieldCheck,
  AlertCircle,
  Zap,
} from "lucide-react";

export default function App() {
  // Image state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("image/jpeg");
  const [imageTitle, setImageTitle] = useState<string>("Uploaded Visual");

  // Options state
  const [targetModel, setTargetModel] = useState<TargetModel>("all");
  const [detailLevel, setDetailLevel] = useState<DetailLevel>("detailed");
  const [styleFocus, setStyleFocus] = useState<StyleFocus>("all");
  const [language, setLanguage] = useState<string>("English (Default)");

  // Generation & Result state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedData, setGeneratedData] = useState<GeneratedPromptData | null>(null);
  const [activeModelTab, setActiveModelTab] = useState<string>("midjourney");

  // History & Modals state
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isRefineOpen, setIsRefineOpen] = useState<boolean>(false);
  const [promptToRefine, setPromptToRefine] = useState<string>("");

  // Load history on initial mount
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to generate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        if (selectedImage && !isLoading) {
          handleGenerate();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, isLoading, targetModel, detailLevel, styleFocus, language]);

  const handleImageSelected = (base64: string, type: string, title?: string) => {
    setSelectedImage(base64);
    setMimeType(type);
    setImageTitle(title || "Uploaded Visual");
    setError(null);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setGeneratedData(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      setError("Please upload or select an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let result: GeneratedPromptData | null = null;

      // 1. First attempt to call the backend endpoint (/api/image-to-prompt)
      try {
        const response = await fetch("/api/image-to-prompt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageBase64: selectedImage,
            mimeType,
            targetModel,
            detailLevel,
            styleFocus,
            language: language.split(" ")[0], // e.g. "English"
          }),
        });

        if (response.ok) {
          const json = await response.json();
          if (json.success && json.data) {
            result = json.data;
          }
        }
      } catch (backendError) {
        console.warn(
          "Backend API unreachable (e.g. static Cloudflare Pages hosting), seamlessly falling back to browser vision engine:",
          backendError
        );
      }

      // 2. If backend is not available (e.g. on Cloudflare Pages static hosting *.pages.dev)
      // run the high-precision client-side canvas vision engine
      if (!result) {
        result = await analyzeImageInBrowser(
          selectedImage,
          targetModel,
          detailLevel,
          styleFocus,
          language
        );
      }

      setGeneratedData(result);

      // Auto-set initial active tab based on selected model
      if (targetModel === "midjourney") setActiveModelTab("midjourney");
      else if (targetModel === "flux") setActiveModelTab("flux");
      else if (targetModel === "stablediffusion") setActiveModelTab("stablediffusion");
      else if (targetModel === "dalle3") setActiveModelTab("dalle3");
      else setActiveModelTab("midjourney");

      // Save to history
      const newHistoryItem: HistoryItem = {
        id: "hist-" + Date.now(),
        timestamp: Date.now(),
        imageUrl: selectedImage,
        title: result.title || imageTitle,
        data: result,
      };
      const updatedHistory = saveHistoryItem(newHistoryItem);
      setHistory(updatedHistory);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while analyzing the image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateActivePrompt = (modelKey: string, newText: string) => {
    if (!generatedData) return;

    const updated = { ...generatedData };
    if (modelKey === "midjourney") {
      updated.midjourney = { ...updated.midjourney, fullPrompt: newText };
    } else if (modelKey === "flux") {
      updated.flux = { ...updated.flux, prompt: newText };
    } else if (modelKey === "stablediffusion") {
      updated.stableDiffusion = { ...updated.stableDiffusion, positivePrompt: newText };
    } else if (modelKey === "dalle3") {
      updated.dalle3 = { ...updated.dalle3, prompt: newText };
    }
    setGeneratedData(updated);
  };

  const handleOpenRefineModal = (text: string) => {
    setPromptToRefine(text);
    setIsRefineOpen(true);
  };

  const handleApplyRefinedPrompt = (refined: string) => {
    handleUpdateActivePrompt(activeModelTab, refined);
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setSelectedImage(item.imageUrl);
    setImageTitle(item.title);
    setGeneratedData(item.data);
    setActiveModelTab("midjourney");
    setError(null);
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = deleteHistoryItem(id);
    setHistory(updated);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Top Navigation */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        historyCount={history.length}
      />

      {/* Hero Banner with Subtitle */}
      <div className="w-full border-b border-neutral-850 bg-radial from-orange-950/20 via-neutral-950 to-neutral-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400 mb-3 shadow-inner">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Multimodal Vision Reverse Prompt Engineering</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-sans">
            Convert Any Image to an <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">AI Prompt</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-neutral-400 leading-relaxed">
            Upload or paste any artwork or photo to reverse-engineer its visual style, lighting, camera gear, and aesthetic into production-ready prompts for Midjourney, Flux.1, Stable Diffusion, and DALL-E.
          </p>
        </div>
      </div>

      {/* Main App Workspace */}
      <main className="flex-1 mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
        {/* Error notification banner if any */}
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300 shadow-lg animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="rounded-md px-2 py-1 text-xs text-rose-400 hover:bg-rose-500/20 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image Uploader & Generator Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-orange-400" />
                  <span>1. Source Image</span>
                </h2>
                {selectedImage && (
                  <span className="text-xs text-emerald-400 font-mono">● Ready to analyze</span>
                )}
              </div>
              <ImageUploader
                selectedImage={selectedImage}
                mimeType={mimeType}
                onImageSelected={handleImageSelected}
                onClear={handleClearImage}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-orange-400" />
                <span>2. Generator Options</span>
              </h2>
              <GeneratorControls
                targetModel={targetModel}
                setTargetModel={setTargetModel}
                detailLevel={detailLevel}
                setDetailLevel={setDetailLevel}
                styleFocus={styleFocus}
                setStyleFocus={setStyleFocus}
                language={language}
                setLanguage={setLanguage}
                onGenerate={handleGenerate}
                isLoading={isLoading}
                hasImage={Boolean(selectedImage)}
              />
            </div>
          </div>

          {/* Right Column: Generated Prompts or Placeholder State */}
          <div className="lg:col-span-7">
            {isLoading ? (
              <div className="flex min-h-[460px] flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40 p-8 text-center shadow-xl">
                <div className="relative flex h-20 w-20 items-center justify-center">
                  <div className="absolute inset-0 animate-ping rounded-full bg-orange-500/20 duration-1000" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30">
                    <Sparkles className="h-7 w-7 text-white animate-pulse" />
                  </div>
                </div>
                <h3 className="mt-6 text-lg font-bold text-white">
                  Deconstructing Visual Elements...
                </h3>
                <p className="mt-1 max-w-sm text-xs text-neutral-400">
                  Gemini Vision is analyzing medium, camera lenses, lighting physics, color palettes, and composing tailored prompts.
                </p>
                <div className="mt-6 flex items-center gap-3 text-xs font-mono text-orange-400/90">
                  <span className="flex h-2 w-2 rounded-full bg-orange-400 animate-ping" />
                  <span>Extracting aesthetic parameters</span>
                </div>
              </div>
            ) : generatedData ? (
              <PromptResults
                data={generatedData}
                activeModelTab={activeModelTab}
                setActiveModelTab={setActiveModelTab}
                onOpenRefineModal={handleOpenRefineModal}
                onUpdateActivePrompt={handleUpdateActivePrompt}
              />
            ) : (
              <div className="flex min-h-[460px] flex-col items-center justify-center rounded-2xl border border-neutral-800/80 bg-neutral-900/30 p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/80 shadow-inner">
                  <Wand2 className="h-8 w-8 text-neutral-500" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-neutral-200">
                  No Image Analyzed Yet
                </h3>
                <p className="mt-1.5 max-w-md text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Upload an image on the left or select any sample image to instantly reverse-engineer its prompt, camera gear, lighting, and parameters.
                </p>

                {/* Feature highlight badges */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-md text-left">
                  <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-3">
                    <Zap className="h-4 w-4 text-orange-400 mb-1" />
                    <h4 className="text-xs font-semibold text-neutral-200">Full Parameters</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Extracts aspect ratio, Midjourney --v 6.1 --stylize, and SD negative prompts.
                    </p>
                  </div>
                  <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-3">
                    <Sparkles className="h-4 w-4 text-amber-400 mb-1" />
                    <h4 className="text-xs font-semibold text-neutral-200">Flux & DALL-E</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Tailored natural-language descriptive prompts for latest diffusion models.
                    </p>
                  </div>
                  <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-3">
                    <ShieldCheck className="h-4 w-4 text-cyan-400 mb-1" />
                    <h4 className="text-xs font-semibold text-neutral-200">100% Private</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Images are never permanently saved or shared with third parties.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-850 bg-neutral-950 py-6 px-4 text-center text-xs text-neutral-500">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Image to Prompt. Reverse AI Vision Prompt Engine.</p>
          <div className="flex items-center gap-4 text-neutral-400">
            <button
              onClick={() => setIsHelpOpen(true)}
              className="hover:text-orange-400 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="hover:text-orange-400 transition-colors"
            >
              Recent History ({history.length})
            </button>
          </div>
        </div>
      </footer>

      {/* AI Refiner / Magic Enhance Modal */}
      <AiRefinerModal
        isOpen={isRefineOpen}
        onClose={() => setIsRefineOpen(false)}
        basePrompt={promptToRefine}
        targetModel={activeModelTab}
        onApplyRefinedPrompt={handleApplyRefinedPrompt}
      />

      {/* History Slide-over Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistory={handleSelectHistoryItem}
        onDeleteHistory={handleDeleteHistoryItem}
      />

      {/* How it works & tips modal */}
      <HowItWorksModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
