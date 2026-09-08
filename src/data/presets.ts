import { PresetImage } from "../types";

export const PRESET_IMAGES: PresetImage[] = [
  {
    id: "cyberpunk-city",
    title: "Cyberpunk Alleyway",
    category: "Sci-Fi",
    aspectRatio: "16:9",
    thumbnailUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "cinematic-portrait",
    title: "Cinematic Studio Portrait",
    category: "Photography",
    aspectRatio: "4:5",
    thumbnailUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "ethereal-landscape",
    title: "Misty Nordic Mountain",
    category: "Landscape",
    aspectRatio: "16:9",
    thumbnailUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "minimalist-architecture",
    title: "Minimal Concrete Arch",
    category: "Architecture",
    aspectRatio: "1:1",
    thumbnailUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "fantasy-forest",
    title: "Enchanted Bioluminescent Forest",
    category: "Fantasy",
    aspectRatio: "16:9",
    thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "macro-flora",
    title: "Macro Dewdrop on Petal",
    category: "Macro",
    aspectRatio: "1:1",
    thumbnailUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=900&auto=format&fit=crop&q=80",
  },
];

export const STYLE_TAGS = [
  { category: "Camera & Lens", tags: ["35mm lens", "85mm f/1.4", "cinematic anamorphic lens", "macro photography", "drone aerial shot", "shallow depth of field"] },
  { category: "Lighting", tags: ["golden hour", "dramatic chiaroscuro", "volumetric god rays", "neon rim lighting", "soft studio lighting", "cyberpunk ambient glow"] },
  { category: "Aesthetics & Render", tags: ["8k resolution", "Unreal Engine 5 render", "Octane render", "photorealistic", "award-winning photojournalism", "subsurface scattering"] },
  { category: "Styles", tags: ["hyperrealistic", "anime Makoto Shinkai style", "vintage retro 1980s VHS", "baroque oil painting", "minimalist concept art", "cyberpunk noir"] },
  { category: "Midjourney Parameters", tags: ["--ar 16:9", "--ar 9:16", "--ar 1:1", "--v 6.1", "--stylize 250", "--stylize 750", "--weird 150", "--raw"] },
];
