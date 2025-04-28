"use client";

import { useEffect, useState } from 'react';
import { configureAmplify } from '@/lib/auth/cognito-config';

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    configureAmplify();
    setInitialized(true);
  }, []);

  if (!initialized) {
    return null;
  }

  return <>{children}</>;
}