import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Building2,
  Filter,
  ChevronDown,
} from "lucide-react";

interface Account {
  id: number;
  name: string;
  industry: string;
  website: string;
  phone: string;
  employees: number;
  revenue: number;
  owner: string;
  status: "Active" | "Inactive";
}

type AccountFormData = Omit<Account, "id">;

const emptyForm: AccountFormData = {
  name: "",
  industry: "",
  website: "",
  phone: "",
  employees: 0,
  revenue: 0,
  owner: "",
  status: "Active",
};

const API_URL = "http://localhost:3000/api/accounts";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<AccountFormData>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setAccounts(data);
    } catch (err) {
      console.error("Failed to fetch accounts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const filtered = accounts.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.industry.toLowerCase().includes(search.toLowerCase()) ||
      a.owner.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openAdd = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const openEdit = (account: Account) => {
    setEditingId(account.id);
    setFormData({
      name: account.name,
      industry: account.industry,
      website: account.website,
      phone: account.phone,
      employees: account.employees,
      revenue: account.revenue,
      owner: account.owner,
      status: account.status,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;
    try {
      if (editingId !== null) {
        await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      closeForm();
      fetchAccounts();
    } catch (err) {
      console.error("Failed to save account:", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setDeleteId(null);
      fetchAccounts();
    } catch (err) {
      console.error("Failed to delete account:", err);
    }
  };

  const formatRevenue = (val: number) =>
    val >= 1_000_000
      ? `$${(val / 1_000_000).toFixed(1)}M`
      : val >= 1_000
        ? `$${(val / 1_000).toFixed(0)}K`
        : `$${val}`;

  const inputClass =
    "w-full rounded-md border border-[#333] bg-[#171717] px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-[#f95e26] focus:outline-none focus:ring-1 focus:ring-[#f95e26]";

  return (
    <div className="min-h-screen bg-[#171717] p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6 text-[#f95e26]" />
          <h1 className="text-2xl font-semibold text-gray-200">Accounts</h1>
          <span className="rounded-full bg-[#1f1f1f] px-3 py-0.5 text-sm text-gray-400">
            {filtered.length}
          </span>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-md bg-[#f95e26] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#e04d1a]"
        >
          <Plus className="h-4 w-4" />
          New Account
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search accounts by name, industry, or owner…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-[#333] bg-[#1f1f1f] py-2 pl-10 pr-4 text-sm text-gray-200 placeholder-gray-500 focus:border-[#f95e26] focus:outline-none focus:ring-1 focus:ring-[#f95e26]"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm transition ${
              statusFilter !== "All"
                ? "border-[#f95e26] bg-[#f95e26]/10 text-[#f95e26]"
                : "border-[#333] bg-[#1f1f1f] text-gray-400 hover:text-gray-200"
            }`}
          >
            <Filter className="h-4 w-4" />
            {statusFilter}
            <ChevronDown className="h-3 w-3" />
          </button>
          {showFilterMenu && (
            <div className="absolute right-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-md border border-[#333] bg-[#1f1f1f] shadow-lg">
              {(["All", "Active", "Inactive"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setStatusFilter(opt);
                    setShowFilterMenu(false);
                  }}
                  className={`flex w-full items-center px-4 py-2 text-sm transition hover:bg-[#2a2a2a] ${
                    statusFilter === opt ? "text-[#f95e26]" : "text-gray-300"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Inline Form */}
      {showForm && (
        <div className="mb-4 rounded-lg border border-[#333] bg-[#1f1f1f] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-200">
              {editingId !== null ? "Edit Account" : "New Account"}
            </h2>
            <button onClick={closeForm} className="text-gray-500 hover:text-gray-300">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-400">Name *</label>
              <input
                className={inputClass}
                placeholder="Account name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-400">Industry</label>
              <input
                className={inputClass}
                placeholder="e.g. Technology"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-400">Website</label>
              <input
                className={inputClass}
                placeholder="https://example.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-400">Phone</label>
              <input
                className={inputClass}
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-400">Employees</label>
              <input
                type="number"
                className={inputClass}
                placeholder="0"
                value={formData.employees || ""}
                onChange={(e) =>
                  setFormData({ ...formData, employees: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-400">Revenue</label>
              <input
                type="number"
                className={inputClass}
                placeholder="0"
                value={formData.revenue || ""}
                onChange={(e) =>
                  setFormData({ ...formData, revenue: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-400">Owner</label>
              <input
                className={inputClass}
                placeholder="Account owner"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-400">Status</label>
              <select
                className={inputClass}
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={closeForm}
              className="rounded-md border border-[#333] px-4 py-2 text-sm text-gray-400 transition hover:bg-[#2a2a2a] hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 rounded-md bg-[#f95e26] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#e04d1a]"
            >
              <Check className="h-4 w-4" />
              {editingId !== null ? "Update" : "Create"}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-[#333] bg-[#1f1f1f]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#333] bg-[#242424]">
                <th className="px-4 py-3 font-medium text-gray-400">Name</th>
                <th className="px-4 py-3 font-medium text-gray-400">Industry</th>
                <th className="px-4 py-3 font-medium text-gray-400">Employees</th>
                <th className="px-4 py-3 font-medium text-gray-400">Revenue</th>
                <th className="px-4 py-3 font-medium text-gray-400">Owner</th>
                <th className="px-4 py-3 font-medium text-gray-400">Status</th>
                <th className="px-4 py-3 font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    Loading accounts…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    {search || statusFilter !== "All"
                      ? "No accounts match your filters."
                      : "No accounts yet. Click 'New Account' to create one."}
                  </td>
                </tr>
              ) : (
                filtered.map((account) => (
                  <tr
                    key={account.id}
                    className="border-b border-[#333] transition last:border-0 hover:bg-[#242424]"
                  >
                    <td className="px-4 py-3 font-medium text-gray-200">{account.name}</td>
                    <td className="px-4 py-3 text-gray-400">{account.industry}</td>
                    <td className="px-4 py-3 text-gray-400">
                      {account.employees?.toLocaleString() ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {account.revenue ? formatRevenue(account.revenue) : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-400">{account.owner || "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          account.status === "Active"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {account.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {deleteId === account.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">Delete?</span>
                          <button
                            onClick={() => handleDelete(account.id)}
                            className="rounded p-1 text-red-400 transition hover:bg-red-400/10"
                            title="Confirm delete"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(null)}
                            className="rounded p-1 text-gray-500 transition hover:bg-[#333]"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEdit(account)}
                            className="rounded p-1.5 text-gray-500 transition hover:bg-[#333] hover:text-gray-200"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(account.id)}
                            className="rounded p-1.5 text-gray-500 transition hover:bg-red-400/10 hover:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
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
