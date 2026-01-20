
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private static getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  static async generateBanner(prompt: string, highQuality: boolean = false): Promise<string> {
    const ai = this.getAI();
    const model = highQuality ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
    
    // YouTube banners are best at 16:9 for the full display (TV)
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: `Create a professional YouTube channel banner for a "Clips" channel. The style should be: ${prompt}. Ensure there is a clean central area for text. High detail, 4k resolution style, cinematic lighting.` }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          ...(highQuality ? { imageSize: "2K" } : {})
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in response");
  }

  static async checkHighQualityAccess(): Promise<boolean> {
    // @ts-ignore
    if (typeof window.aistudio?.hasSelectedApiKey === 'function') {
      // @ts-ignore
      return await window.aistudio.hasSelectedApiKey();
    }
    return false;
  }

  static async requestHighQualityAccess() {
    // @ts-ignore
    if (typeof window.aistudio?.openSelectKey === 'function') {
      // @ts-ignore
      await window.aistudio.openSelectKey();
    }
  }
}
