'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup, loginWithGoogle } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signup(email, password, name);
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
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
            Create your account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Start tracking company cash flow and budgets with automated AI insights.
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 text-rose-600 text-xs border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900">
                {error}
              </div>
            )}

            <Input
              label="Full Name"
              placeholder="e.g. Alex Morgan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Work Email Address"
              type="email"
              placeholder="founder@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password (min 6 characters)"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" size="md" className="w-full" disabled={loading}>
              {loading ? 'Creating Workspace...' : 'Sign Up Free'}
            </Button>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <span className="relative bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 uppercase tracking-wider">
                Or sign up with
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="md"
              className="w-full"
              onClick={loginWithGoogle}
            >
              Sign up with Google
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="text-emerald-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
