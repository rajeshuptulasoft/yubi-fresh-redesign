import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { theme, fmtPrice } from "@/utils/theme";
import { Card, Loader, Badge, Button } from "@/components/UI";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, ShoppingBag, Truck, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    const load = () => supabase.from("orders").select("*").order("created_at", { ascending: false }).then(({ data }) => setOrders(data || []));
    load();
    const ch = supabase.channel("admin-orders").on("postgres_changes", { event: "*", schema: "public", table: "orders" }, load).subscribe();
    return () => supabase.removeChannel(ch);
  }, []);

  if (!orders) return <Loader />;
  const today = new Date().toDateString();
  const todays = orders.filter((o) => new Date(o.created_at).toDateString() === today);
  const revenue = todays.reduce((s, o) => s + Number(o.total), 0);
  const active = orders.filter((o) => !["delivered", "cancelled"].includes(o.status)).length;
  const pending = orders.filter((o) => !o.delivery_partner_id && o.status === "placed").length;

  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const day = d.toDateString();
    const dayOrders = orders.filter((o) => new Date(o.created_at).toDateString() === day);
    return { day: d.toLocaleDateString("en", { weekday: "short" }), orders: dayOrders.length, revenue: dayOrders.reduce((s, o) => s + Number(o.total), 0) };
  });

  const stats = [
    { label: "Orders Today", value: todays.length, icon: <ShoppingBag />, color: theme.colors.accent },
    { label: "Revenue Today", value: fmtPrice(revenue), icon: <TrendingUp />, color: theme.colors.success },
    { label: "Active Deliveries", value: active, icon: <Truck />, color: "#3b82f6" },
    { label: "Pending Assignments", value: pending, icon: <AlertCircle />, color: theme.colors.error },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "30px 24px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <h1 style={{ fontFamily: theme.fonts.heading, fontSize: 36, margin: 0 }}>Admin Dashboard</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <Link to="/admin/orders" style={{ textDecoration: "none" }}><Button variant="outline">All Orders</Button></Link>
          <Link to="/admin/products" style={{ textDecoration: "none" }}><Button>Manage Products</Button></Link>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
        {stats.map((s) => (
          <Card key={s.label} className="ss-fade-up">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}22`, color: s.color, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</div>
            </div>
            <div style={{ fontFamily: theme.fonts.heading, fontSize: 30, fontWeight: 700, marginTop: 14 }}>{s.value}</div>
            <div style={{ color: theme.colors.textDim, fontSize: 13, marginTop: 4 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="ss-cart-grid">
        <Card>
          <div style={{ fontFamily: theme.fonts.heading, fontWeight: 600, marginBottom: 16 }}>Orders — Last 7 Days</div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={last7}>
                <CartesianGrid stroke={theme.colors.border} strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke={theme.colors.textDim} />
                <YAxis stroke={theme.colors.textDim} />
                <Tooltip contentStyle={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: 8 }} />
                <Line type="monotone" dataKey="orders" stroke={theme.colors.accent} strokeWidth={3} dot={{ fill: theme.colors.accent, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <div style={{ fontFamily: theme.fonts.heading, fontWeight: 600, marginBottom: 16 }}>Revenue — Last 7 Days</div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={last7}>
                <CartesianGrid stroke={theme.colors.border} strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke={theme.colors.textDim} />
                <YAxis stroke={theme.colors.textDim} />
                <Tooltip contentStyle={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: 8 }} />
                <Bar dataKey="revenue" fill={theme.colors.accent} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card style={{ marginTop: 16 }}>
        <div style={{ fontFamily: theme.fonts.heading, fontWeight: 600, marginBottom: 12 }}>Recent Orders</div>
        {orders.slice(0, 6).map((o) => (
          <Link key={o.id} to={`/admin/assign/${o.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div className="ss-hover-lift" style={{ display: "flex", justifyContent: "space-between", padding: 12, borderRadius: 10, background: theme.colors.surfaceAlt, marginBottom: 8 }}>
              <div>
                <div style={{ fontWeight: 600 }}>{o.customer_name} <span style={{ fontFamily: theme.fonts.mono, fontSize: 11, color: theme.colors.textDim, marginLeft: 8 }}>#{o.id.slice(0, 8).toUpperCase()}</span></div>
                <div style={{ fontSize: 12, color: theme.colors.textDim, marginTop: 4 }}>{o.items.length} items · {o.payment_method.toUpperCase()}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: theme.fonts.mono, color: theme.colors.accent, fontWeight: 700 }}>{fmtPrice(o.total)}</div>
                <Badge color={o.status === "delivered" ? theme.colors.success : theme.colors.accent} style={{ marginTop: 4 }}>{o.status}</Badge>
              </div>
            </div>
          </Link>
        ))}
      </Card>
    </div>
  );
}
