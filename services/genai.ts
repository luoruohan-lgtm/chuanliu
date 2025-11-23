import { GoogleGenAI } from "@google/genai";
import { CityTheme, GeneratedContent } from "../types";

// Helper to get the API client
const getAiClient = async (): Promise<GoogleGenAI> => {
    if (process.env.API_KEY) {
        return new GoogleGenAI({ apiKey: process.env.API_KEY });
    }

    const win = window as any;
    if (win.aistudio && await win.aistudio.hasSelectedApiKey()) {
        return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    } else {
        throw new Error("API Key not selected");
    }
};

export const generateBlindBoxResult = async (city: CityTheme): Promise<GeneratedContent> => {
  const ai = await getAiClient();

  // 1. Generate the Image
  // Updated prompt to enforce Calligraphy/KaiTi style and better text rendering
  // Added "View: Wide Shot" to ensure no cropping
  const imagePrompt = `
    A high-end commercial product photography shot of a fruit wine bottle brand named "川流不息".
    
    VIEW: Wide angle shot, full body composition. Ensure the entire bottle and the character are visible in the center with breathing room around them. Do not crop the top or bottom.
    
    PRODUCT: A sleek, frosted glass bottle containing glowing ${city.color} liquid (${city.fruit} wine).
    
    TEXT ON BOTTLE: The brand name "${city.brandName}" must be written on the bottle label.
    FONT STYLE: Chinese Calligraphy (KaiTi style / 楷体), elegant black or gold brush strokes, clearly legible, cultural and artistic.
    
    SCENE: A cute 3D clay-molded character representing ${city.name} city is sitting next to the bottle.
    Character Vibe: ${city.trait}.
    Background: Soft, dreamy pastel gradient matching ${city.color}, with fresh ${city.fruit} slices floating around.
    
    QUALITY: Octane render, C4D, 8k resolution, photorealistic, cinematic lighting.
    NEGATIVE PROMPT: cropped, cut off, close up, partial view, blurry text, gibberish, wrong characters, messy font, english text on label (except brand logo).
  `;

  let imageUrl = '';
  
  try {
      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: imagePrompt }]
        },
        config: {
            imageConfig: {
                aspectRatio: "1:1",
            }
        }
      });

      for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
              imageUrl = `data:image/png;base64,${part.inlineData.data}`;
              break;
          }
      }
  } catch (error) {
      console.error("Image generation failed", error);
      imageUrl = `https://picsum.photos/1024/1024?grayscale&blur=2`;
  }

  // 2. Generate the Story/Description
  const textPrompt = `
    为一款名为"${city.brandName}"的城市限定果酒写一段优美的文案。
    城市主题：${city.name}。
    水果口味：${city.fruit}。
    
    要求：
    1. 语言极其优美、充满诗意，使用中文散文风格。
    2. 描述果酒的口感（如微醺、清甜、回甘）与${city.name}的城市气质（${city.trait}）的连接。
    3. 篇幅精简，3句以内。
    4. 严禁使用Markdown符号（如*、#），严禁使用表情包。
    5. 字体感觉要像是在读一首小诗。
  `;

  let story = "开启你的专属微醺时刻！";
  try {
      const textResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: textPrompt
      });
      if (textResponse.text) {
          story = textResponse.text.replace(/\*|#|\[|\]/g, '').trim();
      }
  } catch (error) {
      console.error("Text generation failed", error);
  }

  return {
    cityName: city.name,
    imageUrl,
    story,
    productName: city.productName,
    brandName: city.brandName,
    brandEnglish: city.brandEnglish
  };
};

export const checkApiKey = async (): Promise<boolean> => {
    if (process.env.API_KEY) return true;

    const win = window as any;
    if (win.aistudio) {
        return await win.aistudio.hasSelectedApiKey();
    }
    return false;
};

export const promptApiKey = async (): Promise<void> => {
    const win = window as any;
    if (win.aistudio) {
        await win.aistudio.openSelectKey();
    }
};