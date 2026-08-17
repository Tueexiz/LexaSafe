import "server-only";
import { GoogleGenerativeAI, type GenerateContentResult } from "@google/generative-ai";

const DEFAULT_MODEL = "gemini-2.0-flash";

function requireGeminiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set. Add it to the server environment (never NEXT_PUBLIC_*).");
  }
  return apiKey;
}

/** Server-only Gemini client. Do not import this module from Client Components. */
export function getGeminiClient(): GoogleGenerativeAI {
  return new GoogleGenerativeAI(requireGeminiKey());
}

export function getGeminiModel(model = process.env.GEMINI_MODEL ?? DEFAULT_MODEL) {
  return getGeminiClient().getGenerativeModel({
    model,
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 2048,
    },
  });
}

export async function generateGeminiText(prompt: string): Promise<string> {
  const result: GenerateContentResult = await getGeminiModel().generateContent(prompt);
  return result.response.text();
}
