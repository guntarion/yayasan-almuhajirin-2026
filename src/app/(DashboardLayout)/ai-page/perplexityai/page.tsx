// src/app/(DashboardLayout)/testing-page/perplexityai/page.tsx
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

const PerplexityTestPage = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [citations, setCitations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const systemMessage: Message = {
    role: 'system',
    content: `You are a helpful AI assistant. Please:
      - Provide detailed and accurate information
      - Include relevant citations and references
      - Be precise and concise
      - Structure your response logically
    `,
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setCitations([]);
    setResponse('');

    const messages: Message[] = [
      systemMessage,
      {
        role: 'user',
        content: prompt,
      },
    ];

    try {
      const response = await fetch('/api/aiApi/perplexityApi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.content) {
        setResponse(data.content);
      }

      if (data.citations && Array.isArray(data.citations)) {
        setCitations(data.citations);
      }
    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred while fetching the response.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <CommonBreadcrumb pageTitle='Perplexity AI Test' parent='AI Support' />
      <Card className='p-6'>
        <div className='space-y-4'>
          <h2 className='text-2xl font-bold'>Perplexity AI Test</h2>
          <p className='text-muted-foreground'>Ask anything and get a response from Perplexity AI</p>

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
              {response && (
                <ScrollArea className='h-[400px] w-full rounded-md border p-4 bg-muted/50'>
                  <div className='whitespace-pre-wrap'>{response}</div>
                </ScrollArea>
              )}

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

export default PerplexityTestPage;
