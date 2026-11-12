'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency } from '@/lib/currency';
import { formatDate } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, FileText, Calendar, Tag, Wallet } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { transactions } = useFinance();
  const tx = transactions.find((t) => t.id === resolvedParams.id);

  if (!tx) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <Link href="/transactions">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Transactions
            </Button>
          </Link>
          <div className="py-16 text-center text-xs text-slate-400">
            Transaction not found in ledger.
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <Link href="/transactions">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Ledger
          </Button>
        </Link>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Transaction ID: {tx.id}
              </span>
              <CardTitle className="text-xl font-bold mt-1">{tx.title}</CardTitle>
            </div>
            <div className={`p-2.5 rounded-xl ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {tx.type === 'income' ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Ledger Amount</span>
              <span className="text-lg font-bold tabular-nums text-slate-900 dark:text-slate-100">
                {formatCurrency(tx.amount, tx.currency)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-slate-400">Recorded Date</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {formatDate(tx.transactionDate)}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Classification</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 capitalize">
                  {tx.type} ({tx.categoryName || 'General'})
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-slate-400">Account</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {tx.accountName}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Merchant / Counterparty</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {tx.merchant || 'Direct Transfer'}
                </p>
              </div>
            </div>

            {tx.description && (
              <div>
                <span className="text-slate-400">Audit Notes</span>
                <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {tx.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
