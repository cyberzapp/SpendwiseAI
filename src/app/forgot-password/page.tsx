'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await resetPassword(email);
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Spendwise<span className="text-emerald-500">.ai</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Reset your password
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            We will dispatch a secure recovery email to your address.
          </p>
        </div>

        <Card className="p-6">
          {sent ? (
            <div className="text-center space-y-3 py-4">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Recovery Link Dispatched
              </h3>
              <p className="text-xs text-slate-500">
                Check your inbox for instructions to reset your password.
              </p>
              <Link href="/login" className="inline-block mt-4">
                <Button size="sm" variant="outline">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email Address"
                type="email"
                placeholder="founder@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button type="submit" size="md" className="w-full" disabled={loading}>
                {loading ? 'Sending Link...' : 'Send Recovery Email'}
              </Button>
            </form>
          )}
        </Card>

        <p className="text-center text-xs text-slate-500">
          Remembered your password?{' '}
          <Link href="/login" className="text-emerald-600 font-semibold hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
