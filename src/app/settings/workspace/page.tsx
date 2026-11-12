'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Users, UserPlus, Shield, Check, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function WorkspaceSettingsPage() {
  const { currentWorkspace, profile } = useAuth();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member');

  const [members, setMembers] = useState([
    {
      uid: 'demo_user_01',
      displayName: profile?.displayName || 'Alex Morgan',
      email: profile?.email || 'founder@example.com',
      role: 'owner',
      status: 'active',
    },
    {
      uid: 'user_dev_02',
      displayName: 'Taylor Reed',
      email: 'taylor@example.com',
      role: 'admin',
      status: 'active',
    },
    {
      uid: 'user_fin_03',
      displayName: 'Jordan Patel',
      email: 'jordan@example.com',
      role: 'member',
      status: 'active',
    },
  ]);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setMembers([
      ...members,
      {
        uid: 'usr_' + Date.now(),
        displayName: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        status: 'active',
      },
    ]);
    setInviteEmail('');
    setShowInviteModal(false);
  };

  const handleRemove = (uid: string) => {
    setMembers(members.filter((m) => m.uid !== uid));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Workspace & Team Access Control
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage multi-tenant workspace credentials, team permissions, and invitation status.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs font-medium">
          <Link href="/settings/profile" className="px-3 py-1.5 text-slate-500 hover:text-slate-900">
            Profile & Locale
          </Link>
          <Link
            href="/settings/workspace"
            className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 font-semibold"
          >
            Workspace & Members
          </Link>
          <Link href="/settings/billing" className="px-3 py-1.5 text-slate-500 hover:text-slate-900">
            Plans & Billing
          </Link>
          <Link href="/settings/security" className="px-3 py-1.5 text-slate-500 hover:text-slate-900">
            Security
          </Link>
        </div>

        {/* Workspace Identity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Workspace Metadata</CardTitle>
            <CardDescription>Legal legal entity profile and tier status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400">Workspace Name:</span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                  {currentWorkspace.name}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Organization Type:</span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 capitalize">
                  {currentWorkspace.type}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members List */}
        <Card className="overflow-hidden p-0">
          <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <div>
              <CardTitle className="text-base font-semibold">Members & RBAC</CardTitle>
              <CardDescription>Role-based access privileges for financial records</CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowInviteModal(true)}>
              <UserPlus className="h-4 w-4 mr-1.5" /> Invite Member
            </Button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {members.map((m) => (
              <div key={m.uid} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center text-xs">
                    {m.displayName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {m.displayName}
                    </h4>
                    <p className="text-[11px] text-slate-400">{m.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                    {m.role}
                  </span>
                  {m.role !== 'owner' && (
                    <button
                      onClick={() => handleRemove(m.uid)}
                      className="text-slate-400 hover:text-rose-500"
                      title="Remove Member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Invite Member Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite Team Member"
        description="Grant access to the Spendwise AI financial workspace."
      >
        <form onSubmit={handleInvite} className="space-y-4">
          <Input
            label="Colleague Email Address"
            type="email"
            placeholder="colleague@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Assigned Role
            </label>
            <select
              value={inviteRole}
              onChange={(e: any) => setInviteRole(e.target.value)}
              className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="admin">Admin (Manage workspace, edit transactions & budgets)</option>
              <option value="member">Member (Add transactions, view budgets & reports)</option>
              <option value="viewer">Viewer (Read-only access)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowInviteModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
