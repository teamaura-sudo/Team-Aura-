import React, { useState } from 'react';
import { Trophy, Medal, Flame, Crosshair, Award, Shield } from 'lucide-react';
import { sound } from '../utils/sound';

interface LeaderboardUser {
  rank: number;
  ign: string;
  guild: string;
  kills: number;
  winnings: number;
  matches: number;
  winRate: string;
}

const TOP_PLAYERS: LeaderboardUser[] = [
  { rank: 1, ign: "AURA_Viper", guild: "Team Aura", kills: 142, winnings: 4850, matches: 32, winRate: "68%" },
  { rank: 2, ign: "NOVA_Sniper", guild: "Nova Esports", kills: 128, winnings: 3900, matches: 28, winRate: "61%" },
  { rank: 3, ign: "BD_Headshot", guild: "Black Tiger", kills: 110, winnings: 3200, matches: 25, winRate: "56%" },
  { rank: 4, ign: "GHOST_Killer", guild: "Team Aura", kills: 95, winnings: 2650, matches: 22, winRate: "50%" },
  { rank: 5, ign: "RED_Hunter", guild: "Silent Killers", kills: 88, winnings: 2100, matches: 19, winRate: "47%" },
  { rank: 6, ign: "AURA_TITAN", guild: "Team Aura", kills: 74, winnings: 1850, matches: 16, winRate: "50%" },
  { rank: 7, ign: "RAZOR_X", guild: "Viper Squad", kills: 62, winnings: 1400, matches: 14, winRate: "42%" },
];

export const LeaderboardTab: React.FC = () => {
  const [filter, setFilter] = useState<'winnings' | 'kills'>('winnings');

  const sortedPlayers = [...TOP_PLAYERS].sort((a, b) => 
    filter === 'winnings' ? b.winnings - a.winnings : b.kills - a.kills
  ).map((p, idx) => ({ ...p, rank: idx + 1 }));

  return (
    <div className="space-y-4">
      {/* Tab filter */}
      <div className="flex bg-[#0f172a] p-1.5 rounded-xl border border-slate-800 gap-1.5">
        <button
          onClick={() => {
            sound.playClick();
            setFilter('winnings');
          }}
          className={`flex-1 py-2 rounded-lg font-gaming font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
            filter === 'winnings'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Top Cash Earners</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setFilter('kills');
          }}
          className={`flex-1 py-2 rounded-lg font-gaming font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
            filter === 'kills'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Crosshair className="w-3.5 h-3.5" />
          <span>Top Killers (Fraggers)</span>
        </button>
      </div>

      {/* Podium Top 3 */}
      <div className="grid grid-cols-3 gap-2 pt-4 pb-2 items-end">
        {/* #2 Player */}
        <div className="bg-[#1e293b] border border-slate-700/80 rounded-2xl p-3 text-center flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-400 flex items-center justify-center font-bold text-slate-300 font-gaming mb-1 text-sm shadow-md">
            🥈
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase">2nd</span>
          <span className="font-gaming font-bold text-xs text-slate-100 truncate w-full">
            {sortedPlayers[1]?.ign}
          </span>
          <span className="text-[11px] font-bold text-amber-400 font-gaming mt-0.5">
            {filter === 'winnings' ? `৳${sortedPlayers[1]?.winnings}` : `${sortedPlayers[1]?.kills} Kills`}
          </span>
        </div>

        {/* #1 Player */}
        <div className="bg-gradient-to-b from-amber-500/20 to-[#1e293b] border-2 border-amber-500/60 rounded-2xl p-3.5 text-center flex flex-col items-center shadow-xl shadow-amber-500/10 -mt-3">
          <div className="w-12 h-12 rounded-full bg-amber-500 border-2 border-amber-300 flex items-center justify-center font-bold text-slate-950 font-gaming mb-1 text-base shadow-lg shadow-amber-500/30">
            👑
          </div>
          <span className="text-[10px] text-amber-400 font-bold uppercase">Champion</span>
          <span className="font-gaming font-bold text-sm text-slate-100 truncate w-full">
            {sortedPlayers[0]?.ign}
          </span>
          <span className="text-xs font-bold text-amber-300 font-gaming mt-0.5">
            {filter === 'winnings' ? `৳${sortedPlayers[0]?.winnings}` : `${sortedPlayers[0]?.kills} Kills`}
          </span>
        </div>

        {/* #3 Player */}
        <div className="bg-[#1e293b] border border-slate-700/80 rounded-2xl p-3 text-center flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-amber-900/60 border-2 border-amber-700 flex items-center justify-center font-bold text-amber-300 font-gaming mb-1 text-sm shadow-md">
            🥉
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase">3rd</span>
          <span className="font-gaming font-bold text-xs text-slate-100 truncate w-full">
            {sortedPlayers[2]?.ign}
          </span>
          <span className="text-[11px] font-bold text-amber-400 font-gaming mt-0.5">
            {filter === 'winnings' ? `৳${sortedPlayers[2]?.winnings}` : `${sortedPlayers[2]?.kills} Kills`}
          </span>
        </div>
      </div>

      {/* Players List Table */}
      <div className="bg-[#1e293b] border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-3 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>Rank & Player</span>
          <span>{filter === 'winnings' ? 'Total Won' : 'Kills'}</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {sortedPlayers.map((p) => (
            <div
              key={p.ign}
              className="p-3 flex items-center justify-between hover:bg-slate-800/50 transition-colors text-xs"
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-gaming font-bold text-xs ${
                  p.rank === 1 ? 'bg-amber-500 text-slate-950' :
                  p.rank === 2 ? 'bg-slate-600 text-white' :
                  p.rank === 3 ? 'bg-amber-800 text-amber-200' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {p.rank}
                </span>

                <div>
                  <div className="font-gaming font-bold text-slate-100 flex items-center gap-1.5">
                    <span>{p.ign}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-normal">
                      {p.guild}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>Matches: {p.matches}</span>
                    <span>•</span>
                    <span>Win Rate: {p.winRate}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-gaming font-bold text-sm text-emerald-400">
                  {filter === 'winnings' ? `৳${p.winnings.toLocaleString()}` : `${p.kills} Kills`}
                </div>
                <div className="text-[10px] text-slate-400">
                  {filter === 'winnings' ? `${p.kills} Kills` : `৳${p.winnings}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
