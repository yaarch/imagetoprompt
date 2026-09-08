import React, { useRef, useState, useEffect } from "react";
import { UploadCloud, Image as ImageIcon, X, RefreshCw, Layers } from "lucide-react";
import { PRESET_IMAGES } from "../data/presets";
import { PresetImage } from "../types";
import { fileToBase64, urlToBase64 } from "../utils";

interface ImageUploaderProps {
  selectedImage: string | null;
  mimeType: string;
  onImageSelected: (base64: string, mimeType: string, title?: string, autoAnalyze?: boolean) => void;
  onClear: () => void;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  selectedImage,
  onImageSelected,
  onClear,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loadingPresetId, setLoadingPresetId] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<{ width: number; height: number; ratio: string } | null>(null);

  // Measure image dimensions when selected
  useEffect(() => {
    if (!selectedImage) {
      setImageMeta(null);
      return;
    }
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const r = (w / h).toFixed(2);
      let ratioStr = `${w} × ${h}`;
      if (Math.abs(w / h - 16 / 9) < 0.1) ratioStr += " (16:9)";
      else if (Math.abs(w / h - 1) < 0.05) ratioStr += " (1:1)";
      else if (Math.abs(w / h - 4 / 5) < 0.05) ratioStr += " (4:5)";
      else if (Math.abs(w / h - 9 / 16) < 0.1) ratioStr += " (9:16)";
      else if (Math.abs(w / h - 3 / 2) < 0.05) ratioStr += " (3:2)";
      setImageMeta({ width: w, height: h, ratio: ratioStr });
    };
    img.src = selectedImage;
  }, [selectedImage]);

  // Global paste handler
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      if (disabled) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            try {
              const { base64, mimeType } = await fileToBase64(file);
              onImageSelected(base64, mimeType, "Pasted Image");
            } catch (err) {
              console.error("Failed to parse pasted image", err);
            }
          }
          break;
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [disabled, onImageSelected]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      try {
        const { base64, mimeType } = await fileToBase64(file);
        onImageSelected(base64, mimeType, file.name);
      } catch (err) {
        console.error("Error reading file", err);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        try {
          const { base64, mimeType } = await fileToBase64(file);
          onImageSelected(base64, mimeType, file.name);
        } catch (err) {
          console.error("Error reading dropped file", err);
        }
      }
    }
  };

  const handleSelectPreset = async (preset: PresetImage) => {
    if (disabled) return;
    try {
      setLoadingPresetId(preset.id);
      const { base64, mimeType } = await urlToBase64(preset.thumbnailUrl);
      onImageSelected(base64, mimeType, preset.title, true);
    } catch (err) {
      console.error("Failed to load preset image", err);
    } finally {
      setLoadingPresetId(null);
    }
  };

  return (
    <div className="w-full space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Main Upload Dropzone or Preview */}
      {!selectedImage ? (
        <div
          id="dropzone-area"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`group relative flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
            isDragging
              ? "border-orange-500 bg-orange-500/10 scale-[0.99]"
              : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-900/70"
          }`}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900 shadow-inner group-hover:border-orange-500/40 group-hover:bg-neutral-850 transition-colors">
            <UploadCloud className="h-8 w-8 text-neutral-400 group-hover:text-orange-400 transition-colors" />
          </div>

          <div className="mt-4 space-y-1">
            <p className="text-base font-semibold text-neutral-200 group-hover:text-white">
              Drag and drop an image, or{" "}
              <span className="text-orange-400 underline underline-offset-2">browse</span>
            </p>
            <p className="text-xs text-neutral-500">
              Supports JPG, PNG, WEBP up to 25MB • You can also <kbd className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] text-neutral-300">Ctrl+V</kbd> / <kbd className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] text-neutral-300">⌘+V</kbd> to paste
            </p>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/70 p-3 shadow-xl">
          <div className="relative flex flex-col items-center justify-center rounded-xl bg-neutral-950/90 p-2 sm:p-4">
            <img
              src={selectedImage}
              alt="Source preview"
              className="max-h-[340px] w-auto max-w-full rounded-lg object-contain shadow-md"
            />

            {/* Quick Actions Overlay */}
            <div className="absolute right-3 top-3 flex items-center gap-2">
              <button
                type="button"
                id="btn-change-image"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-700/80 bg-neutral-900/90 px-3 py-1.5 text-xs font-medium text-neutral-200 backdrop-blur hover:bg-neutral-800 hover:text-white transition-colors"
                title="Change image"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Replace</span>
              </button>
              <button
                type="button"
                id="btn-clear-image"
                onClick={onClear}
                disabled={disabled}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-700/80 bg-neutral-900/90 text-neutral-300 backdrop-blur hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Dimensions badge */}
            {imageMeta && (
              <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-md bg-neutral-900/90 px-2.5 py-1 text-[11px] font-mono text-neutral-400 backdrop-blur border border-neutral-800">
                <ImageIcon className="h-3.5 w-3.5 text-orange-400" />
                <span>{imageMeta.ratio}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preset Gallery Section */}
      <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-3 sm:p-4">
        <div className="mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-400">
            <Layers className="h-3.5 w-3.5 text-orange-400" />
            <span>Or try with curated sample visuals:</span>
          </div>
          <span className="text-[11px] text-neutral-500">1-click test</span>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {PRESET_IMAGES.map((preset) => {
            const isLoading = loadingPresetId === preset.id;
            return (
              <button
                key={preset.id}
                id={`preset-${preset.id}`}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                disabled={disabled || isLoading}
                className="group relative flex flex-col overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 text-left transition-all hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
                  <img
                    src={preset.thumbnailUrl}
                    alt={preset.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs">
                      <RefreshCw className="h-4 w-4 animate-spin text-orange-400" />
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 py-0.5 text-[9px] font-mono text-neutral-300 backdrop-blur-xs">
                    {preset.category}
                  </span>
                </div>
                <div className="p-1.5">
                  <p className="truncate text-[11px] font-medium text-neutral-300 group-hover:text-white">
                    {preset.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
