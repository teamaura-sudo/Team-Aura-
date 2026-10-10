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
  ExternalLink 
} from 'lucide-react';
import { Match } from '../types';
import { sound } from '../utils/sound';

interface MyMatchesTabProps {
  matches: Match[];
  currentUserId: string;
  onExploreMatches: () => void;
  onViewDetails: (match: Match) => void;
}

export const MyMatchesTab: React.FC<MyMatchesTabProps> = ({
  matches,
  currentUserId,
  onExploreMatches,
  onViewDetails,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const registeredMatches = matches.filter(
    (m) => m.participants && m.participants[currentUserId]
  );

  const handleCopy = (val: string, key: string) => {
    sound.playClick();
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (registeredMatches.length === 0) {
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
          className="py-2.5 px-6 rounded-xl font-gaming font-bold text-xs bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 transition-all shadow-lg shadow-orange-500/20 active:scale-95"
        >
          Explore Running Tournaments
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="font-semibold text-slate-200">
          Your Enrolled Matches ({registeredMatches.length})
        </span>
        <span className="text-[11px] text-emerald-400 font-medium">
          Room credentials available here
        </span>
      </div>

      <div className="space-y-3">
        {registeredMatches.map((m) => {
          const participant = m.participants?.[currentUserId];
          const hasRoom = m.roomId && m.roomId !== 'Pending' && !m.roomId.includes('Pending');

          return (
            <div
              key={m.id}
              className="bg-[#1e293b] border border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-lg shadow-emerald-500/5 relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Slot #{participant?.slotNumber || 1}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {m.version} • {m.map}
                    </span>
                  </div>
                  <h4 className="font-gaming font-bold text-base text-slate-100">
                    {m.title}
                  </h4>
                </div>

                <div className="text-right">
                  <span className="text-xs text-amber-400 font-gaming font-bold block">
                    Prize ৳{m.prize}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center justify-end gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-orange-400" />
                    {m.startTime}
                  </span>
                </div>
              </div>

              {/* Player details */}
              <div className="bg-[#0f172a] p-2.5 rounded-xl border border-slate-800 text-xs flex items-center justify-between mb-3">
                <div className="text-slate-400">
                  Registered IGN: <span className="text-slate-100 font-bold">{participant?.ign}</span>
                </div>
                <div className="text-slate-400 font-mono text-[11px]">
                  UID: <span className="text-emerald-400">{participant?.ffUid}</span>
                </div>
              </div>

              {/* Room Pass box */}
              <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/30 border border-emerald-500/50 rounded-xl p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 font-gaming uppercase tracking-wider">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>Free Fire Custom Room Details</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Room ID */}
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-700/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Room ID</span>
                      <span className="font-mono font-bold text-emerald-400 text-xs sm:text-sm">
                        {m.roomId || 'Pending'}
                      </span>
                    </div>
                    {hasRoom && (
                      <button
                        onClick={() => handleCopy(m.roomId || '', `room_${m.id}`)}
                        className="p-1 hover:bg-slate-800 rounded text-slate-300"
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
                        className="p-1 hover:bg-slate-800 rounded text-slate-300"
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

              {/* Action */}
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    onViewDetails(m);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View All Slots & Joined Squads</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
