import React from 'react';
import { Bell, Flame } from 'lucide-react';

interface NoticeBannerProps {
  notice: string;
}

export const NoticeBanner: React.FC<NoticeBannerProps> = ({ notice }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/15 via-orange-500/20 to-amber-500/15 border border-amber-500/40 rounded-xl p-3 my-3 shadow-md shadow-amber-500/5">
      <div className="flex items-center gap-2.5">
        <div className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30">
          <Bell className="w-4 h-4 animate-bounce" />
        </div>
        <div className="overflow-hidden flex-1">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-300">
            <span className="shrink-0 uppercase tracking-wider text-[10px] bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded font-gaming border border-amber-500/30">
              Notice
            </span>
            <span className="truncate leading-tight">
              {notice || "Welcome to Team Aura Free Fire Tournaments! Check room codes 10 mins before match."}
            </span>
          </div>
        </div>
        <Flame className="w-4 h-4 text-orange-400 shrink-0 hidden sm:block animate-pulse" />
      </div>
    </div>
  );
};
