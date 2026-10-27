import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, TrendingUp, Users, CheckCircle2 } from 'lucide-react';
import Card3D from './components/Card3D';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your work email.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.error || 'Invalid email or password.');
    }
  };

  const handleQuickLogin = async (quickEmail: string) => {
    setError('');
    const res = await login(quickEmail, 'password123');
    if (res.success) {
      navigate('/');
    } else {
      setError(res.error || 'Failed quick login.');
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-[#1a1a1a] rounded-2xl border border-[#333] shadow-2xl overflow-hidden">
        {/* Left Side: Brand & Value Pitch */}
        <div className="lg:col-span-5 p-8 sm:p-10 bg-gradient-to-br from-[#1e1e1e] via-[#1a1a1a] to-[#141414] border-b lg:border-b-0 lg:border-r border-[#333] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 bg-[#f95e26] rounded-xl flex items-center justify-center text-white font-extrabold text-base shadow-lg shadow-[#f95e26]/30">
                C
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-wide">Saleser</span>
                <span className="text-xs text-[#f95e26] font-semibold block uppercase tracking-wider">CRM Platform</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-4">
              Accelerate your pipeline with intelligent deal insights.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Designed for modern high-velocity sales and account teams. Manage leads, forecast revenue, and track close rates with clarity.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-[#262626] border border-[#383838] text-[#f95e26]">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-200">Revenue Forecasting</h4>
                  <p className="text-xs text-gray-400">Automated probability calculations on deals.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-[#262626] border border-[#383838] text-[#f95e26]">
                  <Users size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-200">Collaborative Team Roles</h4>
                  <p className="text-xs text-gray-400">Role-based permissions for Admins, Managers & Reps.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-[#262626] border border-[#383838] text-[#f95e26]">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-200">Enterprise Security</h4>
                  <p className="text-xs text-gray-400">Secure session management and audit trails.</p>
                </div>
              </div>
            </div>

            {/* 3D Live Pipeline Card Preview */}
            <Card3D maxTilt={12} className="mt-6 p-4 rounded-xl bg-[#232323]/90 border border-[#383838] shadow-3d-subtle">
              <div className="flex justify-between items-center mb-1.5 translate-z-10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#f95e26]">Enterprise Live Deal</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">85% Probability</span>
              </div>
              <div className="text-sm font-bold text-white translate-z-20">Acme Cloud Migration</div>
              <div className="flex justify-between items-center mt-2 translate-z-10 text-xs">
                <span className="text-gray-400">Target Value</span>
                <span className="font-extrabold text-emerald-400 text-sm">$45,000</span>
              </div>
            </Card3D>
          </div>

          <div className="mt-8 pt-6 border-t border-[#2e2e2e] flex items-center justify-between text-xs text-gray-500">
            <span>© 2026 Saleser Technologies</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 size={12} /> Systems Online
            </span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-1.5">Sign in to your account</h3>
              <p className="text-sm text-gray-400">
                Enter your credentials or click a demo profile below.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick Demo Login Switcher */}
            <div className="mb-6 p-3.5 rounded-xl bg-[#222222] border border-[#333]">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                ⚡ 1-Click Demo Profiles
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('kiran@clientra.com')}
                  className="flex items-center gap-2 px-3 py-2 bg-[#2a2a2a] hover:bg-[#333] border border-[#444] rounded-lg text-left transition-colors"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80"
                    alt="Kiran"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xs font-semibold text-white">Kiran</div>
                    <div className="text-[10px] text-[#f95e26]">Admin</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('sarah@clientra.com')}
                  className="flex items-center gap-2 px-3 py-2 bg-[#2a2a2a] hover:bg-[#333] border border-[#444] rounded-lg text-left transition-colors"
                >
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80"
                    alt="Sarah"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xs font-semibold text-white">Sarah K.</div>
                    <div className="text-[10px] text-blue-400">Sales Rep</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="relative flex py-2 items-center mb-6">
              <div className="flex-grow border-t border-[#333]"></div>
              <span className="flex-shrink mx-3 text-xs text-gray-500 font-medium">Or enter credentials</span>
              <div className="flex-grow border-t border-[#333]"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#242424] border border-[#383838] text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#f95e26] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-gray-300">
                    Password
                  </label>
                  <span className="text-xs text-[#f95e26] hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#242424] border border-[#383838] text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#f95e26] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Default demo password: <code className="text-gray-400">password123</code></p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-[#2a2a2a] border-[#444] text-[#f95e26] focus:ring-[#f95e26]"
                  />
                  <span className="text-xs text-gray-400">Remember this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#f95e26] hover:bg-[#e0521e] text-white font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-3d-orange btn-3d disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to CRM</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-400">
              Don't have an account yet?{' '}
              <Link to="/signup" className="text-[#f95e26] font-medium hover:underline">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

