'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/firebase/auth/use-user";
import { useDoc } from "@/firebase/firestore/use-doc";
import { Gavel, Users, Briefcase, ScrollText, PlusCircle, LayoutDashboard, BrainCircuit, Shield, Activity } from "lucide-react";
import Link from "next/link";
import { useLanguage } from '@/hooks/use-language';
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection } from "@/firebase/firestore/use-collection";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface UserProfile {
  role: 'user' | 'lawyer' | 'judge' | 'admin';
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

const JudgeDashboard = () => {
    const { t } = useLanguage();
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <Link href="/judge/file-case">
            <Card className="shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
                <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                    <PlusCircle className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="font-headline">{t('sidebar.fileCase')}</CardTitle>
                </div>
                </CardHeader>
                <CardContent>
                <p className="text-muted-foreground">Initiate a new case file and assign initial details.</p>
                </CardContent>
            </Card>
            </Link>

            <Link href="/judge">
            <Card className="shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
                <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                    <LayoutDashboard className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="font-headline">Case Docket</CardTitle>
                </div>
                </CardHeader>
                <CardContent>
                <p className="text-muted-foreground">View and manage all cases assigned to your bench.</p>
                </CardContent>
            </Card>
            </Link>
        </div>
    )
}

const AdminDashboard = () => {
    const { data: users } = useCollection<UserProfile>('users');
    const { data: cases } = useCollection<any>('cases');

    const totalLawyers = users?.filter(u => u.role === 'lawyer').length || 0;
    const totalJudges = users?.filter(u => u.role === 'judge').length || 0;
    const totalUsers = users?.filter(u => u.role === 'user').length || 0;
    
    const totalCases = cases?.length || 0;
    const solvedCases = cases?.filter(c => c.status === 'closed').length || 0;
    const activeCases = cases?.filter(c => c.status === 'active').length || 0;
    const pendingCases = cases?.filter(c => c.status === 'pending').length || 0;

    const caseData = [
        { name: 'Active', value: activeCases, fill: '#3b82f6' },
        { name: 'Pending', value: pendingCases, fill: '#eab308' },
        { name: 'Solved', value: solvedCases, fill: '#22c55e' },
    ];

    const roleData = [
        { name: 'Users', value: totalUsers, fill: '#64748b' },
        { name: 'Lawyers', value: totalLawyers, fill: '#3b82f6' },
        { name: 'Judges', value: totalJudges, fill: '#a855f7' },
    ];

    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Lawyers</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalLawyers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Judges</CardTitle>
                        <Gavel className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalJudges}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
                        <ScrollText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCases}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Solved Cases</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{solvedCases}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Case Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={caseData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>User Role Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={roleData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {roleData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                 <Link href="/admin">
                <Card className="shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
                    <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                        <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="font-headline">Admin Console</CardTitle>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <p className="text-muted-foreground">Manage users, lawyers, and platform settings.</p>
                    </CardContent>
                </Card>
                </Link>
                 <Link href="/statistics">
                <Card className="shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
                    <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                        <Activity className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="font-headline">Platform Statistics</CardTitle>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <p className="text-muted-foreground">View detailed analytics about platform usage.</p>
                    </CardContent>
                </Card>
                </Link>
            </div>
        </div>
    )
}

export default function Dashboard() {
  const { user } = useUser();
  const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(user?.uid ? `users/${user.uid}` : '');
  const { t } = useLanguage();

  const role = userProfile?.role || 'user';

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
            {role === 'lawyer' 
              ? t('dashboard.lawyerWelcome', { name: userProfile?.displayName || '' })
              : role === 'judge'
              ? t('sidebar.judgeDashboard')
              : role === 'admin'
              ? t('sidebar.admin')
              : t('dashboard.welcome', { name: userProfile?.displayName || 'User' })
            }
          </CardTitle>
          <CardDescription className="text-lg">
            {role === 'lawyer' ? t('dashboard.lawyerSubheading') 
             : role === 'judge' ? 'Manage your court docket and assigned cases.'
             : role === 'admin' ? 'Platform overview and management.'
             : t('dashboard.subheading')}
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="max-w-2xl">
                {role === 'lawyer' ? t('dashboard.lawyerDescription') 
                 : role === 'user' ? t('dashboard.description')
                 : ''}
            </p>
        </CardContent>
      </Card>
      
      {role === 'judge' && <JudgeDashboard />}
      {role === 'admin' && <AdminDashboard />}
      {role === 'lawyer' && <LawyerDashboard />}
      {role === 'user' && <UserDashboard />}
    </div>
  )
}
