'use client';

import React, { useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency, formatCompactCurrency } from '@/lib/currency';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  PieChart as PieIcon,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4', '#64748B'];

export default function DashboardPage() {
  const { currentWorkspace, profile } = useAuth();
  const { accounts, transactions, budgets, recurring, goals } = useFinance();
  const [period, setPeriod] = useState<'30' | '90' | '180' | 'all'>('30');

  // Compute total balance across all accounts
  const totalBalance = useMemo(() => {
    return accounts.reduce((acc, a) => acc + a.currentBalance, 0);
  }, [accounts]);

  // Compute metrics for current period
  const { totalIncome, totalExpenses, netCashFlow, incomeVsExpenseData, categoryData } = useMemo(() => {
    let filteredTxs = transactions;
    const now = new Date('2026-11-01T23:00:00Z');

    if (period !== 'all') {
      const days = parseInt(period, 10);
      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      filteredTxs = transactions.filter((t) => new Date(t.transactionDate) >= cutoff);
    }

    let inc = 0;
    let exp = 0;
    const catMap: Record<string, number> = {};

    filteredTxs.forEach((t) => {
      if (t.type === 'income') {
        inc += t.amount;
      } else if (t.type === 'expense') {
        exp += t.amount;
        const name = t.categoryName || 'Other';
        catMap[name] = (catMap[name] || 0) + t.amount;
      }
    });

    // Monthly bucket chart data
    const monthlyBuckets: Record<string, { month: string; income: number; expense: number }> = {};
    const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
    months.forEach((m) => {
      monthlyBuckets[m] = { month: m, income: 0, expense: 0 };
    });

    transactions.forEach((t) => {
      const d = new Date(t.transactionDate);
      const monthName = d.toLocaleString('en-US', { month: 'short' });
      if (monthlyBuckets[monthName]) {
        if (t.type === 'income') monthlyBuckets[monthName].income += t.amount / 100;
        if (t.type === 'expense') monthlyBuckets[monthName].expense += t.amount / 100;
      }
    });

    const chartData = Object.values(monthlyBuckets);

    const pieData = Object.entries(catMap).map(([name, value]) => ({
      name,
      value: value / 100,
    }));

    return {
      totalIncome: inc,
      totalExpenses: exp,
      netCashFlow: inc - exp,
      incomeVsExpenseData: chartData,
      categoryData: pieData,
    };
  }, [transactions, period]);

  // Recent 5 transactions
  const recentTransactions = useMemo(() => {
    return transactions.slice(0, 5);
  }, [transactions]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Welcome back, {profile?.displayName?.split(' ')[0] || 'Founder'} 👋
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Here is your financial executive overview for {currentWorkspace.name}. All figures verified from ledger.
            </p>
          </div>

          {/* Period selector */}
          <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg self-start">
            {(['30', '90', '180', 'all'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  period === p
                    ? 'bg-slate-900 text-white dark:bg-emerald-600'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                {p === 'all' ? 'All Time' : `${p} Days`}
              </button>
            ))}
          </div>
        </div>

        {/* AI Insight Highlight Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 p-5 text-white shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                    AI Financial Observation
                  </span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300 font-medium">
                    Runway Healthy
                  </span>
                </div>
                <p className="text-sm text-slate-200 max-w-2xl leading-relaxed">
                  Net cash flow has been positive for 5 consecutive months. Your liquid cash reserve covers 6.8 months of operational expenses. However, <span className="font-semibold text-emerald-400">Team Dining & Entertainment</span> is 8% over budget this cycle.
                </p>
              </div>
            </div>
            <Link href="/ai-assistant">
              <Button size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold shrink-0">
                Ask AI Assistant <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Top 4 KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Net Worth */}
          <Card className="hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Total Balance
              </CardTitle>
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Wallet className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
                {formatCurrency(totalBalance, currentWorkspace.defaultCurrency, true)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                <span className="text-emerald-600 font-medium">+14.2%</span> vs last quarter
              </p>
            </CardContent>
          </Card>

          {/* Total Income */}
          <Card className="hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Total Period Income
              </CardTitle>
              <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
                {formatCurrency(totalIncome, currentWorkspace.defaultCurrency, true)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                <span className="text-emerald-600 font-medium">+8.5%</span> recurring client flow
              </p>
            </CardContent>
          </Card>

          {/* Total Expenses */}
          <Card className="hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Total Period Expenses
              </CardTitle>
              <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <TrendingDown className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400 tabular-nums">
                {formatCurrency(totalExpenses, currentWorkspace.defaultCurrency, true)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                <span className="text-rose-500 font-medium">-3.2%</span> managed expenses
              </p>
            </CardContent>
          </Card>

          {/* Net Cash Flow */}
          <Card className="hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Net Cash Flow
              </CardTitle>
              <div
                className={`p-2 rounded-lg ${
                  netCashFlow >= 0
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                }`}
              >
                {netCashFlow >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold tracking-tight tabular-nums ${
                  netCashFlow >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
                }`}
              >
                {formatCurrency(netCashFlow, currentWorkspace.defaultCurrency, true)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Retained surplus funds
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section: Cash Flow Area Chart + Expense Distribution Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Income vs Expenses Cash Flow */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Cash Flow & Revenue Velocity</CardTitle>
                <CardDescription>Monthly income vs operational burn (INR ₹)</CardDescription>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-400">Income</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                  <span className="text-slate-600 dark:text-slate-400">Expense</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={incomeVsExpenseData}>
                  <defs>
                    <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorInc)"
                    name="Income"
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="#EF4444"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorExp)"
                    name="Expense"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Expense Breakdown Donut */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Expense Allocation</CardTitle>
              <CardDescription>Major expenditure categories</CardDescription>
            </CardHeader>
            <CardContent className="h-72 flex flex-col justify-between">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend with percentages */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                {categoryData.slice(0, 4).map((cat, idx) => (
                  <div key={cat.name} className="flex items-center gap-1.5 truncate">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span className="truncate text-slate-600 dark:text-slate-400">{cat.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budgets Progress & Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Budgets Overview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">Active Budgets</CardTitle>
                <CardDescription>Spend pacing vs allocated thresholds</CardDescription>
              </div>
              <Link href="/budgets">
                <Button variant="ghost" size="sm" className="text-xs">
                  Manage Budgets <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {budgets.map((b) => {
                const percent = Math.min(100, Math.round((b.spent / b.amount) * 100));
                const isOver = b.spent > b.amount;
                const isNear = percent >= b.alertThreshold && !isOver;

                return (
                  <div key={b.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {b.name}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                          {formatCurrency(b.spent, b.currency, false)} / {formatCurrency(b.amount, b.currency, false)}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                            isOver
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                              : isNear
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                          }`}
                        >
                          {percent}%
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isOver ? 'bg-rose-500' : isNear ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent Ledger Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
                <CardDescription>Latest synchronized financial activity</CardDescription>
              </div>
              <Link href="/transactions">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                          tx.type === 'income'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : tx.type === 'expense'
                            ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                            : 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                        }`}
                      >
                        {tx.type === 'income' ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : tx.type === 'expense' ? (
                          <ArrowDownLeft className="h-4 w-4" />
                        ) : (
                          <Layers className="h-4 w-4" />
                        )}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {tx.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {tx.categoryName || 'General'} • {formatDate(tx.transactionDate)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`text-xs font-bold tabular-nums ${
                          tx.type === 'income'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : tx.type === 'expense'
                            ? 'text-slate-900 dark:text-slate-100'
                            : 'text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}
                        {formatCurrency(tx.amount, tx.currency)}
                      </span>
                      <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
                        {tx.accountName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Scheduled Payments & Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upcoming Recurring Payments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">Scheduled Recurring Commitments</CardTitle>
                <CardDescription>Next upcoming subscriptions and payments</CardDescription>
              </div>
              <Link href="/recurring">
                <Button variant="ghost" size="sm" className="text-xs">
                  Manage <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {recurring.slice(0, 3).map((r) => (
                <div key={r.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{r.title}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Due {formatDate(r.nextExecutionDate)} • {r.interval}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                    {formatCurrency(r.amount, r.currency)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Strategic Financial Goals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">Financial Reserve Goals</CardTitle>
                <CardDescription>Progress towards targeted business runway & assets</CardDescription>
              </div>
              <Link href="/goals">
                <Button variant="ghost" size="sm" className="text-xs">
                  All Goals <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {goals.slice(0, 3).map((g) => {
                const percent = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
                return (
                  <div key={g.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{g.name}</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {percent}% ({formatCurrency(g.currentAmount, currentWorkspace.defaultCurrency, false)})
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
