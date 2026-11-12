'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency, toMinorUnits } from '@/lib/currency';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import {
  Building2,
  PiggyBank,
  CreditCard,
  Banknote,
  Plus,
  ArrowRightLeft,
  Trash2,
  Edit2,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { AccountType } from '@/types';

export default function AccountsPage() {
  const { currentWorkspace } = useAuth();
  const { accounts, transactions, createAccount, updateAccount, deleteAccount, createTransaction } = useFinance();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedAccForEdit, setSelectedAccForEdit] = useState<string | null>(null);

  // New/Edit Account Form
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('bank_account');
  const [institutionName, setInstitutionName] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');
  const [color, setColor] = useState('#10B981');

  // Transfer Form
  const [transferAmount, setTransferAmount] = useState('');
  const [fromAccId, setFromAccId] = useState(accounts[0]?.id || '');
  const [toAccId, setToAccId] = useState(accounts[1]?.id || '');
  const [transferNotes, setTransferNotes] = useState('');

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const balanceMinor = toMinorUnits(parseFloat(openingBalance || '0'));

    if (selectedAccForEdit) {
      await updateAccount(selectedAccForEdit, {
        name,
        type,
        institutionName,
        color,
      });
    } else {
      await createAccount({
        name,
        type,
        institutionName,
        currency: currentWorkspace.defaultCurrency,
        openingBalance: balanceMinor,
        color,
        status: 'active',
      });
    }

    setShowAddModal(false);
    setSelectedAccForEdit(null);
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferAmount || fromAccId === toAccId) return;

    const amountMinor = toMinorUnits(parseFloat(transferAmount));
    const fromAcc = accounts.find((a) => a.id === fromAccId);
    const toAcc = accounts.find((a) => a.id === toAccId);

    await createTransaction({
      title: `Transfer: ${fromAcc?.name} ➔ ${toAcc?.name}`,
      description: transferNotes || 'Internal treasury transfer',
      amount: amountMinor,
      currency: currentWorkspace.defaultCurrency,
      type: 'transfer',
      categoryId: 'cat_biz',
      accountId: fromAccId,
      accountName: fromAcc?.name,
      toAccountId: toAccId,
      toAccountName: toAcc?.name,
      transactionDate: new Date().toISOString(),
      tags: ['inter-account-transfer'],
    });

    setTransferAmount('');
    setShowTransferModal(false);
  };

  const getAccountIcon = (accType: AccountType) => {
    switch (accType) {
      case 'bank_account':
        return <Building2 className="h-5 w-5" />;
      case 'savings':
        return <PiggyBank className="h-5 w-5" />;
      case 'credit_card':
        return <CreditCard className="h-5 w-5" />;
      case 'cash':
        return <Banknote className="h-5 w-5" />;
      default:
        return <Building2 className="h-5 w-5" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Financial Accounts
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Bank accounts, credit lines, corporate savings, and liquid cash holdings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFromAccId(accounts[0]?.id || '');
                setToAccId(accounts[1]?.id || '');
                setShowTransferModal(true);
              }}
            >
              <ArrowRightLeft className="h-4 w-4 mr-1.5" /> Transfer Between Accounts
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setSelectedAccForEdit(null);
                setName('');
                setInstitutionName('');
                setOpeningBalance('0');
                setType('bank_account');
                setColor('#10B981');
                setShowAddModal(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1.5" /> New Account
            </Button>
          </div>
        </div>

        {/* Accounts Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {accounts.map((acc) => {
            const txCount = transactions.filter(
              (t) => t.accountId === acc.id || t.toAccountId === acc.id
            ).length;

            return (
              <Card
                key={acc.id}
                className="relative overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: acc.color }}
                />

                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div
                      className="p-2.5 rounded-xl text-white shadow-xs"
                      style={{ backgroundColor: acc.color }}
                    >
                      {getAccountIcon(acc.type)}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedAccForEdit(acc.id);
                          setName(acc.name);
                          setInstitutionName(acc.institutionName || '');
                          setOpeningBalance((acc.openingBalance / 100).toString());
                          setType(acc.type);
                          setColor(acc.color);
                          setShowAddModal(true);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title="Edit"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteAccount(acc.id)}
                        className="p-1 text-slate-400 hover:text-rose-500"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {acc.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {acc.institutionName || 'General Account'}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400">Current Balance</span>
                    <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
                      {formatCurrency(acc.currentBalance, acc.currency)}
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="capitalize">{acc.type.replace('_', ' ')}</span>
                  <span>{txCount} transactions</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Transfers & Reconciliation Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Account Reconciliation Protocol</CardTitle>
            <CardDescription>
              Spendwise AI calculates ledger balances via opening balance + non-transfer revenues - expenses. Internal transfers adjust dual accounts atomically without modifying overall net equity.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Account Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={selectedAccForEdit ? 'Edit Financial Account' : 'Create Financial Account'}
        description="Add a depository account, credit line, or wallet to your workspace."
      >
        <form onSubmit={handleSaveAccount} className="space-y-4">
          <Input
            label="Account Name"
            placeholder="e.g. HDFC Salary Account, Cash Box"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Account Type
              </label>
              <select
                value={type}
                onChange={(e: any) => setType(e.target.value)}
                className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="bank_account">Bank Account</option>
                <option value="savings">Savings Account</option>
                <option value="credit_card">Credit Card</option>
                <option value="cash">Cash / Petty Cash</option>
                <option value="wallet">Digital Wallet</option>
                <option value="other">Other</option>
              </select>
            </div>

            <Input
              label="Institution Name"
              placeholder="e.g. HDFC Bank, ICICI Bank"
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
            />
          </div>

          {!selectedAccForEdit && (
            <Input
              label={`Opening Balance (${currentWorkspace.defaultCurrency})`}
              type="number"
              step="0.01"
              placeholder="0.00"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
              required
            />
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Accent Color
            </label>
            <div className="flex items-center gap-3">
              {['#10B981', '#004c8f', '#f37021', '#002663', '#8B5CF6', '#EC4899'].map((c) => (
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
              {selectedAccForEdit ? 'Update Account' : 'Create Account'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Transfer Modal */}
      <Modal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        title="Transfer Funds Between Accounts"
        description="Atomically move funds between internal workspace accounts."
      >
        <form onSubmit={handleTransfer} className="space-y-4">
          <Input
            label={`Transfer Amount (${currentWorkspace.defaultCurrency})`}
            type="number"
            step="0.01"
            placeholder="0.00"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                From Source Account
              </label>
              <select
                value={fromAccId}
                onChange={(e) => setFromAccId(e.target.value)}
                className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({formatCurrency(a.currentBalance, a.currency)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                To Destination Account
              </label>
              <select
                value={toAccId}
                onChange={(e) => setToAccId(e.target.value)}
                className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                {accounts
                  .filter((a) => a.id !== fromAccId)
                  .map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({formatCurrency(a.currentBalance, a.currency)})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <Input
            label="Notes / Reason"
            placeholder="e.g. Replenish operating account, tax earmarking"
            value={transferNotes}
            onChange={(e) => setTransferNotes(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowTransferModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Execute Transfer
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
