import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { BERNIE_SYSTEM_PROMPT } from '@/lib/prompt';
import { z } from 'zod';
import { logShakedown, getShakedownLogs } from '@/lib/shakedown-logger';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid request: messages array is required', { status: 400 });
    }

    const recentLogs = getShakedownLogs().slice(0, 5);
    const historyContext = recentLogs.length > 0 
      ? `\n\nRECENT SHAKEDOWNS YOU'VE ALREADY MADE:
         ${recentLogs.map(l => `- ${l.partnerName} (${l.shakedownCode})`).join('\n')}
         Don't be a broken record. If you've already shakedown-ed someone for a specific partner, maybe try a different one or just tell 'em to move along.`
      : '';

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: BERNIE_SYSTEM_PROMPT + historyContext + `
      
      ADDITIONAL INSTRUCTION: 
      If you recommend a Preferred Partner, you MUST call the 'triggerShakedown' tool. 
      This is how the system tracks the referral. Ensure the tool parameters match the partner info in your prompt.
      Always follow the OUTPUT STRUCTURE: start with 'Response: ' and include 'Referral_Code: ' if applicable.`,
      messages,
      tools: {
        triggerShakedown: tool({
          description: 'Triggers a shakedown badge for an affiliate partner.',
          parameters: z.object({
            partnerName: z.string().describe('The name of the partner (e.g., Joe\'s Deli)'),
            shakedownCode: z.string().describe('The referral code provided in the prompt (e.g., CAT-PICKLE-24)'),
            offer: z.string().describe('The specific offer (e.g., Free Pickle)'),
          }),
          execute: async ({ partnerName, shakedownCode, offer }) => {
            logShakedown({ partnerName, shakedownCode, offer });
            return {
              confirmed: true,
              message: `Referral for ${partnerName} tracked with code ${shakedownCode}.`,
            };
          },
        }),
      },
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('Deli Oracle API Error:', error);
    const errorMessage = error.message || 'Bernie is having a bad day and can\'t talk right now.';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
