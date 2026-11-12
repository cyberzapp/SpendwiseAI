'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sparkles, Check, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfile } = useAuth();
  const [step, setStep] = useState(1);

  // Form State
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [country, setCountry] = useState(profile?.country || 'India');
  const [currency, setCurrency] = useState(profile?.preferredCurrency || 'INR');
  const [accountType, setAccountType] = useState<'personal' | 'freelancer' | 'small_business' | 'startup'>('small_business');
  const [incomeRange, setIncomeRange] = useState('₹3,00,000 - ₹5,00,000');
  const [budgetPeriod, setBudgetPeriod] = useState<'monthly' | 'weekly'>('monthly');

  const handleFinish = async () => {
    await updateProfile({
      displayName,
      country,
      preferredCurrency: currency as any,
      accountType,
      monthlyIncomeRange: incomeRange,
      budgetingPeriod: budgetPeriod,
      onboardingCompleted: true,
    });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl space-y-6">
        {/* Brand */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Welcome to Spendwise AI
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Let&apos;s configure your financial parameters in just 3 steps.
          </p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-10 bg-emerald-600'
                  : s < step
                  ? 'w-6 bg-emerald-400'
                  : 'w-6 bg-slate-200 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>

        <Card className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Step 1: Personal & Regional Profile
              </h2>
              <Input
                label="Your Full Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Country
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
                    Base Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as any)}
                    className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button size="sm" onClick={() => setStep(2)}>
                  Next Step <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Step 2: Financial Entity Type
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'freelancer', title: 'Freelancer', desc: 'Consultant & independent' },
                  { id: 'small_business', title: 'Small Business', desc: 'Pvt Ltd, LLP, or agency' },
                  { id: 'startup', title: 'Venture Startup', desc: 'Funded or bootstrapped tech' },
                  { id: 'personal', title: 'Personal Finance', desc: 'Household budgeting' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setAccountType(t.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      accountType === t.id
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <span className="block text-xs font-bold">{t.title}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                      {t.desc}
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-4 flex justify-between">
                <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button size="sm" onClick={() => setStep(3)}>
                  Next Step <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Step 3: Income Scale & Preferences
              </h2>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Target Monthly Income Range
                </label>
                <select
                  value={incomeRange}
                  onChange={(e) => setIncomeRange(e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
                  <option value="Under ₹1,00,000">Under ₹1,00,000</option>
                  <option value="₹1,00,000 - ₹3,00,000">₹1,00,000 - ₹3,00,000</option>
                  <option value="₹3,00,000 - ₹5,00,000">₹3,00,000 - ₹5,00,000</option>
                  <option value="₹5,00,000 - ₹10,00,000">₹5,00,000 - ₹10,00,000</option>
                  <option value="₹10,00,000+">₹10,00,000+</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Budget Cycle
                </label>
                <div className="flex gap-3">
                  {(['monthly', 'weekly'] as const).map((cycle) => (
                    <button
                      key={cycle}
                      type="button"
                      onClick={() => setBudgetPeriod(cycle)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize border transition-all ${
                        budgetPeriod === cycle
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600'
                      }`}
                    >
                      {cycle} Cycle
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <Button variant="outline" size="sm" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button size="sm" onClick={handleFinish}>
                  Launch Spendwise AI <Check className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
