import { useEffect, useState } from "react";
import { Edit3, LogOut, Mail, Phone, Save, UserRound, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import yubiLogo from "../../assets/yubi.png";

const defaultProfile = { name: "YUBI Customer", email: "guest@yubi.com", phone: "+91 9439731691", address: "Bhubaneswar, Odisha" };

export default function Profile() {
  const { user, signOut } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("yubiProfile") || "null");
    setProfile({ ...defaultProfile, ...saved, name: saved?.name || user?.name || "YUBI Customer", email: saved?.email || user?.email || "guest@yubi.com" });
  }, [user]);

  const update = (key, value) => setProfile((old) => ({ ...old, [key]: value }));
  const save = () => { localStorage.setItem("yubiProfile", JSON.stringify(profile)); setEditing(false); };

  return <main style={{ minHeight: "calc(100vh - 72px)", background: "linear-gradient(135deg,#F7FBF7 0%,#FFFFFF 45%,#E8F5E9 100%)", padding: "42px 18px", color: "#1A1A1A" }}>
    <section style={{ maxWidth: 980, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24, alignItems: "stretch" }}>
      <div style={{ background: "#1A2E1A", borderRadius: 24, padding: 28, color: "#FFFFFF", boxShadow: "0 24px 70px rgba(26,46,26,0.20)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -60, top: -60, width: 180, height: 180, borderRadius: "50%", background: "rgba(76,175,80,0.24)" }} />
        <img src={yubiLogo} alt="YUBI" style={{ height: 68, background: "#FFFFFF", borderRadius: 16, padding: 8, position: "relative" }} />
        <div style={{ width: 108, height: 108, borderRadius: "50%", background: "linear-gradient(135deg,#4CAF50,#A5D6A7)", display: "grid", placeItems: "center", marginTop: 34, boxShadow: "0 18px 35px rgba(0,0,0,0.22)" }}><UserRound size={50} color="#FFFFFF" /></div>
        <h1 style={{ color: "#FFFFFF", fontSize: 34, margin: "22px 0 6px" }}>{profile.name}</h1>
        <p style={{ color: "#DDF4DD", margin: 0 }}>Your YUBI food, spices and grocery profile</p>
      </div>

      <div style={{ background: "#FFFFFF", borderRadius: 24, padding: 26, border: "1px solid #D6E8D6", boxShadow: "0 18px 45px rgba(26,46,26,0.10)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <h2 style={{ color: "#1A2E1A", margin: 0 }}>Profile Details</h2>
          {editing ? <div style={{ display: "flex", gap: 8 }}><button onClick={save} style={greenButton}><Save size={16} /> Save</button><button onClick={() => setEditing(false)} style={lightButton}><X size={16} /> Cancel</button></div> : <button onClick={() => setEditing(true)} style={greenButton}><Edit3 size={16} /> Edit</button>}
        </div>
        <Field icon={<UserRound size={18} />} label="Full Name" value={profile.name} editing={editing} onChange={(value) => update("name", value)} />
        <Field icon={<Mail size={18} />} label="Email" value={profile.email} editing={editing} onChange={(value) => update("email", value)} />
        <Field icon={<Phone size={18} />} label="Phone Number" value={profile.phone} editing={editing} onChange={(value) => update("phone", value)} />
        <Field icon={<UserRound size={18} />} label="Address" value={profile.address} editing={editing} onChange={(value) => update("address", value)} />
        <button onClick={signOut} style={{ marginTop: 20, width: "100%", background: "#EF4444", color: "#FFFFFF", border: "none", borderRadius: 12, padding: "13px 16px", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}><LogOut size={17} /> Logout</button>
      </div>
    </section>
  </main>;
}

function Field({ icon, label, value, editing, onChange }) {
  return <label style={{ display: "block", marginBottom: 14 }}><span style={{ display: "flex", alignItems: "center", gap: 8, color: "#1A2E1A", fontWeight: 900, marginBottom: 7 }}>{icon}{label}</span>{editing ? <input type="text" value={value} onChange={(event) => onChange(event.target.value)} style={inputStyle} /> : <div style={{ background: "#F7FBF7", border: "1px solid #D6E8D6", borderRadius: 12, padding: "13px 14px", color: "#1A1A1A", fontWeight: 700 }}>{value}</div>}</label>;
}

const inputStyle = { width: "100%", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #4CAF50", borderRadius: 12, padding: "12px 14px", color: "#1A1A1A", fontWeight: 700, outline: "none" };
const greenButton = { background: "#4CAF50", color: "#FFFFFF", border: "none", borderRadius: 10, padding: "10px 13px", fontWeight: 900, display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer" };
const lightButton = { background: "#F1F8F1", color: "#1A2E1A", border: "1px solid #D6E8D6", borderRadius: 10, padding: "10px 13px", fontWeight: 900, display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer" };
