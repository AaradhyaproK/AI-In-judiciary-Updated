'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/firebase/auth/use-user";
import { useDoc } from "@/firebase/firestore/use-doc";
import { Gavel, Users, Briefcase, ScrollText } from "lucide-react";
import Link from "next/link";
import { useLanguage } from '@/hooks/use-language';
import { Skeleton } from "@/components/ui/skeleton";

interface UserProfile {
  role: 'user' | 'lawyer';
  displayName: string;
}

const UserDashboard = () => {
    const { t } = useLanguage();
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/ai-judge">
            <Card className="shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
                <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                    <Gavel className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="font-headline">{t('dashboard.aiAnalysisTitle')}</CardTitle>
                </div>
                </CardHeader>
                <CardContent>
                <p className="text-muted-foreground">{t('dashboard.aiAnalysisDescription')}</p>
                </CardContent>
            </Card>
            </Link>
            <Link href="/lawyers">
            <Card className="shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
                <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                    <Users className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="font-headline">{t('dashboard.findLawyerTitle')}</CardTitle>
                </div>
                </CardHeader>
                <CardContent>
                <p className="text-muted-foreground">{t('dashboard.findLawyerDescription')}</p>
                </CardContent>
            </Card>
            </Link>
            <Link href="/my-cases">
            <Card className="shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
                <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                    <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="font-headline">{t('dashboard.manageCasesTitle')}</CardTitle>
                </div>
                </CardHeader>
                <CardContent>
                <p className="text-muted-foreground">{t('dashboard.manageCasesDescription')}</p>
                </CardContent>
            </Card>
            </Link>
      </div>
    )
}

const LawyerDashboard = () => {
    const { t } = useLanguage();
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Link href="/my-cases">
          <Card className="shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-headline">{t('dashboard.viewCasesTitle')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('dashboard.viewCasesDescription')}</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/legal-research">
          <Card className="shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <ScrollText className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-headline">{t('dashboard.legalResearchTitle')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('dashboard.legalResearchDescription')}</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    )
}

export default function Dashboard() {
  const { user } = useUser();
  const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(user ? `users/${user.uid}` : '');
  const { t } = useLanguage();

  const isLawyer = userProfile?.role === 'lawyer';

  if (profileLoading || !userProfile) {
      return (
          <div className="space-y-8">
              <Card className="shadow-sm border-0 bg-transparent">
                  <CardHeader>
                      <Skeleton className="h-10 w-1/2" />
                      <Skeleton className="h-6 w-3/4 mt-2" />
                  </CardHeader>
                  <CardContent>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6 mt-2" />
                  </CardContent>
              </Card>
               <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                   <Skeleton className="h-48" />
                   <Skeleton className="h-48" />
                   <Skeleton className="h-48" />
               </div>
          </div>
      )
  }

  return (
    <div className="space-y-8">
       <Card className="shadow-sm border-0 bg-transparent">
        <CardHeader>
          <CardTitle className="font-headline text-4xl">
            {isLawyer 
              ? t('dashboard.lawyerWelcome', { name: userProfile?.displayName || '' })
              : t('dashboard.welcome', { name: userProfile?.displayName || 'User' })
            }
          </CardTitle>
          <CardDescription className="text-lg">
            {isLawyer ? t('dashboard.lawyerSubheading') : t('dashboard.subheading')}
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="max-w-2xl">
                {isLawyer ? t('dashboard.lawyerDescription') : t('dashboard.description')}
            </p>
        </CardContent>
      </Card>
      
      {isLawyer ? <LawyerDashboard /> : <UserDashboard />}
    </div>
  )
}
