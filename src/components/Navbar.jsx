import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { ShoppingCart, X, UserRound } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWindowSize } from "../hooks/useWindowSize";
import yubiLogo from "../assets/yubi.png";

const links = [
  { to: "/home", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/home/food", label: "Food" },
  { to: "/home/spices", label: "Spices" },
  { to: "/gallery", label: "Gallery" },
  { to: "/grocery", label: "Grocery" },
  { to: "/agro", label: "Agro Products" },
  { to: "/blog", label: "Blogs" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { count } = useCart();
  const { width } = useWindowSize();
  const isMobile = width <= 768;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const openAuth = (mode) => { setAuthMode(mode); setAuthOpen(true); setIsMenuOpen(false); };
  const navLinkStyle = ({ isActive }) => ({ color: isActive ? "#4CAF50" : "#000000", textDecoration: "none", fontWeight: 800, padding: "8px 2px", borderBottom: isActive ? "3px solid #4CAF50" : "3px solid transparent" });

  return <header style={{ position: "sticky", top: 0, zIndex: 1000, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(16px)", borderBottom: "1px solid #D6E8D6", boxShadow: "0 6px 20px rgba(26,46,26,0.06)" }}>
    <div style={{ maxWidth: 1320, margin: "0 auto", minHeight: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", gap: 18 }}>
      <Link to="/home" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}><img src={yubiLogo} alt="YUBI" style={{ height: 52, width: "auto", objectFit: "contain" }} /></Link>
      {!isMobile && <nav style={{ display: "flex", gap: 18, alignItems: "center" }}>{links.map((link) => <NavLink key={link.to} to={link.to} end={link.to === "/home"} style={navLinkStyle}>{link.label}</NavLink>)}</nav>}
      {!isMobile ? <div style={{ display: "flex", alignItems: "center", gap: 12 }}><CartLink count={count} /><button onClick={() => openAuth("login")} style={outlineButton}>Login</button><button onClick={() => openAuth("register")} style={greenButton}>Register</button></div> : <button onClick={() => setIsMenuOpen(true)} style={{ border: "none", background: "transparent", color: "#000000", fontSize: 30, cursor: "pointer", lineHeight: 1 }}>☰</button>}
    </div>

    {isMobile && isMenuOpen && <><div onClick={() => setIsMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.48)", zIndex: 1000 }} /><aside style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: Math.min(330, width - 34), background: "#FFFFFF", zIndex: 1001, boxShadow: "8px 0 28px rgba(0,0,0,0.22)", paddingTop: 18, overflowY: "auto" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 18px 18px", borderBottom: "1px solid #D6E8D6" }}><img src={yubiLogo} alt="YUBI" style={{ height: 50 }} /><button onClick={() => setIsMenuOpen(false)} style={{ border: "none", background: "transparent", color: "#000000", cursor: "pointer" }}><X size={28} /></button></div>{links.map((link) => <NavLink key={link.to} to={link.to} end={link.to === "/home"} onClick={() => setIsMenuOpen(false)} style={({ isActive }) => ({ display: "block", padding: 16, color: "#000000", fontSize: 18, fontWeight: 800, textDecoration: "none", borderLeft: isActive ? "5px solid #4CAF50" : "5px solid transparent", background: isActive ? "#F1F8F1" : "#FFFFFF" })}>{link.label}</NavLink>)}<div style={{ padding: 16, display: "grid", gap: 10 }}><Link to="/cart" onClick={() => setIsMenuOpen(false)} style={{ ...drawerButton, textAlign: "center", textDecoration: "none" }}>Cart ({count})</Link><button onClick={() => openAuth("login")} style={drawerButton}>Login</button><button onClick={() => openAuth("register")} style={{ ...drawerButton, background: "#4CAF50", color: "#FFFFFF" }}>Register</button></div></aside></>}
    {authOpen && <AuthModal mode={authMode} setMode={setAuthMode} onClose={() => setAuthOpen(false)} />}
  </header>;
}

function CartLink({ count }) {
  return <Link to="/cart" style={{ position: "relative", color: "#000000", width: 42, height: 42, display: "grid", placeItems: "center", border: "1px solid #D6E8D6", borderRadius: 12, background: "#FFFFFF" }}><ShoppingCart size={22} />{count > 0 && <span style={{ position: "absolute", top: -8, right: -8, background: "#4CAF50", color: "#FFFFFF", borderRadius: "50%", minWidth: 20, height: 20, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>{count}</span>}</Link>;
}

function AuthModal({ mode, setMode, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const update = (key, value) => setForm((old) => ({ ...old, [key]: value }));
  const submit = (event) => {
    event.preventDefault();
    if (mode === "register" && form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
    const user = { role: "customer", name: form.name || "YUBI Customer", email: form.email, phone: form.phone };
    localStorage.setItem("yubiUser", JSON.stringify(user));
    localStorage.setItem("yubiProfile", JSON.stringify(user));
    onClose();
  };
  return(
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 9999, // 👈 VERY IMPORTANT
      background: "rgba(0,0,0,0.55)",
      display: "flex", // 👈 CHANGE THIS
      alignItems: "center", // 👈 ADD
      justifyContent: "center", // 👈 ADD
      padding: 16
    }}
    onClick={onClose}
  >
    <form onSubmit={submit} onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 430, maxHeight: "calc(100vh - 36px)", overflowY: "auto", background: "#FFFFFF", borderRadius: 18, padding: 26, boxShadow: "0 24px 70px rgba(0,0,0,0.24)", border: "1px solid #D6E8D6" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}><img src={yubiLogo} alt="YUBI" style={{ height: 58 }} /><button type="button" onClick={onClose} style={{ border: "none", background: "#F1F8F1", borderRadius: 10, width: 38, height: 38, cursor: "pointer" }}><X size={20} /></button></div><h2 style={{ color: "#1A2E1A", margin: "0 0 16px", fontSize: 28 }}>{mode === "login" ? "Login" : "Register"}
      </h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button type="button" onClick={() => { setMode("login"); setError(""); }} style={tabStyle(mode === "login")}>Login</button><button type="button" onClick={() => { setMode("register"); setError(""); }} style={tabStyle(mode === "register")}>Register</button></div>{mode === "register" && <><Input placeholder="Name" value={form.name} onChange={(e) => update("name", e.target.value)} /><Input placeholder="Phone number" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </>}
        <Input type="email" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} required /><Input type="password" placeholder="Password" value={form.password} onChange={(e) => update("password", e.target.value)} required />{mode === "register" && <Input type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} required />}{error && <p style={{ color: "#D32F2F", margin: "4px 0 12px", fontWeight: 700 }}>{error}</p>}
        <button style={{ ...greenButton, width: "100%", padding: 14, fontSize: 16, marginTop: 6 }}>{mode === "login" ? "Login" : "Create Account"}
          </button>
          </form>
          </div>);
}

function Input(props) { return <input {...props} style={{ width: "100%", boxSizing: "border-box", padding: "13px 14px", border: "1px solid #D6E8D6", borderRadius: 10, color: "#1A1A1A", background: "#FFFFFF", marginBottom: 12, fontSize: 14 }} />; }
const greenButton = { background: "#4CAF50", color: "#FFFFFF", border: "none", borderRadius: 10, padding: "10px 16px", cursor: "pointer", fontWeight: 900 };
const outlineButton = { background: "#FFFFFF", color: "#1A2E1A", border: "1px solid #4CAF50", borderRadius: 10, padding: "10px 16px", cursor: "pointer", fontWeight: 900 };
const drawerButton = { border: "1px solid #D6E8D6", background: "#FFFFFF", color: "#1A1A1A", borderRadius: 10, padding: "12px 14px", fontWeight: 900, cursor: "pointer" };
const tabStyle = (active) => ({ flex: 1, border: "1px solid #4CAF50", background: active ? "#4CAF50" : "#FFFFFF", color: active ? "#FFFFFF" : "#1A2E1A", borderRadius: 10, padding: 10, cursor: "pointer", fontWeight: 900 });
