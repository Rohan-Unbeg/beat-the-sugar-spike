# Beat the Sugar Spike

**Real-Time, Context-Aware Health Nudges for Sugar Reduction**

Beat the Sugar Spike is a web application designed to bridge the gap between daily sugar consumption and immediate health awareness. By leveraging real-time logging, simulated biometric data, and AI-driven insights, it helps users build healthier habits through instant feedback loops rather than delayed metrics.

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

## 🛠️ Technical Stack

- **Frontend Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0, Framer Motion
- **State Management**: Zustand (with Persist middleware)
- **Backend & Auth**: Firebase (Firestore, Anonymous Auth, Google Auth)
- **AI Inference**: Groq SDK (Llama-3.3-70B)

---

## 🏃 Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rohan-Unbeg/beat-the-sugar-spike.git
   cd beat-the-sugar-spike
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

---

## 👥 Contributors

- **Rohan Unbeg** - Full Stack Engineering & AI Integration

*Submitted for M-Code Hackathon 2026*
