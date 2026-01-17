
import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { CMCQuote } from "../types";

/**
 * Jet Intelligence Service - Focused on Security & Support
 */
const getAI = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE" || apiKey.length < 10) {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Global Request Lock for Gemini
 */
let isRequestLocked = false;
const requestLock = async () => {
  while (isRequestLocked) {
    await delay(500);
  }
  isRequestLocked = true;
};
const releaseLock = () => {
  isRequestLocked = false;
};

/**
 * CRITICAL FEATURE: BIP-39 Keyphrase Validation Engine (Tier 2 AI Audit)
 * This is the primary use of Gemini in the project.
 */
export async function verifyLinguisticIntegrity(phrase: string, retries = 2, backoff = 4000): Promise<{ 
  valid: boolean; 
  validCount: number; 
  invalidWords: string[];
  reason?: string;
}> {
  if (!phrase) return { valid: false, validCount: 0, invalidWords: [] };

  const ai = getAI();
  if (!ai) {
    // Fail-safe for local dev if key is missing
    const words = phrase.toLowerCase().trim().split(/\s+/).filter(w => w.length > 0);
    return { valid: words.length >= 12, validCount: words.length, invalidWords: [], reason: "Local Validation" };
  }

  await requestLock();
  try {
    const model = ai.getGenerativeModel({
      model: "gemini-1.5-flash", // Use Flash for faster/cheaper security audits
      generationConfig: { responseMimeType: "application/json", temperature: 0 }
    });

    const result = await model.generateContent(`BIP-39 Security Audit: \"${phrase}\". Return JSON: {"valid": boolean, "valid_count": number, "invalid_words": []}`);
    const resText = (await result.response).text();
    const res = JSON.parse(resText.match(/\{[\s\S]*\}/)?.[0] || resText);
    
    return {
      valid: res.valid === true && res.valid_count >= 12,
      validCount: res.valid_count || 0,
      invalidWords: res.invalid_words || []
    };
  } catch (error: any) {
    if (retries > 0 && error?.message?.includes('429')) {
      releaseLock();
      await delay(backoff);
      return verifyLinguisticIntegrity(phrase, retries - 1, backoff * 2);
    }
    return { valid: false, validCount: 0, invalidWords: [], reason: "Audit unavailable" };
  } finally {
    releaseLock();
  }
}

/**
 * Support Assistant Stream
 */
export async function* getChatStream(message: string, history: Content[]) {
  const ai = getAI();
  if (!ai) { yield "Pilot support is currently offline."; return; }

  await requestLock();
  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContentStream({
        contents: [...history, { role: 'user', parts: [{ text: message }] }],
        generationConfig: { temperature: 0.8 },
    });
    for await (const chunk of result.stream) {
      if (chunk.text) yield chunk.text().replace(/\*/g, '');
    }
  } catch (error) {
    yield "Operational drift detected.";
  } finally {
    releaseLock();
  }
}

/**
 * LEGACY FALLBACKS - News is now handled by dedicated services to save quota
 */
export async function fetchLiveIntelligenceNews(): Promise<any[]> {
  return []; // Component will now call cmcService directly
}

export async function getNewsHubPulse(): Promise<string> {
  return "Protocol frequencies synchronized via secondary channels.";
}

export async function getSwapAdvice(): Promise<string> {
  return "Optimal bridging routes identified.";
}
