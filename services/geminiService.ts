import { GoogleGenAI, Type } from "@google/genai";
import { WishGeneratorParams, GeneratedWishResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBirthdayContent = async (params: WishGeneratorParams): Promise<GeneratedWishResponse> => {
  try {
    const modelId = 'gemini-2.5-flash';
    
    const prompt = `
      Create a birthday greeting for ${params.name} who is turning ${params.age}.
      Relationship: ${params.relationship}.
      Tone: ${params.tone || 'cyberpunk'}.
      
      Also suggest 3 futuristic or cool gift ideas appropriate for them.
      
      Return the response in strict JSON format with "wish" (string) and "giftIdeas" (array of strings).
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            wish: {
              type: Type.STRING,
              description: "A creative birthday wish."
            },
            giftIdeas: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3 gift ideas."
            }
          },
          required: ["wish", "giftIdeas"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No content generated");
    
    return JSON.parse(text) as GeneratedWishResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      wish: `Happy ${params.age}th Birthday, ${params.name}! (System offline, default message loaded)`,
      giftIdeas: ["Gift Card", "Cake", "Party"]
    };
  }
};