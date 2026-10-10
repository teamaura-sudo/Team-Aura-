import { UserProfile } from '../types';
import { getDatabase, ref, set, get, child } from 'firebase/database';

// Cryptographic hash helper using native Web Crypto API
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`team_aura_salt_2026_${password}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Security: Rate-Limiting & Brute Force Tracker
interface LoginAttempt {
  count: number;
  lastAttempt: number;
  lockedUntil: number;
}

const ATTEMPTS_KEY = 'team_aura_auth_rate_limits';
const SESSION_KEY = 'team_aura_auth_session';
const USERS_REGISTRY_KEY = 'team_aura_users_vault';

function getRateLimit(identifier: string): LoginAttempt {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    const data = raw ? JSON.parse(raw) : {};
    return data[identifier.toLowerCase()] || { count: 0, lastAttempt: 0, lockedUntil: 0 };
  } catch {
    return { count: 0, lastAttempt: 0, lockedUntil: 0 };
  }
}

function setRateLimit(identifier: string, attempt: LoginAttempt): void {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    const data = raw ? JSON.parse(raw) : {};
    data[identifier.toLowerCase()] = attempt;
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(data));
  } catch {}
}

function clearRateLimit(identifier: string): void {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    delete data[identifier.toLowerCase()];
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(data));
  } catch {}
}

// Input Validators
export function validateEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim());
}

export function validatePhone(phone: string): boolean {
  // Valid Bangladeshi mobile format: 013, 014, 015, 016, 017, 018, 019 followed by 8 digits (total 11 digits)
  const cleaned = phone.replace(/[^0-9]/g, '');
  return /^01[3-9]\d{8}$/.test(cleaned);
}

export function validateFreeFireUid(uid: string): boolean {
  const cleaned = uid.trim();
  // Free Fire UID is numeric, usually 8 to 11 digits
  return /^\d{8,11}$/.test(cleaned);
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long.' };
  }
  if (/^(123456|password|qwerty|000000)$/i.test(password)) {
    return { valid: false, message: 'Password is too common and easily guessed.' };
  }
  return { valid: true };
}

// Anti-Bot Challenge Generator
export interface MathChallenge {
  num1: number;
  num2: number;
  operator: '+' | '-' | '×';
  answer: number;
  question: string;
}

export function generateMathChallenge(): MathChallenge {
  const ops: Array<'+' | '-' | '×'> = ['+', '-', '×'];
  const operator = ops[Math.floor(Math.random() * ops.length)];
  let num1 = Math.floor(Math.random() * 20) + 1;
  let num2 = Math.floor(Math.random() * 10) + 1;

  if (operator === '-' && num2 > num1) {
    [num1, num2] = [num2, num1]; // Keep positive
  }

  let answer = num1 + num2;
  if (operator === '-') answer = num1 - num2;
  if (operator === '×') answer = num1 * num2;

  return {
    num1,
    num2,
    operator,
    answer,
    question: `${num1} ${operator} ${num2} = ?`,
  };
}

// User Vault & Persistence
export function getAllRegisteredUsers(): Record<string, UserProfile> {
  try {
    const raw = localStorage.getItem(USERS_REGISTRY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveRegisteredUsers(users: Record<string, UserProfile>): void {
  try {
    localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(users));
  } catch {}
}

export function getActiveSession(): UserProfile | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setActiveSession(user: UserProfile | null): void {
  try {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch {}
}

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  ign: string;
  ffUid: string;
  password: string;
  botAnswer: number;
  expectedBotAnswer: number;
}

export async function createNewAccount(input: RegisterInput): Promise<{ success: boolean; message: string; user?: UserProfile }> {
  // 1. Anti-Bot Security Check
  if (Number(input.botAnswer) !== Number(input.expectedBotAnswer)) {
    return { success: false, message: 'Anti-bot security verification failed. Please try again.' };
  }

  // 2. Strict Input Validation
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const phone = input.phone.replace(/[^0-9]/g, '');
  const ign = input.ign.trim();
  const ffUid = input.ffUid.trim();

  if (!name || name.length < 2) {
    return { success: false, message: 'Please enter your full legal name.' };
  }

  if (!validateEmail(email)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  if (!validatePhone(phone)) {
    return { success: false, message: 'Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX).' };
  }

  if (!ign || ign.length < 3 || ign.length > 16) {
    return { success: false, message: 'In-Game Name (IGN) must be between 3 and 16 characters.' };
  }

  if (!validateFreeFireUid(ffUid)) {
    return { success: false, message: 'Free Fire UID must be an 8 to 11 digit numeric ID.' };
  }

  const passCheck = validatePassword(input.password);
  if (!passCheck.valid) {
    return { success: false, message: passCheck.message || 'Invalid password.' };
  }

  // 3. Duplicate Account Prevention (No fake/duplicate accounts)
  const users = getAllRegisteredUsers();
  for (const existingId in users) {
    const existing = users[existingId];
    if (existing.email.toLowerCase() === email) {
      return { success: false, message: 'An account with this email address already exists. Please log in instead.' };
    }
    if (existing.phone === phone) {
      return { success: false, message: 'This phone number is already registered with another account.' };
    }
    if (existing.ffUid === ffUid) {
      return { success: false, message: 'This Free Fire UID is already registered to another player.' };
    }
  }

  // 4. Cryptographic Password Hashing
  const passwordHash = await hashPassword(input.password);

  // 5. Account Creation with INITIAL BALANCE SET STRICTLY TO 0
  const userId = `aura_usr_${Date.now()}_${Math.floor(Math.random() * 9000 + 1000)}`;
  const newUser: UserProfile = {
    id: userId,
    name,
    email,
    phone,
    ign,
    ffUid,
    balance: 0, // Requirement: Initial balance MUST be strictly set to 0!
    matchesPlayed: 0,
    totalKills: 0,
    totalWon: 0,
    rankBadge: 'Bronze I',
    createdAt: Date.now(),
    lastLoginAt: Date.now(),
    passwordHash,
    isVerified: true,
  };

  // 6. Save in Vault & Store
  users[userId] = newUser;
  saveRegisteredUsers(users);

  // Also sync to localStorage user keys
  try {
    localStorage.setItem(`team_aura_users/${userId}/balance`, '0');
    localStorage.setItem(`team_aura_users/${userId}`, JSON.stringify(newUser));
  } catch {}

  // Set active session
  setActiveSession(newUser);

  return {
    success: true,
    message: 'Account successfully created! Initial balance set to ৳0.',
    user: newUser,
  };
}

export async function loginAccount(identifier: string, password: string): Promise<{ success: boolean; message: string; user?: UserProfile }> {
  const cleanId = identifier.trim().toLowerCase();
  const phoneClean = identifier.replace(/[^0-9]/g, '');

  // 1. Rate Limiting Check against Brute Force Attacks
  const rateLimit = getRateLimit(cleanId);
  const now = Date.now();

  if (rateLimit.lockedUntil > now) {
    const remainingSeconds = Math.ceil((rateLimit.lockedUntil - now) / 1000);
    return {
      success: false,
      message: `Account is temporarily locked for security. Please try again in ${remainingSeconds} seconds.`,
    };
  }

  if (!cleanId || !password) {
    return { success: false, message: 'Please enter both your login identifier and password.' };
  }

  // 2. Find user in Vault
  const users = getAllRegisteredUsers();
  let foundUser: UserProfile | null = null;

  for (const id in users) {
    const u = users[id];
    if (u.email.toLowerCase() === cleanId || (phoneClean && u.phone === phoneClean)) {
      foundUser = u;
      break;
    }
  }

  if (!foundUser) {
    // Record failed attempt
    rateLimit.count += 1;
    rateLimit.lastAttempt = now;
    if (rateLimit.count >= 5) {
      rateLimit.lockedUntil = now + 5 * 60 * 1000; // 5 min lockout
    } else if (rateLimit.count >= 3) {
      rateLimit.lockedUntil = now + 30 * 1000; // 30 sec lockout
    }
    setRateLimit(cleanId, rateLimit);

    return { success: false, message: 'Invalid email, phone number, or password.' };
  }

  // 3. Compare Password Hash
  const inputHash = await hashPassword(password);
  if (foundUser.passwordHash !== inputHash) {
    rateLimit.count += 1;
    rateLimit.lastAttempt = now;
    if (rateLimit.count >= 5) {
      rateLimit.lockedUntil = now + 5 * 60 * 1000;
    } else if (rateLimit.count >= 3) {
      rateLimit.lockedUntil = now + 30 * 1000;
    }
    setRateLimit(cleanId, rateLimit);

    return { 
      success: false, 
      message: `Incorrect password. Failed attempts: ${rateLimit.count}/5.` 
    };
  }

  // 4. Success - Clear Rate Limits & Update Login Timestamp
  clearRateLimit(cleanId);
  foundUser.lastLoginAt = now;
  users[foundUser.id] = foundUser;
  saveRegisteredUsers(users);

  setActiveSession(foundUser);

  return {
    success: true,
    message: `Welcome back, ${foundUser.ign}!`,
    user: foundUser,
  };
}

export function logoutAccount(): void {
  setActiveSession(null);
}
