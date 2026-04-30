import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { ClipboardList, Home, Menu, Package, UserRound } from "lucide-react";
import { useWindowSize } from "../../hooks/useWindowSize";
import yubiLogo from "../../assets/yubi.png";

const items = [[Home, "Dashboard", "/delivery-partner/dashboard"], [Package, "Active", "/delivery-partner/active"], [ClipboardList, "History", "/delivery-partner/history"], [UserRound, "Profile", "/delivery-partner/profile"]];

export default function DeliveryLayout() {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const [isOpen, setIsOpen] = useState(true);
  const [online, setOnline] = useState(true);
  const sideWidth = isOpen ? 240 : 72;
  return <div style={{ color: "#1A1A1A" }}>
    <header style={{ background: "linear-gradient(135deg,#388E3C,#4CAF50)", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, boxShadow: "0 10px 30px rgba(26,46,26,0.18)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>{!isMobile && <button onClick={() => setIsOpen(!isOpen)} style={hamburger}><Menu size={23} /></button>}<img src={yubiLogo} alt="YUBI Delivery" style={{ height: 46, background: "#FFFFFF", borderRadius: 12, padding: 4 }} /><strong style={{ color: "#FFFFFF", fontSize: 18 }}>Delivery</strong></div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 12, height: 12, borderRadius: "50%", background: online ? "#7CFC00" : "#BBBBBB" }} /><span style={{ color: "#FFFFFF", fontSize: 13 }}>{online ? "Online" : "Offline"}</span><button onClick={() => setOnline(!online)} style={{ width: 44, height: 24, borderRadius: 20, border: "none", background: online ? "#1A2E1A" : "#888888", cursor: "pointer" }} /><span style={{ color: "#FFFFFF", fontWeight: 800 }}>Suresh</span></div>
    </header>
    {!isMobile && <aside style={{ width: sideWidth, position: "fixed", top: 68, left: 0, height: "calc(100vh - 68px)", background: "#FFFFFF", borderRight: "2px solid #D6E8D6", paddingTop: 16, boxShadow: "8px 0 24px rgba(26,46,26,0.08)", transition: "width .3s ease" }}>{items.map(([Icon, label, route]) => <NavLink key={route} to={route} title={label} style={({ isActive }) => ({ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", margin: "4px 10px", borderRadius: 12, color: isActive ? "#4CAF50" : "#1A2E1A", background: isActive ? "#E8F5E9" : "#FFFFFF", textDecoration: "none", fontWeight: 800 })}><Icon size={20} />{isOpen && <span>{label}</span>}</NavLink>)}</aside>}
    <main style={{ marginLeft: isMobile ? 0 : sideWidth, marginTop: 68, marginBottom: isMobile ? 68 : 0, padding: isMobile ? 16 : 28, minHeight: "calc(100vh - 68px)", background: "linear-gradient(135deg,#F9FBF9,#FFFFFF)" }}><Outlet /></main>
    {isMobile && <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 68, background: "#FFFFFF", borderTop: "2px solid #D6E8D6", display: "flex", justifyContent: "space-around", alignItems: "center", zIndex: 1000 }}>{items.map(([Icon, label, route]) => <NavLink key={route} to={route} style={({ isActive }) => ({ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: isActive ? "#4CAF50" : "#888888", textDecoration: "none", fontSize: 11, fontWeight: 800 })}><Icon size={22} />{label}</NavLink>)}</nav>}
  </div>;
}
const hamburger = { background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.25)", color: "#FFFFFF", width: 42, height: 42, borderRadius: 12, cursor: "pointer", display: "grid", placeItems: "center" };
