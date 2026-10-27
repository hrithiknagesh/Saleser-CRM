import { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  Sun,
  Moon,
  Bell,
  X,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut,
  ChevronDown,
  CheckCheck
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [lightingEffect, setLightingEffect] = useState(false);
  const { isDark, setTheme } = useTheme();

  const handleSetTheme = (themeMode: 'light' | 'dark') => {
    setTheme(themeMode);
    if (themeMode === 'light') {
      setLightingEffect(true);
      setTimeout(() => setLightingEffect(false), 900);
    }
  };

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const createRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "New lead assigned to you: Anna Smith", time: "2 min ago", read: false, path: '/leads' },
    { id: 2, text: "Deal 'Beta Enterprise License' moved to Proposal Sent", time: "1 hour ago", read: false, path: '/deals' },
    { id: 3, text: "Task due tomorrow: Follow up with Acme Inc", time: "3 hours ago", read: false, path: '/tasks' },
    { id: 4, text: "Weekly analytics report is ready", time: "1 day ago", read: true, path: '/reports' },
    { id: 5, text: "New contact added: Robert Chen", time: "2 days ago", read: true, path: '/contacts' },
    { id: 6, text: "Deal closed! Delta Consulting - $12,000", time: "3 days ago", read: true, path: '/deals' },
    { id: 7, text: "Pipeline value increased by 18%", time: "1 week ago", read: true, path: '/reports' },
  ]);

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/':
        return 'Dashboard Overview';
      case '/leads':
        return 'Leads Management';
      case '/deals':
        return 'Deals Pipeline';
      case '/contacts':
        return 'Contacts Directory';
      case '/accounts':
        return 'Accounts & Companies';
      case '/tasks':
        return 'Tasks & Assignments';
      case '/reports':
        return 'Sales Analytics & Reports';
      case '/settings':
        return 'Settings & Preferences';
      case '/profile':
        return 'User Profile & Security';
      default:
        return 'Dashboard';
    }
  };

  // Global search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults(null); return; }
    const timer = setTimeout(() => {
      fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(searchQuery)}`)
        .then(r => r.json())
        .then(d => { setSearchResults(d); setShowSearch(true); });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
      if (createRef.current && !createRef.current.contains(e.target as Node)) setShowCreate(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNotificationClick = (item: typeof notifications[0]) => {
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
    setShowNotifs(false);
    navigate(item.path);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="h-16 flex items-center justify-between px-8 border-b border-[#333] bg-[#1a1a1a] relative select-none">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-white tracking-tight">{getPageTitle(location.pathname)}</h1>
      </div>
      
      <div className="flex items-center gap-5">
        {/* Global Search */}
        <div className="relative" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search leads, deals, contacts..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => searchResults && setShowSearch(true)}
            className="bg-[#242424] text-sm text-gray-200 rounded-full pl-9 pr-4 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#f95e26] w-64 border border-[#333] transition-all focus:w-72"
          />
          {showSearch && searchResults && (
            <div className="absolute top-full mt-2 left-0 w-96 bg-[#1f1f1f] border border-[#333] rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto animate-in fade-in">
              {searchResults.leads?.length > 0 && (
                <div className="p-3 border-b border-[#333]">
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">LEADS</div>
                  {searchResults.leads.map((l: any) => (
                    <div key={l.id} onClick={() => { navigate('/leads'); setShowSearch(false); setSearchQuery(''); }} className="px-3 py-2 hover:bg-[#252525] rounded-lg cursor-pointer text-sm text-gray-200 flex justify-between items-center">
                      <span>{l.name}</span>
                      <span className="text-xs text-gray-400">{l.company}</span>
                    </div>
                  ))}
                </div>
              )}
              {searchResults.deals?.length > 0 && (
                <div className="p-3 border-b border-[#333]">
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">DEALS</div>
                  {searchResults.deals.map((d: any) => (
                    <div key={d.id} onClick={() => { navigate('/deals'); setShowSearch(false); setSearchQuery(''); }} className="px-3 py-2 hover:bg-[#252525] rounded-lg cursor-pointer text-sm text-gray-200 flex justify-between items-center">
                      <span>{d.title}</span>
                      <span className="text-xs text-[#f95e26] font-semibold">${d.amount?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
              {searchResults.contacts?.length > 0 && (
                <div className="p-3 border-b border-[#333]">
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">CONTACTS</div>
                  {searchResults.contacts.map((c: any) => (
                    <div key={c.id} onClick={() => { navigate('/contacts'); setShowSearch(false); setSearchQuery(''); }} className="px-3 py-2 hover:bg-[#252525] rounded-lg cursor-pointer text-sm text-gray-200 flex justify-between items-center">
                      <span>{c.name}</span>
                      <span className="text-xs text-gray-400">{c.email}</span>
                    </div>
                  ))}
                </div>
              )}
              {searchResults.accounts?.length > 0 && (
                <div className="p-3">
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">ACCOUNTS</div>
                  {searchResults.accounts.map((a: any) => (
                    <div key={a.id} onClick={() => { navigate('/accounts'); setShowSearch(false); setSearchQuery(''); }} className="px-3 py-2 hover:bg-[#252525] rounded-lg cursor-pointer text-sm text-gray-200 flex justify-between items-center">
                      <span>{a.name}</span>
                      <span className="text-xs text-gray-400">{a.industry}</span>
                    </div>
                  ))}
                </div>
              )}
              {!searchResults.leads?.length && !searchResults.deals?.length && !searchResults.contacts?.length && !searchResults.accounts?.length && (
                <div className="p-6 text-center text-gray-500 text-sm">No results found for "{searchQuery}"</div>
              )}
            </div>
          )}
        </div>

        {/* Create Quick Button */}
        <div className="relative" ref={createRef}>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="bg-[#f95e26] hover:bg-[#e0521e] text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all btn-3d shadow-3d-orange"
          >
            <Plus size={15} /> Create
          </button>
          {showCreate && (
            <div className="absolute top-full mt-2 right-0 w-48 bg-[#1f1f1f] border border-[#333] rounded-xl shadow-2xl z-50 py-1 animate-in fade-in">
              {[
                { label: 'New Lead', path: '/leads' },
                { label: 'New Deal', path: '/deals' },
                { label: 'New Contact', path: '/contacts' },
                { label: 'New Task', path: '/tasks' },
                { label: 'New Account', path: '/accounts' },
              ].map(item => (
                <div
                  key={item.path}
                  onClick={() => { navigate(item.path); setShowCreate(false); }}
                  className="px-4 py-2 text-xs font-medium text-gray-300 hover:bg-[#252525] hover:text-[#f95e26] cursor-pointer transition-colors"
                >
                  {item.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Theme & Notifications */}
        <div className="flex items-center gap-3 text-gray-400">
          <div className="relative flex items-center gap-1 bg-[#242424] rounded-full p-1 border border-[#333] transition-colors theme-pill">
            {lightingEffect && (
              <span className="absolute inset-0 rounded-full bg-amber-400/40 blur-md animate-light-flash pointer-events-none" />
            )}
            <button
              type="button"
              onClick={() => handleSetTheme('light')}
              className={`relative p-1.5 rounded-full cursor-pointer transition-all ${
                !isDark
                  ? 'bg-gradient-to-r from-amber-400 to-[#f95e26] text-white shadow-md shadow-orange-500/30 ring-2 ring-amber-300/60'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Light mode"
            >
              <Sun size={15} className={!isDark ? 'animate-spin-slow' : ''} />
            </button>
            <button
              type="button"
              onClick={() => handleSetTheme('dark')}
              className={`p-1.5 rounded-full cursor-pointer transition-all ${
                isDark ? 'bg-[#333] text-[#f95e26] shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
              title="Dark mode"
            >
              <Moon size={15} />
            </button>
          </div>

          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 w-4 h-4 bg-[#f95e26] rounded-full text-[9px] flex items-center justify-center text-white font-bold border border-[#1a1a1a]">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifs && (
              <div className="absolute top-full mt-2 right-0 w-84 bg-[#1f1f1f] border border-[#383838] rounded-2xl shadow-2xl z-50 max-h-96 overflow-hidden flex flex-col animate-in fade-in">
                <div className="flex justify-between items-center p-3.5 border-b border-[#333] bg-[#242424]/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-200 uppercase tracking-wider">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-[#f95e26]/20 text-[#f95e26] px-1.5 py-0.2 rounded-full font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] text-gray-400 hover:text-[#f95e26] flex items-center gap-1 transition-colors"
                        title="Mark all as read"
                      >
                        <CheckCheck size={13} />
                        <span>Read all</span>
                      </button>
                    )}
                    <button onClick={() => setShowNotifs(false)}>
                      <X size={14} className="text-gray-400 hover:text-white" />
                    </button>
                  </div>
                </div>

                <div className="overflow-y-auto divide-y divide-[#2c2c2c]">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`px-4 py-3 hover:bg-[#252525] cursor-pointer transition-colors ${
                        n.read ? 'opacity-70' : 'bg-[#242424]/40'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {!n.read && (
                          <div className="w-2 h-2 bg-[#f95e26] rounded-full mt-1.5 shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-xs text-gray-200 font-medium leading-relaxed">{n.text}</p>
                          <p className="text-[10px] text-gray-500 mt-1">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={userMenuRef}>
          <div
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[#242424] cursor-pointer transition-colors border border-transparent hover:border-[#333]"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name || 'User'}
                className="w-8 h-8 rounded-full object-cover border border-[#444]"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-[#1a1a1a]" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="font-medium text-gray-200 text-xs leading-tight">{user?.name || 'Kiran'}</div>
              <div className="text-[10px] text-[#f95e26] font-semibold">{user?.role || 'Admin'}</div>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </div>

          {showUserMenu && (
            <div className="absolute top-full mt-2 right-0 w-64 bg-[#1f1f1f] border border-[#333] rounded-xl shadow-2xl z-50 overflow-hidden py-1 animate-in fade-in">
              <div className="px-4 py-3 border-b border-[#333] bg-[#242424]/40">
                <p className="text-sm font-semibold text-white">{user?.name || 'Kiran'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email || 'kiran@clientra.com'}</p>
                <span className="inline-block mt-1.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#f95e26]/20 text-[#f95e26] border border-[#f95e26]/30">
                  {user?.role || 'Admin'}
                </span>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    navigate('/profile');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-gray-300 hover:bg-[#242424] hover:text-white flex items-center gap-2.5 transition-colors"
                >
                  <UserIcon size={15} className="text-[#f95e26]" />
                  <span>My Profile & Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigate('/settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-gray-300 hover:bg-[#242424] hover:text-white flex items-center gap-2.5 transition-colors"
                >
                  <SettingsIcon size={15} className="text-gray-400" />
                  <span>Settings & Preferences</span>
                </button>
              </div>

              <div className="border-t border-[#333] py-1">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                    navigate('/login');
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-red-400 hover:bg-red-950/20 flex items-center gap-2.5 transition-colors"
                >
                  <LogOut size={15} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
