'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency } from '@/lib/currency';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Building2, CreditCard, PiggyBank, Banknote } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { accounts, transactions } = useFinance();
  const acc = accounts.find((a) => a.id === resolvedParams.id);

  if (!acc) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <Link href="/accounts">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Accounts
            </Button>
          </Link>
          <div className="py-16 text-center text-xs text-slate-400">
            Account not found in workspace.
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const relatedTxs = transactions.filter(
    (t) => t.accountId === acc.id || t.toAccountId === acc.id
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Link href="/accounts">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Accounts
          </Button>
        </Link>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {acc.institutionName || 'Depository Account'}
              </span>
              <CardTitle className="text-xl font-bold mt-1">{acc.name}</CardTitle>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Reconciled Ledger Balance</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {formatCurrency(acc.currentBalance, acc.currency)}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-3">
              Account Transaction History ({relatedTxs.length})
            </h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {relatedTxs.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  No transactions recorded on this account yet.
                </div>
              ) : (
                relatedTxs.map((t) => (
                  <div key={t.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{t.title}</p>
                      <p className="text-[11px] text-slate-400">{t.categoryName || 'General'}</p>
                    </div>
                    <span
                      className={`font-bold tabular-nums ${
                        t.type === 'income' ? 'text-emerald-600' : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {t.type === 'income' ? '+' : '-'}
                      {formatCurrency(t.amount, t.currency)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
