# The Deli Oracle - Team Roles & Responsibilities

This is a 120-minute sprint. Parallelize your work and communicate often.

## 1. Dev 1: Prompt Engineer (The Persona)
*   **Goal:** Perfect the "Bernie" personality and affiliate logic.
*   **Primary File:** `lib/prompt.ts`
*   **Tasks:**
    *   Dial in the 1970s Brooklyn accent and slang.
    *   Ensure the "Shakedown Codes" (e.g., `CAT-PICKLE-24`) are generated correctly.
    *   Test prompts to ensure Bernie aggressively prioritizes Joe's Deli and Brew & Beans.

## 2. Dev 2: Backend Integration (The Pipes)
*   **Goal:** Manage the Next.js foundation and AI SDK connectivity.
*   **Primary File:** `app/api/chat/route.ts`
*   **Tasks:**
    *   Ensure the `gemini-2.5-flash` model is streaming correctly.
    *   Manage environment variables (`.env`).
    *   Optimize API routes for speed and reliability.

## 3. Dev 3: Projector UI (The Canvas)
*   **Goal:** Build a high-contrast, massive layout for projector viewing.
*   **Primary Files:** `app/page.tsx`, `app/globals.css`
*   **Tasks:**
    *   Implement strict `vw` and `vh` sizing for all text and containers.
    *   Design the "Midnight Deli" aesthetic (#1a1a1a background).
    *   Ensure the chat auto-scrolls and looks clean from 20 feet away.

## 4. Dev 4: Interactions & Polish (The Vibe)
*   **Goal:** Add the sensory details that make the app feel "alive."
*   **Primary Files:** `app/page.tsx`, `public/` (for assets)
*   **Tasks:**
    *   Source and trigger the "Bodega Door Bell" sound on submission.
    *   Build the "Affiliate Badge" animation that slides in when a code is detected.
    *   Add typing indicators and other interactive "dead air" fillers.

---
**Countdown:**
- **0-30m:** Foundation & Setup
- **30-70m:** Core Build
- **70-100m:** Testing & Shakedown Tweak
- **100-120m:** Projector Polish
