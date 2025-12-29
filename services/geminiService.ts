import { GoogleGenAI, Type } from "@google/genai";
import { KhataItem, ShopType, Poster } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const extractKhataData = async (base64Data: string, mimeType: string, shopType: ShopType): Promise<KhataItem[]> => {
  try {
    const model = 'gemini-3-flash-preview';

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: `Analyze this handwritten Khata (ledger) receipt or page.
            Context: This is a ${shopType}. Ensure extracted items make sense for this domain.
            Extract the transaction items.
            For each item, identify the Date, Description (Item name), and Amount.
            If the date is implied or missing, use today's date (YYYY-MM-DD).
            Return the data as a JSON list.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING, description: "Date of transaction in YYYY-MM-DD format" },
                  description: { type: Type.STRING, description: "Name of the item or description of transaction" },
                  amount: { type: Type.NUMBER, description: "Cost or amount of the transaction" },
                },
                required: ["date", "description", "amount"],
              },
            },
          },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text);
    
    // Add IDs for React keys
    const items: KhataItem[] = (data.items || []).map((item: any) => ({
      id: crypto.randomUUID(),
      date: item.date || new Date().toISOString().split('T')[0],
      description: item.description || "Unknown Item",
      amount: Number(item.amount) || 0,
    }));

    return items;
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    return [
      { id: '1', date: '2023-10-25', description: 'Error Reading Image', amount: 0 },
    ];
  }
};

export const generateMarketingCopy = async (topic: string, shopType: ShopType): Promise<Partial<Poster>> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate marketing poster content for a ${shopType} running a promotion on: "${topic}".
      Return a JSON object with:
      - headline: A catchy, short title (max 5 words).
      - subline: A supporting sub-headline (max 8 words).
      - body: A short persuasive paragraph for WhatsApp sharing (max 20 words).
      - colorTheme: A CSS hex code string for the background color that fits the vibe.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            subline: { type: Type.STRING },
            body: { type: Type.STRING },
            colorTheme: { type: Type.STRING },
          }
        }
      }
    });
    
    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No text generated");
  } catch (error) {
    console.error("Marketing Copy Error:", error);
    return {
      headline: "Big Sale!",
      subline: "Limited time offer",
      body: `Best deals at your local ${shopType}. Don't miss out!`,
      colorTheme: "#3b82f6"
    };
  }
};

export const generateMarketingImage = async (topic: string, shopType: ShopType): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{
          text: `A professional, high-quality promotional image for a ${shopType} advertisement about: ${topic}. 
          Minimalist, bright, clean background, suitable for a poster. No text in the image.`
        }]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
  } catch (error) {
    console.error("Marketing Image Error:", error);
  }
  return undefined;
};