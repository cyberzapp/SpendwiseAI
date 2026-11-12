'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Bell, Shield, Building, CreditCard, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ProfileSettingsPage() {
  const { profile, updateProfile, isDemoMode } = useAuth();

  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [country, setCountry] = useState(profile?.country || 'India');
  const [preferredCurrency, setPreferredCurrency] = useState(profile?.preferredCurrency || 'INR');
  const [timeZone, setTimeZone] = useState(profile?.timeZone || 'Asia/Kolkata');
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      displayName,
      country,
      preferredCurrency: preferredCurrency as any,
      timeZone,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Settings & Preferences
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal profile, regional currency settings, and security.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs font-medium">
          <Link
            href="/settings/profile"
            className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 font-semibold"
          >
            Profile & Locale
          </Link>
          <Link
            href="/settings/preferences"
            className="px-3 py-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
          >
            Preferences
          </Link>
          <Link
            href="/settings/workspace"
            className="px-3 py-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
          >
            Workspace & Members
          </Link>
          <Link
            href="/settings/billing"
            className="px-3 py-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
          >
            Plans & Billing
          </Link>
          <Link
            href="/settings/security"
            className="px-3 py-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
          >
            Security
          </Link>
        </div>

        {saved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" /> Profile details saved successfully.
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Personal Profile</CardTitle>
            <CardDescription>Update your public moniker and identification</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  disabled
                  helperText="Managed by authentication provider"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Operating Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Singapore">Singapore</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Default Currency
                  </label>
                  <select
                    value={preferredCurrency}
                    onChange={(e) => setPreferredCurrency(e.target.value as any)}
                    className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  >
                    <option value="INR">INR (₹) — Indian Rupee</option>
                    <option value="USD">USD ($) — US Dollar</option>
                    <option value="EUR">EUR (€) — Euro</option>
                    <option value="GBP">GBP (£) — British Pound</option>
                    <option value="AED">AED (د.إ) — UAE Dirham</option>
                    <option value="SGD">SGD (S$) — Singapore Dollar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Time Zone
                  </label>
                  <select
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST +4:00)</option>
                    <option value="Asia/Singapore">Asia/Singapore (SGT +8:00)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" size="sm">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
