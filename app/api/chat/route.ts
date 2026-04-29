import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { BERNIE_SYSTEM_PROMPT } from '@/lib/prompt';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: BERNIE_SYSTEM_PROMPT,
    messages,
  });

  return result.toDataStreamResponse();
}
