import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  Gamepad2, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { 
  createNewAccount, 
  loginAccount, 
  generateMathChallenge, 
  MathChallenge, 
  validatePassword 
} from '../lib/auth';
import { UserProfile } from '../types';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Login inputs
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regIgn, setRegIgn] = useState('');
  const [regFfUid, setRegFfUid] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [botAnswer, setBotAnswer] = useState('');
  const [challenge, setChallenge] = useState<MathChallenge>(generateMathChallenge());

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setSuccessMsg(null);
      setChallenge(generateMathChallenge());
      setBotAnswer('');
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleRefreshChallenge = () => {
    sound.playClick();
    setChallenge(generateMathChallenge());
    setBotAnswer('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await loginAccount(loginIdentifier, loginPassword);
      if (res.success && res.user) {
        sound.playSuccess();
        setSuccessMsg(res.message);
        setTimeout(() => {
          onSuccess(res.user!);
          onClose();
        }, 600);
      } else {
        sound.playAlert();
        setErrorMsg(res.message);
      }
    } catch {
      setErrorMsg('Login failed. Please verify your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (regPassword !== regConfirmPassword) {
      sound.playAlert();
      setErrorMsg('Passwords do not match. Please re-enter carefully.');
      return;
    }

    if (!botAnswer) {
      sound.playAlert();
      setErrorMsg('Please solve the anti-bot security math check.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await createNewAccount({
        name: regName,
        email: regEmail,
        phone: regPhone,
        ign: regIgn,
        ffUid: regFfUid,
        password: regPassword,
        botAnswer: Number(botAnswer),
        expectedBotAnswer: challenge.answer,
      });

      if (res.success && res.user) {
        sound.playSuccess();
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
        setSuccessMsg(res.message);
        setTimeout(() => {
          onSuccess(res.user!);
          onClose();
        }, 900);
      } else {
        sound.playAlert();
        setErrorMsg(res.message);
        // Refresh challenge on error
        setChallenge(generateMathChallenge());
        setBotAnswer('');
      }
    } catch {
      setErrorMsg('Account creation failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#1e293b] border border-orange-500/40 rounded-2xl w-full max-w-md max-h-[92vh] flex flex-col shadow-2xl overflow-hidden glow-orange"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0f172a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-bold font-gaming text-lg">
              ⚡
            </div>
            <div>
              <h3 className="font-gaming font-bold text-lg text-slate-100">
                {mode === 'login' ? 'Player Sign In' : 'Create Tournament Account'}
              </h3>
              <p className="text-xs text-slate-400">
                Team Aura Free Fire Esports BD
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
            type="button"
            onClick={() => {
              sound.playClick();
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-gaming font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setMode('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-gaming font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Register (Balance ৳0)</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Email or Mobile Number:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. player@gmail.com or 017XXXXXXXX"
                    required
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Password:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your account password"
                    required
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl pl-9 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl font-gaming font-bold text-sm bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 transition-all shadow-lg shadow-orange-500/25 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'Verifying Account...' : 'Sign In To Tournament'}
                </button>
              </div>

              {/* Security info */}
              <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Protected with rate limiting & SHA-256 password encryption.</span>
              </div>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Full Name:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    required
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Free Fire IGN:
                  </label>
                  <div className="relative">
                    <Gamepad2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={regIgn}
                      onChange={(e) => setRegIgn(e.target.value)}
                      placeholder="e.g. AURA_Kratos"
                      required
                      className="w-full bg-[#0f172a] border border-slate-700 rounded-xl pl-9 pr-2 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Free Fire UID:
                  </label>
                  <input
                    type="text"
                    value={regFfUid}
                    onChange={(e) => setRegFfUid(e.target.value)}
                    placeholder="e.g. 294810291"
                    required
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Mobile Number:
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      required
                      className="w-full bg-[#0f172a] border border-slate-700 rounded-xl pl-9 pr-2 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Email Address:
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="player@gmail.com"
                    required
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Password:
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Confirm:
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-type password"
                    required
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Anti-Bot Security Verification Challenge */}
              <div className="bg-[#0f172a] p-3 rounded-xl border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>Anti-Bot Verification Check:</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleRefreshChallenge}
                    className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                    title="Get new question"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Change</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono font-bold text-amber-300 text-sm tracking-wider">
                    {challenge.question}
                  </div>
                  <input
                    type="number"
                    value={botAnswer}
                    onChange={(e) => setBotAnswer(e.target.value)}
                    placeholder="Enter answer"
                    required
                    className="flex-1 bg-[#0f172a] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Strict Notice: Initial balance is 0 */}
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300">
                🔒 <b>Security & Wallet Policy:</b> Newly created accounts begin with an <b>initial balance of ৳0</b>. No automated fake accounts or balance bypassing is allowed.
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl font-gaming font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 transition-all shadow-lg shadow-emerald-500/25 active:scale-[0.98] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isLoading ? 'Creating Secure Account...' : 'Complete Registration (Balance ৳0)'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
