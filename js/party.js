// ==============================================================================
// 🎛️ PARTY MODE, DJ SOUNDBOARD, NESTED MYSTERY BOX & WISHING WALL
// ==============================================================================

class PartyController {
  constructor() {
    this.isDiscoMode = false;
    this.easterEggClicks = 0;
    this.boxLayer = 1;
  }

  init() {
    this.setupSoundboard();
    this.setupDiscoMode();
    this.setupNestedBox();
    this.setupWishingWall();
    this.setupEasterEgg();
    this.renderSuperpowerBadges();
  }

  // 1. DJ Soundboard Controls
  setupSoundboard() {
    document.getElementById('btnAirHorn')?.addEventListener('click', () => {
      window.birthdayAudio?.playAirHorn();
      if (typeof confetti === 'function') confetti({ particleCount: 20, spread: 40 });
    });

    document.getElementById('btnCheer')?.addEventListener('click', () => {
      window.birthdayAudio?.playCheer();
      if (typeof confetti === 'function') confetti({ particleCount: 40, spread: 70 });
    });

    document.getElementById('btnPopper')?.addEventListener('click', () => {
      window.birthdayAudio?.playPop();
      if (typeof confetti === 'function') confetti({ particleCount: 30, spread: 60 });
    });

    document.getElementById('btnSplat')?.addEventListener('click', () => {
      window.birthdayAudio?.playSplat();
    });

    document.getElementById('btnDiscoBeat')?.addEventListener('click', () => {
      window.birthdayAudio?.playDiscoBeat();
    });
  }

  // 2. Disco Mode Toggle
  setupDiscoMode() {
    const discoBtn = document.getElementById('toggleDiscoBtn');
    if (!discoBtn) return;

    discoBtn.addEventListener('click', () => {
      this.isDiscoMode = !this.isDiscoMode;
      document.body.classList.toggle('disco-mode-active', this.isDiscoMode);
      discoBtn.classList.toggle('bg-purple-600', this.isDiscoMode);
      discoBtn.classList.toggle('text-yellow-300', this.isDiscoMode);

      if (this.isDiscoMode) {
        window.birthdayAudio?.playDiscoBeat();
        if (typeof confetti === 'function') confetti({ particleCount: 50, spread: 100 });
      }
    });
  }

  // 3. Russian-Doll Nested Gift Box
  setupNestedBox() {
    const boxContainer = document.getElementById('nestedGiftWrapper');
    const openBtn = document.getElementById('openNestedBoxBtn');
    const layerText = document.getElementById('nestedLayerText');
    const boxVisual = document.getElementById('nestedBoxVisual');

    if (!openBtn || !boxContainer) return;

    openBtn.addEventListener('click', () => {
      this.boxLayer++;

      if (window.birthdayAudio) window.birthdayAudio.playPop();

      if (this.boxLayer === 2) {
        if (layerText) layerText.textContent = "Wait... there's a smaller golden box inside?! 😂 Open it!";
        if (boxVisual) boxVisual.textContent = "🎁";
        openBtn.textContent = "Unwrap Layer 2 🎀";
      } else if (this.boxLayer === 3) {
        if (layerText) layerText.textContent = "Almost there! One tiny velvet box remains... ✨";
        if (boxVisual) boxVisual.textContent = "📦";
        openBtn.textContent = "Open Final Box 🔓";
      } else if (this.boxLayer >= 4) {
        // Grand Reveal!
        boxContainer.innerHTML = `
          <div class="animate-bounce-in text-center p-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border-2 border-amber-400">
            <div class="text-6xl mb-2 animate-bounce">🏆</div>
            <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-amber-400 text-slate-950">
              OFFICIAL LIFETIME AWARD
            </span>
            <h3 class="text-2xl font-black text-amber-300 mt-2">WORLD'S GREATEST FRIEND</h3>
            <p class="text-slate-200 text-sm mt-2 max-w-sm mx-auto">
              Conferred upon <strong>Nikhil</strong> for unmatched loyalty, world-class humour, and being an absolute brother for life.
            </p>
            <div class="text-3xl mt-3">👑 🥂 🌟</div>
          </div>
        `;
        if (window.birthdayAudio) window.birthdayAudio.playFanfare();
        if (typeof confetti === 'function') {
          confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
        }
      }
    });
  }

  // 4. Digital Wishing Wall / Sticky Notes
  setupWishingWall() {
    const postBtn = document.getElementById('postWishBtn');
    const authorInput = document.getElementById('wishAuthorInput');
    const msgInput = document.getElementById('wishMsgInput');
    const notesContainer = document.getElementById('wishingNotesContainer');

    const defaultNotes = [
      { author: "Your Bestie", text: "Happy Birthday Nikhil! You're a true legend, keep shining! 🌟", sticker: "🎂", color: "note-pink" },
      { author: "The Squad", text: "Party hard today! The bill is completely on us! 🍕🔥", sticker: "🥂", color: "note-yellow" },
      { author: "Bro Code", text: "To the brother who never lets anyone down! Stay legendary! 👑", sticker: "⚡", color: "note-blue" }
    ];

    const getStoredNotes = () => {
      try {
        const saved = localStorage.getItem('NIKHIL_BIRTHDAY_WISHES');
        return saved ? JSON.parse(saved) : defaultNotes;
      } catch (e) {
        return defaultNotes;
      }
    };

    const renderNotes = () => {
      if (!notesContainer) return;
      const notes = getStoredNotes();
      notesContainer.innerHTML = '';

      notes.forEach((note) => {
        const card = document.createElement('div');
        card.className = `sticky-note ${note.color || 'note-pink'} p-4 rounded-xl shadow-lg relative transform hover:scale-105 transition-transform`;
        card.innerHTML = `
          <div class="sticky-pin">📍</div>
          <div class="text-2xl absolute top-3 right-3">${note.sticker || '✨'}</div>
          <p class="font-handwriting text-slate-900 text-lg leading-tight mt-2">${note.text}</p>
          <div class="text-xs font-bold text-slate-700 mt-3 uppercase tracking-wider">— ${note.author}</div>
        `;
        notesContainer.appendChild(card);
      });
    };

    renderNotes();

    if (postBtn && authorInput && msgInput) {
      postBtn.addEventListener('click', () => {
        const author = authorInput.value.trim() || 'A Good Friend';
        const msg = msgInput.value.trim();
        if (!msg) {
          alert('Please write a short birthday wish! ✨');
          return;
        }

        const colors = ['note-pink', 'note-yellow', 'note-blue', 'note-green'];
        const stickers = ['🎉', '🎂', '👑', '🔥', '💖', '⭐'];

        const newNote = {
          author: author,
          text: msg,
          sticker: stickers[Math.floor(Math.random() * stickers.length)],
          color: colors[Math.floor(Math.random() * colors.length)]
        };

        const currentNotes = getStoredNotes();
        currentNotes.unshift(newNote);
        localStorage.setItem('NIKHIL_BIRTHDAY_WISHES', JSON.stringify(currentNotes));

        authorInput.value = '';
        msgInput.value = '';
        renderNotes();

        if (window.birthdayAudio) window.birthdayAudio.playPop();
        if (typeof confetti === 'function') confetti({ particleCount: 25, spread: 50 });
      });
    }
  }

  // 5. Easter Egg: Tap Party Badge 5 Times for Total Chaos Mode
  setupEasterEgg() {
    const badge = document.getElementById('easterEggBadge');
    if (!badge) return;

    badge.addEventListener('click', () => {
      this.easterEggClicks++;
      badge.classList.add('animate-spin');
      setTimeout(() => badge.classList.remove('animate-spin'), 400);

      if (window.birthdayAudio) window.birthdayAudio.playTone(800 + this.easterEggClicks * 150, 0.1, 0, 'sine');

      if (this.easterEggClicks >= 5) {
        this.easterEggClicks = 0;
        this.triggerTotalChaos();
      }
    });
  }

  triggerTotalChaos() {
    if (window.birthdayAudio) {
      window.birthdayAudio.playAirHorn();
      window.birthdayAudio.playFanfare();
    }

    // Mega celebratory storm
    if (typeof confetti === 'function') {
      confetti({ particleCount: 200, spread: 180, origin: { y: 0.4 } });
      setTimeout(() => {
        confetti({ particleCount: 150, spread: 120, origin: { y: 0.7 } });
      }, 500);
    }

    // Floating emoji storm across screen
    const emojis = ['🎂', '👑', '🍕', '🎉', '🥂', '⭐', '🎈'];
    for (let i = 0; i < 35; i++) {
      const el = document.createElement('div');
      el.className = 'chaos-floating-emoji';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = `${Math.random() * 95}vw`;
      el.style.fontSize = `${Math.random() * 24 + 28}px`;
      el.style.animationDuration = `${(Math.random() * 2 + 2).toFixed(2)}s`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }
  }

  // 6. Superpower Badges in Hall of Fame
  renderSuperpowerBadges() {
    const container = document.getElementById('superpowersGrid');
    if (!container) return;

    const list = window.BIRTHDAY_CONFIG?.superpowers || [];
    container.innerHTML = '';

    list.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'p-5 rounded-2xl bg-slate-900/70 border border-slate-700/80 hover:border-pink-500/50 hover:bg-slate-800/80 transition-all text-center group cursor-pointer';
      card.innerHTML = `
        <div class="text-4xl mb-2 transform group-hover:scale-125 transition-transform duration-300">${p.icon}</div>
        <h4 class="text-base font-bold text-white group-hover:text-amber-300 transition-colors">${p.title}</h4>
        <p class="text-xs text-slate-400 mt-1 leading-relaxed">${p.desc}</p>
      `;
      card.addEventListener('click', () => {
        if (window.birthdayAudio) window.birthdayAudio.playTone(1000, 0.1, 0, 'sine');
        if (typeof confetti === 'function') confetti({ particleCount: 15, spread: 35 });
      });
      container.appendChild(card);
    });
  }
}

window.partyController = new PartyController();
