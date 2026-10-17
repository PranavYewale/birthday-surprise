# 🎂 The Ultimate Interactive Birthday Surprise Website

An awesome, interactive, and surprising birthday celebration website designed to be easily hosted on **GitHub Pages** for free!

---

## ✨ Features

- 🎁 **Cinematic Mystery Parcel Opening**: Glowing 3D gift box with ribbons that unwraps with confetti and fanfare.
- 🎂 **Interactive 3D Birthday Cake**:
  - Realistic flickering flames with wax drips and smoke animations.
  - **Microphone blow detection**: Your friend can literally blow into their phone/laptop microphone to extinguish the candles!
  - Tap / click fallback to blow out candles if mic is disabled.
  - Full-screen confetti fireworks and celebratory wish registration.
- 🎰 **Mystery Birthday Vaults**:
  - 🥂 **The Roast & Toast**: Hilarious, heartfelt truth assessment.
  - 🎟️ **The Golden Friendship Pass**: A lifetime voucher with customizable perks.
  - 🃏 **The Golden Scratch Card**: Real interactive scratch-off canvas foil with lottery jackpot sound effects!
- 📸 **Memory Lane (Polaroid Photo Wall)**:
  - Realistic vintage polaroids with pushpins, 3D tilt, and click-to-expand lightbox.
  - Live photo upload tool to preview real photos directly in the browser!
- 💌 **Vintage Sealed Envelope & Typewriter Letter**:
  - 3D wax seal that breaks open.
  - Parchment letter sliding out with genuine typewriter sound effects and character-by-character typing.
- 🎈 **15-Second Balloon Rush Arcade Minigame**:
  - Floating balloons, golden balloons (+3 pts), pop sounds, countdown timer, and "Birthday Champion" crown!
- 🎵 **Offline Web Audio Synthesizer**:
  - Plays the classic Happy Birthday chime melody in a music box timbre + pop/fanfare/chime sound effects with **zero external audio dependencies** (no broken links).
  - Can also play your own custom MP3 soundtrack if desired!
- ⚙️ **In-Page Live Customizer**:
  - Click the "⚙️ Customize" button on the website to change the friend's name, birthdate, and letter text directly on screen, or edit `js/config.js`!

---

## 🚀 How to Host on GitHub Pages (Step-by-Step)

Hosting this on GitHub Pages takes less than **2 minutes**:

### Step 1: Push to GitHub

If you haven't initialized a repository yet, run these commands in your terminal:

```bash
git add .
git commit -m "Create interactive birthday website"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git
git push -u origin main
```

*(Replace `<YOUR_GITHUB_USERNAME>` and `<YOUR_REPOSITORY_NAME>` with your GitHub details)*

---

### Step 2: Enable GitHub Pages

1. Open your repository on **[GitHub.com](https://github.com)**.
2. Click on the **Settings** tab (the gear icon at the top).
3. In the left sidebar, click on **Pages** (under the "Code and automation" section).
4. Under **Build and deployment** -> **Source**:
   - Select **Deploy from a branch**.
   - Under **Branch**, select `main` (or `master`) and leave the folder as `/ (root)`.
   - Click **Save**.
5. Wait 30–60 seconds, and GitHub will provide your live URL:
   ```
   https://<YOUR_GITHUB_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>/
   ```
6. Send the link to your friend! 🎉

---

## 🎨 How to Personalize for Your Friend

### Option A: The Easy In-Browser Way
1. Open `index.html` in your browser.
2. Click the **"⚙️ Customize"** button in the top right.
3. Type your friend's name, nickname, date, and heartfelt letter.
4. Click **"Save Changes"** or **"Download config.js"** to save!

### Option B: Edit `js/config.js`
Open `js/config.js` in any text editor and adjust:
- `friendName`: e.g., `"Alex"`
- `nickname`: e.g., `"The Legend"`
- `birthdate`: e.g., `"October 18"`
- `polaroids`: Paste links to your photos or put images inside the `assets/images/` folder and link them (e.g., `"assets/images/pic1.jpg"`).
- `letter`: Write your personal message.
- `bgmUrl`: Optional link to a custom MP3 song (leave empty to use the built-in chime melody).

---

## 📱 Mobile Friendly
Designed to run at 60 FPS on iPhones, Android phones, tablets, and desktop browsers.
