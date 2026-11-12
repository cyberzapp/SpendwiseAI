'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Shield, Lock, Key, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function SecuritySettingsPage() {
  const { profile, resetPassword, logout } = useAuth();
  const [resetSent, setResetSent] = useState(false);

  const handlePasswordReset = async () => {
    if (profile?.email) {
      await resetPassword(profile.email);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 3000);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Security & Authentication
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Audit sessions, reset credentials, and manage data sovereignty.
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
          <Link href="/settings/billing" className="px-3 py-1.5 text-slate-500 hover:text-slate-900">
            Plans & Billing
          </Link>
          <Link
            href="/settings/security"
            className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 font-semibold"
          >
            Security
          </Link>
        </div>

        {resetSent && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" /> Password reset email dispatched to {profile?.email}.
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Authentication Credentials</CardTitle>
            <CardDescription>Secure single sign-on and password configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Email Address</span>
                <p className="text-slate-400">{profile?.email}</p>
              </div>
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                Verified
              </span>
            </div>

            <div className="flex items-center justify-between py-2 text-xs">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Password</span>
                <p className="text-slate-400">Request a secure password reset link</p>
              </div>
              <Button size="sm" variant="outline" onClick={handlePasswordReset}>
                Reset Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-rose-200 dark:border-rose-900/40">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-rose-600">Danger Zone</CardTitle>
            <CardDescription>Permanent data actions and workspace revocation</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                Sign Out Everywhere
              </span>
              <p className="text-slate-400">Invalidate all existing session tokens on all devices</p>
            </div>
            <Button size="sm" variant="danger" onClick={logout}>
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
