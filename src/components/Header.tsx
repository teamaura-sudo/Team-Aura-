import React from 'react';
import { ShieldCheck, Plus, Volume2, VolumeX, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { UserProfile } from '../types';
import { sound } from '../utils/sound';

interface HeaderProps {
  balance: number;
  user: UserProfile | null;
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
  onOpenWallet,
  onOpenAuth,
  onLogout,
  soundEnabled,
  onToggleSound,
  onOpenRules,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 px-3.5 py-2.5 sm:px-6 sm:py-3 transition-all shadow-lg shadow-black/40">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30 text-white font-black text-lg font-gaming ring-1 ring-orange-400/50">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-teko text-2xl tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 font-bold leading-none">
                Team Aura
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                Esports
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:block">
              Free Fire Cash Tournaments BD
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Rules button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenRules();
            }}
            title="Tournament Rules"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs hidden md:flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium">Rules</span>
          </button>

          {/* Sound toggle */}
          <button
            onClick={() => {
              onToggleSound();
              sound.playClick();
            }}
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors cursor-pointer"
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

