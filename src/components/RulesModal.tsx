import React from 'react';
import { X, ShieldAlert, CheckCircle, AlertTriangle, Trophy, Smartphone } from 'lucide-react';
import { sound } from '../utils/sound';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#1e293b] border border-cyan-500/40 rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl overflow-hidden glow-cyan"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0f172a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="font-gaming font-bold text-base sm:text-lg text-slate-100">
              Team Aura Official Rules
            </h3>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="font-gaming font-bold text-amber-400 text-xs flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              <span>1. Mobile Only Policy</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Only mobile and tablet devices (Android / iOS) are allowed. PC / Emulators (BlueStacks, LDPlayer, Gameloop) are strictly forbidden. If detected, instant disqualification without refund.
            </p>
          </div>

          <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="font-gaming font-bold text-rose-400 text-xs flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>2. No Hacks / Scripts / Teaming</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Use of headshot hacks, antenna, speed hacks, or illegal config files results in immediate permanent ban from all Team Aura tournaments. Teaming up in Solo matches is banned.
            </p>
          </div>

          <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="font-gaming font-bold text-emerald-400 text-xs flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>3. Room Entry & Designated Slots</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Room ID & Password will be released 10-15 minutes prior to the start time. Players must sit strictly in their assigned Slot number displayed on their registration ticket.
            </p>
          </div>

          <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="font-gaming font-bold text-cyan-400 text-xs flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              <span>4. Prize Claiming & Payout</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Winners must take an end-game scoreboard screenshot showing kills and placement, and send it to Team Aura WhatsApp or Telegram within 30 minutes. Cash is credited automatically to your in-app wallet or bKash/Nagad within 15-30 minutes.
            </p>
          </div>
        </div>

        <div className="p-3 bg-[#0f172a] border-t border-slate-800 text-center">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-gaming font-bold text-xs transition-colors"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
