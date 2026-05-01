import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { deliveryAPI } from "../../lib/api";
import { getDeliveryPartners, saveDeliveryPartners } from "../../utils/deliveryState";
import { title } from "./AdminDashboard";
import { Table } from "./AdminUsers";
import { AdminModal } from "./AdminProducts";

const blankPartner = { name: "", email: "", phone: "", password: "", confirmPassword: "" };

export default function AdminPartners() {
  const [partners, setPartners] = useState(() => getDeliveryPartners());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const syncPartners = () => setPartners(getDeliveryPartners());
    window.addEventListener("storage", syncPartners);
    window.addEventListener("focus", syncPartners);
    window.addEventListener("yubiDeliveryPartnersUpdated", syncPartners);
    return () => {
      window.removeEventListener("storage", syncPartners);
      window.removeEventListener("focus", syncPartners);
      window.removeEventListener("yubiDeliveryPartnersUpdated", syncPartners);
    };
  }, []);

  const addPartner = (partner) => {
    const next = [partner, ...partners];
    setPartners(next);
    saveDeliveryPartners(next);
  };

  return (
    <div>
      <div className="admin-page-head">
        <h1 style={{ ...title, fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>Delivery Partners</h1>
        <button className="admin-add-btn" onClick={() => setOpen(true)}><Plus size={18} /> Create Partner</button>
      </div>
      <Table headers={["ID", "Name", "Email", "Phone", "Status", "Current Order", "Deliveries", "Rating", "Earnings"]} rows={partners.map((partner) => [partner.id, partner.name, partner.email, partner.phone, <StatusBadge key={`${partner.id}-status`} status={partner.status} />, partner.currentOrderId || "Free", partner.totalDeliveries, partner.rating, `Rs ${partner.earnings}`])} />
      {open && (
        <AdminModal title="Create Delivery Partner" onClose={() => setOpen(false)}>
          <DeliveryPartnerForm onCancel={() => setOpen(false)} onCreated={(partner) => { addPartner(partner); setOpen(false); }} />
        </AdminModal>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const offline = status === "Offline";
  const busy = status === "On Delivery";
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 10px", borderRadius: 999, fontWeight: 900, background: offline ? "#F3F4F6" : busy ? "#FEF3C7" : "#E8F5E9", color: offline ? "#6B7280" : busy ? "#92400E" : "#2E7D32" }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: offline ? "#9CA3AF" : busy ? "#F59E0B" : "#4CAF50" }} />{status}</span>;
}

function DeliveryPartnerForm({ onCancel, onCreated }) {
  const [form, setForm] = useState(blankPartner);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const validate = () => {
    const next = {};
    Object.entries(form).forEach(([key, value]) => {
      if (!value.trim()) next[key] = "This field is required";
    });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email";
    if (form.password && form.password.length < 6) next.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const payload = { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), password: form.password };
    let created = null;
    try {
      created = await deliveryAPI.createPartner(payload);
      toast.success("Delivery partner created");
    } catch (error) {
      console.warn("Delivery partner API unavailable, saved locally:", error);
      toast.success("Delivery partner saved locally");
    }
    onCreated({
      id: created?.id || `DEL-${Date.now()}`,
      ...payload,
      status: "Available",
      currentOrderId: null,
      totalDeliveries: 0,
      rating: 5,
      earnings: 0,
    });
    setForm(blankPartner);
    setLoading(false);
  };

  return (
    <form className="admin-product-form" onSubmit={submit}>
      <Field label="Name" error={errors.name}><input value={form.name} onChange={(event) => update("name", event.target.value)} /></Field>
      <Field label="Email" error={errors.email}><input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} /></Field>
      <Field label="Phone" error={errors.phone}><input type="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} /></Field>
      <div className="admin-form-grid">
        <Field label="Password" error={errors.password}><input type="password" value={form.password} onChange={(event) => update("password", event.target.value)} /></Field>
        <Field label="Confirm Password" error={errors.confirmPassword}><input type="password" value={form.confirmPassword} onChange={(event) => update("confirmPassword", event.target.value)} /></Field>
      </div>
      <div className="admin-form-actions">
        <button type="button" className="admin-secondary-btn" onClick={onCancel}>Cancel</button>
        <button className="admin-add-btn" disabled={loading}>{loading ? "Creating..." : "Create Partner"}</button>
      </div>
    </form>
  );
}

function Field({ label, error, children }) {
  return <label className="admin-form-field"><span>{label}</span>{children}{error && <small>{error}</small>}</label>;
}
