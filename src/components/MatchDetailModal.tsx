import React, { useState } from 'react';
import { 
  X, 
  Key, 
  Lock, 
  Copy, 
  Check, 
  Users, 
  Trophy, 
  Crosshair, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { Match } from '../types';
import { sound } from '../utils/sound';

interface MatchDetailModalProps {
  isOpen: boolean;
  match: Match | null;
  currentUserId: string;
  onClose: () => void;
  onJoinClick: (match: Match) => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  isOpen,
  match,
  currentUserId,
  onClose,
  onJoinClick,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !match) return null;

  const isUserJoined = Boolean(match.participants && match.participants[currentUserId]);
  const userParticipant = match.participants ? match.participants[currentUserId] : undefined;
  const participantsList = match.participants ? Object.values(match.participants) : [];

  const copyToClipboard = (text: string, field: string) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#1e293b] border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0f172a] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
              {match.version} • {match.map}
            </span>
            <h3 className="font-gaming font-bold text-lg text-slate-100">
              {match.title}
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

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Key Match Stats */}
          <div className="grid grid-cols-4 gap-2 bg-[#0f172a] p-3 rounded-xl border border-slate-800 text-center">
            <div>
              <div className="text-[10px] text-slate-400">Total Prize</div>
              <div className="font-gaming font-bold text-amber-400 text-sm mt-0.5">৳{match.prize}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Per Kill</div>
              <div className="font-gaming font-bold text-rose-400 text-sm mt-0.5">৳{match.perKill}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Entry Fee</div>
              <div className="font-gaming font-bold text-cyan-400 text-sm mt-0.5">৳{match.fee}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Slots</div>
              <div className="font-gaming font-bold text-emerald-400 text-sm mt-0.5">
                {match.filledSlots}/{match.totalSlots}
              </div>
            </div>
          </div>

          {/* Room Credentials Card */}
          <div className="bg-gradient-to-br from-slate-900 to-[#0f172a] p-3.5 rounded-xl border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-gaming font-bold text-amber-400 text-sm">
                <Key className="w-4 h-4" />
                <span>Room Access Information</span>
              </div>
              {isUserJoined && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
                  You are Slot #{userParticipant?.slotNumber}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-slate-800/90 p-2.5 rounded-lg border border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Room ID</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {match.roomId || 'Pending (10m before)'}
                  </span>
                </div>
                {match.roomId && match.roomId !== 'Pending' && !match.roomId.includes('Pending') && (
                  <button
                    onClick={() => copyToClipboard(match.roomId || '', 'room_id')}
                    className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-300"
                    title="Copy Room ID"
                  >
                    {copiedField === 'room_id' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>

              <div className="bg-slate-800/90 p-2.5 rounded-lg border border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Room Password</span>
                  <span className="font-mono font-bold text-amber-300 text-sm">
                    {isUserJoined 
                      ? (match.roomPass || 'Pending')
                      : '•••••• (Join to reveal)'}
                  </span>
                </div>
                {isUserJoined && match.roomPass && match.roomPass !== 'Pending' && (
                  <button
                    onClick={() => copyToClipboard(match.roomPass || '', 'room_pass')}
                    className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-300"
                    title="Copy Password"
                  >
                    {copiedField === 'room_pass' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              ⚠️ Room credentials are published exactly 10 minutes before the match start time ({match.startTime}). Keep notifications on.
            </p>
          </div>

          {/* How to Join Free Fire Guide */}
          <div className="bg-[#0f172a] p-3.5 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-gaming font-bold text-slate-200 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Smartphone className="w-3.5 h-3.5 text-orange-400" />
              <span>How To Enter The Custom Room in Free Fire</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
              <li>Open Garena Free Fire on your mobile device.</li>
              <li>Go to Mode selection and choose <b className="text-slate-200">Custom</b> (bottom right).</li>
              <li>Type or paste the <b className="text-emerald-400">Room ID</b> in the search bar.</li>
              <li>Click Join and enter the <b className="text-amber-400">Room Password</b>.</li>
              <li>Sit on your registered slot and do not switch slots or you will be kicked!</li>
            </ol>
          </div>

          {/* Registered Players List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-gaming font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Joined Players ({participantsList.length}/{match.totalSlots})</span>
              </span>
            </div>

            {participantsList.length === 0 ? (
              <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800 text-center text-slate-500">
                No players joined yet. Be the first to register!
              </div>
            ) : (
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                {participantsList.map((p, idx) => (
                  <div
                    key={p.userId || idx}
                    className={`flex items-center justify-between p-2 rounded-lg border text-xs ${
                      p.userId === currentUserId
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                        : 'bg-[#0f172a] border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-mono text-[10px] text-slate-400">
                        {p.slotNumber || idx + 1}
                      </span>
                      <span className="font-semibold">{p.ign}</span>
                      {p.userId === currentUserId && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">
                      UID: {p.ffUid || 'Hidden'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0f172a] flex items-center justify-between gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
          >
            Close
          </button>

          {!isUserJoined && match.filledSlots < match.totalSlots && (
            <button
              onClick={() => {
                sound.playClick();
                onClose();
                onJoinClick(match);
              }}
              className="flex-1 py-2.5 px-4 rounded-xl font-gaming font-bold text-xs bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 transition-all shadow-md shadow-orange-500/25 flex items-center justify-center gap-1.5"
            >
              <span>Register Now (৳{match.fee})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
