import { Category } from '@/types';

export const DEFAULT_EXPENSE_CATEGORIES: Omit<Category, 'id' | 'workspaceId'>[] = [
  { name: 'Food & Dining', type: 'expense', icon: 'Utensils', color: '#F97316' },
  { name: 'Shopping', type: 'expense', icon: 'ShoppingBag', color: '#EC4899' },
  { name: 'Transportation', type: 'expense', icon: 'Car', color: '#3B82F6' },
  { name: 'Housing & Rent', type: 'expense', icon: 'Home', color: '#8B5CF6' },
  { name: 'Utilities', type: 'expense', icon: 'Zap', color: '#EAB308' },
  { name: 'Healthcare', type: 'expense', icon: 'HeartPulse', color: '#EF4444' },
  { name: 'Entertainment', type: 'expense', icon: 'Film', color: '#06B6D4' },
  { name: 'Education', type: 'expense', icon: 'GraduationCap', color: '#14B8A6' },
  { name: 'Travel', type: 'expense', icon: 'Plane', color: '#6366F1' },
  { name: 'Subscriptions', type: 'expense', icon: 'CreditCard', color: '#A855F7' },
  { name: 'Business Expenses', type: 'expense', icon: 'Briefcase', color: '#10B981' },
  { name: 'Other Expenses', type: 'expense', icon: 'MoreHorizontal', color: '#64748B' },
];

export const DEFAULT_INCOME_CATEGORIES: Omit<Category, 'id' | 'workspaceId'>[] = [
  { name: 'Salary', type: 'income', icon: 'Wallet', color: '#10B981' },
  { name: 'Freelance & Consulting', type: 'income', icon: 'Laptop', color: '#059669' },
  { name: 'Business Revenue', type: 'income', icon: 'TrendingUp', color: '#047857' },
  { name: 'Investments & Dividends', type: 'income', icon: 'PieChart', color: '#0D9488' },
  { name: 'Interest', type: 'income', icon: 'Percent', color: '#0284C7' },
  { name: 'Other Income', type: 'income', icon: 'PlusCircle', color: '#475569' },
];
