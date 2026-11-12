'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency, toMinorUnits } from '@/lib/currency';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Plus, Trash2, Edit2, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';

export default function BudgetsPage() {
  const { currentWorkspace } = useAuth();
  const { budgets, categories, createBudget, updateBudget, deleteBudget } = useFinance();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBudgetForEdit, setSelectedBudgetForEdit] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [alertThreshold, setAlertThreshold] = useState('85');
  const [period, setPeriod] = useState<'monthly' | 'weekly' | 'custom'>('monthly');

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountMinor = toMinorUnits(parseFloat(amount));
    const selectedCat = categories.find((c) => c.id === categoryId);

    const now = new Date('2026-11-01T23:00:00Z');
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

    if (selectedBudgetForEdit) {
      await updateBudget(selectedBudgetForEdit, {
        name,
        categoryId,
        categoryName: selectedCat?.name,
        amount: amountMinor,
        alertThreshold: parseInt(alertThreshold, 10),
      });
    } else {
      await createBudget({
        name,
        categoryId,
        categoryName: selectedCat?.name,
        amount: amountMinor,
        currency: currentWorkspace.defaultCurrency,
        period,
        startDate,
        endDate,
        alertThreshold: parseInt(alertThreshold, 10),
        status: 'active',
      });
    }

    setShowAddModal(false);
    setSelectedBudgetForEdit(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Budget Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Establish category spending caps and receive proactive threshold warnings.
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => {
              setSelectedBudgetForEdit(null);
              setName('');
              setAmount('');
              setCategoryId(categories[0]?.id || '');
              setAlertThreshold('85');
              setShowAddModal(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1.5" /> Create Budget
          </Button>
        </div>

        {/* Budgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {budgets.map((b) => {
            const percent = Math.min(100, Math.round((b.spent / b.amount) * 100));
            const isExceeded = b.spent > b.amount;
            const isWarning = percent >= b.alertThreshold && !isExceeded;
            const remaining = Math.max(0, b.amount - b.spent);

            return (
              <Card key={b.id} className="relative flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {b.name}
                      </h3>
                      <span className="text-[11px] text-slate-400">{b.categoryName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedBudgetForEdit(b.id);
                          setName(b.name);
                          setCategoryId(b.categoryId);
                          setAmount((b.amount / 100).toString());
                          setAlertThreshold(b.alertThreshold.toString());
                          setShowAddModal(true);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title="Edit"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteBudget(b.id)}
                        className="p-1 text-slate-400 hover:text-rose-500"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Status Banner */}
                  <div className="mt-4 mb-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Current Spend</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isExceeded
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                          : isWarning
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                      }`}
                    >
                      {isExceeded ? (
                        <>
                          <AlertTriangle className="h-3 w-3" /> Exceeded ({percent}%)
                        </>
                      ) : (
                        `${percent}% used`
                      )}
                    </span>
                  </div>

                  <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
                    {formatCurrency(b.spent, b.currency)}
                    <span className="text-xs font-normal text-slate-400 ml-1.5">
                      of {formatCurrency(b.amount, b.currency)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-3">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isExceeded ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>Remaining</span>
                  <span
                    className={`font-semibold tabular-nums ${
                      isExceeded ? 'text-rose-600' : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {isExceeded ? '-' : ''}
                    {formatCurrency(remaining, b.currency)}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Create / Edit Budget Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={selectedBudgetForEdit ? 'Edit Budget' : 'Create Budget Cap'}
        description="Set spending parameters and notification limits for this category."
      >
        <form onSubmit={handleSaveBudget} className="space-y-4">
          <Input
            label="Budget Name"
            placeholder="e.g. Monthly Cloud Infrastructure, Office Dining"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
                .filter((c) => c.type === 'expense')
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label={`Allocated Budget (${currentWorkspace.defaultCurrency})`}
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <Input
              label="Alert Threshold (%)"
              type="number"
              min="50"
              max="100"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(e.target.value)}
              required
            />
          </div>

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
              {selectedBudgetForEdit ? 'Update Budget' : 'Save Budget'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
