import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { theme, fmtPrice } from "@/utils/theme";
import { Card, Loader, Badge, Button } from "@/components/UI";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { TrendingUp, Package, Power } from "lucide-react";

export default function DeliveryDashboard() {
  const { user, profile, refreshProfile } = useAuth();
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    if (!user) return;
    const load = () => supabase.from("orders").select("*").eq("delivery_partner_id", user.id).order("created_at", { ascending: false }).then(({ data }) => setOrders(data || []));
    load();
    const ch = supabase.channel(`del-${user.id}`).on("postgres_changes", { event: "*", schema: "public", table: "orders", filter: `delivery_partner_id=eq.${user.id}` }, load).subscribe();
    return () => supabase.removeChannel(ch);
  }, [user]);

  const toggleOnline = async () => {
    const next = !profile?.is_online;
    await supabase.from("profiles").update({ is_online: next }).eq("id", user.id);
    refreshProfile();
    toast.success(next ? "You're online" : "You're offline");
  };

  if (!orders) return <Loader />;
  const active = orders.find((o) => !["delivered", "cancelled"].includes(o.status));
  const completed = orders.filter((o) => o.status === "delivered");
  const earnings = completed.reduce((s, o) => s + Number(o.total) * 0.1, 0);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "30px 24px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <h1 style={{ fontFamily: theme.fonts.heading, fontSize: 36, margin: 0 }}>Delivery Hub</h1>
        <Button variant={profile?.is_online ? "success" : "ghost"} onClick={toggleOnline}>
          <Power size={16} /> {profile?.is_online ? "Online" : "Go Online"}
        </Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
        <Card>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `${theme.colors.success}22`, color: theme.colors.success, display: "flex", alignItems: "center", justifyContent: "center" }}><TrendingUp /></div>
          <div style={{ fontFamily: theme.fonts.heading, fontSize: 28, fontWeight: 700, marginTop: 14 }}>{fmtPrice(earnings)}</div>
          <div style={{ color: theme.colors.textDim, fontSize: 13 }}>Earnings (10% commission)</div>
        </Card>
        <Card>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `${theme.colors.accent}22`, color: theme.colors.accent, display: "flex", alignItems: "center", justifyContent: "center" }}><Package /></div>
          <div style={{ fontFamily: theme.fonts.heading, fontSize: 28, fontWeight: 700, marginTop: 14 }}>{completed.length}</div>
          <div style={{ color: theme.colors.textDim, fontSize: 13 }}>Deliveries Completed</div>
        </Card>
        <Card>
          <Badge color={profile?.is_online ? theme.colors.success : theme.colors.textDim}>{profile?.is_online ? "Available" : "Offline"}</Badge>
          <div style={{ fontFamily: theme.fonts.heading, fontSize: 22, fontWeight: 700, marginTop: 14 }}>{active ? "On a delivery" : "Waiting"}</div>
          <div style={{ color: theme.colors.textDim, fontSize: 13 }}>Current status</div>
        </Card>
      </div>

      {active ? (
        <Card style={{ borderColor: theme.colors.accent, borderWidth: 2 }}>
          <Badge color={theme.colors.accent}>ACTIVE ORDER</Badge>
          <div style={{ fontFamily: theme.fonts.heading, fontSize: 22, fontWeight: 700, marginTop: 12 }}>
            {active.customer_name} · #{active.id.slice(0, 8).toUpperCase()}
          </div>
          <div style={{ color: theme.colors.textDim, marginTop: 6 }}>{active.delivery_address}</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
            <span style={{ color: theme.colors.textDim, fontSize: 14 }}>{active.items.length} items · {active.payment_method.toUpperCase()}</span>
            <span style={{ fontFamily: theme.fonts.mono, color: theme.colors.accent, fontWeight: 700 }}>{fmtPrice(active.total)}</span>
          </div>
          <Link to="/delivery/active" style={{ textDecoration: "none" }}>
            <Button size="lg" style={{ width: "100%", marginTop: 16 }}>Continue Delivery →</Button>
          </Link>
        </Card>
      ) : (
        <Card style={{ textAlign: "center", padding: 40, color: theme.colors.textDim }}>
          {profile?.is_online ? "Waiting for the next assignment..." : "Go online to start receiving orders"}
        </Card>
      )}

      <h2 style={{ fontFamily: theme.fonts.heading, fontSize: 22, marginTop: 30, marginBottom: 14 }}>Recent Deliveries</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {completed.slice(0, 5).map((o) => (
          <Card key={o.id}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 600 }}>{o.customer_name}</div>
                <div style={{ fontSize: 12, color: theme.colors.textDim, marginTop: 4 }}>{new Date(o.created_at).toLocaleString()}</div>
              </div>
              <Badge color={theme.colors.success}>Delivered</Badge>
            </div>
          </Card>
        ))}
        {completed.length === 0 && <div style={{ color: theme.colors.textDim, textAlign: "center", padding: 20 }}>No completed deliveries yet</div>}
      </div>
    </div>
  );
}
