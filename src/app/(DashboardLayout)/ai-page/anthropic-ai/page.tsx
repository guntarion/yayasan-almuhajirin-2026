// src/app/(DashboardLayout)/testing-page/anthropic/page.tsx
// Anthropic AI support page that provides AI-powered interactions using Claude

'use client';

import { useState, useRef, useEffect } from 'react';
import CommonBreadcrumb from '@/components/shared/CommonBreadcrumb';
import CommonCardHeader from '@/components/shared/CommonCardHeader';

const AnthropicPage = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResponse('');

    try {
      const apiResponse = await fetch('/api/aiApi/anthropicAi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!apiResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = apiResponse.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = '';

      while (reader) {
        const { value, done } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n');

        lines.forEach((line) => {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              accumulatedResponse += data.content;
              setResponse(accumulatedResponse);
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
    <>
      <CommonBreadcrumb pageTitle='Anthropic AI Support Page' parent='AI Support' />
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 gap-6'>
          <div className='col-span-1'>
            <div className='rounded-lg bg-white dark:bg-gray-800 shadow-md'>
              <CommonCardHeader
                heading='Claude AI Support'
                subHeading={[{ text: 'Powered by Anthropic Claude AI' }, { text: 'Get comprehensive AI-powered responses' }]}
              />
              <div className='p-6'>
                <div className='mb-4'>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder='Enter your question or prompt here...'
                    rows={4}
                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                             placeholder-gray-500 dark:placeholder-gray-400'
                  />
                  <small className='block mt-1 text-gray-500 dark:text-gray-400'>Ask any question or provide a prompt for Claude to respond to</small>
                </div>

                <div className='mb-4'>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !prompt.trim()}
                    className={`px-4 py-2 rounded-md text-white font-medium
                              ${
                                isLoading || !prompt.trim() ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                              } transition-colors duration-200`}
                  >
                    {isLoading ? (
                      <div className='flex items-center'>
                        <svg
                          className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                        >
                          <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          ></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      'Get Response'
                    )}
                  </button>
                </div>

                {response && (
                  <div
                    ref={responseRef}
                    className='p-4 border border-gray-200 dark:border-gray-700 rounded-md 
                             bg-gray-50 dark:bg-gray-900 
                             max-h-[400px] overflow-y-auto
                             whitespace-pre-wrap
                             text-gray-800 dark:text-gray-200 prose dark:prose-invert'
                  >
                    {response}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnthropicPage;
