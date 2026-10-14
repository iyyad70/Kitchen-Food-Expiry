import React from 'react';
import {
  Barcode,
  Smartphone,
  BarChart3,
  BookOpen,
  Code2,
  Users,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  activeTab: 'mobile' | 'admin' | 'guide' | 'sandbox';
  setActiveTab: (tab: 'mobile' | 'admin' | 'guide' | 'sandbox') => void;
  users: User[];
  currentUser: User;
  onSelectUser: (user: User) => void;
}

export function Header({
  activeTab,
  setActiveTab,
  users,
  currentUser,
  onSelectUser
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
            <Barcode className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 tracking-tight">Smart Pantry &amp; Expiry Tracker</span>
              <span className="hidden sm:inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                Capstone Edition
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              React Native · React Admin · Laragon MySQL · Open Food Facts · Power BI
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('mobile')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'mobile'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5 text-emerald-600" />
            <span>Mobile App</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'admin'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5 text-indigo-600" />
            <span>Admin &amp; Waste Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'guide'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-amber-600" />
            <span>Laragon &amp; VS Code Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('sandbox')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'sandbox'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="h-3.5 w-3.5 text-sky-600" />
            <span>Barcode API Tester</span>
          </button>
        </nav>

        {/* User / Household Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-white font-bold text-[10px] ${currentUser.avatarColor}`}
            >
              {currentUser.name.slice(0, 1)}
            </div>

            <div className="flex flex-col text-left">
              <span className="font-bold text-slate-900 text-[11px] leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-500 capitalize">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>

            {/* Quick Switch Dropdown */}
            <select
              value={currentUser.id}
              onChange={e => {
                const target = users.find(u => u.id === e.target.value);
                if (target) onSelectUser(target);
              }}
              className="bg-transparent text-[11px] font-semibold text-slate-700 outline-none cursor-pointer"
              title="Switch user to test Household sharing"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role.replace('_', ' ')})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
