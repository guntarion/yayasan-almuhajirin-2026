// src/app/(DashboardLayout)/testing-page/sonarperplexity/page.tsx
'use client';

import { useState } from 'react';
import CommonBreadcrumb from '@/components/shared/CommonBreadcrumb';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ResponseData {
  title?: string;
  introduction?: string;
  main_points?: Array<{
    heading: string;
    content: string;
  }>;
  conclusion?: string;
}

const PerplexitySonarTestPage = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [citations, setCitations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const systemMessage: Message = {
    role: 'system',
    content: `You are a helpful AI assistant. Please structure your responses as a JSON object with the following format:
      {
        "title": "Optional title for the response",
        "introduction": "A brief introduction paragraph",
        "main_points": [
          {
            "heading": "Key Point 1",
            "content": "Detailed explanation of the first point"
          },
          {
            "heading": "Key Point 2",
            "content": "Detailed explanation of the second point"
          }
        ],
        "conclusion": "Optional concluding paragraph"
      }

      Be precise and concise in your explanations.
      Use proper punctuation and formatting in the content.
      Each main point should focus on a distinct aspect of the answer.
    `,
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setCitations([]);
    setResponse(null);

    const messages = [
      systemMessage,
      {
        role: 'user',
        content: prompt,
      },
    ];

    try {
      const response = await fetch('/api/aiApi/perplexitySonarApi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Network response was not ok');
      }

      if (data.content) {
        try {
          const parsedContent = JSON.parse(data.content);
          setResponse(parsedContent);
        } catch {
          setResponse({
            introduction: data.content,
          });
        }
      }

      if (data.citations && Array.isArray(data.citations)) {
        setCitations(data.citations);
      }
    } catch (error) {
      console.error('Error:', error);
      setResponse({
        introduction: error instanceof Error ? error.message : 'An error occurred while fetching the response.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderResponse = () => {
    if (!response) return null;

    return (
      <ScrollArea className='h-[400px] w-full rounded-md border p-4 bg-muted/50'>
        <div className='space-y-4'>
          {response.title && <h2 className='text-xl font-bold'>{response.title}</h2>}
          {response.introduction && <p className='text-muted-foreground'>{response.introduction}</p>}
          {response.main_points && response.main_points.length > 0 && (
            <div className='space-y-4'>
              {response.main_points.map((point, index) => (
                <div key={index} className='space-y-2'>
                  <h3 className='text-lg font-semibold'>{point.heading}</h3>
                  <p>{point.content}</p>
                </div>
              ))}
            </div>
          )}
          {response.conclusion && <p className='mt-4 text-muted-foreground'>{response.conclusion}</p>}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className='container mx-auto p-4'>
      <CommonBreadcrumb pageTitle='Sonar Perplexity AI Test' parent='AI Support' />
      <Card className='p-6'>
        <div className='space-y-4'>
          <h2 className='text-2xl font-bold'>SONAR AI Test</h2>
          <p className='text-muted-foreground'>Ask anything and get a structured response from Perplexity AI</p>

          <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder='Enter your question here...' className='min-h-[100px]' />

          <Button onClick={handleSubmit} disabled={isLoading || !prompt.trim()} className='w-full sm:w-auto'>
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Processing...
              </>
            ) : (
              'Get Answer'
            )}
          </Button>

          {(response || citations.length > 0) && (
            <div className='space-y-4'>
              {renderResponse()}

              {citations.length > 0 && (
                <div className='rounded-md border p-4'>
                  <h3 className='text-lg font-semibold mb-2'>Sources:</h3>
                  <ul className='space-y-2'>
                    {citations.map((citation, index) => (
                      <li key={index}>
                        <a href={citation} target='_blank' rel='noopener noreferrer' className='text-blue-500 hover:text-blue-700 break-all'>
                          {citation}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PerplexitySonarTestPage;
