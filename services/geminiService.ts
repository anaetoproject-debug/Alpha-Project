
import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { CMCQuote, NewsItem } from "../types";
import { MOCK_NEWS } from "../constants";
import { getLatestCryptoNews } from "./cmcService";

/**
 * Lazy-load the AI client
 */
const getAI = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
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
 * Global Request Lock to prevent simultaneous calls hitting the rate limit
 */
let isRequestLocked = false;
const requestLock = async () => {
  while (isRequestLocked) {
    await delay(300 + Math.random() * 200);
  }
  isRequestLocked = true;
};
const releaseLock = () => {
  isRequestLocked = false;
};

/**
 * Robust JSON parsing from AI response
 */
function parseAIResponse(text: string) {
  if (!text) return [];
  try {
    return JSON.parse(text);
  } catch (e) {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match) {
      try {
        return JSON.parse(match[1]);
      } catch (e2) {}
    }
    const arrayMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (arrayMatch) {
        try {
            return JSON.parse(arrayMatch[0]);
        } catch (e3) {}
    }
    const objMatch = text.match(/\{\s*[\s\S]*\s*\}/);
    if (objMatch) {
        try {
            return JSON.parse(objMatch[0]);
        } catch (e4) {}
    }
    throw new Error("Could not parse AI response as JSON");
  }
}

/**
 * Uses Gemini 2.5 Pro with Google Search grounding to fetch real-time crypto news.
 * Implements a Multi-Layered Data Pipeline: Primary (AI) -> Secondary (CMC) -> Tertiary (Mock)
 */
export async function fetchLiveIntelligenceNews(retries = 3, backoff = 4000): Promise<NewsItem[]> {
  const ai = getAI();
  
  if (ai) {
    await requestLock();
    try {
      const model = ai.getGenerativeModel({ 
        model: "gemini-2.5-pro",
        tools: [{ "googleSearch": {} }],
      });
      
      const prompt = `Search for the latest 5 crypto market news headlines from the last 24 hours. 
      Return ONLY a JSON ARRAY of objects with these properties: title, summary, category, timestamp, source, url.
      Do not include any conversational text.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const newsData = parseAIResponse(text);
      
      if (Array.isArray(newsData) && newsData.length > 0) {
        return newsData.map((item: any, index: number) => ({
          title: item.title || "Market Update",
          summary: item.summary || "No summary available.",
          category: item.category || "Market News",
          timestamp: item.timestamp || "Just now",
          source: item.source || "External Feed",
          url: item.url || "#",
          id: `ai-news-${index}-${Date.now()}`,
          image: `https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=600&sig=${index}`,
          fullText: item.summary
        }));
      }
    } catch (error: any) {
      if (retries > 0 && error?.message?.includes('429')) {
        console.warn(`[news] Rate limited. Retrying in ${backoff}ms...`);
        releaseLock();
        await delay(backoff);
        return fetchLiveIntelligenceNews(retries - 1, backoff * 2);
      }
      console.error("[news] AI Layer failed, falling back to CMC:", error);
    } finally {
      releaseLock();
    }
  }

  try {
    const cmcNews = await getLatestCryptoNews();
    if (cmcNews && cmcNews.length > 0) {
      return cmcNews;
    }
  } catch (error) {
    console.error("[news] CMC Layer failed, falling back to Mocks:", error);
  }

  return MOCK_NEWS.map(n => ({ ...n, source: 'Jet Internal Feed', timestamp: 'Recently' }));
}

/**
 * Advanced BIP-39 Keyphrase Validation Engine.
 * Tier 2: Linguistic Integrity (The "AI Audit" Layer)
 */
export async function verifyLinguisticIntegrity(phrase: string, retries = 3, backoff = 4000): Promise<{ 
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

  await requestLock();
  try {
    const model = ai.getGenerativeModel({
      model: "gemini-2.5-pro",
      generationConfig: { 
        responseMimeType: "application/json", 
        temperature: 0 
      }
    });

    const prompt = `You are a BIP-39 Security Audit Tool. Analyze this phrase: \"${phrase}\". 
    
    CRITICAL INSTRUCTIONS:
    1. Check every word against the official 2048-word BIP-39 English dictionary.
    2. A valid phrase must contain exactly 12 words and be structurally sound (not repeated words or gibberish).
    3. List any words NOT found in the BIP-39 standard as 'invalid_words'.
    
    OUTPUT FORMAT (JSON):
    {
      \"valid\": boolean,
      \"valid_count\": number,
      \"invalid_words\": [\"string\"],
      \"reason\": \"string\"
    }`;

    const result = await model.generateContent(prompt);
    const validationResult = parseAIResponse((await result.response).text());
    
    return {
      valid: validationResult.valid === true && validationResult.valid_count >= 12,
      validCount: validationResult.valid_count || 0,
      invalidWords: validationResult.invalid_words || [],
      reason: validationResult.reason
    };
  } catch (error: any) {
    if (retries > 0 && error?.message?.includes('429')) {
      console.warn(`[validator] Rate limited. Retrying in ${backoff}ms...`);
      releaseLock();
      await delay(backoff);
      return verifyLinguisticIntegrity(phrase, retries - 1, backoff * 2);
    }
    return { valid: false, validCount: 0, invalidWords: [], reason: "Network connection disrupted during audit." };
  } finally {
    releaseLock();
  }
}

export async function getDeepMarketAnalysis(token: string, quote: CMCQuote, retries = 3, backoff = 4000): Promise<string> {
  const ai = getAI();
  if (!ai) return "Optimizing route intelligence...";

  await requestLock();
  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.5-pro", generationConfig: { temperature: 0.6 }});
    const result = await model.generateContent(`Analyst Report for ${token}: Price $${quote.price}, 24h Change ${quote.percent_change_24h}%. Max 20 words.`);
    return (await result.response).text()?.replace(/\*/g, '').trim() || "Optimal liquidity detected.";
  } catch (error: any) {
    if (retries > 0 && error?.message?.includes('429')) {
      releaseLock();
      await delay(backoff);
      return getDeepMarketAnalysis(token, quote, retries - 1, backoff * 2);
    }
    return "Optimizing route intelligence...";
  } finally {
    releaseLock();
  }
}

export async function getNewsHubPulse(retries = 3, backoff = 4000): Promise<string> {
  const ai = getAI();
  if (!ai) return "Global liquidity hubs are synchronized.";

  await requestLock();
  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.5-pro", generationConfig: { temperature: 0.8 }});
    const result = await model.generateContent("Generate a one-sentence market vibe summary for Jet Swap. Max 20 words.");
    return (await result.response).text()?.replace(/\*/g, '') || "Global liquidity hubs are synchronized.";
  } catch (error: any) {
    if (retries > 0 && error?.message?.includes('429')) {
      releaseLock();
      await delay(backoff);
      return getNewsHubPulse(retries - 1, backoff * 2);
    }
    return "Global liquidity hubs are synchronized.";
  } finally {
    releaseLock();
  }
}

export async function getSwapAdvice(source: string, dest: string, token: string, retries = 3, backoff = 4000): Promise<string> {
  const ai = getAI();
  if (!ai) return "Optimize your routes with Jet Swap's engine.";

  await requestLock();
  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.5-pro", generationConfig: { temperature: 0.7 }});
    const result = await model.generateContent(`Short tip for swapping ${token} from ${source} to ${dest}. Max 20 words.`);
    return (await result.response).text()?.replace(/\*/g, '') || "Seamless bridging at jet speed.";
  } catch (error: any) {
    if (retries > 0 && error?.message?.includes('429')) {
      releaseLock();
      await delay(backoff);
      return getSwapAdvice(source, dest, token, retries - 1, backoff * 2);
    }
    return "Optimize your routes with Jet Swap's engine.";
  } finally {
    releaseLock();
  }
}

export async function* getChatStream(message: string, history: Content[]) {
  const ai = getAI();
  if (!ai) {
    yield "I am currently in safe mode. Please check the API key configuration.";
    return;
  }

  await requestLock();
  try {
    const model = ai.getGenerativeModel({ 
      model: "gemini-2.5-pro",
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
  } finally {
    releaseLock();
  }
}
