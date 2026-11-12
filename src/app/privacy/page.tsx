import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 max-w-4xl mx-auto space-y-6 text-xs text-slate-700 dark:text-slate-300">
      <Link href="/" className="text-emerald-600 hover:underline">← Back to Spendwise AI</Link>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Privacy & Data Governance Policy</h1>
      <p>Spendwise AI treats financial transactions and records with institutional security standards.</p>
      <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">1. Data Storage & Multi-Tenancy</h2>
      <p>All financial accounts, ledger entries, and budgets reside in isolated tenant documents governed by Cloud Firestore security rules. No tenant may read or alter unauthenticated records.</p>
      <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">2. AI Privacy & No-Training Guarantee</h2>
      <p>User transaction data supplied to the server-side AI financial engine is utilized strictly ephemerally for user context generation. It is not shared, sold, or used for model training.</p>
    </div>
  );
}
