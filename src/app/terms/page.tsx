import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 max-w-4xl mx-auto space-y-6 text-xs text-slate-700 dark:text-slate-300">
      <Link href="/" className="text-emerald-600 hover:underline">← Back to Spendwise AI</Link>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Terms of Service</h1>
      <p>By accessing or utilizing Spendwise AI, you agree to comply with these terms of use.</p>
      <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">1. Not Certified Financial Advice</h2>
      <p>Spendwise AI provides automated ledger aggregation, budgetary telemetry, and algorithmic insights for informational purposes. Spendwise AI does not provide formal legal, tax, or accredited fiduciary audit advice.</p>
      <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">2. Service Availability & SLA</h2>
      <p>We target 99.9% uptime backed by Google Cloud and Firebase infrastructure.</p>
    </div>
  );
}
