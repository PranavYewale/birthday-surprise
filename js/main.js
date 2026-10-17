// ==============================================================================
// 🌟 MAIN BIRTHDAY CONTROLLER & INTERACTIVE ORCHESTRATOR
// ==============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Check for locally saved customizations if any
  loadStoredConfig();

  // 2. Populate text and metadata from config
  applyConfigToDOM();

  // 3. Initialize background particles canvas
  initBackgroundCanvas();

  // 4. Setup parcel opening intro
  setupIntroParcel();

  // 5. Setup audio controls
  setupAudioControls();

  // 6. Setup polaroids & photo viewer
  setupPolaroidGallery();

  // 7. Setup typewriter letter & envelope
  setupEnvelopeLetter();

  // 8. Setup mystery gift modals
  setupMysteryBoxes();

  // 9. Setup interactive customizer modal
  setupCustomizerModal();

  // 10. Initialize Cake & Mini-Game
  if (window.birthdayCake) window.birthdayCake.init();
  if (window.balloonRushGame) window.balloonRushGame.init();

  // 11. Initialize Wheel of Destiny, Trivia Quiz & Party Controller
  if (window.BirthdayWheel) {
    const wheel = new window.BirthdayWheel('wheelCanvas');
    wheel.init();
  }
  if (window.birthdayTriviaQuiz) window.birthdayTriviaQuiz.init();
  if (window.partyController) window.partyController.init();
});

// Load config from LocalStorage if user previously edited in browser
function loadStoredConfig() {
  try {
    const saved = localStorage.getItem('BIRTHDAY_CUSTOM_CONFIG');
    if (saved) {
      const parsed = JSON.parse(saved);
      window.BIRTHDAY_CONFIG = Object.assign({}, window.BIRTHDAY_CONFIG, parsed);
    }
  } catch (e) {
    console.warn("Could not load stored config", e);
  }
}

// Bind config values to HTML elements
function applyConfigToDOM() {
  const cfg = window.BIRTHDAY_CONFIG;
  if (!cfg) return;

  // Title & Headers
  document.title = `Happy Birthday ${cfg.friendName}! 🎂✨`;
  
  const friendNameSpans = document.querySelectorAll('.cfg-friend-name');
  friendNameSpans.forEach(el => el.textContent = cfg.friendName);

  const nicknameSpans = document.querySelectorAll('.cfg-nickname');
  nicknameSpans.forEach(el => el.textContent = cfg.nickname || 'Legend');

  const birthdateSpans = document.querySelectorAll('.cfg-birthdate');
  birthdateSpans.forEach(el => el.textContent = cfg.birthdate || 'Today');

  const heroSub = document.getElementById('heroSubtitle');
  if (heroSub && cfg.hero?.subtitle) {
    heroSub.textContent = cfg.hero.subtitle;
  }

  // Populate Scratch Card Prize
  const scratchPrizeEl = document.getElementById('scratchPrizeText');
  if (scratchPrizeEl && cfg.mysteryBoxes?.[2]?.scratchPrize) {
    scratchPrizeEl.textContent = cfg.mysteryBoxes[2].scratchPrize;
  }
}

// -------------------------------------------------------------
// 1. Cinematic Gift Parcel Opening
// -------------------------------------------------------------
function setupIntroParcel() {
  const introOverlay = document.getElementById('introOverlay');
  const openParcelBtn = document.getElementById('openParcelBtn');
  const mainContent = document.getElementById('mainContent');

  if (!introOverlay || !openParcelBtn) return;

  openParcelBtn.addEventListener('click', () => {
    // Play celebratory opening SFX & melody
    if (window.birthdayAudio) {
      window.birthdayAudio.init();
      window.birthdayAudio.playFanfare();
      setTimeout(() => {
        window.birthdayAudio.playHappyBirthdayMelody(true);
      }, 700);
    }

    // Exploding parcel animation
    openParcelBtn.classList.add('parcel-opening');

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 }
      });
    }

    setTimeout(() => {
      introOverlay.classList.add('intro-fade-out');
      if (mainContent) {
        mainContent.classList.remove('hidden');
        mainContent.classList.add('main-content-revealed');
      }
    }, 600);

    setTimeout(() => {
      introOverlay.style.display = 'none';
    }, 1400);
  });
}

// -------------------------------------------------------------
// 2. Audio Control & BGM Toggle
// -------------------------------------------------------------
function setupAudioControls() {
  const audioBtn = document.getElementById('audioToggleBtn');
  const soundIcon = document.getElementById('soundIcon');
  if (!audioBtn) return;

  audioBtn.addEventListener('click', () => {
    if (!window.birthdayAudio) return;
    const isMuted = window.birthdayAudio.toggleMute();
    if (soundIcon) {
      soundIcon.textContent = isMuted ? '🔇' : '🎵';
    }
    audioBtn.title = isMuted ? 'Unmute Sound' : 'Mute Sound';
  });
}

// -------------------------------------------------------------
// 3. Polaroid Photo Gallery & Live Photo Preview
// -------------------------------------------------------------
function setupPolaroidGallery() {
  const galleryGrid = document.getElementById('polaroidGrid');
  if (!galleryGrid) return;

  const polaroids = window.BIRTHDAY_CONFIG?.polaroids || [];
  galleryGrid.innerHTML = '';

  const rotations = [-4, 3, -2, 5, -3, 2];

  polaroids.forEach((item, index) => {
    const rot = rotations[index % rotations.length];
    const card = document.createElement('div');
    card.className = 'polaroid-card group';
    card.style.setProperty('--rot', `${rot}deg`);

    card.innerHTML = `
      <div class="polaroid-pin">📌</div>
      <div class="polaroid-inner">
        <div class="polaroid-photo-wrapper">
          <img src="${item.img}" alt="${item.caption}" loading="lazy" class="polaroid-img" />
          <div class="polaroid-overlay">
            <span class="text-xs uppercase font-bold tracking-wider">Click to Expand 🔍</span>
          </div>
        </div>
        <div class="polaroid-caption font-handwriting text-slate-800">
          <p class="font-bold text-base leading-tight">${item.caption}</p>
          <span class="text-xs text-slate-500 font-sans mt-1 block">${item.date || ''}</span>
        </div>
      </div>
    `;

    // Click to view enlarged
    card.addEventListener('click', () => {
      openPhotoModal(item.img, item.caption, item.date);
    });

    galleryGrid.appendChild(card);
  });

  // Modal close handler
  const photoModal = document.getElementById('photoModal');
  const closePhotoModalBtn = document.getElementById('closePhotoModal');
  if (closePhotoModalBtn && photoModal) {
    closePhotoModalBtn.addEventListener('click', () => photoModal.classList.add('hidden'));
    photoModal.addEventListener('click', (e) => {
      if (e.target === photoModal) photoModal.classList.add('hidden');
    });
  }

  // Live photo upload tester
  const photoUploadInput = document.getElementById('galleryImageUpload');
  if (photoUploadInput) {
    photoUploadInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (!files || !files.length) return;

      Array.from(files).forEach((file, fIndex) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (!window.BIRTHDAY_CONFIG.polaroids) window.BIRTHDAY_CONFIG.polaroids = [];
          window.BIRTHDAY_CONFIG.polaroids.unshift({
            img: event.target.result,
            caption: file.name.replace(/\.[^/.]+$/, "") || "Legendary Memory 📸",
            date: "Special Moment"
          });
          setupPolaroidGallery();
        };
        reader.readAsDataURL(file);
      });
    });
  }
}

function openPhotoModal(imgSrc, caption, date) {
  const modal = document.getElementById('photoModal');
  const modalImg = document.getElementById('modalPhotoImg');
  const modalCaption = document.getElementById('modalPhotoCaption');
  const modalDate = document.getElementById('modalPhotoDate');

  if (modal && modalImg) {
    modalImg.src = imgSrc;
    if (modalCaption) modalCaption.textContent = caption;
    if (modalDate) modalDate.textContent = date || '';
    modal.classList.remove('hidden');

    if (window.birthdayAudio) window.birthdayAudio.playTone(900, 0.1, 0, 'sine');
  }
}

// -------------------------------------------------------------
// 4. Vintage Envelope & Typewriter Letter
// -------------------------------------------------------------
function setupEnvelopeLetter() {
  const envelope = document.getElementById('birthdayEnvelope');
  const letterSheet = document.getElementById('letterSheet');
  const letterBody = document.getElementById('typewriterText');
  const waxSeal = document.getElementById('waxSeal');
  let isTyped = false;

  if (!envelope) return;

  const openLetter = () => {
    if (envelope.classList.contains('envelope-open')) return;
    envelope.classList.add('envelope-open');

    if (window.birthdayAudio) {
      window.birthdayAudio.playTone(600, 0.2, 0, 'triangle');
    }

    if (!isTyped) {
      isTyped = true;
      setTimeout(typewriterEffect, 600);
    }
  };

  if (waxSeal) waxSeal.addEventListener('click', openLetter);
  envelope.addEventListener('click', openLetter);
}

function typewriterEffect() {
  const textElem = document.getElementById('typewriterText');
  if (!textElem) return;

  const cfg = window.BIRTHDAY_CONFIG?.letter || {};
  const fullText = (cfg.paragraphs || []).join('\n\n');
  textElem.textContent = '';

  let i = 0;
  const speed = 24; // typing speed in ms

  function typeChar() {
    if (i < fullText.length) {
      textElem.textContent += fullText.charAt(i);
      i++;
      // Subtle click sound occasionally
      if (i % 6 === 0 && window.birthdayAudio) {
        window.birthdayAudio.playTone(1800 + Math.random() * 200, 0.02, 0, 'triangle');
      }
      setTimeout(typeChar, speed);
    } else {
      // Typing done
      const signoff = document.getElementById('letterSignoff');
      if (signoff && cfg.signoff) {
        signoff.textContent = cfg.signoff;
        signoff.classList.remove('opacity-0');
      }
    }
  }

  typeChar();
}

// -------------------------------------------------------------
// 5. Mystery Gift Boxes & Scratch Card Modal
// -------------------------------------------------------------
function setupMysteryBoxes() {
  const boxes = document.querySelectorAll('.mystery-gift-box');
  const modal = document.getElementById('mysteryBoxModal');
  const modalIcon = document.getElementById('mysteryModalIcon');
  const modalTitle = document.getElementById('mysteryModalTitle');
  const modalTag = document.getElementById('mysteryModalTag');
  const modalBody = document.getElementById('mysteryModalBody');
  const scratchContainer = document.getElementById('scratchCardContainer');
  const defaultContainer = document.getElementById('defaultBoxContainer');
  const closeModalBtn = document.getElementById('closeMysteryModal');

  let scratchCardInstance = null;

  boxes.forEach(box => {
    box.addEventListener('click', () => {
      const boxId = box.dataset.boxId;
      const cfg = window.BIRTHDAY_CONFIG?.mysteryBoxes?.find(b => b.id === boxId);
      if (!cfg || !modal) return;

      if (modalIcon) modalIcon.textContent = cfg.icon || '🎁';
      if (modalTitle) modalTitle.textContent = cfg.title;
      if (modalTag) modalTag.textContent = cfg.tag;

      if (boxId === 'scratch') {
        defaultContainer?.classList.add('hidden');
        scratchContainer?.classList.remove('hidden');
        if (!scratchCardInstance) {
          scratchCardInstance = new ScratchCard('scratchCanvas', 'scratchPrizeText');
        }
        setTimeout(() => scratchCardInstance.init(), 100);
      } else {
        scratchContainer?.classList.add('hidden');
        defaultContainer?.classList.remove('hidden');
        if (modalBody) {
          modalBody.innerHTML = cfg.content ? cfg.content.replace(/\n/g, '<br>') : '';
        }
      }

      modal.classList.remove('hidden');
      if (window.birthdayAudio) window.birthdayAudio.playTone(720, 0.2, 0, 'sine');
      if (typeof confetti === 'function') confetti({ particleCount: 30, spread: 60 });
    });
  });

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  }
}

// -------------------------------------------------------------
// 6. Interactive Customizer Modal (Make It Easy for User!)
// -------------------------------------------------------------
function setupCustomizerModal() {
  const openBtn = document.getElementById('openCustomizerBtn');
  const modal = document.getElementById('customizerModal');
  const closeBtn = document.getElementById('closeCustomizerBtn');
  const saveBtn = document.getElementById('saveCustomizerBtn');
  const resetBtn = document.getElementById('resetCustomizerBtn');
  const exportBtn = document.getElementById('exportConfigBtn');

  if (!openBtn || !modal) return;

  const friendNameInput = document.getElementById('cfgInputFriendName');
  const nicknameInput = document.getElementById('cfgInputNickname');
  const dateInput = document.getElementById('cfgInputBirthdate');
  const letterInput = document.getElementById('cfgInputLetter');

  const populateInputs = () => {
    const cfg = window.BIRTHDAY_CONFIG || {};
    if (friendNameInput) friendNameInput.value = cfg.friendName || '';
    if (nicknameInput) nicknameInput.value = cfg.nickname || '';
    if (dateInput) dateInput.value = cfg.birthdate || '';
    if (letterInput && cfg.letter?.paragraphs) {
      letterInput.value = cfg.letter.paragraphs.join('\n\n');
    }
  };

  openBtn.addEventListener('click', () => {
    populateInputs();
    modal.classList.remove('hidden');
  });

  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      if (!window.BIRTHDAY_CONFIG) window.BIRTHDAY_CONFIG = {};
      if (friendNameInput) window.BIRTHDAY_CONFIG.friendName = friendNameInput.value.trim() || 'Friend';
      if (nicknameInput) window.BIRTHDAY_CONFIG.nickname = nicknameInput.value.trim() || 'Legend';
      if (dateInput) window.BIRTHDAY_CONFIG.birthdate = dateInput.value.trim();
      if (letterInput && window.BIRTHDAY_CONFIG.letter) {
        window.BIRTHDAY_CONFIG.letter.paragraphs = letterInput.value.split('\n\n').filter(p => p.trim().length > 0);
      }

      // Save to localStorage for instant persistence in browser
      localStorage.setItem('BIRTHDAY_CUSTOM_CONFIG', JSON.stringify({
        friendName: window.BIRTHDAY_CONFIG.friendName,
        nickname: window.BIRTHDAY_CONFIG.nickname,
        birthdate: window.BIRTHDAY_CONFIG.birthdate,
        letter: window.BIRTHDAY_CONFIG.letter
      }));

      applyConfigToDOM();
      modal.classList.add('hidden');
      alert('✨ Changes saved successfully! Your custom details are live!');
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset all details back to original defaults?')) {
        localStorage.removeItem('BIRTHDAY_CUSTOM_CONFIG');
        location.reload();
      }
    });
  }

  // Export updated config.js file for easy GitHub push!
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const configCode = `// Generated Birthday Surprise Configuration\nwindow.BIRTHDAY_CONFIG = ${JSON.stringify(window.BIRTHDAY_CONFIG, null, 2)};\n`;
      const blob = new Blob([configCode], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'config.js';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
}

// -------------------------------------------------------------
// 7. Ambient Particle Background Canvas (Stars & Floating Bubbles)
// -------------------------------------------------------------
function initBackgroundCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const count = 45;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.6 - 0.2,
      opacity: Math.random() * 0.7 + 0.3,
      color: ['#f43f5e', '#ec4899', '#8b5cf6', '#38bdf8', '#facc15'][Math.floor(Math.random() * 5)]
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();
}
