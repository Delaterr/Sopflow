"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShopFlowLogo } from '@/components/icons';
import { user as placeholderUser } from '@/lib/placeholder-data';


export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // This is now simplified. In a real app, you'd check for a session token.
    if (placeholderUser) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <ShopFlowLogo className="h-16 w-16 animate-pulse text-primary" />
        <p className="text-muted-foreground">Loading your shop...</p>
      </div>
    </div>
  );
}
