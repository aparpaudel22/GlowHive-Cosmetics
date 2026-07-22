'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  const { isAuthenticated, hydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace('/account');
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated || isAuthenticated) return null;

  return <AuthForm />;
}