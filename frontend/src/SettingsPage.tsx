import { useState, useEffect, useCallback } from 'react';
import { Settings, Bell, Users, Save, Plus, Trash2, X, Check, User, Mail, Smartphone, BarChart2, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import { INITIAL_DATA } from './api';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  weeklyReport: boolean;
  dealAlerts: boolean;
}

interface CompanyProfile {
  companyName: string;
  email: string;
  timezone: string;
  currency: string;
  language: string;
}

interface SettingsData {
  companyProfile: CompanyProfile;
  notifications: NotificationSettings;
  teamMembers: TeamMember[];
}

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Kolkata',
  'Australia/Sydney',
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR'];
const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
];

const API_BASE = 'http://localhost:3000/api';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [settings, setSettings] = useState<SettingsData>({
    companyProfile: {
      companyName: '',
      email: '',
      timezone: 'UTC',
      currency: 'USD',
      language: 'en',
    },
    notifications: {
      email: false,
      push: false,
      sms: false,
      weeklyReport: false,
      dealAlerts: false,
    },
    teamMembers: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'Member' });

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/settings`);
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      setSettings({
        companyProfile: data.companyProfile || {
          companyName: data.companyName || 'Clientra',
          email: data.email || 'admin@clientra.com',
          timezone: data.timezone || 'UTC',
          currency: data.currency || 'USD',
          language: data.language || 'en',
        },
        notifications: {
          email: Boolean(data.notifications?.email ?? true),
          push: Boolean(data.notifications?.push ?? true),
          sms: Boolean(data.notifications?.sms ?? false),
          weeklyReport: Boolean(data.notifications?.weeklyReport ?? true),
          dealAlerts: Boolean(data.notifications?.dealAlerts ?? true),
        },
        teamMembers: Array.isArray(data.teamMembers) ? data.teamMembers : [],
      });
    } catch {
      setSettings(INITIAL_DATA.settings as any);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (successMsg || errorMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg('');
        setErrorMsg('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, errorMsg]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      setSuccessMsg('Settings saved successfully!');
    } catch (err) {
      setErrorMsg('Failed to save settings');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleProfileChange = (field: keyof CompanyProfile, value: string) => {
    setSettings((prev) => ({
      ...prev,
      companyProfile: { ...prev.companyProfile, [field]: value },
    }));
  };

  const handleNotificationToggle = (field: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: !prev.notifications[field] },
    }));
  };

  const handleAddMember = async () => {
    if (!newMember.name.trim() || !newMember.email.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/settings/team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember),
      });
      if (!res.ok) throw new Error('Failed to add team member');
      const added = await res.json();
      setSettings((prev) => ({
        ...prev,
        teamMembers: [...prev.teamMembers, added],
      }));
      setNewMember({ name: '', email: '', role: 'Member' });
      setShowAddMember(false);
      setSuccessMsg('Team member added!');
    } catch (err) {
      setErrorMsg('Failed to add team member');
      console.error(err);
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/settings/team/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete team member');
      setSettings((prev) => ({
        ...prev,
        teamMembers: prev.teamMembers.filter((m) => m.id !== id),
      }));
      setSuccessMsg('Team member removed.');
    } catch (err) {
      setErrorMsg('Failed to delete team member');
      console.error(err);
    }
  };

  // Theme-aware class helpers
  const pageBg = isDark ? 'bg-[#171717]' : 'bg-slate-100';
  const cardBg = isDark ? 'bg-[#1f1f1f]' : 'bg-white';
  const innerBg = isDark ? 'bg-[#171717]' : 'bg-slate-50';
  const surfaceBg = isDark ? 'bg-[#252525]' : 'bg-slate-100';
  const cardBorder = isDark ? 'border-[#333]' : 'border-slate-200';
  const innerBorder = isDark ? 'border-[#383838]' : 'border-slate-300';
  const divideColor = isDark ? 'divide-[#2a2a2a]' : 'divide-slate-200';
  const headingText = isDark ? 'text-gray-200' : 'text-slate-800';
  const subText = isDark ? 'text-gray-400' : 'text-slate-500';
  const labelText = isDark ? 'text-gray-400' : 'text-slate-600';
  const bodyText = isDark ? 'text-gray-200' : 'text-slate-700';
  const inputBg = isDark ? 'bg-[#171717] text-gray-200 placeholder-gray-500 border-[#333]' : 'bg-white text-slate-800 placeholder-slate-400 border-slate-300';
  const rowHover = isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-slate-50';
  const profileBtnBg = isDark ? 'text-gray-300 bg-[#242424] hover:bg-[#2e2e2e] border-[#333]' : 'text-slate-700 bg-white hover:bg-slate-100 border-slate-300';
  const badgeCountBg = isDark ? 'bg-gray-700 text-gray-400' : 'bg-slate-200 text-slate-500';

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-full ${pageBg}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f95e26]" />
      </div>
    );
  }

  const notificationItems: {
    key: keyof NotificationSettings;
    label: string;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: 'email',
      label: 'Email Notifications',
      desc: 'Receive digest summaries, task reminders, and direct account alerts',
      icon: <Mail className="w-4 h-4 text-[#f95e26]" />,
    },
    {
      key: 'push',
      label: 'Push Notifications',
      desc: 'Real-time desktop notifications for live deals and new inbound leads',
      icon: <Bell className="w-4 h-4 text-amber-400" />,
    },
    {
      key: 'sms',
      label: 'SMS Notifications',
      desc: 'Urgent mobile text alerts for contract signing and high-priority tasks',
      icon: <Smartphone className="w-4 h-4 text-blue-400" />,
    },
    {
      key: 'weeklyReport',
      label: 'Weekly Executive Report',
      desc: 'Automated weekly revenue performance, pipeline changes, and rep rankings',
      icon: <BarChart2 className="w-4 h-4 text-emerald-400" />,
    },
    {
      key: 'dealAlerts',
      label: 'Deal Stage Alerts',
      desc: 'Instant notifications when opportunities advance or close in pipeline',
      icon: <Zap className="w-4 h-4 text-purple-400" />,
    },
  ];

  return (
    <div className={`min-h-screen p-6 md:p-8 transition-colors duration-300 ${pageBg}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Settings className="w-7 h-7 text-[#f95e26]" />
          <h1 className={`text-2xl font-bold ${headingText}`}>Settings</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/profile')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium border transition-colors ${profileBtnBg}`}
          >
            <User className="w-4 h-4 text-[#f95e26]" />
            <span>My Profile</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 bg-[#f95e26]"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Toast Messages */}
      {successMsg && (
        <div className="flex items-center gap-2 mb-6 px-4 py-3 rounded-lg border bg-green-900/30 border-green-700 text-green-400">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-2 mb-6 px-4 py-3 rounded-lg border bg-red-900/30 border-red-700 text-red-400">
          <X className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="space-y-6 max-w-4xl">
        {/* Company Profile */}
        <div className={`rounded-xl p-6 border transition-colors duration-300 ${cardBg} ${cardBorder}`}>
          <div className="flex items-center gap-2 mb-6">
            <Settings className={`w-5 h-5 ${subText}`} />
            <h2 className={`text-lg font-semibold ${headingText}`}>Company Profile</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Company Name */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${labelText}`}>Company Name</label>
              <input
                type="text"
                value={settings.companyProfile.companyName}
                onChange={(e) => handleProfileChange('companyName', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#f95e26] border transition-colors ${inputBg}`}
                placeholder="Enter company name"
              />
            </div>

            {/* Email */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${labelText}`}>Email</label>
              <input
                type="email"
                value={settings.companyProfile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#f95e26] border transition-colors ${inputBg}`}
                placeholder="company@example.com"
              />
            </div>

            {/* Timezone */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${labelText}`}>Timezone</label>
              <select
                value={settings.companyProfile.timezone}
                onChange={(e) => handleProfileChange('timezone', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#f95e26] border cursor-pointer transition-colors ${inputBg}`}
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>

            {/* Currency */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${labelText}`}>Currency</label>
              <select
                value={settings.companyProfile.currency}
                onChange={(e) => handleProfileChange('currency', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#f95e26] border cursor-pointer transition-colors ${inputBg}`}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${labelText}`}>Language</label>
              <select
                value={settings.companyProfile.language}
                onChange={(e) => handleProfileChange('language', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#f95e26] border cursor-pointer transition-colors ${inputBg}`}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className={`rounded-2xl p-6 border transition-colors duration-300 ${cardBg} ${cardBorder}`}>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="p-2 rounded-xl bg-[#f95e26]/10 text-[#f95e26]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${headingText}`}>Notification Preferences</h2>
              <p className={`text-xs ${subText}`}>Configure how and when you receive sales alerts across channels</p>
            </div>
          </div>

          <div className={`divide-y ${divideColor}`}>
            {notificationItems.map(({ key, label, desc, icon }) => {
              const isEnabled = settings.notifications[key];
              return (
                <div
                  key={key}
                  onClick={() => handleNotificationToggle(key)}
                  className={`flex items-center justify-between py-3.5 px-3 rounded-xl transition-colors cursor-pointer group ${rowHover}`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2 rounded-xl border shrink-0 mt-0.5 transition-colors ${surfaceBg} ${innerBorder}`}>
                      {icon}
                    </div>
                    <div>
                      <div className={`text-sm font-semibold transition-colors ${bodyText}`}>
                        {label}
                      </div>
                      <div className={`text-xs mt-0.5 leading-relaxed ${subText}`}>
                        {desc}
                      </div>
                    </div>
                  </div>

                  {/* iOS-Style Toggle Switch */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isEnabled}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNotificationToggle(key);
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#f95e26] focus:ring-offset-2 ${
                      isEnabled ? 'bg-[#f95e26]' : isDark ? 'bg-[#333]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                        isEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Members */}
        <div className={`rounded-xl p-6 border transition-colors duration-300 ${cardBg} ${cardBorder}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className={`w-5 h-5 ${subText}`} />
              <h2 className={`text-lg font-semibold ${headingText}`}>Team Members</h2>
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${badgeCountBg}`}>
                {settings.teamMembers.length}
              </span>
            </div>
            <button
              onClick={() => setShowAddMember(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 bg-[#f95e26]"
            >
              <Plus className="w-4 h-4" />
              Add Member
            </button>
          </div>

          {/* Add Member Form */}
          {showAddMember && (
            <div className={`mb-5 p-4 rounded-lg border ${innerBg} ${cardBorder}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-sm font-medium ${bodyText}`}>New Team Member</h3>
                <button onClick={() => setShowAddMember(false)} className={`${subText} hover:text-gray-300`}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="Name"
                  className={`px-3 py-2 rounded-lg outline-none text-sm border transition-colors ${inputBg}`}
                />
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="Email"
                  className={`px-3 py-2 rounded-lg outline-none text-sm border transition-colors ${inputBg}`}
                />
                <div className="flex gap-2">
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    className={`flex-1 px-3 py-2 rounded-lg outline-none text-sm appearance-none cursor-pointer border transition-colors ${inputBg}`}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Member">Member</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                  <button
                    onClick={handleAddMember}
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90 bg-[#f95e26]"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Team Table */}
          {settings.teamMembers.length === 0 ? (
            <div className={`text-center py-8 ${subText}`}>
              <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>No team members yet. Click &quot;Add Member&quot; to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${cardBorder}`}>
                    <th className={`text-left py-3 px-4 text-xs font-medium uppercase tracking-wider ${subText}`}>
                      Name
                    </th>
                    <th className={`text-left py-3 px-4 text-xs font-medium uppercase tracking-wider ${subText}`}>
                      Email
                    </th>
                    <th className={`text-left py-3 px-4 text-xs font-medium uppercase tracking-wider ${subText}`}>
                      Role
                    </th>
                    <th className={`text-right py-3 px-4 text-xs font-medium uppercase tracking-wider ${subText}`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {settings.teamMembers.map((member) => (
                    <tr
                      key={member.id}
                      className={`transition-colors border-b ${rowHover} ${isDark ? 'border-[#2a2a2a]' : 'border-slate-100'}`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white bg-[#f95e26]"
                          >
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <span className={`text-sm ${bodyText}`}>{member.name}</span>
                        </div>
                      </td>
                      <td className={`py-3 px-4 text-sm ${subText}`}>{member.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor:
                              member.role === 'Admin'
                                ? 'rgba(249,94,38,0.15)'
                                : member.role === 'Manager'
                                ? 'rgba(59,130,246,0.15)'
                                : 'rgba(107,114,128,0.15)',
                            color:
                              member.role === 'Admin'
                                ? '#f95e26'
                                : member.role === 'Manager'
                                ? '#60a5fa'
                                : '#9ca3af',
                          }}
                        >
                          {member.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-400/10"
                          title="Remove member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
