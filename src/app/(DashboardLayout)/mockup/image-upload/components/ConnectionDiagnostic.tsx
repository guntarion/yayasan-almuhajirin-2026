// src/app/(DashboardLayout)/mockup/spaces-digital-ocean/components/ConnectionDiagnostic.tsx
'use client';

import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Terminal, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DO_SPACES_INFO } from '../data';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

/**
 * Component to diagnose connection issues with Digital Ocean Spaces
 */
const ConnectionDiagnostic: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<{
    checking: boolean;
    success: boolean;
    message: string;
    details?: string;
  }>({
    checking: false,
    success: false,
    message: 'Connection check not yet run',
  });

  // Run connection diagnostics
  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults({
      checking: true,
      success: false,
      message: 'Checking connection to Digital Ocean Spaces...',
    });

    try {
      // Make a simple HEAD request to check connectivity
      const response = await fetch('/api/spaces-digital-ocean/check-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bucket: DO_SPACES_INFO.BUCKET_NAME,
          region: DO_SPACES_INFO.REGION,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResults({
          checking: false,
          success: true,
          message: 'Connection to Digital Ocean Spaces is working properly',
          details: JSON.stringify(data.details, null, 2),
        });
      } else {
        setResults({
          checking: false,
          success: false,
          message: data.error || 'Connection check failed',
          details: JSON.stringify(data.details, null, 2),
        });
      }
    } catch (error) {
      console.error('Diagnostic error:', error);
      setResults({
        checking: false,
        success: false,
        message: 'Failed to check connection',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Check configuration by displaying environment settings (masked)
  return (
    <Card className="w-full bg-gray-50 dark:bg-gray-900/50 border-amber-200 dark:border-amber-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <Terminal className="h-5 w-5" />
          Digital Ocean Spaces Connection Diagnostic
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-amber-400"></div>
            <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
              Upload operations are timing out. This tool can help diagnose connection issues.
            </p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium mb-1">Configuration:</p>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li><span className="font-mono">Bucket:</span> {DO_SPACES_INFO.BUCKET_NAME}</li>
                  <li><span className="font-mono">Region:</span> {DO_SPACES_INFO.REGION}</li>
                  <li><span className="font-mono">Base URL:</span> {DO_SPACES_INFO.CDN_BASE_URL}</li>
                  <li><span className="font-mono">Storage Path:</span> {DO_SPACES_INFO.FOLDER_PATH}</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">Environment Check:</p>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  <li>
                    <span className="font-mono">DO_SPACE_ENDPOINT:</span> {' '}
                    <span className="font-mono">
                      {process.env.NEXT_PUBLIC_DO_SPACE_ENDPOINT ? 'Configured ✓' : 'Missing ✗'}
                    </span>
                  </li>
                  <li>
                    <span className="font-mono">DO_SPACE_ACCESS_KEY:</span> {' '}
                    <span className="font-mono">
                      {process.env.NEXT_PUBLIC_DO_SPACE_ACCESS_KEY ? 'Configured ✓' : 'Missing ✗'}
                    </span>
                  </li>
                  <li>
                    <span className="font-mono">DO_SPACE_SECRET_KEY:</span> {' '}
                    <span className="font-mono">
                      {process.env.NEXT_PUBLIC_DO_SPACE_SECRET_KEY ? 'Configured ✓' : 'Missing ✗'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Diagnostic results */}
          <div 
            className={`rounded-md p-4 ${
              results.checking 
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200' 
                : results.success 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                  : 'bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {results.checking ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : results.success ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <p className="font-medium">{results.message}</p>
            </div>

            {results.details && (
              <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-2">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full text-xs flex justify-between items-center">
                    <span>Show Details</span>
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <pre className="mt-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-xs font-mono overflow-x-auto">
                    {results.details}
                  </pre>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="font-medium mb-1">Troubleshooting Tips:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Check if your Digital Ocean Spaces credentials are correct</li>
              <li>Verify the bucket name and region are configured properly</li>
              <li>Ensure your server has outbound network access to Digital Ocean Spaces</li>
              <li>Make sure CORS configuration in your Space allows uploads from your domain</li>
              <li>Check if your bucket permissions allow the specified operations</li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={runDiagnostics} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            <>
              <Terminal className="mr-2 h-4 w-4" />
              Run Connection Diagnostics
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConnectionDiagnostic;
