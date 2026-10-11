import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  Trophy, 
  Smartphone, 
  FileText, 
  Scale, 
  Coins, 
  ShieldCheck 
} from 'lucide-react';
import { sound } from '../utils/sound';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'gameplay' | 'device' | 'payouts' | 'terms'>('gameplay');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-[#1e293b] border border-cyan-500/40 rounded-2xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl overflow-hidden glow-cyan"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0f172a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-gaming font-bold text-base sm:text-lg text-slate-100">
                Official Rules & Regulations
              </h3>
              <p className="text-xs text-slate-400">
                Team Aura Competitive Fair Play Constitution
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 p-1.5 gap-1 overflow-x-auto text-xs">
          <button
            onClick={() => { sound.playClick(); setTab('gameplay'); }}
            className={`flex-1 py-1.5 px-2.5 rounded-lg font-gaming font-bold whitespace-nowrap transition-all cursor-pointer ${
              tab === 'gameplay' ? 'bg-orange-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Gameplay
          </button>
          <button
            onClick={() => { sound.playClick(); setTab('device'); }}
            className={`flex-1 py-1.5 px-2.5 rounded-lg font-gaming font-bold whitespace-nowrap transition-all cursor-pointer ${
              tab === 'device' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Device Policy
          </button>
          <button
            onClick={() => { sound.playClick(); setTab('payouts'); }}
            className={`flex-1 py-1.5 px-2.5 rounded-lg font-gaming font-bold whitespace-nowrap transition-all cursor-pointer ${
              tab === 'payouts' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Prizes & Cash
          </button>
          <button
            onClick={() => { sound.playClick(); setTab('terms'); }}
            className={`flex-1 py-1.5 px-2.5 rounded-lg font-gaming font-bold whitespace-nowrap transition-all cursor-pointer ${
              tab === 'terms' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Terms
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs text-slate-300 leading-relaxed flex-1">
          {tab === 'gameplay' && (
            <>
              <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="font-gaming font-bold text-rose-400 text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>1. Anti-Cheat & Illegal Mod Restrictions</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Use of any hacks, auto-aim, headshot scripts, location antennas, wallhacks, or modified APK/OBB files is strictly forbidden. Any player caught will be instantly banned permanently and reported with in-game UID.
                </p>
              </div>

              <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="font-gaming font-bold text-amber-400 text-xs flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>2. No Teaming Up in Solo/Duo Matches</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Cross-team cooperation or teaming up with enemy players in Solo or Duo matches will result in immediate disqualification for both parties and forfeiture of all match winnings.
                </p>
              </div>

              <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="font-gaming font-bold text-cyan-400 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>3. Slot Allocation & Room Entry</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Players must enter the custom room exactly on their assigned ticket Slot number. Entering someone else's slot or switching slots inside the lobby will cause the custom room moderator to kick you out.
                </p>
              </div>
            </>
          )}

          {tab === 'device' && (
            <>
              <div className="bg-[#0f172a] p-3.5 rounded-xl border border-amber-500/30 space-y-2">
                <div className="font-gaming font-bold text-amber-400 text-xs flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" />
                  <span>Strict Mobile Only Requirement</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  All tournaments are strictly <b>Mobile & Tablet Only (Android / iOS)</b>. 
                </p>
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-[11px]">
                  🚫 <b>Prohibited Devices:</b> PC, Laptops, BlueStacks, LDPlayer, Gameloop, MEmu, Nox Player, Mouse/Keyboard adapters.
                </div>
                <p className="text-slate-400 text-[10px]">
                  Free Fire spectating tools detect PC inputs and frame rates. Any suspected emulator user must provide hand-cam proof upon admin request or face disqualification without refund.
                </p>
              </div>
            </>
          )}

          {tab === 'payouts' && (
            <>
              <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="font-gaming font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                  <Trophy className="w-4 h-4" />
                  <span>1. How to Claim Your Prize Money</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Winning players or squad captains must take a clear screenshot of the end-game score table showing total kills and placement, and send it to Team Aura WhatsApp within <b>30 minutes</b> of the match completion.
                </p>
              </div>

              <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="font-gaming font-bold text-cyan-400 text-xs flex items-center gap-1.5">
                  <Coins className="w-4 h-4" />
                  <span>2. Payout Processing Timeline</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Prize cash is automatically added to your in-app wallet balance or sent via bKash/Nagad within 15 to 30 minutes following screenshot verification.
                </p>
              </div>

              <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="font-gaming font-bold text-amber-400 text-xs flex items-center gap-1.5">
                  <Coins className="w-4 h-4" />
                  <span>3. Per Kill Reward Guarantee</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Per kill rewards are calculated strictly based on verified in-game kills recorded on the end-game spectator board.
                </p>
              </div>
            </>
          )}

          {tab === 'terms' && (
            <>
              <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="font-gaming font-bold text-slate-200 text-xs flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-cyan-400" />
                  <span>Terms of Service & Match Cancellation</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  If Garena Free Fire game servers go under unexpected maintenance or a room crashes before the plane launch, 100% of the tournament entry fee will be refunded back to each player's in-app wallet.
                </p>
                <p className="text-slate-400 text-[11px] pt-1">
                  Team Aura admins reserve the final authoritative decision on Fair Play disputes, video recording audits, and prize disallowances.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0f172a] border-t border-slate-800 text-center">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-gaming font-bold text-xs transition-colors cursor-pointer"
          >
            I Acknowledge & Agree to Fair Play
          </button>
        </div>
      </div>
    </div>
  );
};
