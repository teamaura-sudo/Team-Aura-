import React from 'react';
import { ShieldCheck, Plus, Volume2, VolumeX, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { UserProfile } from '../types';
import { sound } from '../utils/sound';

interface HeaderProps {
  balance: number;
  user: UserProfile | null;
  unreadNotificationsCount?: number;
  onOpenNotifications: () => void;
  onOpenSupport: () => void;
  onOpenWallet: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenRules: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  balance,
  user,
  unreadNotificationsCount = 0,
  onOpenNotifications,
  onOpenSupport,
  onOpenWallet,
  onOpenAuth,
  onLogout,
  soundEnabled,
  onToggleSound,
  onOpenRules,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 px-3 py-2 sm:px-6 sm:py-3 transition-all shadow-lg shadow-black/40">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30 text-white font-black text-base sm:text-lg font-gaming ring-1 ring-orange-400/50">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-teko text-xl sm:text-2xl tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 font-bold leading-none">
                Team Aura
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1 sm:px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                Esports
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:block">
              Free Fire Cash Tournaments BD
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Notifications Bell */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenNotifications();
            }}
            title="Tournament Alerts & Updates"
            className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
          >
            <span className="sr-only">Notifications</span>
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500 text-[9px] font-bold text-slate-950 items-center justify-center font-mono">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              </span>
            )}
          </button>

          {/* 24/7 Live Support button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSupport();
            }}
            title="24/7 Live Support & Help Center"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="text-emerald-400 text-sm">💬</span>
            <span className="font-semibold text-emerald-300 hidden md:inline">Support</span>
          </button>

          {/* Rules button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenRules();
            }}
            title="Tournament Rules & Regulations"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs hidden sm:flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-slate-200">Rules</span>
          </button>

          {/* Sound toggle */}
          <button
            onClick={() => {
              onToggleSound();
              sound.playClick();
            }}
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-orange-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* User Logged In state */}
          {user ? (
            <div className="flex items-center gap-2">
              {/* Wallet Balance Badge */}
              <button
                onClick={() => {
                  sound.playCoin();
                  onOpenWallet();
                }}
                className="group relative flex items-center gap-2 bg-[#0b0f19] hover:bg-slate-900 border border-emerald-500/50 hover:border-emerald-400 px-3 py-1.5 rounded-full transition-all shadow-sm hover:shadow-emerald-500/20 glow-green cursor-pointer active:scale-95"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-400 font-medium">৳</span>
                  <span className="font-gaming font-bold text-sm text-emerald-400 tracking-wide">
                    {balance.toLocaleString('en-US')}
                  </span>
                </div>
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                  <Plus className="w-3 h-3 stroke-[3]" />
                </div>
              </button>

              {/* Player Tag */}
              <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700 text-xs">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                <span className="font-gaming font-bold text-slate-200 truncate max-w-[90px]">
                  {user.ign}
                </span>
              </div>
            </div>
          ) : (
            /* Logged Out Controls */
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenAuth('login');
                }}
                className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-gaming font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-orange-400" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onOpenAuth('register');
                }}
                className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-gaming font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-orange-500/20 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

