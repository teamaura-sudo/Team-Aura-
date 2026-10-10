export type MatchMode = 'Solo' | 'Duo' | 'Squad' | 'Clash Squad';
export type MatchStatus = 'Upcoming' | 'Live' | 'Completed';
export type PaymentMethod = 'bKash' | 'Nagad' | 'Rocket';
export type TransactionStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Participant {
  userId: string;
  ign: string;
  ffUid: string;
  joinedAt: number;
  slotNumber: number;
  kills?: number;
  winnings?: number;
}

export interface Match {
  id: string;
  title: string;
  map: 'Bermuda' | 'Purgatory' | 'Kalahari' | 'Alpine' | 'Nextra' | string;
  version: MatchMode | string;
  type?: 'TPP' | 'FPP';
  fee: number;
  prize: number;
  perKill: number;
  totalSlots: number;
  filledSlots: number;
  startTime: string; // ISO or human readable like "Today 08:30 PM"
  startTimestamp?: number;
  roomId?: string;
  roomPass?: string;
  status: MatchStatus;
  participants?: Record<string, Participant>;
  winnerIgn?: string;
  winnerPrize?: number;
}

export interface DepositRequest {
  id: string;
  userId: string;
  userName?: string;
  amount: number;
  trx: string;
  senderPhone?: string;
  method: PaymentMethod;
  status: TransactionStatus;
  timestamp: number;
  note?: string;
}

export interface WithdrawRequest {
  id: string;
  userId: string;
  userName?: string;
  amount: number;
  account: string;
  method: PaymentMethod;
  status: TransactionStatus;
  timestamp: number;
  note?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  ign: string;
  ffUid: string;
  phone: string;
  balance: number;
  matchesPlayed: number;
  totalKills: number;
  totalWon: number;
  rankBadge: string;
}

export interface AppSettings {
  notice: string;
  bkashNumber: string;
  nagadNumber: string;
  rocketNumber: string;
  whatsappSupport: string;
  telegramSupport: string;
  minDeposit: number;
  minWithdraw: number;
}
