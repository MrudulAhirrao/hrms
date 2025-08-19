// src/app/dashboard/layout.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login
    if (!loading && !user) {
      router.push('/');
    }
    // Optional: If a non-employee tries to access this page
    if (!loading && user && user.role !== 'Employee') {
        router.push('/hr-admin'); // Or a "not authorized" page
    }
  }, [user, loading, router]);

  // While loading, show a blank screen or a spinner
  if (loading || !user) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  // If logged in, show the dashboard layout
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Employee Portal</h1>
        <div className='flex items-center'>
          <span className="text-sm mr-4">Welcome, {user.email}</span>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}