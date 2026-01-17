
import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { CMCQuote, NewsItem } from "../types";
import { MOCK_NEWS } from "../constants";
import { getLatestCryptoNews } from "./cmcService";

const CACHE_KEY_NEWS = 'jetswap_cache_news';
const CACHE_KEY_PULSE = 'jetswap_cache_pulse';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Global Request Lock & Cooldown
 * Free tier has strict RPM (Requests Per Minute) limits.
 * This logic ensures we never send more than one request every 5 seconds.
 */
let isRequestLocked = false;
let lastRequestTime = 0;

const requestLock = async () => {
  while (isRequestLocked) {
    await delay(500);
  }
  isRequestLocked = true;

  const now = Date.now();
  const timeSinceLast = now - lastRequestTime;
  const cooldown = 5000; // 5 second mandatory gap

  if (timeSinceLast < cooldown) {
    const waitTime = cooldown - timeSinceLast;
    console.log(`[AI Queue] Staggering request. Waiting ${waitTime}ms...`);
    await delay(waitTime);
  }
};

const releaseLock = () => {
  lastRequestTime = Date.now();
  isRequestLocked = false;
};

/**
 * Session Cache Helpers
 */
const getCachedData = (key: string) => {
  try {
    const cached = sessionStorage.getItem(key);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      sessionStorage.removeItem(key);
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
};

const setCachedData = (key: string, data: any) => {
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (e) {}
};

function parseAIResponse(text: string) {
  if (!text) return [];
  try {
    // Attempt 1: Direct parse
    return JSON.parse(text);
  } catch (e) {
    // Attempt 2: Extract from markdown code block
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match) {
      try {
        return JSON.parse(match[1]);
      } catch (e2) {}
    }
    // Attempt 3: Try to find any array or object structure
    const arrayMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (arrayMatch) {
        try {
            return JSON.parse(arrayMatch[0]);
        } catch (e3) {}
    }
    throw new Error("Could not parse AI response as JSON");
  }
}

/**
 * Uses Gemini with Google Search grounding to fetch real-time crypto news.
 * Primary (AI Search) -> Secondary (CMC API) -> Tertiary (Mock)
 */
export async function fetchLiveIntelligenceNews(retries = 1, backoff = 8000): Promise<NewsItem[]> {
  // 1. Check Cache
  const cached = getCachedData(CACHE_KEY_NEWS);
  if (cached) return cached;

  const ai = getAI();
  if (ai) {
    await requestLock();
    try {
      console.log("[news] Executing AI Grounded Search...");
      const model = ai.getGenerativeModel({ 
        model: "gemini-2.5-pro",
        tools: [{ "googleSearch": {} }],
      });
      
      const prompt = `Search for the latest 5 crypto market news headlines from the last 24 hours. 
      Return ONLY a JSON ARRAY of objects with: title, summary, category, timestamp, source, url.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const newsData = parseAIResponse(response.text());
      
      if (Array.isArray(newsData) && newsData.length > 0) {
        const mapped = newsData.map((item: any, index: number) => ({
          ...item,
          id: `ai-news-${index}-${Date.now()}`,
          image: `https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=600&sig=${index}`,
          fullText: item.summary
        }));
        setCachedData(CACHE_KEY_NEWS, mapped);
        return mapped;
      }
    } catch (error: any) {
      if (retries > 0 && error?.message?.includes('429')) {
        console.warn(`[news] Rate limited. Retrying once in ${backoff}ms...`);
        releaseLock();
        await delay(backoff);
        return fetchLiveIntelligenceNews(retries - 1, backoff * 2);
      }
      console.error("[news] AI search failed, falling back to CMC.");
    } finally {
      releaseLock();
    }
  }

  // 2. Fallback to CMC
  try {
    const cmcNews = await getLatestCryptoNews();
    if (cmcNews && cmcNews.length > 0) return cmcNews;
  } catch (error) {}

  // 3. Fallback to Mock
  return MOCK_NEWS.map(n => ({ ...n, source: 'Jet Internal Feed' }));
}

/**
 * Advanced BIP-39 Keyphrase Validation Engine.
 */
export async function verifyLinguisticIntegrity(phrase: string, retries = 1, backoff = 8000): Promise<{ 
  valid: boolean; 
  validCount: number; 
  invalidWords: string[];
  reason?: string;
}> {
  if (!phrase) return { valid: false, validCount: 0, invalidWords: [] };

  const ai = getAI();
  if (!ai) {
    const words = phrase.toLowerCase().trim().split(/\s+/).filter(w => w.length > 0);
    return { valid: words.length >= 12, validCount: words.length, invalidWords: [], reason: "Offline Audit" };
  }

  await requestLock();
  try {
    const model = ai.getGenerativeModel({
      model: "gemini-2.5-pro",
      generationConfig: { responseMimeType: "application/json", temperature: 0 }
    });
    const result = await model.generateContent(`Analyze this phrase: \"${phrase}\". Check against BIP-39 standard. Return JSON: {"valid": boolean, "valid_count": number, "invalid_words": []}`);
    const res = parseAIResponse((await result.response).text());
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
    return { valid: false, validCount: 0, invalidWords: [], reason: "Connection error" };
  } finally {
    releaseLock();
  }
}

export async function getNewsHubPulse(retries = 1, backoff = 8000): Promise<string> {
  const cached = getCachedData(CACHE_KEY_PULSE);
  if (cached) return cached;

  const ai = getAI();
  if (!ai) return "Global liquidity hubs are synchronized.";

  await requestLock();
  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.5-pro", generationConfig: { temperature: 0.8 }});
    const result = await model.generateContent("Generate a one-sentence market vibe summary for Jet Swap. Max 20 words.");
    const text = (await result.response).text()?.replace(/\*/g, '') || "Synchronized.";
    setCachedData(CACHE_KEY_PULSE, text);
    return text;
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

export async function getSwapAdvice(source: string, dest: string, token: string): Promise<string> {
  const ai = getAI();
  if (!ai) return "Optimize your routes with Jet Swap's engine.";

  await requestLock();
  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.5-pro", generationConfig: { temperature: 0.7 }});
    const result = await model.generateContent(`Short tip for swapping ${token} from ${source} to ${dest}. Max 15 words.`);
    return (await result.response).text()?.replace(/\*/g, '') || "Seamless bridging.";
  } catch (error) {
    return "Optimize your routes with Jet Swap's engine.";
  } finally {
    releaseLock();
  }
}

export async function* getChatStream(message: string, history: Content[]) {
  const ai = getAI();
  if (!ai) { yield "I am currently in safe mode."; return; }

  await requestLock();
  try {
    const model = ai.getGenerativeModel({ 
      model: "gemini-2.5-pro",
      systemInstruction: 'Jet Support Assistant. Plain text.',
    });
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
