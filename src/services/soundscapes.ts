/**
 * Web Audio Ambient Soundscapes & Sound Effects Engine
 * Pure synthesized Web Audio API (zero external mp3 assets needed, zero network requests, instant playback)
 * Generates natural ambient soundscapes (Rain & Water drops, Deep Ocean waves, Whispering Forest breeze, Cosmic Pulsar)
 * Generates delightful UI audio effects (pencil stroke, paint splatter, sticker pop, fanfare, button blip)
 */

class WebAudioSoundscapeManager {
  private ctx: AudioContext | null = null;
  private currentAmbientNode: {
    stop: () => void;
    id: string;
  } | null = null;
  private masterGain: GainNode | null = null;
  private volume: number = 0.25;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Play micro UI sound effects
  public playSoundEffect(type: 'pop' | 'brush' | 'sparkle' | 'sticker' | 'clear' | 'badge'): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === 'pop') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.11);
      } else if (type === 'brush') {
        // Soft white noise puff for brush stroke
        const bufferSize = ctx.sampleRate * 0.08;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.Q.setValueAtTime(1.5, now);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
      } else if (type === 'sticker') {
        // Double pleasant pop
        [0, 0.07].forEach((delay, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(idx === 0 ? 520 : 780, now + delay);
          gain.gain.setValueAtTime(0.2, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + delay);
          osc.stop(now + delay + 0.13);
        });
      } else if (type === 'sparkle') {
        const freqs = [659.25, 830.61, 987.77, 1318.51];
        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + idx * 0.05);
          gain.gain.setValueAtTime(0.12, now + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.22);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.25);
        });
      } else if (type === 'clear') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch {}
  }

  // Play relaxing ambient focus sounds
  public playAmbient(type: 'rain' | 'ocean' | 'forest' | 'space'): void {
    try {
      this.stopAmbient();
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.setValueAtTime(this.volume, now);
      master.connect(ctx.destination);
      this.masterGain = master;

      let isRunning = true;
      let scheduledTimeouts: any[] = [];

      if (type === 'rain') {
        // Pink/white noise filtered + random water drop chirps
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          lastOut = (lastOut + 0.02 * white) / 1.02;
          data[i] = lastOut * 3.5;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const lowpass = ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.setValueAtTime(800, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.35, now);

        noise.connect(lowpass);
        lowpass.connect(noiseGain);
        noiseGain.connect(master);
        noise.start();

        // Water droplet interval
        const dropInterval = setInterval(() => {
          if (!isRunning) return;
          try {
            const dropOsc = ctx.createOscillator();
            const dropGain = ctx.createGain();
            const dropNow = ctx.currentTime;
            dropOsc.type = 'sine';
            const fStart = 900 + Math.random() * 600;
            dropOsc.frequency.setValueAtTime(fStart, dropNow);
            dropOsc.frequency.exponentialRampToValueAtTime(fStart + 500, dropNow + 0.07);
            dropGain.gain.setValueAtTime(0.04, dropNow);
            dropGain.gain.exponentialRampToValueAtTime(0.001, dropNow + 0.08);
            dropOsc.connect(dropGain);
            dropGain.connect(master);
            dropOsc.start(dropNow);
            dropOsc.stop(dropNow + 0.09);
          } catch {}
        }, 320);

        this.currentAmbientNode = {
          id: type,
          stop: () => {
            isRunning = false;
            clearInterval(dropInterval);
            try {
              noise.stop();
              noise.disconnect();
            } catch {}
          },
        };
      } else if (type === 'ocean') {
        // Modulated lowpass noise swell
        const bufferSize = ctx.sampleRate * 3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.8;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(350, now);

        // LFO for ocean wave swells
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.12, now); // 8-second wave period
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(220, now);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();

        const swellGain = ctx.createGain();
        swellGain.gain.setValueAtTime(0.4, now);

        noise.connect(filter);
        filter.connect(swellGain);
        swellGain.connect(master);
        noise.start();

        this.currentAmbientNode = {
          id: type,
          stop: () => {
            try {
              lfo.stop();
              noise.stop();
              noise.disconnect();
            } catch {}
          },
        };
      } else if (type === 'forest') {
        // Soft rustle + gentle harmonic bird-like chimes
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.4;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(700, now);
        filter.Q.setValueAtTime(0.6, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.2, now);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(master);
        noise.start();

        const birdInterval = setInterval(() => {
          if (!isRunning) return;
          try {
            const birdOsc = ctx.createOscillator();
            const birdGain = ctx.createGain();
            const t = ctx.currentTime;
            birdOsc.type = 'sine';
            const baseF = 1800 + Math.random() * 800;
            birdOsc.frequency.setValueAtTime(baseF, t);
            birdOsc.frequency.exponentialRampToValueAtTime(baseF + 400, t + 0.05);
            birdOsc.frequency.exponentialRampToValueAtTime(baseF - 200, t + 0.12);
            birdGain.gain.setValueAtTime(0.04, t);
            birdGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
            birdOsc.connect(birdGain);
            birdGain.connect(master);
            birdOsc.start(t);
            birdOsc.stop(t + 0.16);
          } catch {}
        }, 2200);

        this.currentAmbientNode = {
          id: type,
          stop: () => {
            isRunning = false;
            clearInterval(birdInterval);
            try {
              noise.stop();
              noise.disconnect();
            } catch {}
          },
        };
      } else if (type === 'space') {
        // Cosmic dreamy pad
        const freqs = [110, 164.81, 220, 329.63];
        const oscs: OscillatorNode[] = [];
        freqs.forEach((f) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now);
          gain.gain.setValueAtTime(0.08, now);
          osc.connect(gain);
          gain.connect(master);
          osc.start();
          oscs.push(osc);
        });

        this.currentAmbientNode = {
          id: type,
          stop: () => {
            oscs.forEach((o) => {
              try {
                o.stop();
                o.disconnect();
              } catch {}
            });
          },
        };
      }
    } catch (e) {
      console.warn('Ambient sound playback error:', e);
    }
  }

  public stopAmbient(): void {
    if (this.currentAmbientNode) {
      try {
        this.currentAmbientNode.stop();
      } catch {}
      this.currentAmbientNode = null;
    }
    if (this.masterGain) {
      try {
        this.masterGain.disconnect();
      } catch {}
      this.masterGain = null;
    }
  }

  public getActiveAmbient(): string | null {
    return this.currentAmbientNode ? this.currentAmbientNode.id : null;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }
}

export const soundscapeEngine = new WebAudioSoundscapeManager();
