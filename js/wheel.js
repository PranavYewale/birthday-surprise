// ==============================================================================
// 🎡 NIKHIL'S BIRTHDAY WHEEL OF DESTINY
// Canvas physics-based spinning wheel with audio ticks and prize reveal!
// ==============================================================================

class BirthdayWheel {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = null;
    this.segments = [];
    this.currentAngle = 0;
    this.isSpinning = false;
    this.spinVelocity = 0;
    this.friction = 0.985;
    this.lastTickSegment = -1;
  }

  init() {
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    const config = window.BIRTHDAY_CONFIG || {};
    this.segments = config.wheelPrizes || [
      { text: "Free Pizza Feast 🍕", color: "#ec4899", desc: "Redeemable anytime on my tab!" },
      { text: "Roast Immunity 🛡️", color: "#8b5cf6", desc: "You cannot be roasted for 24 hours!" },
      { text: "Trip / Movie Pick 🎬", color: "#06b6d4", desc: "You get full rights to pick the next outing!" },
      { text: "Millionaire Year 💰", color: "#10b981", desc: "Astrological guarantee of insane success!" },
      { text: "1 Emergency Pass 🆘", color: "#f59e0b", desc: "Call me at 3 AM and I will show up!" },
      { text: "Cosmic Wish Granted ✨", color: "#f43f5e", desc: "Whatever secret wish you have will come true!" }
    ];

    this.drawWheel();

    const spinBtn = document.getElementById('spinWheelBtn');
    if (spinBtn) {
      spinBtn.addEventListener('click', () => this.spin());
    }
  }

  drawWheel() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 16;
    const numSegments = this.segments.length;
    const arcSize = (2 * Math.PI) / numSegments;

    ctx.clearRect(0, 0, width, height);

    // Save state and rotate wheel
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(this.currentAngle);

    for (let i = 0; i < numSegments; i++) {
      const angle = i * arcSize;
      const seg = this.segments[i];

      // Draw segment slice
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, angle, angle + arcSize);
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff33';
      ctx.stroke();

      // Outer gold rim highlight
      ctx.save();
      ctx.rotate(angle + arcSize / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px Outfit, sans-serif';
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.fillText(seg.text, radius - 20, 5);
      ctx.restore();
    }

    // Outer border
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#fbbf24';
    ctx.stroke();

    // Center hub
    ctx.beginPath();
    ctx.arc(0, 0, 28, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#f59e0b';
    ctx.stroke();

    // Center icon
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('🎁', 0, 1);

    ctx.restore();

    // Draw fixed top indicator pointer
    ctx.save();
    ctx.translate(centerX, 12);
    ctx.beginPath();
    ctx.moveTo(-14, 0);
    ctx.lineTo(14, 0);
    ctx.lineTo(0, 22);
    ctx.closePath();
    ctx.fillStyle = '#ef4444';
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(239, 68, 68, 0.8)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.restore();
  }

  spin() {
    if (this.isSpinning) return;
    this.isSpinning = true;
    const spinBtn = document.getElementById('spinWheelBtn');
    if (spinBtn) {
      spinBtn.disabled = true;
      spinBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }

    // Give high random initial velocity (at least 5-8 full rotations)
    this.spinVelocity = Math.random() * 0.18 + 0.32;
    this.animate();
  }

  animate() {
    this.currentAngle += this.spinVelocity;
    this.spinVelocity *= this.friction;

    // Tick sound as each segment passes
    const numSegments = this.segments.length;
    const arcSize = (2 * Math.PI) / numSegments;
    const normalizedAngle = (this.currentAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const activeSegIndex = Math.floor(normalizedAngle / arcSize);

    if (activeSegIndex !== this.lastTickSegment && this.spinVelocity > 0.02) {
      this.lastTickSegment = activeSegIndex;
      if (window.birthdayAudio) {
        window.birthdayAudio.playWheelTick();
      }
    }

    this.drawWheel();

    if (this.spinVelocity > 0.0015) {
      requestAnimationFrame(() => this.animate());
    } else {
      this.spinVelocity = 0;
      this.isSpinning = false;
      this.onSpinComplete();
    }
  }

  onSpinComplete() {
    const numSegments = this.segments.length;
    const arcSize = (2 * Math.PI) / numSegments;
    // The pointer is at top (3 * Math.PI / 2 radians, or -Math.PI / 2)
    const pointerAngle = (3 * Math.PI / 2 - this.currentAngle) % (2 * Math.PI);
    const positiveAngle = (pointerAngle + 2 * Math.PI) % (2 * Math.PI);
    const winningIndex = Math.floor(positiveAngle / arcSize) % numSegments;
    const prize = this.segments[winningIndex];

    const spinBtn = document.getElementById('spinWheelBtn');
    if (spinBtn) {
      spinBtn.disabled = false;
      spinBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }

    // Sound & Confetti
    if (window.birthdayAudio) {
      window.birthdayAudio.playDing();
      window.birthdayAudio.playFanfare();
    }

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    // Display winner in HUD
    const resultBox = document.getElementById('wheelResult');
    if (resultBox) {
      resultBox.innerHTML = `
        <div class="animate-bounce-in p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border border-amber-400/50 text-center">
          <span class="text-xs font-bold uppercase tracking-widest text-amber-300">🎉 WHEEL OF DESTINY HAS SPOKEN! 🎉</span>
          <div class="text-2xl font-black text-white mt-1">${prize.text}</div>
          <p class="text-xs text-purple-200 mt-1">${prize.desc}</p>
        </div>
      `;
      resultBox.classList.remove('hidden');
    }
  }
}

window.BirthdayWheel = BirthdayWheel;
