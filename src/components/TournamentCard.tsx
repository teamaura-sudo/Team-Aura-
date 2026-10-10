import React, { useState } from 'react';
import { 
  Users, 
  Trophy, 
  Crosshair, 
  Key, 
  Lock, 
  Copy, 
  Check, 
  MapPin, 
  Clock, 
  Swords, 
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Match } from '../types';
import { sound } from '../utils/sound';

interface TournamentCardProps {
  match: Match;
  currentUserId: string;
  onJoinClick: (match: Match) => void;
  onViewDetails: (match: Match) => void;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({
  match,
  currentUserId,
  onJoinClick,
  onViewDetails,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const isUserJoined = Boolean(match.participants && match.participants[currentUserId]);
  const userParticipant = match.participants ? match.participants[currentUserId] : undefined;
  const isFull = match.filledSlots >= match.totalSlots;
  const slotsPercent = Math.min(100, Math.round((match.filledSlots / match.totalSlots) * 100));

  const copyToClipboard = (text: string, field: string) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getMapColor = (map: string) => {
    switch (map.toLowerCase()) {
      case 'bermuda':
        return 'from-emerald-500/20 to-teal-900/30 border-emerald-500/40 text-emerald-400';
      case 'purgatory':
        return 'from-amber-500/20 to-orange-950/30 border-amber-500/40 text-amber-400';
      case 'kalahari':
        return 'from-yellow-500/20 to-amber-950/30 border-yellow-500/40 text-yellow-400';
      case 'alpine':
        return 'from-cyan-500/20 to-blue-950/30 border-cyan-500/40 text-cyan-400';
      default:
        return 'from-purple-500/20 to-indigo-950/30 border-purple-500/40 text-purple-400';
    }
  };

  const getModeBadge = (mode: string) => {
    switch (mode) {
      case 'Solo':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Duo':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Squad':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Clash Squad':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  const hasRoomCredentials = match.roomId && match.roomId !== 'Pending' && !match.roomId.includes('Pending');

  return (
    <div className={`relative bg-[#1e293b]/90 border rounded-2xl p-4 sm:p-5 transition-all duration-200 backdrop-blur-sm shadow-xl hover:shadow-orange-500/5 ${
      isUserJoined 
        ? 'border-emerald-500/60 shadow-emerald-500/10' 
        : 'border-slate-800 hover:border-slate-700'
    }`}>
      {/* Joined Ribbon */}
      {isUserJoined && (
        <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-slate-950 text-[11px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md flex items-center gap-1 font-gaming border border-emerald-300/40">
          <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Registered (Slot #{userParticipant?.slotNumber})</span>
        </div>
      )}

      {/* Header Info */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md uppercase font-gaming border ${getModeBadge(match.version)}`}>
              {match.version}
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 ${getMapColor(match.map)}`}>
              <MapPin className="w-3 h-3" />
              {match.map}
            </span>
            {match.type && (
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                {match.type}
              </span>
            )}
          </div>
          <h3 className="font-gaming font-bold text-base sm:text-lg text-slate-100 tracking-wide mt-1.5 leading-snug">
            {match.title}
          </h3>
        </div>

        {/* Status Tag */}
        <div className="shrink-0 text-right">
          {match.status === 'Live' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              LIVE NOW
            </span>
          ) : match.status === 'Completed' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
              Finished
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span>{match.startTime}</span>
            </span>
          )}
        </div>
      </div>

      {/* Prize & Fee Grid */}
      <div className="grid grid-cols-3 gap-2 bg-[#0f172a]/80 p-2.5 sm:p-3 rounded-xl border border-slate-800/80 mb-3.5">
        {/* Win Prize */}
        <div className="text-center border-r border-slate-800/80 pr-1">
          <div className="text-[10px] sm:text-xs text-slate-400 font-medium flex items-center justify-center gap-1">
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>Prize Pool</span>
          </div>
          <div className="text-amber-400 font-gaming font-bold text-sm sm:text-base mt-0.5">
            ৳{match.prize}
          </div>
        </div>

        {/* Per Kill */}
        <div className="text-center border-r border-slate-800/80 px-1">
          <div className="text-[10px] sm:text-xs text-slate-400 font-medium flex items-center justify-center gap-1">
            <Crosshair className="w-3 h-3 text-rose-400" />
            <span>Per Kill</span>
          </div>
          <div className="text-rose-400 font-gaming font-bold text-sm sm:text-base mt-0.5">
            ৳{match.perKill || 0}
          </div>
        </div>

        {/* Entry Fee */}
        <div className="text-center pl-1">
          <div className="text-[10px] sm:text-xs text-slate-400 font-medium flex items-center justify-center gap-1">
            <Swords className="w-3 h-3 text-cyan-400" />
            <span>Entry Fee</span>
          </div>
          <div className="text-cyan-400 font-gaming font-bold text-sm sm:text-base mt-0.5">
            ৳{match.fee}
          </div>
        </div>
      </div>

      {/* Slots Progress Bar */}
      <div className="mb-3.5">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>Slots Joined</span>
          </span>
          <span className="font-gaming font-bold text-slate-300">
            <span className={isFull ? 'text-rose-400' : 'text-orange-400'}>{match.filledSlots}</span>
            <span className="text-slate-500"> / </span>
            {match.totalSlots}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isFull
                ? 'bg-gradient-to-r from-rose-500 to-red-600'
                : 'bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500'
            }`}
            style={{ width: `${slotsPercent}%` }}
          />
        </div>
      </div>

      {/* Room Box (Visible when joined OR when published) */}
      <div className={`p-3 rounded-xl border mb-3.5 transition-all ${
        isUserJoined
          ? 'bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-emerald-950/20 border-emerald-500/40 shadow-inner'
          : hasRoomCredentials
            ? 'bg-[#0f172a] border-cyan-500/30'
            : 'bg-[#0f172a] border-dashed border-slate-700/60'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-gaming uppercase tracking-wider text-amber-400">
              Custom Room Credentials
            </span>
          </div>
          {isUserJoined ? (
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Unlocked for you
            </span>
          ) : (
            <span className="text-[10px] text-slate-400 font-medium">
              Join match to view password
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* Room ID */}
          <div className="flex items-center justify-between bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="text-slate-400 text-[11px]">Room ID:</span>
              <span className="font-mono font-bold text-emerald-400 truncate">
                {match.roomId || 'Pending (10m before)'}
              </span>
            </div>
            {match.roomId && match.roomId !== 'Pending' && !match.roomId.includes('Pending') && (
              <button
                onClick={() => copyToClipboard(match.roomId || '', 'room_id')}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-emerald-400 transition-colors"
                title="Copy Room ID"
              >
                {copiedField === 'room_id' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>

          {/* Room Password */}
          <div className="flex items-center justify-between bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <Lock className="w-3 h-3 text-slate-400" />
              <span className="text-slate-400 text-[11px]">Password:</span>
              <span className="font-mono font-bold text-amber-300 truncate">
                {isUserJoined 
                  ? (match.roomPass || 'Pending')
                  : hasRoomCredentials 
                    ? '•••••• (Join to view)' 
                    : (match.roomPass || 'Pending')}
              </span>
            </div>
            {isUserJoined && match.roomPass && match.roomPass !== 'Pending' && (
              <button
                onClick={() => copyToClipboard(match.roomPass || '', 'room_pass')}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-amber-400 transition-colors"
                title="Copy Password"
              >
                {copiedField === 'room_pass' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {isUserJoined ? (
          <button
            onClick={() => {
              sound.playClick();
              onViewDetails(match);
            }}
            className="flex-1 py-2.5 px-4 rounded-xl font-gaming font-bold text-sm bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>View Match Room & Slots</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : isFull ? (
          <button
            disabled
            className="flex-1 py-2.5 px-4 rounded-xl font-gaming font-bold text-sm bg-slate-800/80 text-slate-500 border border-slate-800 cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>Match Slots Full</span>
          </button>
        ) : (
          <button
            onClick={() => {
              sound.playClick();
              onJoinClick(match);
            }}
            className="flex-1 py-2.5 px-4 rounded-xl font-gaming font-bold text-sm bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-500/25 active:scale-[0.98] cursor-pointer glow-orange-sm"
          >
            <Swords className="w-4 h-4" />
            <span>Join Now (৳{match.fee})</span>
          </button>
        )}

        <button
          onClick={() => {
            sound.playClick();
            onViewDetails(match);
          }}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Details & Rules"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
