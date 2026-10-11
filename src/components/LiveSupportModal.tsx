import React, { useState } from 'react';
import { 
  X, 
  MessageCircle, 
  Send, 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  FileQuestion, 
  Phone, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { AppSettings, SupportTicket, UserProfile } from '../types';
import { submitSupportTicket, getStoredSupportTickets } from '../lib/firebase';
import { sound } from '../utils/sound';

interface LiveSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  user: UserProfile | null;
}

const FAQS = [
  {
    q: "When will I receive my Free Fire Room ID & Password?",
    a: "Room credentials are automatically unlocked and displayed in the 'My Matches' tab and match cards exactly 10 to 15 minutes before the scheduled match start time. Turn on notifications so you don't miss the entrance!"
  },
  {
    q: "Are PC or Emulator players allowed?",
    a: "No! Team Aura tournaments strictly enforce a Mobile Only policy (Android / iOS phones & tablets only). Any use of BlueStacks, LDPlayer, Nox, or other PC emulators will lead to instant disqualification without refund."
  },
  {
    q: "How fast are bKash & Nagad deposits approved?",
    a: "Deposit requests are typically verified and credited to your wallet in 2 to 5 minutes by our 24/7 cashier team. Make sure you submit the correct TrxID received in your SMS."
  },
  {
    q: "How do I claim my cash prize after winning or getting kills?",
    a: "Take a clear screenshot of the end-game scoreboard showing your placement and kill count. Send it to our official WhatsApp admin within 30 minutes. Your prize money will be credited to your in-app wallet or bKash within 15-30 minutes!"
  },
  {
    q: "What is the minimum withdrawal amount?",
    a: "The minimum cash-out withdrawal is ৳100. Payouts are made directly to your personal bKash, Nagad, or Rocket account without hidden fees."
  }
];

export const LiveSupportModal: React.FC<LiveSupportModalProps> = ({
  isOpen,
  onClose,
  settings,
  user,
}) => {
  const [activeTab, setActiveTab] = useState<'channels' | 'ticket' | 'faq'>('channels');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  // Ticket form
  const [category, setCategory] = useState<SupportTicket['category']>('Deposit / bKash');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const userTickets = getStoredSupportTickets().filter(
    t => user && t.userId === user.id
  );

  const handleSendTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSubmittingTicket(true);
    try {
      submitSupportTicket({
        userId: user ? user.id : 'guest_user',
        userName: user ? user.ign : 'Guest Player',
        category,
        subject: subject.trim(),
        message: message.trim(),
      });
      sound.playSuccess();
      setTicketSuccess('Support ticket created successfully! Our team will respond shortly.');
      setSubject('');
      setMessage('');
      setTimeout(() => setTicketSuccess(null), 4000);
    } catch {
      sound.playAlert();
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const whatsappPhone = (settings.whatsappSupport || '8801789456123').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello Team Aura Support! I am player ${user?.ign || 'Guest'} (UID: ${user?.ffUid || 'N/A'}). I need help regarding:`
  )}`;

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
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-gaming font-bold text-lg text-slate-100">
                Team Aura Help & Support Desk
              </h3>
              <p className="text-xs text-slate-400">
                24/7 Tournament & Wallet Assistance
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
        <div className="flex border-b border-slate-800 bg-slate-900/60 p-1.5 gap-1.5">
          <button
            onClick={() => { sound.playClick(); setActiveTab('channels'); }}
            className={`flex-1 py-2 rounded-xl text-xs font-gaming font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'channels'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Live Channels</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('ticket'); }}
            className={`flex-1 py-2 rounded-xl text-xs font-gaming font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'ticket'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileQuestion className="w-3.5 h-3.5" />
            <span>Open Ticket</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setActiveTab('faq'); }}
            className={`flex-1 py-2 rounded-xl text-xs font-gaming font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'faq'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Instant FAQs</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* TAB 1: LIVE CHANNELS */}
          {activeTab === 'channels' && (
            <div className="space-y-3.5">
              <div className="p-3 rounded-xl bg-[#0f172a] border border-slate-800 space-y-1">
                <span className="font-gaming font-bold text-slate-200 text-sm block">
                  Connect Directly With Our Tournament Host Team
                </span>
                <p className="text-slate-400 text-[11px]">
                  Average response time: 2 - 5 minutes on WhatsApp & Telegram.
                </p>
              </div>

              {/* WhatsApp Live Chat Card */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-slate-900 to-emerald-500/10 border border-emerald-500/40 hover:border-emerald-400 transition-all shadow-lg group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/30 shrink-0">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-gaming font-bold text-sm text-slate-100">
                        Official WhatsApp Support Desk
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-semibold border border-emerald-500/30">
                        Online
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {settings.whatsappSupport || '+880 1789-456123'}
                    </p>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                      <Sparkles className="w-3 h-3" />
                      <span>Instant 1-Click WhatsApp Chat</span>
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors shrink-0" />
              </a>

              {/* Telegram Channel Card */}
              <a
                href={`https://${settings.telegramSupport || 't.me/TeamAuraEsports'}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/15 via-slate-900 to-cyan-500/10 border border-cyan-500/40 hover:border-cyan-400 transition-all shadow-lg group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-cyan-500/30 shrink-0">
                    <Send className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-gaming font-bold text-sm text-slate-100">
                        Telegram Community & Match Alerts
                      </span>
                      <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded font-semibold border border-cyan-500/30">
                        Community
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {settings.telegramSupport || 't.me/TeamAuraEsports'}
                    </p>
                    <span className="text-[10px] text-cyan-400 flex items-center gap-1 mt-0.5">
                      <span>Room passwords and tournament schedules broadcasted here</span>
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0" />
              </a>

              {/* Working Hours note */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="font-semibold text-slate-300 block">Support Operating Hours:</span>
                <p>• Tournament match room & room password help: <b>24/7 Continuous</b></p>
                <p>• bKash & Nagad Cashier verifications: <b>Everyday 09:00 AM – 02:00 AM</b></p>
              </div>
            </div>
          )}

          {/* TAB 2: IN-APP TICKET */}
          {activeTab === 'ticket' && (
            <div className="space-y-4">
              {ticketSuccess && (
                <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{ticketSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSendTicket} className="bg-[#0f172a] p-3.5 rounded-xl border border-slate-800 space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Select Issue Category:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SupportTicket['category'])}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Deposit / bKash">Deposit / bKash / Nagad verification</option>
                    <option value="Withdrawal">Withdrawal / Cash out query</option>
                    <option value="Room Code Issue">Custom Room ID / Password issue</option>
                    <option value="Prize Claim">Tournament Prize claim / Screenshot proof</option>
                    <option value="General Query">General inquiry / Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Subject:
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief description of the problem"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Message Details:
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide full details, TrxID, Match title, or Free Fire UID..."
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingTicket}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 text-slate-950 font-gaming font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingTicket ? 'Submitting...' : 'Submit Support Ticket'}
                </button>
              </form>

              {/* Prior tickets if any */}
              {userTickets.length > 0 && (
                <div className="space-y-2">
                  <span className="font-gaming font-bold text-slate-300 block">
                    Your Open Tickets ({userTickets.length})
                  </span>
                  {userTickets.map(t => (
                    <div key={t.id} className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{t.subject}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                          t.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{t.message}</p>
                      {t.adminReply && (
                        <div className="p-2 bg-slate-900 rounded-lg border border-cyan-500/30 text-[11px] text-cyan-300">
                          <b>Admin Response:</b> {t.adminReply}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FAQS */}
          {activeTab === 'faq' && (
            <div className="space-y-2.5">
              {FAQS.map((faq, idx) => {
                const isOpen = expandedFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setExpandedFaqIndex(isOpen ? null : idx);
                      }}
                      className="w-full p-3 text-left font-gaming font-bold text-slate-200 flex items-center justify-between gap-2 cursor-pointer hover:text-cyan-400 transition-colors"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="p-3 pt-0 text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
