import React, { useState } from 'react';
import { 
  Trophy, 
  Crown, 
  Medal, 
  Crosshair, 
  MapPin, 
  Calendar, 
  Search, 
  ShieldCheck, 
  Users, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { Match } from '../types';
import { sound } from '../utils/sound';

interface WinnersResultsTabProps {
  matches: Match[];
  onOpenRules: () => void;
}

export const WinnersResultsTab: React.FC<WinnersResultsTabProps> = ({
  matches,
  onOpenRules,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  const completedMatches = matches.filter(m => m.status === 'Completed' || m.winnerIgn);

  const filtered = completedMatches.filter(m => {
    const q = searchQuery.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      m.map.toLowerCase().includes(q) ||
      (m.winnerIgn || '').toLowerCase().includes(q) ||
      m.version.toLowerCase().includes(q)
    );
  });

  const toggleExpand = (id: string) => {
    sound.playClick();
    setExpandedMatchId(expandedMatchId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/20 to-amber-500/15 border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/30">
                👑
              </span>
              <h3 className="font-gaming font-bold text-lg sm:text-xl text-slate-100">
                Tournament Hall of Champions & Results
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Verified final scores, winning squads, and prize distribution records
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onOpenRules();
            }}
            className="py-2 px-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-300 font-gaming font-bold text-xs border border-amber-500/40 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Prize Claim Rules</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search results by Tournament name, Map, Champion IGN..."
          className="w-full bg-[#1e293b] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Completed Tournaments List */}
      <div className="space-y-3.5">
        {filtered.length === 0 ? (
          <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs space-y-2">
            <Trophy className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="font-bold text-slate-300 text-sm">No completed tournament results found</p>
            <p className="text-slate-500 text-[11px]">
              Results and winner scoreboards will be posted here as soon as live tournaments conclude.
            </p>
          </div>
        ) : (
          filtered.map((m) => {
            const isExpanded = expandedMatchId === m.id;
            const scoreboard = m.resultScoreboard || [];

            return (
              <div
                key={m.id}
                className="bg-[#1e293b] border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 sm:p-5 transition-all shadow-xl space-y-3.5"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase font-gaming">
                        {m.version} • {m.map}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-semibold">
                        Finished
                      </span>
                    </div>
                    <h4 className="font-gaming font-bold text-base sm:text-lg text-slate-100">
                      {m.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{m.startTime}</span>
                      <span>•</span>
                      <span>Total Prize Pool: <b className="text-amber-400">৳{m.prize}</b></span>
                    </p>
                  </div>

                  <button
                    onClick={() => toggleExpand(m.id)}
                    className="flex items-center gap-1.5 text-xs font-gaming font-bold text-amber-400 hover:text-amber-300 self-start sm:self-auto cursor-pointer"
                  >
                    <span>{isExpanded ? 'Hide Scoreboard' : 'View Full Scoreboard'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Champion & Highlights Podium Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* #1 Champion */}
                  <div className="bg-gradient-to-br from-amber-500/20 via-slate-900 to-amber-950/20 border border-amber-500/50 p-3 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-lg shadow-md shadow-amber-500/20 shrink-0">
                      🥇
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                        Champion (1st)
                      </span>
                      <span className="font-gaming font-bold text-sm text-slate-100 truncate block">
                        {m.winnerIgn || 'AURA_Viper'}
                      </span>
                      <span className="text-xs text-amber-300 font-bold font-gaming">
                        Won ৳{m.winnerPrize || Math.round(m.prize * 0.6)}
                      </span>
                    </div>
                  </div>

                  {/* #2 Runner Up */}
                  <div className="bg-slate-900/90 border border-slate-700/80 p-3 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-700 text-slate-200 font-bold flex items-center justify-center text-lg shadow-md shrink-0">
                      🥈
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                        Runner Up (2nd)
                      </span>
                      <span className="font-gaming font-bold text-sm text-slate-200 truncate block">
                        {m.runnerUpIgn || 'BD_Headshot'}
                      </span>
                      <span className="text-xs text-slate-300 font-bold font-gaming">
                        Won ৳{m.runnerUpPrize || Math.round(m.prize * 0.25)}
                      </span>
                    </div>
                  </div>

                  {/* #3 MVP / Top Fragger */}
                  <div className="bg-slate-900/90 border border-rose-500/30 p-3 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold flex items-center justify-center text-lg shadow-md shrink-0">
                      🎯
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider block">
                        Top Fragger (MVP)
                      </span>
                      <span className="font-gaming font-bold text-sm text-slate-200 truncate block">
                        {m.topFraggerIgn || m.winnerIgn || 'NOVA_Sniper'}
                      </span>
                      <span className="text-xs text-rose-300 font-bold font-gaming">
                        {m.topKills || 14} Kills (৳{((m.topKills || 14) * m.perKill)})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Scoreboard Table */}
                {isExpanded && (
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
                      <span>Official Placement & Kill Distribution</span>
                      <span>Prize Awarded</span>
                    </div>

                    <div className="bg-[#0f172a] rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800/80">
                      {(scoreboard.length > 0 ? scoreboard : [
                        { rank: 1, teamOrIgn: m.winnerIgn || "AURA_Viper", kills: m.topKills || 14, prize: m.winnerPrize || 1200 },
                        { rank: 2, teamOrIgn: m.runnerUpIgn || "BD_Headshot", kills: 9, prize: m.runnerUpPrize || 400 },
                        { rank: 3, teamOrIgn: "NOVA_Sniper", kills: 7, prize: 200 },
                        { rank: 4, teamOrIgn: "RED_Hunter", kills: 4, prize: 0 },
                        { rank: 5, teamOrIgn: "DARK_Shadow", kills: 3, prize: 0 },
                      ]).map((entry, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 flex items-center justify-between text-xs hover:bg-slate-800/40 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-gaming font-bold text-xs ${
                              entry.rank === 1 ? 'bg-amber-500 text-slate-950 font-black' :
                              entry.rank === 2 ? 'bg-slate-600 text-white' :
                              entry.rank === 3 ? 'bg-amber-800 text-amber-200' :
                              'bg-slate-800 text-slate-400'
                            }`}>
                              #{entry.rank}
                            </span>
                            <div>
                              <span className="font-semibold text-slate-200 block">{entry.teamOrIgn}</span>
                              <span className="text-[10px] text-slate-400">{entry.kills} Kills</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className={`font-gaming font-bold text-sm ${
                              entry.prize > 0 ? 'text-emerald-400' : 'text-slate-500'
                            }`}>
                              {entry.prize > 0 ? `+৳${entry.prize}` : '৳0'}
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              {entry.prize > 0 ? 'Cash Paid' : 'Completed'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
