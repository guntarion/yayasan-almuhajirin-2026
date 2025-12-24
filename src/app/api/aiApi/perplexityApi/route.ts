// src/app/api/aiApi/perplexityApi/route.ts
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// Define an extended type for the Perplexity response
type PerplexityChatCompletion = OpenAI.Chat.Completions.ChatCompletion & {
  citations?: string[];
};

const client = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY,
  baseURL: 'https://api.perplexity.ai',
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    // Create non-streaming response
    const response = await client.chat.completions.create({
      model: 'sonar', // or your preferred model
      messages,
      stream: false,
      temperature: 0.2,
      top_p: 0.9,
    });

    // Extract content and citations from the response
    const perplexityResponse = response as PerplexityChatCompletion;
    const result = {
      content: perplexityResponse.choices[0]?.message?.content || '',
      citations: perplexityResponse.citations || [],
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}