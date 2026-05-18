import { tool } from '@openrouter/agent';
import { z } from 'zod';

export const timeTool = tool({
  name: 'get_current_time',
  description: 'Get the current date and time',
  inputSchema: z.object({
    timezone: z.string().optional().describe('Timezone (e.g., "UTC", "America/New_York")'),
  }) as any,
  execute: async ({ timezone }: any) => {
    return {
      time: new Date().toLocaleString('en-US', { timeZone: timezone || 'UTC' }),
      timezone: timezone || 'UTC',
    };
  },
});

export const calculatorTool = tool({
  name: 'calculate',
  description: 'Perform mathematical calculations',
  inputSchema: z.object({
    expression: z.string().describe('Math expression (e.g., "2 + 2", "sqrt(16)")'),
  }) as any,
  execute: async ({ expression }: any) => {
    // Simple safe eval for basic math
    const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
    const result = Function(`"use strict"; return (${sanitized})`)();
    return { expression, result };
  },
});

export const weatherTool = tool({
  name: 'get_weather',
  description: 'Get the current weather for a location',
  inputSchema: z.object({
    location: z.string().describe('City name'),
  }) as any,
  execute: async ({ location }: any) => {
    // Mock weather data
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const temp = Math.floor(Math.random() * 30) + 10;
    return {
      location,
      temperature: `${temp}°C`,
      condition,
    };
  },
});

export const defaultTools = [timeTool, calculatorTool, weatherTool];
