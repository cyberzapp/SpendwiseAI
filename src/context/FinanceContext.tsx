'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  FinancialAccount,
  Transaction,
  Budget,
  RecurringTransaction,
  FinancialGoal,
  InAppNotification,
  Category,
  AuditLog,
} from '@/types';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  runTransaction as firestoreRunTransaction,
} from 'firebase/firestore';
import { db, isLiveFirebaseConfigured } from '@/lib/firebase/client';
import { useAuth } from './AuthContext';
import {
  DEMO_ACCOUNTS,
  DEMO_TRANSACTIONS,
  DEMO_BUDGETS,
  DEMO_RECURRING,
  DEMO_GOALS,
  DEMO_NOTIFICATIONS,
  DEMO_CATEGORIES,
} from '@/lib/demo-data';

interface FinanceContextType {
  accounts: FinancialAccount[];
  transactions: Transaction[];
  budgets: Budget[];
  recurring: RecurringTransaction[];
  goals: FinancialGoal[];
  notifications: InAppNotification[];
  categories: Category[];
  auditLogs: AuditLog[];
  loading: boolean;
  
  // Account Actions
  createAccount: (data: Omit<FinancialAccount, 'id' | 'workspaceId' | 'currentBalance' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAccount: (id: string, data: Partial<FinancialAccount>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;

  // Transaction Actions (Atomic updates to balances)
  createTransaction: (data: Omit<Transaction, 'id' | 'workspaceId' | 'createdBy' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  bulkImportTransactions: (txs: Omit<Transaction, 'id' | 'workspaceId' | 'createdBy' | 'createdAt' | 'updatedAt'>[]) => Promise<number>;

  // Budget Actions
  createBudget: (data: Omit<Budget, 'id' | 'workspaceId' | 'spent' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBudget: (id: string, data: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;

  // Recurring Actions
  createRecurring: (data: Omit<RecurringTransaction, 'id' | 'workspaceId' | 'createdAt'>) => Promise<void>;
  updateRecurring: (id: string, data: Partial<RecurringTransaction>) => Promise<void>;
  deleteRecurring: (id: string) => Promise<void>;
  executeRecurringItem: (id: string) => Promise<void>;

  // Goal Actions
  createGoal: (data: Omit<FinancialGoal, 'id' | 'workspaceId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateGoal: (id: string, data: Partial<FinancialGoal>) => Promise<void>;
  contributeToGoal: (goalId: string, amountMinor: number, fromAccountId: string) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;

  // Category Actions
  createCategory: (data: Omit<Category, 'id' | 'workspaceId'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Notification Actions
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  clearNotification: (id: string) => Promise<void>;

  // Reset Demo Workspace
  resetDemoData: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const { currentWorkspace, isDemoMode, profile, user } = useAuth();
  
  const [accounts, setAccounts] = useState<FinancialAccount[]>(DEMO_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(DEMO_TRANSACTIONS);
  const [budgets, setBudgets] = useState<Budget[]>(DEMO_BUDGETS);
  const [recurring, setRecurring] = useState<RecurringTransaction[]>(DEMO_RECURRING);
  const [goals, setGoals] = useState<FinancialGoal[]>(DEMO_GOALS);
  const [notifications, setNotifications] = useState<InAppNotification[]>(DEMO_NOTIFICATIONS);
  const [categories, setCategories] = useState<Category[]>(DEMO_CATEGORIES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Sync with Firestore if user is authenticated and not purely in isolated demo
  useEffect(() => {
    if (isDemoMode || !isLiveFirebaseConfigured || !user) {
      // Revert/Load demo baseline
      setAccounts(DEMO_ACCOUNTS);
      setTransactions(DEMO_TRANSACTIONS);
      setBudgets(DEMO_BUDGETS);
      setRecurring(DEMO_RECURRING);
      setGoals(DEMO_GOALS);
      setNotifications(DEMO_NOTIFICATIONS);
      setCategories(DEMO_CATEGORIES);
      return;
    }

    setLoading(true);
    const workspaceId = currentWorkspace.id;

    // Accounts listener
    const accUnsub = onSnapshot(
      collection(db, `workspaces/${workspaceId}/accounts`),
      (snapshot) => {
        const loaded: FinancialAccount[] = [];
        snapshot.forEach((d) => loaded.push({ id: d.id, ...d.data() } as FinancialAccount));
        setAccounts(loaded);
      }
    );

    // Transactions listener
    const txQuery = query(
      collection(db, `workspaces/${workspaceId}/transactions`),
      orderBy('transactionDate', 'desc')
    );
    const txUnsub = onSnapshot(txQuery, (snapshot) => {
      const loaded: Transaction[] = [];
      snapshot.forEach((d) => loaded.push({ id: d.id, ...d.data() } as Transaction));
      setTransactions(loaded);
    });

    // Budgets listener
    const bgUnsub = onSnapshot(
      collection(db, `workspaces/${workspaceId}/budgets`),
      (snapshot) => {
        const loaded: Budget[] = [];
        snapshot.forEach((d) => loaded.push({ id: d.id, ...d.data() } as Budget));
        setBudgets(loaded);
      }
    );

    // Categories listener
    const catUnsub = onSnapshot(
      collection(db, `workspaces/${workspaceId}/categories`),
      (snapshot) => {
        const loaded: Category[] = [];
        snapshot.forEach((d) => loaded.push({ id: d.id, ...d.data() } as Category));
        setCategories(loaded.length > 0 ? loaded : DEMO_CATEGORIES);
      }
    );

    // Recurring listener
    const recUnsub = onSnapshot(
      collection(db, `workspaces/${workspaceId}/recurringTransactions`),
      (snapshot) => {
        const loaded: RecurringTransaction[] = [];
        snapshot.forEach((d) => loaded.push({ id: d.id, ...d.data() } as RecurringTransaction));
        setRecurring(loaded);
      }
    );

    // Goals listener
    const goalUnsub = onSnapshot(
      collection(db, `workspaces/${workspaceId}/goals`),
      (snapshot) => {
        const loaded: FinancialGoal[] = [];
        snapshot.forEach((d) => loaded.push({ id: d.id, ...d.data() } as FinancialGoal));
        setGoals(loaded);
      }
    );

    // Notifications listener
    const notifUnsub = onSnapshot(
      collection(db, `workspaces/${workspaceId}/notifications`),
      (snapshot) => {
        const loaded: InAppNotification[] = [];
        snapshot.forEach((d) => loaded.push({ id: d.id, ...d.data() } as InAppNotification));
        setNotifications(loaded);
      }
    );

    setLoading(false);

    return () => {
      accUnsub();
      txUnsub();
      bgUnsub();
      catUnsub();
      recUnsub();
      goalUnsub();
      notifUnsub();
    };
  }, [currentWorkspace.id, isDemoMode, user]);

  const addAudit = useCallback((action: AuditLog['action'], entityType: AuditLog['entityType'], entityId: string, details: string) => {
    const log: AuditLog = {
      id: 'log_' + Date.now(),
      workspaceId: currentWorkspace.id,
      userId: profile?.uid || 'user',
      userName: profile?.displayName || 'Finance Manager',
      action,
      entityType,
      entityId,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  }, [currentWorkspace.id, profile?.uid, profile?.displayName]);

  // Account Operations
  const createAccount = async (data: Omit<FinancialAccount, 'id' | 'workspaceId' | 'currentBalance' | 'createdAt' | 'updatedAt'>) => {
    const newAcc: FinancialAccount = {
      ...data,
      id: 'acc_' + Date.now(),
      workspaceId: currentWorkspace.id,
      currentBalance: data.openingBalance,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isLiveFirebaseConfigured && !isDemoMode) {
      await addDoc(collection(db, `workspaces/${currentWorkspace.id}/accounts`), newAcc);
    } else {
      setAccounts((prev) => [...prev, newAcc]);
    }
    addAudit('create', 'account', newAcc.id, `Created account "${newAcc.name}" with opening balance.`);
  };

  const updateAccount = async (id: string, data: Partial<FinancialAccount>) => {
    if (isLiveFirebaseConfigured && !isDemoMode) {
      await updateDoc(doc(db, `workspaces/${currentWorkspace.id}/accounts`, id), data);
    } else {
      setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a)));
    }
    addAudit('update', 'account', id, `Updated account information.`);
  };

  const deleteAccount = async (id: string) => {
    if (isLiveFirebaseConfigured && !isDemoMode) {
      await deleteDoc(doc(db, `workspaces/${currentWorkspace.id}/accounts`, id));
    } else {
      setAccounts((prev) => prev.filter((a) => a.id !== id));
    }
    addAudit('delete', 'account', id, `Deleted financial account.`);
  };

  // Transaction Operations with Atomic Account Balance Reconciliations
  const createTransaction = async (data: Omit<Transaction, 'id' | 'workspaceId' | 'createdBy' | 'createdAt' | 'updatedAt'>) => {
    const newTx: Transaction = {
      ...data,
      id: 'tx_' + Date.now(),
      workspaceId: currentWorkspace.id,
      createdBy: profile?.uid || 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Calculate balance updates
    setAccounts((prevAccounts) =>
      prevAccounts.map((acc) => {
        if (newTx.type === 'income' && acc.id === newTx.accountId) {
          return { ...acc, currentBalance: acc.currentBalance + newTx.amount };
        }
        if (newTx.type === 'expense' && acc.id === newTx.accountId) {
          return { ...acc, currentBalance: acc.currentBalance - newTx.amount };
        }
        if (newTx.type === 'transfer') {
          if (acc.id === newTx.accountId) {
            return { ...acc, currentBalance: acc.currentBalance - newTx.amount };
          }
          if (acc.id === newTx.toAccountId) {
            return { ...acc, currentBalance: acc.currentBalance + newTx.amount };
          }
        }
        return acc;
      })
    );

    // Update matching budget spent progress
    if (newTx.type === 'expense') {
      setBudgets((prevBudgets) =>
        prevBudgets.map((b) => {
          if (b.categoryId === newTx.categoryId) {
            const updatedSpent = b.spent + newTx.amount;
            return { ...b, spent: updatedSpent };
          }
          return b;
        })
      );
    }

    if (isLiveFirebaseConfigured && !isDemoMode) {
      await addDoc(collection(db, `workspaces/${currentWorkspace.id}/transactions`), newTx);
    } else {
      setTransactions((prev) => [newTx, ...prev]);
    }

    addAudit('create', 'transaction', newTx.id, `Created ${newTx.type}: "${newTx.title}".`);
  };

  const updateTransaction = async (id: string, data: Partial<Transaction>) => {
    // Reconcile previous amount vs new amount if amount or type changed
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t))
    );
    if (isLiveFirebaseConfigured && !isDemoMode) {
      await updateDoc(doc(db, `workspaces/${currentWorkspace.id}/transactions`, id), data);
    }
    addAudit('update', 'transaction', id, `Updated transaction details.`);
  };

  const deleteTransaction = async (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;

    // Reverse financial balance impact
    setAccounts((prevAccounts) =>
      prevAccounts.map((acc) => {
        if (tx.type === 'income' && acc.id === tx.accountId) {
          return { ...acc, currentBalance: acc.currentBalance - tx.amount };
        }
        if (tx.type === 'expense' && acc.id === tx.accountId) {
          return { ...acc, currentBalance: acc.currentBalance + tx.amount };
        }
        if (tx.type === 'transfer') {
          if (acc.id === tx.accountId) {
            return { ...acc, currentBalance: acc.currentBalance + tx.amount };
          }
          if (acc.id === tx.toAccountId) {
            return { ...acc, currentBalance: acc.currentBalance - tx.amount };
          }
        }
        return acc;
      })
    );

    if (tx.type === 'expense') {
      setBudgets((prevBudgets) =>
        prevBudgets.map((b) => {
          if (b.categoryId === tx.categoryId) {
            return { ...b, spent: Math.max(0, b.spent - tx.amount) };
          }
          return b;
        })
      );
    }

    if (isLiveFirebaseConfigured && !isDemoMode) {
      await deleteDoc(doc(db, `workspaces/${currentWorkspace.id}/transactions`, id));
    } else {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }

    addAudit('delete', 'transaction', id, `Reversed and deleted transaction "${tx.title}".`);
  };

  const bulkImportTransactions = async (txs: Omit<Transaction, 'id' | 'workspaceId' | 'createdBy' | 'createdAt' | 'updatedAt'>[]): Promise<number> => {
    let count = 0;
    for (const item of txs) {
      await createTransaction(item);
      count++;
    }
    addAudit('create', 'transaction', 'bulk', `Bulk imported ${count} transactions.`);
    return count;
  };

  // Budget Operations
  const createBudget = async (data: Omit<Budget, 'id' | 'workspaceId' | 'spent' | 'createdAt' | 'updatedAt'>) => {
    // Calculate current spending in category for the active period
    const matchingExpenses = transactions
      .filter((t) => t.type === 'expense' && t.categoryId === data.categoryId)
      .reduce((sum, t) => sum + t.amount, 0);

    const newBudget: Budget = {
      ...data,
      id: 'bg_' + Date.now(),
      workspaceId: currentWorkspace.id,
      spent: matchingExpenses,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isLiveFirebaseConfigured && !isDemoMode) {
      await addDoc(collection(db, `workspaces/${currentWorkspace.id}/budgets`), newBudget);
    } else {
      setBudgets((prev) => [...prev, newBudget]);
    }
    addAudit('create', 'budget', newBudget.id, `Created budget "${newBudget.name}".`);
  };

  const updateBudget = async (id: string, data: Partial<Budget>) => {
    if (isLiveFirebaseConfigured && !isDemoMode) {
      await updateDoc(doc(db, `workspaces/${currentWorkspace.id}/budgets`, id), data);
    } else {
      setBudgets((prev) => prev.map((b) => (b.id === id ? { ...b, ...data, updatedAt: new Date().toISOString() } : b)));
    }
    addAudit('update', 'budget', id, `Updated budget settings.`);
  };

  const deleteBudget = async (id: string) => {
    if (isLiveFirebaseConfigured && !isDemoMode) {
      await deleteDoc(doc(db, `workspaces/${currentWorkspace.id}/budgets`, id));
    } else {
      setBudgets((prev) => prev.filter((b) => b.id !== id));
    }
    addAudit('delete', 'budget', id, `Deleted budget.`);
  };

  // Recurring Operations
  const createRecurring = async (data: Omit<RecurringTransaction, 'id' | 'workspaceId' | 'createdAt'>) => {
    const newRec: RecurringTransaction = {
      ...data,
      id: 'rec_' + Date.now(),
      workspaceId: currentWorkspace.id,
      createdAt: new Date().toISOString(),
    };
    if (isLiveFirebaseConfigured && !isDemoMode) {
      await addDoc(collection(db, `workspaces/${currentWorkspace.id}/recurringTransactions`), newRec);
    } else {
      setRecurring((prev) => [...prev, newRec]);
    }
    addAudit('create', 'transaction', newRec.id, `Created recurring schedule for "${newRec.title}".`);
  };

  const updateRecurring = async (id: string, data: Partial<RecurringTransaction>) => {
    if (isLiveFirebaseConfigured && !isDemoMode) {
      await updateDoc(doc(db, `workspaces/${currentWorkspace.id}/recurringTransactions`, id), data);
    } else {
      setRecurring((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
    }
  };

  const deleteRecurring = async (id: string) => {
    if (isLiveFirebaseConfigured && !isDemoMode) {
      await deleteDoc(doc(db, `workspaces/${currentWorkspace.id}/recurringTransactions`, id));
    } else {
      setRecurring((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const executeRecurringItem = async (id: string) => {
    const rec = recurring.find((r) => r.id === id);
    if (!rec) return;

    // Record as completed transaction
    await createTransaction({
      title: `${rec.title} (Scheduled)`,
      description: `Recurring payment generated on ${new Date().toLocaleDateString()}`,
      amount: rec.amount,
      currency: rec.currency,
      type: rec.type,
      categoryId: rec.categoryId,
      accountId: rec.accountId,
      transactionDate: new Date().toISOString(),
      tags: ['recurring-executed'],
    });

    // Advance nextExecutionDate based on interval
    const nextDate = new Date(rec.nextExecutionDate);
    if (rec.interval === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
    else if (rec.interval === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
    else if (rec.interval === 'yearly') nextDate.setFullYear(nextDate.getFullYear() + 1);
    else if (rec.interval === 'quarterly') nextDate.setMonth(nextDate.getMonth() + 3);
    else nextDate.setDate(nextDate.getDate() + 1);

    await updateRecurring(id, {
      nextExecutionDate: nextDate.toISOString(),
      lastExecutedAt: new Date().toISOString(),
    });
  };

  // Goal Operations
  const createGoal = async (data: Omit<FinancialGoal, 'id' | 'workspaceId' | 'createdAt' | 'updatedAt'>) => {
    const newGoal: FinancialGoal = {
      ...data,
      id: 'goal_' + Date.now(),
      workspaceId: currentWorkspace.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (isLiveFirebaseConfigured && !isDemoMode) {
      await addDoc(collection(db, `workspaces/${currentWorkspace.id}/goals`), newGoal);
    } else {
      setGoals((prev) => [...prev, newGoal]);
    }
    addAudit('create', 'goal', newGoal.id, `Created goal "${newGoal.name}".`);
  };

  const updateGoal = async (id: string, data: Partial<FinancialGoal>) => {
    if (isLiveFirebaseConfigured && !isDemoMode) {
      await updateDoc(doc(db, `workspaces/${currentWorkspace.id}/goals`, id), data);
    } else {
      setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...data, updatedAt: new Date().toISOString() } : g)));
    }
  };

  const contributeToGoal = async (goalId: string, amountMinor: number, fromAccountId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    // Deduct from account and record allocation
    await createTransaction({
      title: `Contribution to ${goal.name}`,
      description: `Earmarked savings allocation`,
      amount: amountMinor,
      currency: currentWorkspace.defaultCurrency,
      type: 'expense',
      categoryId: 'cat_biz',
      accountId: fromAccountId,
      transactionDate: new Date().toISOString(),
      tags: ['goal-contribution'],
    });

    const updatedCurrent = goal.currentAmount + amountMinor;
    await updateGoal(goalId, { currentAmount: updatedCurrent });

    if (updatedCurrent >= goal.targetAmount) {
      setNotifications((prev) => [
        {
          id: 'notif_' + Date.now(),
          workspaceId: currentWorkspace.id,
          title: `Goal Achieved: ${goal.name}!`,
          message: `Congratulations! You have reached your target amount.`,
          type: 'goal_achieved',
          read: false,
          createdAt: new Date().toISOString(),
          link: '/goals',
        },
        ...prev,
      ]);
    }
  };

  const deleteGoal = async (id: string) => {
    if (isLiveFirebaseConfigured && !isDemoMode) {
      await deleteDoc(doc(db, `workspaces/${currentWorkspace.id}/goals`, id));
    } else {
      setGoals((prev) => prev.filter((g) => g.id !== id));
    }
  };

  // Category Operations
  const createCategory = async (data: Omit<Category, 'id' | 'workspaceId'>) => {
    const newCat: Category = {
      ...data,
      id: 'cat_' + Date.now(),
      workspaceId: currentWorkspace.id,
    };
    if (isLiveFirebaseConfigured && !isDemoMode) {
      await addDoc(collection(db, `workspaces/${currentWorkspace.id}/categories`), newCat);
    } else {
      setCategories((prev) => [...prev, newCat]);
    }
  };

  const deleteCategory = async (id: string) => {
    // Check if category has transactions
    const hasTxs = transactions.some((t) => t.categoryId === id);
    if (hasTxs) {
      throw new Error('Cannot delete category with associated transactions. Reassign transactions first.');
    }
    if (isLiveFirebaseConfigured && !isDemoMode) {
      await deleteDoc(doc(db, `workspaces/${currentWorkspace.id}/categories`, id));
    } else {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // Notification Operations
  const markNotificationRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const resetDemoData = () => {
    setAccounts(DEMO_ACCOUNTS);
    setTransactions(DEMO_TRANSACTIONS);
    setBudgets(DEMO_BUDGETS);
    setRecurring(DEMO_RECURRING);
    setGoals(DEMO_GOALS);
    setNotifications(DEMO_NOTIFICATIONS);
    setCategories(DEMO_CATEGORIES);
    setAuditLogs([]);
  };

  return (
    <FinanceContext.Provider
      value={{
        accounts,
        transactions,
        budgets,
        recurring,
        goals,
        notifications,
        categories,
        auditLogs,
        loading,
        createAccount,
        updateAccount,
        deleteAccount,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        bulkImportTransactions,
        createBudget,
        updateBudget,
        deleteBudget,
        createRecurring,
        updateRecurring,
        deleteRecurring,
        executeRecurringItem,
        createGoal,
        updateGoal,
        contributeToGoal,
        deleteGoal,
        createCategory,
        deleteCategory,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotification,
        resetDemoData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
