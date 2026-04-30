# 🐈 The Deli Oracle

**Tagline:** He’s seen it all. He doesn’t care. But he’s got the answers.

The Deli Oracle is a projector-first, AI-powered interactive experience designed for the 2026 Brooklyn Hackathon. It brings to life **Bernie**, a grizzled, 12-year-old bodega cat who has witnessed the transformation of Bushwick since the Bloomberg administration.

Bernie provides "neighborhood advice" with a heavy 1970s Brooklyn accent while secretly funneling users to "Preferred Partners" through a street-wise referral system we call **The Shakedown.**

---

## 🚀 Key Features

- **Grizzled Persona:** A custom-tuned AI engine using `gemini-2.5-flash` that captures the raw, cynical, yet heart-of-gold vibe of a New York bodega cat.
- **The Shakedown Logic:** Bernie doesn't just give advice; he executes "deals." Using structured tool calling, he recommends affiliate partners (like Joe's Deli) and generates unique referral codes (e.g., `CAT-PICKLE-24`).
- **Projector-First UI:** A high-contrast, midnight-themed interface built with `vw/vh` units to ensure readability from 20 feet away.
- **Live Shakedown Ticker:** A backend logging system and API (`/api/shakedowns`) that tracks every "favor" Bernie dispenses in real-time.
- **Neon Aesthetic:** A minimalist, high-impact design featuring a glowing "Neon Cat" background and animated ticket-style affiliate badges.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **AI Orchestration:** Vercel AI SDK
- **Model:** Google Gemini 2.5 Flash
- **Styling:** Vanilla CSS (Viewport-relative)
- **Validation:** Zod (for structured tool parameters)
- **Language:** TypeScript

---

## 📦 Getting Started

### 1. Prerequisites
- Node.js 20+
- A Google AI API Key

### 2. Setup Environment
Create a `.env` file in the root directory:
```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

### 3. Install & Run
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to start the shakedown.

---

## 👥 The Crew

- **Dev 1 (Prompt):** The "Brain" – Tuning Bernie's cynicism.
- **Dev 2 (Backend):** The "Pipes" – AI SDK, tool calling, and logging.
- **Dev 3 (UI):** The "Canvas" – Projector-optimized layout and styling.
- **Dev 4 (Vibe):** The "Polish" – Audio triggers and interaction animations.

---

## 📜 Shakedown Verification
You can verify Bernie's loyalty by running the automated shakedown script:
```bash
npx tsx -r dotenv/config scripts/verify-shakedown.ts
```

*“Tell 'em Bernie sent ya. Deadass.”*
