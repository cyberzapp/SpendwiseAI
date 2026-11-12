'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useFinance } from '@/context/FinanceContext';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatRelativeTime } from '@/lib/utils';
import { Check, Trash2, Bell, AlertTriangle, Repeat, Target, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotification } = useFinance();

  const getIcon = (type: string) => {
    switch (type) {
      case 'budget_alert':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'recurring_due':
        return <Repeat className="h-4 w-4 text-blue-500" />;
      case 'goal_achieved':
        return <Target className="h-4 w-4 text-emerald-500" />;
      default:
        return <Sparkles className="h-4 w-4 text-emerald-500" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              In-App Notification Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Real-time telemetry on budget limits, due recurring payments, and reserve goal achievements.
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={markAllNotificationsRead}>
            <Check className="h-4 w-4 mr-1.5" /> Mark All as Read
          </Button>
        </div>

        <Card className="divide-y divide-slate-100 dark:divide-slate-800 p-0 overflow-hidden">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              You are all caught up! No active notifications.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                  !n.read ? 'bg-slate-50/80 dark:bg-slate-900/40' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {n.title}
                      </h4>
                      {!n.read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {formatRelativeTime(n.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {n.link && (
                    <Link href={n.link}>
                      <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                        View
                      </Button>
                    </Link>
                  )}
                  {!n.read && (
                    <button
                      onClick={() => markNotificationRead(n.id)}
                      className="p-1 text-slate-400 hover:text-emerald-600"
                      title="Mark as Read"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => clearNotification(n.id)}
                    className="p-1 text-slate-400 hover:text-rose-500"
                    title="Dismiss"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
