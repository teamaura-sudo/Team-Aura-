import React, { useState, useEffect } from 'react';
import { X, Swords, Trophy, MapPin, UserCheck, AlertTriangle, ShieldCheck, Edit3 } from 'lucide-react';
import { Match, UserProfile } from '../types';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';

interface JoinMatchModalProps {
  isOpen: boolean;
  match: Match | null;
  user: UserProfile;
  onClose: () => void;
  onConfirmJoin: (matchId: string, ign: string, ffUid: string, fee: number) => Promise<{ success: boolean; message: string }>;
  onOpenWallet: () => void;
}

export const JoinMatchModal: React.FC<JoinMatchModalProps> = ({
  isOpen,
  match,
  user,
  onClose,
  onConfirmJoin,
  onOpenWallet,
}) => {
  const [ign, setIgn] = useState<string>(user.ign || '');
  const [ffUid, setFfUid] = useState<string>(user.ffUid || '');
  const [isEditingCredentials, setIsEditingCredentials] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync with user profile on open
  useEffect(() => {
    if (isOpen && user) {
      setIgn(user.ign || '');
      setFfUid(user.ffUid || '');
      setIsEditingCredentials(!user.ign || !user.ffUid);
      setErrorMsg(null);
    }
  }, [isOpen, user]);

  if (!isOpen || !match) return null;

  const hasEnoughBalance = user.balance >= match.fee;
  const balanceAfter = user.balance - match.fee;
  const hasSavedProfile = Boolean(user.ign && user.ffUid);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalIgn = ign.trim();
    const finalUid = ffUid.trim();

    if (!finalIgn) {
      setErrorMsg('Please enter your Free Fire In-Game Name (IGN)');
      sound.playAlert();
      return;
    }
    if (!finalUid) {
      setErrorMsg('Please enter your Free Fire UID (e.g. 29381029)');
      sound.playAlert();
      return;
    }
    if (!hasEnoughBalance) {
      setErrorMsg(`Insufficient balance. Please deposit at least ৳${match.fee - user.balance}`);
      sound.playAlert();
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      const res = await onConfirmJoin(match.id, finalIgn, finalUid, match.fee);
      if (res.success) {
        sound.playSuccess();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        onClose();
      } else {
        setErrorMsg(res.message);
        sound.playAlert();
      }
    } catch {
      setErrorMsg('Failed to join match. Please try again.');
      sound.playAlert();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#1e293b] border border-orange-500/40 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden glow-orange"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0f172a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/50 flex items-center justify-center text-orange-400">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-gaming font-bold text-lg text-slate-100">
                Join Match Tournament
              </h3>
              <p className="text-xs text-slate-400">
                Free Fire Custom Room Registration
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

        {/* Match Summary Box */}
        <div className="p-4 sm:p-5 space-y-4">
          <div className="bg-[#0f172a] p-3.5 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-gaming font-bold text-slate-200 text-sm">
              {match.title}
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                {match.map}
              </span>
              <span>•</span>
              <span className="text-cyan-400 font-semibold">{match.version}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <Trophy className="w-3.5 h-3.5" />
                Win ৳{match.prize}
              </span>
            </div>
          </div>

          {/* Balance breakdown */}
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Your Wallet Balance:</span>
              <span className="font-gaming font-bold text-slate-200">৳{user.balance}</span>
            </div>
            <div className="flex justify-between text-orange-400 font-semibold">
              <span>Entry Fee Deducted:</span>
              <span className="font-gaming font-bold">-৳{match.fee}</span>
            </div>
            <div className="border-t border-slate-800 pt-1.5 flex justify-between font-bold">
              <span className="text-slate-300">Balance Remaining:</span>
              <span className={`font-gaming ${hasEnoughBalance ? 'text-emerald-400' : 'text-rose-400'}`}>
                ৳{hasEnoughBalance ? balanceAfter : 'Insufficient'}
              </span>
            </div>
          </div>

          {!hasEnoughBalance && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-xs text-rose-300 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>You need ৳{match.fee - user.balance} more to join.</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenWallet();
                }}
                className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-gaming font-bold text-xs shrink-0 transition-colors cursor-pointer"
              >
                Add Money
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Free Fire Credentials Section - 1-Click Saved Profile */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {hasSavedProfile && !isEditingCredentials ? (
              <div className="bg-emerald-950/30 border border-emerald-500/40 p-3.5 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Saved Free Fire Credentials Loaded</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setIsEditingCredentials(true);
                    }}
                    className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 underline"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Change</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">In-Game Name (IGN)</span>
                    <span className="font-bold text-slate-100">{ign}</span>
                  </div>
                  <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Player UID</span>
                    <span className="font-mono font-bold text-emerald-400">{ffUid}</span>
                  </div>
                </div>
                <p className="text-[10px] text-emerald-400/80">
                  ⚡ Auto-filled from your profile. No need to retype!
                </p>
              </div>
            ) : (
              <div className="space-y-3 bg-[#0f172a] p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">
                    Free Fire Player Details:
                  </span>
                  {hasSavedProfile && (
                    <button
                      type="button"
                      onClick={() => setIsEditingCredentials(false)}
                      className="text-[11px] text-orange-400 hover:underline"
                    >
                      Use Saved Profile
                    </button>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 mb-1 block">
                    In-Game Name (IGN):
                  </label>
                  <input
                    type="text"
                    value={ign}
                    onChange={(e) => setIgn(e.target.value)}
                    placeholder="Exact Free Fire nickname"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 mb-1 block">
                    Free Fire UID:
                  </label>
                  <input
                    type="text"
                    value={ffUid}
                    onChange={(e) => setFfUid(e.target.value)}
                    placeholder="e.g. 294810482"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !hasEnoughBalance}
                className="w-full py-3 px-4 rounded-xl font-gaming font-bold text-sm bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 transition-all shadow-lg shadow-orange-500/25 active:scale-[0.98] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>{isSubmitting ? 'Registering...' : `Confirm & Pay ৳${match.fee}`}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
