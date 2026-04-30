import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { theme, fmtPrice } from "@/utils/theme";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Card, Button, Input, Badge } from "@/components/UI";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreditCard, Smartphone, Banknote, MapPin, Loader2 } from "lucide-react";

export default function Checkout() {
  const { items, subtotal, discount, deliveryFee, tax, total, clearCart } = useCart();
  const { user, profile } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pay, setPay] = useState("cod");
  const [form, setForm] = useState({
    name: profile?.full_name || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    notes: "",
  });

  if (!user) {
    nav("/auth");
    return null;
  }
  if (items.length === 0) {
    nav("/cart");
    return null;
  }

  const place = async () => {
    if (!form.name || !form.phone || !form.address) return toast.error("Please fill all delivery details");
    setLoading(true);
    const { data, error } = await supabase.from("orders").insert({
      customer_id: user.id,
      items: items.map((i) => ({ id: i.productId, name: i.name, qty: i.qty, price: i.price, variant: i.variant, emoji: i.emoji })),
      subtotal, delivery_fee: deliveryFee, tax, total,
      payment_method: pay, payment_status: pay === "cod" ? "pending" : "paid",
      status: "placed",
      delivery_address: form.address, customer_name: form.name, customer_phone: form.phone, notes: form.notes,
    }).select().single();
    setLoading(false);
    if (error) return toast.error(error.message);

    // Notify all admins of new order
    const { data: admins } = await supabase.from("user_roles").select("user_id").eq("role", "admin");
    if (admins?.length) {
      await supabase.from("notifications").insert(admins.map((a) => ({
        user_id: a.user_id, title: "New order received",
        message: `${form.name} placed order ${data.id.slice(0, 8)} · ${fmtPrice(total)}`,
        type: "new_order", order_id: data.id,
      })));
    }
    // Notify customer
    await supabase.from("notifications").insert({
      user_id: user.id, title: "Order placed!",
      message: `Your order ${data.id.slice(0, 8)} is confirmed.`, type: "order_placed", order_id: data.id,
    });
    clearCart();
    toast.success("Order placed successfully!");
    nav(`/track/${data.id}`);
  };

  const methods = [
    { v: "card", l: "Credit / Debit Card", icon: <CreditCard size={20} />, desc: "Visa, Mastercard, Amex" },
    { v: "upi", l: "UPI", icon: <Smartphone size={20} />, desc: "GPay, PhonePe, Paytm" },
    { v: "cod", l: "Cash on Delivery", icon: <Banknote size={20} />, desc: "Pay via QR when delivered" },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "30px 24px 60px" }}>
      <h1 style={{ fontFamily: theme.fonts.heading, fontSize: "clamp(32px,5vw,44px)", marginBottom: 24 }}>Checkout</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }} className="ss-cart-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <MapPin size={18} color={theme.colors.accent} />
              <div style={{ fontFamily: theme.fonts.heading, fontSize: 20, fontWeight: 600 }}>Delivery Details</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <Input placeholder="Full delivery address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={{ marginTop: 12 }} />
            <Input placeholder="Delivery notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ marginTop: 12 }} />
          </Card>

          <Card>
            <div style={{ fontFamily: theme.fonts.heading, fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Payment Method</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {methods.map((m) => (
                <button key={m.v} onClick={() => setPay(m.v)} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: 16, borderRadius: 12, cursor: "pointer", textAlign: "left",
                  border: pay === m.v ? `2px solid ${theme.colors.accent}` : `1px solid ${theme.colors.border}`,
                  background: pay === m.v ? "rgba(244,166,35,0.06)" : theme.colors.surfaceAlt, color: "#fff",
                }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: pay === m.v ? theme.gradient : theme.colors.surface, color: pay === m.v ? "#0D0D0D" : theme.colors.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {m.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{m.l}</div>
                    <div style={{ color: theme.colors.textDim, fontSize: 13, marginTop: 2 }}>{m.desc}</div>
                  </div>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${pay === m.v ? theme.colors.accent : theme.colors.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {pay === m.v && <div style={{ width: 10, height: 10, borderRadius: "50%", background: theme.colors.accent }} />}
                  </div>
                </button>
              ))}
            </div>
            {pay === "cod" && (
              <div style={{ marginTop: 14, padding: 12, borderRadius: 10, background: "rgba(244,166,35,0.08)", border: `1px solid ${theme.colors.accent}33`, fontSize: 13, color: theme.colors.text }}>
                💡 Your delivery partner will display a QR code at your door. Pay via UPI on arrival.
              </div>
            )}
          </Card>
        </div>

        <Card style={{ position: "sticky", top: 96, alignSelf: "start" }}>
          <div style={{ fontFamily: theme.fonts.heading, fontSize: 18, fontWeight: 600, marginBottom: 14 }}>Order Summary</div>
          <div style={{ maxHeight: 220, overflow: "auto", marginBottom: 14 }}>
            {items.map((i) => (
              <div key={i.key} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${theme.colors.border}`, fontSize: 13 }}>
                <span>{i.emoji} {i.name} {i.variant && <span style={{ color: theme.colors.textDim }}>({i.variant})</span>} × {i.qty}</span>
                <span style={{ fontFamily: theme.fonts.mono }}>{fmtPrice(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <Row label="Subtotal" value={fmtPrice(subtotal)} />
          {discount > 0 && <Row label="Discount" value={`-${fmtPrice(discount)}`} color={theme.colors.success} />}
          <Row label="Delivery" value={deliveryFee === 0 ? "FREE" : fmtPrice(deliveryFee)} />
          <Row label="Tax" value={fmtPrice(tax)} />
          <div style={{ height: 1, background: theme.colors.border, margin: "12px 0" }} />
          <Row label="Total" value={fmtPrice(total)} big />
          <Button size="lg" onClick={place} disabled={loading} style={{ width: "100%", marginTop: 18 }}>
            {loading ? <><Loader2 size={18} className="ss-spin" /> Placing...</> : `Place Order · ${fmtPrice(total)}`}
          </Button>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value, color, big }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}>
      <span style={{ color: big ? "#fff" : theme.colors.textDim, fontWeight: big ? 700 : 400, fontSize: big ? 16 : 14 }}>{label}</span>
      <span style={{ color: color || (big ? theme.colors.accent : "#fff"), fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: big ? 22 : 14 }}>{value}</span>
    </div>
  );
}
