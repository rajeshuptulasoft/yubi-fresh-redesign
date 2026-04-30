import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { theme, fmtPrice } from "@/utils/theme";
import { Card, Loader, Badge, Button, Input } from "@/components/UI";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState(null);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    const load = () => supabase.from("orders").select("*").order("created_at", { ascending: false }).then(({ data }) => setOrders(data || []));
    load();
    const ch = supabase.channel("admin-all-orders").on("postgres_changes", { event: "*", schema: "public", table: "orders" }, load).subscribe();
    return () => supabase.removeChannel(ch);
  }, []);

  if (!orders) return <Loader />;

  const filtered = orders.filter((o) => {
    if (filter === "pending" && o.delivery_partner_id) return false;
    if (filter === "in_progress" && !["preparing", "picked_up", "on_the_way", "reached"].includes(o.status)) return false;
    if (filter === "delivered" && o.status !== "delivered") return false;
    if (q && !o.customer_name.toLowerCase().includes(q.toLowerCase()) && !o.id.includes(q.toLowerCase())) return false;
    return true;
  });

  const sc = (s) => s === "delivered" ? theme.colors.success : s === "cancelled" ? theme.colors.error : s === "placed" ? "#eab308" : "#3b82f6";

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "30px 24px 60px" }}>
      <h1 style={{ fontFamily: theme.fonts.heading, fontSize: 36, marginBottom: 20 }}>All Orders</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, marginBottom: 16 }}>
        <div style={{ position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: theme.colors.textDim }} />
          <Input placeholder="Search by name or order ID..." value={q} onChange={(e) => setQ(e.target.value)} style={{ paddingLeft: 42 }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["all", "pending", "in_progress", "delivered"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "8px 16px", borderRadius: 999, cursor: "pointer", textTransform: "capitalize",
            background: filter === f ? theme.gradient : theme.colors.surface,
            color: filter === f ? "#0D0D0D" : "#fff", fontWeight: 600,
            border: filter === f ? "none" : `1px solid ${theme.colors.border}`, fontFamily: theme.fonts.body, fontSize: 13,
          }}>{f.replace("_", " ")}</button>
        ))}
      </div>

      <Card style={{ padding: 0, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
          <thead>
            <tr style={{ background: theme.colors.surfaceAlt, fontSize: 11, fontFamily: theme.fonts.mono, color: theme.colors.textDim, letterSpacing: 1 }}>
              {["ORDER", "CUSTOMER", "ITEMS", "TOTAL", "PAYMENT", "STATUS", "TIME", ""].map((h) => (
                <th key={h} style={{ padding: 14, textAlign: "left", fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} style={{ borderTop: `1px solid ${theme.colors.border}` }}>
                <td style={td}><span style={{ fontFamily: theme.fonts.mono, fontSize: 12 }}>#{o.id.slice(0, 8).toUpperCase()}</span></td>
                <td style={td}>{o.customer_name}</td>
                <td style={td}>{o.items.length} items</td>
                <td style={{ ...td, fontFamily: theme.fonts.mono, color: theme.colors.accent, fontWeight: 700 }}>{fmtPrice(o.total)}</td>
                <td style={td}><span style={{ fontSize: 11, fontFamily: theme.fonts.mono }}>{o.payment_method.toUpperCase()}</span></td>
                <td style={td}><Badge color={sc(o.status)}>{o.status.replace("_", " ")}</Badge></td>
                <td style={{ ...td, fontSize: 12, color: theme.colors.textDim }}>{new Date(o.created_at).toLocaleString()}</td>
                <td style={td}>
                  {!o.delivery_partner_id ? (
                    <Link to={`/admin/assign/${o.id}`} style={{ textDecoration: "none" }}><Button size="sm">Assign</Button></Link>
                  ) : <Badge color={theme.colors.success}>Assigned</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

const td = { padding: 14, fontSize: 13 };
