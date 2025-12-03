import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

const geminiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(geminiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

export type ConditionAssessment = {
  scratches: string;
  cracks: string;
  dents: string;
  screen: string;
  wear: string;
  modelGuess: string;
  conditionScore: number;
};

async function urlToInlineData(url: string) {
  const res = await axios.get<ArrayBuffer>(url, { responseType: 'arraybuffer' });
  const base64 = Buffer.from(res.data).toString('base64');
  return { inlineData: { data: base64, mimeType: 'image/jpeg' } };
}

export async function assessDeviceFromImages(imageUrls: string[]): Promise<ConditionAssessment> {
  const prompt = `You are evaluating a consumer electronics device for resale.
Return strict JSON with keys: scratches, cracks, dents, screen, wear, modelGuess, conditionScore (0-100).
Use concise phrases. Penalize visible damage.`;

  const imgParts = await Promise.all(imageUrls.map((url) => urlToInlineData(url)));

  const result = await model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }, ...imgParts]
      }
    ]
  });

  const text = result.response.text();
  try {
    const json = JSON.parse(text);
    return {
      scratches: json.scratches ?? 'Unknown',
      cracks: json.cracks ?? 'Unknown',
      dents: json.dents ?? 'Unknown',
      screen: json.screen ?? 'Unknown',
      wear: json.wear ?? 'Unknown',
      modelGuess: json.modelGuess ?? 'Unknown',
      conditionScore: Number.isFinite(json.conditionScore) ? json.conditionScore : 50
    };
  } catch {
    return {
      scratches: 'Unknown',
      cracks: 'Unknown',
      dents: 'Unknown',
      screen: 'Unknown',
      wear: 'Unknown',
      modelGuess: 'Unknown',
      conditionScore: 50
    };
  }
}
