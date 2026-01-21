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

    // Identify words not in the dictionary
    const dictionary = new Set(wordlist);
    const invalidWords = words.filter(w => !dictionary.has(w));
    const validCount = words.length - invalidWords.length;

    // Strict BIP-39 validation only runs if we have exactly 12 words
    let isValid = false;
    let errorMsg = undefined;

    if (words.length === 12) {
      if (invalidWords.length > 0) {
        errorMsg = "Spelling Error: Words not in BIP39 dictionary.";
      } else {
        try {
          // Local mathematical validation
          isValid = validateMnemonic(cleanPhrase, wordlist);
          if (!isValid) errorMsg = "Invalid Checksum: Incorrect word order.";
        } catch (e) {
          isValid = false;
          errorMsg = "Validation failed locally.";
        }
      }
    }

    return {
      valid: isValid,
      validCount: words.length, // The count displayed is total words typed
      invalidWords,
      error: errorMsg
    };
  }
}

export const validator = KeyphraseWordValidator.getInstance();