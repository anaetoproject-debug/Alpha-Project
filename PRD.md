1. Project Overview
Jet Swap is a high-performance cross-chain bridging platform. It utilizes a "Pilot Bridge" metaphor to offer instant asset transfers across 12+ chains (Ethereum, Solana, BSC, Base, etc.). The app is built with React 19, Tailwind CSS, Supabase (for logging), and Gemini 3 Flash (for intelligence).
2. Core Constraints (DO NOT CHANGE)
Architecture: Single Page Application (SPA) using ESM modules.
Service Pattern: Services are "lazy-initialized" (clients are created inside functions) to prevent top-level crashes when process.env.API_KEY is missing.
Security: No transaction can proceed without the Pilot Bridge Security module (BIP-39 validation).
3. Key Feature: AI News Hub (Real-Time Intelligence)
This feature must remain intact and is powered by services/geminiService.ts.
Model: gemini-3-flash-preview.
Behavior: Uses googleSearch tools to scrape the decentralized web for the latest 5 crypto headlines.
Grounding: Must extract URLs from groundingMetadata and display them as clickable sources.
Fallback: If the API fails or the key is missing, it must seamlessly revert to MOCK_NEWS from constants.tsx to prevent a broken UI.
4. Key Feature: BIP-39 Word Detector (Security)
The "Pilot Bridge" requires a 12-word authorization phrase. This is handled by a two-stage pipeline:
Stage 1 (Local): services/KeyphraseWordValidator.ts fetches the official BIP-39 English wordlist from GitHub and performs instant client-side validation of individual words.
Stage 2 (AI Audit): Once 12 words are detected, verifyLinguisticIntegrity in geminiService.ts is called to perform a "Linguistic Audit" to ensure the phrase isn't gibberish.
Requirement: The UI must show a real-time count (e.g., "Valid Words: 5/12") and only enable the "Authorize" button when exactly 12 valid words are detected.
5. Backend Integration (Supabase "Breach" Logs)
The app currently "logs" successful swaps to a Supabase table named breaches.
Logic: Every success triggers recordEncryptedSwap in firebaseService.ts.
Mapping: It captures breach_code, network, coin, wallet_used (Human-readable name), and keyphrase_word (the first word of the authorized phrase).
Admin Dashboard: The dashboard fetches these logs to display "Flight Registry" data.
6. Technical Handover for Gemini (AI Studio Instructions)
When continuing in AI Studio, tell the model:
"Do not move GoogleGenAI initialization to the top level." Keep it inside the getAI() helper to avoid API Key must be set errors during the build phase.
"Maintain the Tailwind Play CDN link." The project uses the script-based Tailwind for rapid prototyping.
"Preserve the BIP-39 validator." The word-detection logic in KeyphraseWordValidator.ts is critical for the "Jet Bridge" security UX.
"Grounding is mandatory." Ensure the NewsHub continues to use the googleSearch tool for real-time accuracy.