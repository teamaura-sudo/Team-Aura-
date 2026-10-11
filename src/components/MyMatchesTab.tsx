import React, { useState } from 'react';
import { 
  Trophy, 
  Key, 
  Lock, 
  Copy, 
  Check, 
  MapPin, 
  Clock, 
  Sparkles, 
  Swords, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  LogIn,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Match } from '../types';
import { sound } from '../utils/sound';

interface MyMatchesTabProps {
  matches: Match[];
  currentUserId: string;
  onExploreMatches: () => void;
  onViewDetails: (match: Match) => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

export const MyMatchesTab: React.FC<MyMatchesTabProps> = ({
  matches,
  currentUserId,
  onExploreMatches,
  onViewDetails,
  onOpenAuth,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!currentUserId) {
    return (
      <div className="py-12 px-4 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center text-orange-400">
          <Swords className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="font-gaming font-bold text-lg text-slate-100">
            Sign In To View Your Match History
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Please log in or register to see the tournaments you have registered for, check your assigned slot numbers, and unlock live Room IDs.
          </p>
        </div>
        {onOpenAuth && (
          <button
            onClick={() => {
              sound.playClick();
              onOpenAuth('login');
            }}
            className="py-2.5 px-6 rounded-xl font-gaming font-bold text-xs bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 transition-all shadow-lg shadow-orange-500/20 active:scale-95 cursor-pointer"
          >
            Sign In / Register
          </button>
        )}
      </div>
    );
  }

  const allRegistered = matches.filter(
    (m) => m.participants && m.participants[currentUserId]
  );

  const filteredMatches = allRegistered.filter((m) => {
    if (filter === 'active') return m.status !== 'Completed';
    if (filter === 'completed') return m.status === 'Completed';
    return true;
  });

  const handleCopy = (val: string, key: string) => {
    sound.playClick();
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (allRegistered.length === 0) {
    return (
      <div className="py-12 px-4 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center text-orange-400">
          <Swords className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="font-gaming font-bold text-lg text-slate-100">
            No Tournaments Joined Yet
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            You haven't registered for any Free Fire custom matches yet. Choose an open tournament to claim your slot and win cash prizes!
          </p>
        </div>
        <button
          onClick={() => {
            sound.playClick();
            onExploreMatches();
          }}
          className="py-2.5 px-6 rounded-xl font-gaming font-bold text-xs bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 transition-all shadow-lg shadow-orange-500/20 active:scale-95 cursor-pointer"
        >
          Explore Running Tournaments
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {/* Header and Filter pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#1e293b]/70 p-3 rounded-2xl border border-slate-800">
        <div>
          <h3 className="font-gaming font-bold text-slate-100 text-sm sm:text-base flex items-center gap-1.5">
            <Swords className="w-4 h-4 text-orange-400" />
            <span>My Tournament History ({allRegistered.length})</span>
          </h3>
          <p className="text-[11px] text-slate-400">
            Live credentials and status of all tournaments you entered
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#0f172a] p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => { sound.playClick(); setFilter('all'); }}
            className={`px-3 py-1 rounded-lg font-gaming font-semibold transition-all ${
              filter === 'all'
                ? 'bg-orange-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({allRegistered.length})
          </button>
          <button
            onClick={() => { sound.playClick(); setFilter('active'); }}
            className={`px-3 py-1 rounded-lg font-gaming font-semibold transition-all ${
              filter === 'active'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active / Upcoming
          </button>
          <button
            onClick={() => { sound.playClick(); setFilter('completed'); }}
            className={`px-3 py-1 rounded-lg font-gaming font-semibold transition-all ${
              filter === 'completed'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Finished
          </button>
        </div>
      </div>

      {/* Match Cards List */}
      <div className="space-y-3">
        {filteredMatches.map((m) => {
          const participant = m.participants?.[currentUserId];
          const hasRoomCredentials = Boolean(
            m.roomId && m.roomId !== 'Pending' && !m.roomId.includes('Pending')
          );
          const isCompleted = m.status === 'Completed';

          return (
            <div
              key={m.id}
              className={`bg-[#1e293b] border rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden transition-all ${
                isCompleted
                  ? 'border-slate-800 opacity-90'
                  : hasRoomCredentials
                    ? 'border-emerald-500/60 shadow-emerald-500/10'
                    : 'border-orange-500/40 shadow-orange-500/5'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Slot #{participant?.slotNumber || 1}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {m.version} • {m.map}
                    </span>
                    {isCompleted ? (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        Finished
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Upcoming
                      </span>
                    )}
                  </div>
                  <h4 className="font-gaming font-bold text-base text-slate-100">
                    {m.title}
                  </h4>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs text-amber-400 font-gaming font-bold block">
                    Prize ৳{m.prize}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center justify-end gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-orange-400" />
                    {m.startTime}
                  </span>
                </div>
              </div>

              {/* Player details pill */}
              <div className="bg-[#0f172a] p-2.5 rounded-xl border border-slate-800 text-xs flex items-center justify-between mb-3">
                <div className="text-slate-400">
                  Registered IGN: <span className="text-slate-100 font-bold">{participant?.ign}</span>
                </div>
                <div className="text-slate-400 font-mono text-[11px]">
                  UID: <span className="text-emerald-400">{participant?.ffUid}</span>
                </div>
              </div>

              {/* Room Status Indicator Box */}
              {isCompleted ? (
                /* Completed Summary */
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 mb-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">Tournament Result:</span>
                    <span className="text-amber-400 font-gaming font-bold">
                      Winner: {m.winnerIgn || 'Declared in Results'}
                    </span>
                  </div>
                  {participant?.winnings ? (
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-between">
                      <span>🎉 Congratulations! You won prize:</span>
                      <span className="font-gaming text-sm text-emerald-400">+৳{participant.winnings}</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-500">
                      Match completed. Scorecard verified by Team Aura admins.
                    </div>
                  )}
                </div>
              ) : (
                /* Active / Upcoming Room Credentials Box */
                <div className={`p-3 rounded-xl border mb-3 transition-all ${
                  hasRoomCredentials
                    ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/30 border-emerald-500/50 shadow-inner'
                    : 'bg-[#0f172a] border-amber-500/30'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold font-gaming uppercase tracking-wider text-slate-200">
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                      <span>Custom Room Credentials Status</span>
                    </div>
                    {hasRoomCredentials ? (
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        🟢 Released & Ready
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        ⏳ Releases 10m before start
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {/* Room ID */}
                    <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-700/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Room ID</span>
                        <span className="font-mono font-bold text-emerald-400 text-xs sm:text-sm">
                          {m.roomId || 'Pending (10m before)'}
                        </span>
                      </div>
                      {hasRoomCredentials && (
                        <button
                          onClick={() => handleCopy(m.roomId || '', `room_${m.id}`)}
                          className="p-1 hover:bg-slate-800 rounded text-slate-300 transition-colors"
                          title="Copy Room ID"
                        >
                          {copiedKey === `room_${m.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Room Pass */}
                    <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-700/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Password</span>
                        <span className="font-mono font-bold text-amber-300 text-xs sm:text-sm">
                          {m.roomPass || 'Pending'}
                        </span>
                      </div>
                      {m.roomPass && m.roomPass !== 'Pending' && (
                        <button
                          onClick={() => handleCopy(m.roomPass || '', `pass_${m.id}`)}
                          className="p-1 hover:bg-slate-800 rounded text-slate-300 transition-colors"
                          title="Copy Password"
                        >
                          {copiedKey === `pass_${m.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action */}
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    onViewDetails(m);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View All Slots & Match Details</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
