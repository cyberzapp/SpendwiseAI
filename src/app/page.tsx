'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Bot,
  PieChart,
  Repeat,
  CheckCircle2,
  Wallet,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Navigation */}
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

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <Link href="/features" className="hover:text-emerald-600 transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="hover:text-emerald-600 transition-colors">
              Pricing
            </Link>
            <Link href="/dashboard" className="hover:text-emerald-600 transition-colors">
              Live Demo
            </Link>
            <Link href="/privacy" className="hover:text-emerald-600 transition-colors">
              Security
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="shadow-xs">
                Launch App <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Driven SaaS Finance for Founders & High-Growth Startups</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Take control of your money.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-400">
              Make smarter financial decisions.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A single workspace to track income, burn rates, category budgets, and multi-month runway reserves — powered by a real-time conversational AI financial assistant.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-sm font-semibold shadow-md">
                Explore Live Demo Platform <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-sm">
                View Pricing Plans
              </Button>
            </Link>
          </div>

          <div className="pt-8 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Multi-Currency (INR ₹ Native)
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Firebase Cloud Infrastructure
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Zero Hallucination AI
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Engineered with Mercury & Ramp-grade precision
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Every balance, ledger entry, and cash transfer is reconciled atomically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Grounding Financial AI
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Ask questions about your burn rate, subscriptions, and savings capacity. The AI reads actual Firestore numbers — never hallucinated records.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <PieChart className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Atomic Budgeting & Caps
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Establish spending caps per cost center. Real-time telemetry notifies team leads at 70%, 90%, and 100% threshold utilization.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Repeat className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Scheduled Subscriptions
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Manage SaaS software tools, office leases, and client retainers with idempotent scheduled Cloud Functions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-10 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-slate-100">Spendwise AI</span>
            <span>© 2026 All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>
            <Link href="/dashboard" className="text-emerald-600 font-medium">
              Demo Workspace
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
