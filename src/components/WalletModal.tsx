import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Copy, 
  Check, 
  Clock, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { AppSettings, DepositRequest, PaymentMethod, WithdrawRequest } from '../types';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  userId: string;
  settings: AppSettings;
  deposits: Record<string, DepositRequest>;
  withdraws: Record<string, WithdrawRequest>;
  onDeposit: (data: { amount: number; trx: string; method: PaymentMethod; senderPhone?: string }) => Promise<void>;
  onWithdraw: (data: { amount: number; account: string; method: PaymentMethod }) => Promise<void>;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  balance,
  userId,
  settings,
  deposits,
  withdraws,
  onDeposit,
  onWithdraw,
}) => {
  const [tab, setTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');
  const [method, setMethod] = useState<PaymentMethod>('bKash');

  // Deposit inputs
  const [depAmount, setDepAmount] = useState<string>('100');
  const [depTrx, setDepTrx] = useState<string>('');
  const [depSender, setDepSender] = useState<string>('');
  const [isSubmittingDep, setIsSubmittingDep] = useState<boolean>(false);

  // Withdraw inputs
  const [witAmount, setWitAmount] = useState<string>('100');
  const [witAccount, setWitAccount] = useState<string>('');
  const [isSubmittingWit, setIsSubmittingWit] = useState<boolean>(false);

  const [copiedNumber, setCopiedNumber] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const getAdminNumber = () => {
    switch (method) {
      case 'bKash':
        return settings.bkashNumber || '01789456123';
      case 'Nagad':
        return settings.nagadNumber || '01898765432';
      case 'Rocket':
        return settings.rocketNumber || '01912345678';
    }
  };

  const handleCopyNumber = () => {
    sound.playClick();
    navigator.clipboard.writeText(getAdminNumber());
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleSendDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(depAmount);
    if (!amountNum || amountNum < settings.minDeposit) {
      setFeedbackMsg({ text: `Minimum deposit amount is ৳${settings.minDeposit}`, type: 'error' });
      sound.playAlert();
      return;
    }
    if (!depTrx.trim()) {
      setFeedbackMsg({ text: 'Please enter the Transaction ID (TrxID) from your bKash/Nagad SMS', type: 'error' });
      sound.playAlert();
      return;
    }

    try {
      setIsSubmittingDep(true);
      await onDeposit({
        amount: amountNum,
        trx: depTrx.trim().toUpperCase(),
        method,
        senderPhone: depSender.trim(),
      });
      sound.playSuccess();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      setFeedbackMsg({ text: 'Deposit request submitted! Admin will verify and add funds shortly.', type: 'success' });
      setDepTrx('');
      setDepSender('');
    } catch {
      setFeedbackMsg({ text: 'Failed to submit deposit request. Please try again.', type: 'error' });
    } finally {
      setIsSubmittingDep(false);
    }
  };

  const handleSendWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(witAmount);
    if (!amountNum || amountNum < settings.minWithdraw) {
      setFeedbackMsg({ text: `Minimum withdrawal amount is ৳${settings.minWithdraw}`, type: 'error' });
      sound.playAlert();
      return;
    }
    if (amountNum > balance) {
      setFeedbackMsg({ text: `Insufficient balance! Your current balance is ৳${balance}`, type: 'error' });
      sound.playAlert();
      return;
    }
    if (!witAccount.trim() || witAccount.trim().length < 11) {
      setFeedbackMsg({ text: 'Please enter a valid 11-digit bKash/Nagad/Rocket account number', type: 'error' });
      sound.playAlert();
      return;
    }

    try {
      setIsSubmittingWit(true);
      await onWithdraw({
        amount: amountNum,
        account: witAccount.trim(),
        method,
      });
      sound.playSuccess();
      setFeedbackMsg({ text: 'Withdrawal request submitted! Money will be sent to your account.', type: 'success' });
      setWitAccount('');
    } catch {
      setFeedbackMsg({ text: 'Failed to submit withdrawal request.', type: 'error' });
    } finally {
      setIsSubmittingWit(false);
    }
  };

  // Filter user's transactions
  const userDeposits = Object.values(deposits)
    .filter(d => d.userId === userId)
    .sort((a, b) => b.timestamp - a.timestamp);

  const userWithdraws = Object.values(withdraws)
    .filter(w => w.userId === userId)
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#1e293b] border border-slate-700/80 rounded-2xl w-full max-w-md max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0f172a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-gaming font-bold text-lg text-slate-100">
                Wallet & Cashier
              </h3>
              <p className="text-xs text-slate-400">
                Current Balance: <span className="font-bold text-emerald-400">৳{balance.toLocaleString()}</span>
              </p>
            </div>
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

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 p-1.5 gap-1.5">
          <button
            onClick={() => {
              sound.playClick();
              setTab('deposit');
              setFeedbackMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-gaming font-bold flex items-center justify-center gap-1.5 transition-all ${
              tab === 'deposit'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Deposit</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setTab('withdraw');
              setFeedbackMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-gaming font-bold flex items-center justify-center gap-1.5 transition-all ${
              tab === 'withdraw'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            <span>Withdraw</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setTab('history');
              setFeedbackMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-gaming font-bold flex items-center justify-center gap-1.5 transition-all ${
              tab === 'history'
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Passbook</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Feedback Banner */}
          {feedbackMsg && (
            <div className={`p-3 rounded-xl text-xs flex items-start gap-2 border ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          {/* DEPOSIT TAB */}
          {tab === 'deposit' && (
            <form onSubmit={handleSendDeposit} className="space-y-4">
              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-2 block">
                  Select Payment Gateway:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['bKash', 'Nagad', 'Rocket'] as PaymentMethod[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setMethod(m);
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                        method === m
                          ? m === 'bKash'
                            ? 'bg-[#e2136e]/20 border-[#e2136e] text-[#ff4b98] shadow-md shadow-[#e2136e]/20'
                            : m === 'Nagad'
                              ? 'bg-[#f7941d]/20 border-[#f7941d] text-[#ffa33a] shadow-md shadow-[#f7941d]/20'
                              : 'bg-[#8c3494]/20 border-[#8c3494] text-[#cb6ce6] shadow-md shadow-[#8c3494]/20'
                          : 'bg-slate-900 border-slate-700/80 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <span className="text-sm">
                        {m === 'bKash' ? '🌸' : m === 'Nagad' ? '🔥' : '🚀'}
                      </span>
                      <span>{m}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Number Info Box */}
              <div className="bg-[#0f172a] p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Send Money ({method} Personal):</span>
                  <span className="text-[10px] text-emerald-400 uppercase font-semibold">24/7 Active</span>
                </div>
                <div className="flex items-center justify-between bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-700">
                  <span className="font-mono font-bold text-orange-400 text-sm tracking-wide">
                    {getAdminNumber()}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyNumber}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded border border-slate-600 transition-colors"
                  >
                    {copiedNumber ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>Send Money via {method} &gt; Copy TrxID &gt; Enter below</span>
                </p>
              </div>

              {/* Quick Amount Chips */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Quick Amount:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[50, 100, 200, 500].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setDepAmount(amt.toString());
                      }}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold font-gaming border transition-colors ${
                        depAmount === amt.toString()
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      +৳{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deposit Inputs */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Deposit Amount (৳):
                </label>
                <input
                  type="number"
                  min={settings.minDeposit}
                  value={depAmount}
                  onChange={(e) => setDepAmount(e.target.value)}
                  placeholder={`Min ৳${settings.minDeposit}`}
                  required
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-gaming font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Transaction ID (TrxID):
                </label>
                <input
                  type="text"
                  value={depTrx}
                  onChange={(e) => setDepTrx(e.target.value)}
                  placeholder="e.g. 9J4K2L89XP"
                  required
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono uppercase"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Sender Phone Number (Optional):
                </label>
                <input
                  type="tel"
                  value={depSender}
                  onChange={(e) => setDepSender(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmittingDep}
                className="w-full py-3 px-4 rounded-xl font-gaming font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {isSubmittingDep ? 'Submitting...' : 'Submit Deposit Request'}
              </button>
            </form>
          )}

          {/* WITHDRAW TAB */}
          {tab === 'withdraw' && (
            <form onSubmit={handleSendWithdraw} className="space-y-4">
              <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Available to Withdraw:</span>
                <span className="font-gaming font-bold text-emerald-400 text-sm">৳{balance}</span>
              </div>

              {/* Method Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-2 block">
                  Withdraw to:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['bKash', 'Nagad', 'Rocket'] as PaymentMethod[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setMethod(m);
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                        method === m
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-md shadow-rose-500/20'
                          : 'bg-slate-900 border-slate-700/80 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <span className="text-sm">
                        {m === 'bKash' ? '🌸' : m === 'Nagad' ? '🔥' : '🚀'}
                      </span>
                      <span>{m}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Withdraw Amount (৳):
                </label>
                <input
                  type="number"
                  min={settings.minWithdraw}
                  max={balance}
                  value={witAmount}
                  onChange={(e) => setWitAmount(e.target.value)}
                  placeholder={`Min ৳${settings.minWithdraw}`}
                  required
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-gaming font-semibold"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Minimum withdrawal is ৳{settings.minWithdraw}. Processed in 10-30 mins.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  {method} Personal Account Number:
                </label>
                <input
                  type="tel"
                  value={witAccount}
                  onChange={(e) => setWitAccount(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  required
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingWit || balance < settings.minWithdraw}
                className="w-full py-3 px-4 rounded-xl font-gaming font-bold text-sm bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white transition-all shadow-lg shadow-rose-500/20 active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {isSubmittingWit ? 'Submitting...' : 'Submit Withdraw Request'}
              </button>
            </form>
          )}

          {/* HISTORY TAB */}
          {tab === 'history' && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                <span>Recent Transactions</span>
                <span>{userDeposits.length + userWithdraws.length} entries</span>
              </div>

              {userDeposits.length === 0 && userWithdraws.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No deposits or withdrawals yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Deposits */}
                  {userDeposits.map((d) => (
                    <div
                      key={d.id}
                      className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                          <ArrowDownLeft className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200">
                            Deposit via {d.method}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            TrxID: {d.trx}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-gaming font-bold text-emerald-400">
                          +৳{d.amount}
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                          d.status === 'Approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : d.status === 'Rejected'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}>
                          {d.status}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Withdrawals */}
                  {userWithdraws.map((w) => (
                    <div
                      key={w.id}
                      className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200">
                            Withdraw to {w.method}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {w.account}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-gaming font-bold text-rose-400">
                          -৳{w.amount}
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                          w.status === 'Approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : w.status === 'Rejected'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}>
                          {w.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
