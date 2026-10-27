import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Shield,
  Key,
  CheckCircle2,
  Calendar,
  Save,
  LogOut,
  Building,
  Check,
  AlertCircle
} from 'lucide-react';
import Card3D from './components/Card3D';

export default function UserProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'permissions'>('profile');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    department: '',
    phone: '',
    location: '',
    bio: '',
    avatar: '',
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        title: user.title || (user.role === 'Admin' ? 'Lead System Administrator' : 'Sales Representative'),
        department: user.department || 'Management & Sales',
        phone: user.phone || '+1 (555) 234-5678',
        location: user.location || 'San Francisco, CA',
        bio: user.bio || 'Clientra CRM administrator and team coordinator.',
        avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      });
    }
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    const res = await updateProfile(formData);
    setSaving(false);
    if (res.success) {
      setSuccessMsg('User profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setErrorMsg(res.error || 'Failed to update profile');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!passwordData.newPassword) {
      setErrorMsg('Please enter a new password');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setSaving(true);
    const res = await updateProfile({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
    setSaving(false);

    if (res.success) {
      setSuccessMsg('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setErrorMsg(res.error || 'Failed to update password');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="p-8 text-center text-gray-400">
        Please <span className="text-[#f95e26] cursor-pointer" onClick={() => navigate('/login')}>log in</span> to view user details.
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-[#171717] min-h-screen overflow-y-auto text-gray-200">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Notification Alerts */}
        {successMsg && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-950/40 border border-emerald-700 text-emerald-300 text-sm">
            <Check className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Profile Header Banner */}
        <Card3D maxTilt={6} className="rounded-2xl bg-[#1f1f1f] border border-[#333] p-6 sm:p-8 shadow-3d-subtle relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-32 bg-gradient-to-l from-[#f95e26]/10 to-transparent pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="relative translate-z-30">
                <img
                  src={formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#f95e26]/40 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-[#1f1f1f] rounded-full" title="Online" />
              </div>

              <div>
                <div className="flex items-center gap-3 flex-wrap translate-z-20">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{user.name}</h1>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider ${
                    user.role === 'Admin'
                      ? 'bg-[#f95e26]/20 text-[#f95e26] border border-[#f95e26]/40'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                  }`}>
                    {user.role}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                    Active Status
                  </span>
                </div>

                <p className="text-gray-400 text-sm mt-1 translate-z-10">{formData.title} • {formData.department}</p>

                <div className="flex items-center gap-4 text-xs text-gray-500 mt-3 flex-wrap translate-z-10">
                  <span className="flex items-center gap-1.5"><Mail size={13} className="text-gray-400" /> {user.email}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={13} className="text-gray-400" /> {formData.location}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={13} className="text-gray-400" /> Joined {user.joinedDate || '2024'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto translate-z-20">
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-900/60 text-red-400 bg-red-950/20 hover:bg-red-950/40 transition-colors text-sm font-medium btn-3d"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </Card3D>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-[#333] pb-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-[#2a2a2a] text-[#f95e26]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <User size={16} />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'security'
                ? 'bg-[#2a2a2a] text-[#f95e26]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Key size={16} />
            <span>Security & Password</span>
          </button>

          <button
            onClick={() => setActiveTab('permissions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'permissions'
                ? 'bg-[#2a2a2a] text-[#f95e26]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Shield size={16} />
            <span>Role & Permissions</span>
          </button>
        </div>

        {/* TAB 1: Profile Details */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSave} className="rounded-2xl bg-[#1f1f1f] border border-[#333] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#333]">
              <div>
                <h3 className="text-lg font-bold text-white">Personal Information</h3>
                <p className="text-xs text-gray-400">Update your account profile and display details across the CRM.</p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f95e26] hover:bg-[#e0521e] text-white text-sm font-medium transition-colors shadow-lg shadow-[#f95e26]/20 disabled:opacity-50"
              >
                <Save size={16} />
                <span>{saving ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171717] border border-[#383838] text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171717] border border-[#383838] text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Job Title</label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171717] border border-[#383838] text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Department</label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171717] border border-[#383838] text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171717] border border-[#383838] text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Office Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171717] border border-[#383838] text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Avatar Image URL</label>
              <input
                type="text"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#383838] text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Professional Bio</label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-[#171717] border border-[#383838] text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                placeholder="Write a brief description about your role and focus areas..."
              />
            </div>
          </form>
        )}

        {/* TAB 2: Security & Password */}
        {activeTab === 'security' && (
          <form onSubmit={handlePasswordChange} className="rounded-2xl bg-[#1f1f1f] border border-[#333] p-6 sm:p-8 space-y-6">
            <div className="pb-4 border-b border-[#333]">
              <h3 className="text-lg font-bold text-white">Password & Authentication</h3>
              <p className="text-xs text-gray-400">Ensure your account is protected with a secure password.</p>
            </div>

            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#383838] text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">New Password</label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#383838] text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#171717] border border-[#383838] text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f95e26] hover:bg-[#e0521e] text-white text-sm font-medium transition-colors shadow-lg shadow-[#f95e26]/20 disabled:opacity-50"
              >
                <Key size={16} />
                <span>{saving ? 'Updating...' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: Role & Permissions */}
        {activeTab === 'permissions' && (
          <div className="rounded-2xl bg-[#1f1f1f] border border-[#333] p-6 sm:p-8 space-y-6">
            <div className="pb-4 border-b border-[#333]">
              <h3 className="text-lg font-bold text-white">Permissions for {user.role}</h3>
              <p className="text-xs text-gray-400">Current privileges associated with your CRM account tier.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Lead & Deal Management", desc: "Full permissions to create, assign, update stage, and close deals.", granted: true },
                { title: "Account & Contacts Directory", desc: "View and edit corporate accounts and customer contact cards.", granted: true },
                { title: "Revenue & Sales Forecasting", desc: "Access to pipeline metrics, probability rates, and performance analytics.", granted: true },
                { title: "System & Global Settings", desc: "Modify company currency, team notifications, and timezone.", granted: user.role === 'Admin' },
                { title: "User & Team Administration", desc: "Add, invite, or delete team members from the organization.", granted: user.role === 'Admin' },
                { title: "Data Export & API Integrations", desc: "Export records and manage webhooks or REST API integrations.", granted: user.role === 'Admin' || user.role === 'Sales Manager' },
              ].map((perm, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#171717] border border-[#333] flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg shrink-0 ${perm.granted ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800' : 'bg-gray-800 text-gray-500'}`}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-200">{perm.title}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{perm.desc}</p>
                    <span className={`inline-block text-[10px] font-semibold uppercase mt-2 px-2 py-0.5 rounded ${perm.granted ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-700 text-gray-400'}`}>
                      {perm.granted ? 'Authorized' : 'Restricted to Admins'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

