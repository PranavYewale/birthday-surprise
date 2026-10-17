// ==============================================================================
// 🎵 WEB AUDIO SYNTHESIZER & SOUND EFFECTS
// Zero dependencies - works completely offline or online without broken MP3 links!
// ==============================================================================

class BirthdayAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isPlayingBgm = false;
    this.bgmAudioElement = null;
    this.timerIds = [];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.bgmAudioElement) {
      this.bgmAudioElement.muted = this.isMuted;
    }
    return this.isMuted;
  }

  // Play a musical tone with envelope (Music box / Chime timbre)
  playTone(freq, duration = 0.4, timeOffset = 0, type = 'sine') {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const startTime = this.ctx.currentTime + timeOffset;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    // Chime envelope: Instant strike, sweet exponential decay
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // Sound effect: Balloon Pop
  playPop() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const startTime = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, startTime);
    osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.08);

    gain.gain.setValueAtTime(0.35, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.08);
  }

  // Sound effect: Blowing out candles (whoosh / wind noise)
  playBlowOut() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.5));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(150, this.ctx.currentTime + 0.4);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  }

  // Sound effect: Fanfare / Victory chords
  playFanfare() {
    if (this.isMuted) return;
    const notes = [
      { f: 523.25, d: 0.2, t: 0 },    // C5
      { f: 659.25, d: 0.2, t: 0.15 }, // E5
      { f: 783.99, d: 0.2, t: 0.3 },  // G5
      { f: 1046.50, d: 0.6, t: 0.45 } // C6
    ];
    notes.forEach(n => this.playTone(n.f, n.d, n.t, 'triangle'));
  }

  // Sound effect: Scratch Card reveal ding
  playDing() {
    this.playTone(1200, 0.5, 0, 'sine');
  }

  // Play the classic Happy Birthday Melody in a music-box timbre!
  playHappyBirthdayMelody(loop = true) {
    if (this.isMuted) return;
    this.init();

    // Custom BGM if user specified one
    if (window.BIRTHDAY_CONFIG && window.BIRTHDAY_CONFIG.bgmUrl) {
      if (!this.bgmAudioElement) {
        this.bgmAudioElement = new Audio(window.BIRTHDAY_CONFIG.bgmUrl);
        this.bgmAudioElement.loop = loop;
      }
      this.bgmAudioElement.play().catch(() => {});
      this.isPlayingBgm = true;
      return;
    }

    // Happy Birthday note frequencies
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88, C5 = 523.25;
    const Bb4 = 466.16;

    // (note, duration in seconds)
    const melody = [
      [C4, 0.35], [C4, 0.35], [D4, 0.7], [C4, 0.7], [F4, 0.7], [E4, 1.2],
      [C4, 0.35], [C4, 0.35], [D4, 0.7], [C4, 0.7], [G4, 0.7], [F4, 1.2],
      [C4, 0.35], [C4, 0.35], [C5, 0.7], [A4, 0.7], [F4, 0.7], [E4, 0.7], [D4, 0.9],
      [Bb4, 0.35], [Bb4, 0.35], [A4, 0.7], [F4, 0.7], [G4, 0.7], [F4, 1.4]
    ];

    let currentTime = 0;
    this.clearMelodyTimers();

    melody.forEach(([freq, dur]) => {
      const tid = setTimeout(() => {
        if (!this.isMuted && this.isPlayingBgm) {
          this.playTone(freq, dur * 0.85, 0, 'sine');
          // Add a soft harmonic overtone for dreamy music box warmth
          this.playTone(freq * 2, dur * 0.5, 0.01, 'triangle');
        }
      }, currentTime * 1000);
      this.timerIds.push(tid);
      currentTime += dur;
    });

    this.isPlayingBgm = true;

    if (loop) {
      const loopTid = setTimeout(() => {
        if (this.isPlayingBgm && !this.isMuted) {
          this.playHappyBirthdayMelody(true);
        }
      }, (currentTime + 2.5) * 1000);
      this.timerIds.push(loopTid);
    }
  }

  // Sound effect: DJ Air Horn
  playAirHorn() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const hornFreqs = [466.16, 466.16, 466.16, 622.25]; // Bb4 Bb4 Bb4 Eb5
    hornFreqs.forEach((freq, idx) => {
      const startTime = this.ctx.currentTime + (idx * 0.11);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.09);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.09);
    });
  }

  // Sound effect: Crowd Applause & Cheering
  playCheer() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const duration = 1.2;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
  }

  // Sound effect: Wheel Tick
  playWheelTick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.03);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  // Sound effect: Quiz Correct Answer
  playCorrect() {
    this.playTone(587.33, 0.15, 0, 'sine');   // D5
    this.playTone(880.00, 0.35, 0.12, 'sine'); // A5
  }

  // Sound effect: Quiz Wrong / Roast Buzzer
  playWrong() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  // Sound effect: Splat / Cake Throw
  playSplat() {
    this.playPop();
    this.playTone(200, 0.1, 0, 'sawtooth');
  }

  // Sound effect: 8-Bit Disco Synth Beat (short party groove)
  playDiscoBeat() {
    if (this.isMuted) return;
    this.init();
    const bassline = [130.81, 130.81, 164.81, 196.00, 220.00, 196.00, 164.81, 146.83];
    bassline.forEach((freq, idx) => {
      this.playTone(freq, 0.12, idx * 0.14, 'square');
      if (idx % 2 === 0) {
        this.playPop();
      }
    });
  }

  stopMelody() {
    this.isPlayingBgm = false;
    this.clearMelodyTimers();
    if (this.bgmAudioElement) {
      this.bgmAudioElement.pause();
    }
  }

  clearMelodyTimers() {
    this.timerIds.forEach(id => clearTimeout(id));
    this.timerIds = [];
  }
}

window.birthdayAudio = new BirthdayAudioEngine();

