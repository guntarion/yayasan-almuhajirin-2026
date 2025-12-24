// File: /src/app/(DashboardLayout)/mockup/send-email/page.tsx
// This page provides a UI for testing email sending functionality

'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import CommonBreadcrumb from '@/components/shared/CommonBreadcrumb';

// Services & Types
import { sendEmail } from '@/services/emailService';
import { EmailResponse } from '@/types/email';

// Form validation schema
const emailFormSchema = z.object({
  to: z.string().email({ message: 'Please enter a valid email address' }),
  subject: z.string().min(1, { message: 'Subject is required' }),
  messageType: z.enum(['text', 'html']),
  textContent: z.string().optional(),
  htmlContent: z.string().optional(),
}).refine(data => {
  if (data.messageType === 'text') {
    return !!data.textContent;
  } else {
    return !!data.htmlContent;
  }
}, {
  message: 'Email content is required',
  path: ['textContent'],
});

// Form values type
type EmailFormValues = z.infer<typeof emailFormSchema>;

const SendEmailPage = () => {
  // Form initialization with validation
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      to: '',
      subject: '',
      messageType: 'text',
      textContent: '',
      htmlContent: '<p>Hello,</p><p>This is a test email sent from the Uniform Management System.</p><p>Regards,<br>The System</p>',
    },
  });

  // State for loading and response
  const [isLoading, setIsLoading] = useState(false);
  const [emailResponse, setEmailResponse] = useState<EmailResponse | null>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // Form submission handler
  const onSubmit = async (data: EmailFormValues) => {
    setIsLoading(true);
    setEmailResponse(null);
    
    try {
      // Determine which content to send based on message type
      const emailData = {
        to: data.to,
        subject: data.subject,
        ...(data.messageType === 'text' 
          ? { text: data.textContent } 
          : { html: data.htmlContent }),
      };
      
      // Send the email
      const response = await sendEmail(emailData);
      setEmailResponse(response);
      
      // Show toast notification based on response
      if (response.success) {
        toast.success('Email sent successfully!');
      } else {
        toast.error(`Failed to send email: ${response.message}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('An unexpected error occurred');
      
      setEmailResponse({
        success: false,
        message: 'An unexpected error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to get current content based on message type
  const getMessagePreview = () => {
    const values = form.getValues();
    if (values.messageType === 'text') {
      return values.textContent || '(No content)';
    } else {
      return values.htmlContent || '(No content)';
    }
  };

  return (
    <>
      <CommonBreadcrumb pageTitle='Test Email Functionality' parent='Mockup' />
      
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-8">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Send Test Email</CardTitle>
                <CardDescription>
                  Test the email sending functionality using the configured SMTP settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form id="email-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="to"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient Email</FormLabel>
                          <FormControl>
                            <Input placeholder="recipient@example.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            The email address that will receive the test email
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Test Email Subject" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="messageType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message Format</FormLabel>
                          <FormControl>
                            <Tabs 
                              value={field.value} 
                              onValueChange={(value) => {
                                field.onChange(value as 'text' | 'html');
                              }}
                              className="w-full"
                            >
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="text">Plain Text</TabsTrigger>
                                <TabsTrigger value="html">HTML</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="text">
                                <FormField
                                  control={form.control}
                                  name="textContent"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Email Content</FormLabel>
                                      <FormControl>
                                        <Textarea
                                          placeholder="Enter the email content here..."
                                          className="min-h-[200px]"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </TabsContent>
                              
                              <TabsContent value="html">
                                <FormField
                                  control={form.control}
                                  name="htmlContent"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>HTML Content</FormLabel>
                                      <FormControl>
                                        <Textarea
                                          placeholder="<p>Enter HTML content here...</p>"
                                          className="min-h-[200px] font-mono text-sm"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormDescription>
                                        Use HTML tags to format your email
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </TabsContent>
                            </Tabs>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="debug-mode"
                    checked={showDebugInfo}
                    onCheckedChange={setShowDebugInfo}
                  />
                  <label
                    htmlFor="debug-mode"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Show Debug Info
                  </label>
                </div>
                
                <Button 
                  type="submit" 
                  form="email-form" 
                  disabled={isLoading}
                  className="w-28"
                >
                  {isLoading ? 'Sending...' : 'Send Email'}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Sidebar with Info & Response */}
          <div className="lg:col-span-4 space-y-6">
            {/* SMTP Configuration Info */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>SMTP Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Host:</p>
                  <p className="text-sm text-muted-foreground">smtp.gmail.com</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Port:</p>
                  <p className="text-sm text-muted-foreground">587</p>
                </div>
                <div>
                  <p className="text-sm font-medium">From:</p>
                  <p className="text-sm text-muted-foreground">Akhmad Guntar &lt;halo@titianbakat.com&gt;</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Preview */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Email Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-3 text-sm bg-muted/50 max-h-40 overflow-y-auto whitespace-pre-wrap">
                  {getMessagePreview()}
                </div>
              </CardContent>
            </Card>
            
            {/* Response */}
            {emailResponse && (
              <Card className={`shadow-md ${emailResponse.success ? 'border-green-500' : 'border-red-500'}`}>
                <CardHeader>
                  <CardTitle className={emailResponse.success ? 'text-green-600' : 'text-red-600'}>
                    {emailResponse.success ? 'Success' : 'Error'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert variant={emailResponse.success ? 'default' : 'destructive'}>
                    <AlertTitle>{emailResponse.success ? 'Email sent successfully' : 'Failed to send email'}</AlertTitle>
                    <AlertDescription>
                      {emailResponse.message}
                      {emailResponse.messageId && (
                        <div className="mt-2">
                          <span className="font-medium">Message ID:</span> {emailResponse.messageId}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                  
                  {showDebugInfo && emailResponse.error && (
                    <div className="mt-4">
                      <Separator className="my-2" />
                      <p className="font-medium text-sm mt-2">Error Details:</p>
                      <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs mt-1 overflow-x-auto">
                        {emailResponse.error}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SendEmailPage;
