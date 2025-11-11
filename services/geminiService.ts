
import { GoogleGenAI, Modality } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.warn("API_KEY environment variable is not set. The application will not be able to connect to the Gemini API.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
};

export const enhanceImage = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const imagePart = fileToGenerativePart(base64Image, mimeType);
    
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            imagePart,
            {
              text: 'Enhance the quality of this image. Improve resolution, sharpness, and clarity. Upscale the image while maintaining natural details.',
            },
          ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
      });

    const enhancedPart = response.candidates?.[0]?.content?.parts?.[0];

    if (enhancedPart && enhancedPart.inlineData) {
      return enhancedPart.inlineData.data;
    } else {
      throw new Error("No enhanced image data received from the API.");
    }
  } catch (error) {
    console.error("Error enhancing image with Gemini API:", error);
    throw new Error("فشل تحسين الصورة. يرجى المحاولة مرة أخرى.");
  }
};
