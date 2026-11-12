import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Spendwise AI — Intelligent SaaS Financial Management',
  description: 'Take control of your money. Make smarter financial decisions with AI-powered analytics and cash flow forecasting.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
