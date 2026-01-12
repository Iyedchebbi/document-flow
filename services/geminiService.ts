import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedDocument } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDocumentContent = async (prompt: string): Promise<GeneratedDocument> => {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are an expert legal and business document drafter. 
    Your goal is to create professional, correctly formatted HTML documents based on user requests.
    
    Rules:
    1. Output strictly valid HTML content suitable for placing inside a <div>. 
    2. Use semantic HTML tags like <h1>, <h2>, <p>, <ul>, <li>, <strong>.
    3. Do NOT include <html>, <head>, or <body> tags.
    4. Use standard business letter formatting.
    5. Include placeholders in brackets like [Date] or [Name] if the user didn't provide specifics.
    6. Ensure the tone is professional, clear, and concise.
    7. Use standard Tailwind classes for basic spacing (mb-4, etc) directly in the HTML tags if needed for layout, but rely mostly on semantic structure.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Draft the following document: ${prompt}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A short, professional title for the document" },
            htmlContent: { type: Type.STRING, description: "The full HTML body of the document" },
            createdDate: { type: Type.STRING, description: "Today's date formatted nicely" }
          },
          required: ["title", "htmlContent", "createdDate"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from Gemini");
    
    return JSON.parse(jsonText) as GeneratedDocument;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to generate document. Please try again.");
  }
};