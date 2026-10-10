/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { 
  Home, 
  Swords, 
  Trophy, 
  User, 
  Wallet, 
  Search, 
  Filter, 
  Flame, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Header } from './components/Header';
import { NoticeBanner } from './components/NoticeBanner';
import { TournamentCard } from './components/TournamentCard';
import { WalletModal } from './components/WalletModal';
import { JoinMatchModal } from './components/JoinMatchModal';
import { MatchDetailModal } from './components/MatchDetailModal';
import { MyMatchesTab } from './components/MyMatchesTab';
import { LeaderboardTab } from './components/LeaderboardTab';
import { ProfileTab } from './components/ProfileTab';
import { RulesModal } from './components/RulesModal';
import { 
  DEFAULT_SETTINGS, 
  DEFAULT_USER, 
  INITIAL_MATCHES, 
  subscribeToPath, 
  submitDepositRequest, 
  submitWithdrawRequest, 
  registerForMatch, 
  updateUserProfile,
  isConnectedToFirebase
} from './lib/firebase';
import { AppSettings, DepositRequest, Match, PaymentMethod, UserProfile, WithdrawRequest } from './types';
import { sound } from './utils/sound';

type NavTab = 'tournaments' | 'my-matches' | 'leaderboard' | 'profile';

export default function App() {
  const currentUserId = "user_demo_123";

  // Navigation
  const [activeTab, setActiveTab] = useState<NavTab>('tournaments');

  // Core Data States
  const [notice, setNotice] = useState<string>(DEFAULT_SETTINGS.notice);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [matches, setMatches] = useState<Record<string, Match>>(INITIAL_MATCHES);
  const [deposits, setDeposits] = useState<Record<string, DepositRequest>>({});
  const [withdraws, setWithdraws] = useState<Record<string, WithdrawRequest>>({});
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [balance, setBalance] = useState<number>(DEFAULT_USER.balance);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Solo' | 'Squad' | 'Clash Squad'>('All');

  // Modals
  const [isWalletOpen, setIsWalletOpen] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [selectedMatchForJoin, setSelectedMatchForJoin] = useState<Match | null>(null);
  const [selectedMatchForDetails, setSelectedMatchForDetails] = useState<Match | null>(null);

  // Sound state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(sound.isEnabled());
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Subscriptions to Realtime Database / Local Fallback
  useEffect(() => {
    // 1. Notice
    const unsubNotice = subscribeToPath<string>('settings/notice', DEFAULT_SETTINGS.notice, (val) => {
      if (val) setNotice(val);
    });

    // 2. Settings
    const unsubSettings = subscribeToPath<AppSettings>('settings', DEFAULT_SETTINGS, (val) => {
      if (val) setSettings(val);
    });

    // 3. User Balance
    const unsubBalance = subscribeToPath<number>(`users/${currentUserId}/balance`, DEFAULT_USER.balance, (val) => {
      if (typeof val === 'number') {
        setBalance(val);
        setUser(prev => ({ ...prev, balance: val }));
      }
    });

    // 4. User Profile
    const unsubUser = subscribeToPath<UserProfile>(`users/${currentUserId}`, DEFAULT_USER, (val) => {
      if (val) {
        setUser(prev => ({ ...prev, ...val }));
        if (typeof val.balance === 'number') setBalance(val.balance);
      }
    });

    // 5. Matches
    const unsubMatches = subscribeToPath<Record<string, Match>>('matches', INITIAL_MATCHES, (val) => {
      if (val && typeof val === 'object') {
        setMatches(val);
      }
    });

    // 6. Deposits
    const unsubDeposits = subscribeToPath<Record<string, DepositRequest>>('deposits', {}, (val) => {
      if (val && typeof val === 'object') {
        setDeposits(val);
      }
    });

    // 7. Withdraws
    const unsubWithdraws = subscribeToPath<Record<string, WithdrawRequest>>('withdraws', {}, (val) => {
      if (val && typeof val === 'object') {
        setWithdraws(val);
      }
    });

    const checkInterval = setInterval(() => {
      setIsOnline(navigator.onLine);
    }, 5000);

    return () => {
      unsubNotice();
      unsubSettings();
      unsubBalance();
      unsubUser();
      unsubMatches();
      unsubDeposits();
      unsubWithdraws();
      clearInterval(checkInterval);
    };
  }, [currentUserId]);

  // Actions
  const handleDeposit = async (data: { amount: number; trx: string; method: PaymentMethod; senderPhone?: string }) => {
    await submitDepositRequest({
      userId: currentUserId,
      userName: user.ign,
      amount: data.amount,
      trx: data.trx,
      senderPhone: data.senderPhone,
      method: data.method,
    });
  };

  const handleWithdraw = async (data: { amount: number; account: string; method: PaymentMethod }) => {
    await submitWithdrawRequest({
      userId: currentUserId,
      userName: user.ign,
      amount: data.amount,
      account: data.account,
      method: data.method,
    });
  };

  const handleConfirmJoin = async (matchId: string, ign: string, ffUid: string, fee: number) => {
    const res = await registerForMatch(matchId, {
      userId: currentUserId,
      ign,
      ffUid,
      joinedAt: Date.now(),
      slotNumber: 0,
    }, fee);

    if (res.success) {
      // update profile in case ign or ffUid changed
      await updateUserProfile(currentUserId, { ign, ffUid });
    }
    return res;
  };

  const handleToggleSound = () => {
    const enabled = sound.toggleSound();
    setSoundEnabled(enabled);
  };

  // Filter matches list
  const matchesList = matches && typeof matches === 'object' ? Object.values(matches) : Object.values(INITIAL_MATCHES);
  const filteredMatches = matchesList.filter((m) => {
    if (!m) return false;
    const matchesFilter = selectedFilter === 'All' || m.version === selectedFilter;
    const matchesSearch = 
      (m.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.map || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.version || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const enrolledCount = matchesList.filter(
    (m) => m && m.participants && m.participants[currentUserId]
  ).length;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col pb-20 sm:pb-24 selection:bg-orange-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        balance={balance}
        onOpenWallet={() => setIsWalletOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenRules={() => setIsRulesOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3.5 sm:px-6 pt-3 pb-8">
        {/* Notice Bar */}
        <NoticeBanner notice={notice} />

        {/* Tab 1: Running Tournaments */}
        {activeTab === 'tournaments' && (
          <div className="space-y-4">
            {/* Search & Mode Filters */}
            <div className="space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search matches (Bermuda, Clash Squad, Squad...)"
                  className="w-full bg-[#1e293b]/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors shadow-inner"
                />
              </div>

              {/* Mode Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {(['All', 'Solo', 'Squad', 'Clash Squad'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      sound.playClick();
                      setSelectedFilter(filter);
                    }}
                    className={`py-1.5 px-3 rounded-lg font-gaming font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                      selectedFilter === filter
                        ? 'bg-orange-500 text-slate-950 border-orange-500 shadow-md shadow-orange-500/20'
                        : 'bg-[#1e293b] text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {filter === 'All' ? '⚡ All Matches' : filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Tournaments List Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs px-1 text-slate-400">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>Running & Upcoming Tournaments ({filteredMatches.length})</span>
                </span>
                <span className="text-[11px] text-emerald-400 font-medium">
                  Auto room code release
                </span>
              </div>

              {filteredMatches.length === 0 ? (
                <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-8 text-center space-y-2">
                  <Layers className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-slate-300 font-gaming font-bold text-sm">
                    No tournaments match your filter.
                  </p>
                  <p className="text-xs text-slate-500">
                    Try switching filters or check back later!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {filteredMatches.map((m) => (
                    <TournamentCard
                      key={m.id}
                      match={m}
                      currentUserId={currentUserId}
                      onJoinClick={(match) => setSelectedMatchForJoin(match)}
                      onViewDetails={(match) => setSelectedMatchForDetails(match)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: My Matches */}
        {activeTab === 'my-matches' && (
          <MyMatchesTab
            matches={matchesList}
            currentUserId={currentUserId}
            onExploreMatches={() => setActiveTab('tournaments')}
            onViewDetails={(match) => setSelectedMatchForDetails(match)}
          />
        )}

        {/* Tab 3: Leaderboard */}
        {activeTab === 'leaderboard' && (
          <LeaderboardTab />
        )}

        {/* Tab 4: Profile */}
        {activeTab === 'profile' && (
          <ProfileTab
            user={user}
            settings={settings}
            onOpenWallet={() => setIsWalletOpen(true)}
            onUpdateProfile={async (partial) => {
              await updateUserProfile(currentUserId, partial);
            }}
            onOpenRules={() => setIsRulesOpen(true)}
          />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0f172a]/95 backdrop-blur-md border-t border-slate-800 shadow-2xl">
        <div className="max-w-md mx-auto grid grid-cols-4 py-1.5 px-2">
          {/* Home / Tournaments */}
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('tournaments');
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              activeTab === 'tournaments'
                ? 'text-orange-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] font-gaming">Tournaments</span>
          </button>

          {/* My Matches */}
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('my-matches');
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all relative ${
              activeTab === 'my-matches'
                ? 'text-orange-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Swords className="w-5 h-5 mb-0.5" />
              {enrolledCount > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-bold text-[9px] flex items-center justify-center font-mono">
                  {enrolledCount}
                </span>
              )}
            </div>
            <span className="text-[11px] font-gaming">My Matches</span>
          </button>

          {/* Leaderboard */}
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('leaderboard');
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              activeTab === 'leaderboard'
                ? 'text-orange-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] font-gaming">Top Winners</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('profile');
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              activeTab === 'profile'
                ? 'text-orange-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] font-gaming">Profile</span>
          </button>
        </div>
      </nav>

      {/* MODALS */}
      {/* 1. Wallet Modal */}
      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        balance={balance}
        userId={currentUserId}
        settings={settings}
        deposits={deposits}
        withdraws={withdraws}
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
      />

      {/* 2. Join Match Modal */}
      <JoinMatchModal
        isOpen={Boolean(selectedMatchForJoin)}
        match={selectedMatchForJoin}
        user={user}
        onClose={() => setSelectedMatchForJoin(null)}
        onConfirmJoin={handleConfirmJoin}
        onOpenWallet={() => {
          setSelectedMatchForJoin(null);
          setIsWalletOpen(true);
        }}
      />

      {/* 3. Match Details & Slots Modal */}
      <MatchDetailModal
        isOpen={Boolean(selectedMatchForDetails)}
        match={selectedMatchForDetails}
        currentUserId={currentUserId}
        onClose={() => setSelectedMatchForDetails(null)}
        onJoinClick={(match) => {
          setSelectedMatchForDetails(null);
          setSelectedMatchForJoin(match);
        }}
      />

      {/* 4. Rules Modal */}
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />
    </div>
  );
}
