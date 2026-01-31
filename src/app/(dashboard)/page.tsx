'use client';

// Dashboard root page
import { useUser } from '@/firebase/auth/use-user';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { 
  Scale, 
  Gavel, 
  FileText, 
  Users, 
  Shield, 
  Activity, 
  Search, 
  MessageSquare, 
  Briefcase,
  LayoutDashboard,
  PlusCircle,
  BrainCircuit
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface UserProfile {
  role?: 'user' | 'lawyer' | 'judge' | 'admin';
  displayName?: string;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useUser();
  const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(
    user?.uid ? `users/${user.uid}` : ''
  );
  const { t } = useLanguage();
  const router = useRouter();

  if (authLoading || profileLoading) {
    return (
      <div className="space-y-4 p-8">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  const role = userProfile?.role || 'user';
  const name = userProfile?.displayName || user?.displayName || 'User';

  // --- JUDGE DASHBOARD ---
  if (role === 'judge') {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('sidebar.judgeDashboard')}</h1>
          <p className="text-muted-foreground">Manage your court docket and assigned cases.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* File New Case */}
          <Link href="/judge/file-case">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <PlusCircle className="w-8 h-8 text-primary mb-2" />
                <CardTitle>{t('sidebar.fileCase')}</CardTitle>
                <CardDescription>Initiate a new case file and assign initial details.</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Case Docket */}
          <Link href="/judge">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <LayoutDashboard className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Case Docket</CardTitle>
                <CardDescription>View and manage all cases assigned to your bench.</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* AI Assistant */}
          <Link href="/ai-judge">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <BrainCircuit className="w-8 h-8 text-primary mb-2" />
                <CardTitle>AI Assistant</CardTitle>
                <CardDescription>Use AI to analyze case facts and find precedents.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    );
  }

  // --- LAWYER DASHBOARD ---
  if (role === 'lawyer') {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.lawyerWelcome', { name })}</h1>
          <p className="text-muted-foreground">{t('dashboard.lawyerSubheading')}</p>
          <p className="text-sm text-muted-foreground mt-2">{t('dashboard.lawyerDescription')}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/my-cases">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <Briefcase className="w-8 h-8 text-primary mb-2" />
                <CardTitle>{t('dashboard.viewCasesTitle')}</CardTitle>
                <CardDescription>{t('dashboard.viewCasesDescription')}</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/legal-research">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <Search className="w-8 h-8 text-primary mb-2" />
                <CardTitle>{t('dashboard.legalResearchTitle')}</CardTitle>
                <CardDescription>{t('dashboard.legalResearchDescription')}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    );
  }

  // --- ADMIN DASHBOARD ---
  if (role === 'admin') {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('admin.title')}</h1>
          <p className="text-muted-foreground">{t('admin.subtitle')}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.stats.users')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.stats.lawyers')}</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">56</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // --- USER DASHBOARD (Default) ---
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.welcome', { name })}</h1>
        <p className="text-muted-foreground">{t('dashboard.subheading')}</p>
        <p className="text-sm text-muted-foreground mt-2">{t('dashboard.description')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* AI Case Analysis */}
        <Link href="/ai-judge">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <Scale className="w-8 h-8 text-primary mb-2" />
              <CardTitle>{t('dashboard.aiAnalysisTitle')}</CardTitle>
              <CardDescription>{t('dashboard.aiAnalysisDescription')}</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* Find a Lawyer */}
        <Link href="/find-lawyer">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <Users className="w-8 h-8 text-primary mb-2" />
              <CardTitle>{t('dashboard.findLawyerTitle')}</CardTitle>
              <CardDescription>{t('dashboard.findLawyerDescription')}</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* Manage My Cases */}
        <Link href="/my-cases">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <FileText className="w-8 h-8 text-primary mb-2" />
              <CardTitle>{t('dashboard.manageCasesTitle')}</CardTitle>
              <CardDescription>{t('dashboard.manageCasesDescription')}</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* Court Statistics */}
        <Link href="/statistics">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <Activity className="w-8 h-8 text-primary mb-2" />
              <CardTitle>{t('sidebar.statistics')}</CardTitle>
              <CardDescription>{t('statisticsPage.description')}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}