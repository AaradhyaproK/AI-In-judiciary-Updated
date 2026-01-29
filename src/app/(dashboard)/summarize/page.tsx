'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { BookText, CircleDashed, FileText, Scale } from 'lucide-react';
import * as pdfjs from 'pdfjs-dist';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast"
import { summarizeDocument, DocumentSummarizationOutput } from '@/ai/flows/document-summarization';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

const formSchema = z.object({
  documentType: z
    .string()
    .min(2, { message: 'Document type must be at least 2 characters.' }),
  documentContent: z
    .string()
    .min(50, { message: 'Document content must be at least 50 characters.' }),
});

export default function DocumentSummarizationPage() {
  const [result, setResult] = useState<DocumentSummarizationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentType: '',
      documentContent: '',
    },
  });

  const { setValue } = form;

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a PDF file.',
      });
      return;
    }

    setIsParsing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const typedArray = new Uint8Array(arrayBuffer);
      const pdf = await pdfjs.getDocument({ data: typedArray }).promise;
      
      const pageTexts = await Promise.all(
        Array.from({ length: pdf.numPages }, (_, i) => i + 1).map(async (pageNumber) => {
          const page = await pdf.getPage(pageNumber);
          const textContent = await page.getTextContent();
          return textContent.items.map((item: any) => item.str).join(' ');
        })
      );
      
      const fullText = pageTexts.join('\n\n');
      setValue('documentContent', fullText, { shouldValidate: true });
      toast({
        title: "PDF Processed",
        description: "The document content has been extracted from the PDF.",
      });
    } catch (error) {
      console.error('Error parsing PDF:', error);
      toast({
        variant: 'destructive',
        title: 'Error Parsing PDF',
        description: 'Could not read the content of the PDF file. Please try again or paste the content manually.',
      });
    } finally {
      setIsParsing(false);
      // Reset the file input so user can upload the same file again
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const summary = await summarizeDocument(values);
      setResult(summary);
    } catch (error) {
      console.error('Error summarizing document:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to summarize the document. Please try again.",
      })
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 md:px-0">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Document Summarization</CardTitle>
          <CardDescription>
            Enter a legal document to get a concise summary and relevant legal principles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="documentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Contract, Court Pleading" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Upload PDF Document</FormLabel>
                <FormControl>
                  <Input 
                    type="file" 
                    accept="application/pdf" 
                    onChange={handleFileChange}
                    disabled={isParsing || isLoading}
                  />
                </FormControl>
                 {isParsing && <p className="text-sm text-muted-foreground flex items-center gap-2 pt-2"><CircleDashed className="animate-spin h-4 w-4" /> Parsing PDF, this may take a moment...</p>}
                <FormMessage />
              </FormItem>

              <FormField
                control={form.control}
                name="documentContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the full text of the legal document here, or upload a PDF above."
                        className="min-h-[300px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading || isParsing}>
                {(isLoading || isParsing) && <CircleDashed className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Summarizing...' : isParsing ? 'Parsing...' : 'Summarize Document'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="space-y-8">
        {(isLoading || result) && (
          <Card className="shadow-sm animate-fade-in">
            <CardHeader>
              <div className='flex items-center gap-3'>
                <FileText className="w-6 h-6 text-primary" />
                <CardTitle className="font-headline">Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                 <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                  </div>
              ) : (
                <p className="text-sm text-muted-foreground">{result?.summary}</p>
              )}
            </CardContent>
          </Card>
        )}

        {(isLoading || result) && (
          <Card className="shadow-sm animate-fade-in" style={{animationDelay: '150ms'}}>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <Scale className="w-6 h-6 text-primary" />
                <CardTitle className="font-headline">Relevant Legal Principles</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                 <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
                  </div>
              ) : (
                <p className="text-sm text-muted-foreground">{result?.relevantLegalPrinciples}</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
