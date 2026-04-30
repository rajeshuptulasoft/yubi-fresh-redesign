import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { theme, fmtPrice } from "@/utils/theme";
import { Card, Loader, Button, Badge } from "@/components/UI";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminAssignDelivery() {
  const { orderId } = useParams();
  const nav = useNavigate();
  const [order, setOrder] = useState(null);
  const [partners, setPartners] = useState(null);

  useEffect(() => {
    supabase.from("orders").select("*").eq("id", orderId).single().then(({ data }) => setOrder(data));
    (async () => {
      const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "delivery_partner");
      const ids = (roles || []).map((r) => r.user_id);
      if (ids.length === 0) { setPartners([]); return; }
      const { data: profs } = await supabase.from("profiles").select("*").in("id", ids);
      const { data: busy } = await supabase.from("orders").select("delivery_partner_id").in("status", ["picked_up", "on_the_way", "reached"]);
      const busySet = new Set((busy || []).map((b) => b.delivery_partner_id));
      setPartners((profs || []).map((p) => ({ ...p, busy: busySet.has(p.id) })));
    })();
  }, [orderId]);

  const assign = async (partnerId) => {
    const { error } = await supabase.from("orders").update({ delivery_partner_id: partnerId, status: "preparing" }).eq("id", orderId);
    if (error) return toast.error(error.message);
    await supabase.from("notifications").insert([
      { user_id: partnerId, title: "New delivery assigned", message: `Order #${orderId.slice(0, 8).toUpperCase()} for ${order.customer_name}`, type: "assignment", order_id: orderId },
      { user_id: order.customer_id, title: "Partner assigned!", message: "Your order is now being prepared.", type: "status_update", order_id: orderId },
    ]);
    toast.success("Delivery partner assigned");
    nav("/admin/orders");
  };

  if (!order || !partners) return <Loader />;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "30px 24px 60px" }}>
      <h1 style={{ fontFamily: theme.fonts.heading, fontSize: 32, marginBottom: 20 }}>Assign Delivery Partner</h1>
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: 12, color: theme.colors.textDim }}>#{order.id.slice(0, 8).toUpperCase()}</div>
            <div style={{ fontFamily: theme.fonts.heading, fontSize: 22, marginTop: 4 }}>{order.customer_name}</div>
            <div style={{ color: theme.colors.textDim, marginTop: 4, fontSize: 14 }}>{order.delivery_address}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: 22, fontWeight: 700, color: theme.colors.accent }}>{fmtPrice(order.total)}</div>
            <div style={{ fontSize: 12, color: theme.colors.textDim, marginTop: 4 }}>{order.items.length} items · {order.payment_method.toUpperCase()}</div>
          </div>
        </div>
      </Card>

      <h2 style={{ fontFamily: theme.fonts.heading, fontSize: 22, marginBottom: 12 }}>Available Partners</h2>
      {partners.length === 0 ? (
        <Card style={{ textAlign: "center", color: theme.colors.textDim, padding: 40 }}>
          No delivery partners registered yet. Sign up a delivery partner from the Auth page.
        </Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 14 }}>
          {partners.map((p) => (
            <Card key={p.id}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 50, height: 50, borderRadius: "50%", background: theme.gradient, color: "#0D0D0D", fontWeight: 800, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {(p.full_name || "P")[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{p.full_name || "Partner"}</div>
                  <Badge color={p.busy ? theme.colors.error : theme.colors.success}>{p.busy ? "🔴 On Delivery" : "🟢 Available"}</Badge>
                </div>
              </div>
              <div style={{ fontSize: 12, color: theme.colors.textDim, marginTop: 8 }}>{p.phone || "No phone on file"}</div>
              <Button onClick={() => assign(p.id)} disabled={p.busy} style={{ width: "100%", marginTop: 12 }}>
                {p.busy ? "Busy" : "Assign"}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
