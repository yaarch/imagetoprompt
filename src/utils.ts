import { GeneratedPromptData, HistoryItem } from "./types";

export async function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const mimeType = file.type || "image/jpeg";
      resolve({ base64: result, mimeType });
    };
    reader.onerror = (error) => reject(error);
  });
}

export async function urlToBase64(url: string): Promise<{ base64: string; mimeType: string }> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Fetch failed");
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        const result = reader.result as string;
        resolve({ base64: result, mimeType: blob.type || "image/jpeg" });
      };
      reader.onerror = (error) => reject(error);
    });
  } catch {
    // If CORS or network blocks direct blob fetch, load via Image object
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || 800;
          canvas.height = img.naturalHeight || 600;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
            resolve({ base64: dataUrl, mimeType: "image/jpeg" });
            return;
          }
        } catch {
          // Tainted canvas fallback
        }
        resolve({ base64: url, mimeType: "image/jpeg" });
      };
      img.onerror = () => {
        resolve({ base64: url, mimeType: "image/jpeg" });
      };
      img.src = url;
    });
  }
}

const HISTORY_KEY = "imagetoprompt_history_v1";

export function loadHistory(): HistoryItem[] {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Failed to load history from localStorage", e);
    return [];
  }
}

export function saveHistoryItem(item: HistoryItem): HistoryItem[] {
  try {
    const existing = loadHistory();
    // Keep max 20 items
    const filtered = existing.filter((i) => i.id !== item.id);
    const updated = [item, ...filtered].slice(0, 20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to save history to localStorage", e);
    return [];
  }
}

export function deleteHistoryItem(id: string): HistoryItem[] {
  try {
    const existing = loadHistory();
    const updated = existing.filter((i) => i.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to delete history item", e);
    return [];
  }
}

export function exportPromptAsTxt(data: GeneratedPromptData) {
  const content = `=====================================================
IMAGE TO PROMPT - GENERATED PROMPT SHEET
Title: ${data.title}
Aspect Ratio: ${data.aspectRatio}
Summary: ${data.summary}
=====================================================

--- MIDJOURNEY v6 ---
${data.midjourney.fullPrompt}

Parameters: ${data.midjourney.parameters}

--- FLUX.1 (NATURAL LANGUAGE) ---
${data.flux.prompt}
Recommended Settings: ${data.flux.recommendedSettings}

--- STABLE DIFFUSION / SDXL ---
Positive Prompt:
${data.stableDiffusion.positivePrompt}

Negative Prompt:
${data.stableDiffusion.negativePrompt}

Sampling Settings:
Sampler: ${data.stableDiffusion.sampler} | Steps: ${data.stableDiffusion.steps} | CFG: ${data.stableDiffusion.cfgScale}

--- DALL-E 3 ---
${data.dalle3.prompt}

--- VISUAL ELEMENTS BREAKDOWN ---
Subject: ${data.elements.subject}
Art Style: ${data.elements.artStyle}
Medium: ${data.elements.medium}
Lighting: ${data.elements.lighting}
Colors: ${data.elements.colorPalette?.join(", ")}
Camera & Composition: ${data.elements.cameraAndComposition}
Mood & Atmosphere: ${data.elements.moodAndAtmosphere}

--- CREATIVE VARIATIONS ---
${data.variations.map((v, i) => `${i + 1}. [${v.name}]:\n${v.prompt}\n(Note: ${v.description})\n`).join("\n")}
`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-prompts.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportPromptAsJson(data: GeneratedPromptData) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-prompts.json`;
  a.click();
  URL.revokeObjectURL(url);
}
