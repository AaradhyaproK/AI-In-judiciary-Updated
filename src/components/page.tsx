'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Megaphone, AlertTriangle, CheckCircle, FileText, Scale, TrendingUp, Briefcase } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { analyzePil, PilAnalysisOutput } from '@/ai/flows/pil-analysis';

export default function NewPilPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const currentLanguage = t('languageName');

  const [topic, setTopic] = useState('');
  const [courtLevel, setCourtLevel] = useState('');
  const [petitionerType, setPetitionerType] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PilAnalysisOutput | null>(null);

  const handleAnalyze = async () => {
    if (!topic.trim()) {
      toast({ variant: "destructive", title: "Required", description: "Please describe the PIL topic." });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const output = await analyzePil({
        topic,
        courtLevel: courtLevel || undefined,
        petitionerType: petitionerType || undefined,
        language: currentLanguage,
      });
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Failed to analyze PIL. Please try again." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const probabilityData = result
    ? [{ name: 'Acceptance', value: result.acceptanceRate }, { name: 'Rejection', value: 1 - result.acceptanceRate }]
    : [];
  const COLORS = ['#4CAF50', '#ECEFF1']; // Green for acceptance, Gray for rest

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-headline font-bold">{t('pilAnalysis.title')}</h1>
        <p className="text-muted-foreground">{t('pilAnalysis.description')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="font-headline">{t('pilAnalysis.topicLabel')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t('pilAnalysis.topicLabel')}</Label>
              <Textarea 
                placeholder={t('pilAnalysis.topicPlaceholder')} 
                className="min-h-[150px]"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('pilAnalysis.courtLabel')}</Label>
              <Select value={courtLevel} onValueChange={setCourtLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Court" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Supreme Court">Supreme Court</SelectItem>
                  <SelectItem value="High Court">High Court</SelectItem>
                  <SelectItem value="District Court">District Court</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('pilAnalysis.petitionerLabel')}</Label>
              <Select value={petitionerType} onValueChange={setPetitionerType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Individual">Individual (Citizen)</SelectItem>
                  <SelectItem value="NGO">NGO / Organization</SelectItem>
                  <SelectItem value="Group">Group of Citizens</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <TrendingUp className="mr-2 h-4 w-4 animate-spin" />
                  {t('pilAnalysis.analyzing')}
                </>
              ) : (
                <>
                  <Megaphone className="mr-2 h-4 w-4" />
                  {t('pilAnalysis.analyzeButton')}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          {isAnalyzing && <Skeleton className="w-full h-96" />}
          
          {!isAnalyzing && !result && (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-lg">
              <Megaphone className="h-12 w-12 mb-4 opacity-20" />
              <p>Enter details to generate an analysis.</p>
            </div>
          )}

          {result && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2">
                    <Scale className="h-5 w-5 text-primary" />
                    {t('pilAnalysis.resultsTitle')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="md:col-span-1 h-40 relative flex flex-col items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={probabilityData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            startAngle={180}
                            endAngle={0}
                            paddingAngle={0}
                            dataKey="value"
                          >
                            {probabilityData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <span className="text-3xl font-bold font-headline text-primary">
                          {(result.acceptanceRate * 100).toFixed(0)}%
                        </span>
                        <p className="text-xs text-muted-foreground">{t('pilAnalysis.acceptanceRate')}</p>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm leading-relaxed">{result.analysis}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline text-base flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      {t('pilAnalysis.tips')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.improvementTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline text-base flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      {t('pilAnalysis.documents')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {result.requiredDocuments.map((doc, i) => (
                        <li key={i}>{doc}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="font-headline text-base flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    {t('pilAnalysis.lawyers')}
                  </CardTitle>
                  <CardDescription>
                    Based on your topic, we recommend consulting lawyers with these specializations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {result.recommendedLawyerSpecializations.map((spec, i) => (
                      <span key={i} className="px-3 py-1 bg-background border rounded-full text-sm font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>
                  <Button onClick={() => router.push('/lawyers')} variant="default">
                    {t('pilAnalysis.findLawyersButton')}
                  </Button>
                </CardContent>
              </Card>

              <Alert variant="default" className="bg-yellow-50 border-yellow-200">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <AlertTitle className="font-headline text-yellow-700">Disclaimer</AlertTitle>
                <AlertDescription className="text-yellow-600 text-sm">
                  {result.disclaimer}
                </AlertDescription>
              </Alert>
            </>
          )}
        </div>
      </div>
    </div>
  );
}