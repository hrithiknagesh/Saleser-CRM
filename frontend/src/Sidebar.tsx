import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  UserSquare2,
  Briefcase,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  MessageSquare,
  Share2,
  User,
  LogOut,
  X,
  Check,
  Copy,
  Star,
  Send,
  Sparkles
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeModal, setActiveModal] = useState<'help' | 'feedback' | 'invite' | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    logout();
    navigate('/login');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '/signup?ref=team_invite');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <>
      <div className="w-64 bg-[#1f1f1f] h-screen flex flex-col justify-between border-r border-[#333] p-4 font-sans text-sm select-none">
        <div className="overflow-y-auto">
          <div className="flex items-center gap-2.5 mb-8 mt-2 px-2">
            <div className="w-7 h-7 bg-[#f95e26] rounded-xl flex items-center justify-center text-white font-extrabold text-xs shadow-3d-orange">
              C
            </div>
            <span className="text-xl font-bold text-white tracking-wide">Saleser</span>
          </div>

          <nav className="flex flex-col gap-1">
            <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" active={location.pathname === '/'} />
            <NavItem to="/leads" icon={<Users size={18} />} label="Leads" active={location.pathname === '/leads'} />
            <NavItem to="/deals" icon={<Briefcase size={18} />} label="Deals" active={location.pathname === '/deals'} />
            <NavItem to="/contacts" icon={<UserSquare2 size={18} />} label="Contacts" active={location.pathname === '/contacts'} />
            <NavItem to="/accounts" icon={<Users size={18} />} label="Accounts" active={location.pathname === '/accounts'} />
            <NavItem to="/tasks" icon={<FileText size={18} />} label="Tasks" active={location.pathname === '/tasks'} />
            <NavItem to="/reports" icon={<BarChart3 size={18} />} label="Reports" active={location.pathname === '/reports'} />
            <NavItem to="/profile" icon={<User size={18} />} label="My Profile" active={location.pathname === '/profile'} />
            <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" active={location.pathname === '/settings'} />
          </nav>

          <div className="mt-6 pt-4 border-t border-[#333]/60">
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">Support & Community</div>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => setActiveModal('help')}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-[#2a2a2a] transition-colors text-left w-full"
              >
                <HelpCircle size={18} />
                <span className="font-medium">Help Center</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('feedback')}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-[#2a2a2a] transition-colors text-left w-full"
              >
                <MessageSquare size={18} />
                <span className="font-medium">Feedback</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('invite')}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-[#2a2a2a] transition-colors text-left w-full"
              >
                <Share2 size={18} />
                <span className="font-medium">Invite a Colleague</span>
              </button>
            </div>
          </div>
        </div>

        {/* User Card at bottom of Sidebar */}
        <div className="pt-3 border-t border-[#333]">
          <div
            onClick={() => navigate('/profile')}
            className="flex items-center justify-between p-2 rounded-xl bg-[#252525] hover:bg-[#2b2b2b] border border-[#383838] cursor-pointer transition-colors group shadow-3d-subtle"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="relative shrink-0">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={user?.name || 'User'}
                  className="w-8 h-8 rounded-full object-cover border border-[#444]"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-[#252525]" />
              </div>
              <div className="truncate text-left">
                <div className="text-xs font-semibold text-gray-200 group-hover:text-white truncate">
                  {user?.name || 'Kiran'}
                </div>
                <div className="text-[10px] text-[#f95e26] font-medium truncate">
                  {user?.role || 'Admin'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Log out"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Support & Community Modals */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#1f1f1f] rounded-2xl border border-[#383838] w-full max-w-lg p-6 shadow-2xl relative animate-float-3d">
            <button
              onClick={() => {
                setActiveModal(null);
                setFeedbackSent(false);
                setInviteSent(false);
              }}
              className="absolute top-5 right-5 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>

            {/* Help Center */}
            {activeModal === 'help' && (
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="p-2 rounded-xl bg-[#f95e26]/10 text-[#f95e26]">
                    <HelpCircle size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Saleser Help Center</h3>
                    <p className="text-xs text-gray-400">Documentation & system shortcuts</p>
                  </div>
                </div>

                <div className="space-y-3 mt-4 text-xs text-gray-300">
                  <div className="p-3 rounded-xl bg-[#252525] border border-[#383838]">
                    <h4 className="font-semibold text-white mb-1">How do I create and manage deals?</h4>
                    <p className="text-gray-400">Go to Deals in the sidebar. You can use the Kanban board columns to review pipeline value, search, or create new deals.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#252525] border border-[#383838]">
                    <h4 className="font-semibold text-white mb-1">How do 3D visuals work?</h4>
                    <p className="text-gray-400">The 3D cards react to your cursor tilt in real-time. The 3D Pipeline Scene renders an interactive mathematical projection of your team's live deal network.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#252525] border border-[#383838]">
                    <h4 className="font-semibold text-white mb-1">Direct Support</h4>
                    <p className="text-gray-400">Need personalized enterprise setup? Contact our engineers at <span className="text-[#f95e26]">support@clientra.com</span></p>
                  </div>
                </div>
              </div>
            )}

            {/* Feedback */}
            {activeModal === 'feedback' && (
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="p-2 rounded-xl bg-[#f95e26]/10 text-[#f95e26]">
                    <MessageSquare size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Send Us Feedback</h3>
                    <p className="text-xs text-gray-400">Help us make Saleser CRM even better</p>
                  </div>
                </div>

                {feedbackSent ? (
                  <div className="py-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                      <Check size={24} />
                    </div>
                    <h4 className="text-base font-bold text-white">Thank You!</h4>
                    <p className="text-xs text-gray-400 mt-1">Your feedback helps us continuously improve the platform.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">How would you rate your experience?</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFeedbackRating(star)}
                            className={`p-2 rounded-lg border transition-all ${
                              star <= feedbackRating
                                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                                : 'bg-[#252525] border-[#383838] text-gray-600'
                            }`}
                          >
                            <Star size={18} fill={star <= feedbackRating ? 'currentColor' : 'none'} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">Comments or Suggestions</label>
                      <textarea
                        rows={4}
                        placeholder="What do you think of the new 3D effects, profile, and pipeline board?"
                        className="w-full p-3 rounded-xl bg-[#252525] border border-[#383838] text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setFeedbackSent(true)}
                      className="w-full py-2.5 rounded-xl bg-[#f95e26] hover:bg-[#e0521e] text-white font-semibold text-xs shadow-3d-orange transition-all btn-3d flex items-center justify-center gap-2"
                    >
                      <Send size={14} />
                      <span>Submit Feedback</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Invite a Friend */}
            {activeModal === 'invite' && (
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="p-2 rounded-xl bg-[#f95e26]/10 text-[#f95e26]">
                    <Share2 size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Invite a Team Colleague</h3>
                    <p className="text-xs text-gray-400">Collaborate on deals, tasks, and accounts in real-time</p>
                  </div>
                </div>

                {inviteSent ? (
                  <div className="py-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                      <Check size={24} />
                    </div>
                    <h4 className="text-base font-bold text-white">Invitation Dispatched!</h4>
                    <p className="text-xs text-gray-400 mt-1">We sent an invitation link to <strong>{inviteEmail}</strong>.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">Colleague Work Email</label>
                      <input
                        type="email"
                        placeholder="colleague@clientra.com"
                        value={inviteEmail}
                        onChange={e => setInviteEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#252525] border border-[#383838] text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#f95e26]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">Or share direct team invite link</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={window.location.origin + '/signup?team=saleser_hq'}
                          className="flex-1 px-3 py-2 rounded-xl bg-[#252525] border border-[#383838] text-xs text-gray-400 font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className="px-3.5 py-2 rounded-xl bg-[#2a2a2a] hover:bg-[#333] border border-[#444] text-xs text-white flex items-center gap-1.5 btn-3d"
                        >
                          {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                          <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setInviteSent(true)}
                      className="w-full mt-2 py-2.5 rounded-xl bg-[#f95e26] hover:bg-[#e0521e] text-white font-semibold text-xs shadow-3d-orange transition-all btn-3d flex items-center justify-center gap-2"
                    >
                      <Sparkles size={14} />
                      <span>Send Team Invitation</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const NavItem = ({ to, icon, label, active = false }: { to: string; icon: React.ReactNode; label: string; active?: boolean }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
        active
          ? 'bg-[#2a2a2a] text-[#f95e26] relative font-semibold shadow-sm border border-[#383838]'
          : 'text-gray-400 hover:text-gray-200 hover:bg-[#252525]'
      }`}
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
      {active && <div className="absolute right-2.5 w-1.5 h-1.5 bg-[#f95e26] rounded-full shadow-sm" />}
    </Link>
  );
};

export default Sidebar;
