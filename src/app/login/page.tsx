'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, toggleDemoMode } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    toggleDemoMode(true);
    router.push('/dashboard');
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
            Sign in to your account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access your financial workspace, cash flows, and AI assistant.
          </p>
        </div>

        {/* Demo Fast-Track Card */}
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Try the complete live portfolio demo with 1-click</span>
          </div>
          <Button size="sm" onClick={handleDemoAccess} className="h-7 text-xs px-2.5">
            Instant Demo
          </Button>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 text-rose-600 text-xs border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900">
                {error}
              </div>
            )}

            <Input
              label="Work Email Address"
              type="email"
              placeholder="founder@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" size="md" className="w-full" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In to Workspace'}
            </Button>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <span className="relative bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 uppercase tracking-wider">
                Or continue with
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="md"
              className="w-full"
              onClick={loginWithGoogle}
            >
              Sign in with Google
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs text-slate-500">
          Don&apos;t have an account yet?{' '}
          <Link href="/signup" className="text-emerald-600 font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
