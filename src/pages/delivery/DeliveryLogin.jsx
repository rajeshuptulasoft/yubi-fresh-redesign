import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deliveryPartners } from "../../data";
import { getDeliveryPartners, saveDeliveryPartners } from "../../utils/deliveryState";
import yubiLogo from "../../assets/yubi.png";

export default function DeliveryLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  const submit = (event) => {
    event.preventDefault();
    const partners = getDeliveryPartners();
    const partner = partners.find((item) => (
      item.email.toLowerCase() === email.trim().toLowerCase()
      && (item.password === password || (item.email === "yubidelivery@gmail.com" && password === "Yubifoods"))
    ));

    if (!partner) {
      setError("Invalid email or password");
      return;
    }

    if (!localStorage.getItem("yubiDeliveryPartners")) saveDeliveryPartners(deliveryPartners);
    localStorage.setItem("yubiUser", JSON.stringify({ role: "delivery", partnerId: partner.id, email: partner.email, name: partner.name }));
    nav("/delivery-partner/dashboard");
  };

  return <div style={page}><form onSubmit={submit} style={card}><img src={yubiLogo} alt="YUBI" style={{ height: 76, objectFit: "contain", margin: "0 auto 16px", display: "block" }} /><h1 style={{ ...title, fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>Delivery Partner Login</h1><input type="email" placeholder="Enter delivery email" value={email} onChange={(e) => setEmail(e.target.value)} style={input} /><input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} style={input} /><button style={button}>Login to Portal</button>{error && <p style={{ color: "#D32F2F", textAlign: "center", fontWeight: 800 }}>{error}</p>}</form></div>;
}

const page = { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at top left,#E8F5E9,#FFFFFF 45%,#F7FBF7)", padding: 24 };
const card = { maxWidth: 420, width: "100%", background: "#FFFFFF", border: "1px solid #D6E8D6", borderRadius: 24, padding: 34, boxShadow: "0 24px 70px rgba(26,46,26,0.16)" };
const title = { color: "#1A2E1A", textAlign: "center", margin: "0 0 24px", fontSize: 30 };
const input = { width: "100%", boxSizing: "border-box", padding: 14, border: "1px solid #D6E8D6", borderRadius: 12, marginBottom: 14, color: "#1A1A1A", background: "#FFFFFF", fontWeight: 700 };
const button = { width: "100%", background: "#4CAF50", color: "#FFFFFF", border: "none", borderRadius: 12, padding: 14, fontWeight: 900, cursor: "pointer" };
