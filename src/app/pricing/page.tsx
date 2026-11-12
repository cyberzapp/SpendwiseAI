'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function PricingPage() {
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
              <Button size="sm">Explore App</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-12 flex-1">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Transparent, Founder-Friendly Pricing
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Scale seamlessly from sole proprietorship to venture-backed entity. Default currency INR (₹).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold">Starter Plan</h3>
                <p className="text-xs text-slate-400 mt-1">For freelancers & solo independent consultants</p>
              </div>
              <div className="text-3xl font-extrabold">₹0</div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 1 Workspace & Single User
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 3 Active Category Budgets
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 10 Monthly AI Queries
                </li>
              </ul>
            </div>
            <Link href="/signup">
              <Button variant="outline" className="w-full mt-6">
                Get Started Free
              </Button>
            </Link>
          </Card>

          <Card className="p-6 flex flex-col justify-between border-2 border-emerald-500 shadow-lg relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider">
              Most Popular
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold">Pro Scale</h3>
                <p className="text-xs text-slate-400 mt-1">For fast-moving startups and bootstrapped teams</p>
              </div>
              <div className="text-3xl font-extrabold">
                ₹2,499 <span className="text-xs font-normal text-slate-400">/ mo</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Unlimited Budgets & Categories
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Unlimited AI Financial Assistant
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Scheduled Recurring Subscriptions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> CSV & PDF P&L Audit Export
                </li>
              </ul>
            </div>
            <Link href="/dashboard">
              <Button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700">
                Launch Pro Platform
              </Button>
            </Link>
          </Card>

          <Card className="p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold">Organization</h3>
                <p className="text-xs text-slate-400 mt-1">For established agencies and multiple entities</p>
              </div>
              <div className="text-3xl font-extrabold">
                ₹6,999 <span className="text-xs font-normal text-slate-400">/ mo</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Multi-Tenant Workspaces
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Granular RBAC Permissions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Dedicated SLA & Priority Support
                </li>
              </ul>
            </div>
            <Link href="/signup">
              <Button variant="outline" className="w-full mt-6">
                Contact Enterprise
              </Button>
            </Link>
          </Card>
        </div>
      </main>
    </div>
  );
}
