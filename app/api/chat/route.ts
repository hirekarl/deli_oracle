import { google } from '@ai-sdk/google';
import { streamText, tool, convertToModelMessages } from 'ai';
import { BERNIE_SYSTEM_PROMPT } from '@/lib/prompt';
import { z } from 'zod';
import { logShakedown, getShakedownLogs } from '@/lib/shakedown-logger';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response(JSON.stringify({ error: 'API key missing' }), { status: 500 });
    }

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid request: messages array is required', { status: 400 });
    }

    const recentLogs = getShakedownLogs().slice(0, 5);
    const historyContext = recentLogs.length > 0 
      ? `\n\nRECENT SHAKEDOWNS YOU'VE ALREADY MADE:
         ${recentLogs.map(l => `- ${l.partnerName} (${l.shakedownCode})`).join('\n')}
         Don't be a broken record.`
      : '';

    const result = streamText({
      model: google('gemini-2.5-flash-preview-04-17'),
      system: BERNIE_SYSTEM_PROMPT + historyContext + `
      ADDITIONAL INSTRUCTION:
      If you recommend a Preferred Partner, you MUST call the 'triggerShakedown' tool.`,
      messages: convertToModelMessages(messages),
      tools: {
        triggerShakedown: tool({
          description: 'Triggers a shakedown badge for an affiliate partner.',
          parameters: z.object({
            partnerName: z.string(),
            shakedownCode: z.string(),
            offer: z.string(),
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

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error('Deli Oracle API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
