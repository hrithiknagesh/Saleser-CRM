import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Download,
  Filter,
  X,
  ChevronDown,
  User,
  Building2,
  Mail,
  Phone,
} from 'lucide-react';
import { fetchLeads, INITIAL_DATA } from './api';

interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  phone?: string;
  stage: string;
  source: string;
  date?: string;
  assignee?: string;
  created_at?: string;
}

type FormData = Omit<Lead, 'id' | 'date' | 'created_at'>;

const STAGES = ['New Lead', 'Qualified', 'Proposal Sent'] as const;
const SOURCES = ['Website', 'Referral', 'Cold Call', 'Event', 'LinkedIn'] as const;

const API_URL = 'http://localhost:3000/api/leads';

const stageBadge: Record<string, string> = {
  'New Lead': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  Qualified: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  'Proposal Sent': 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
};

const emptyForm: FormData = {
  name: '',
  company: '',
  email: '',
  phone: '',
  stage: 'New Lead',
  source: 'Website',
  assignee: '',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>({ ...emptyForm });

  /* ─── Fetch ─── */
  const fetchLeadsData = useCallback(async () => {
    try {
      const data = await fetchLeads();
      setLeads(Array.isArray(data) ? data : (data as any)?.leads ?? INITIAL_DATA.leads);
    } catch (err) {
      console.error('Failed to fetch leads', err);
      setLeads(INITIAL_DATA.leads);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeadsData();
  }, [fetchLeadsData]);

  /* ─── Filter ─── */
  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      l.name.toLowerCase().includes(q) ||
      l.company.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      (l.assignee ?? '').toLowerCase().includes(q);
    const matchesStage = !stageFilter || l.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  /* ─── CRUD helpers ─── */
  const openNew = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setFormOpen(true);
  };

  const openEdit = (lead: Lead) => {
    setEditingId(lead.id);
    setForm({
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone ?? '',
      stage: lead.stage,
      source: lead.source,
      assignee: lead.assignee ?? '',
    });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  };

  const handleSubmit = async () => {
    try {
      if (editingId !== null) {
        await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      closeForm();
      fetchLeads();
    } catch (err) {
      console.error('Save failed', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this lead? This action cannot be undone.')) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchLeads();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  /* ─── CSV Export ─── */
  const exportCSV = () => {
    const headers = ['Name', 'Company', 'Email', 'Phone', 'Stage', 'Source', 'Assignee', 'Date'];
    const rows = filtered.map((l) => [
      l.name,
      l.company,
      l.email,
      l.phone ?? '',
      l.stage,
      l.source,
      l.assignee ?? '',
      l.date ?? l.created_at ?? '',
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ─── Render helpers ─── */
  const fmtDate = (d?: string) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const inputCls =
    'w-full rounded-lg bg-[#171717] border border-[#333] px-3 py-2 text-gray-200 text-sm placeholder-gray-500 focus:outline-none focus:border-[#f95e26] transition-colors';

  /* ───────────────────────── JSX ───────────────────────── */
  return (
    <div className="min-h-screen bg-[#171717] p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Leads</h1>
          <p className="text-gray-500 text-sm mt-1">
            {filtered.length} lead{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#333] text-gray-300 hover:bg-[#2a2a2a] transition-colors text-sm"
          >
            <Download size={16} />
            Export
          </button>
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f95e26] hover:bg-[#e04f1c] text-white font-medium transition-colors text-sm"
          >
            <Plus size={16} />
            New Lead
          </button>
        </div>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by name, company, email or assignee…"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#1f1f1f] border border-[#333] text-gray-200 text-sm placeholder-gray-500 focus:outline-none focus:border-[#f95e26] transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Stage filter dropdown */}
        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-colors ${
              stageFilter
                ? 'border-[#f95e26] text-[#f95e26] bg-[#f95e26]/10'
                : 'border-[#333] text-gray-300 bg-[#1f1f1f] hover:bg-[#2a2a2a]'
            }`}
          >
            <Filter size={16} />
            {stageFilter || 'Stage'}
            <ChevronDown size={14} />
          </button>
          {filterOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg bg-[#1f1f1f] border border-[#333] shadow-xl z-20 py-1">
              <button
                onClick={() => {
                  setStageFilter('');
                  setFilterOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-[#2a2a2a] transition-colors ${
                  !stageFilter ? 'text-[#f95e26]' : 'text-gray-300'
                }`}
              >
                All Stages
              </button>
              {STAGES.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStageFilter(s);
                    setFilterOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-[#2a2a2a] transition-colors ${
                    stageFilter === s ? 'text-[#f95e26]' : 'text-gray-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Inline form */}
      {formOpen && (
        <div className="bg-[#1f1f1f] border border-[#333] rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-100">
              {editingId !== null ? 'Edit Lead' : 'New Lead'}
            </h2>
            <button onClick={closeForm} className="text-gray-500 hover:text-gray-300 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Name */}
            <div>
              <label className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5 uppercase tracking-wider">
                <User size={12} /> Name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full name"
                className={inputCls}
              />
            </div>
            {/* Company */}
            <div>
              <label className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5 uppercase tracking-wider">
                <Building2 size={12} /> Company
              </label>
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Company name"
                className={inputCls}
              />
            </div>
            {/* Email */}
            <div>
              <label className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5 uppercase tracking-wider">
                <Mail size={12} /> Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@example.com"
                className={inputCls}
              />
            </div>
            {/* Phone */}
            <div>
              <label className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5 uppercase tracking-wider">
                <Phone size={12} /> Phone
              </label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 555-0123"
                className={inputCls}
              />
            </div>
            {/* Stage */}
            <div>
              <label className="text-xs text-gray-400 mb-1.5 uppercase tracking-wider block">
                Stage
              </label>
              <select
                value={form.stage}
                onChange={(e) => setForm({ ...form, stage: e.target.value })}
                className={inputCls + ' appearance-none cursor-pointer'}
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            {/* Source */}
            <div>
              <label className="text-xs text-gray-400 mb-1.5 uppercase tracking-wider block">
                Source
              </label>
              <select
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className={inputCls + ' appearance-none cursor-pointer'}
              >
                {SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            {/* Assignee */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="text-xs text-gray-400 mb-1.5 uppercase tracking-wider block">
                Assignee
              </label>
              <input
                value={form.assignee}
                onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                placeholder="Assigned to"
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={closeForm}
              className="px-4 py-2 rounded-lg border border-[#333] text-gray-400 hover:text-gray-200 hover:bg-[#2a2a2a] transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!form.name || !form.email}
              className="px-5 py-2 rounded-lg bg-[#f95e26] hover:bg-[#e04f1c] disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition-colors text-sm"
            >
              {editingId !== null ? 'Update Lead' : 'Add Lead'}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#1f1f1f] border border-[#333] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#333] text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3.5 font-medium">Name</th>
                <th className="text-left px-5 py-3.5 font-medium">Company</th>
                <th className="text-left px-5 py-3.5 font-medium">Email</th>
                <th className="text-left px-5 py-3.5 font-medium">Stage</th>
                <th className="text-left px-5 py-3.5 font-medium">Source</th>
                <th className="text-left px-5 py-3.5 font-medium">Date</th>
                <th className="text-left px-5 py-3.5 font-medium">Assignee</th>
                <th className="text-right px-5 py-3.5 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-gray-500">
                    Loading leads…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-gray-500">
                    {search || stageFilter
                      ? 'No leads match your filters.'
                      : 'No leads yet. Click "New Lead" to add one.'}
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-[#333]/60 hover:bg-[#2a2a2a]/40 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-gray-200 font-medium whitespace-nowrap">
                      {lead.name}
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 whitespace-nowrap">{lead.company}</td>
                    <td className="px-5 py-3.5 text-gray-400 whitespace-nowrap">{lead.email}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          stageBadge[lead.stage] ?? 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {lead.stage}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 whitespace-nowrap">{lead.source}</td>
                    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                      {fmtDate(lead.date ?? lead.created_at)}
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 whitespace-nowrap">
                      {lead.assignee || '—'}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(lead)}
                          className="p-1.5 rounded-md text-gray-500 hover:text-[#f95e26] hover:bg-[#f95e26]/10 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
