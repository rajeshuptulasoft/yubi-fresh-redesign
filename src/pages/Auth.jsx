import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "@/utils/theme";
import { Button, Card, Input, GradientText } from "@/components/UI";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export default function Auth() {
  const { signIn, signUp } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState("signin");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", fullName: "", phone: "", role: "customer" });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "signup") {
      const { error } = await signUp(form);
      if (error) toast.error(error.message);
      else { toast.success("Welcome to Saffron & Sage!"); nav("/"); }
    } else {
      const { error } = await signIn({ email: form.email, password: form.password });
      if (error) toast.error(error.message);
      else { toast.success("Welcome back!"); nav("/"); }
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "calc(100vh - 80px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <Card className="ss-fade-up" style={{ maxWidth: 460, width: "100%", padding: 36 }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: theme.gradient, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: theme.shadow }}>
          <Sparkles color="#0D0D0D" />
        </div>
        <h1 style={{ fontFamily: theme.fonts.heading, fontSize: 32, textAlign: "center", margin: 0 }}>
          {mode === "signin" ? <>Welcome <GradientText>Back</GradientText></> : <>Join <GradientText>Saffron &amp; Sage</GradientText></>}
        </h1>
        <p style={{ textAlign: "center", color: theme.colors.textDim, marginTop: 8, marginBottom: 28 }}>
          {mode === "signin" ? "Sign in to continue" : "Create your account"}
        </p>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "signup" && (
            <>
              <Input placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
              <Input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <div>
                <label style={{ fontSize: 12, color: theme.colors.textDim, fontFamily: theme.fonts.mono, letterSpacing: 1 }}>I AM A</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 8 }}>
                  {[
                    { v: "customer", l: "Customer", e: "🛒" },
                    { v: "delivery_partner", l: "Delivery", e: "🛵" },
                    { v: "admin", l: "Admin", e: "⚙️" },
                  ].map((r) => (
                    <button key={r.v} type="button" onClick={() => setForm({ ...form, role: r.v })}
                      style={{
                        padding: "12px 8px", borderRadius: 10, cursor: "pointer",
                        border: form.role === r.v ? `1.5px solid ${theme.colors.accent}` : `1px solid ${theme.colors.border}`,
                        background: form.role === r.v ? "rgba(244,166,35,0.08)" : theme.colors.surfaceAlt,
                        color: "#fff", fontSize: 12, fontFamily: theme.fonts.body,
                      }}>
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{r.e}</div>{r.l}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          <Input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
          <Button type="submit" size="lg" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20, color: theme.colors.textDim, fontSize: 14 }}>
          {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            style={{ background: "none", border: "none", color: theme.colors.accent, cursor: "pointer", fontWeight: 600, fontFamily: theme.fonts.body }}>
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </Card>
    </div>
  );
}
