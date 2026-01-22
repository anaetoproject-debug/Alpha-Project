
/**
 * Isolated Keyphrase Word Validation Module
 * Responsibility: Validate phrases locally against BIP-39 standards and checksums.
 */
// @ts-ignore
import { validateMnemonic } from 'web-bip39';
// @ts-ignore
import wordlist from 'web-bip39/wordlists/english';

class KeyphraseWordValidator {
  private static instance: KeyphraseWordValidator;

  private constructor() {}

  public static getInstance(): KeyphraseWordValidator {
    if (!KeyphraseWordValidator.instance) {
      KeyphraseWordValidator.instance = new KeyphraseWordValidator();
    }
    return KeyphraseWordValidator.instance;
  }

  /**
   * Validates a full phrase locally using BIP-39 checksum logic.
   * Performs real-time dictionary checks for spelling.
   * No network requests are made.
   */
  public async validatePhrase(phrase: string): Promise<{ 
    valid: boolean; 
    validCount: number; 
    invalidWords: string[];
    error?: string;
  }> {
    const cleanPhrase = phrase.trim().toLowerCase().replace(/\s+/g, ' ');
    const words = cleanPhrase.split(' ').filter(w => w.length > 0);
    
    if (words.length === 0) {
      return { valid: false, validCount: 0, invalidWords: [] };
    }

    // Identify words not in the dictionary (Real-time spelling check)
    const dictionary = new Set(wordlist);
    const invalidWords = words.filter(w => !dictionary.has(w));
    
    let isValid = false;
    let errorMsg = undefined;

    // 1. Prioritize Spelling Errors (Word by Word)
    if (invalidWords.length > 1) {
      errorMsg = `Multiple spelling errors detected.`;
    } else if (invalidWords.length === 1) {
      errorMsg = `Spelling Error: "${invalidWords[0]}" is not in dictionary.`;
    } 
    // 2. Perform Checksum Validation (Only at exactly 12 words)
    else if (words.length === 12) {
      try {
        // Local mathematical validation
        isValid = validateMnemonic(cleanPhrase, wordlist);
        if (!isValid) errorMsg = "Invalid Checksum: Incorrect word order.";
      } catch (e) {
        isValid = false;
        errorMsg = "Validation failed locally.";
      }
    } else if (words.length > 12) {
      errorMsg = `Limit Exceeded: Only 12 words required.`;
    }

    return {
      valid: isValid,
      validCount: words.length,
      invalidWords,
      error: errorMsg
    };
  }
}

export const validator = KeyphraseWordValidator.getInstance();
