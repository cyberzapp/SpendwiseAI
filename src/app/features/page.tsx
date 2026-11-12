'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Bot, Shield, CheckCircle2, TrendingUp, Zap, PieChart, Layers } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 dark:border-slate-800 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Spendwise<span className="text-emerald-500">.ai</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Live Platform</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-12 flex-1">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Financial Management Built for Precision
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            A comprehensive overview of the architecture and modules behind Spendwise AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 space-y-3">
            <Bot className="h-6 w-6 text-emerald-600" />
            <h3 className="text-base font-bold">Conversational Financial Copilot</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Real-time server-side grounding directly from your verified Firestore ledger. Ask questions regarding cash flow runway, budget variances, and savings capacities.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <TrendingUp className="h-6 w-6 text-emerald-600" />
            <h3 className="text-base font-bold">Integer Minor-Unit Precision</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Eliminates IEEE-754 floating-point inaccuracies. All monetary values are recorded in minor units (paise/cents), ensuring mathematically exact reconciliations.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <PieChart className="h-6 w-6 text-emerald-600" />
            <h3 className="text-base font-bold">Budget & Cost-Center Guardrails</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Set weekly or monthly spending caps. Dynamic telemetry notifies you at 70%, 90%, and 100% threshold utilization before overruns happen.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <Layers className="h-6 w-6 text-emerald-600" />
            <h3 className="text-base font-bold">Multi-Tenant RBAC Security</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Support for Owner, Admin, Member, and Viewer roles with strict Firebase Security Rules preventing cross-workspace data leakage.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
