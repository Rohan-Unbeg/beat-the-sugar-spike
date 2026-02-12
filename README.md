# 🍬 Beat the Sugar Spike

> Track your sugar intake instantly. Get real-time, context-aware health nudges. Build streaks, earn XP, and level up your lifestyle.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)

---

## 🚀 What it Does

**Beat the Sugar Spike** is a gamified health companion that makes tracking sugar intake _fast, fun, and frictionless_. Instead of tedious food journaling, users can log sugar consumption in under 10 seconds and receive personalized, context-aware health nudges powered by simulated ML.

### Key Features

- ⚡ **10-Second Logging** — Tap-to-log with preset categories (Chai, Soft Drink, Sweets, etc.)
- 🧠 **Smart Insights** — Context-aware nudges based on time-of-day, cumulative intake, and streaks
- 🔥 **Streak System** — Daily streak tracking to build consistent habits
- 🏆 **XP & Rewards** — Earn points for tracking and staying under limits, level up with milestones
- ⌚ **Device Simulator** — Mock wearable integration for steps and sleep data
- 📊 **Daily Progress** — Visual tracking against WHO-recommended limits
- 🔒 **Value-First Signup** — Users experience the full app anonymously before being prompted to sign up

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** (App Router) | Full-stack React framework |
| **TypeScript** | Type safety |
| **Tailwind CSS 4** | Utility-first styling |
| **Framer Motion** | Animations & micro-interactions |
| **Zustand** | State management (persisted to LocalStorage) |
| **Shadcn/UI** | Polished UI component primitives |
| **Radix UI** | Accessible headless components |
| **Lucide React** | Beautiful icon library |
| **Web Audio API** | Haptic-like audio feedback |
---

## 📂 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page (hero + redirect)
│   ├── layout.tsx            # App shell (metadata, fonts)
│   ├── globals.css           # Design tokens & base styles
│   ├── onboarding/page.tsx   # 4-step gamified setup
│   └── dashboard/page.tsx    # Main interaction hub
├── components/
│   ├── onboarding/           # OnboardingFlow (slider-based)
│   ├── dashboard/            # SugarLogger, DailyStats, DataSyncSimulator
│   ├── feedback/             # InsightCard, RewardModal, Toast, SuccessAnimation, SignupUpsell
│   └── ui/                   # Shadcn/UI components (Button, Slider, Card, etc.)
└── lib/
    ├── store.ts              # Zustand store (user, logs, streaks, scores)
    ├── ml-simulation.ts      # Simulated ML engine for context-aware insights
    ├── audio.ts              # Web Audio success/error sounds
    └── utils.ts              # Tailwind merge utility
```

---

## 🏃 How to Run

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/beat-the-sugar-spike.git
cd beat-the-sugar-spike

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

---

## 🎮 Usage Flow

1. **Landing Page** — Hit "Start Your Streak" to begin
2. **Onboarding** — Quick 4-step setup (age, weight, height, sex) via gamified sliders
3. **Dashboard** — Log sugar in 1 tap, view daily progress, and get smart insights
4. **Gamification** — Earn XP, maintain your streak, and unlock level-up rewards
5. **Signup Prompt** — After earning 50+ XP, a subtle prompt encourages you to save progress

---

## 🧠 ML Simulation (Context-Aware Insights)

The app simulates an ML engine that generates personalized health nudges based on:

| Signal | Example Insight |
|---|---|
| Late night sugar | _"Sugar this late can reduce deep sleep by 15%"_ |
| High single intake | _"A 10-minute walk can reduce the crash by 30%"_ |
| Over daily limit | _"You've crossed the WHO limit. Try a brisk walk"_ |
| Consistent streak | _"23% of regular trackers reduce intake in 2 weeks"_ |
| Afternoon cravings | _"Dehydration mimics sugar cravings in 60% of cases"_ |
| Clean day | _"Stable blood sugar = stable focus"_ |

## 🚀 Elite Hackathon Features

To stand out in the **M-Code** competition, we've implemented advanced "Elite" features that go beyond a simple tracker:

- **🤖 AI Food Parser (Groq)**: Uses Llama-3 to parse natural language (e.g., "1 plate of Pav Bhaji") and estimate sugar content instantly. No more rigid databases.
- **🎤 Voice Logging**: One-tap voice capture using the Web Speech API. Log sugar without typing, in under 3 seconds.
- **⌚ Passive Health & Wearable Sync**: Seamlessly "Syncs" with device health data (simulated Google Fit) to provide context-aware feedback.
- **🧠 ML-Driven Explainability**: The app doesn't just give tips; it explains the **biological reasoning** (e.g., *"Walking blunts the insulin spike"*).
- **🕹️ Psychological Hooks**: Built on the Fogg Behavior Model – using streaks, variable rewards, and instant gratification loops.

---

## 🛠 Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS 4.0 (Modern Vibrant Palette)
- **State**: Zustand 5 + Persistence
- **Animations**: Framer Motion 12
- **Database**: Firebase (Firestore, Auth, Anonymous UID)
- **AI**: Groq (Llama-3.3-70B Logic Engine)
- **Voice**: Web Speech API

---

## 📋 Hackathon Requirements Status

| Requirement | Status | Implementation Detail |
|---|---|---|
| **2.1 Fast Logging** | ✅ Complete | One-tap presets + AI Voice Search |
| **2.2 Signup-Free** | ✅ Complete | Device-based Anonymous UID with sliders |
| **2.3 Passive Sync** | ✅ Complete | Google Fit "Real-Feel" permission flow |
| **2.4 Habit Ritual** | ✅ Complete | Dynamic Streaks & Progress Bars |
| **2.5 Variable Rewards**| ✅ Complete | Success sounds + Randomized Luck XP |
| **2.7 Context AI** | ✅ Complete | Cause → Effect insights based on BMI/Steps |
| **3.3 Bonus: ML** | ✅ Complete | Groq integration + Explainability toggle |

---

## 👥 Team
- **Rohan Unbeg**

## 📄 License
Built for **M-Code Hackathon 2026** (IIEST Shibpur)
