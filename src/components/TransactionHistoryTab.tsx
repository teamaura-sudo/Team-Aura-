import React, { useState } from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  Wallet, 
  Plus, 
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { DepositRequest, PaymentMethod, WithdrawRequest } from '../types';
import { sound } from '../utils/sound';

interface TransactionHistoryTabProps {
  userId: string;
  balance: number;
  deposits: Record<string, DepositRequest>;
  withdraws: Record<string, WithdrawRequest>;
  onOpenWallet: () => void;
  onOpenAuth?: () => void;
}

export const TransactionHistoryTab: React.FC<TransactionHistoryTabProps> = ({
  userId,
  balance,
  deposits,
  withdraws,
  onOpenWallet,
  onOpenAuth,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'deposits' | 'withdraws' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!userId) {
    return (
      <div className="py-12 px-4 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center text-emerald-400">
          <Wallet className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="font-gaming font-bold text-lg text-slate-100">
            Sign In To View Transaction History
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Please log in or register to inspect your full deposit receipts, withdrawal payouts, TrxIDs, and approval timestamps.
          </p>
        </div>
        {onOpenAuth && (
          <button
            onClick={() => {
              sound.playClick();
              onOpenAuth();
            }}
            className="py-2.5 px-6 rounded-xl font-gaming font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
          >
            Sign In To Cashier
          </button>
        )}
      </div>
    );
  }

  const userDeposits = Object.values(deposits)
    .filter(d => d.userId === userId)
    .map(d => ({ ...d, kind: 'deposit' as const }));

  const userWithdraws = Object.values(withdraws)
    .filter(w => w.userId === userId)
    .map(w => ({ ...w, kind: 'withdraw' as const }));

  const allTransactions = [...userDeposits, ...userWithdraws]
    .sort((a, b) => b.timestamp - a.timestamp);

  // Metrics
  const totalDeposited = userDeposits
    .filter(d => d.status === 'Approved')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalWithdrawn = userWithdraws
    .filter(w => w.status === 'Approved')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingCount = allTransactions.filter(t => t.status === 'Pending').length;

  // Filtered
  const filtered = allTransactions.filter(item => {
    if (filterType === 'deposits' && item.kind !== 'deposit') return false;
    if (filterType === 'withdraws' && item.kind !== 'withdraw') return false;
    if (filterType === 'pending' && item.status !== 'Pending') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTrx = 'trx' in item && item.trx.toLowerCase().includes(q);
      const matchAcc = 'account' in item && item.account.toLowerCase().includes(q);
      const matchMethod = item.method.toLowerCase().includes(q);
      const matchAmount = item.amount.toString().includes(q);
      return matchTrx || matchAcc || matchMethod || matchAmount;
    }
    return true;
  });

  const handleCopy = (text: string, id: string) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getMethodBadge = (m: PaymentMethod) => {
    switch (m) {
      case 'bKash':
        return 'text-[#ff4b98] bg-[#e2136e]/10 border-[#e2136e]/30';
      case 'Nagad':
        return 'text-[#ffa33a] bg-[#f7941d]/10 border-[#f7941d]/30';
      case 'Rocket':
        return 'text-[#cb6ce6] bg-[#8c3494]/10 border-[#8c3494]/30';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header and Quick Stats */}
      <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-gaming font-bold text-base sm:text-lg text-slate-100 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-400" />
              <span>Passbook & Transaction History</span>
            </h3>
            <p className="text-xs text-slate-400">
              Track deposit approvals, withdrawal cash-outs, and TrxID verifications
            </p>
          </div>

          <button
            onClick={() => {
              sound.playCoin();
              onOpenWallet();
            }}
            className="py-2 px-4 rounded-xl font-gaming font-bold text-xs bg-emerald-500 hover:bg-emerald-600 text-slate-950 flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Deposit / Cash Out</span>
          </button>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-medium">Current Balance</span>
            <span className="font-gaming font-bold text-base sm:text-lg text-emerald-400">
              ৳{balance.toLocaleString()}
            </span>
          </div>

          <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-medium">Total Deposited</span>
            <span className="font-gaming font-bold text-base sm:text-lg text-emerald-300">
              ৳{totalDeposited.toLocaleString()}
            </span>
          </div>

          <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-medium">Total Withdrawn</span>
            <span className="font-gaming font-bold text-base sm:text-lg text-rose-400">
              ৳{totalWithdrawn.toLocaleString()}
            </span>
          </div>

          <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-medium">Pending Requests</span>
            <span className={`font-gaming font-bold text-base sm:text-lg ${pendingCount > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
              {pendingCount}
            </span>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by TrxID, phone number, method (bKash/Nagad), or amount..."
            className="w-full bg-[#1e293b] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          <button
            onClick={() => { sound.playClick(); setFilterType('all'); }}
            className={`py-1.5 px-3 rounded-lg font-gaming font-semibold whitespace-nowrap transition-all border cursor-pointer ${
              filterType === 'all'
                ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-sm'
                : 'bg-[#1e293b] text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            All History ({allTransactions.length})
          </button>

          <button
            onClick={() => { sound.playClick(); setFilterType('deposits'); }}
            className={`py-1.5 px-3 rounded-lg font-gaming font-semibold whitespace-nowrap transition-all border cursor-pointer ${
              filterType === 'deposits'
                ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-sm'
                : 'bg-[#1e293b] text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            Deposits (+৳)
          </button>

          <button
            onClick={() => { sound.playClick(); setFilterType('withdraws'); }}
            className={`py-1.5 px-3 rounded-lg font-gaming font-semibold whitespace-nowrap transition-all border cursor-pointer ${
              filterType === 'withdraws'
                ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                : 'bg-[#1e293b] text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            Withdrawals (-৳)
          </button>

          <button
            onClick={() => { sound.playClick(); setFilterType('pending'); }}
            className={`py-1.5 px-3 rounded-lg font-gaming font-semibold whitespace-nowrap transition-all border cursor-pointer ${
              filterType === 'pending'
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                : 'bg-[#1e293b] text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            Pending ({pendingCount})
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs space-y-1">
            <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="font-semibold text-slate-300">No transactions found</p>
            <p className="text-[11px] text-slate-500">
              Submit a deposit via bKash/Nagad to add funds to your wallet.
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const isDeposit = item.kind === 'deposit';
            const isApproved = item.status === 'Approved';
            const isRejected = item.status === 'Rejected';
            const isPending = item.status === 'Pending';

            return (
              <div
                key={item.id}
                className="bg-[#1e293b] border border-slate-800 hover:border-slate-700/80 rounded-2xl p-3.5 sm:p-4 transition-all shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                {/* Left side info */}
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    isDeposit
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}>
                    {isDeposit ? (
                      <ArrowDownLeft className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-gaming font-bold text-slate-100 text-sm">
                        {isDeposit ? 'Deposit Money' : 'Cash Out Withdrawal'}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getMethodBadge(item.method)}`}>
                        {item.method}
                      </span>
                    </div>

                    {isDeposit ? (
                      <div className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                        <span>TrxID: <b className="text-amber-400">{(item as DepositRequest).trx}</b></span>
                        <button
                          onClick={() => handleCopy((item as DepositRequest).trx, item.id)}
                          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                          title="Copy TrxID"
                        >
                          {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    ) : (
                      <div className="text-[11px] font-mono text-slate-300">
                        Recipient: <b className="text-slate-200">{(item as WithdrawRequest).account}</b>
                      </div>
                    )}

                    <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(item.timestamp).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      <span>•</span>
                      <span>ID: {item.id}</span>
                    </div>
                  </div>
                </div>

                {/* Right side amount & status */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-slate-800/80 pt-2 sm:pt-0">
                  <div className={`font-gaming font-bold text-base sm:text-lg ${
                    isDeposit ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {isDeposit ? `+৳${item.amount}` : `-৳${item.amount}`}
                  </div>

                  <div className="mt-1">
                    {isApproved ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        Approved & Credited
                      </span>
                    ) : isRejected ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        <XCircle className="w-3 h-3" />
                        Rejected / Invalid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                        <AlertCircle className="w-3 h-3" />
                        Pending Verification
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
