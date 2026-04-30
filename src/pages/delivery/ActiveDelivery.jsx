import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { theme, fmtPrice } from "@/utils/theme";
import { Card, Loader, Button, Badge, Modal } from "@/components/UI";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Phone, QrCode, MapPin, ChevronDown, ChevronUp } from "lucide-react";

const FLOW = ["preparing", "picked_up", "on_the_way", "reached", "delivered"];
const ACTIONS = {
  preparing: { label: "✅ Reached at Restaurant", next: "picked_up" },
  picked_up: { label: "📦 Picked Up the Parcel", next: "on_the_way" },
  on_the_way: { label: "🚀 On the Way to Customer", next: "reached" },
  reached: { label: "📍 Reached Customer Location", next: "delivered" },
};

export default function ActiveDelivery() {
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [paid, setPaid] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = () => supabase.from("orders").select("*").eq("delivery_partner_id", user.id).not("status", "in", "(delivered,cancelled)").maybeSingle().then(({ data }) => setOrder(data));
    load();
    const ch = supabase.channel(`active-${user.id}`).on("postgres_changes", { event: "*", schema: "public", table: "orders", filter: `delivery_partner_id=eq.${user.id}` }, load).subscribe();
    return () => supabase.removeChannel(ch);
  }, [user]);

  if (order === null) return <Loader />;
  if (!order) return (
    <div style={{ maxWidth: 700, margin: "60px auto", padding: 24, textAlign: "center" }}>
      <Card style={{ padding: 40 }}>
        <div style={{ fontFamily: theme.fonts.heading, fontSize: 22 }}>No active delivery</div>
        <Link to="/delivery" style={{ textDecoration: "none" }}><Button style={{ marginTop: 14 }}>Back to Dashboard</Button></Link>
      </Card>
    </div>
  );

  const advance = async () => {
    const action = ACTIONS[order.status];
    if (!action) return;
    if (action.next === "delivered" && order.payment_method === "cod" && !paid) {
      return toast.error("Confirm payment before marking delivered");
    }
    const updates = { status: action.next };
    if (action.next === "delivered" && order.payment_method === "cod") updates.payment_status = "paid";
    const { error } = await supabase.from("orders").update(updates).eq("id", order.id);
    if (error) return toast.error(error.message);
    await supabase.from("notifications").insert({
      user_id: order.customer_id, title: "Order update",
      message: `Your order is now ${action.next.replace("_", " ")}`,
      type: "status_update", order_id: order.id,
    });
    toast.success("Status updated");
  };

  const action = ACTIONS[order.status];
  const stepIdx = FLOW.indexOf(order.status);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "30px 24px 60px" }}>
      <Link to="/delivery" style={{ color: theme.colors.textDim, fontSize: 14, textDecoration: "none" }}>← Dashboard</Link>
      <h1 style={{ fontFamily: theme.fonts.heading, fontSize: 30, margin: "12px 0 20px" }}>Active Delivery</h1>

      {/* Map */}
      <Card style={{ padding: 0, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ height: 280, background: "linear-gradient(135deg, #1a2332, #0a1018)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 25% 60%, rgba(244,166,35,0.25), transparent 25%), radial-gradient(circle at 75% 40%, rgba(34,197,94,0.25), transparent 25%)" }} />
          <svg width="100%" height="100%" style={{ position: "absolute" }}>
            <path d="M 100 180 Q 250 60 400 120" stroke={theme.colors.accent} strokeWidth="3" fill="none" strokeDasharray="8 8" />
          </svg>
          <div style={{ position: "absolute", left: "20%", top: "55%", textAlign: "center" }}>
            <div className="ss-pulse-ring" style={{ width: 28, height: 28, borderRadius: "50%", background: theme.colors.accent, margin: "0 auto" }} />
            <div style={{ fontSize: 11, fontFamily: theme.fonts.mono, marginTop: 6 }}>RESTAURANT</div>
          </div>
          <div style={{ position: "absolute", right: "20%", top: "35%", textAlign: "center" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: theme.colors.success, margin: "0 auto" }} />
            <div style={{ fontSize: 11, fontFamily: theme.fonts.mono, marginTop: 6 }}>CUSTOMER</div>
          </div>
          <Badge color={theme.colors.accent} style={{ position: "absolute", top: 12, left: 12 }}>LIVE NAVIGATION</Badge>
        </div>
      </Card>

      {/* Step indicator */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {FLOW.map((s, i) => (
            <div key={s} style={{ flex: 1, height: 6, borderRadius: 3, background: i <= stepIdx ? theme.gradient : theme.colors.border, transition: "all 0.5s" }} />
          ))}
        </div>
        <div style={{ marginTop: 14, color: theme.colors.textDim, fontSize: 13, fontFamily: theme.fonts.mono, letterSpacing: 1, textTransform: "uppercase" }}>
          Step {stepIdx + 1} of {FLOW.length}
        </div>
        <div style={{ fontFamily: theme.fonts.heading, fontSize: 22, fontWeight: 700, marginTop: 4 }}>
          {order.status.replace("_", " ").toUpperCase()}
        </div>
      </Card>

      {/* Action button */}
      {action && (
        <div style={{ marginBottom: 16 }}>
          {order.status === "reached" && order.payment_method === "cod" && !paid && (
            <Button size="lg" variant="outline" style={{ width: "100%", marginBottom: 10 }} onClick={() => setQrOpen(true)}>
              <QrCode size={18} /> Display Payment QR Code · {fmtPrice(order.total)}
            </Button>
          )}
          <Button size="xl" style={{ width: "100%" }} onClick={advance}>{action.label}</Button>
        </div>
      )}

      {/* Order details */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => setExpanded(!expanded)}>
          <div>
            <div style={{ fontFamily: theme.fonts.heading, fontSize: 18, fontWeight: 600 }}>{order.customer_name}</div>
            <div style={{ fontSize: 12, color: theme.colors.textDim, marginTop: 2 }}>#{order.id.slice(0, 8).toUpperCase()}</div>
          </div>
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </div>
        {expanded && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${theme.colors.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: theme.colors.textDim, fontSize: 14, marginBottom: 12 }}>
              <MapPin size={14} /> {order.delivery_address}
            </div>
            <Button variant="outline" size="sm" style={{ marginBottom: 14 }}><Phone size={14} /> {order.customer_phone || "Call"}</Button>
            {order.items.map((i, k) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                <span>{i.emoji} {i.name} × {i.qty}</span>
                <span style={{ fontFamily: theme.fonts.mono }}>{fmtPrice(i.price * i.qty)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${theme.colors.border}`, marginTop: 10, paddingTop: 10, fontWeight: 700 }}>
              <span>Total ({order.payment_method.toUpperCase()})</span>
              <span style={{ color: theme.colors.accent, fontFamily: theme.fonts.mono }}>{fmtPrice(order.total)}</span>
            </div>
          </div>
        )}
      </Card>

      <Modal open={qrOpen} onClose={() => setQrOpen(false)} maxWidth={360}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: theme.fonts.heading, fontSize: 22, marginTop: 0 }}>Collect {fmtPrice(order.total)}</h2>
          <div style={{ width: 220, height: 220, margin: "20px auto", background: "#fff", borderRadius: 12, padding: 12 }}>
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              {Array.from({ length: 100 }).map((_, i) => {
                const x = (i % 10) * 10, y = Math.floor(i / 10) * 10;
                return Math.random() > 0.45 ? <rect key={i} x={x} y={y} width="10" height="10" fill="#0D0D0D" /> : null;
              })}
            </svg>
          </div>
          <Button size="lg" style={{ width: "100%" }} onClick={() => { setPaid(true); setQrOpen(false); toast.success("Payment confirmed"); }}>
            ✅ Confirm Payment Received
          </Button>
        </div>
      </Modal>
    </div>
  );
}
