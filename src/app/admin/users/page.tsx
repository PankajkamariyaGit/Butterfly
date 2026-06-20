"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  Eye, EyeOff, X, Check, AlertTriangle, User, Mail, Lock,
} from "lucide-react";
import { useAuthStore, useStaffStore, ROLE_PERMISSIONS, StaffRole, StaffUser } from "@/store";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const ROLE_META: Record<StaffRole, { label: string; color: string; bg: string; desc: string }> = {
  admin: { label: "Admin", color: "text-champagne", bg: "bg-champagne/15", desc: "Full access to all sections" },
  manager: { label: "Manager", color: "text-blue-400", bg: "bg-blue-400/15", desc: "Orders, customers, returns, payments, reports, reviews" },
  staff: { label: "Staff", color: "text-green-400", bg: "bg-green-400/15", desc: "Orders management only" },
};

const PERMISSION_SECTIONS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "orders", label: "Orders" },
  { key: "customers", label: "Customers" },
  { key: "products", label: "Products" },
  { key: "categories", label: "Categories" },
  { key: "inventory", label: "Inventory" },
  { key: "returns", label: "Returns & Refunds" },
  { key: "payments", label: "Payments" },
  { key: "coupons", label: "Coupons" },
  { key: "reviews", label: "Reviews" },
  { key: "newsletter", label: "Newsletter" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "reports", label: "Reports" },
  { key: "homepage", label: "Homepage" },
  { key: "settings", label: "Settings" },
];

type FormState = {
  name: string;
  email: string;
  password: string;
  role: StaffRole;
  permissions: string[];
};

const defaultForm = (role: StaffRole = "staff"): FormState => ({
  name: "",
  email: "",
  password: "",
  role,
  permissions: [...(ROLE_PERMISSIONS[role] ?? [])],
});

export default function AdminUsersPage() {
  const { user: currentUser } = useAuthStore();
  const { staff, addStaff, updateStaff, removeStaff } = useStaffStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm());
  const [showPw, setShowPw] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Only admin can access this page
  if (currentUser?.role !== "admin") {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Shield size={48} className="text-champagne/30 mb-4" />
        <p className="font-display text-2xl text-ivory/60 mb-2">Access Denied</p>
        <p className="text-sm font-body text-ivory/30">Only administrators can manage users.</p>
      </div>
    );
  }

  const handleRoleChange = (role: StaffRole) => {
    const defaultPerms = role === "admin" ? ["*"] : [...(ROLE_PERMISSIONS[role] ?? [])];
    setForm((f) => ({ ...f, role, permissions: defaultPerms }));
  };

  const togglePermission = (section: string) => {
    if (form.role === "admin") return; // admin always has all
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(section)
        ? f.permissions.filter((p) => p !== section)
        : [...f.permissions, section],
    }));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(defaultForm());
    setShowPw(false);
    setShowForm(true);
  };

  const openEdit = (s: StaffUser) => {
    setEditingId(s.id);
    setForm({ name: s.name, email: s.email, password: s.password, role: s.role, permissions: [...s.permissions] });
    setShowPw(false);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error("All fields are required");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    // Check duplicate email
    const existing = staff.find((s) => s.email.toLowerCase() === form.email.toLowerCase() && s.id !== editingId);
    if (existing) {
      toast.error("Email already in use by another staff member");
      return;
    }

    if (editingId) {
      updateStaff(editingId, { name: form.name, email: form.email, password: form.password, role: form.role, permissions: form.permissions });
      toast.success("Staff member updated");
    } else {
      addStaff({ name: form.name, email: form.email, password: form.password, role: form.role, permissions: form.permissions, active: true, createdBy: currentUser?.id ?? "admin1" });
      toast.success("Staff member created");
    }
    setShowForm(false);
  };

  const handleToggleActive = (s: StaffUser) => {
    updateStaff(s.id, { active: !s.active });
    toast.success(s.active ? `${s.name} deactivated` : `${s.name} activated`);
  };

  const handleDelete = (id: string) => {
    removeStaff(id);
    setDeleteConfirm(null);
    toast.success("Staff member removed");
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-ivory">Manage Users</h1>
          <p className="text-sm font-body text-ivory/40 mt-1">
            Create staff accounts and control their access permissions
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-champagne to-champagne-dark text-obsidian text-sm font-body font-semibold px-5 py-2.5 rounded-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Add Staff Member
        </button>
      </div>

      {/* Role overview cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {(Object.keys(ROLE_META) as StaffRole[]).map((role) => {
          const meta = ROLE_META[role];
          const count = role === "admin" ? staff.filter((s) => s.role === "admin").length + 1 : staff.filter((s) => s.role === role).length;
          return (
            <div key={role} className={cn("rounded-sm border border-white/10 p-4", meta.bg)}>
              <div className="flex items-center gap-2 mb-2">
                <Shield size={14} className={meta.color} />
                <span className={cn("text-xs font-body font-semibold tracking-widest uppercase", meta.color)}>{meta.label}</span>
                <span className={cn("ml-auto text-lg font-display", meta.color)}>{count}</span>
              </div>
              <p className="text-[11px] font-body text-ivory/40 leading-relaxed">{meta.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Staff list */}
      <div className="rounded-sm border border-white/10 overflow-hidden">
        {/* Built-in admin row */}
        <div className="flex items-center gap-4 px-5 py-4 border-b border-white/5 bg-champagne/5">
          <div className="w-9 h-9 rounded-full bg-gradient-luxury flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-body font-semibold text-ivory/90">Admin</p>
            <p className="text-xs font-body text-ivory/40">admin@butterfly.com</p>
          </div>
          <span className="text-[10px] font-body font-semibold tracking-widest uppercase px-2.5 py-1 rounded bg-champagne/20 text-champagne">Admin</span>
          <span className="text-[10px] font-body text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">Active</span>
          <span className="text-[10px] font-body text-ivory/20 italic">Built-in</span>
        </div>

        {staff.length === 0 && (
          <div className="text-center py-16">
            <Shield size={36} className="text-ivory/10 mx-auto mb-3" />
            <p className="text-sm font-body text-ivory/30">No staff members yet.</p>
            <p className="text-xs font-body text-ivory/20 mt-1">Click &ldquo;Add Staff Member&rdquo; to create one.</p>
          </div>
        )}

        {staff.map((s) => {
          const meta = ROLE_META[s.role];
          return (
            <div key={s.id} className="flex items-center gap-4 px-5 py-4 border-b border-white/5 hover:bg-white/3 transition-colors flex-wrap gap-y-2">
              <div className="w-9 h-9 rounded-full bg-obsidian border border-white/10 flex items-center justify-center text-ivory/60 text-sm font-bold flex-shrink-0">
                {s.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-body font-semibold", s.active ? "text-ivory/90" : "text-ivory/30 line-through")}>{s.name}</p>
                <p className="text-xs font-body text-ivory/40">{s.email}</p>
              </div>
              <span className={cn("text-[10px] font-body font-semibold tracking-widest uppercase px-2.5 py-1 rounded", meta.bg, meta.color)}>
                {meta.label}
              </span>
              <span className={cn("text-[10px] font-body px-2 py-0.5 rounded-full", s.active ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10")}>
                {s.active ? "Active" : "Inactive"}
              </span>
              <p className="text-[10px] font-body text-ivory/20 hidden sm:block">
                {new Date(s.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleToggleActive(s)}
                  title={s.active ? "Deactivate" : "Activate"}
                  className="p-2 rounded hover:bg-white/5 transition-colors"
                >
                  {s.active
                    ? <ToggleRight size={18} className="text-green-400" />
                    : <ToggleLeft size={18} className="text-ivory/30" />}
                </button>
                <button
                  onClick={() => openEdit(s)}
                  title="Edit"
                  className="p-2 rounded hover:bg-white/5 text-ivory/40 hover:text-ivory transition-colors"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setDeleteConfirm(s.id)}
                  title="Delete"
                  className="p-2 rounded hover:bg-red-400/10 text-ivory/30 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-[200]"
              onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-4 top-8 bottom-8 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-xl z-[210] bg-[#1A1612] border border-white/10 rounded-sm overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl text-ivory">
                    {editingId ? "Edit Staff Member" : "Add Staff Member"}
                  </h2>
                  <button onClick={() => setShowForm(false)} className="p-2 text-ivory/40 hover:text-ivory transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="text-xs font-body text-ivory/50 tracking-widest uppercase block mb-1.5">
                      <User size={10} className="inline mr-1" /> Full Name *
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 text-ivory text-sm font-body px-4 py-3 rounded-sm focus:outline-none focus:border-champagne/50 placeholder:text-ivory/20"
                      placeholder="e.g. Priya Sharma"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-body text-ivory/50 tracking-widest uppercase block mb-1.5">
                      <Mail size={10} className="inline mr-1" /> Email Address *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 text-ivory text-sm font-body px-4 py-3 rounded-sm focus:outline-none focus:border-champagne/50 placeholder:text-ivory/20"
                      placeholder="staff@butterfly.com"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-xs font-body text-ivory/50 tracking-widest uppercase block mb-1.5">
                      <Lock size={10} className="inline mr-1" /> Password * {editingId && <span className="normal-case text-ivory/30">(change or keep same)</span>}
                    </label>
                    <div className="relative">
                      <input
                        type={showPw ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 text-ivory text-sm font-body px-4 py-3 pr-10 rounded-sm focus:outline-none focus:border-champagne/50 placeholder:text-ivory/20"
                        placeholder="Min 6 characters"
                        required
                      />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory/30 hover:text-ivory">
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="text-xs font-body text-ivory/50 tracking-widest uppercase block mb-2">
                      Role *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(Object.keys(ROLE_META) as StaffRole[]).filter((r) => r !== "admin").map((role) => {
                        const meta = ROLE_META[role];
                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() => handleRoleChange(role)}
                            className={cn(
                              "px-3 py-2.5 rounded-sm border text-xs font-body font-semibold transition-all",
                              form.role === role
                                ? cn("border-current", meta.color, meta.bg)
                                : "border-white/10 text-ivory/30 hover:border-white/20 hover:text-ivory/60"
                            )}
                          >
                            {meta.label}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[10px] font-body text-ivory/30 mt-1.5">{ROLE_META[form.role].desc}</p>
                  </div>

                  {/* Custom Permissions */}
                  {form.role !== "admin" && (
                    <div>
                      <label className="text-xs font-body text-ivory/50 tracking-widest uppercase block mb-2">
                        Custom Permissions <span className="normal-case text-ivory/25">(override role defaults)</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {PERMISSION_SECTIONS.map(({ key, label }) => {
                          const checked = form.permissions.includes(key);
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => togglePermission(key)}
                              className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-body border transition-all text-left",
                                checked
                                  ? "border-champagne/40 bg-champagne/10 text-champagne"
                                  : "border-white/8 text-ivory/25 hover:border-white/15 hover:text-ivory/40"
                              )}
                            >
                              <Check size={10} className={checked ? "opacity-100" : "opacity-0"} />
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Submit */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 px-4 py-3 border border-white/10 text-ivory/50 text-sm font-body rounded-sm hover:border-white/20 hover:text-ivory/80 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-champagne to-champagne-dark text-obsidian text-sm font-body font-semibold rounded-sm hover:opacity-90 transition-opacity"
                    >
                      {editingId ? "Save Changes" : "Create Staff Member"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-[200]"
              onClick={() => setDeleteConfirm(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-sm z-[210] bg-[#1A1612] border border-red-400/20 rounded-sm p-6"
            >
              <AlertTriangle size={32} className="text-red-400 mx-auto mb-3" />
              <p className="text-center font-display text-xl text-ivory mb-2">Remove Staff Member?</p>
              <p className="text-center text-sm font-body text-ivory/40 mb-6">This cannot be undone. The user will lose access immediately.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-white/10 text-ivory/50 text-sm font-body rounded-sm hover:border-white/20 transition-colors">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-500 text-white text-sm font-body font-semibold rounded-sm hover:bg-red-600 transition-colors">
                  Remove
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
