// ==============================================================================
// 🎂 INTERACTIVE BIRTHDAY CAKE & CANDLE BLOWOUT LOGIC
// Supports microphone blowing detection AND tap/click blowout!
// ==============================================================================

class BirthdayCake {
  constructor() {
    this.candles = [];
    this.totalCandles = 5;
    this.blownCount = 0;
    this.micStream = null;
    this.audioCtx = null;
    this.analyser = null;
    this.isListeningMic = false;
    this.isFullyBlown = false;
  }

  init() {
    const config = window.BIRTHDAY_CONFIG || {};
    this.totalCandles = (config.cake && config.cake.candlesCount) || 5;
    this.renderCake();
    this.bindEvents();
  }

  renderCake() {
    const candlesContainer = document.getElementById('candlesContainer');
    if (!candlesContainer) return;
    candlesContainer.innerHTML = '';
    this.candles = [];
    this.blownCount = 0;
    this.isFullyBlown = false;

    // Distribute candles nicely across cake top
    for (let i = 0; i < this.totalCandles; i++) {
      const candle = document.createElement('div');
      candle.className = 'candle';
      candle.dataset.index = i;

      // Color variations for candles
      const colors = ['#f43f5e', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
      const color = colors[i % colors.length];
      candle.style.setProperty('--candle-color', color);

      candle.innerHTML = `
        <div class="flame" id="flame-${i}">
          <div class="flame-inner"></div>
        </div>
        <div class="smoke" id="smoke-${i}"></div>
        <div class="candle-wick"></div>
        <div class="candle-stick"></div>
      `;

      candle.addEventListener('click', () => {
        this.blowCandle(i);
      });

      candlesContainer.appendChild(candle);
      this.candles.push({ element: candle, isBlown: false });
    }

    const wishMessage = document.getElementById('wishMessage');
    if (wishMessage) {
      wishMessage.classList.add('hidden');
    }
  }

  bindEvents() {
    const micBtn = document.getElementById('micToggleBtn');
    if (micBtn) {
      micBtn.addEventListener('click', () => this.toggleMicrophone());
    }

    const blowAllBtn = document.getElementById('blowAllBtn');
    if (blowAllBtn) {
      blowAllBtn.addEventListener('click', () => this.blowAllCandles());
    }

    const relightBtn = document.getElementById('relightBtn');
    if (relightBtn) {
      relightBtn.addEventListener('click', () => this.relightCandles());
    }
  }

  blowCandle(index) {
    if (!this.candles[index] || this.candles[index].isBlown) return;

    const candle = this.candles[index];
    candle.isBlown = true;
    this.blownCount++;

    const flame = candle.element.querySelector('.flame');
    const smoke = candle.element.querySelector('.smoke');

    if (flame) flame.classList.add('out');
    if (smoke) {
      smoke.classList.add('puff');
      setTimeout(() => smoke.classList.remove('puff'), 1800);
    }

    if (window.birthdayAudio) {
      window.birthdayAudio.playBlowOut();
    }

    // Individual mini-burst
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 15,
        spread: 45,
        origin: {
          x: candle.element.getBoundingClientRect().left / window.innerWidth,
          y: candle.element.getBoundingClientRect().top / window.innerHeight
        }
      });
    }

    if (this.blownCount >= this.totalCandles && !this.isFullyBlown) {
      this.onAllBlown();
    }
  }

  blowAllCandles() {
    this.candles.forEach((c, idx) => {
      setTimeout(() => {
        this.blowCandle(idx);
      }, idx * 120);
    });
  }

  relightCandles() {
    this.renderCake();
    const wishMsg = document.getElementById('wishMessage');
    if (wishMsg) wishMsg.classList.add('hidden');
  }

  onAllBlown() {
    this.isFullyBlown = true;

    // Stop mic listening if active
    if (this.isListeningMic) {
      this.stopMic();
    }

    const wishMsg = document.getElementById('wishMessage');
    if (wishMsg) {
      const config = window.BIRTHDAY_CONFIG || {};
      wishMsg.innerHTML = `
        <div class="wish-banner animate-bounce-in">
          <div class="text-4xl mb-2">🎉✨🎂✨🎉</div>
          <h3 class="text-2xl font-black text-amber-300">${config.cake?.blownMessage || "WISH GRANTED!"}</h3>
          <p class="text-purple-200 mt-2 text-sm">Your wish has been dispatched straight to the cosmos.</p>
        </div>
      `;
      wishMsg.classList.remove('hidden');
    }

    if (window.birthdayAudio) {
      window.birthdayAudio.playFanfare();
    }

    // Mega celebratory confetti shower!
    if (typeof confetti === 'function') {
      const duration = 3.5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);
    }
  }

  // Microphone detection
  async toggleMicrophone() {
    const micBtn = document.getElementById('micToggleBtn');
    if (this.isListeningMic) {
      this.stopMic();
      if (micBtn) {
        micBtn.innerHTML = '🎙️ Enable Mic Blowout';
        micBtn.classList.remove('listening');
      }
      return;
    }

    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
      const source = this.audioCtx.createMediaStreamSource(this.micStream);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 512;
      source.connect(this.analyser);

      this.isListeningMic = true;
      if (micBtn) {
        micBtn.innerHTML = '💨 Listening... Blow now! (or click)';
        micBtn.classList.add('listening');
      }
      this.monitorBlow();
    } catch (err) {
      console.warn("Microphone access unavailable or denied:", err);
      alert("Microphone permission was denied or not supported on this browser. Don't worry! You can click or tap the candles directly! 🎂");
    }
  }

  monitorBlow() {
    if (!this.isListeningMic || !this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length;

    // Blow detection threshold
    if (average > 48) {
      const unblown = this.candles.map((c, i) => i).filter(i => !this.candles[i].isBlown);
      if (unblown.length > 0) {
        const randomTarget = unblown[Math.floor(Math.random() * unblown.length)];
        this.blowCandle(randomTarget);
      }
    }

    if (this.blownCount < this.totalCandles) {
      requestAnimationFrame(() => this.monitorBlow());
    }
  }

  stopMic() {
    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close();
    }
    this.isListeningMic = false;
  }
}

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

window.birthdayCake = new BirthdayCake();
