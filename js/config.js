// ==============================================================================
// 🎂 BIRTHDAY SURPRISE CONFIGURATION
// Customize everything below for your friend!
// You can also edit these directly inside the website using the "⚙️ Customize" button!
// ==============================================================================

window.BIRTHDAY_CONFIG = {
  // Basic Information
  friendName: "Alex",
  nickname: "The Legend",
  birthdate: "October 18", // Or any date string
  yearOrAge: "21st", // e.g. "21st", "25th", or leave blank ""
  
  // Custom Audio (Leave empty "" to use the built-in 8-bit Music Box synthesizer)
  bgmUrl: "", 

  // Hero Section
  hero: {
    badge: "🎂 OFFICIAL CELEBRATION DISPATCH",
    title: "Happy Birthday,",
    subtitle: "Another 365 days of legendary adventures, chaotic laughs, and being an unmatched human being.",
    actionPrompt: "Tap the magic parcel to begin the experience 🎁"
  },

  // Cake Section
  cake: {
    candlesCount: 5,
    title: "Make a Secret Wish!",
    instructions: "Blow into your microphone 🎙️ or click the candles to blow them out!",
    blownMessage: "✨ Wish registered with the Universe! May all your dreams come true! ✨"
  },

  // Mystery Gift Boxes
  mysteryBoxes: [
    {
      id: "toast",
      icon: "🥂",
      tag: "THE TRUTH",
      title: "The Roast & Toast",
      teaser: "A totally unfiltered assessment of your greatness...",
      content: "You're not just a friend; you're the designated co-pilot of bad decisions, late-night philosophical debates, and uncontrollable laughter. You haven't aged a bit—your software just has more features and fewer bugs! Keep shining, you absolute rockstar. 🌟"
    },
    {
      id: "pass",
      icon: "🎟️",
      tag: "OFFICIAL VOUCHER",
      title: "The Golden Friendship Pass",
      teaser: "Legally binding and redeemable anytime...",
      content: "🎫 **LIFETIME FRIENDSHIP PASS**\n\n• Entitles holder to: 1 Free Dinner / Coffee on me anytime.\n• 1 Guaranteed rescue from awkward social situations.\n• Unlimited late-night emergency venting sessions.\n• Expiration: Never. Signed & Sealed! ✍️"
    },
    {
      id: "scratch",
      icon: "🎰",
      tag: "SCRATCH & WIN",
      title: "The Golden Scratch Vault",
      teaser: "Scratch off the silver foil to claim your grand prize!",
      scratchPrize: "🎉 JACKPOT: 1x All-Expenses-Paid Fun Outing & A Lifetime Warranty of my Friendship! 🎉"
    }
  ],

  // Memory Lane (Polaroids)
  polaroids: [
    {
      img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
      caption: "Partners in Crime since Day 1 🚀",
      date: "Unforgettable Days"
    },
    {
      img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
      caption: "The chaotic road trips & bad playlists 🎶",
      date: "Golden Moments"
    },
    {
      img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
      caption: "Proof that we somehow survived adulthood 🍕",
      date: "Memories for Life"
    },
    {
      img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
      caption: "To the next chapter of greatness! 🥂",
      date: "Today & Always"
    }
  ],

  // Heartfelt Letter (Typewriter effect)
  letter: {
    sender: "Your Best Friend",
    recipient: "Alex",
    greeting: "Dear Alex,",
    paragraphs: [
      "I wanted to take a moment today to remind you how much you mean to everyone around you.",
      "Life moves crazy fast, but having a genuine, supportive, hilarious friend like you makes the ride a million times better. Thank you for always showing up, for the spontaneous calls, and for being someone I can always count on.",
      "May this upcoming year shower you with boundless health, exponential success, wild adventures, and peace of mind.",
      "Happy Birthday, my friend! Let's make this year unforgettable."
    ],
    signoff: "Cheers to you,\nAlways in your corner 💛"
  },

  // Balloon Pop Mini-Game
  game: {
    targetScore: 10,
    timeLimit: 15, // seconds
    rewardMessage: "🏆 You are officially the Birthday Champion of the universe!"
  }
};
