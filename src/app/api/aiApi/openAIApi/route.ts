// src\app\api\aiApi\openAIApi\route.ts
import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    if (!req.body) {
      return NextResponse.json({ error: 'Request body is required' }, { status: 400 });
    }

    // const { systemPrompt, userPrompt, model = 'gpt-4o-2024-11-20' } = await req.json();

    const body = await req.json();

    // Destructure with default values and type checking
    const {
      systemPrompt,
      userPrompt = body.prompt, // Fallback to support both 'prompt' and 'userPrompt'
      model = 'gpt-4o-2024-11-20',
    } = body;

    // Validate userPrompt
    if (!userPrompt) {
      return NextResponse.json(
        {
          error: 'User prompt is required',
          receivedBody: body, // Help debug what was received
        },
        { status: 400 }
      );
    }

    if (!userPrompt) {
      return NextResponse.json({ error: 'User prompt is required' }, { status: 400 });
    }

    // Prepare messages array with proper typing
    const messages: ChatCompletionMessageParam[] = [];
    if (systemPrompt) {
      messages.push({ role: 'system' as const, content: systemPrompt });
    }
    messages.push({ role: 'user' as const, content: userPrompt });

    const response = await openai.chat.completions.create({
      model,
      messages,
      stream: true,
    });

    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    (async () => {
      try {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            await writer.write(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
          }
        }
        await writer.close();
      } catch (error) {
        console.error('API error:', error);

        // More detailed error response
        return NextResponse.json(
          {
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
          },
          { status: 500 }
        );
      }
    })();

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('API error:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
    }
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
