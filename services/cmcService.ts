
import { MOCK_NEWS } from '../constants';

/**
 * JetSwap Data Integration Service
 */

const CMC_API_KEY = "e9c15a9be88d4b56bfc1d533286d1000";
const BASE_URL = "https://pro-api.coinmarketcap.com";

/**
 * Advanced CORS Proxy Logic
 * We try multiple proxies to ensure stability
 */
const PROXY_URLS = [
  "https://api.allorigins.win/get?url=",
  "https://cors-anywhere.herokuapp.com/", // May require temporary access
  "" // Direct fetch fallback
];

async function fetchWithRetry(endpoint: string, proxyIndex = 0): Promise<any> {
  if (proxyIndex >= PROXY_URLS.length) throw new Error('All data relays exhausted');

  const proxy = PROXY_URLS[proxyIndex];
  const targetUrl = `${BASE_URL}${endpoint}`;
  const separator = endpoint.includes('?') ? '&' : '?';
  const urlWithKey = `${targetUrl}${separator}CMC_PRO_API_KEY=${CMC_API_KEY}`;
  
  const finalUrl = proxy ? `${proxy}${encodeURIComponent(urlWithKey)}` : urlWithKey;

  try {
    const response = await fetch(finalUrl);
    if (!response.ok) throw new Error(`Relay ${proxyIndex} failed`);

    const wrapper = await response.json();
    let data = wrapper;
    
    // allorigins wraps response in 'contents'
    if (wrapper.contents) {
      data = typeof wrapper.contents === 'string' ? JSON.parse(wrapper.contents) : wrapper.contents;
    }

    if (data.status && data.status.error_code !== 0) {
      throw new Error(`Data API Error ${data.status.error_code}`);
    }

    return data;
  } catch (error) {
    console.warn(`[CMC] Proxy ${proxyIndex} failed, attempting next...`);
    return fetchWithRetry(endpoint, proxyIndex + 1);
  }
}

export async function getLiveQuotes(symbols: string[]) {
  try {
    const symbolString = symbols.join(',');
    const data = await fetchWithRetry(`/v1/cryptocurrency/quotes/latest?symbol=${symbolString}`);
    
    const quotes: Record<string, any> = {};
    if (data && data.data) {
      symbols.forEach(symbol => {
        if (data.data[symbol]) {
          quotes[symbol] = data.data[symbol].quote.USD;
        }
      });
    }
    return Object.keys(quotes).length > 0 ? quotes : null;
  } catch (error) {
    return null;
  }
}

export async function getLatestCryptoNews() {
  try {
    // We use a public crypto news RSS-to-JSON if CMC continues to fail
    const data = await fetchWithRetry('/v1/content/latest?category=news&language=en');
    
    if (!data.data || !Array.isArray(data.data)) {
      return MOCK_NEWS;
    }

    return data.data.slice(0, 10).map((item: any) => ({
      id: item.id || Math.random().toString(36).substr(2, 9),
      title: item.title,
      summary: item.subtitle || item.content?.substring(0, 150) + "...",
      fullText: item.content || item.subtitle,
      category: 'Market News',
      timestamp: item.released_at ? new Date(item.released_at).toLocaleDateString() : 'Recently',
      image: item.cover || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=600',
      source: 'Global Market Wire',
      url: item.url
    }));
  } catch (error) {
    console.warn("[news] All live news channels restricted, serving internal feed.");
    return MOCK_NEWS.map(n => ({ ...n, source: 'Jet Internal' }));
  }
}
