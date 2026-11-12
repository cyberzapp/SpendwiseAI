'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useFinance } from '@/context/FinanceContext';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Plus, Trash2, Tag, Utensils, ShoppingBag, Car, Home, Zap, HeartPulse, Film, GraduationCap, Plane, CreditCard, Briefcase, Wallet, Laptop, TrendingUp, PieChart, Percent, PlusCircle } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Utensils,
  ShoppingBag,
  Car,
  Home,
  Zap,
  HeartPulse,
  Film,
  GraduationCap,
  Plane,
  CreditCard,
  Briefcase,
  Wallet,
  Laptop,
  TrendingUp,
  PieChart,
  Percent,
  PlusCircle,
};

export default function CategoriesPage() {
  const { categories, transactions, createCategory, deleteCategory } = useFinance();
  const [showAddModal, setShowAddModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [color, setColor] = useState('#10B981');
  const [icon, setIcon] = useState('Tag');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCategory({
      name,
      type,
      color,
      icon,
    });
    setName('');
    setShowAddModal(false);
  };

  const handleDelete = async (id: string) => {
    try {
      setErrorMsg(null);
      await deleteCategory(id);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error deleting category');
    }
  };

  const expenseCats = categories.filter((c) => c.type === 'expense');
  const incomeCats = categories.filter((c) => c.type === 'income');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Categories & Taxonomy
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Classify income streams and operational cost centers.
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => {
              setErrorMsg(null);
              setShowAddModal(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1.5" /> New Category
          </Button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg dark:bg-rose-950/50 dark:border-rose-900 dark:text-rose-300">
            {errorMsg}
          </div>
        )}

        {/* Expense Categories */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs">
            Expense Categories ({expenseCats.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {expenseCats.map((cat) => {
              const IconComp = ICON_MAP[cat.icon] || Tag;
              const count = transactions.filter((t) => t.categoryId === cat.id).length;

              return (
                <Card key={cat.id} className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: cat.color }}
                    >
                      <IconComp className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {cat.name}
                      </p>
                      <p className="text-[10px] text-slate-400">{count} transactions</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Income Categories */}
        <div className="space-y-3 pt-4">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs">
            Income Categories ({incomeCats.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {incomeCats.map((cat) => {
              const IconComp = ICON_MAP[cat.icon] || Tag;
              const count = transactions.filter((t) => t.categoryId === cat.id).length;

              return (
                <Card key={cat.id} className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: cat.color }}
                    >
                      <IconComp className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {cat.name}
                      </p>
                      <p className="text-[10px] text-slate-400">{count} transactions</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Financial Category"
        description="Create a specialized classification for expenditures or revenue."
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
            label="Category Name"
            placeholder="e.g. Legal Fees, Affiliate Marketing"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Category Color
            </label>
            <div className="flex items-center gap-3">
              {['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'].map((c) => (
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
              Create Category
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
