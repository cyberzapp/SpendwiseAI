'use client';

import React, { useState } from 'react';
import { Search, Bell, Plus, Check, Trash2, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useFinance } from '@/context/FinanceContext';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';

export function Header() {
  const { profile, currentWorkspace } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotification, createTransaction, accounts, categories } = useFinance();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickTxModal, setShowQuickTxModal] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');

  // Quick transaction form state
  const [txType, setTxType] = useState<'expense' | 'income' | 'transfer'>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [toAccountId, setToAccountId] = useState(accounts[1]?.id || '');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    const parsedAmount = Math.round(parseFloat(amount) * 100);
    const selectedCat = categories.find((c) => c.id === categoryId);
    const selectedAcc = accounts.find((a) => a.id === accountId);
    const selectedToAcc = accounts.find((a) => a.id === toAccountId);

    await createTransaction({
      title,
      amount: parsedAmount,
      currency: currentWorkspace.defaultCurrency,
      type: txType,
      categoryId,
      categoryName: selectedCat?.name,
      accountId,
      accountName: selectedAcc?.name,
      toAccountId: txType === 'transfer' ? toAccountId : undefined,
      toAccountName: txType === 'transfer' ? selectedToAcc?.name : undefined,
      transactionDate: new Date().toISOString(),
    });

    setTitle('');
    setAmount('');
    setShowQuickTxModal(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
        {/* Left: Search input */}
        <div className="flex items-center gap-3 w-72 lg:w-96 pl-10 lg:pl-0">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search transactions, accounts, budgets..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/80 pl-9 pr-4 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Right Actions: Quick Add, Notification, User Pill */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={() => setShowQuickTxModal(true)}
            className="flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Transaction</span>
          </Button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Notifications
                    </h4>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 py-1">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No notifications at this time
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        className={`p-2.5 flex items-start justify-between gap-3 rounded-lg transition-colors ${
                          !item.read ? 'bg-slate-50 dark:bg-slate-800/40' : ''
                        }`}
                      >
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {item.message}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {formatRelativeTime(item.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {!item.read && (
                            <button
                              onClick={() => markNotificationRead(item.id)}
                              className="p-1 text-slate-400 hover:text-emerald-600"
                              title="Mark read"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => clearNotification(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Quick Add Transaction Modal */}
      <Modal
        isOpen={showQuickTxModal}
        onClose={() => setShowQuickTxModal(false)}
        title="Add New Transaction"
        description="Quickly record income, expense or account transfers."
      >
        <form onSubmit={handleQuickAdd} className="space-y-4">
          {/* Type Toggle */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {(['expense', 'income', 'transfer'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTxType(t)}
                className={`py-1.5 text-xs font-semibold capitalize rounded-md transition-all ${
                  txType === t
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-950 dark:text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <Input
            label="Transaction Title"
            placeholder="e.g. AWS Cloud Hosting, Client Retainer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label={`Amount (${currentWorkspace.defaultCurrency})`}
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {txType === 'transfer' ? 'From Account' : 'Account'}
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {txType === 'transfer' ? (
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  To Destination Account
                </label>
                <select
                  value={toAccountId}
                  onChange={(e) => setToAccountId(e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
                  {accounts
                    .filter((a) => a.id !== accountId)
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
                  {categories
                    .filter((c) => (txType === 'income' ? c.type === 'income' : c.type === 'expense'))
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowQuickTxModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Transaction
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
