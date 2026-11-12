'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency, toMinorUnits } from '@/lib/currency';
import { formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Plus, Trash2, Play, Pause, Calendar, Repeat, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { RecurrenceInterval } from '@/types';

export default function RecurringPage() {
  const { currentWorkspace } = useAuth();
  const { recurring, accounts, categories, createRecurring, updateRecurring, deleteRecurring, executeRecurringItem } = useFinance();

  const [showAddModal, setShowAddModal] = useState(false);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [interval, setInterval] = useState<RecurrenceInterval>('monthly');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [startDate, setStartDate] = useState('2026-11-01');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountMinor = toMinorUnits(parseFloat(amount));

    await createRecurring({
      title,
      amount: amountMinor,
      currency: currentWorkspace.defaultCurrency,
      type,
      categoryId,
      accountId,
      startDate: new Date(startDate).toISOString(),
      nextExecutionDate: new Date(startDate).toISOString(),
      interval,
      status: 'active',
    });

    setTitle('');
    setAmount('');
    setShowAddModal(false);
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    await updateRecurring(id, {
      status: currentStatus === 'active' ? 'paused' : 'active',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Recurring Subscriptions & Cash Flows
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Automated schedules, client retainer inflows, and recurring SaaS subscriptions.
            </p>
          </div>

          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Add Recurring Schedule
          </Button>
        </div>

        {/* Recurring List Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recurring.map((rec) => {
            const acc = accounts.find((a) => a.id === rec.accountId);
            const cat = categories.find((c) => c.id === rec.categoryId);

            return (
              <Card key={rec.id} className="p-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                          rec.type === 'income'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                        }`}
                      >
                        {rec.type === 'income' ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownLeft className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {rec.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 capitalize">
                          {rec.interval} • {cat?.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleStatus(rec.id, rec.status)}
                        className={`p-1 rounded-md text-xs transition-colors ${
                          rec.status === 'active'
                            ? 'text-emerald-600 hover:text-emerald-700'
                            : 'text-amber-500 hover:text-amber-600'
                        }`}
                        title={rec.status === 'active' ? 'Pause' : 'Resume'}
                      >
                        {rec.status === 'active' ? (
                          <Pause className="h-3.5 w-3.5" />
                        ) : (
                          <Play className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteRecurring(rec.id)}
                        className="p-1 text-slate-400 hover:text-rose-500"
                        title="Delete Schedule"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400">Scheduled Amount</span>
                    <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
                      {formatCurrency(rec.amount, rec.currency)}
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <div className="flex items-center justify-between">
                      <span>Next Due Date:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {formatDate(rec.nextExecutionDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Linked Account:</span>
                      <span className="truncate max-w-[140px] font-medium text-slate-800 dark:text-slate-200">
                        {acc?.name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${
                      rec.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {rec.status}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 px-2.5"
                    onClick={() => executeRecurringItem(rec.id)}
                  >
                    Post Now
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Schedule Recurring Payment"
        description="Configure an automated periodic cash disbursement or revenue inflow."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {(['expense', 'income'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`py-1.5 text-xs font-semibold capitalize rounded-md transition-all ${
                  type === t
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-950 dark:text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <Input
            label="Schedule Title"
            placeholder="e.g. AWS Hosting, TechVentures Retainer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label={`Amount (${currentWorkspace.defaultCurrency})`}
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Frequency Interval
              </label>
              <select
                value={interval}
                onChange={(e: any) => setInterval(e.target.value)}
                className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
                <option value="daily">Daily</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Target Account
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                {categories
                  .filter((c) => (type === 'income' ? c.type === 'income' : c.type === 'expense'))
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <Input
            label="First Execution Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Recurring Schedule
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
