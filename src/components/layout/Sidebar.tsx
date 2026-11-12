'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowLeftRight,
  WalletCards,
  PieChart,
  Tag,
  Repeat,
  Target,
  FileBarChart,
  Bot,
  Settings,
  HelpCircle,
  Menu,
  X,
  ChevronDown,
  Building2,
  Sparkles,
  LogOut,
  Sun,
  Moon,
  DatabaseZap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useFinance } from '@/context/FinanceContext';

const NAV_ITEMS = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
  { name: 'Accounts', href: '/accounts', icon: WalletCards },
  { name: 'Budgets', href: '/budgets', icon: PieChart },
  { name: 'Categories', href: '/categories', icon: Tag },
  { name: 'Recurring', href: '/recurring', icon: Repeat },
  { name: 'Financial Goals', href: '/goals', icon: Target },
  { name: 'Reports', href: '/reports', icon: FileBarChart },
  { name: 'AI Financial Assistant', href: '/ai-assistant', icon: Bot, badge: 'AI' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { currentWorkspace, profile, logout, isDemoMode, toggleDemoMode } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { resetDemoData } = useFinance();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile trigger button in top-bar */}
      <div className="lg:hidden fixed top-3 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200/80 bg-white transition-all duration-200 dark:border-slate-800 dark:bg-slate-950',
          collapsed ? 'w-20' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand / Logo */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800/80">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Spendwise<span className="text-emerald-500">.ai</span>
                </span>
                <span className="text-[10px] uppercase font-semibold text-emerald-600 tracking-wider">
                  Intelligent Finance
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Workspace Card */}
        {!collapsed && (
          <div className="p-3 mx-3 my-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {currentWorkspace.name}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 capitalize">{currentWorkspace.type}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <span className="text-[10px] font-medium text-emerald-600">{currentWorkspace.defaultCurrency}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Demo Mode Notice Pill */}
        {isDemoMode && !collapsed && (
          <div className="mx-3 mb-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-amber-700 dark:text-amber-400">
            <div className="flex items-center gap-1.5">
              <DatabaseZap className="h-3.5 w-3.5" />
              <span className="font-medium text-[11px]">Interactive Demo</span>
            </div>
            <button
              onClick={resetDemoData}
              className="text-[10px] underline font-medium hover:text-amber-900 dark:hover:text-amber-300"
            >
              Reset Data
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold dark:bg-emerald-950/50 dark:text-emerald-400'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200'
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-colors',
                    isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                  )}
                />
                {!collapsed && (
                  <span className="truncate flex-1 flex items-center justify-between">
                    {item.name}
                    {item.badge && (
                      <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-300">
                        {item.badge}
                      </span>
                    )}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Sidebar: Theme, Help, Settings & User */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 p-3 space-y-1">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors"
          >
            {theme === 'light' ? (
              <>
                <Moon className="h-4 w-4 text-slate-400" />
                {!collapsed && <span>Dark Mode</span>}
              </>
            ) : (
              <>
                <Sun className="h-4 w-4 text-amber-400" />
                {!collapsed && <span>Light Mode</span>}
              </>
            )}
          </button>

          <Link
            href="/settings/profile"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors"
          >
            <Settings className="h-4 w-4 text-slate-400" />
            {!collapsed && <span>Settings</span>}
          </Link>

          {/* Profile pill */}
          {!collapsed && (
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5 truncate">
                <div className="h-7 w-7 rounded-full bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center shrink-0">
                  {profile?.displayName?.charAt(0) || 'U'}
                </div>
                <div className="truncate">
                  <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                    {profile?.displayName || 'User'}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{profile?.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                title="Log out"
                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
