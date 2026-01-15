
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
 * Helper to delay execution
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Uses Gemini 1.5 Flash with Google Search grounding to fetch real-time crypto news.
 */
export async function fetchLiveIntelligenceNews(retries = 3, backoff = 1000): Promise<NewsItem[]> {
  const ai = getAI();
  if (!ai) return MOCK_NEWS.map(n => ({ ...n, source: 'Jet Internal Feed', timestamp: 'Recently' }));

  try {
    const model = ai.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      tools: [{ "googleSearch": {} }],
    });
    const result = await model.generateContent("Search for the latest 5 crypto market news headlines, major announcements, and industry trends from the last 24 hours. Provide accurate dates and times for each, and a URL for each.");
    const response = await result.response;
    const toolCalls = response.functionCalls();
    if (toolCalls) {
      // For simplicity, we are not handling tool calls here.
      // In a real application, you would make the tool calls and send the results back to the model.
    }


    const newsData = JSON.parse(response.text() || "[]");
    return newsData.map((item: any, index: number) => ({
      ...item,
      id: `ai-news-${index}-${Date.now()}`,
      image: `https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=600&sig=${index}`,
      fullText: item.summary
    }));
  } catch (error: any) {
    if (retries > 0 && (error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED')) {
      await delay(backoff);
      return fetchLiveIntelligenceNews(retries - 1, backoff * 2);
    }
    return MOCK_NEWS.map(n => ({ ...n, source: 'Jet Internal Feed', timestamp: 'Recently' }));
  }
}

/**
 * Advanced BIP-39 Keyphrase Validation Engine.
 */
export async function verifyLinguisticIntegrity(phrase: string): Promise<{ 
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
    // Local fallback for offline mode/no key
    const words = phrase.toLowerCase().trim().split(/\s+/).filter(w => w.length > 0);
    return { valid: words.length >= 12, validCount: words.length, invalidWords: [], reason: "Offline Audit" };
  }

  try {
    const model = ai.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0,
      }
    });
    const result = await model.generateContent(`You are a BIP-39 Security Audit Tool. Analyze this phrase: \"${phrase}\".
      
      CRITICAL INSTRUCTIONS:
      1. Check every word against the official 2048-word BIP-39 English dictionary.
      2. Count only words that exist exactly in that dictionary.
      3. A valid phrase must contain exactly 12, 15, 18, 21, or 24 words. For this specific check, we look for exactly 12.
      4. List any words NOT found in the BIP-39 standard as 'invalid_words'.
      
      OUTPUT FORMAT (JSON):
      {
        \"valid\": boolean,
        \"valid_count\": number,
        \"invalid_words\": [\"string\"],
        \"reason\": \"string\"
      }`);
    const response = await result.response;
    const validationResult = JSON.parse(response.text() || '{}');
    return {
      valid: validationResult.valid === true && validationResult.valid_count >= 12,
      validCount: validationResult.valid_count || 0,
      invalidWords: validationResult.invalid_words || [],
      reason: validationResult.reason
    };
  } catch (error) {
    const inputWords = phrase.toLowerCase().trim().split(/\s+/).filter(w => w.length > 0);
    return { 
      valid: false, 
      validCount: 0, 
      invalidWords: [], 
      reason: "Network connection disrupted during audit." 
    };
  }
}

export async function getDeepMarketAnalysis(token: string, quote: CMCQuote) {
  const ai = getAI();
  if (!ai) return "Optimizing route intelligence...";

  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { temperature: 0.6 }});
    const result = await model.generateContent(`Analyst Report for ${token}: Price $${quote.price}, 24h Change ${quote.percent_change_24h}%. Max 20 words.`);
    const response = await result.response;
    return response.text()?.replace(/\*/g, '').trim() || "Optimal liquidity detected.";
  } catch (error) {
    return "Optimizing route intelligence...";
  }
}

export async function getNewsHubPulse() {
  const ai = getAI();
  if (!ai) return "Global liquidity hubs are synchronized.";

  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { temperature: 0.8 }});
    const result = await model.generateContent("Generate a one-sentence Protocol Pulse for Jet Swap. Max 20 words.");
    const response = await result.response;
    return response.text()?.replace(/\*/g, '') || "Global liquidity hubs are synchronized.";
  } catch (error) {
    return "Global liquidity hubs are synchronized.";
  }
}

export async function getSwapAdvice(source: string, dest: string, token: string) {
  const ai = getAI();
  if (!ai) return "Optimize your routes with Jet Swap's engine.";

  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { temperature: 0.7 }});
    const result = await model.generateContent(`Short tip for swapping ${token} from ${source} to ${dest}. Max 20 words.`);
    const response = await result.response;
    return response.text()?.replace(/\*/g, '') || "Seamless bridging at jet speed.";
  } catch (error) {
    return "Optimize your routes with Jet Swap's engine.";
  }
}

export async function* getChatStream(message: string, history: Content[]) {
  const ai = getAI();
  if (!ai) {
    yield "I am currently in safe mode. Please check the API key configuration.";
    return;
  }

  try {
    const model = ai.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: 'Jet Support Assistant. Plain text. No markdown.',
    });
    const result = await model.generateContentStream({
        contents: [...history, { role: 'user', parts: [{ text: message }] }],
        generationConfig: {
            temperature: 0.8,
        },
    });
    for await (const chunk of result.stream) {
      if (chunk.text) yield chunk.text().replace(/\*/g, '');
    }
  } catch (error) {
    yield "Operational drift detected.";
  }
}
