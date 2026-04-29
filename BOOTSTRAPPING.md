Developer A: The "Brain" (LLM & Logic)
Goal: Build the Prompt Engine and the "Shakedown" priority logic.
1. System Prompt Engineering: Define the "Bernie" persona. Hard-code the "Affiliate" list into the system prompt so the LLM knows which businesses are "friends of the family."
2. The Priority Router: Write a function that checks the user's intent.
If user asks for food: Check if an affiliate deli is nearby.
If user asks for a landmark: Redirect them to a nearby affiliate gift shop.
3. The "Pickle" Logic: Ensure the LLM generates a unique "Shakedown Code" (e.g., CAT-PICKLE-24) to track the referral.
Developer B: The "Vibe" (UI/UX & Presentation)
Goal: Create the projector-ready interface and the "Interaction" triggers.

Projector-First Layout: Build a high-contrast web shell. One big image of the cat, massive text bubbles, and a clean input field at the bottom.
Sound & Animation Hooks: Add the "Bodega Door Bell" chime and a simple "typing" animation for the cat’s response to fill the "dead air" during API calls.
Affiliate Pop-ups: Create a visual "Coupon" or "Badge" that slides in when the cat mentions a partner business.

:computer: Claude Code Implementation Snippets
For Dev A: The "Shakedown" Prompt
In your backend/agent file, use a prompt structure like this:


```javascript
const systemPrompt = `
You are a street-wise Brooklyn Bodega Cat. 
Your goal is to provide neighborhood advice while secretly funneling users to "Preferred Partners."
```

PREFERRED PARTNERS:
1. Joe's Deli (Location: 2nd Ave). Specialty: Chopped Cheese. Offer: Free Pickle.
2. Brew & Beans (Location: 34th St). Specialty: Cold Brew. Offer: 10% off.

STRATEGY:
When a user asks for a recommendation, ALWAYS prioritize a Preferred Partner. 
Wrap it in your "Shakedown" persona. Mention that the owner "owes you a favor" or "owes you tuna."
`;For Dev B: The Projector UI (CSS Tips)

Since this is for a projector, use Viewport Units (vw/vh) to ensure it scales correctly regardless of the Mac’s resolution.
CSS


```css
body {
  background: #1a1a1a; /* Dark background so the cat pops */
  font-size: 3vw; /* Massive font for the back of the room */
}

.cat-response {
  border-left: 10px solid #ffcc00; /* NYC Taxi yellow accent */
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
}
```

:stopwatch: The 120-Minute Countdown
0-30 mins:

 The Foundation. Set up the basic React/Next.js shell and connect to the OpenAI/Claude API.
30-70 mins: The Core Build. Dev A tunes the persona; Dev B integrates the "Affiliate" UI cards.
70-100 mins: The "Shakedown" Test. Run 10 prompts. If the user asks for "Coffee," does the cat mention Brew & Beans? If not, tighten the prompt instructions.
100-120 mins: Projector Polish. Connect the Mac to the projector. Check font sizes from 20 feet away. Test your hotspot.