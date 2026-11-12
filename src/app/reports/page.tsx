'use client';

import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency } from '@/lib/currency';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Download, Printer, Filter, Calendar } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import Papa from 'papaparse';

export default function ReportsPage() {
  const { currentWorkspace } = useAuth();
  const { transactions, accounts, budgets, goals } = useFinance();

  const [dateRange, setDateRange] = useState<'30' | '90' | '180' | '365' | 'all'>('180');

  // Filter transactions
  const filteredTxs = useMemo(() => {
    if (dateRange === 'all') return transactions;
    const days = parseInt(dateRange, 10);
    const baseTime = new Date('2026-11-01T23:00:00Z').getTime();
    const cutoff = new Date(baseTime - days * 24 * 60 * 60 * 1000);
    return transactions.filter((t) => new Date(t.transactionDate) >= cutoff);
  }, [transactions, dateRange]);

  // Aggregate stats
  const { totalIncome, totalExpense, netSavings, savingsRate, categoryStats } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    const catMap: Record<string, { name: string; amount: number; count: number }> = {};

    filteredTxs.forEach((t) => {
      if (t.type === 'income') {
        inc += t.amount;
      } else if (t.type === 'expense') {
        exp += t.amount;
        const cname = t.categoryName || 'General';
        if (!catMap[cname]) {
          catMap[cname] = { name: cname, amount: 0, count: 0 };
        }
        catMap[cname].amount += t.amount;
        catMap[cname].count += 1;
      }
    });

    const net = inc - exp;
    const rate = inc > 0 ? Math.round((net / inc) * 100) : 0;
    const sortedCats = Object.values(catMap).sort((a, b) => b.amount - a.amount);

    return {
      totalIncome: inc,
      totalExpense: exp,
      netSavings: net,
      savingsRate: rate,
      categoryStats: sortedCats,
    };
  }, [filteredTxs]);

  // Monthly comparison chart data
  const monthlyData = useMemo(() => {
    const buckets: Record<string, { month: string; income: number; expense: number; net: number }> = {};
    const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
    months.forEach((m) => {
      buckets[m] = { month: m, income: 0, expense: 0, net: 0 };
    });

    transactions.forEach((t) => {
      const d = new Date(t.transactionDate);
      const m = d.toLocaleString('en-US', { month: 'short' });
      if (buckets[m]) {
        if (t.type === 'income') buckets[m].income += t.amount / 100;
        if (t.type === 'expense') buckets[m].expense += t.amount / 100;
        buckets[m].net = buckets[m].income - buckets[m].expense;
      }
    });

    return Object.values(buckets);
  }, [transactions]);

  const handleExportCSV = () => {
    const data = filteredTxs.map((t) => ({
      ID: t.id,
      Date: t.transactionDate,
      Title: t.title,
      Type: t.type,
      Category: t.categoryName || '',
      Account: t.accountName || '',
      Amount: t.amount / 100,
      Currency: t.currency,
      Merchant: t.merchant || '',
    }));
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Spendwise_Financial_Report_${dateRange}d.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Financial Intelligence & Reports
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Audit-ready P&L statements, burn rates, and expenditure distribution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e: any) => setDateRange(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="30">Last 30 Days</option>
              <option value="90">Last Quarter (90d)</option>
              <option value="180">Last 6 Months</option>
              <option value="365">This Year (365d)</option>
              <option value="all">All-Time Historical</option>
            </select>

            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-1.5" /> Export Data
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-1.5" /> Print Report
            </Button>
          </div>
        </div>

        {/* P&L Statement Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-slate-500">Gross Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-emerald-600 tabular-nums">
                {formatCurrency(totalIncome, currentWorkspace.defaultCurrency)}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Top-line earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-slate-500">Operating Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-rose-600 tabular-nums">
                {formatCurrency(totalExpense, currentWorkspace.defaultCurrency)}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Disbursements & overhead</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-slate-500">Net Profit / Surplus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-xl font-bold tabular-nums ${netSavings >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatCurrency(netSavings, currentWorkspace.defaultCurrency)}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Retained earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-medium text-slate-500">Net Margin Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {savingsRate}%
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Surplus efficiency</p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Performance Comparison Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Monthly Income vs. Burn Analysis</CardTitle>
            <CardDescription>Comprehensive side-by-side comparison for the previous 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
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
                <Legend />
                <Bar dataKey="income" name="Gross Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Operational Expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detailed Category Expense Breakdown Table */}
        <Card className="overflow-hidden p-0">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-semibold">Expense Cost-Center Breakdown</CardTitle>
            <CardDescription>Expenditure by category sorted by total volume</CardDescription>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Transactions</th>
                  <th className="py-3 px-4 text-right">Total Disbursed</th>
                  <th className="py-3 px-4 text-right">% of Total Burn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {categoryStats.map((c) => {
                  const share = totalExpense > 0 ? ((c.amount / totalExpense) * 100).toFixed(1) : '0';
                  return (
                    <tr key={c.name} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">{c.name}</td>
                      <td className="py-3 px-4 text-center text-slate-500">{c.count}</td>
                      <td className="py-3 px-4 text-right font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                        {formatCurrency(c.amount, currentWorkspace.defaultCurrency)}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-slate-500 tabular-nums">
                        {share}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
