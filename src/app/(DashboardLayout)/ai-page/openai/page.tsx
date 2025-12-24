// src/app/(DashboardLayout)/testing-page/openai/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import CommonBreadcrumb from '@/components/shared/CommonBreadcrumb';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const OpenAItestPage = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResponse('');

    try {
      const response = await fetch('/api/aiApi/openAIApi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userPrompt: prompt,
          model: 'gpt-4-0125-preview',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Network response was not ok');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { value, done } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n');

        lines.forEach((line) => {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              setResponse((prev) => prev + (data.content || ''));
            } catch (e) {
              console.error('Error parsing JSON:', e);
            }
          }
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setResponse(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response]);

  return (
    <div className='container mx-auto p-4'>
      <CommonBreadcrumb pageTitle='AI Support Page' parent='Sample Page' />
      <Card className='p-6'>
        <div className='space-y-4'>
          <h2 className='text-2xl font-bold'>OpenAI Support</h2>
          <p className='text-muted-foreground'>Enter a term or concept to get an AI explanation</p>

          <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder='Enter your query here...' className='min-h-[100px]' />

          <Button onClick={handleSubmit} disabled={isLoading || !prompt.trim()} className='w-full sm:w-auto'>
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Processing...
              </>
            ) : (
              'Get Explanation'
            )}
          </Button>

          {response && (
            <ScrollArea className='h-[400px] w-full rounded-md border p-4 bg-muted/50'>
              <div ref={responseRef} className='whitespace-pre-wrap'>
                {response}
              </div>
            </ScrollArea>
          )}
        </div>
      </Card>
    </div>
  );
};

export default OpenAItestPage;
