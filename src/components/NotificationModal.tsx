import React from 'react';
import { 
  X, 
  Bell, 
  Check, 
  CheckCheck, 
  Key, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Swords, 
  Sparkles, 
  Clock, 
  Trash2,
  Send
} from 'lucide-react';
import { AppNotification } from '../types';
import { sound } from '../utils/sound';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onSendSimulationAlert: (type: 'room' | 'deposit' | 'tournament') => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onSendSimulationAlert,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'room':
        return <Key className="w-4 h-4 text-amber-400" />;
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-emerald-400" />;
      case 'withdraw':
        return <ArrowUpRight className="w-4 h-4 text-rose-400" />;
      case 'tournament':
        return <Swords className="w-4 h-4 text-orange-400" />;
      default:
        return <Bell className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#1e293b] border border-orange-500/40 rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden glow-orange"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0f172a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-gaming font-bold text-lg text-slate-100">
                  Notification Center
                </h3>
                {unreadCount > 0 && (
                  <span className="bg-orange-500 text-slate-950 px-2 py-0.2 rounded-full text-[10px] font-bold font-mono">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Live alerts for room codes & cashier approvals
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

        {/* Toolbar */}
        <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>{notifications.length} Total Alerts</span>
          {unreadCount > 0 && (
            <button
              onClick={() => {
                sound.playClick();
                onMarkAllRead();
              }}
              className="text-orange-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs space-y-2">
              <Bell className="w-8 h-8 text-slate-600 mx-auto" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (!n.read) onMarkRead(n.id);
                }}
                className={`p-3 rounded-xl border transition-all text-xs cursor-pointer flex items-start gap-3 ${
                  n.read
                    ? 'bg-[#0f172a]/60 border-slate-800 text-slate-400'
                    : 'bg-gradient-to-r from-orange-500/10 via-[#0f172a] to-orange-500/5 border-orange-500/40 text-slate-200 shadow-md'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 space-y-1 overflow-hidden">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`font-semibold truncate ${n.read ? 'text-slate-300' : 'text-orange-300 font-bold'}`}>
                      {n.title}
                    </span>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0 animate-pulse" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {n.message}
                  </p>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Live Simulation Controls for User Testing */}
        <div className="p-3 bg-[#0f172a] border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Test Real-Time Alert Engine:</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold font-gaming">
            <button
              onClick={() => {
                sound.playSuccess();
                onSendSimulationAlert('room');
              }}
              className="py-1.5 px-2 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 rounded-lg transition-colors cursor-pointer"
            >
              🔑 Room Release
            </button>
            <button
              onClick={() => {
                sound.playSuccess();
                onSendSimulationAlert('deposit');
              }}
              className="py-1.5 px-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 rounded-lg transition-colors cursor-pointer"
            >
              💰 Deposit Approved
            </button>
            <button
              onClick={() => {
                sound.playSuccess();
                onSendSimulationAlert('tournament');
              }}
              className="py-1.5 px-2 bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-300 rounded-lg transition-colors cursor-pointer"
            >
              ⚔️ New Tournament
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
