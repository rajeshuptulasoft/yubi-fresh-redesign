import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Clock, IndianRupee, PackageCheck, ShoppingBag, Truck } from "lucide-react";
import { orders } from "../../data";

const text = "#1A1A1A";
const green = "#4CAF50";
const badge = { Pending: "#FEF3C7", Preparing: "#DBEAFE", "Out for Delivery": "#FFEDD5", Delivered: "#DCFCE7", Cancelled: "#FEE2E2" };

export function StatusBadge({ status }) { return <span style={{ background: badge[status] || "#EEEEEE", color: text, padding: "5px 10px", borderRadius: 999, fontSize: 12, fontWeight: 800 }}>{status}</span>; }
export function OrdersTable({ rows = orders }) {
  const [selected, setSelected] = useState(null);
  return <><div className="admin-table-wrap"><table className="admin-table"><thead><tr>{["Order ID", "Customer", "Type", "Amount", "Status", "Payment", "Action"].map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((o) => <tr key={o.id}><td data-label="Order ID">{o.id}</td><td data-label="Customer">{o.customerName}</td><td data-label="Type">{o.orderType}</td><td data-label="Amount">₹{o.total}</td><td data-label="Status"><StatusBadge status={o.orderStatus} /></td><td data-label="Payment">{o.paymentMethod}</td><td data-label="Action"><button onClick={() => setSelected(o)} className="admin-view-btn">View</button></td></tr>)}</tbody></table></div>
  {selected && <div className="admin-modal-backdrop" onClick={() => setSelected(null)}><div className="admin-modal" onClick={(event) => event.stopPropagation()}><div className="admin-modal__head"><h3 className="admin-modal__title">Order Information</h3></div><div className="admin-modal__body"><div className="admin-modal__row"><span className="admin-modal__label">Order ID</span><span className="admin-modal__value">{selected.id}</span></div><div className="admin-modal__row"><span className="admin-modal__label">Customer</span><span className="admin-modal__value">{selected.customerName}</span></div><div className="admin-modal__row"><span className="admin-modal__label">Phone</span><span className="admin-modal__value">{selected.customerPhone}</span></div><div className="admin-modal__row"><span className="admin-modal__label">Address</span><span className="admin-modal__value">{selected.customerAddress}</span></div><div className="admin-modal__row"><span className="admin-modal__label">Type</span><span className="admin-modal__value">{selected.orderType}</span></div><div className="admin-modal__row"><span className="admin-modal__label">Items</span><span className="admin-modal__value">{selected.items.map((item) => `${item.name} x ${item.quantity}`).join(", ")}</span></div><div className="admin-modal__row"><span className="admin-modal__label">Total</span><span className="admin-modal__value">₹{selected.total}</span></div><div className="admin-modal__row"><span className="admin-modal__label">Status</span><span className="admin-modal__value">{selected.orderStatus}</span></div></div><div className="admin-modal__foot"><button onClick={() => setSelected(null)} className="admin-modal__close">Close</button></div></div></div>}
  </>;
}

export default function AdminDashboard() {
  const today = "2026-04-30";
  const todays = orders.filter((o) => o.createdAt.startsWith(today));
  const used = todays.length ? todays : orders;
  const stats = [
    [ShoppingBag, "Total Orders Today", used.length],
    [IndianRupee, "Revenue Today", `₹${used.reduce((sum, order) => sum + order.total, 0)}`],
    [Truck, "Active Deliveries", orders.filter((order) => order.orderStatus === "Out for Delivery").length],
    [Clock, "Pending Orders", orders.filter((order) => ["Pending", "Preparing"].includes(order.orderStatus)).length],
  ];
  const last7 = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"].map((day, i) => ({ day, orders: [3, 1, 2, 1, 1, 1, 2][i] }));
  const pie = ["food", "spices", "grocery"].map((type) => ({ name: type, value: orders.filter((order) => order.orderType === type).length }));
  return <div><h1 style={{...title, fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif"}}>Admin Dashboard</h1><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 16, marginBottom: 24 }}>{stats.map(([Icon, label, value]) => <div key={label} style={card}><div style={iconWrap}><Icon size={25} /></div><h2 style={{ color: "#1A2E1A", margin: "14px 0 4px", fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>{value}</h2><p style={{ color: text, margin: 0, fontWeight: 700 }}>{label}</p></div>)}</div><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16, marginBottom: 24 }}><ChartCard title="Orders Last 7 Days"><ResponsiveContainer width="100%" height={260}><BarChart data={last7}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Bar dataKey="orders" fill={green} radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard><ChartCard title="Order Types"><ResponsiveContainer width="100%" height={260}><PieChart><Pie data={pie} dataKey="value" nameKey="name" outerRadius={90} label>{["#4CAF50", "#FF6F00", "#2196F3"].map((c) => <Cell key={c} fill={c} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></ChartCard></div><h2 style={subTitle}><PackageCheck size={22} /> Recent Orders</h2><OrdersTable rows={orders.slice(0, 6)} /></div>;
}
export function ChartCard({ title, children }) { return <div style={{ background: "#FFFFFF", borderRadius: 14, padding: 24, boxShadow: "0 12px 34px rgba(26,46,26,0.08)", border: "1px solid #D6E8D6" }}><h3 style={{ color: "#1A2E1A", marginTop: 0 }}>{title}</h3>{children}</div>; }
const card = { background: "#FFFFFF", borderLeft: "5px solid #4CAF50", borderRadius: 16, padding: 20, boxShadow: "0 12px 34px rgba(26,46,26,0.08)", color: text, borderTop: "1px solid #D6E8D6", borderRight: "1px solid #D6E8D6", borderBottom: "1px solid #D6E8D6" };
const iconWrap = { width: 48, height: 48, borderRadius: 14, display: "grid", placeItems: "center", background: "#E8F5E9", color: "#4CAF50" };
export const title = { color: "#1A2E1A", marginTop: 0, fontSize: 34, display: "flex", alignItems: "center", gap: 8 };
export const subTitle = { color: "#1A2E1A", display: "flex", alignItems: "center", gap: 8 };
