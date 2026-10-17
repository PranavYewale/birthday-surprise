// ==============================================================================
// 🎰 GOLDEN SCRATCH CARD SURPRISE
// Realistic scratch-off foil with sound effects and confetti trigger!
// ==============================================================================

class ScratchCard {
  constructor(canvasId, prizeTextId) {
    this.canvas = document.getElementById(canvasId);
    this.prizeElem = document.getElementById(prizeTextId);
    this.ctx = null;
    this.isDrawing = false;
    this.isRevealed = false;
    this.scratchedPixels = 0;
  }

  init() {
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.isRevealed = false;
    this.setupCanvas();
    this.bindEvents();
  }

  setupCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const width = rect.width || 320;
    const height = 180;
    this.canvas.width = width;
    this.canvas.height = height;

    const ctx = this.ctx;
    ctx.globalCompositeOperation = 'source-over';

    // Golden / Holographic gradient foil
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#d97706');
    grad.addColorStop(0.3, '#fde68a');
    grad.addColorStop(0.5, '#f59e0b');
    grad.addColorStop(0.7, '#fef3c7');
    grad.addColorStop(1, '#b45309');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle noise pattern & text
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 3 + 1;
      ctx.fillRect(x, y, size, size);
    }

    // Foil stamp label
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ SCRATCH WITH FINGER OR MOUSE ✨', width / 2, height / 2 - 10);
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('Rub gently to reveal your Birthday Jackpot!', width / 2, height / 2 + 15);
  }

  bindEvents() {
    const canvas = this.canvas;
    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const startScratch = (e) => {
      if (this.isRevealed) return;
      this.isDrawing = true;
      this.scratch(getPos(e));
    };

    const moveScratch = (e) => {
      if (!this.isDrawing || this.isRevealed) return;
      e.preventDefault();
      this.scratch(getPos(e));
    };

    const stopScratch = () => {
      this.isDrawing = false;
      this.checkPercentScratched();
    };

    canvas.addEventListener('mousedown', startScratch);
    canvas.addEventListener('mousemove', moveScratch);
    window.addEventListener('mouseup', stopScratch);

    canvas.addEventListener('touchstart', startScratch, { passive: false });
    canvas.addEventListener('touchmove', moveScratch, { passive: false });
    window.addEventListener('touchend', stopScratch);
  }

  scratch(pos) {
    if (!this.ctx || this.isRevealed) return;
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.beginPath();
    this.ctx.arc(pos.x, pos.y, 22, 0, Math.PI * 2);
    this.ctx.fill();

    // Occasional tiny sound
    if (Math.random() < 0.15 && window.birthdayAudio) {
      window.birthdayAudio.playTone(800 + Math.random() * 400, 0.05, 0, 'sine');
    }
  }

  checkPercentScratched() {
    if (this.isRevealed || !this.ctx) return;

    try {
      const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      const pixels = imgData.data;
      let transparentCount = 0;
      for (let i = 3; i < pixels.length; i += 16) { // Sample every 4th pixel
        if (pixels[i] === 0) {
          transparentCount++;
        }
      }

      const totalSampled = pixels.length / 16;
      const ratio = transparentCount / totalSampled;

      // When more than 40% is scratched, reveal the rest cleanly!
      if (ratio > 0.40) {
        this.revealAll();
      }
    } catch (err) {
      console.warn("Could not calculate scratch ratio:", err);
    }
  }

  revealAll() {
    this.isRevealed = true;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (window.birthdayAudio) {
      window.birthdayAudio.playDing();
      window.birthdayAudio.playFanfare();
    }

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    const badge = document.getElementById('scratchBadge');
    if (badge) {
      badge.textContent = '🎉 UNLOCKED!';
      badge.className = 'px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-500/30';
    }
  }
}

window.ScratchCard = ScratchCard;
