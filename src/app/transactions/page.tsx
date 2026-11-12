'use client';

import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency, toMinorUnits } from '@/lib/currency';
import { formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import {
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Trash2,
  Edit2,
  FileText,
  AlertCircle,
  Paperclip,
} from 'lucide-react';
import Papa from 'papaparse';

export default function TransactionsPage() {
  const { currentWorkspace } = useAuth();
  const { transactions, accounts, categories, createTransaction, updateTransaction, deleteTransaction, bulkImportTransactions } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense' | 'transfer'>('all');
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedTxForEdit, setSelectedTxForEdit] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense' | 'transfer',
    accountId: accounts[0]?.id || '',
    toAccountId: accounts[1]?.id || '',
    categoryId: categories[0]?.id || '',
    transactionDate: '2026-11-01',
    merchant: '',
    notes: '',
  });

  // CSV Import state
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Filtered & Sorted Transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesSearch =
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.merchant?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'all' || t.type === typeFilter;
        const matchesAccount = accountFilter === 'all' || t.accountId === accountFilter;
        const matchesCategory = categoryFilter === 'all' || t.categoryId === categoryFilter;

        return matchesSearch && matchesType && matchesAccount && matchesCategory;
      })
      .sort((a, b) => {
        if (sortField === 'date') {
          const diff = new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime();
          return sortOrder === 'desc' ? diff : -diff;
        } else {
          return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
        }
      });
  }, [transactions, searchQuery, typeFilter, accountFilter, categoryFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // CSV Export
  const handleExportCSV = () => {
    const dataToExport = filteredTransactions.map((t) => ({
      ID: t.id,
      Date: t.transactionDate,
      Title: t.title,
      Type: t.type,
      Category: t.categoryName || '',
      Account: t.accountName || '',
      Amount: t.amount / 100,
      Currency: t.currency,
      Merchant: t.merchant || '',
      Notes: t.notes || '',
    }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Spendwise_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvPreview(results.data.slice(0, 5));
        setImportStatus(`Parsed ${results.data.length} rows. Ready to review and import.`);
      },
      error: (error) => {
        setImportStatus(`CSV parse error: ${error.message}`);
      },
    });
  };

  const handleConfirmImport = async () => {
    if (csvPreview.length === 0) return;
    
    // Map preview or loaded items to transactions
    const toImport = csvPreview.map((row) => ({
      title: row.Title || row.title || 'Imported Transaction',
      amount: toMinorUnits(parseFloat(row.Amount || row.amount || '0')),
      currency: currentWorkspace.defaultCurrency,
      type: (row.Type?.toLowerCase() === 'income' ? 'income' : 'expense') as 'income' | 'expense',
      accountId: accounts[0]?.id || 'acc_default',
      accountName: accounts[0]?.name || 'Primary Account',
      categoryId: categories[0]?.id || 'cat_default',
      categoryName: categories[0]?.name || 'General',
      transactionDate: row.Date || new Date().toISOString(),
      merchant: row.Merchant || '',
    }));

    await bulkImportTransactions(toImport);
    setImportStatus(`Successfully imported ${toImport.length} transactions.`);
    setTimeout(() => {
      setShowImportModal(false);
      setCsvPreview([]);
      setImportStatus(null);
    }, 1200);
  };

  // Save Transaction
  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountMinor = toMinorUnits(parseFloat(formData.amount));
    const selectedCat = categories.find((c) => c.id === formData.categoryId);
    const selectedAcc = accounts.find((a) => a.id === formData.accountId);
    const selectedToAcc = accounts.find((a) => a.id === formData.toAccountId);

    if (selectedTxForEdit) {
      await updateTransaction(selectedTxForEdit, {
        title: formData.title,
        description: formData.description,
        amount: amountMinor,
        type: formData.type,
        accountId: formData.accountId,
        accountName: selectedAcc?.name,
        toAccountId: formData.type === 'transfer' ? formData.toAccountId : undefined,
        toAccountName: formData.type === 'transfer' ? selectedToAcc?.name : undefined,
        categoryId: formData.categoryId,
        categoryName: selectedCat?.name,
        transactionDate: new Date(formData.transactionDate).toISOString(),
        merchant: formData.merchant,
        notes: formData.notes,
      });
    } else {
      await createTransaction({
        title: formData.title,
        description: formData.description,
        amount: amountMinor,
        currency: currentWorkspace.defaultCurrency,
        type: formData.type,
        accountId: formData.accountId,
        accountName: selectedAcc?.name,
        toAccountId: formData.type === 'transfer' ? formData.toAccountId : undefined,
        toAccountName: formData.type === 'transfer' ? selectedToAcc?.name : undefined,
        categoryId: formData.categoryId,
        categoryName: selectedCat?.name,
        transactionDate: new Date(formData.transactionDate).toISOString(),
        merchant: formData.merchant,
        notes: formData.notes,
      });
    }

    setShowAddModal(false);
    setSelectedTxForEdit(null);
  };

  const handleEditClick = (t: any) => {
    setSelectedTxForEdit(t.id);
    setFormData({
      title: t.title,
      description: t.description || '',
      amount: (t.amount / 100).toString(),
      type: t.type,
      accountId: t.accountId,
      toAccountId: t.toAccountId || accounts[1]?.id || '',
      categoryId: t.categoryId,
      transactionDate: t.transactionDate.split('T')[0],
      merchant: t.merchant || '',
      notes: t.notes || '',
    });
    setShowAddModal(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Transactions Ledger
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Complete historical record of incoming revenues, business disbursements, and transfers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowImportModal(true)}>
              <Upload className="h-4 w-4 mr-1.5" /> Import CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-1.5" /> Export CSV
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setSelectedTxForEdit(null);
                setFormData({
                  title: '',
                  description: '',
                  amount: '',
                  type: 'expense',
                  accountId: accounts[0]?.id || '',
                  toAccountId: accounts[1]?.id || '',
                  categoryId: categories[0]?.id || '',
                  transactionDate: '2026-11-01',
                  merchant: '',
                  notes: '',
                });
                setShowAddModal(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1.5" /> Add Transaction
            </Button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <Card className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, merchant, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={(e: any) => setTypeFilter(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>

            {/* Account Filter */}
            <div>
              <select
                value={accountFilter}
                onChange={(e) => setAccountFilter(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="all">All Accounts</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Transactions Table */}
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Transaction / Entity</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Account</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {paginatedTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No transactions match your active filters.
                    </td>
                  </tr>
                ) : (
                  paginatedTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
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
                              <FileText className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100">
                              {tx.title}
                            </div>
                            {tx.merchant && (
                              <div className="text-[10px] text-slate-400">
                                Merchant: {tx.merchant}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                        {formatDate(tx.transactionDate)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                          {tx.categoryName || 'General'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                        {tx.type === 'transfer'
                          ? `${tx.accountName} ➔ ${tx.toAccountName}`
                          : tx.accountName}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span
                          className={`font-bold tabular-nums text-sm ${
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
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleEditClick(tx)}
                            className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteTransaction(tx.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination bar */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            <div>
              Showing {filteredTransactions.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
              {Math.min(currentPage * pageSize, filteredTransactions.length)} of {filteredTransactions.length} entries
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="px-2 font-medium">
                {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Add / Edit Transaction Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={selectedTxForEdit ? 'Edit Transaction' : 'Record Transaction'}
        description="Specify amount, category and accounts to update financial ledgers."
      >
        <form onSubmit={handleSaveTransaction} className="space-y-4">
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {(['expense', 'income', 'transfer'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData({ ...formData, type: t })}
                className={`py-1.5 text-xs font-semibold capitalize rounded-md transition-all ${
                  formData.type === t
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-950 dark:text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <Input
            label="Title"
            placeholder="e.g. AWS Invoice, Stripe Settlement"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label={`Amount (${currentWorkspace.defaultCurrency})`}
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
            <Input
              label="Transaction Date"
              type="date"
              value={formData.transactionDate}
              onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {formData.type === 'transfer' ? 'From Source Account' : 'Account'}
              </label>
              <select
                value={formData.accountId}
                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {formData.type === 'transfer' ? (
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  To Destination Account
                </label>
                <select
                  value={formData.toAccountId}
                  onChange={(e) => setFormData({ ...formData, toAccountId: e.target.value })}
                  className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
                  {accounts
                    .filter((a) => a.id !== formData.accountId)
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
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
                  {categories
                    .filter((c) =>
                      formData.type === 'income' ? c.type === 'income' : c.type === 'expense'
                    )
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>

          <Input
            label="Merchant / Recipient"
            placeholder="e.g. Apple Inc, Google Cloud India"
            value={formData.merchant}
            onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
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
              {selectedTxForEdit ? 'Update Transaction' : 'Save Transaction'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* CSV Import Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Import Transactions via CSV"
        description="Upload a CSV export from your bank, credit card, or accounting tool."
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center">
            <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Drag and drop your file here, or click to browse
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="mt-3 block w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            />
          </div>

          {importStatus && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 rounded-lg">
              {importStatus}
            </div>
          )}

          {csvPreview.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Preview ({csvPreview.length} sample rows)
              </h5>
              <div className="max-h-40 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-[11px] bg-slate-50 dark:bg-slate-900">
                <pre>{JSON.stringify(csvPreview, null, 2)}</pre>
              </div>
              <Button size="sm" className="w-full mt-2" onClick={handleConfirmImport}>
                Confirm and Process Import
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </DashboardLayout>
  );
}
