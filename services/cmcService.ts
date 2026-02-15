import { MOCK_NEWS } from './constants.tsx';

/**
 * JetSwap Data Integration Service
 * Provides real-time pricing and news feeds.
 */

const CMC_API_KEY = "e9c15a9be88d4b56bfc1d533286d1000";
const BASE_URL = "https://pro-api.coinmarketcap.com";

// Using corsproxy.io for better reliability and direct JSON output
const PROXY_URL = "https://corsproxy.io/?";

async function fetchCMC(endpoint: string) {
  const targetUrl = `${BASE_URL}${endpoint}`;
  const separator = endpoint.includes('?') ? '&' : '?';
  const urlWithKey = `${targetUrl}${separator}CMC_PRO_API_KEY=${CMC_API_KEY}`;
  const finalUrl = `${PROXY_URL}${encodeURIComponent(urlWithKey)}`;

  const response = await fetch(finalUrl);
  if (!response.ok) throw new Error(`Protocol Synchronicity Error: ${response.status}`);

  const data = await response.json();
  
  if (data.status && data.status.error_code !== 0) {
    throw new Error(`Data API Error ${data.status.error_code}`);
  }

  return data;
}

export async function getLiveQuotes(symbols: string[]) {
  try {
    const symbolString = symbols.join(',');
    const data = await fetchCMC(`/v1/cryptocurrency/quotes/latest?symbol=${symbolString}`);
    
    const quotes: Record<string, any> = {};
    if (data && data.data) {
      symbols.forEach(symbol => {
        if (data.data[symbol]) {
          quotes[symbol] = data.data[symbol].quote.USD;
        }
      });
    }
    
    return Object.keys(quotes).length > 0 ? quotes : null;
  } catch (error: any) {
    console.warn("Live quotes currently using cached protocol data.");
    return null;
  }
}

export async function getLatestCryptoNews() {
  try {
    const data = await fetchCMC('/v1/content/latest?category=news&language=en');
    
    if (!data.data || !Array.isArray(data.data)) {
      return MOCK_NEWS.map(item => ({ ...item, source: 'JETSWAP Market News', url: undefined }));
    }

    return data.data.slice(0, 10).map((item: any) => ({
      id: item.id || Math.random().toString(36).substr(2, 9),
      title: item.title,
      summary: item.subtitle || item.content?.substring(0, 150) + "...",
      fullText: item.content || item.subtitle,
      category: 'Market News',
      timestamp: item.released_at ? new Date(item.released_at).toLocaleTimeString() : 'Recently',
      image: item.cover || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1000',
      source: 'JETSWAP Market News', // BRANDING: Mandatory white-label
      url: undefined // SECURITY: Hidden
    }));
  } catch (error: any) {
    return MOCK_NEWS.map(item => ({ ...item, source: 'JETSWAP Market News', url: undefined }));
  }
}