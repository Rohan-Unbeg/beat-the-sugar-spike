# SugarSync

**Real-Time, Context-Aware Health Nudges for Sugar Reduction**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?logo=vercel&style=for-the-badge)](https://beat-the-sugar-spike.vercel.app/) [![Watch the Demo](https://img.shields.io/badge/Watch_Demo-YouTube-red?logo=youtube&style=for-the-badge)](http://youtube.com/watch?v=JP4atOTBJS0)

SugarSync Demo Video

https://github.com/user-attachments/assets/09a76c10-d0fa-4412-ae0b-a1e8179462fd

You can also watch it on Youtube [here](https://www.youtube.com/watch?v=JP4atOTBJS0).

SugarSync is a web application designed to bridge the gap between daily sugar consumption and immediate health awareness. By leveraging real-time logging, simulated biometric data, and AI-driven insights, it helps users build healthier habits through instant feedback loops rather than delayed metrics.

---

## 📋 Feature Implementation Status

The following table outlines the development status of core and advanced features against the project requirements.

| Category | Feature | Status | Implementation Details |
| :--- | :--- | :--- | :--- |
| **Core Interaction** | **Fast Logging (<10s)** | ✅ **Complete** | One-tap presets and AI-powered voice input implemented. |
| | **Signup-Free Access** | ✅ **Complete** | Device-based anonymous authentication with smooth onboarding. |
| | **Passive Health Sync** | ✅ **Complete** | Simulated integration for Steps and Heart Rate (Google Fit model). |
| **Engagement** | **Habit Rituals** | ✅ **Complete** | Daily streak logic, progress visualization, and retention hooks. |
| | **Gamification** | ✅ **Complete** | XP system, level progression, and variable reward sound effects. |
| **Intelligence** | **Context-Aware Insights**| ✅ **Complete** | ML-driven feedback based on time, BMI, and activity levels. |
| | **Explainability** | ✅ **Complete** | "Explain Why" toggle provides biological reasoning for every tip. |
| **Advanced** | **Voice Logging** | ✅ **Complete** | Web Speech API integration for hands-free data entry. |
| | **Photo Logging** | ❌ *Planned* | Architecture ready; de-scoped for prototype stability. |

---

## 🚀 Key Features

### 1. Frictionless Data Capture
- **Voice & Text Input**: Utilizes `Web Speech API` and `Groq (Llama-3)` to parse natural language inputs (e.g., "I just had a chai") into structured nutritional data.
- **One-Tap Presets**: Optimized UI for the most frequent sugar sources (Coffee, Sweets, Soft Drinks).

### 2. Real-Time Biological Insights
- **Context Engine**: Instead of generic advice, the system analyzes current state (Time of Day, Recent Activity, Accumulated Sugar) to generate specific nudges.
  - *Example*: "High sugar intake at 10 PM -> Warning about Deep Sleep reduction."
- **Simulated Biometrics**: A dedicated background simulation engine mimics real-time changes in Heart Rate and Steps to demonstrate how the app adapts to physical activity.

### 3. Psychological Behavioral Design
- **Fogg Behavior Model**: Triggers (notifications) + Ability (easy logging) + Motivation (streaks/XP).
- **Variable Rewards**: randomized interactions and soundscapes to prevent user fatigue and habituate usage.

---

## 🧠 AI & ML Architecture

SugarSync uses a **Multi-Layered Intelligence Engine** to ensure 100% reliability and accurate nutritional analysis:

1.  **Primary Layer: Google Gemini 2.5 Flash** (v1beta)
    -   Handles complex natural language queries (e.g., "I just ate a heavy aloo paratha breakfast").
    -   Extracts structured JSON: `{ name, sugar_g, category, icon }`.
2.  **Fallback Layer: Groq (Llama-3.3-70B)**
    -   Activates instantly if Gemini rate limits or fails.
    -   Provides high-speed inference for redundant reliability.
3.  **Database Layer: OpenFoodFacts API**
    -   If LLMs fail, the system queries the global OpenFoodFacts database for exact product matches.
4.  **Context Engine (Rule-Based ML)**
    -   Synthesizes user biometrics (BMI, Age, Gender) + Real-time Activity (Simulated Steps/HR) to generate hyper-personalized insights.
    -   *Example*: "Your heart rate is high (110bpm) after that sugary donut. Insulin spike detected."

---

## 🛠️ Technical Stack

-   **Frontend**: Next.js 15 (App Router), React 19, TypeScript
-   **Styling**: Tailwind CSS 4.0, Framer Motion (Animations), Lucide React (Icons)
-   **State Management**: Zustand (Persisted Store)
-   **Backend**: Firebase (Firestore, Anonymous Auth)
-   **AI/LLM**: Google Gemini API, Groq SDK, OpenFoodFacts API
-   **Automation**: Puppeteer (for automated demo generation)

---

## 🚀 Deployment Instructions

This project is optimized for deployment on **Vercel**.

1.  **Push to GitHub**: Ensure your repository is up to date.
2.  **Import to Vercel**: Connect your GitHub repo to Vercel.
3.  **Environment Variables**: Add the following in Vercel Project Settings:
    -   `NEXT_PUBLIC_GEMINI_API_KEY`
    -   `NEXT_PUBLIC_GROQ_API_KEY`
    -   `NEXT_PUBLIC_FIREBASE_API_KEY`
    -   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
    -   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
    -   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
    -   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
    -   `NEXT_PUBLIC_FIREBASE_APP_ID`
4.  **Deploy**: Click "Deploy". The app will be live in <1 minute.

---

## 🏃 Local Setup

1.  **Clone & Install**
    ```bash
    git clone https://github.com/Rohan-Unbeg/beat-the-sugar-spike.git
    cd beat-the-sugar-spike
    npm install
    ```

2.  **Configure Env**
    Rename `.env.example` to `.env.local` and add your API keys.

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

4.  **Run Automated Demo** (Optional)
    ```bash
    node scripts/record_demo.js
    ```

---

## 👥 Contributors

-   **Rohan Unbeg** - Full Stack Engineering & AI Integration
-   **Pranav Chavan** - Frontend Development & Design

*Submitted for Hackathon 2026*
