const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// ── Helper ──────────────────────────────────────────────────────────
function nextId(arr) {
  return arr.length > 0 ? Math.max(...arr.map(i => i.id)) + 1 : 1;
}

// ── In-memory data store ────────────────────────────────────────────
const data = {
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
    companyName: "Clientra",
    email: "admin@clientra.com",
    timezone: "America/New_York",
    currency: "USD",
    language: "en",
    theme: "dark",
    notifications: { email: true, push: true, sms: false, weeklyReport: true, dealAlerts: true },
    teamMembers: [
      { id: 1, name: "Kiran", email: "kiran@clientra.com", role: "Admin" },
      { id: 2, name: "Sarah K.", email: "sarah@clientra.com", role: "Sales Rep" },
      { id: 3, name: "John D.", email: "john@clientra.com", role: "Sales Rep" },
      { id: 4, name: "Emily R.", email: "emily@clientra.com", role: "Sales Manager" }
    ]
  },

  users: [
    {
      id: 1,
      name: "Kiran",
      email: "kiran@clientra.com",
      password: "password123",
      role: "Admin",
      title: "Lead System Administrator",
      department: "Management & Tech",
      phone: "+1 (555) 234-5678",
      location: "San Francisco, CA",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      bio: "Clientra Administrator overseeing CRM configuration, user roles, deal workflows, and company analytics.",
      joinedDate: "2024-01-15",
      status: "Active"
    },
    {
      id: 2,
      name: "Sarah K.",
      email: "sarah@clientra.com",
      password: "password123",
      role: "Sales Rep",
      title: "Senior Account Executive",
      department: "Enterprise Sales",
      phone: "+1 (555) 345-6789",
      location: "New York, NY",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      bio: "Top performing sales specialist handling mid-market and enterprise prospects.",
      joinedDate: "2024-03-20",
      status: "Active"
    },
    {
      id: 3,
      name: "John D.",
      email: "john@clientra.com",
      password: "password123",
      role: "Sales Rep",
      title: "Sales Account Executive",
      department: "Inbound Growth",
      phone: "+1 (555) 456-7890",
      location: "Austin, TX",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      bio: "Customer-first sales representative managing incoming business opportunities.",
      joinedDate: "2024-05-10",
      status: "Active"
    },
    {
      id: 4,
      name: "Emily R.",
      email: "emily@clientra.com",
      password: "password123",
      role: "Sales Manager",
      title: "Director of Sales",
      department: "Leadership",
      phone: "+1 (555) 567-8901",
      location: "Chicago, IL",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      bio: "Directing the sales team and pipeline optimization across regional enterprise accounts.",
      joinedDate: "2023-11-01",
      status: "Active"
    }
  ]
};

// ── DASHBOARD ───────────────────────────────────────────────────────
app.get('/api/dashboard', (req, res) => {
  const totalLeads = data.leads.length;
  const dealsInPipeline = data.deals.filter(d => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost').length;
  const revenueForecast = data.deals.filter(d => d.stage !== 'Closed Lost').reduce((sum, d) => sum + d.amount * (d.probability / 100), 0);
  const closedTargets = data.deals.filter(d => d.stage === 'Closed Won').reduce((sum, d) => sum + d.amount, 0);

  const stageCounts = {};
  data.leads.forEach(l => { stageCounts[l.stage] = (stageCounts[l.stage] || 0) + 1; });

  const insights = [
    { text: `${data.leads.filter(l => l.stage === 'New Lead').length} leads with no follow-up`, info: "in 7 Days", status: "warning" },
    { text: `${data.deals.filter(d => d.stage === 'Negotiation').length} deals in negotiation`, info: "longer than 2 weeks", status: "danger" },
    { text: "Pipeline value grew 18%", info: "This month", status: "success" },
    { text: "Team meeting", info: "Sep 19 at 10:00 AM", status: "info" },
    { text: "Send proposal to Sarah", info: "Tomorrow", status: "info" }
  ];

  res.json({
    totalLeads,
    dealsInPipeline,
    revenueForecast,
    closedTargets,
    pipelineOverview: {
      newLeads: data.leads.filter(l => l.stage === 'New Lead').length,
      qualified: data.leads.filter(l => l.stage === 'Qualified').length,
      proposalSent: data.leads.filter(l => l.stage === 'Proposal Sent').length,
      closedDeals: data.deals.filter(d => d.stage === 'Closed Won').length
    },
    insights,
    recentLeads: data.leads.slice(-5).reverse().map(l => ({
      id: l.id, company: l.company, name: l.name, stage: l.stage, date: l.date, assignee: l.assignee
    }))
  });
});

// ── LEADS (full CRUD) ───────────────────────────────────────────────
app.get('/api/leads', (req, res) => {
  let result = [...data.leads];
  if (req.query.search) {
    const s = req.query.search.toLowerCase();
    result = result.filter(l => l.name.toLowerCase().includes(s) || l.company.toLowerCase().includes(s) || l.email.toLowerCase().includes(s));
  }
  if (req.query.stage) result = result.filter(l => l.stage === req.query.stage);
  if (req.query.source) result = result.filter(l => l.source === req.query.source);
  res.json(result);
});
app.get('/api/leads/:id', (req, res) => {
  const lead = data.leads.find(l => l.id === parseInt(req.params.id));
  lead ? res.json(lead) : res.status(404).json({ error: 'Lead not found' });
});
app.post('/api/leads', (req, res) => {
  const newLead = { id: nextId(data.leads), date: new Date().toISOString().split('T')[0], ...req.body };
  data.leads.push(newLead);
  res.status(201).json(newLead);
});
app.put('/api/leads/:id', (req, res) => {
  const idx = data.leads.findIndex(l => l.id === parseInt(req.params.id));
  if (idx !== -1) { data.leads[idx] = { ...data.leads[idx], ...req.body }; res.json(data.leads[idx]); }
  else res.status(404).json({ error: 'Lead not found' });
});
app.delete('/api/leads/:id', (req, res) => {
  data.leads = data.leads.filter(l => l.id !== parseInt(req.params.id));
  res.status(204).send();
});

// ── DEALS (full CRUD) ───────────────────────────────────────────────
app.get('/api/deals', (req, res) => {
  let result = [...data.deals];
  if (req.query.search) {
    const s = req.query.search.toLowerCase();
    result = result.filter(d => d.title.toLowerCase().includes(s) || d.company.toLowerCase().includes(s));
  }
  if (req.query.stage) result = result.filter(d => d.stage === req.query.stage);
  res.json(result);
});
app.get('/api/deals/:id', (req, res) => {
  const deal = data.deals.find(d => d.id === parseInt(req.params.id));
  deal ? res.json(deal) : res.status(404).json({ error: 'Deal not found' });
});
app.post('/api/deals', (req, res) => {
  const newDeal = { id: nextId(data.deals), ...req.body };
  data.deals.push(newDeal);
  res.status(201).json(newDeal);
});
app.put('/api/deals/:id', (req, res) => {
  const idx = data.deals.findIndex(d => d.id === parseInt(req.params.id));
  if (idx !== -1) { data.deals[idx] = { ...data.deals[idx], ...req.body }; res.json(data.deals[idx]); }
  else res.status(404).json({ error: 'Deal not found' });
});
app.delete('/api/deals/:id', (req, res) => {
  data.deals = data.deals.filter(d => d.id !== parseInt(req.params.id));
  res.status(204).send();
});

// ── CONTACTS (full CRUD) ────────────────────────────────────────────
app.get('/api/contacts', (req, res) => {
  let result = [...data.contacts];
  if (req.query.search) {
    const s = req.query.search.toLowerCase();
    result = result.filter(c => c.name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s) || c.company.toLowerCase().includes(s));
  }
  res.json(result);
});
app.get('/api/contacts/:id', (req, res) => {
  const c = data.contacts.find(c => c.id === parseInt(req.params.id));
  c ? res.json(c) : res.status(404).json({ error: 'Contact not found' });
});
app.post('/api/contacts', (req, res) => {
  const newContact = { id: nextId(data.contacts), lastContact: new Date().toISOString().split('T')[0], ...req.body };
  data.contacts.push(newContact);
  res.status(201).json(newContact);
});
app.put('/api/contacts/:id', (req, res) => {
  const idx = data.contacts.findIndex(c => c.id === parseInt(req.params.id));
  if (idx !== -1) { data.contacts[idx] = { ...data.contacts[idx], ...req.body }; res.json(data.contacts[idx]); }
  else res.status(404).json({ error: 'Contact not found' });
});
app.delete('/api/contacts/:id', (req, res) => {
  data.contacts = data.contacts.filter(c => c.id !== parseInt(req.params.id));
  res.status(204).send();
});

// ── ACCOUNTS (full CRUD) ────────────────────────────────────────────
app.get('/api/accounts', (req, res) => {
  let result = [...data.accounts];
  if (req.query.search) {
    const s = req.query.search.toLowerCase();
    result = result.filter(a => a.name.toLowerCase().includes(s) || a.industry.toLowerCase().includes(s));
  }
  if (req.query.status) result = result.filter(a => a.status === req.query.status);
  res.json(result);
});
app.get('/api/accounts/:id', (req, res) => {
  const a = data.accounts.find(a => a.id === parseInt(req.params.id));
  a ? res.json(a) : res.status(404).json({ error: 'Account not found' });
});
app.post('/api/accounts', (req, res) => {
  const newAccount = { id: nextId(data.accounts), createdAt: new Date().toISOString().split('T')[0], status: 'Active', ...req.body };
  data.accounts.push(newAccount);
  res.status(201).json(newAccount);
});
app.put('/api/accounts/:id', (req, res) => {
  const idx = data.accounts.findIndex(a => a.id === parseInt(req.params.id));
  if (idx !== -1) { data.accounts[idx] = { ...data.accounts[idx], ...req.body }; res.json(data.accounts[idx]); }
  else res.status(404).json({ error: 'Account not found' });
});
app.delete('/api/accounts/:id', (req, res) => {
  data.accounts = data.accounts.filter(a => a.id !== parseInt(req.params.id));
  res.status(204).send();
});

// ── TASKS (full CRUD) ───────────────────────────────────────────────
app.get('/api/tasks', (req, res) => {
  let result = [...data.tasks];
  if (req.query.search) {
    const s = req.query.search.toLowerCase();
    result = result.filter(t => t.title.toLowerCase().includes(s) || t.description.toLowerCase().includes(s));
  }
  if (req.query.status) result = result.filter(t => t.status === req.query.status);
  if (req.query.priority) result = result.filter(t => t.priority === req.query.priority);
  res.json(result);
});
app.get('/api/tasks/:id', (req, res) => {
  const t = data.tasks.find(t => t.id === parseInt(req.params.id));
  t ? res.json(t) : res.status(404).json({ error: 'Task not found' });
});
app.post('/api/tasks', (req, res) => {
  const newTask = { id: nextId(data.tasks), status: 'Pending', ...req.body };
  data.tasks.push(newTask);
  res.status(201).json(newTask);
});
app.put('/api/tasks/:id', (req, res) => {
  const idx = data.tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (idx !== -1) { data.tasks[idx] = { ...data.tasks[idx], ...req.body }; res.json(data.tasks[idx]); }
  else res.status(404).json({ error: 'Task not found' });
});
app.delete('/api/tasks/:id', (req, res) => {
  data.tasks = data.tasks.filter(t => t.id !== parseInt(req.params.id));
  res.status(204).send();
});

// ── REPORTS ─────────────────────────────────────────────────────────
app.get('/api/reports', (req, res) => {
  const dealsByStage = {};
  data.deals.forEach(d => { dealsByStage[d.stage] = (dealsByStage[d.stage] || 0) + 1; });

  const revenueByStage = {};
  data.deals.forEach(d => { revenueByStage[d.stage] = (revenueByStage[d.stage] || 0) + d.amount; });

  const leadsBySource = {};
  data.leads.forEach(l => { leadsBySource[l.source] = (leadsBySource[l.source] || 0) + 1; });

  const leadsByStage = {};
  data.leads.forEach(l => { leadsByStage[l.stage] = (leadsByStage[l.stage] || 0) + 1; });

  const tasksByStatus = {};
  data.tasks.forEach(t => { tasksByStatus[t.status] = (tasksByStatus[t.status] || 0) + 1; });

  const tasksByPriority = {};
  data.tasks.forEach(t => { tasksByPriority[t.priority] = (tasksByPriority[t.priority] || 0) + 1; });

  const topDeals = [...data.deals].sort((a, b) => b.amount - a.amount).slice(0, 5);

  const performanceByRep = {};
  data.deals.filter(d => d.stage === 'Closed Won').forEach(d => {
    const lead = data.leads.find(l => l.company === d.company);
    const rep = lead ? lead.assignee : 'Unknown';
    performanceByRep[rep] = (performanceByRep[rep] || 0) + d.amount;
  });

  res.json({
    summary: {
      totalLeads: data.leads.length,
      totalDeals: data.deals.length,
      totalContacts: data.contacts.length,
      totalAccounts: data.accounts.length,
      totalRevenue: data.deals.filter(d => d.stage === 'Closed Won').reduce((s, d) => s + d.amount, 0),
      pipelineValue: data.deals.filter(d => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost').reduce((s, d) => s + d.amount, 0),
      avgDealSize: Math.round(data.deals.reduce((s, d) => s + d.amount, 0) / data.deals.length),
      winRate: Math.round((data.deals.filter(d => d.stage === 'Closed Won').length / data.deals.length) * 100)
    },
    dealsByStage,
    revenueByStage,
    leadsBySource,
    leadsByStage,
    tasksByStatus,
    tasksByPriority,
    topDeals,
    performanceByRep
  });
});

// ── SETTINGS ────────────────────────────────────────────────────────
app.get('/api/settings', (req, res) => {
  res.json({
    ...data.settings,
    companyProfile: {
      companyName: data.settings.companyName || "Clientra",
      email: data.settings.email || "admin@clientra.com",
      timezone: data.settings.timezone || "America/New_York",
      currency: data.settings.currency || "USD",
      language: data.settings.language || "en"
    },
    notifications: data.settings.notifications || {
      email: true,
      push: true,
      sms: false,
      weeklyReport: true,
      dealAlerts: true
    },
    teamMembers: data.settings.teamMembers || []
  });
});

app.put('/api/settings', (req, res) => {
  if (req.body.companyProfile) {
    data.settings.companyName = req.body.companyProfile.companyName || data.settings.companyName;
    data.settings.email = req.body.companyProfile.email || data.settings.email;
    data.settings.timezone = req.body.companyProfile.timezone || data.settings.timezone;
    data.settings.currency = req.body.companyProfile.currency || data.settings.currency;
    data.settings.language = req.body.companyProfile.language || data.settings.language;
  }
  if (req.body.notifications) {
    data.settings.notifications = { ...data.settings.notifications, ...req.body.notifications };
  }
  if (req.body.teamMembers) {
    data.settings.teamMembers = req.body.teamMembers;
  }
  Object.assign(data.settings, req.body);
  res.json({
    ...data.settings,
    companyProfile: {
      companyName: data.settings.companyName,
      email: data.settings.email,
      timezone: data.settings.timezone,
      currency: data.settings.currency,
      language: data.settings.language
    },
    notifications: data.settings.notifications,
    teamMembers: data.settings.teamMembers
  });
});

app.post('/api/settings/team', (req, res) => {
  const newMember = { id: nextId(data.settings.teamMembers), ...req.body };
  data.settings.teamMembers.push(newMember);
  res.status(201).json(newMember);
});

app.delete('/api/settings/team/:id', (req, res) => {
  data.settings.teamMembers = data.settings.teamMembers.filter(m => m.id !== parseInt(req.params.id));
  res.status(204).send();
});

// ── AUTH & USERS ────────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  const user = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  if (password && user.password && user.password !== password) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const token = `token_${user.id}_${Date.now()}`;
  const { password: _, ...userWithoutPass } = user;
  res.json({ token, user: userWithoutPass });
});

app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, role = "Sales Rep", department = "Sales", phone = "", location = "" } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }
  const existing = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "An account with this email already exists" });
  }
  const newUser = {
    id: nextId(data.users),
    name,
    email,
    password,
    role,
    title: role === "Admin" ? "System Administrator" : role === "Sales Manager" ? "Sales Manager" : "Sales Representative",
    department,
    phone: phone || "+1 (555) 000-0000",
    location: location || "San Francisco, CA",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    bio: `Sales & CRM professional at Clientra.`,
    joinedDate: new Date().toISOString().split('T')[0],
    status: "Active"
  };
  data.users.push(newUser);
  if (!data.settings.teamMembers.some(m => m.email.toLowerCase() === email.toLowerCase())) {
    data.settings.teamMembers.push({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role });
  }
  const token = `token_${newUser.id}_${Date.now()}`;
  const { password: _, ...userWithoutPass } = newUser;
  res.status(201).json({ token, user: userWithoutPass });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  let userId = 1;
  if (authHeader && authHeader.startsWith('Bearer token_')) {
    const parts = authHeader.replace('Bearer token_', '').split('_');
    userId = parseInt(parts[0]) || 1;
  }
  const user = data.users.find(u => u.id === userId) || data.users[0];
  const { password: _, ...userWithoutPass } = user;
  res.json(userWithoutPass);
});

app.put('/api/auth/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  let userId = req.body.id || 1;
  if (authHeader && authHeader.startsWith('Bearer token_')) {
    const parts = authHeader.replace('Bearer token_', '').split('_');
    userId = parseInt(parts[0]) || userId;
  }
  const userIdx = data.users.findIndex(u => u.id === userId);
  if (userIdx === -1) return res.status(404).json({ error: "User not found" });

  if (req.body.newPassword) {
    if (req.body.currentPassword && data.users[userIdx].password && data.users[userIdx].password !== req.body.currentPassword) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }
    data.users[userIdx].password = req.body.newPassword;
  }

  const { currentPassword, newPassword, ...updates } = req.body;
  data.users[userIdx] = { ...data.users[userIdx], ...updates };

  const teamIdx = data.settings.teamMembers.findIndex(m => m.id === userId || m.email === data.users[userIdx].email);
  if (teamIdx !== -1) {
    if (updates.name) data.settings.teamMembers[teamIdx].name = updates.name;
    if (updates.role) data.settings.teamMembers[teamIdx].role = updates.role;
  }

  const { password: _, ...userWithoutPass } = data.users[userIdx];
  res.json(userWithoutPass);
});

app.get('/api/users', (req, res) => {
  const safeUsers = data.users.map(({ password, ...u }) => u);
  res.json(safeUsers);
});

// ── SEARCH (global) ─────────────────────────────────────────────────
app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  if (!q) return res.json({ leads: [], deals: [], contacts: [], accounts: [] });

  res.json({
    leads: data.leads.filter(l => l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q)).slice(0, 5),
    deals: data.deals.filter(d => d.title.toLowerCase().includes(q) || d.company.toLowerCase().includes(q)).slice(0, 5),
    contacts: data.contacts.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)).slice(0, 5),
    accounts: data.accounts.filter(a => a.name.toLowerCase().includes(q)).slice(0, 5)
  });
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
