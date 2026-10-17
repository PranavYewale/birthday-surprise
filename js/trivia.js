// ==============================================================================
// 🧠 NIKHIL'S FRIENDSHIP TRIVIA & ROAST QUIZ
// ==============================================================================

class BirthdayTriviaQuiz {
  constructor() {
    this.questions = [];
    this.currentIndex = 0;
    this.score = 0;
  }

  init() {
    const config = window.BIRTHDAY_CONFIG || {};
    this.questions = config.trivia || [];
    this.currentIndex = 0;
    this.score = 0;

    const startBtn = document.getElementById('startQuizBtn');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startQuiz());
    }

    const restartBtn = document.getElementById('restartQuizBtn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => this.startQuiz());
    }
  }

  startQuiz() {
    this.currentIndex = 0;
    this.score = 0;
    document.getElementById('quizStartScreen')?.classList.add('hidden');
    document.getElementById('quizEndScreen')?.classList.add('hidden');
    document.getElementById('quizActiveCard')?.classList.remove('hidden');
    this.renderCurrentQuestion();
  }

  renderCurrentQuestion() {
    if (this.currentIndex >= this.questions.length) {
      this.finishQuiz();
      return;
    }

    const q = this.questions[this.currentIndex];
    const qNumEl = document.getElementById('quizQuestionNum');
    const qTextEl = document.getElementById('quizQuestionText');
    const optionsContainer = document.getElementById('quizOptionsContainer');
    const feedbackEl = document.getElementById('quizFeedback');

    if (qNumEl) qNumEl.textContent = `Question ${this.currentIndex + 1} of ${this.questions.length}`;
    if (qTextEl) qTextEl.textContent = q.question;
    if (feedbackEl) feedbackEl.innerHTML = '';

    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      q.options.forEach((optText, optIdx) => {
        const btn = document.createElement('button');
        btn.className = 'w-full text-left p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold transition-all flex items-center justify-between group';
        btn.innerHTML = `
          <span>${optText}</span>
          <span class="opacity-0 group-hover:opacity-100 text-pink-400 font-bold transition-opacity">Select →</span>
        `;
        btn.addEventListener('click', () => this.handleOptionClick(btn, optIdx, q));
        optionsContainer.appendChild(btn);
      });
    }
  }

  handleOptionClick(clickedBtn, selectedIdx, questionObj) {
    const optionsContainer = document.getElementById('quizOptionsContainer');
    if (!optionsContainer) return;

    // Disable all options
    optionsContainer.querySelectorAll('button').forEach(b => b.disabled = true);

    const isCorrect = selectedIdx === questionObj.correct;
    const feedbackEl = document.getElementById('quizFeedback');

    if (isCorrect) {
      this.score++;
      clickedBtn.classList.remove('bg-slate-900/80', 'border-slate-700');
      clickedBtn.classList.add('bg-emerald-600/30', 'border-emerald-500', 'text-emerald-200');

      if (window.birthdayAudio) window.birthdayAudio.playCorrect();
      if (typeof confetti === 'function') confetti({ particleCount: 20, spread: 50 });

      if (feedbackEl) {
        feedbackEl.innerHTML = `
          <div class="mt-4 p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center animate-fade-in">
            ✅ ${questionObj.feedback || "CORRECT! That is 100% accurate!"}
          </div>
        `;
      }
    } else {
      clickedBtn.classList.remove('bg-slate-900/80', 'border-slate-700');
      clickedBtn.classList.add('bg-red-600/30', 'border-red-500', 'text-red-200', 'animate-shake');

      if (window.birthdayAudio) window.birthdayAudio.playWrong();

      if (feedbackEl) {
        feedbackEl.innerHTML = `
          <div class="mt-4 p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold text-center animate-fade-in">
            ❌ OOF! Close, but true legends know: ${questionObj.options[questionObj.correct]}!
          </div>
        `;
      }
    }

    // Advance to next question after 1.5s
    setTimeout(() => {
      this.currentIndex++;
      this.renderCurrentQuestion();
    }, 1600);
  }

  finishQuiz() {
    document.getElementById('quizActiveCard')?.classList.add('hidden');
    const endScreen = document.getElementById('quizEndScreen');
    if (!endScreen) return;
    endScreen.classList.remove('hidden');

    const scoreText = document.getElementById('quizScoreText');
    if (scoreText) scoreText.textContent = `${this.score} / ${this.questions.length}`;

    if (window.birthdayAudio) window.birthdayAudio.playFanfare();
    if (typeof confetti === 'function') {
      confetti({ particleCount: 80, spread: 90, origin: { y: 0.6 } });
    }
  }
}

window.birthdayTriviaQuiz = new BirthdayTriviaQuiz();
