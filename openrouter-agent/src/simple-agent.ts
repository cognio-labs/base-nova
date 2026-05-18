import { OpenRouter, tool, stepCountIs } from '@openrouter/agent';
import { z } from 'zod';

async function main() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is required');

  const client = new OpenRouter({ apiKey });

  // 1. Define a tool
  const weatherTool = tool({
    name: 'get_weather',
    description: 'Get the current weather for a location',
    inputSchema: z.object({
      location: z.string().describe('City name'),
    }) as any,
    execute: async ({ location }: any) => {
      return { location, temperature: '22°C', condition: 'Sunny' };
    },
  });

  console.log('--- Calling Model ---');

  // 2. Call the model (the "Inner Loop")
  const result = client.callModel({
    model: 'openrouter/auto',
    input: 'What is the weather in Tokyo?',
    tools: [weatherTool],
    stopWhen: [stepCountIs(5)],
  });

  // 3. Get the final text
  const text = await result.getText();
  console.log('Response:', text);
}

main().catch(console.error);
