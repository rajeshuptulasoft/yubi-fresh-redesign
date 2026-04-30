import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { theme, fmtPrice } from "@/utils/theme";
import { Card, Loader, Button, Badge, Modal } from "@/components/UI";
import { supabase } from "@/integrations/supabase/client";
import { ORDER_STATUSES } from "@/utils/catalog";
import { Phone, MapPin, Clock, QrCode } from "lucide-react";

export default function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [partner, setPartner] = useState(null);
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchOrder = async () => {
      const { data } = await supabase.from("orders").select("*").eq("id", orderId).single();
      if (active) setOrder(data);
      if (data?.delivery_partner_id) {
        const { data: p } = await supabase.from("profiles").select("*").eq("id", data.delivery_partner_id).maybeSingle();
        if (active) setPartner(p);
      }
    };
    fetchOrder();
    const ch = supabase.channel(`order-${orderId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${orderId}` },
        (p) => active && setOrder(p.new))
      .subscribe();
    return () => { active = false; supabase.removeChannel(ch); };
  }, [orderId]);

  if (!order) return <Loader />;
  const idx = ORDER_STATUSES.findIndex((s) => s.key === order.status);
  const currentIdx = idx === -1 ? 0 : idx;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "30px 24px 60px" }}>
      <Link to="/orders" style={{ color: theme.colors.textDim, fontSize: 14, textDecoration: "none" }}>← All orders</Link>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginTop: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: theme.fonts.heading, fontSize: 36, margin: 0 }}>Track Order</h1>
          <div style={{ fontFamily: theme.fonts.mono, fontSize: 13, color: theme.colors.textDim, marginTop: 4 }}>#{order.id.slice(0, 8).toUpperCase()}</div>
        </div>
        <Badge color={order.status === "delivered" ? theme.colors.success : theme.colors.accent}>{order.status.replace("_", " ")}</Badge>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }} className="ss-cart-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Stepper */}
          <Card>
            <div style={{ fontFamily: theme.fonts.heading, fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Delivery Status</div>
            <div style={{ position: "relative" }}>
              {ORDER_STATUSES.map((s, i) => {
                const done = i <= currentIdx;
                const active = i === currentIdx;
                return (
                  <div key={s.key} style={{ display: "flex", gap: 16, paddingBottom: i === ORDER_STATUSES.length - 1 ? 0 : 24, position: "relative" }}>
                    {i < ORDER_STATUSES.length - 1 && (
                      <div style={{
                        position: "absolute", left: 19, top: 40, bottom: 0, width: 2,
                        background: i < currentIdx ? theme.gradient : theme.colors.border,
                        transition: "all 0.6s ease",
                      }} />
                    )}
                    <div className={active ? "ss-pulse-ring" : ""} style={{
                      width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                      background: done ? theme.gradient : theme.colors.surface,
                      border: `2px solid ${done ? theme.colors.accent : theme.colors.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                      transition: "all 0.4s ease",
                    }}>{s.icon}</div>
                    <div style={{ paddingTop: 6 }}>
                      <div style={{ fontWeight: done ? 700 : 500, color: done ? "#fff" : theme.colors.textDim }}>{s.label}</div>
                      {active && <div style={{ fontSize: 12, color: theme.colors.accent, marginTop: 4, fontFamily: theme.fonts.mono }}>IN PROGRESS</div>}
                    </div>
                  </div>
                );
              })}
            </div>
            {order.payment_method === "cod" && currentIdx >= 4 && order.payment_status === "pending" && (
              <Button size="lg" onClick={() => setQrOpen(true)} style={{ width: "100%", marginTop: 16 }}>
                <QrCode size={18} /> View Payment QR
              </Button>
            )}
          </Card>

          {/* Map placeholder */}
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <div style={{
              height: 240, background: "linear-gradient(135deg, #1a2332, #0a1018)",
              position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 50%, rgba(244,166,35,0.2), transparent 30%), radial-gradient(circle at 70% 50%, rgba(34,197,94,0.2), transparent 30%)" }} />
              <svg width="100%" height="100%" style={{ position: "absolute" }}>
                <path d="M 60 120 Q 200 40 340 120" stroke={theme.colors.accent} strokeWidth="2" fill="none" strokeDasharray="6 6" />
              </svg>
              <div style={{ position: "absolute", left: "20%", top: "45%", textAlign: "center" }}>
                <div className="ss-pulse-ring" style={{ width: 24, height: 24, borderRadius: "50%", background: theme.colors.accent, margin: "0 auto" }} />
                <div style={{ fontSize: 11, fontFamily: theme.fonts.mono, marginTop: 4 }}>KITCHEN</div>
              </div>
              <div style={{ position: "absolute", right: "20%", top: "45%", textAlign: "center" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: theme.colors.success, margin: "0 auto" }} />
                <div style={{ fontSize: 11, fontFamily: theme.fonts.mono, marginTop: 4 }}>YOU</div>
              </div>
              <Badge color={theme.colors.accent} style={{ position: "absolute", bottom: 12, left: 12 }}>LIVE MAP</Badge>
            </div>
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {partner ? (
            <Card>
              <div style={{ fontFamily: theme.fonts.heading, fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Your Delivery Partner</div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: theme.gradient, display: "flex", alignItems: "center", justifyContent: "center", color: "#0D0D0D", fontWeight: 800, fontSize: 22 }}>
                  {(partner.full_name || "P")[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{partner.full_name || "Partner"}</div>
                  <div style={{ fontSize: 12, color: theme.colors.accent, fontFamily: theme.fonts.mono }}>★ 4.9 · 1240 deliveries</div>
                </div>
                <Button variant="outline" size="sm"><Phone size={14} /></Button>
              </div>
            </Card>
          ) : (
            <Card>
              <div style={{ fontFamily: theme.fonts.heading, fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Awaiting partner</div>
              <div style={{ color: theme.colors.textDim, fontSize: 13 }}>We're assigning a delivery partner to your order.</div>
            </Card>
          )}

          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: theme.colors.accent, marginBottom: 8 }}>
              <Clock size={16} /><span style={{ fontFamily: theme.fonts.mono, fontSize: 12, letterSpacing: 1 }}>EST. ARRIVAL</span>
            </div>
            <div style={{ fontFamily: theme.fonts.heading, fontSize: 36, fontWeight: 700 }}>25–35 <span style={{ fontSize: 16, color: theme.colors.textDim }}>mins</span></div>
          </Card>

          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <MapPin size={16} color={theme.colors.accent} />
              <div style={{ fontFamily: theme.fonts.heading, fontWeight: 600 }}>Delivery Address</div>
            </div>
            <div style={{ color: theme.colors.textDim, fontSize: 14, lineHeight: 1.5 }}>{order.delivery_address}</div>
          </Card>

          <Card>
            <div style={{ fontFamily: theme.fonts.heading, fontWeight: 600, marginBottom: 10 }}>Order Items</div>
            {order.items.map((it, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                <span>{it.emoji} {it.name} × {it.qty}</span>
                <span style={{ fontFamily: theme.fonts.mono, color: theme.colors.accent }}>{fmtPrice(it.price * it.qty)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${theme.colors.border}`, marginTop: 10, paddingTop: 10, fontWeight: 700 }}>
              <span>Total</span>
              <span style={{ color: theme.colors.accent, fontFamily: theme.fonts.mono }}>{fmtPrice(order.total)}</span>
            </div>
          </Card>
        </div>
      </div>

      <Modal open={qrOpen} onClose={() => setQrOpen(false)} maxWidth={360}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: theme.fonts.heading, fontSize: 22, marginTop: 0 }}>Pay {fmtPrice(order.total)}</h2>
          <div style={{ width: 220, height: 220, margin: "20px auto", background: "#fff", borderRadius: 12, padding: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              {Array.from({ length: 100 }).map((_, i) => {
                const x = (i % 10) * 10, y = Math.floor(i / 10) * 10;
                return Math.random() > 0.45 ? <rect key={i} x={x} y={y} width="10" height="10" fill="#0D0D0D" /> : null;
              })}
            </svg>
          </div>
          <div style={{ fontFamily: theme.fonts.mono, fontSize: 13, color: theme.colors.textDim }}>Scan with any UPI app</div>
        </div>
      </Modal>
    </div>
  );
}
