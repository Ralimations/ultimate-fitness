import { GoogleGenerativeAI } from '@google/generative-ai';

// Uses Vite's import.meta.env mapping for client-side keys
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const GeminiService = {
  async analyzeFoodImage(base64Image: string, mimeType: string) {
    if (!apiKey) throw new Error('Gemini API key is not configured.');
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Analyze this image of food and return ONLY a valid JSON object matching this structure:
    {
      "name": "string (name of dish)",
      "calories": number (estimated total kcal),
      "protein": number (grams),
      "carbs": number (grams),
      "fats": number (grams)
    }
    No markdown, no markdown blocks, no other text.`;

    const chatResponse = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType,
        },
      },
    ]);

    const resRaw = chatResponse.response.text();
    return this.parseJsonSafely(resRaw);
  },

  async analyzeFoodText(description: string) {
    if (!apiKey) throw new Error('Gemini API key is not configured.');

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Analyze this food description and return ONLY a JSON object matching this structure:
    {
      "name": "string (name of dish)",
      "calories": number (estimated total kcal),
      "protein": number (grams),
      "carbs": number (grams),
      "fats": number (grams)
    }
    No markdown, no markdown blocks, no other text.
    Description: "${description}"`;

    const chatResponse = await model.generateContent(prompt);
    const resRaw = chatResponse.response.text();
    return this.parseJsonSafely(resRaw);
  },

  parseJsonSafely(raw: string) {
    try {
      const cleanString = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanString);
    } catch (error) {
      console.error('Failed to parse Gemini response:', raw, error);
      throw new Error('Could not understand AI response.');
    }
  }
};
