'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency } from '@/lib/currency';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bot, Send, User, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { AIMessage } from '@/types';

const INITIAL_MESSAGES: AIMessage[] = [
  {
    id: 'msg_0',
    role: 'assistant',
    content: `Hello! I am your **Spendwise AI Assistant**. I have analyzed your live transaction records, active budgets, and cash flow history for **Acme Ventures**. 

How can I help optimize your financial operations today?`,
    timestamp: '2026-11-01T12:00:00Z',
  },
];

const SUGGESTIONS = [
  'Where did most of my money go this month?',
  'Am I exceeding my monthly budget?',
  'How much can I realistically save this month?',
  'Show my top expense categories and burn rate.',
  'Summarize my financial activity this month.',
];

export default function AIAssistantPage() {
  const { currentWorkspace } = useAuth();
  const { transactions, accounts, budgets, goals } = useFinance();

  const [messages, setMessages] = useState<AIMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Compute live financial context for AI grounding
  const financialContext = useMemo(() => {
    const totalBalance = accounts.reduce((acc, a) => acc + a.currentBalance, 0);
    let totalIncome = 0;
    let totalExpense = 0;
    const catMap: Record<string, number> = {};

    transactions.forEach((t) => {
      if (t.type === 'income') totalIncome += t.amount;
      if (t.type === 'expense') {
        totalExpense += t.amount;
        const name = t.categoryName || 'Other';
        catMap[name] = (catMap[name] || 0) + t.amount;
      }
    });

    const topCategories = Object.entries(catMap)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);

    return {
      currency: currentWorkspace.defaultCurrency,
      totalBalance,
      totalIncome,
      totalExpense,
      netCashFlow: totalIncome - totalExpense,
      topCategories,
      budgets: budgets.map((b) => ({ name: b.name, amount: b.amount, spent: b.spent })),
      goals: goals.map((g) => ({ name: g.name, target: g.targetAmount, current: g.currentAmount })),
      accounts: accounts.map((a) => ({ name: a.name, balance: a.currentBalance })),
    };
  }, [accounts, transactions, budgets, goals, currentWorkspace.defaultCurrency]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (userPrompt: string) => {
    if (!userPrompt.trim()) return;

    const userMsg: AIMessage = {
      id: 'usr_' + Date.now(),
      role: 'user',
      content: userPrompt,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          financialContext,
        }),
      });

      const data = await response.json();
      const assistantMsg: AIMessage = {
        id: 'ast_' + Date.now(),
        role: 'assistant',
        content: data.content || 'Unable to generate response at this time.',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: AIMessage = {
        id: 'err_' + Date.now(),
        role: 'assistant',
        content: 'Apologies, I encountered a temporary connection issue. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Spendwise AI Financial Assistant
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                  Grounding: Active Ledger
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Contextually aware of verified balances, budgets, recurring burn, and P&L.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setMessages(INITIAL_MESSAGES)}
            className="text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> New Chat
          </Button>
        </div>

        {/* Chat History Container */}
        <Card className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/40">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.role === 'assistant' && (
                <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs mt-1">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-2xl rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 shadow-xs dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 rounded-bl-none'
                }`}
              >
                <div className="prose prose-xs dark:prose-invert max-w-none whitespace-pre-wrap">
                  {m.content}
                </div>
              </div>
              {m.role === 'user' && (
                <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 text-xs mt-1">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs">
                <Bot className="h-4 w-4 animate-spin" />
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
                <span>Analyzing transaction ledger & cash flow telemetry...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </Card>

        {/* Suggested Prompts Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s)}
              className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 transition-all text-[11px]"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Message Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your income, spending, runaway, or budgets..."
            className="flex-1 h-11 rounded-xl border border-slate-200 bg-white px-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 shadow-xs"
          />
          <Button type="submit" size="md" disabled={loading || !input.trim()} className="h-11 px-5">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
