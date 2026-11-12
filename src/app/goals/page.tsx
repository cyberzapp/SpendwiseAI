'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency, toMinorUnits } from '@/lib/currency';
import { formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Plus, Target, Trash2, ArrowRight, ShieldCheck, Server, FileText } from 'lucide-react';

export default function GoalsPage() {
  const { currentWorkspace } = useAuth();
  const { goals, accounts, createGoal, contributeToGoal, deleteGoal } = useFinance();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  // New Goal Form
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [targetDate, setTargetDate] = useState('2027-03-31');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#10B981');

  // Contribute Form
  const [contributeAmount, setContributeAmount] = useState('');
  const [fromAccountId, setFromAccountId] = useState(accounts[0]?.id || '');

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetMinor = toMinorUnits(parseFloat(targetAmount));
    const currentMinor = toMinorUnits(parseFloat(currentAmount || '0'));

    await createGoal({
      name,
      targetAmount: targetMinor,
      currentAmount: currentMinor,
      targetDate: new Date(targetDate).toISOString(),
      description,
      color,
    });

    setName('');
    setTargetAmount('');
    setDescription('');
    setShowAddModal(false);
  };

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalId || !contributeAmount) return;

    const amountMinor = toMinorUnits(parseFloat(contributeAmount));
    await contributeToGoal(selectedGoalId, amountMinor, fromAccountId);

    setContributeAmount('');
    setShowContributeModal(false);
    setSelectedGoalId(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Financial Goals & Reserves
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Track multi-month runway reserves, equipment acquisition funds, and tax reserves.
            </p>
          </div>

          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Create Financial Goal
          </Button>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map((g) => {
            const percent = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
            const remaining = Math.max(0, g.targetAmount - g.currentAmount);

            return (
              <Card key={g.id} className="relative flex flex-col justify-between p-5">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="h-9 w-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                        style={{ backgroundColor: g.color }}
                      >
                        <Target className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {g.name}
                        </h3>
                        <p className="text-[10px] text-slate-400">
                          Target by: {formatDate(g.targetDate)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteGoal(g.id)}
                      className="p-1 text-slate-400 hover:text-rose-500"
                      title="Delete Goal"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {g.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {g.description}
                    </p>
                  )}

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500 dark:text-slate-400">Accumulated</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {percent}%
                      </span>
                    </div>
                    <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
                      {formatCurrency(g.currentAmount, currentWorkspace.defaultCurrency)}
                      <span className="text-xs font-normal text-slate-400 ml-1.5">
                        of {formatCurrency(g.targetAmount, currentWorkspace.defaultCurrency)}
                      </span>
                    </div>

                    <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-3">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${percent}%`, backgroundColor: g.color }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Remaining: {formatCurrency(remaining, currentWorkspace.defaultCurrency)}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs px-2.5"
                    onClick={() => {
                      setSelectedGoalId(g.id);
                      setShowContributeModal(true);
                    }}
                  >
                    Add Contribution
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Create Goal Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Establish Financial Goal"
        description="Target an earmarked treasury reserve or capital expenditure."
      >
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <Input
            label="Goal Name"
            placeholder="e.g. 6-Month Emergency Runway, New GPU Rig"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label={`Target Amount (${currentWorkspace.defaultCurrency})`}
              type="number"
              step="0.01"
              placeholder="0.00"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
            />
            <Input
              label={`Current Progress (${currentWorkspace.defaultCurrency})`}
              type="number"
              step="0.01"
              placeholder="0.00"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
            />
          </div>

          <Input
            label="Target Completion Date"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            required
          />

          <Input
            label="Strategic Purpose / Description"
            placeholder="e.g. Safe liquid reserve for operational continuity."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Badge Color
            </label>
            <div className="flex items-center gap-3">
              {['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-7 w-7 rounded-full border-2 transition-all ${
                    color === c ? 'border-slate-900 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
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
              Save Goal
            </Button>
          </div>
        </form>
      </Modal>

      {/* Contribute to Goal Modal */}
      <Modal
        isOpen={showContributeModal}
        onClose={() => setShowContributeModal(false)}
        title="Contribute to Reserve Goal"
        description="Allocate funds from an existing depository account."
      >
        <form onSubmit={handleContribute} className="space-y-4">
          <Input
            label={`Contribution Amount (${currentWorkspace.defaultCurrency})`}
            type="number"
            step="0.01"
            placeholder="0.00"
            value={contributeAmount}
            onChange={(e) => setContributeAmount(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Fund From Account
            </label>
            <select
              value={fromAccountId}
              onChange={(e) => setFromAccountId(e.target.value)}
              className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({formatCurrency(a.currentBalance, a.currency)})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowContributeModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Confirm Contribution
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
