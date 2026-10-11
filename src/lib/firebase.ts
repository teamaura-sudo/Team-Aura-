import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getDatabase, 
  ref, 
  onValue, 
  set, 
  push, 
  Database,
  DataSnapshot
} from 'firebase/database';
import { AppNotification, AppSettings, DepositRequest, Match, Participant, SupportTicket, UserProfile, WithdrawRequest } from '../types';

export const firebaseConfig = {
  apiKey: "AIzaSyCDaISJPPkq8FkbxQP_VrWShTAzgicgUz8",
  authDomain: "team-aura-6d1ba.firebaseapp.com",
  databaseURL: "https://team-aura-6d1ba-default-rtdb.firebaseio.com",
  projectId: "team-aura-6d1ba",
  storageBucket: "team-aura-6d1ba.firebasestorage.app",
  messagingSenderId: "96576915579",
  appId: "1:96576915579:web:9f3df5ca7da1c4e84ebade",
  measurementId: "G-NMFSJGFZZW"
};

// Initial default settings
export const DEFAULT_SETTINGS: AppSettings = {
  notice: "🔥 WELCOME TO TEAM AURA TOURNAMENT! Daily Free Fire Cash Tournaments. Room ID & Pass given 10 mins before match starts. bKash/Nagad Auto Deposit!",
  bkashNumber: "01789456123",
  nagadNumber: "01898765432",
  rocketNumber: "01912345678",
  whatsappSupport: "+8801789456123",
  telegramSupport: "t.me/TeamAuraEsports",
  minDeposit: 50,
  minWithdraw: 100,
};

// Initial mock tournament matches to ensure immediate, rich esports experience
export const INITIAL_MATCHES: Record<string, Match> = {
  "match_01": {
    id: "match_01",
    title: "⚡ AURA GRAND CLASH - BERMUDA",
    map: "Bermuda",
    version: "Squad",
    type: "TPP",
    fee: 50,
    prize: 1200,
    perKill: 15,
    totalSlots: 48,
    filledSlots: 36,
    startTime: "Today at 08:30 PM",
    startTimestamp: Date.now() + 1000 * 60 * 45,
    roomId: "7489201",
    roomPass: "aura99",
    status: "Upcoming",
    participants: {
      "user_p1": { userId: "user_p1", ign: "AURA_Viper", ffUid: "10928374", joinedAt: Date.now() - 3600000, slotNumber: 1 },
      "user_p2": { userId: "user_p2", ign: "NOVA_Sniper", ffUid: "29481923", joinedAt: Date.now() - 3000000, slotNumber: 2 },
      "user_p3": { userId: "user_p3", ign: "BD_Headshot", ffUid: "98371928", joinedAt: Date.now() - 2400000, slotNumber: 3 },
    }
  },
  "match_02": {
    id: "match_02",
    title: "🎯 SOLO SURVIVAL WAR - PURGATORY",
    map: "Purgatory",
    version: "Solo",
    type: "TPP",
    fee: 20,
    prize: 500,
    perKill: 10,
    totalSlots: 48,
    filledSlots: 42,
    startTime: "Today at 09:30 PM",
    startTimestamp: Date.now() + 1000 * 60 * 105,
    roomId: "Pending (10m before)",
    roomPass: "Pending",
    status: "Upcoming",
    participants: {}
  },
  "match_03": {
    id: "match_03",
    title: "🔥 CLASH SQUAD INTENSE 4v4",
    map: "Nextra",
    version: "Clash Squad",
    type: "TPP",
    fee: 100,
    prize: 2000,
    perKill: 25,
    totalSlots: 16,
    filledSlots: 12,
    startTime: "Tonight at 10:30 PM",
    startTimestamp: Date.now() + 1000 * 60 * 165,
    roomId: "Pending",
    roomPass: "Pending",
    status: "Upcoming",
    participants: {}
  },
  "match_04": {
    id: "match_04",
    title: "🏆 AFTERNOON DUO RUSH - KALAHARI",
    map: "Kalahari",
    version: "Duo",
    type: "TPP",
    fee: 30,
    prize: 750,
    perKill: 12,
    totalSlots: 48,
    filledSlots: 48,
    startTime: "Today at 06:00 PM",
    startTimestamp: Date.now() - 1000 * 60 * 30,
    roomId: "9918204",
    roomPass: "aurawin",
    status: "Live",
    participants: {}
  },
  "match_05": {
    id: "match_05",
    title: "👑 AURA PRO CHAMPIONSHIP - BERMUDA",
    map: "Bermuda",
    version: "Squad",
    type: "TPP",
    fee: 100,
    prize: 3500,
    perKill: 25,
    totalSlots: 48,
    filledSlots: 48,
    startTime: "Yesterday at 09:00 PM",
    startTimestamp: Date.now() - 1000 * 60 * 60 * 26,
    roomId: "8192031",
    roomPass: "final88",
    status: "Completed",
    winnerIgn: "AURA_Viper (Squad #4)",
    winnerPrize: 2200,
    runnerUpIgn: "BD_Headshot (Squad #12)",
    runnerUpPrize: 900,
    topFraggerIgn: "NOVA_Sniper",
    topKills: 14,
    completedAt: Date.now() - 1000 * 60 * 60 * 24,
    resultScoreboard: [
      { rank: 1, teamOrIgn: "AURA_Viper (Squad #4)", kills: 22, prize: 2200, ffUid: "10928374" },
      { rank: 2, teamOrIgn: "BD_Headshot (Squad #12)", kills: 16, prize: 900, ffUid: "98371928" },
      { rank: 3, teamOrIgn: "NOVA_Sniper (Squad #7)", kills: 14, prize: 400, ffUid: "29481923" },
      { rank: 4, teamOrIgn: "DARK_Shadow (Squad #2)", kills: 8, prize: 0, ffUid: "77261920" },
      { rank: 5, teamOrIgn: "RED_Hunter (Squad #9)", kills: 7, prize: 0, ffUid: "33819201" },
    ],
    participants: {
      "user_p1": { userId: "user_p1", ign: "AURA_Viper", ffUid: "10928374", joinedAt: Date.now() - 1000 * 60 * 60 * 30, slotNumber: 4, kills: 9, winnings: 800 }
    }
  },
  "match_06": {
    id: "match_06",
    title: "🎯 PURGATORY MIDNIGHT SNIPER SOLO",
    map: "Purgatory",
    version: "Solo",
    type: "TPP",
    fee: 25,
    prize: 600,
    perKill: 12,
    totalSlots: 48,
    filledSlots: 48,
    startTime: "2 Days ago at 11:00 PM",
    startTimestamp: Date.now() - 1000 * 60 * 60 * 50,
    roomId: "4481092",
    roomPass: "solo77",
    status: "Completed",
    winnerIgn: "RAZOR_X",
    winnerPrize: 350,
    runnerUpIgn: "GHOST_Killer",
    runnerUpPrize: 150,
    topFraggerIgn: "RAZOR_X",
    topKills: 11,
    completedAt: Date.now() - 1000 * 60 * 60 * 48,
    resultScoreboard: [
      { rank: 1, teamOrIgn: "RAZOR_X", kills: 11, prize: 350, ffUid: "88291039" },
      { rank: 2, teamOrIgn: "GHOST_Killer", kills: 7, prize: 150, ffUid: "55192048" },
      { rank: 3, teamOrIgn: "SNIPER_King", kills: 6, prize: 100, ffUid: "11928472" },
      { rank: 4, teamOrIgn: "Viper_One", kills: 4, prize: 0, ffUid: "99281726" }
    ],
    participants: {}
  }
};

let app: FirebaseApp | null = null;
let db: Database | null = null;
let isFirebaseConnected = false;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getDatabase(app);
} catch (e) {
  console.warn("Firebase initialization notice:", e);
}

// Local persistent cache fallback
const STORAGE_PREFIX = 'team_aura_';
const getStorage = <T>(key: string, defaultVal: T): T => {
  try {
    const val = localStorage.getItem(STORAGE_PREFIX + key);
    return val ? JSON.parse(val) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const setStorage = <T>(key: string, val: T): void => {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
  } catch {
    // quota exceeded or private mode
  }
};

// State event dispatcher for fallback mode
type ListenerCallback<T> = (data: T) => void;
const localListeners: Record<string, Set<ListenerCallback<unknown>>> = {};

function notifyLocal(path: string, data: unknown) {
  if (localListeners[path]) {
    localListeners[path].forEach(cb => cb(data));
  }
}

export function subscribeToPath<T>(path: string, defaultVal: T, callback: (data: T) => void): () => void {
  let isSubscribed = true;

  // Add to local fallback listeners
  if (!localListeners[path]) {
    localListeners[path] = new Set();
  }
  const genericCb = (d: unknown) => callback(d as T);
  localListeners[path].add(genericCb);

  // Send local storage value right away so UI never waits
  const currentLocal = getStorage<T>(path, defaultVal);
  callback(currentLocal);

  // If Firebase DB is initialized, attempt real-time listener
  if (db) {
    try {
      const r = ref(db, path);
      const unsubscribe = onValue(r, (snapshot: DataSnapshot) => {
        if (!isSubscribed) return;
        const val = snapshot.val();
        if (val !== null && val !== undefined) {
          isFirebaseConnected = true;
          setStorage(path, val);
          callback(val);
        } else {
          // If path is empty on Firebase, seed if it's default
          if (path === 'settings/notice' && defaultVal) {
            set(r, defaultVal).catch(() => {});
          } else if (path === 'matches' && defaultVal) {
            set(r, defaultVal).catch(() => {});
          }
        }
      }, (err) => {
        console.warn(`Firebase read on ${path} failed or permission denied:`, err.message);
        // Fallback continues to operate flawlessly
      });

      return () => {
        isSubscribed = false;
        unsubscribe();
        if (localListeners[path]) {
          localListeners[path].delete(genericCb);
        }
      };
    } catch (e) {
      console.warn("RTDB subscribe exception:", e);
    }
  }

  return () => {
    isSubscribed = false;
    if (localListeners[path]) {
      localListeners[path].delete(genericCb);
    }
  };
}

// User Profile management
export const DEFAULT_USER: UserProfile = {
  id: "user_demo_123",
  name: "Aura Legend",
  email: "legend@teamaura.com",
  ign: "AURA_TITAN",
  ffUid: "294810482",
  phone: "01700112233",
  balance: 0, // Requirement: initial balance must be set to 0
  matchesPlayed: 0,
  totalKills: 0,
  totalWon: 0,
  rankBadge: "Bronze I",
  createdAt: Date.now(),
};

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const users = getStorage<Record<string, UserProfile>>('users', { [DEFAULT_USER.id]: DEFAULT_USER });
  return users[userId] || { ...DEFAULT_USER, id: userId };
}

export async function updateUserBalance(userId: string, delta: number): Promise<number> {
  const users = getStorage<Record<string, UserProfile>>('users', { [DEFAULT_USER.id]: DEFAULT_USER });
  const currentUser = users[userId] || { ...DEFAULT_USER, id: userId };
  currentUser.balance = Math.max(0, currentUser.balance + delta);
  users[userId] = currentUser;
  setStorage('users', users);
  setStorage(`users/${userId}/balance`, currentUser.balance);

  // Attempt Firebase RTDB write
  if (db) {
    try {
      await set(ref(db, `users/${userId}/balance`), currentUser.balance);
    } catch (e) {
      console.warn("RTDB balance update fallback to local:", e);
    }
  }

  notifyLocal(`users/${userId}/balance`, currentUser.balance);
  notifyLocal(`users/${userId}`, currentUser);
  return currentUser.balance;
}

export async function updateUserProfile(userId: string, partial: Partial<UserProfile>): Promise<UserProfile> {
  const users = getStorage<Record<string, UserProfile>>('users', { [DEFAULT_USER.id]: DEFAULT_USER });
  const currentUser = users[userId] || { ...DEFAULT_USER, id: userId };
  const updated = { ...currentUser, ...partial };
  users[userId] = updated;
  setStorage('users', users);
  setStorage(`users/${userId}`, updated);

  if (db) {
    try {
      await set(ref(db, `users/${userId}`), updated);
    } catch {
      // ignore
    }
  }

  notifyLocal(`users/${userId}`, updated);
  return updated;
}

// Deposit submission
export async function submitDepositRequest(req: Omit<DepositRequest, 'id' | 'status' | 'timestamp'>): Promise<DepositRequest> {
  const newDeposit: DepositRequest = {
    ...req,
    id: `dep_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    status: 'Pending',
    timestamp: Date.now()
  };

  const deposits = getStorage<Record<string, DepositRequest>>('deposits', {});
  deposits[newDeposit.id] = newDeposit;
  setStorage('deposits', deposits);

  if (db) {
    try {
      const depositsRef = ref(db, 'deposits');
      const newRef = push(depositsRef);
      await set(newRef, newDeposit);
    } catch {
      // local stored
    }
  }

  notifyLocal('deposits', deposits);
  return newDeposit;
}

// Withdraw submission
export async function submitWithdrawRequest(req: Omit<WithdrawRequest, 'id' | 'status' | 'timestamp'>): Promise<WithdrawRequest> {
  const newWithdraw: WithdrawRequest = {
    ...req,
    id: `wit_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    status: 'Pending',
    timestamp: Date.now()
  };

  const withdraws = getStorage<Record<string, WithdrawRequest>>('withdraws', {});
  withdraws[newWithdraw.id] = newWithdraw;
  setStorage('withdraws', withdraws);

  if (db) {
    try {
      const withdrawsRef = ref(db, 'withdraws');
      const newRef = push(withdrawsRef);
      await set(newRef, newWithdraw);
    } catch {
      // local stored
    }
  }

  notifyLocal('withdraws', withdraws);
  return newWithdraw;
}

// Match joining
export async function registerForMatch(matchId: string, participant: Participant, fee: number): Promise<{ success: boolean; message: string }> {
  const matches = getStorage<Record<string, Match>>('matches', INITIAL_MATCHES);
  const match = matches[matchId];

  if (!match) {
    return { success: false, message: 'Match not found!' };
  }

  if (match.filledSlots >= match.totalSlots) {
    return { success: false, message: 'Match is already full! Please join another room.' };
  }

  // Deduct balance
  const currentBalance = getStorage<number>(`users/${participant.userId}/balance`, DEFAULT_USER.balance);
  if (currentBalance < fee) {
    return { success: false, message: `Insufficient balance! You need ৳${fee}, current balance is ৳${currentBalance}.` };
  }

  await updateUserBalance(participant.userId, -fee);

  if (!match.participants) {
    match.participants = {};
  }

  match.participants[participant.userId] = {
    ...participant,
    slotNumber: (match.filledSlots || 0) + 1
  };
  match.filledSlots = Object.keys(match.participants).length;
  matches[matchId] = match;

  setStorage('matches', matches);

  if (db) {
    try {
      await set(ref(db, `matches/${matchId}`), match);
    } catch {
      // local store used
    }
  }

  notifyLocal('matches', matches);
  return { success: true, message: `Successfully registered for ${match.title}!` };
}

// Admin Operations
export async function adminUpdateMatch(match: Match): Promise<void> {
  const matches = getStorage<Record<string, Match>>('matches', INITIAL_MATCHES);
  matches[match.id] = match;
  setStorage('matches', matches);

  if (db) {
    try {
      await set(ref(db, `matches/${match.id}`), match);
    } catch {}
  }
  notifyLocal('matches', matches);
}

export async function adminCreateMatch(matchData: Omit<Match, 'id' | 'filledSlots' | 'participants'>): Promise<Match> {
  const id = `match_${Date.now()}`;
  const newMatch: Match = {
    ...matchData,
    id,
    filledSlots: 0,
    participants: {}
  };
  await adminUpdateMatch(newMatch);
  return newMatch;
}

export async function adminDeleteMatch(matchId: string): Promise<void> {
  const matches = getStorage<Record<string, Match>>('matches', INITIAL_MATCHES);
  delete matches[matchId];
  setStorage('matches', matches);
  if (db) {
    try {
      await set(ref(db, `matches/${matchId}`), null);
    } catch {}
  }
  notifyLocal('matches', matches);
}

export async function adminUpdateDepositStatus(depositId: string, status: 'Approved' | 'Rejected'): Promise<void> {
  const deposits = getStorage<Record<string, DepositRequest>>('deposits', {});
  const deposit = deposits[depositId];
  if (!deposit) return;

  deposit.status = status;
  deposits[depositId] = deposit;
  setStorage('deposits', deposits);

  if (status === 'Approved') {
    // Credit user's wallet!
    await updateUserBalance(deposit.userId, deposit.amount);
  }

  if (db) {
    try {
      await set(ref(db, `deposits/${depositId}/status`), status);
    } catch {}
  }
  notifyLocal('deposits', deposits);
}

export async function adminUpdateWithdrawStatus(withdrawId: string, status: 'Approved' | 'Rejected'): Promise<void> {
  const withdraws = getStorage<Record<string, WithdrawRequest>>('withdraws', {});
  const withdraw = withdraws[withdrawId];
  if (!withdraw) return;

  withdraw.status = status;
  withdraws[withdrawId] = withdraw;
  setStorage('withdraws', withdraws);

  if (status === 'Approved') {
    // Debit user balance
    await updateUserBalance(withdraw.userId, -withdraw.amount);
  }

  if (db) {
    try {
      await set(ref(db, `withdraws/${withdrawId}/status`), status);
    } catch {}
  }
  notifyLocal('withdraws', withdraws);
}

export async function adminApproveDeposit(id: string): Promise<void> {
  return adminUpdateDepositStatus(id, 'Approved');
}

export async function adminRejectDeposit(id: string): Promise<void> {
  return adminUpdateDepositStatus(id, 'Rejected');
}

export async function adminApproveWithdraw(id: string): Promise<void> {
  return adminUpdateWithdrawStatus(id, 'Approved');
}

export async function adminRejectWithdraw(id: string): Promise<void> {
  return adminUpdateWithdrawStatus(id, 'Rejected');
}

export async function adminUpdateNotice(noticeText: string): Promise<void> {
  setStorage('settings/notice', noticeText);
  if (db) {
    try {
      await set(ref(db, 'settings/notice'), noticeText);
    } catch {}
  }
  notifyLocal('settings/notice', noticeText);
}

export function isConnectedToFirebase(): boolean {
  return isFirebaseConnected;
}

// Notification System
export const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif_welcome",
    title: "⚡ Welcome to Team Aura Esports!",
    message: "Join daily Free Fire cash custom rooms, win real cash prizes via bKash & Nagad.",
    type: "system",
    timestamp: Date.now() - 3600000 * 2,
    read: false,
  },
  {
    id: "notif_room_tip",
    title: "🔑 Room ID & Password Policy",
    message: "Credentials are published strictly 10 minutes prior to match schedule. Save your Free Fire UID in Profile to join with 1-click!",
    type: "room",
    timestamp: Date.now() - 3600000,
    read: false,
  },
  {
    id: "notif_cashier",
    title: "💰 Instant Cashier 24/7",
    message: "Deposits via bKash & Nagad are processed rapidly. Remember: your initial account balance is strictly ৳0.",
    type: "deposit",
    timestamp: Date.now() - 1800000,
    read: false,
  }
];

export function getStoredNotifications(): AppNotification[] {
  return getStorage<AppNotification[]>('notifications', DEFAULT_NOTIFICATIONS);
}

export function saveStoredNotifications(notifs: AppNotification[]): void {
  setStorage('notifications', notifs);
  notifyLocal('notifications', notifs);
}

export function addNotification(notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): AppNotification {
  const notifs = getStoredNotifications();
  const newNotif: AppNotification = {
    ...notif,
    id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    timestamp: Date.now(),
    read: false,
  };
  const updated = [newNotif, ...notifs];
  saveStoredNotifications(updated);
  return newNotif;
}

export function markNotificationRead(id: string): void {
  const notifs = getStoredNotifications();
  const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
  saveStoredNotifications(updated);
}

export function markAllNotificationsRead(): void {
  const notifs = getStoredNotifications();
  const updated = notifs.map(n => ({ ...n, read: true }));
  saveStoredNotifications(updated);
}

// Support Ticket System
export function getStoredSupportTickets(): SupportTicket[] {
  return getStorage<SupportTicket[]>('support_tickets', []);
}

export function submitSupportTicket(ticket: Omit<SupportTicket, 'id' | 'timestamp' | 'status'>): SupportTicket {
  const tickets = getStoredSupportTickets();
  const newTicket: SupportTicket = {
    ...ticket,
    id: `ticket_${Date.now()}`,
    timestamp: Date.now(),
    status: 'Open',
    adminReply: "Support ticket received! Our admin team is reviewing your inquiry and will reach out via WhatsApp / in-app update within 15-30 minutes."
  };
  const updated = [newTicket, ...tickets];
  setStorage('support_tickets', updated);
  notifyLocal('support_tickets', updated);
  return newTicket;
}
