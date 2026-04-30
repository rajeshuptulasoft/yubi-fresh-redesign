import { useEffect, useState } from "react";
import { theme } from "@/utils/theme";
import { Card, Loader, Badge } from "@/components/UI";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDeliveryPartners() {
  const [partners, setPartners] = useState(null);

  useEffect(() => {
    (async () => {
      const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "delivery_partner");
      const ids = (roles || []).map((r) => r.user_id);
      if (!ids.length) { setPartners([]); return; }
      const { data: profs } = await supabase.from("profiles").select("*").in("id", ids);
      const { data: orders } = await supabase.from("orders").select("delivery_partner_id, status").in("delivery_partner_id", ids);
      const stats = {};
      ids.forEach((id) => { stats[id] = { active: 0, total: 0 }; });
      (orders || []).forEach((o) => {
        if (!stats[o.delivery_partner_id]) return;
        stats[o.delivery_partner_id].total++;
        if (!["delivered", "cancelled"].includes(o.status)) stats[o.delivery_partner_id].active++;
      });
      setPartners((profs || []).map((p) => ({ ...p, ...stats[p.id] })));
    })();
  }, []);

  if (!partners) return <Loader />;

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "30px 24px 60px" }}>
      <h1 style={{ fontFamily: theme.fonts.heading, fontSize: 36, marginBottom: 20 }}>Delivery Partners</h1>
      {partners.length === 0 ? (
        <Card style={{ textAlign: "center", color: theme.colors.textDim, padding: 40 }}>No delivery partners registered yet.</Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 14 }}>
          {partners.map((p) => (
            <Card key={p.id}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: theme.gradient, color: "#0D0D0D", fontWeight: 800, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {(p.full_name || "P")[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{p.full_name || "Unnamed"}</div>
                  <div style={{ fontSize: 12, color: theme.colors.textDim }}>{p.phone || "—"}</div>
                </div>
                <Badge color={p.is_online ? theme.colors.success : theme.colors.textDim}>{p.is_online ? "Online" : "Offline"}</Badge>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${theme.colors.border}` }}>
                <Stat label="Active" value={p.active} />
                <Stat label="Total" value={p.total} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: theme.fonts.heading, fontSize: 22, fontWeight: 700, color: theme.colors.accent }}>{value}</div>
      <div style={{ fontSize: 11, color: theme.colors.textDim, fontFamily: theme.fonts.mono, letterSpacing: 1 }}>{label.toUpperCase()}</div>
    </div>
  );
}
