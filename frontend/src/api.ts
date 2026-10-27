// Central API service with seamless demo fallback for deployed static environments (e.g. Netlify)

const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:3000/api';

const INITIAL_DATA = {
  leads: [
    { id: 1, company: "Acme Inc", name: "Michael Lee", email: "michael@acme.inc", phone: "+1 234 567 8900", stage: "Qualified", source: "Website", date: "2025-09-14", assignee: "Sarah K.", notes: "Interested in enterprise plan" },
    { id: 2, company: "Beta Corp", name: "Jessica Tan", email: "jessica@beta.corp", phone: "+1 987 654 3210", stage: "Proposal Sent", source: "Referral", date: "2025-09-12", assignee: "John D.", notes: "" },
    { id: 3, company: "Gamma LLC", name: "David Kim", email: "david@gamma.llc", phone: "+1 555 123 4567", stage: "New Lead", source: "Cold Call", date: "2025-08-30", assignee: "Emily R.", notes: "Follow up next week" },
    { id: 4, company: "Delta Tech", name: "Anna Smith", email: "anna@delta.tech", phone: "+1 555 987 6543", stage: "New Lead", source: "Event", date: "2025-10-01", assignee: "Sarah K.", notes: "Met at TechConf 2025" },
    { id: 5, company: "Omega Solutions", name: "Robert Chen", email: "robert@omega.sol", phone: "+1 555 456 7890", stage: "Qualified", source: "LinkedIn", date: "2025-09-28", assignee: "John D.", notes: "" },
    { id: 6, company: "Zenith Corp", name: "Maria Garcia", email: "maria@zenith.corp", phone: "+1 555 321 0987", stage: "Proposal Sent", source: "Website", date: "2025-09-20", assignee: "Emily R.", notes: "Waiting for budget approval" }
  ],
  deals: [
    { id: 1, title: "Acme Q4 Upgrade", company: "Acme Inc", contact: "Michael Lee", amount: 15000, stage: "Qualified", probability: 60, expectedClose: "2025-11-15", notes: "Upgrade from basic to enterprise" },
    { id: 2, title: "Beta Enterprise License", company: "Beta Corp", contact: "Jessica Tan", amount: 45000, stage: "Proposal Sent", probability: 75, expectedClose: "2025-10-20", notes: "3-year contract" },
    { id: 3, title: "Gamma Implementation", company: "Gamma LLC", contact: "David Kim", amount: 8500, stage: "New", probability: 20, expectedClose: "2025-12-01", notes: "" },
    { id: 4, title: "Delta Consulting", company: "Delta Tech", contact: "Anna Smith", amount: 12000, stage: "Closed Won", probability: 100, expectedClose: "2025-09-25", notes: "Signed!" },
    { id: 5, title: "Omega Analytics Platform", company: "Omega Solutions", contact: "Robert Chen", amount: 32000, stage: "Qualified", probability: 50, expectedClose: "2025-11-30", notes: "" },
    { id: 6, title: "Zenith SaaS Migration", company: "Zenith Corp", contact: "Maria Garcia", amount: 28000, stage: "Negotiation", probability: 80, expectedClose: "2025-10-30", notes: "Final pricing discussion" }
  ],
  contacts: [
    { id: 1, name: "Michael Lee", email: "michael@acme.inc", phone: "+1 234 567 8900", company: "Acme Inc", position: "CTO", lastContact: "2025-09-14", notes: "" },
    { id: 2, name: "Jessica Tan", email: "jessica@beta.corp", phone: "+1 987 654 3210", company: "Beta Corp", position: "VP of Sales", lastContact: "2025-09-12", notes: "" },
    { id: 3, name: "David Kim", email: "david@gamma.llc", phone: "+1 555 123 4567", company: "Gamma LLC", position: "CEO", lastContact: "2025-08-30", notes: "Prefers morning calls" },
    { id: 4, name: "Anna Smith", email: "anna@delta.tech", phone: "+1 555 987 6543", company: "Delta Tech", position: "Product Manager", lastContact: "2025-10-01", notes: "" },
    { id: 5, name: "Robert Chen", email: "robert@omega.sol", phone: "+1 555 456 7890", company: "Omega Solutions", position: "Director of Engineering", lastContact: "2025-09-28", notes: "" },
    { id: 6, name: "Maria Garcia", email: "maria@zenith.corp", phone: "+1 555 321 0987", company: "Zenith Corp", position: "CFO", lastContact: "2025-09-20", notes: "Decision maker" }
  ],
  accounts: [
    { id: 1, name: "Acme Inc", industry: "Technology", website: "acme.inc", phone: "+1 800 111 2222", employees: 500, revenue: "$50M", owner: "Sarah K.", status: "Active", createdAt: "2025-01-15" },
    { id: 2, name: "Beta Corp", industry: "Finance", website: "beta.corp", phone: "+1 800 333 4444", employees: 1200, revenue: "$200M", owner: "John D.", status: "Active", createdAt: "2025-02-20" },
    { id: 3, name: "Gamma LLC", industry: "Healthcare", website: "gamma.llc", phone: "+1 800 555 6666", employees: 80, revenue: "$10M", owner: "Emily R.", status: "Active", createdAt: "2025-03-10" },
    { id: 4, name: "Delta Tech", industry: "SaaS", website: "delta.tech", phone: "+1 800 777 8888", employees: 250, revenue: "$30M", owner: "Sarah K.", status: "Inactive", createdAt: "2025-04-05" },
    { id: 5, name: "Omega Solutions", industry: "Consulting", website: "omega.sol", phone: "+1 800 999 0000", employees: 150, revenue: "$20M", owner: "John D.", status: "Active", createdAt: "2025-05-12" },
    { id: 6, name: "Zenith Corp", industry: "Manufacturing", website: "zenith.corp", phone: "+1 800 222 3333", employees: 3000, revenue: "$500M", owner: "Emily R.", status: "Active", createdAt: "2025-06-01" }
  ],
  tasks: [
    { id: 1, title: "Follow up with Acme Inc", description: "Send pricing details for Q4", dueDate: "2025-09-20", priority: "High", status: "Pending", assignee: "Sarah K.", relatedTo: "Acme Inc" },
    { id: 2, title: "Send proposal to Beta Corp", description: "Enterprise license proposal", dueDate: "2025-09-18", priority: "High", status: "Completed", assignee: "John D.", relatedTo: "Beta Corp" },
    { id: 3, title: "Schedule demo for Gamma LLC", description: "Product demo with CEO", dueDate: "2025-09-25", priority: "Medium", status: "Pending", assignee: "Emily R.", relatedTo: "Gamma LLC" },
    { id: 4, title: "Update CRM records", description: "Clean up duplicate contacts", dueDate: "2025-09-22", priority: "Low", status: "Pending", assignee: "Sarah K.", relatedTo: "" },
    { id: 5, title: "Prepare quarterly report", description: "Q3 sales performance report", dueDate: "2025-10-01", priority: "Medium", status: "Pending", assignee: "John D.", relatedTo: "" },
    { id: 6, title: "Contract renewal - Delta Tech", description: "Negotiate renewal terms", dueDate: "2025-10-15", priority: "High", status: "In Progress", assignee: "Emily R.", relatedTo: "Delta Tech" }
  ],
  settings: {
    companyProfile: {
      companyName: "Clientra",
      email: "admin@clientra.com",
      timezone: "America/New_York",
      currency: "USD",
      language: "en"
    },
    notifications: { email: true, push: true, sms: false, weeklyReport: true, dealAlerts: true },
    teamMembers: [
      { id: "1", name: "Kiran", email: "kiran@clientra.com", role: "Admin" },
      { id: "2", name: "Sarah K.", email: "sarah@clientra.com", role: "Manager" },
      { id: "3", name: "John D.", email: "john@clientra.com", role: "Member" },
      { id: "4", name: "Emily R.", email: "emily@clientra.com", role: "Manager" }
    ]
  }
};

function getLocalStore<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(`crm_${key}`);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocalStore<T>(key: string, val: T): void {
  try {
    localStorage.setItem(`crm_${key}`, JSON.stringify(val));
  } catch (e) {
    console.error(e);
  }
}

// Universal fetch helper with fallback
export async function apiFetch<T>(endpoint: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  // If we are on an https origin (like Netlify) and API_BASE is http://localhost:3000,
  // browsers will block the request immediately (Mixed Content).
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const isLocalHost = API_BASE.includes('localhost') || API_BASE.includes('127.0.0.1');

  if (isHttps && isLocalHost) {
    if (fallbackData !== undefined) return fallbackData;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw new Error('API fetch failed and no fallback provided');
  }
}

// Dashboard
export async function fetchDashboardData() {
  const leads = getLocalStore('leads', INITIAL_DATA.leads);
  const deals = getLocalStore('deals', INITIAL_DATA.deals);
  const totalLeads = leads.length;
  const dealsInPipeline = deals.filter(d => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost').length;
  const revenueForecast = deals.reduce((acc, d) => acc + (d.amount || 0), 0);
  const closedTargets = deals.filter(d => d.stage === 'Closed Won').reduce((acc, d) => acc + (d.amount || 0), 0);

  const fallback = {
    totalLeads,
    dealsInPipeline,
    revenueForecast: revenueForecast || 1280000,
    closedTargets: closedTargets || 342000,
    pipelineOverview: {
      newLeads: leads.filter(l => l.stage === 'New Lead').length || 2,
      qualified: leads.filter(l => l.stage === 'Qualified').length || 2,
      proposalSent: leads.filter(l => l.stage === 'Proposal Sent').length || 2,
      closedDeals: deals.filter(d => d.stage === 'Closed Won').length || 1,
    },
    recentLeads: leads.slice(0, 6),
    insights: [
      { text: "Lead volume grew by +24% this week", info: "High Growth", status: "success" },
      { text: "2 proposals pending sign-off for > 5 days", info: "Attention Needed", status: "warning" },
      { text: "Win rate for Tech sector reached 78%", info: "+12% vs Q2", status: "info" },
      { text: "Target exceeded for Enterprise accounts", info: "Goal Met", status: "success" },
    ]
  };

  return apiFetch('/dashboard', undefined, fallback);
}

// Leads
export async function fetchLeads() {
  const local = getLocalStore('leads', INITIAL_DATA.leads);
  return apiFetch('/leads', undefined, local);
}

// Deals
export async function fetchDeals() {
  const local = getLocalStore('deals', INITIAL_DATA.deals);
  return apiFetch('/deals', undefined, local);
}

// Tasks
export async function fetchTasks() {
  const local = getLocalStore('tasks', INITIAL_DATA.tasks);
  return apiFetch('/tasks', undefined, local);
}

// Contacts
export async function fetchContacts() {
  const local = getLocalStore('contacts', INITIAL_DATA.contacts);
  return apiFetch('/contacts', undefined, local);
}

// Accounts
export async function fetchAccounts() {
  const local = getLocalStore('accounts', INITIAL_DATA.accounts);
  return apiFetch('/accounts', undefined, local);
}

// Settings
export async function fetchSettings() {
  const local = getLocalStore('settings', INITIAL_DATA.settings);
  return apiFetch('/settings', undefined, local);
}

export { API_BASE, getLocalStore, setLocalStore, INITIAL_DATA };
