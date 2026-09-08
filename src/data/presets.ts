import { PresetImage, GeneratedPromptData } from "../types";

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

export const INITIAL_DEMO_DATA: GeneratedPromptData = {
  title: "Cyberpunk Alleyway",
  summary: "Reverse-engineered rainy cyberpunk metropolis alleyway with vivid neon cyan and magenta illumination, wet pavement reflections, and cinematic atmospheric depth.",
  aspectRatio: "16:9",
  tags: ["Cyberpunk", "Neo-Tokyo", "Neon Dusk", "16:9", "Cinematic", "8k Resolution"],
  elements: {
    subject: "A solitary wanderer in a trench coat walking through a narrow rain-slicked alleyway surrounded by vibrant Japanese kanji signs and overhead cybernetic cabling",
    artStyle: "Cinematic digital photograph with authentic 35mm anamorphic optical characteristics, subtle film grain, and rich specular highlights",
    medium: "High-resolution digital photography & modern generative render",
    lighting: "Dual-tone electric neon illumination (vivid cyan and hot magenta) reflecting across wet asphalt with volumetric mist",
    colorPalette: ["#00f0ff", "#ff007f", "#12131a", "#ffaa00", "#282c3f"],
    cameraAndComposition: "35mm anamorphic prime lens, f/1.4 aperture, eye-level framing, shallow depth of field with smooth circular bokeh",
    moodAndAtmosphere: "Atmospheric, evocative neo-noir mood with humid dusk ambiance and quiet mystery",
    texturesAndMaterials: "Rain-soaked asphalt with puddle reflections, weathered brick facades, neon glass tubing, and overhead industrial wires",
  },
  midjourney: {
    prompt: "Atmospheric rainy cyberpunk alleyway at dusk, vibrant neon cyan and magenta signage reflecting in wet asphalt puddles, moody solitary figure in trench coat, cinematic 35mm anamorphic lens, f/1.4 aperture, realistic mist, volumetric lighting, award-winning cinematography, ultra-detailed 8k",
    parameters: "--ar 16:9 --v 6.1 --stylize 250 --q 2",
    fullPrompt: "Atmospheric rainy cyberpunk alleyway at dusk, vibrant neon cyan and magenta signage reflecting in wet asphalt puddles, moody solitary figure in trench coat, cinematic 35mm anamorphic lens, f/1.4 aperture, realistic mist, volumetric lighting, award-winning cinematography, ultra-detailed 8k --ar 16:9 --v 6.1 --stylize 250 --q 2",
  },
  flux: {
    prompt: "A visually striking nighttime photograph of a narrow cyber-urban alleyway bathed in electric neon glow. Rainwater glistens on the uneven pavement, mirroring vibrant cyan and magenta kanji signage. Volumetric mist drifts between weathered brick buildings and tangled overhead cables. High focal fidelity with authentic optical roll-off.",
    recommendedSettings: "Guidance Scale: 3.5 | Steps: 28 | Flux.1 Dev / Schnell",
  },
  stableDiffusion: {
    positivePrompt: "masterpiece, best quality, ultra-detailed, cinematic photograph, 35mm dslr, cyberpunk alleyway at night, rain-soaked pavement, glowing neon signs, teal and magenta color grading, volumetric smoke, shallow depth of field, 8k uhd, raytracing reflections",
    negativePrompt: "ugly, deformed, disfigured, blurry, low quality, oversaturated, amateur, bad anatomy, cartoon, watermark, signature",
    sampler: "DPM++ 2M Karras",
    steps: 30,
    cfgScale: 7.0,
  },
  dalle3: {
    prompt: "A wide cinematic photograph of a narrow, atmospheric cyberpunk alleyway at night. Puddles on the wet ground reflect bright cyan and deep magenta neon signs hanging from buildings. A gentle fog catches the light, creating a mysterious, high-contrast urban mood.",
  },
  variations: [
    {
      name: "Exact Reproduction",
      prompt: "Atmospheric rainy cyberpunk alleyway at dusk, vibrant neon cyan and magenta signage reflecting in wet asphalt puddles, moody solitary figure, cinematic 35mm anamorphic lens, f/1.4 aperture, realistic mist, volumetric lighting, ultra-detailed 8k --ar 16:9 --v 6.1 --stylize 250",
      description: "Faithfully reproduces the neon reflections, wet textures, and neo-noir mood.",
    },
    {
      name: "High-Contrast Stylized",
      prompt: "Neo-noir cyberpunk city street, ultra-dramatic high-contrast rim lighting, Unreal Engine 5 render, intense cyan and orange glow, heavy volumetric rain, octane render, 8k --ar 16:9 --v 6.1 --stylize 500",
      description: "Increases contrast, stylization, and dramatic lighting reflections.",
    },
    {
      name: "Minimalist Dusk",
      prompt: "Minimalist neon alleyway composition, quiet dusk, soft diffused cyan lighting, clean negative space, medium format film, serene neo-noir stillness --ar 16:9 --v 6.1 --stylize 120",
      description: "A calmer, more contemplative composition with clean negative space.",
    },
  ],
  provider: "Free Browser Vision Engine",
};
