import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Lock, Mail, User, Briefcase, Eye, EyeOff, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function SignUpPage() {
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Sales Rep');
  const [department, setDepartment] = useState('Enterprise Sales');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid work email.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const res = await signup({
      name,
      email,
      password,
      role,
      department,
    });

    if (res.success) {
      navigate('/');
    } else {
      setError(res.error || 'Failed to register account.');
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-[#1a1a1a] rounded-2xl border border-[#333] shadow-2xl overflow-hidden">
        {/* Left Side: Brand & Onboarding value */}
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
              Join your team on the next-gen Sales CRM.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Create your profile to start tracking opportunities, collaborating with teammates, and hitting your quarterly revenue targets.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-[#f95e26]" />
                <span className="text-sm text-gray-300">Live pipeline visualization and deal stages</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-[#f95e26]" />
                <span className="text-sm text-gray-300">Fast contact management & lead scoring</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-[#f95e26]" />
                <span className="text-sm text-gray-300">Integrated task manager & team assignments</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-[#f95e26]" />
                <span className="text-sm text-gray-300">Custom user roles & administrative controls</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#2e2e2e] flex items-center justify-between text-xs text-gray-500">
            <span>Clientra Sales Platform</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck size={14} /> 256-bit Encryption
            </span>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-1.5">Create your CRM account</h3>
              <p className="text-sm text-gray-400">
                Fill in your details below to set up your team profile.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kiran Patel"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#242424] border border-[#383838] text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#f95e26] focus:border-transparent transition-all"
                  />
                </div>
              </div>

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
                    placeholder="kiran@company.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#242424] border border-[#383838] text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#f95e26] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Team Role
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#242424] border border-[#383838] text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#f95e26] cursor-pointer appearance-none"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Sales Manager">Sales Manager</option>
                      <option value="Sales Rep">Sales Rep</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#242424] border border-[#383838] text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#f95e26] cursor-pointer appearance-none"
                  >
                    <option value="Enterprise Sales">Enterprise Sales</option>
                    <option value="Inbound Growth">Inbound Growth</option>
                    <option value="Management & Tech">Management & Tech</option>
                    <option value="Customer Success">Customer Success</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 chars"
                      className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#242424] border border-[#383838] text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#f95e26] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#242424] border border-[#383838] text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#f95e26] transition-all"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#f95e26] hover:bg-[#e0521e] text-white font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-3d-orange btn-3d disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account & Continue</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-[#f95e26] font-medium hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

