
/**
 * Isolated Keyphrase Word Validation Module
 * Tier 1: Local Dictionary Check (The "Speed" Layer)
 * Tier 2: Linguistic Integrity (The "AI Audit" Layer)
 */

import { verifyLinguisticIntegrity } from './geminiService.ts';

class KeyphraseWordValidator {
  private static instance: KeyphraseWordValidator;
  private wordBank: Set<string> = new Set();
  private isLoaded: boolean = false;
  private isLoading: boolean = false;
  private cache: Map<string, boolean> = new Map();

  private constructor() {}

  public static getInstance(): KeyphraseWordValidator {
    if (!KeyphraseWordValidator.instance) {
      KeyphraseWordValidator.instance = new KeyphraseWordValidator();
    }
    return KeyphraseWordValidator.instance;
  }

  /**
   * Tier 1: Lazy loads the official BIP-39 English dataset (2,048 words)
   */
  private async loadWordBank(): Promise<void> {
    if (this.isLoaded || this.isLoading) return;
    this.isLoading = true;

    try {
      const response = await fetch('https://raw.githubusercontent.com/bitcoin/bips/master/bip-0039/english.txt');
      if (!response.ok) throw new Error('Failed to fetch word bank');
      
      const text = await response.text();
      const words = text.split('\n').map(w => w.trim().toLowerCase()).filter(w => w.length > 0);
      
      this.wordBank = new Set(words);
      this.isLoaded = true;
      console.log(`[Validator] Tier 1 Word bank initialized: ${words.length} entries.`);
    } catch (error) {
      console.error('[Validator] External dataset fetch failed:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Validates a full phrase by checking words individually in real-time (Tier 1)
   * Then triggers Tier 2 AI Audit if word count is exactly 12.
   */
  public async validatePhrase(phrase: string): Promise<{ 
    valid: boolean; 
    validCount: number; 
    invalidWords: string[];
    isAuditing: boolean;
  }> {
    const cleanPhrase = phrase.trim().toLowerCase();
    const words = cleanPhrase.split(/\s+/).filter(w => w.length > 0);
    
    if (words.length === 0) return { valid: false, validCount: 0, invalidWords: [], isAuditing: false };

    // Tier 1: Local Lookup
    await this.loadWordBank();
    
    let validCount = 0;
    const invalidWords: string[] = [];

    for (const word of words) {
      if (this.wordBank.has(word)) {
        validCount++;
      } else {
        invalidWords.push(word);
      }
    }

    // Tier 2: AI Linguistic Audit
    // Only triggered when exactly 12 words are detected by Tier 1
    let finalValid = false;
    if (words.length === 12 && invalidWords.length === 0) {
        // This is a "Verifying..." state for the UI
        const aiAudit = await verifyLinguisticIntegrity(phrase);
        finalValid = aiAudit.valid;
        validCount = aiAudit.validCount;
    }

    return {
      valid: finalValid,
      validCount,
      invalidWords,
      isAuditing: false
    };
  }
}

export const validator = KeyphraseWordValidator.getInstance();
