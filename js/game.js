// ==============================================================================
// 🎈 BIRTHDAY BALLOON RUSH MINI-GAME
// 15 seconds of pure frantic balloon popping fun!
// ==============================================================================

class BalloonRushGame {
  constructor() {
    this.score = 0;
    this.timeLeft = 15;
    this.timerInterval = null;
    this.spawnInterval = null;
    this.isPlaying = false;
    this.arena = null;
    this.targetScore = 12;
  }

  init() {
    this.arena = document.getElementById('gameArena');
    const startBtn = document.getElementById('startGameBtn');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startGame());
    }
    const resetBtn = document.getElementById('restartGameBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.startGame());
    }
  }

  startGame() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.score = 0;
    this.timeLeft = (window.BIRTHDAY_CONFIG?.game?.timeLimit) || 15;
    this.targetScore = (window.BIRTHDAY_CONFIG?.game?.targetScore) || 12;

    this.updateHUD();
    document.getElementById('gameStartScreen')?.classList.add('hidden');
    document.getElementById('gameOverScreen')?.classList.add('hidden');
    document.getElementById('gameActiveHUD')?.classList.remove('hidden');

    if (this.arena) {
      this.arena.querySelectorAll('.game-balloon').forEach(b => b.remove());
    }

    // Timer countdown
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.updateHUD();
      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);

    // Spawner
    this.spawnInterval = setInterval(() => {
      if (this.isPlaying) {
        this.spawnBalloon();
      }
    }, 450);
  }

  spawnBalloon() {
    if (!this.arena) return;

    const balloon = document.createElement('div');
    balloon.className = 'game-balloon';

    const isGolden = Math.random() < 0.22;
    const balloonColors = ['#f43f5e', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#3b82f6'];
    const color = isGolden ? '#fbbf24' : balloonColors[Math.floor(Math.random() * balloonColors.length)];

    const size = Math.floor(Math.random() * 20) + (isGolden ? 65 : 55);
    const leftPercent = Math.floor(Math.random() * 85) + 5;
    const duration = (Math.random() * 2.5 + 3.2).toFixed(2); // 3.2s to 5.7s rise

    balloon.style.width = `${size}px`;
    balloon.style.height = `${size * 1.25}px`;
    balloon.style.left = `${leftPercent}%`;
    balloon.style.backgroundColor = color;
    balloon.style.animationDuration = `${duration}s`;
    balloon.dataset.points = isGolden ? '3' : '1';

    if (isGolden) {
      balloon.classList.add('golden-balloon');
      balloon.innerHTML = '<span class="golden-star">⭐</span>';
    }

    // Click/touch to pop
    const popHandler = (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.popBalloon(balloon, isGolden);
    };

    balloon.addEventListener('pointerdown', popHandler);

    this.arena.appendChild(balloon);

    // Auto-remove when float finishes
    balloon.addEventListener('animationend', () => {
      if (balloon.parentElement) balloon.remove();
    });
  }

  popBalloon(balloon, isGolden) {
    if (!balloon.parentElement) return;

    const points = parseInt(balloon.dataset.points || '1', 10);
    this.score += points;
    this.updateHUD();

    if (window.birthdayAudio) {
      window.birthdayAudio.playPop();
      if (isGolden) {
        window.birthdayAudio.playDing();
      }
    }

    // Mini burst particles
    const rect = balloon.getBoundingClientRect();
    if (typeof confetti === 'function') {
      confetti({
        particleCount: isGolden ? 25 : 12,
        spread: 45,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight
        },
        colors: isGolden ? ['#fbbf24', '#f59e0b', '#fef08a'] : undefined
      });
    }

    // Pop scale effect
    balloon.classList.add('popped');
    setTimeout(() => {
      if (balloon.parentElement) balloon.remove();
    }, 150);
  }

  updateHUD() {
    const scoreVal = document.getElementById('gameScoreVal');
    const timerVal = document.getElementById('gameTimerVal');
    if (scoreVal) scoreVal.textContent = this.score;
    if (timerVal) timerVal.textContent = `${this.timeLeft}s`;
  }

  endGame() {
    this.isPlaying = false;
    clearInterval(this.timerInterval);
    clearInterval(this.spawnInterval);

    document.getElementById('gameActiveHUD')?.classList.add('hidden');
    const overScreen = document.getElementById('gameOverScreen');
    if (overScreen) {
      overScreen.classList.remove('hidden');
      const finalScoreEl = document.getElementById('finalScoreVal');
      const winStatusEl = document.getElementById('winStatusText');
      if (finalScoreEl) finalScoreEl.textContent = this.score;

      const won = this.score >= this.targetScore;
      if (winStatusEl) {
        if (won) {
          winStatusEl.innerHTML = `
            <div class="text-3xl mb-1">👑 🏆 🌟</div>
            <div class="text-xl font-bold text-amber-300">BIRTHDAY CHAMPION!</div>
            <div class="text-xs text-purple-200 mt-1">${window.BIRTHDAY_CONFIG?.game?.rewardMessage || 'You nailed it!'}</div>
          `;
          if (typeof confetti === 'function') {
            confetti({ particleCount: 80, spread: 100, origin: { y: 0.5 } });
          }
          if (window.birthdayAudio) window.birthdayAudio.playFanfare();
        } else {
          winStatusEl.innerHTML = `
            <div class="text-2xl mb-1">🎈💨</div>
            <div class="text-lg font-bold text-pink-300">Great Effort! (${this.score} pts)</div>
            <div class="text-xs text-purple-200 mt-1">Almost there! Tap restart to try and hit ${this.targetScore} points!</div>
          `;
        }
      }
    }
  }
}

window.balloonRushGame = new BalloonRushGame();
