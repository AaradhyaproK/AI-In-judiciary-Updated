'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase/provider';
import { collection, addDoc, serverTimestamp, updateDoc, doc, getDoc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { CornerDownLeft, CircleDashed, User, Briefcase, FileText, Bot, CalendarIcon, AlertTriangle, Gavel, Scale, TrendingUp, ShieldAlert, CheckCircle, ListChecks, Star } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { predictBailOutcome, BailPredictorOutput } from '@/ai/flows/bail-predictor';
import { analyzeCase, CaseAnalysisOutput } from '@/ai/flows/case-analysis';
import { useLanguage } from '@/hooks/use-language';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


interface Case {
  id: string;
  description: string;
  status: string;
  userId: string;
  lawyerId: string;
  userDisplayName: string;
  lawyerDisplayName: string;
  createdAt: { toDate: () => Date };
  nextHearingDate?: { toDate: () => Date };
  caseNotes?: string;
  userRequestsToEnd?: boolean;
  lawyerRequestsToEnd?: boolean;
  analysisReport?: string;
  userRating?: number;
}

interface UserProfile {
    role: 'user' | 'lawyer';
    displayName: string;
    email: string;
    contactNumber: string;
    location: string;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: { toDate: () => Date } | null;
}

export default function CaseDetailPage() {
  const { caseId } = useParams();
  const firestore = useFirestore();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();
  const currentLanguage = t('languageName');

  const casePath = `cases/${caseId}`;
  const { data: caseData, loading: caseLoading } = useDoc<Case>(casePath);
  const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(user ? `users/${user.uid}` : '');
  
  const { data: clientProfile } = useDoc<UserProfile>(caseData ? `users/${caseData.userId}` : '');
  const { data: lawyerProfile } = useDoc<UserProfile>(caseData ? `users/${caseData.lawyerId}` : '');
  
  const messagesPath = `cases/${caseId}/messages`;
  const { data: messages, loading: messagesLoading } = useCollection<Message>(messagesPath);

  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [caseNotes, setCaseNotes] = useState('');
  const [nextHearingDate, setNextHearingDate] = useState<Date | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  
  const [bailResult, setBailResult] = useState<BailPredictorOutput | null>(null);
  const [isPredictingBail, setIsPredictingBail] = useState(false);
  const [outcomeResult, setOutcomeResult] = useState<CaseAnalysisOutput | null>(null);
  const [isSimulatingOutcome, setIsSimulatingOutcome] = useState(false);
  const [analysisReport, setAnalysisReport] = useState<CaseAnalysisOutput | null>(null);


  const [isEndCaseAlertOpen, setIsEndCaseAlertOpen] = useState(false);
  const [isEndingCase, setIsEndingCase] = useState(false);

  const [rating, setRating] = useState(0);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const sortedMessages = messages.sort((a, b) => a.timestamp && b.timestamp ? a.timestamp.toDate().getTime() - b.timestamp.toDate().getTime() : 0);
  const isLawyer = userProfile?.role === 'lawyer';

  useEffect(() => {
    if (!caseLoading && caseData && user) {
      if (user.uid !== caseData.userId && user.uid !== caseData.lawyerId) {
        router.push('/dashboard');
      }
      setCaseNotes(caseData.caseNotes || '');
      setNextHearingDate(caseData.nextHearingDate?.toDate());
      if (caseData.analysisReport) {
        try {
            setAnalysisReport(JSON.parse(caseData.analysisReport));
        } catch(e) {
            console.error("Failed to parse analysis report", e);
        }
      }
    }
  }, [caseData, caseLoading, user, router]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo(0, scrollAreaRef.current.scrollHeight);
    }
  }, [messages]);


  const handleSendMessage = async () => {
    if (!firestore || !user || !newMessage.trim()) return;

    setIsSending(true);
    const messagesCollection = collection(firestore, `cases/${caseId}/messages`);
    try {
      await addDoc(messagesCollection, {
        caseId,
        senderId: user.uid,
        text: newMessage,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message: ", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!firestore || !caseData) return;
    setIsSaving(true);
    try {
        const caseRef = doc(firestore, 'cases', caseData.id);
        await updateDoc(caseRef, {
            caseNotes,
            nextHearingDate: nextHearingDate || null,
        });
        toast({ title: "Success", description: "Case details have been updated." });
    } catch (error) {
        console.error("Error updating case: ", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to update case details." });
    } finally {
        setIsSaving(false);
    }
  };
  
  const handleSimulateOutcome = async () => {
    if (!caseData) return;
    setIsSimulatingOutcome(true);
    setOutcomeResult(null);
    try {
      const outcome = await analyzeCase({
        caseDetails: caseData.description,
        language: currentLanguage,
      });
      setOutcomeResult(outcome);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to simulate outcome." });
    } finally {
      setIsSimulatingOutcome(false);
    }
  };

  const handlePredictBail = async () => {
    if (!caseData) return;
    setIsPredictingBail(true);
    setBailResult(null);
    try {
      const result = await predictBailOutcome({ caseDetails: caseData.description });
      setBailResult(result);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to predict bail outcome." });
    } finally {
      setIsPredictingBail(false);
    }
  };

  const handleEndCaseRequest = async () => {
    if (!firestore || !caseData || !user || !userProfile) return;
    setIsEndingCase(true);

    const caseRef = doc(firestore, 'cases', caseData.id);

    const myRequestField = isLawyer ? 'lawyerRequestsToEnd' : 'userRequestsToEnd';
    const otherPartyHasRequested = isLawyer ? caseData.userRequestsToEnd : caseData.lawyerRequestsToEnd;

    try {
        if (otherPartyHasRequested) {
            // Both parties have agreed, close the case
            await updateDoc(caseRef, {
                [myRequestField]: true,
                status: 'closed'
            });
            toast({ title: "Case Closed", description: "This case has been successfully closed." });
        } else {
            // This is the first request
            await updateDoc(caseRef, {
                [myRequestField]: true
            });
            toast({ title: "Request Sent", description: "Your request to end the case has been sent." });
        }
    } catch (error) {
        console.error("Error ending case: ", error);
        toast({ variant: "destructive", title: "Error", description: "Could not process the request. Please try again." });
    } finally {
        setIsEndingCase(false);
        setIsEndCaseAlertOpen(false);
    }
  };

  const handleRateLawyer = async () => {
    if (!firestore || !caseData || rating === 0) return;
    setIsSubmittingRating(true);
    try {
        const caseRef = doc(firestore, 'cases', caseData.id);
        await updateDoc(caseRef, { userRating: rating });

        const lawyerRef = doc(firestore, 'users', caseData.lawyerId);
        const lawyerSnap = await getDoc(lawyerRef);

        if (lawyerSnap.exists()) {
            const lawyerData = lawyerSnap.data();
            const currentRating = lawyerData.rating || 0;
            const currentCount = lawyerData.ratingCount || 0;
            
            const newCount = currentCount + 1;
            const newAverage = ((currentRating * currentCount) + rating) / newCount;

            await updateDoc(lawyerRef, {
                rating: parseFloat(newAverage.toFixed(1)),
                ratingCount: newCount
            });
        }
        
        toast({ title: "Thank you!", description: "Your rating has been submitted." });
    } catch (error) {
        console.error("Error submitting rating:", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to submit rating." });
    } finally {
        setIsSubmittingRating(false);
    }
  };

  if (caseLoading || profileLoading) {
    return <Skeleton className="w-full h-96" />;
  }

  if (!caseData) {
    return <div className="text-center">Case not found.</div>;
  }

  const otherPartyName = user?.uid === caseData.userId ? caseData.lawyerDisplayName : caseData.userDisplayName;
  const getUserInitials = (name: string) => name ? name.split(' ').map(n => n[0]).join('') : '';

  const myRequest = isLawyer ? caseData.lawyerRequestsToEnd : caseData.userRequestsToEnd;
  const otherPartyRequest = isLawyer ? caseData.userRequestsToEnd : caseData.lawyerRequestsToEnd;

  let endCaseDescription = "If you wish to end this case, you can send a request. The case will be closed once both parties agree.";
  if (myRequest) {
      endCaseDescription = "You have requested to end this case. Waiting for the other party to confirm.";
  } else if (otherPartyRequest) {
      endCaseDescription = "The other party has requested to end this case. Confirm to close the case.";
  }

  const endCaseButtonText = otherPartyRequest ? 'Confirm Case Closure' : 'Request to End Case';
  const endCaseAlertDescription = otherPartyRequest ? 'By confirming, this case will be permanently closed.' : 'This will send a request to the other party to end the case. The case will be closed once they confirm.';

  const mostLikelyOutcome = analysisReport?.potentialOutcomes?.[0];
  const probabilityData = mostLikelyOutcome
    ? [{ name: 'Favorable', value: mostLikelyOutcome.probability }, { name: 'Unfavorable', value: 1 - mostLikelyOutcome.probability }]
    : [];
  const COLORS = ['hsl(var(--accent))', 'hsl(var(--muted))'];

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        {isLawyer && <TabsTrigger value="ai-toolkit">AI Toolkit</TabsTrigger>}
      </TabsList>
      
      <TabsContent value="overview" className="mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Case Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="font-semibold">Status</h4>
                            <Badge variant={caseData.status === 'active' ? 'default' : caseData.status === 'pending' ? 'secondary' : 'destructive'}>{caseData.status}</Badge>
                        </div>
                        <div>
                            <h4 className="font-semibold">Initial Complaint</h4>
                            <p className="text-muted-foreground text-sm">{caseData.description}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold">Case Started On</h4>
                            <p className="text-muted-foreground text-sm">{caseData.createdAt ? format(caseData.createdAt.toDate(), 'PPP') : 'N/A'}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Case Timeline &amp; Notes</CardTitle>
                        <CardDescription>View updates and notes about the case.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div>
                            <Label htmlFor="next-hearing">Next Hearing Date</Label>
                             <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !nextHearingDate && "text-muted-foreground"
                                    )}
                                    disabled={!isLawyer}
                                    >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {nextHearingDate ? format(nextHearingDate, "PPP") : <span>{isLawyer ? 'Pick a date' : 'Not set'}</span>}
                                    </Button>
                                </PopoverTrigger>
                                {isLawyer && (
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                        mode="single"
                                        selected={nextHearingDate}
                                        onSelect={setNextHearingDate}
                                        initialFocus
                                        />
                                    </PopoverContent>
                                )}
                            </Popover>
                        </div>
                        <div>
                            <Label htmlFor="case-notes">Case Notes</Label>
                            <Textarea id="case-notes" value={caseNotes} onChange={(e) => isLawyer && setCaseNotes(e.target.value)} placeholder={isLawyer ? "Add private notes for this case..." : "No notes have been added yet."} className="min-h-[150px]" readOnly={!isLawyer} />
                        </div>
                        {isLawyer && (
                            <Button onClick={handleSaveChanges} disabled={isSaving}>
                                {isSaving && <CircleDashed className="animate-spin mr-2" />}
                                Save Changes
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {analysisReport && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Initial AI Case Analysis</CardTitle>
                            <CardDescription>This is the AI-generated analysis created when the case was started.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-6 h-6 text-primary" />
                                        <CardTitle className="font-headline">{t('aiJudge.caseSummary')}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{analysisReport.caseSummary}</p>
                                </CardContent>
                            </Card>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card className="shadow-sm">
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <TrendingUp className="w-6 h-6 text-green-500" />
                                            <CardTitle className="font-headline">{t('aiJudge.strengths')}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3">
                                            {analysisReport.strengths.map((item, i) => <li key={i} className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" /> <span className="text-muted-foreground">{item}</span></li>)}
                                        </ul>
                                    </CardContent>
                                </Card>
                                <Card className="shadow-sm">
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <ShieldAlert className="w-6 h-6 text-yellow-500" />
                                            <CardTitle className="font-headline">{t('aiJudge.weaknesses')}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3">
                                            {analysisReport.weaknesses.map((item, i) => <li key={i} className="flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" /> <span className="text-muted-foreground">{item}</span></li>)}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="shadow-sm">
                                <CardHeader>
                                <div className="flex items-center gap-3">
                                    <ListChecks className="w-6 h-6 text-primary" />
                                    <CardTitle className="font-headline">{t('aiJudge.roadmap')}</CardTitle>
                                </div>
                                </CardHeader>
                                <CardContent>
                                    <ol className="space-y-3 list-decimal list-inside">
                                        {analysisReport.recommendedNextSteps.map((item, i) => <li key={i} className="text-muted-foreground">{item}</li>)}
                                    </ol>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {mostLikelyOutcome && (
                                    <Card className="shadow-sm">
                                        <CardHeader>
                                            <div className="flex items-center gap-3">
                                                <Gavel className="w-6 h-6 text-primary" />
                                                <CardTitle className="font-headline">{t('aiJudge.potentialOutcome')}</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                            <div className="md:col-span-1 h-32 relative">
                                                <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={probabilityData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} fill="#8884d8" paddingAngle={5} dataKey="value">
                                                    {probabilityData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                    </Pie>
                                                </PieChart>
                                                </ResponsiveContainer>
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <span className="text-2xl font-bold font-headline text-primary">
                                                    {(mostLikelyOutcome.probability * 100).toFixed(0)}%
                                                </span>
                                                </div>
                                            </div>
                                            <div className="md:col-span-2">
                                                <p className="text-sm text-muted-foreground">{mostLikelyOutcome.outcome}</p>
                                            </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                                <Card className="shadow-sm">
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-6 h-6 text-primary" />
                                            <CardTitle className="font-headline">{t('aiJudge.similarCases')}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Accordion type="single" collapsible className="w-full">
                                            {analysisReport.similarCasePrecedents.map((precedent, index) => (
                                            <AccordionItem value={`item-${index}`} key={index}>
                                                <AccordionTrigger className="font-semibold text-sm">{precedent.caseName}</AccordionTrigger>
                                                <AccordionContent className="space-y-2">
                                                <p className="text-sm text-muted-foreground">{precedent.summary}</p>
                                                <p className="text-xs font-mono bg-muted p-2 rounded-md">{precedent.citation}</p>
                                                </AccordionContent>
                                            </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </CardContent>
                                </Card>
                            </div>

                            <Alert variant="default" className="bg-yellow-50 border-yellow-200">
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                <AlertTitle className="font-headline text-yellow-700">{t('aiJudge.disclaimerTitle')}</AlertTitle>
                                <AlertDescription className="text-yellow-600">
                                    {analysisReport.disclaimer}
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                )}


                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Case Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {caseData.status !== 'closed' ? (
                            <div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {endCaseDescription}
                                </p>
                                <AlertDialog open={isEndCaseAlertOpen} onOpenChange={setIsEndCaseAlertOpen}>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            disabled={myRequest}
                                        >
                                            {endCaseButtonText}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                {endCaseAlertDescription}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel disabled={isEndingCase}>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleEndCaseRequest} disabled={isEndingCase}>
                                                {isEndingCase && <CircleDashed className="animate-spin mr-2" />}
                                                Continue
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-sm font-semibold text-destructive">This case has been closed.</p>
                                {!isLawyer && (
                                    <div className="pt-4 border-t">
                                        <h4 className="font-semibold mb-2">Rate your Lawyer</h4>
                                        {caseData.userRating ? (
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={cn("w-5 h-5", i < (caseData.userRating || 0) ? "fill-current" : "text-muted-foreground")} />
                                                ))}
                                                <span className="text-muted-foreground text-sm ml-2">You rated this case.</span>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <p className="text-sm text-muted-foreground">How was your experience working with {caseData.lawyerDisplayName}?</p>
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                                                            <Star className={cn("w-6 h-6 transition-colors", star <= rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground")} />
                                                        </button>
                                                    ))}
                                                </div>
                                                <Button size="sm" onClick={handleRateLawyer} disabled={rating === 0 || isSubmittingRating}>
                                                    {isSubmittingRating && <CircleDashed className="w-4 h-4 mr-2 animate-spin" />}
                                                    Submit Rating
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Client</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                        <p className="font-semibold">{clientProfile?.displayName}</p>
                        <p className="text-muted-foreground">{clientProfile?.email}</p>
                        <p className="text-muted-foreground">{clientProfile?.contactNumber}</p>
                        <p className="text-muted-foreground">{clientProfile?.location}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary" /> Lawyer</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                        <p className="font-semibold">{lawyerProfile?.displayName}</p>
                        <p className="text-muted-foreground">{lawyerProfile?.email}</p>
                        <p className="text-muted-foreground">{lawyerProfile?.contactNumber}</p>
                        <p className="text-muted-foreground">{lawyerProfile?.location}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
      </TabsContent>
      
      <TabsContent value="chat" className="mt-4">
         <Card className="h-[calc(100vh-14rem)] flex flex-col shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline">Chat with {otherPartyName}</CardTitle>
          </CardHeader>
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
             <div className="space-y-6">
              {messagesLoading && <CircleDashed className="mx-auto w-8 h-8 animate-spin text-primary" />}
              {sortedMessages.map((message) => {
                const isUser = message.senderId === user?.uid;
                const senderName = isUser ? user?.displayName : otherPartyName;
                return (
                  <div key={message.id} className={cn('flex items-start gap-3', isUser ? 'justify-end' : 'justify-start')}>
                     {!isUser && <Avatar className="w-8 h-8 border"><AvatarFallback>{getUserInitials(senderName || 'L')}</AvatarFallback></Avatar>}
                     <div className={cn('max-w-md rounded-lg px-4 py-3 text-sm', isUser ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                       <p>{message.text}</p>
                       <p className={cn("text-xs mt-2", isUser ? 'text-primary-foreground/70' : 'text-muted-foreground/70')}>
                         {message.timestamp ? format(message.timestamp.toDate(), 'p') : ''}
                       </p>
                     </div>
                     {isUser && <Avatar className="w-8 h-8 border"><AvatarFallback>{getUserInitials(senderName || 'U')}</AvatarFallback></Avatar>}
                  </div>
                );
              })}
             </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <div className="relative">
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="pr-16 min-h-[48px] resize-none"
                rows={1}
                disabled={isSending}
              />
              <Button type="submit" size="icon" className="absolute top-1/2 right-3 -translate-y-1/2" onClick={handleSendMessage} disabled={isSending || !newMessage.trim()}>
                {isSending ? <CircleDashed className="w-4 h-4 animate-spin" /> : <CornerDownLeft className="w-4 h-4" />}
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
        </Card>
      </TabsContent>
      
      <TabsContent value="documents" className="mt-4">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> Case Documents</CardTitle>
                <CardDescription>Manage and view all documents related to this case.</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12 text-muted-foreground">
                <p>Document management feature is coming soon.</p>
                <Button variant="secondary" className="mt-4" disabled>Upload Document</Button>
            </CardContent>
        </Card>
      </TabsContent>

      {isLawyer && (
        <TabsContent value="ai-toolkit" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><Gavel className="w-5 h-5 text-primary" /> Case Outcome Simulation</CardTitle>
                        <CardDescription>Get an AI-driven prediction on the potential court outcome.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleSimulateOutcome} disabled={isSimulatingOutcome}>
                            {isSimulatingOutcome && <CircleDashed className="animate-spin mr-2" />}
                            Simulate Outcome
                        </Button>
                        {isSimulatingOutcome && <Skeleton className="w-full h-24 mt-4" />}
                        {outcomeResult && outcomeResult.potentialOutcomes && outcomeResult.potentialOutcomes.length > 0 && (
                             <div className="mt-4 space-y-4">
                                <Card>
                                    <CardContent className="pt-6">
                                        <h3 className="font-semibold text-center text-lg text-primary">{(outcomeResult.potentialOutcomes[0].probability * 100).toFixed(0)}% Likelihood</h3>
                                        <p className="text-sm text-muted-foreground mt-2">{outcomeResult.potentialOutcomes[0].outcome}</p>
                                    </CardContent>
                                </Card>
                                <Alert variant="default" className="bg-yellow-50 border-yellow-200">
                                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                    <AlertTitle className="font-headline text-yellow-700">Disclaimer</AlertTitle>
                                    <AlertDescription className="text-yellow-600">
                                        {outcomeResult.disclaimer}
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><Scale className="w-5 h-5 text-primary" /> Bail Predictor</CardTitle>
                        <CardDescription>Analyze the likelihood of bail being granted for this case.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Button onClick={handlePredictBail} disabled={isPredictingBail}>
                            {isPredictingBail && <CircleDashed className="animate-spin mr-2" />}
                            Predict Bail Likelihood
                        </Button>
                        {isPredictingBail && <Skeleton className="w-full h-24 mt-4" />}
                        {bailResult && (
                             <div className="mt-4 space-y-4">
                                <Card>
                                     <CardContent className="pt-6">
                                        <h3 className="font-semibold text-center text-lg text-primary">{bailResult.prediction} ({(bailResult.probability * 100).toFixed(0)}%)</h3>
                                        <p className="text-sm text-muted-foreground mt-2">{bailResult.reasoning}</p>
                                    </CardContent>
                                </Card>
                                <Alert variant="default" className="bg-yellow-50 border-yellow-200">
                                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                    <AlertTitle className="font-headline text-yellow-700">Disclaimer</AlertTitle>
                                    <AlertDescription className="text-yellow-600">
                                        {bailResult.disclaimer}
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
      )}
    </Tabs>
  );
}
