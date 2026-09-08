export type TargetModel = "all" | "midjourney" | "flux" | "stablediffusion" | "dalle3";

export type DetailLevel = "detailed" | "concise" | "cinematic" | "keywords";

export type StyleFocus = "all" | "photorealistic" | "artistic" | "lighting" | "character" | "landscape";

export interface VisualElements {
  subject: string;
  artStyle: string;
  medium: string;
  lighting: string;
  colorPalette: string[];
  cameraAndComposition: string;
  moodAndAtmosphere: string;
  texturesAndMaterials?: string;
}

export interface MidjourneyPrompt {
  prompt: string;
  parameters: string;
  fullPrompt: string;
}

export interface FluxPrompt {
  prompt: string;
  recommendedSettings: string;
}

export interface StableDiffusionPrompt {
  positivePrompt: string;
  negativePrompt: string;
  sampler: string;
  steps: number;
  cfgScale: number;
}

export interface DallePrompt {
  prompt: string;
}

export interface PromptVariation {
  name: string;
  prompt: string;
  description: string;
}

export interface GeneratedPromptData {
  title: string;
  summary: string;
  aspectRatio: string;
  tags: string[];
  elements: VisualElements;
  midjourney: MidjourneyPrompt;
  flux: FluxPrompt;
  stableDiffusion: StableDiffusionPrompt;
  dalle3: DallePrompt;
  variations: PromptVariation[];
  provider?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  imageUrl: string;
  title: string;
  data: GeneratedPromptData;
}

export interface PresetImage {
  id: string;
  title: string;
  category: string;
  thumbnailUrl: string;
  aspectRatio: string;
}
