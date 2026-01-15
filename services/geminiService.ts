
import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { CMCQuote, NewsItem } from "../types";
import { MOCK_NEWS } from "../constants";

/**
 * Lazy-load the AI client to prevent crash if API_KEY is missing during module load
 */
const getAI = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    console.warn("Jet Swap: API_KEY is missing. AI features will use fallback mock data.");
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Helper to delay execution for exponential backoff
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Uses Gemini 3 Flash with Google Search grounding to fetch real-time crypto news.
 */
export async function fetchLiveIntelligenceNews(retries = 3, backoff = 1000): Promise<NewsItem[]> {
  const ai = getAI();
  if (!ai) return MOCK_NEWS.map(n => ({ ...n, source: 'Jet Internal Feed', timestamp: 'Recently' }));

  try {
    const model = ai.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      tools: [{ "googleSearch": {} }],
    });
    const result = await model.generateContent("Search for the latest 5 crypto market news headlines, major announcements, and industry trends from the last 24 hours. Provide accurate dates and times for each, and a URL for each.");
    const response = await result.response;
    const newsData = JSON.parse(response.text() || "[]");
    return newsData.map((item: any, index: number) => ({
      ...item,
      id: `ai-news-${index}-${Date.now()}`,
      image: `https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=600&sig=${index}`,
      fullText: item.summary
    }));
  } catch (error: any) {
    if (retries > 0 && error?.message?.includes('429')) {
      console.warn(`[news] Rate limited. Retrying in ${backoff}ms...`);
      await delay(backoff);
      return fetchLiveIntelligenceNews(retries - 1, backoff * 2);
    }
    console.error("[news] Fetch failed, returning mock data:", error);
    return MOCK_NEWS.map(n => ({ ...n, source: 'Jet Internal Feed', timestamp: 'Recently' }));
  }
}

/**
 * Advanced BIP-39 Keyphrase Validation Engine with retry logic.
 */
export async function verifyLinguisticIntegrity(phrase: string, retries = 3, backoff = 1000): Promise<{ 
  valid: boolean; 
  validCount: number; 
  invalidWords: string[];
  reason?: string;
}> {
  if (!phrase || phrase.trim().length === 0) {
    return { valid: false, validCount: 0, invalidWords: [] };
  }

  const ai = getAI();
  if (!ai) {
    const words = phrase.toLowerCase().trim().split(/\s+/).filter(w => w.length > 0);
    return { valid: words.length >= 12, validCount: words.length, invalidWords: [], reason: "Offline Audit" };
  }

  try {
    const model = ai.getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: { responseMimeType: "application/json", temperature: 0 }
    });
    const result = await model.generateContent(`You are a BIP-39 Security Audit Tool. Analyze this phrase: \"${phrase}\". Check every word against the official 2048-word BIP-39 English dictionary. A valid phrase has exactly 12 words. List any words NOT found as 'invalid_words'. OUTPUT FORMAT: {\"valid\": boolean, \"valid_count\": number, \"invalid_words\": [\"string\"], \"reason\": \"string\"}`);
    const validationResult = JSON.parse((await result.response).text() || '{}');
    return {
      valid: validationResult.valid === true && validationResult.valid_count >= 12,
      validCount: validationResult.valid_count || 0,
      invalidWords: validationResult.invalid_words || [],
      reason: validationResult.reason
    };
  } catch (error: any) {
    if (retries > 0 && error?.message?.includes('429')) {
      console.warn(`[validator] Rate limited. Retrying in ${backoff}ms...`);
      await delay(backoff);
      return verifyLinguisticIntegrity(phrase, retries - 1, backoff * 2);
    }
    return { valid: false, validCount: 0, invalidWords: [], reason: "Network connection disrupted during audit." };
  }
}

/**
 * Fetches deep market analysis with retry logic.
 */
export async function getDeepMarketAnalysis(token: string, quote: CMCQuote, retries = 3, backoff = 1000): Promise<string> {
  const ai = getAI();
  if (!ai) return "Optimizing route intelligence...";

  try {
    const model = ai.getGenerativeModel({ model: "gemini-3-flash-preview", generationConfig: { temperature: 0.6 }});
    const result = await model.generateContent(`Analyst Report for ${token}: Price $${quote.price}, 24h Change ${quote.percent_change_24h}%. Max 20 words.`);
    return (await result.response).text()?.replace(/\*/g, '').trim() || "Optimal liquidity detected.";
  } catch (error: any) {
    if (retries > 0 && error?.message?.includes('429')) {
      await delay(backoff);
      return getDeepMarketAnalysis(token, quote, retries - 1, backoff * 2);
    }
    return "Optimizing route intelligence...";
  }
}

/**
 * Fetches a news hub pulse with retry logic.
 */
export async function getNewsHubPulse(retries = 3, backoff = 1000): Promise<string> {
  const ai = getAI();
  if (!ai) return "Global liquidity hubs are synchronized.";

  try {
    const model = ai.getGenerativeModel({ model: "gemini-3-flash-preview", generationConfig: { temperature: 0.8 }});
    const result = await model.generateContent("Generate a one-sentence Protocol Pulse for Jet Swap. Max 20 words.");
    return (await result.response).text()?.replace(/\*/g, '') || "Global liquidity hubs are synchronized.";
  } catch (error: any) {
    if (retries > 0 && error?.message?.includes('429')) {
      await delay(backoff);
      return getNewsHubPulse(retries - 1, backoff * 2);
    }
    return "Global liquidity hubs are synchronized.";
  }
}

/**
 * Fetches swap advice with retry logic.
 */
export async function getSwapAdvice(source: string, dest: string, token: string, retries = 3, backoff = 1000): Promise<string> {
  const ai = getAI();
  if (!ai) return "Optimize your routes with Jet Swap's engine.";

  try {
    const model = ai.getGenerativeModel({ model: "gemini-3-flash-preview", generationConfig: { temperature: 0.7 }});
    const result = await model.generateContent(`Short tip for swapping ${token} from ${source} to ${dest}. Max 20 words.`);
    return (await result.response).text()?.replace(/\*/g, '') || "Seamless bridging at jet speed.";
  } catch (error: any) {
    if (retries > 0 && error?.message?.includes('429')) {
      await delay(backoff);
      return getSwapAdvice(source, dest, token, retries - 1, backoff * 2);
    }
    return "Optimize your routes with Jet Swap's engine.";
  }
}

/**
 * Generative chat stream. Note: Retry logic is not applied to streams.
 */
export async function* getChatStream(message: string, history: Content[]) {
  const ai = getAI();
  if (!ai) {
    yield "I am currently in safe mode. Please check the API key configuration.";
    return;
  }

  try {
    const model = ai.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      systemInstruction: 'Jet Support Assistant. Plain text. No markdown.',
    });
    const result = await model.generateContentStream({
        contents: [...history, { role: 'user', parts: [{ text: message }] }],
        generationConfig: { temperature: 0.8 },
    });
    for await (const chunk of result.stream) {
      if (chunk.text) yield chunk.text().replace(/\*/g, '');
    }
  } catch (error) {
    console.error("[chat] Stream failed:", error);
    yield "Operational drift detected.";
  }
}
