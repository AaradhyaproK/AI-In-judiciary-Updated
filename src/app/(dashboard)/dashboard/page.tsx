import dynamicImport from 'next/dynamic';

// Dynamically import the client component with SSR disabled to prevent build manifest errors
const DashboardClient = dynamicImport(() => import('./DashboardClient'), { 
  ssr: false 
});

export const dynamic = 'force-dynamic';

export default function Dashboard() {
  return <DashboardClient />;
}
