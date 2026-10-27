import { useState, useEffect, useCallback } from "react";
import {
  Mail,
  Phone,
  Building2,
  User,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
} from "lucide-react";

const API_BASE = "http://localhost:3000/api/contacts";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  notes: string;
  lastContactDate?: string;
  created_at?: string;
  updated_at?: string;
}

type ContactFormData = Omit<Contact, "id" | "created_at" | "updated_at" | "lastContactDate">;

const emptyForm: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  position: "",
  notes: "",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    "#f95e26",
    "#e04e1a",
    "#d4763a",
    "#c0572e",
    "#a84520",
    "#b85c35",
    "#cf6930",
    "#e87740",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/*  Inline Form                                                       */
/* ------------------------------------------------------------------ */
function ContactForm({
  initial,
  onSubmit,
  onCancel,
  isEditing,
}: {
  initial: ContactFormData;
  onSubmit: (data: ContactFormData) => void;
  onCancel: () => void;
  isEditing: boolean;
}) {
  const [form, setForm] = useState<ContactFormData>(initial);

  const set = (field: keyof ContactFormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    onSubmit(form);
  };

  const inputClass =
    "w-full bg-[#171717] border border-[#333] rounded-lg px-3 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#f95e26] transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1f1f1f] border border-[#333] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative"
      >
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-200 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-gray-200 mb-6">
          {isEditing ? "Edit Contact" : "New Contact"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm text-gray-400 mb-1">Name *</label>
            <input
              className={inputClass}
              placeholder="Full name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Email *</label>
            <input
              className={inputClass}
              type="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Phone</label>
            <input
              className={inputClass}
              placeholder="+1 (555) 000-0000"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Company</label>
            <input
              className={inputClass}
              placeholder="Company name"
              value={form.company}
              onChange={(e) => set("company", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Position</label>
            <input
              className={inputClass}
              placeholder="Job title"
              value={form.position}
              onChange={(e) => set("position", e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm text-gray-400 mb-1">Notes</label>
            <textarea
              className={`${inputClass} resize-none h-24`}
              placeholder="Additional notes…"
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-[#333] text-gray-400 hover:text-gray-200 hover:border-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-[#f95e26] text-white font-medium hover:bg-[#e04e1a] transition-colors"
          >
            {isEditing ? "Save Changes" : "Add Contact"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Expanded Detail Panel                                              */
/* ------------------------------------------------------------------ */
function ContactDetail({
  contact,
  onClose,
  onEdit,
  onDelete,
}: {
  contact: Contact;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1f1f1f] border border-[#333] rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-200 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0"
            style={{ backgroundColor: getAvatarColor(contact.name) }}
          >
            {getInitials(contact.name)}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-200">
              {contact.name}
            </h2>
            {contact.position && (
              <p className="text-sm text-gray-400">{contact.position}</p>
            )}
          </div>
        </div>

        {/* Info rows */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-gray-300">
            <Mail size={16} className="text-gray-500 shrink-0" />
            <span className="truncate">{contact.email}</span>
          </div>
          {contact.phone && (
            <div className="flex items-center gap-3 text-gray-300">
              <Phone size={16} className="text-gray-500 shrink-0" />
              <span>{contact.phone}</span>
            </div>
          )}
          {contact.company && (
            <div className="flex items-center gap-3 text-gray-300">
              <Building2 size={16} className="text-gray-500 shrink-0" />
              <span>{contact.company}</span>
            </div>
          )}
        </div>

        {/* Notes */}
        {contact.notes && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Notes</h3>
            <p className="text-gray-300 text-sm leading-relaxed bg-[#171717] rounded-lg p-3 border border-[#333]">
              {contact.notes}
            </p>
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-6 text-xs text-gray-500 mb-6">
          <span>
            Last contact:{" "}
            {formatDate(contact.lastContactDate || contact.updated_at)}
          </span>
          <span>Created: {formatDate(contact.created_at)}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#333] text-gray-300 hover:text-[#f95e26] hover:border-[#f95e26] transition-colors"
          >
            <Pencil size={15} /> Edit
          </button>
          <button
            onClick={onDelete}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#333] text-gray-300 hover:text-red-400 hover:border-red-400 transition-colors"
          >
            <Trash2 size={15} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Contact Card                                                       */
/* ------------------------------------------------------------------ */
function ContactCard({
  contact,
  onEdit,
  onDelete,
  onClick,
}: {
  contact: Contact;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-[#1f1f1f] border border-[#333] rounded-xl p-5 hover:border-[#f95e26]/40 transition-all cursor-pointer group"
    >
      {/* Top row: avatar + actions */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ backgroundColor: getAvatarColor(contact.name) }}
          >
            {getInitials(contact.name)}
          </div>
          <div className="min-w-0">
            <h3 className="text-gray-200 font-medium truncate">
              {contact.name}
            </h3>
            {contact.position && (
              <p className="text-xs text-gray-500 truncate">
                {contact.position}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons – visible on hover */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1.5 rounded-md hover:bg-[#333] text-gray-500 hover:text-[#f95e26] transition-colors"
            title="Edit"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 rounded-md hover:bg-[#333] text-gray-500 hover:text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-400 truncate">
          <Mail size={14} className="text-gray-500 shrink-0" />
          <span className="truncate">{contact.email}</span>
        </div>
        {contact.phone && (
          <div className="flex items-center gap-2 text-gray-400">
            <Phone size={14} className="text-gray-500 shrink-0" />
            <span>{contact.phone}</span>
          </div>
        )}
        {contact.company && (
          <div className="flex items-center gap-2 text-gray-400 truncate">
            <Building2 size={14} className="text-gray-500 shrink-0" />
            <span className="truncate">{contact.company}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Delete Confirmation Dialog                                         */
/* ------------------------------------------------------------------ */
function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1f1f1f] border border-[#333] rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <p className="text-gray-200 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-[#333] text-gray-400 hover:text-gray-200 hover:border-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */
export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal / form state
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);

  /* ---------- Fetch ---------- */
  const fetchContacts = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error("Failed to fetch contacts");
      const data = await res.json();
      setContacts(Array.isArray(data) ? data : data.data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  /* ---------- CRUD ---------- */
  const handleCreate = async (data: ContactFormData) => {
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create contact");
      setShowForm(false);
      fetchContacts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const handleUpdate = async (data: ContactFormData) => {
    if (!editingContact) return;
    try {
      const res = await fetch(`${API_BASE}/${editingContact.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update contact");
      setEditingContact(null);
      setSelectedContact(null);
      fetchContacts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const handleDelete = async () => {
    if (!deletingContact) return;
    try {
      const res = await fetch(`${API_BASE}/${deletingContact.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete contact");
      setDeletingContact(null);
      setSelectedContact(null);
      fetchContacts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  /* ---------- Filter ---------- */
  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.company ?? "").toLowerCase().includes(q) ||
      (c.position ?? "").toLowerCase().includes(q) ||
      (c.phone ?? "").toLowerCase().includes(q)
    );
  });

  /* ---------- Render ---------- */
  return (
    <div className="min-h-screen bg-[#171717] p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-200 flex items-center gap-2">
            <User size={24} className="text-[#f95e26]" />
            Contacts
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {contacts.length} total contact{contacts.length !== 1 && "s"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search contacts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#1f1f1f] border border-[#333] rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#f95e26] transition-colors w-64"
            />
          </div>

          {/* New Contact */}
          <button
            onClick={() => {
              setEditingContact(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#f95e26] text-white text-sm font-medium rounded-lg hover:bg-[#e04e1a] transition-colors shrink-0"
          >
            <Plus size={16} />
            New Contact
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-200"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#333] border-t-[#f95e26] rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <User size={48} className="mb-4 opacity-40" />
          <p className="text-lg">
            {search ? "No contacts match your search" : "No contacts yet"}
          </p>
          {!search && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-[#f95e26] hover:underline text-sm"
            >
              Add your first contact
            </button>
          )}
        </div>
      )}

      {/* Card Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onClick={() => setSelectedContact(contact)}
              onEdit={() => {
                setEditingContact(contact);
                setShowForm(true);
              }}
              onDelete={() => setDeletingContact(contact)}
            />
          ))}
        </div>
      )}

      {/* ---------- Modals ---------- */}

      {/* Create / Edit Form */}
      {showForm && (
        <ContactForm
          isEditing={!!editingContact}
          initial={
            editingContact
              ? {
                  name: editingContact.name,
                  email: editingContact.email,
                  phone: editingContact.phone,
                  company: editingContact.company,
                  position: editingContact.position,
                  notes: editingContact.notes,
                }
              : emptyForm
          }
          onSubmit={editingContact ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditingContact(null);
          }}
        />
      )}

      {/* Detail Panel */}
      {selectedContact && !showForm && (
        <ContactDetail
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onEdit={() => {
            setEditingContact(selectedContact);
            setShowForm(true);
          }}
          onDelete={() => setDeletingContact(selectedContact)}
        />
      )}

      {/* Delete Confirmation */}
      {deletingContact && (
        <ConfirmDialog
          message={`Are you sure you want to delete "${deletingContact.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingContact(null)}
        />
      )}
    </div>
  );
}
