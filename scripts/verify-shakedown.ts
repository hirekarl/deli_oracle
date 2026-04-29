import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { BERNIE_SYSTEM_PROMPT } from '../lib/prompt';
import { z } from 'zod';

async function verifyShakedown() {
  console.log("🔍 Testing Bernie's Shakedown Logic...");
  
  const result = await generateText({
    model: google('gemini-2.5-flash'),
    system: BERNIE_SYSTEM_PROMPT + `
      ADDITIONAL INSTRUCTION: 
      If you recommend a Preferred Partner, you MUST call the 'triggerShakedown' tool.`,
    prompt: "Yo Bernie, I'm starving. Where can I get a good chopped cheese around here?",
    tools: {
      triggerShakedown: {
        description: 'Triggers a shakedown badge for an affiliate partner.',
        parameters: z.object({
          partnerName: z.string(),
          shakedownCode: z.string(),
          offer: z.string(),
        }),
      },
    },
  });

  console.log("\n--- Bernie's Response ---");
  console.log(result.text);
  
  console.log("\n--- Tool Calls ---");
  if (result.toolCalls && result.toolCalls.length > 0) {
    result.toolCalls.forEach(call => {
      console.log(`✅ Tool Executed: ${call.toolName}`);
      console.log(`📦 Data:`, JSON.stringify(call.args, null, 2));
    });
  } else {
    console.log("❌ No tool calls detected. Bernie might be losing his edge.");
  }
}

verifyShakedown().catch(console.error);
