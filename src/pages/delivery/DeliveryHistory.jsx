import { useEffect, useState } from "react";
import { theme, fmtPrice } from "@/utils/theme";
import { Card, Loader, Badge } from "@/components/UI";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export default function DeliveryHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("*").eq("delivery_partner_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setOrders(data || []));
  }, [user]);

  if (!orders) return <Loader />;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "30px 24px 60px" }}>
      <h1 style={{ fontFamily: theme.fonts.heading, fontSize: 32, marginBottom: 20 }}>Delivery History</h1>
      {orders.length === 0 ? (
        <Card style={{ textAlign: "center", color: theme.colors.textDim, padding: 40 }}>No deliveries yet</Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {orders.map((o) => (
            <Card key={o.id}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{o.customer_name}</div>
                  <div style={{ fontSize: 12, color: theme.colors.textDim, marginTop: 4 }}>
                    #{o.id.slice(0, 8).toUpperCase()} · {new Date(o.created_at).toLocaleString()}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: theme.fonts.mono, color: theme.colors.accent, fontWeight: 700 }}>{fmtPrice(o.total)}</div>
                  <Badge color={o.status === "delivered" ? theme.colors.success : theme.colors.accent} style={{ marginTop: 4 }}>{o.status}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
