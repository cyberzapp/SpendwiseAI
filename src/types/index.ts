export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'SGD';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  country: string;
  preferredCurrency: CurrencyCode;
  timeZone: string;
  accountType: 'personal' | 'freelancer' | 'small_business' | 'startup';
  monthlyIncomeRange?: string;
  primaryGoals?: string[];
  budgetingPeriod?: 'monthly' | 'weekly' | 'custom';
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type WorkspaceRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface WorkspaceMember {
  uid: string;
  email: string;
  displayName: string;
  role: WorkspaceRole;
  status: 'active' | 'invited';
  joinedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  type: 'personal' | 'business';
  defaultCurrency: CurrencyCode;
  ownerId: string;
  plan: 'free' | 'pro' | 'business';
  createdAt: string;
  updatedAt: string;
}

export type AccountType = 'cash' | 'bank_account' | 'savings' | 'credit_card' | 'wallet' | 'other';

export interface FinancialAccount {
  id: string;
  workspaceId: string;
  name: string;
  type: AccountType;
  institutionName?: string;
  currency: CurrencyCode;
  // Balance stored in minor units (Paise for INR, Cents for USD) to avoid floating point inaccuracies
  openingBalance: number; // e.g., 500000 = ₹5,000.00
  currentBalance: number; // computed or synced
  color: string;
  icon?: string;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  // Stored in minor units (Paise / Cents)
  amount: number;
  currency: CurrencyCode;
  type: TransactionType;
  categoryId: string;
  categoryName?: string;
  categoryIcon?: string;
  categoryColor?: string;
  accountId: string;
  accountName?: string;
  toAccountId?: string; // For transfers
  toAccountName?: string;
  transactionDate: string; // ISO 8601 string
  paymentMethod?: string;
  merchant?: string;
  tags?: string[];
  notes?: string;
  receiptUrl?: string;
  receiptPath?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  workspaceId: string;
  name: string;
  type: 'expense' | 'income';
  icon: string;
  color: string;
  isDefault?: boolean;
}

export interface Budget {
  id: string;
  workspaceId: string;
  name: string;
  categoryId: string;
  categoryName?: string;
  // Minor units
  amount: number;
  spent: number;
  currency: CurrencyCode;
  period: 'monthly' | 'weekly' | 'custom';
  startDate: string;
  endDate: string;
  alertThreshold: number; // e.g., 70, 90, 100
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export type RecurrenceInterval = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface RecurringTransaction {
  id: string;
  workspaceId: string;
  title: string;
  amount: number; // Minor units
  currency: CurrencyCode;
  type: TransactionType;
  categoryId: string;
  accountId: string;
  startDate: string;
  nextExecutionDate: string;
  endDate?: string;
  interval: RecurrenceInterval;
  status: 'active' | 'paused' | 'cancelled';
  lastExecutedAt?: string;
  createdAt: string;
}

export interface FinancialGoal {
  id: string;
  workspaceId: string;
  name: string;
  targetAmount: number; // Minor units
  currentAmount: number; // Minor units
  targetDate: string;
  accountId?: string;
  description?: string;
  color: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InAppNotification {
  id: string;
  workspaceId: string;
  title: string;
  message: string;
  type: 'budget_alert' | 'recurring_due' | 'goal_achieved' | 'unusual_expense' | 'system';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AuditLog {
  id: string;
  workspaceId: string;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete' | 'transfer' | 'export';
  entityType: 'transaction' | 'account' | 'budget' | 'category' | 'goal' | 'workspace';
  entityId: string;
  details: string;
  timestamp: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metrics?: {
    totalIncome?: number;
    totalExpense?: number;
    netSavings?: number;
    topCategory?: string;
  };
}
