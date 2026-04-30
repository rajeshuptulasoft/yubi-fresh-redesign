import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { theme } from "@/utils/theme";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { Bell, ShoppingBag, Menu, X, User, LogOut, LayoutDashboard, Bike, Sparkles } from "lucide-react";

export default function Navbar() {
  const { count } = useCart();
  const { user, role, signOut } = useAuth();
  const { unread, notifications, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const nav = useNavigate();

  const links = [
    { to: "/", label: "Home" },
    { to: "/menu", label: "Menu" },
    { to: "/spices", label: "Spice Store" },
    { to: "/orders", label: "Orders" },
  ];

  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(13,13,13,0.7)",
        backdropFilter: "blur(20px) saturate(180%)",
        borderBottom: `1px solid ${theme.colors.border}`,
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", gap: 24 }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, background: theme.gradient,
            display: "flex", alignItems: "center", justifyContent: "center", boxShadow: theme.shadow,
          }}>
            <Sparkles size={20} color="#0D0D0D" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: theme.fonts.heading, fontWeight: 800, fontSize: 20, color: "#fff", lineHeight: 1 }}>
              Saffron <span style={{ color: theme.colors.accent }}>&amp;</span> Sage
            </div>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: 9, color: theme.colors.textDim, letterSpacing: 2 }}>PREMIUM SPICES · FOOD</div>
          </div>
        </Link>

        <nav className="ss-desktop-nav" style={{ display: "flex", gap: 4, marginLeft: 32 }}>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"}
              style={({ isActive }) => ({
                padding: "10px 16px", borderRadius: theme.radius.sm, textDecoration: "none",
                color: isActive ? theme.colors.accent : theme.colors.text,
                fontWeight: 500, fontSize: 15, transition: theme.transition,
                background: isActive ? "rgba(244,166,35,0.08)" : "transparent",
              })}
            >{l.label}</NavLink>
          ))}
        </nav>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          {user && (
            <div style={{ position: "relative" }}>
              <button onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) markAllRead(); }}
                style={{ position: "relative", width: 42, height: 42, borderRadius: 12, background: theme.colors.surface, border: `1px solid ${theme.colors.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: theme.colors.text }}>
                <Bell size={18} />
                {unread > 0 && (
                  <span className="ss-pulse-ring ss-badge-pop" style={{
                    position: "absolute", top: -4, right: -4, minWidth: 20, height: 20, borderRadius: 10,
                    background: theme.gradient, color: "#0D0D0D", fontSize: 10, fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6px",
                  }}>{unread}</span>
                )}
              </button>
              {notifOpen && (
                <div className="ss-fade-up" style={{
                  position: "absolute", top: 50, right: 0, width: 340, maxHeight: 420, overflow: "auto",
                  background: "rgba(20,20,20,0.98)", backdropFilter: "blur(20px)",
                  borderRadius: theme.radius.lg, border: `1px solid ${theme.colors.border}`,
                  padding: 12, boxShadow: theme.shadowSoft,
                }}>
                  <div style={{ fontFamily: theme.fonts.heading, fontSize: 18, padding: "8px 12px 12px" }}>Notifications</div>
                  {notifications.length === 0 && <div style={{ padding: 20, textAlign: "center", color: theme.colors.textDim }}>No notifications yet</div>}
                  {notifications.map((n) => (
                    <div key={n.id} style={{ padding: 12, borderRadius: 10, background: theme.colors.surfaceAlt, marginBottom: 8 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{n.title}</div>
                      <div style={{ fontSize: 13, color: theme.colors.textDim, marginTop: 2 }}>{n.message}</div>
                      <div style={{ fontSize: 10, fontFamily: theme.fonts.mono, color: theme.colors.textDim, marginTop: 6 }}>
                        {new Date(n.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <Link to="/cart" style={{ position: "relative", width: 42, height: 42, borderRadius: 12, background: theme.colors.surface, border: `1px solid ${theme.colors.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: theme.colors.text, textDecoration: "none" }}>
            <ShoppingBag size={18} />
            {count > 0 && (
              <span key={count} className="ss-badge-pop" style={{
                position: "absolute", top: -4, right: -4, minWidth: 20, height: 20, borderRadius: 10,
                background: theme.gradient, color: "#0D0D0D", fontSize: 10, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6px",
              }}>{count}</span>
            )}
          </Link>

          {user ? (
            <div style={{ position: "relative" }}>
              <button onClick={() => setUserOpen(!userOpen)} style={{
                width: 42, height: 42, borderRadius: 12, background: theme.gradient,
                color: "#0D0D0D", fontWeight: 700, border: "none", cursor: "pointer",
              }}>
                {(user.email || "U")[0].toUpperCase()}
              </button>
              {userOpen && (
                <div className="ss-fade-up" style={{
                  position: "absolute", top: 50, right: 0, width: 240,
                  background: "rgba(20,20,20,0.98)", backdropFilter: "blur(20px)",
                  borderRadius: theme.radius.lg, border: `1px solid ${theme.colors.border}`,
                  padding: 8,
                }}>
                  <div style={{ padding: 12, borderBottom: `1px solid ${theme.colors.border}` }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{user.email}</div>
                    <div style={{ fontFamily: theme.fonts.mono, fontSize: 10, color: theme.colors.accent, textTransform: "uppercase", marginTop: 4 }}>{role || "customer"}</div>
                  </div>
                  <MenuItem icon={<User size={16} />} label="Profile" onClick={() => { setUserOpen(false); nav("/profile"); }} />
                  {role === "admin" && <MenuItem icon={<LayoutDashboard size={16} />} label="Admin Dashboard" onClick={() => { setUserOpen(false); nav("/admin"); }} />}
                  {role === "delivery_partner" && <MenuItem icon={<Bike size={16} />} label="Delivery Dashboard" onClick={() => { setUserOpen(false); nav("/delivery"); }} />}
                  <MenuItem icon={<LogOut size={16} />} label="Sign Out" onClick={signOut} danger />
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" style={{
              padding: "10px 20px", borderRadius: 12, background: theme.gradient, color: "#0D0D0D",
              fontWeight: 700, textDecoration: "none", boxShadow: theme.shadow,
            }}>Sign In</Link>
          )}

          <button onClick={() => setOpen(!open)} className="ss-mobile-menu" style={{ display: "none", width: 42, height: 42, borderRadius: 12, background: theme.colors.surface, border: `1px solid ${theme.colors.border}`, color: "#fff" }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="ss-fade-in" style={{ borderTop: `1px solid ${theme.colors.border}`, padding: 16 }}>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} onClick={() => setOpen(false)}
              style={({ isActive }) => ({
                display: "block", padding: 14, borderRadius: 10,
                color: isActive ? theme.colors.accent : "#fff", textDecoration: "none", fontSize: 16, fontWeight: 500,
                background: isActive ? "rgba(244,166,35,0.08)" : "transparent",
              })}
            >{l.label}</NavLink>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .ss-desktop-nav { display: none !important; }
          .ss-mobile-menu { display: flex !important; align-items: center; justify-content: center; }
        }
      `}</style>
    </header>
  );
}

function MenuItem({ icon, label, onClick, danger }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", display: "flex", alignItems: "center", gap: 10, padding: 12,
      background: "transparent", border: "none", borderRadius: 8, color: danger ? theme.colors.error : "#fff",
      cursor: "pointer", fontSize: 14, fontFamily: theme.fonts.body, textAlign: "left",
    }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {icon}{label}
    </button>
  );
}
