// src/app/api/aiApi/perplexitySonarApi/route.ts

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

    const response = await client.chat.completions.create({
      model: 'sonar',
      messages,
      response_format: { type: 'text' },
      temperature: 0.2,
      top_p: 0.9,
      stream: false,
    });

    const perplexityResponse = response as PerplexityChatCompletion;
    const responseContent = perplexityResponse.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error('Empty response from Perplexity API');
    }

    try {
      // Extract JSON from the markdown code block
      const jsonMatch = responseContent.match(/```json\s*([\s\S]*?)\s*```/);
      if (!jsonMatch) {
        return NextResponse.json({
          content: responseContent.replace(/```json|```/g, '').trim(),
          citations: perplexityResponse.citations || [],
        });
      }

      // Parse the extracted JSON
      const parsedContent = JSON.parse(jsonMatch[1]);

      // Convert JSON to text content with minimal formatting
      let formattedContent = '';

      // Add title if exists
      if (parsedContent.title) {
        formattedContent += `# ${parsedContent.title}\n\n`;
      }

      // Add introduction
      if (parsedContent.introduction) {
        formattedContent += `${parsedContent.introduction}\n\n`;
      }

      // Add main points
      if (Array.isArray(parsedContent.main_points)) {
        parsedContent.main_points.forEach((point: { heading: string; content: string }) => {
          formattedContent += `### ${point.heading}\n\n${point.content}\n\n`;
        });
      }

      // Add conclusion if exists
      if (parsedContent.conclusion) {
        formattedContent += `### Conclusion\n\n${parsedContent.conclusion}`;
      }

      return NextResponse.json({
        content: formattedContent,
        citations: perplexityResponse.citations || [],
      });
    } catch (parseError) {
      console.error('Parse error:', parseError);
      // If JSON parsing fails, return the raw text
      return NextResponse.json({
        content: responseContent.replace(/```json|```/g, '').trim(),
        citations: perplexityResponse.citations || [],
      });
    }
  }
 catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}