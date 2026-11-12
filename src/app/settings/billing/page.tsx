'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check, Sparkles, Zap, Shield, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function BillingSettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Subscription Plans & Tier Entitlements
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Scalable billing infrastructure ready for Razorpay and global card settlements.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs font-medium">
          <Link href="/settings/profile" className="px-3 py-1.5 text-slate-500 hover:text-slate-900">
            Profile & Locale
          </Link>
          <Link href="/settings/workspace" className="px-3 py-1.5 text-slate-500 hover:text-slate-900">
            Workspace & Members
          </Link>
          <Link
            href="/settings/billing"
            className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 font-semibold"
          >
            Plans & Billing
          </Link>
          <Link href="/settings/security" className="px-3 py-1.5 text-slate-500 hover:text-slate-900">
            Security
          </Link>
        </div>

        {/* Pricing Tier Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Free Tier */}
          <Card className="flex flex-col justify-between p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Starter</h3>
                <p className="text-xs text-slate-400 mt-1">For solo freelancers tracking baseline costs</p>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                ₹0 <span className="text-xs font-normal text-slate-400">/ month</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" /> 1 Financial Workspace
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" /> Up to 3 Active Budgets
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" /> Basic Transaction Ledger
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" /> 10 AI Assistant Queries/mo
                </li>
              </ul>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-6">
              Downgrade
            </Button>
          </Card>

          {/* Pro Tier (Active) */}
          <Card className="relative flex flex-col justify-between p-6 border-2 border-emerald-500 dark:border-emerald-500 shadow-md">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider">
              Current Plan
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Professional</h3>
                <p className="text-xs text-slate-400 mt-1">For scaling startups and founders</p>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                ₹2,499 <span className="text-xs font-normal text-slate-400">/ month</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" /> Unlimited Budgets & Categories
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" /> Unlimited AI Financial Assistant
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" /> Recurring Transactions Engine
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" /> CSV & PDF P&L Audit Reports
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" /> Receipt & Document Storage
                </li>
              </ul>
            </div>
            <Button size="sm" className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700">
              Manage Active Plan
            </Button>
          </Card>

          {/* Enterprise / Business Tier */}
          <Card className="flex flex-col justify-between p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Organization</h3>
                <p className="text-xs text-slate-400 mt-1">For multi-entity businesses & agencies</p>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                ₹6,999 <span className="text-xs font-normal text-slate-400">/ month</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" /> Unlimited Workspaces
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" /> Advanced RBAC Team Permissions
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" /> Dedicated Cloud Functions Worker
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" /> Priority 24/7 Support SLA
                </li>
              </ul>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-6">
              Upgrade to Org
            </Button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
