/**
 * Robust Web Speech Synthesis & Web Audio Engine for FableSTEM
 * Solves browser bugs:
 * - Chromium 15-second cutoff bug (splits into short sentence chunks)
 * - Chrome/Safari asynchronous getVoices() loading
 * - Stuck/paused speechSynthesis engine recovery
 * - Web Audio API fallback chime generation (guaranteed audio feedback in any browser)
 */

export interface VoicePlaybackOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onChunkStart?: (chunkIndex: number, totalChunks: number, text: string) => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

export interface VoiceController {
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isPlaying: () => boolean;
  isPaused: () => boolean;
}

// Language code mapper
export function getVoiceLanguageCode(lang?: string): string {
  switch (lang) {
    case 'Hindi': return 'hi-IN';
    case 'Tamil': return 'ta-IN';
    case 'Spanish': return 'es-ES';
    case 'French': return 'fr-FR';
    case 'German': return 'de-DE';
    default: return 'en-US';
  }
}

// Split text into natural, digestible chunks (under 160 characters)
export function splitTextIntoChunks(text: string): string[] {
  if (!text) return [];

  // Remove markdown symbols that cause speech synthesizer to stutter
  const clean = text
    .replace(/[*_#`~[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Split by sentence boundaries (. ! ?) and punctuation
  const sentences = clean.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [clean];
  const chunks: string[] = [];

  for (const s of sentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;

    if (trimmed.length <= 160) {
      chunks.push(trimmed);
    } else {
      // Split by commas, semicolons or spaces
      const subParts = trimmed.split(/([,;:]\s+)/);
      let buffer = '';
      for (const part of subParts) {
        if ((buffer + part).length > 150) {
          if (buffer.trim()) chunks.push(buffer.trim());
          buffer = part;
        } else {
          buffer += part;
        }
      }
      if (buffer.trim()) chunks.push(buffer.trim());
    }
  }

  return chunks.length > 0 ? chunks : [clean];
}

// Cached voices list
let cachedVoices: SpeechSynthesisVoice[] = [];

export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    const available = window.speechSynthesis.getVoices();
    if (available && available.length > 0) {
      cachedVoices = available;
      resolve(available);
      return;
    }

    // Wait for voiceschanged event
    const handler = () => {
      const v = window.speechSynthesis.getVoices();
      cachedVoices = v;
      window.speechSynthesis.onvoiceschanged = null;
      resolve(v);
    };

    window.speechSynthesis.onvoiceschanged = handler;

    // Timeout fallback after 350ms
    setTimeout(() => {
      const v = window.speechSynthesis.getVoices();
      cachedVoices = v;
      resolve(v);
    }, 350);
  });
}

// Select best voice matching language
export function findBestVoice(langCode: string): SpeechSynthesisVoice | null {
  if (!cachedVoices || cachedVoices.length === 0) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      cachedVoices = window.speechSynthesis.getVoices();
    }
  }

  if (!cachedVoices || cachedVoices.length === 0) return null;

  const prefix = langCode.slice(0, 2).toLowerCase();

  // 1. Try exact language match with preferred friendly/natural voice
  const natural = cachedVoices.find(
    (v) =>
      v.lang.toLowerCase().startsWith(prefix) &&
      (v.name.includes('Natural') ||
        v.name.includes('Google') ||
        v.name.includes('Samantha') ||
        v.name.includes('Karen') ||
        v.name.includes('Moira') ||
        v.name.includes('Daniel') ||
        v.name.includes('en-US'))
  );
  if (natural) return natural;

  // 2. Try any voice matching language prefix
  const anyLang = cachedVoices.find((v) => v.lang.toLowerCase().startsWith(prefix));
  if (anyLang) return anyLang;

  // 3. Fallback to default or first available
  const defaultVoice = cachedVoices.find((v) => v.default);
  return defaultVoice || cachedVoices[0] || null;
}

// Web Audio API Sound Chime Generator (Works 100% even without TTS voices)
export function playWebAudioChime(type: 'welcome' | 'success' | 'click' | 'star' | 'test' = 'test'): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === 'test' || type === 'welcome') {
      // Pleasant 3-note ascending chime (C5 - E5 - G5)
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.36);
      });
    } else if (type === 'success' || type === 'star') {
      // High sparkle chime
      const notes = [587.33, 880.0, 1174.66];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0, now + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.3);
      });
    }
  } catch (err) {
    console.warn('Web Audio Chime error:', err);
  }
}

// Strong reference holder to prevent V8 garbage-collecting active utterances mid-speech
const activeUtterances = new Set<SpeechSynthesisUtterance>();

/**
 * Robust Story Speech Player
 * Manages chunking, watchdog pinging, pause/resume, and boundary events
 */
export class RobustVoiceEngine {
  private chunks: string[] = [];
  private currentChunkIndex: number = 0;
  private isSpeakingActive: boolean = false;
  private isPausedState: boolean = false;
  private watchdogTimer: any = null;
  private chunkTimeoutTimer: any = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private options: VoicePlaybackOptions = {};

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      loadVoices();
    }
  }

  public isAvailable(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public async speakText(text: string, options: VoicePlaybackOptions = {}): Promise<void> {
    if (!this.isAvailable()) {
      options.onError?.(new Error('Speech Synthesis not supported in this browser.'));
      return;
    }

    // Stop any existing playback
    this.stop();

    // Cancel hung states and allow Chromium event loop tick to finish cancellation
    try {
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
        await new Promise((r) => setTimeout(r, 70));
      }
    } catch {}

    await loadVoices();

    this.options = options;
    this.chunks = splitTextIntoChunks(text);
    this.currentChunkIndex = 0;
    this.isSpeakingActive = true;
    this.isPausedState = false;

    if (this.chunks.length === 0) {
      this.isSpeakingActive = false;
      options.onEnd?.();
      return;
    }

    this.startWatchdog();
    options.onStart?.();

    // Start speaking first chunk
    this.speakNextChunk();
  }

  private clearChunkTimeout(): void {
    if (this.chunkTimeoutTimer) {
      clearTimeout(this.chunkTimeoutTimer);
      this.chunkTimeoutTimer = null;
    }
  }

  private speakNextChunk(): void {
    this.clearChunkTimeout();

    if (!this.isSpeakingActive || this.currentChunkIndex >= this.chunks.length) {
      this.cleanup();
      this.options.onEnd?.();
      return;
    }

    const chunkText = this.chunks[this.currentChunkIndex];
    const langCode = getVoiceLanguageCode(this.options.lang);

    try {
      // Ensure engine is unpaused
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(chunkText);
      this.currentUtterance = utterance;
      // CRITICAL FIX: Keep reference in Set to prevent V8 garbage collection
      activeUtterances.add(utterance);

      utterance.lang = langCode;
      utterance.rate = this.options.rate ?? 0.95;
      utterance.pitch = this.options.pitch ?? 1.05;
      utterance.volume = this.options.volume ?? 1.0;

      const voice = findBestVoice(langCode);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        this.options.onChunkStart?.(
          this.currentChunkIndex,
          this.chunks.length,
          chunkText
        );
      };

      utterance.onend = () => {
        activeUtterances.delete(utterance);
        this.clearChunkTimeout();
        if (!this.isSpeakingActive) return;
        this.currentChunkIndex++;
        this.speakNextChunk();
      };

      utterance.onerror = (event: any) => {
        activeUtterances.delete(utterance);
        this.clearChunkTimeout();
        // If explicitly stopped, return
        if (!this.isSpeakingActive) {
          return;
        }
        console.warn('Speech chunk notification:', event?.error, chunkText);
        // Advance to next chunk instead of dying completely
        this.currentChunkIndex++;
        this.speakNextChunk();
      };

      window.speechSynthesis.speak(utterance);

      // Force resume in Chromium
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      // Safeguard chunk watchdog in case browser never fires onend
      const maxExpectedDurationMs = Math.max(chunkText.length * 200, 6000);
      this.chunkTimeoutTimer = setTimeout(() => {
        if (this.isSpeakingActive && !this.isPausedState) {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          } else {
            console.warn('Chunk timed out, advancing cleanly to next sentence.');
            activeUtterances.delete(utterance);
            this.currentChunkIndex++;
            this.speakNextChunk();
          }
        }
      }, maxExpectedDurationMs);

    } catch (err) {
      console.warn('SpeechSynthesis speak error:', err);
      this.currentChunkIndex++;
      this.speakNextChunk();
    }
  }

  // Periodic watchdog keeps Chrome from sleeping on SpeechSynthesis
  private startWatchdog(): void {
    this.stopWatchdog();
    this.watchdogTimer = setInterval(() => {
      if (
        this.isSpeakingActive &&
        !this.isPausedState &&
        typeof window !== 'undefined' &&
        'speechSynthesis' in window
      ) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }
    }, 4000);
  }

  private stopWatchdog(): void {
    if (this.watchdogTimer) {
      clearInterval(this.watchdogTimer);
      this.watchdogTimer = null;
    }
  }

  public pause(): void {
    if (!this.isAvailable()) return;
    try {
      window.speechSynthesis.pause();
      this.isPausedState = true;
    } catch (err) {
      console.warn('SpeechSynthesis pause error:', err);
    }
  }

  public resume(): void {
    if (!this.isAvailable()) return;
    try {
      window.speechSynthesis.resume();
      this.isPausedState = false;
    } catch (err) {
      console.warn('SpeechSynthesis resume error:', err);
    }
  }

  public stop(): void {
    this.cleanup();
    if (!this.isAvailable()) return;
    try {
      window.speechSynthesis.cancel();
    } catch (err) {
      console.warn('SpeechSynthesis cancel error:', err);
    }
  }

  private cleanup(): void {
    this.isSpeakingActive = false;
    this.isPausedState = false;
    this.currentUtterance = null;
    this.clearChunkTimeout();
    activeUtterances.clear();
    this.stopWatchdog();
  }

  public isPlaying(): boolean {
    return this.isSpeakingActive && !this.isPausedState;
  }

  public isPaused(): boolean {
    return this.isPausedState;
  }

  public getCurrentChunkIndex(): number {
    return this.currentChunkIndex;
  }

  public getTotalChunks(): number {
    return this.chunks.length;
  }
}

// Global Singleton Instance
export const globalVoiceEngine = new RobustVoiceEngine();
