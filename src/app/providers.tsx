'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { FinanceProvider } from '@/context/FinanceContext';
import { ThemeProvider } from '@/context/ThemeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FinanceProvider>{children}</FinanceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
