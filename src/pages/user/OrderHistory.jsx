import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { theme, fmtPrice } from "@/utils/theme";
import { Card, Loader, Button, Badge } from "@/components/UI";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("*").eq("customer_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setOrders(data || []));
  }, [user]);

  if (orders === null) return <Loader />;

  const filtered = orders.filter((o) => {
    if (filter === "all") return true;
    if (filter === "active") return !["delivered", "cancelled"].includes(o.status);
    return o.status === filter;
  });

  const statusColor = (s) => s === "delivered" ? theme.colors.success : s === "cancelled" ? theme.colors.error : theme.colors.accent;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "30px 24px 60px" }}>
      <h1 style={{ fontFamily: theme.fonts.heading, fontSize: "clamp(32px,5vw,42px)", marginBottom: 20 }}>Your Orders</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["all", "active", "delivered", "cancelled"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "8px 16px", borderRadius: 999, cursor: "pointer", textTransform: "capitalize",
            background: filter === f ? theme.gradient : theme.colors.surface,
            color: filter === f ? "#0D0D0D" : "#fff", fontWeight: 600,
            border: filter === f ? "none" : `1px solid ${theme.colors.border}`, fontFamily: theme.fonts.body, fontSize: 13,
          }}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 60 }}>
          <div style={{ color: theme.colors.textDim }}>No orders yet</div>
          <Link to="/menu" style={{ textDecoration: "none" }}><Button style={{ marginTop: 14 }}>Order Now</Button></Link>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filtered.map((o) => (
            <Card key={o.id} className="ss-fade-up">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: theme.fonts.mono, fontSize: 12, color: theme.colors.textDim }}>#{o.id.slice(0, 8).toUpperCase()}</span>
                    <Badge color={statusColor(o.status)}>{o.status.replace("_", " ")}</Badge>
                  </div>
                  <div style={{ marginTop: 8, color: theme.colors.text }}>
                    {o.items.slice(0, 3).map((i) => `${i.emoji} ${i.name} × ${i.qty}`).join("  ·  ")}
                    {o.items.length > 3 && <span style={{ color: theme.colors.textDim }}> +{o.items.length - 3} more</span>}
                  </div>
                  <div style={{ marginTop: 6, color: theme.colors.textDim, fontSize: 12, fontFamily: theme.fonts.mono }}>
                    {new Date(o.created_at).toLocaleString()} · {o.payment_method.toUpperCase()}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 20, color: theme.colors.accent }}>{fmtPrice(o.total)}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <Link to={`/track/${o.id}`} style={{ textDecoration: "none" }}><Button size="sm" variant="outline">Track</Button></Link>
                    <Button size="sm">Reorder</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
