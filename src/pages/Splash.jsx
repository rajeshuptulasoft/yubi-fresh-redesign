import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "@/utils/theme";
import { Leaf, UtensilsCrossed, Sparkles } from "lucide-react";

const SPICE_EMOJI = ["🌶️", "🧂", "🌿", "🟡", "🟤", "✨"];
const FOOD_EMOJI = ["🍲", "🥘", "🍛", "🌽", "🥗", "🍞"];

export default function Splash() {
  const nav = useNavigate();
  const [leftHover, setLeftHover] = useState(false);
  const [rightHover, setRightHover] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => nav("/home"), 15000);
    return () => clearTimeout(t);
  }, [nav]);

  const halfBase = {
    flex: 1, position: "relative", overflow: "hidden",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    cursor: "pointer", transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
    padding: "40px 24px", textAlign: "center",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, background: "#FFFFFF",
      display: "flex", flexDirection: window.innerWidth < 768 ? "column" : "row",
    }}>
      {/* LEFT — Spices */}
      <div
        className="ss-slide-in-left"
        onClick={() => nav("/spices")}
        onMouseEnter={() => setLeftHover(true)}
        onMouseLeave={() => setLeftHover(false)}
        style={{
          ...halfBase,
          background: "linear-gradient(160deg, #F1F8E9 0%, #DCEDC8 100%)",
          transform: leftHover ? "scale(1.02)" : "scale(1)",
          boxShadow: leftHover ? "inset 0 0 0 4px rgba(76,175,80,0.5)" : "inset 0 0 0 0 transparent",
        }}
      >
        {SPICE_EMOJI.map((e, i) => (
          <div key={i} className="ss-float" style={{
            position: "absolute", fontSize: 42, opacity: 0.35,
            left: `${8 + i * 14}%`, top: `${10 + (i % 3) * 28}%`,
            animationDelay: `${i * 0.6}s`, animationDuration: `${6 + i}s`,
          }}>{e}</div>
        ))}
        <div style={{
          width: 130, height: 130, borderRadius: "50%",
          background: "linear-gradient(135deg, #4CAF50, #388E3C)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 20px 50px -10px rgba(56,142,60,0.5)", marginBottom: 28,
        }}>
          <Leaf size={64} color="#fff" strokeWidth={1.8} />
        </div>
        <h1 style={{
          fontFamily: theme.fonts.heading, fontSize: "clamp(36px, 5vw, 64px)",
          fontWeight: 700, color: "#1B5E20", margin: 0, lineHeight: 1.1,
        }}>Explore Our Spices</h1>
        <p style={{ fontSize: 18, color: "#558B2F", marginTop: 16, maxWidth: 380, lineHeight: 1.5 }}>
          Premium quality, farm to table
        </p>
      </div>

      {/* CENTER divider with YUBI badge */}
      <div className="ss-mobile-only" style={{ display: "none" }} />
      <div style={{
        position: window.innerWidth < 768 ? "absolute" : "relative",
        top: window.innerWidth < 768 ? "50%" : "auto",
        left: window.innerWidth < 768 ? "50%" : "auto",
        transform: window.innerWidth < 768 ? "translate(-50%, -50%)" : "none",
        width: window.innerWidth < 768 ? "auto" : 2,
        background: window.innerWidth < 768 ? "transparent" : "linear-gradient(180deg, transparent, #4CAF50, transparent)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5,
      }} className="ss-glow">
        <div style={{
          width: 88, height: 88, borderRadius: "50%",
          background: "#fff", border: `3px solid ${theme.colors.primary}`,
          boxShadow: "0 12px 40px rgba(76,175,80,0.35)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <Sparkles size={20} color={theme.colors.primary} />
          <div style={{ fontFamily: theme.fonts.heading, fontWeight: 800, fontSize: 22, color: theme.colors.primaryDark, lineHeight: 1, marginTop: 2 }}>
            YUBI
          </div>
        </div>
      </div>

      {/* RIGHT — Order Food */}
      <div
        className="ss-slide-in-right"
        onClick={() => nav("/menu")}
        onMouseEnter={() => setRightHover(true)}
        onMouseLeave={() => setRightHover(false)}
        style={{
          ...halfBase,
          background: "linear-gradient(160deg, #FFF8E1 0%, #FFECB3 100%)",
          transform: rightHover ? "scale(1.02)" : "scale(1)",
          boxShadow: rightHover ? "inset 0 0 0 4px rgba(255,111,0,0.5)" : "inset 0 0 0 0 transparent",
        }}
      >
        {FOOD_EMOJI.map((e, i) => (
          <div key={i} className="ss-float" style={{
            position: "absolute", fontSize: 42, opacity: 0.35,
            right: `${8 + i * 14}%`, top: `${10 + (i % 3) * 28}%`,
            animationDelay: `${i * 0.7}s`, animationDuration: `${6 + i}s`,
          }}>{e}</div>
        ))}
        <div style={{
          width: 130, height: 130, borderRadius: "50%",
          background: "linear-gradient(135deg, #FF6F00, #FF8F00)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 20px 50px -10px rgba(255,111,0,0.5)", marginBottom: 28,
        }}>
          <UtensilsCrossed size={60} color="#fff" strokeWidth={1.8} />
        </div>
        <h1 style={{
          fontFamily: theme.fonts.heading, fontSize: "clamp(36px, 5vw, 64px)",
          fontWeight: 700, color: "#E65100", margin: 0, lineHeight: 1.1,
        }}>Order Fresh Food</h1>
        <p style={{ fontSize: 18, color: "#BF360C", marginTop: 16, maxWidth: 380, lineHeight: 1.5 }}>
          Hot meals delivered to your door
        </p>
      </div>

      {/* Countdown progress bar */}
      <div style={{
        position: "absolute", left: 0, bottom: 0, height: 4,
        background: "rgba(76,175,80,0.15)", width: "100%", zIndex: 10,
      }}>
        <div style={{
          height: "100%", background: theme.gradient,
          animation: "ssCountdown 15s linear forwards",
        }} />
      </div>

      <div style={{
        position: "absolute", left: "50%", bottom: 18, transform: "translateX(-50%)",
        fontFamily: theme.fonts.mono, fontSize: 11, color: theme.colors.textDim,
        letterSpacing: 2, textTransform: "uppercase", zIndex: 10,
      }}>
        Auto-redirect in 15s · or click a side
      </div>
    </div>
  );
}
