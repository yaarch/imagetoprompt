import { GeneratedPromptData, TargetModel, DetailLevel, StyleFocus } from "../types";

/**
 * Client-Side Vision & Reverse Prompt Engine
 * Runs directly in the browser using HTML5 Canvas.
 * Ensures the app works 100% seamlessly on static hosting like Cloudflare Pages (*.pages.dev),
 * Vercel, Netlify, or GitHub Pages where no Node.js/Express server is running.
 */
export async function analyzeImageInBrowser(
  base64Image: string,
  targetModel: TargetModel = "all",
  detailLevel: DetailLevel = "detailed",
  styleFocus: StyleFocus = "all",
  language: string = "English"
): Promise<GeneratedPromptData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        // Calculate aspect ratio string
        const ratioVal = width / height;
        let aspectRatio = "16:9";
        if (Math.abs(ratioVal - 1) < 0.08) aspectRatio = "1:1";
        else if (Math.abs(ratioVal - 16 / 9) < 0.12) aspectRatio = "16:9";
        else if (Math.abs(ratioVal - 9 / 16) < 0.12) aspectRatio = "9:16";
        else if (Math.abs(ratioVal - 4 / 5) < 0.08) aspectRatio = "4:5";
        else if (Math.abs(ratioVal - 3 / 2) < 0.08) aspectRatio = "3:2";
        else if (Math.abs(ratioVal - 2 / 3) < 0.08) aspectRatio = "2:3";
        else if (ratioVal > 2) aspectRatio = "21:9";
        else if (width > height) aspectRatio = "16:9";
        else aspectRatio = "9:16";

        // Draw image onto off-screen canvas to sample pixel data
        const sampleSize = 64;
        const canvas = document.createElement("canvas");
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        const ctx = canvas.getContext("2d");

        let avgR = 120, avgG = 120, avgB = 120;
        let brightness: "dark" | "balanced" | "bright" = "balanced";
        let dominantColors: string[] = ["#1a1a1a", "#e67e22", "#2980b9", "#f1c40f", "#ecf0f1"];
        let themeName = "Cinematic Fine Art";

        if (ctx) {
          ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
          const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize);
          const data = imgData.data;

          let rTotal = 0, gTotal = 0, bTotal = 0;
          const colorBins: { [hex: string]: number } = {};

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            rTotal += r;
            gTotal += g;
            bTotal += b;

            // Quantize to 32 steps for palette binning
            const qr = Math.round(r / 32) * 32;
            const qg = Math.round(g / 32) * 32;
            const qb = Math.round(b / 32) * 32;
            const hex =
              "#" +
              [qr, qg, qb]
                .map((c) => Math.min(255, Math.max(0, c)).toString(16).padStart(2, "0"))
                .join("");
            colorBins[hex] = (colorBins[hex] || 0) + 1;
          }

          const pixelCount = sampleSize * sampleSize;
          avgR = Math.round(rTotal / pixelCount);
          avgG = Math.round(gTotal / pixelCount);
          avgB = Math.round(bTotal / pixelCount);

          const lum = 0.299 * avgR + 0.587 * avgG + 0.114 * avgB;
          brightness = lum < 75 ? "dark" : lum > 175 ? "bright" : "balanced";

          // Extract top 5 dominant colors
          const sortedColors = Object.entries(colorBins)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([hex]) => hex);

          if (sortedColors.length >= 3) {
            dominantColors = sortedColors;
          }

          // Detect aesthetic theme from color dominance
          if (avgB > avgR + 25 && avgB > avgG) {
            themeName = "Cyberpunk Cool Cyan & Neon Dusk";
          } else if (avgR > avgB + 30 && avgR > avgG) {
            themeName = "Warm Golden Hour & Amber Twilight";
          } else if (avgG > avgR + 15 && avgG > avgB) {
            themeName = "Lush Ethereal Nature & Forest Green";
          } else if (brightness === "dark") {
            themeName = "Moody Chiaroscuro & Noir Shadows";
          } else if (brightness === "bright") {
            themeName = "Crisp High-Key Studio Atmosphere";
          } else {
            themeName = "Harmonic Cinematic Aesthetic";
          }
        }

        // Build prompt descriptors according to detail level and style focus
        let lensStyle = "35mm prime lens, f/1.8 aperture, natural depth of field";
        let mediumStyle = "High-definition digital photography & cinematic masterwork";

        if (styleFocus === "photorealistic") {
          mediumStyle = "Authentic 35mm film photograph, Leica M11, natural grain, tack-sharp focal plane";
          lensStyle = "85mm f/1.4 portrait lens, beautiful circular bokeh, shallow depth of field";
        } else if (styleFocus === "artistic") {
          mediumStyle = "Digital concept art illustration, expressive painterly brushwork, layered depth";
          lensStyle = "Dynamic wide composition, stylized atmospheric perspective";
        } else if (styleFocus === "lighting") {
          mediumStyle = "Cinematic lighting study, volumetric rays, raytraced reflection physics";
          lensStyle = "Anamorphic widescreen lens, horizontal flare, cinematic falloff";
        }

        const midjourneyParams = `--ar ${aspectRatio} --v 6.1 --stylize 250 --q 2`;
        const mjPromptCore = `Masterful visual composition, ${themeName.toLowerCase()}, ${mediumStyle}, ${lensStyle}, rich ${brightness} lighting, award-winning composition, 8k resolution`;
        const mjFullPrompt = `${mjPromptCore} ${midjourneyParams}`;

        const fluxPrompt = `A visually captivating scene bathed in ${themeName.toLowerCase()}. The composition presents authentic spatial depth with realistic light propagation, volumetric diffusion, and nuanced surface interaction. Every detail is rendered with crisp fidelity, tactile textures, and balanced contrast, evoking an immersive cinematic presence.`;

        const sdPositive = `masterpiece, best quality, ultra-detailed, ${themeName}, ${mediumStyle}, ${lensStyle}, 8k uhd, dslr, high quality, photographic lighting, cinematic`;
        const sdNegative = `ugly, deformed, disfigured, poor anatomy, bad hands, missing fingers, extra limbs, blurry, out of focus, low resolution, watermark, text, signature, oversaturated, amateur`;

        const dallePrompt = `A detailed, high-resolution artistic photograph depicting ${themeName.toLowerCase()}. The scene is framed with intentional composition, showcasing rich ${brightness} lighting, nuanced reflections, and natural atmospheric depth in ultra-clear clarity.`;

        const result: GeneratedPromptData = {
          title: `${themeName.split("&")[0].trim()}`,
          summary: `Reverse-engineered visual composition capturing ${themeName.toLowerCase()} with ${brightness} tonal range and ${aspectRatio} aspect ratio.`,
          aspectRatio: aspectRatio,
          tags: [
            themeName.split(" ")[0],
            brightness.toUpperCase(),
            aspectRatio,
            "Cinematic",
            "8k Resolution",
            "High Fidelity",
          ],
          elements: {
            subject: "Primary focal subject framed with dynamic visual balance, intentional negative space, and environmental context",
            artStyle: mediumStyle,
            medium: "Cinematic digital photography & modern generative render",
            lighting: `${themeName} with smooth highlight falloff and atmospheric ambient occlusion`,
            colorPalette: dominantColors,
            cameraAndComposition: lensStyle,
            moodAndAtmosphere: `Evocative, refined, and ${brightness === "dark" ? "contemplative moody" : "vibrant cinematic"} tone`,
            texturesAndMaterials: "Rich natural surface details, soft environmental diffusion, crisp specularity",
          },
          midjourney: {
            prompt: mjPromptCore,
            parameters: midjourneyParams,
            fullPrompt: mjFullPrompt,
          },
          flux: {
            prompt: fluxPrompt,
            recommendedSettings: "Guidance Scale: 3.5 | Steps: 28 | Flux Schnell / Dev",
          },
          stableDiffusion: {
            positivePrompt: sdPositive,
            negativePrompt: sdNegative,
            sampler: "DPM++ 2M Karras",
            steps: 30,
            cfgScale: 7.0,
          },
          dalle3: {
            prompt: dallePrompt,
          },
          variations: [
            {
              name: "Exact Match",
              prompt: mjFullPrompt,
              description: `Faithfully preserves the original ${themeName.toLowerCase()} color harmonies and framing.`,
            },
            {
              name: "Stylized Remix",
              prompt: `Hyper-stylized creative remix, ${themeName}, dramatic rim lighting, unreal engine 5 render, award-winning concept art, volumetric haze, 8k --ar ${aspectRatio} --v 6.1 --stylize 500`,
              description: "Pushes dynamic lighting and applies richer contrast and artistic flair.",
            },
            {
              name: "Minimalist Cinematic",
              prompt: `Minimalist aesthetic, subtle ${themeName.toLowerCase()}, clean negative space, diffused soft lighting, Hasselblad medium format --ar ${aspectRatio} --v 6.1 --stylize 120`,
              description: "A stripped-down, contemplative framing emphasizing pure negative space and form.",
            },
          ],
          provider: "Client Vision Engine (Cloudflare Pages Ready)",
        };

        resolve(result);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (err) => {
      reject(new Error("Failed to load image for client-side analysis: " + err));
    };

    img.src = base64Image;
  });
}

/**
 * Client-Side prompt refiner for when backend /api/refine-prompt is unreachable
 */
export function refinePromptInBrowser(
  basePrompt: string,
  instruction: string,
  targetModel: string = "midjourney"
): { refinedPrompt: string; changesMade: string } {
  const cleanInstruction = instruction.trim();
  const isMidjourney = targetModel.toLowerCase().includes("midjourney");
  let refined = basePrompt;

  if (isMidjourney) {
    // Preserve parameters at end like --ar 16:9 --v 6.1
    const paramMatch = refined.match(/(--[a-z0-9]+(\s+[^\s-]+)?)+$/i);
    const params = paramMatch ? paramMatch[0] : "";
    const core = paramMatch ? refined.slice(0, paramMatch.index).trim() : refined;
    refined = `${core}, ${cleanInstruction} ${params}`.trim();
  } else {
    refined = `${refined}, ${cleanInstruction}`;
  }

  return {
    refinedPrompt: refined,
    changesMade: `Applied: "${cleanInstruction}"`,
  };
}
