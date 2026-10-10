import React, { useState } from 'react';
import { 
  User, 
  Wallet, 
  Trophy, 
  Crosshair, 
  Swords, 
  Edit3, 
  Save, 
  Check, 
  MessageCircle, 
  Send, 
  ShieldCheck, 
  Phone
} from 'lucide-react';
import { AppSettings, UserProfile } from '../types';
import { sound } from '../utils/sound';

interface ProfileTabProps {
  user: UserProfile;
  settings: AppSettings;
  onOpenWallet: () => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  onOpenRules: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  settings,
  onOpenWallet,
  onUpdateProfile,
  onOpenRules,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [ign, setIgn] = useState<string>(user.ign);
  const [ffUid, setFfUid] = useState<string>(user.ffUid);
  const [phone, setPhone] = useState<string>(user.phone);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await onUpdateProfile({
        ign: ign.trim(),
        ffUid: ffUid.trim(),
        phone: phone.trim(),
      });
      sound.playSuccess();
      setSavedSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch {
      sound.playAlert();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-br from-[#1e293b] via-[#1a2333] to-[#0f172a] border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 p-0.5 shadow-lg shadow-orange-500/20">
            <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center font-gaming font-black text-2xl text-orange-400">
              {user.ign.substring(0, 2).toUpperCase()}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-gaming font-bold text-lg text-slate-100">
                {user.ign}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {user.rankBadge || 'Grandmaster'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              UID: <span className="text-emerald-400 font-semibold">{user.ffUid}</span>
            </p>
            <p className="text-[11px] text-slate-500">
              ID: {user.id}
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsEditing(!isEditing);
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Edit IGN & UID"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* Wallet overview banner */}
        <div className="bg-[#0b0f19] p-3 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">Total Balance</span>
            <span className="font-gaming font-bold text-xl text-emerald-400">
              ৳{user.balance.toLocaleString()}
            </span>
          </div>
          <button
            onClick={() => {
              sound.playCoin();
              onOpenWallet();
            }}
            className="py-2 px-3.5 rounded-xl font-gaming font-bold text-xs bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Wallet / Cashier</span>
          </button>
        </div>
      </div>

      {/* Edit Form if open */}
      {isEditing && (
        <form onSubmit={handleSave} className="bg-[#1e293b] p-4 rounded-2xl border border-slate-700 space-y-3">
          <h4 className="font-gaming font-bold text-sm text-slate-200">
            Edit Free Fire Credentials
          </h4>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Free Fire In-Game Name (IGN)
            </label>
            <input
              type="text"
              value={ign}
              onChange={(e) => setIgn(e.target.value)}
              required
              className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Free Fire Player UID
            </label>
            <input
              type="text"
              value={ffUid}
              onChange={(e) => setFfUid(e.target.value)}
              required
              className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Mobile / WhatsApp Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 font-gaming font-bold text-xs text-slate-950 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {savedSuccess && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Career Stats Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-[#1e293b] p-3 rounded-2xl border border-slate-800 text-center">
          <div className="w-7 h-7 rounded-lg bg-orange-500/10 mx-auto flex items-center justify-center text-orange-400 mb-1">
            <Swords className="w-3.5 h-3.5" />
          </div>
          <div className="font-gaming font-bold text-lg text-slate-100">
            {user.matchesPlayed}
          </div>
          <div className="text-[10px] text-slate-400">Tournaments</div>
        </div>

        <div className="bg-[#1e293b] p-3 rounded-2xl border border-slate-800 text-center">
          <div className="w-7 h-7 rounded-lg bg-rose-500/10 mx-auto flex items-center justify-center text-rose-400 mb-1">
            <Crosshair className="w-3.5 h-3.5" />
          </div>
          <div className="font-gaming font-bold text-lg text-slate-100">
            {user.totalKills}
          </div>
          <div className="text-[10px] text-slate-400">Total Kills</div>
        </div>

        <div className="bg-[#1e293b] p-3 rounded-2xl border border-slate-800 text-center">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 mx-auto flex items-center justify-center text-amber-400 mb-1">
            <Trophy className="w-3.5 h-3.5" />
          </div>
          <div className="font-gaming font-bold text-lg text-amber-400">
            ৳{user.totalWon}
          </div>
          <div className="text-[10px] text-slate-400">Cash Won</div>
        </div>
      </div>

      {/* Support & Community Section */}
      <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-4 space-y-3">
        <h4 className="font-gaming font-bold text-xs uppercase tracking-wider text-slate-300">
          Team Aura Community & Support
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* WhatsApp Support */}
          <a
            href={`https://wa.me/${(settings.whatsappSupport || '8801789456123').replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <div>
              <div>WhatsApp Admin Support</div>
              <div className="text-[10px] text-emerald-400/80 font-normal">24/7 Fast Help</div>
            </div>
          </a>

          {/* Telegram Channel */}
          <a
            href="https://t.me/TeamAuraEsports"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-colors"
          >
            <Send className="w-4 h-4 text-cyan-400" />
            <div>
              <div>Telegram Channel</div>
              <div className="text-[10px] text-cyan-400/80 font-normal">Match Announcements</div>
            </div>
          </a>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onOpenRules();
          }}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-orange-400" />
          <span>Fair Play & Disqualification Rules</span>
        </button>
      </div>
    </div>
  );
};
