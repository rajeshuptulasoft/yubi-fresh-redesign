import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "@/utils/theme";
import { Button, Card, Input, GradientText } from "@/components/UI";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://www.yubi.co.in/api/";

export default function Auth() {
  const { signIn, signUp } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "", fullName: "", phone: "", role: "customer" });

  const handleUserLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    console.log("Starting login attempt with email:", form.email);
    console.log("POST request to:", `${BASE_URL}food/login`);
    
    try {
      const apiResponse = await fetch(`${BASE_URL}food/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const response = await apiResponse.json();
      
      if (apiResponse.ok && response?.token) {
        console.log("Login Success Response:", response);
        const userData = {
          id: response.id,
          email: response.email,
          name: response.name,
          phone: response.phone,
          token: response.token,
          role: response.role || "customer",
        };
        localStorage.setItem("yubiUser", JSON.stringify(userData));
        console.log("SUCCESS: User login successful");
        console.log("User Data:", userData);
        console.log("Token stored in localStorage");
        
        toast.success(`Welcome back, ${response.name}!`);
        
        // Clear form and error on success
        setForm({ email: "", password: "", fullName: "", phone: "", role: "customer" });
        setError("");
        setLoading(false);
        
        // Navigate to home after successful login
        setTimeout(() => {
          nav("/home");
        }, 1000);
      } else {
        console.log("Login Error Response:", response);
        throw new Error("No token received from server");
      }
    } catch (error) {
      console.log("Login Error:", error);
      
      let errorMessage = error.message || "Login failed. Please check your credentials.";

      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (mode === "signin") {
      // Use axios-based API for user login
      await handleUserLogin(e);
    } else {
      // Keep signup with existing auth context (optional)
      try {
        const { error } = await signUp(form);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Account created successfully! Please sign in.");
          setMode("signin");
          setForm({ ...form, password: "" });
        }
      } catch (err) {
        toast.error("Sign up failed. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }
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
          <Input 
            type="email" 
            placeholder="Email" 
            value={form.email} 
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              setError("");
            }} 
            required 
          />
          <Input 
            type="password" 
            placeholder="Password (min 6 characters)" 
            value={form.password} 
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
              setError("");
            }} 
            required 
            minLength={6} 
          />
          {error && mode === "signin" && (
            <div style={{
              padding: 12,
              borderRadius: 8,
              background: "rgba(220, 38, 38, 0.1)",
              border: "1px solid #dc2626",
              color: "#dc2626",
              fontSize: 13,
              fontFamily: theme.fonts.body,
              marginTop: 8
            }}>
              ❌ {error}
            </div>
          )}
          <Button type="submit" size="lg" disabled={loading} style={{ marginTop: error ? 12 : 8 }}>
            {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20, color: theme.colors.textDim, fontSize: 14 }}>
          {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
          <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}
            style={{ background: "none", border: "none", color: theme.colors.accent, cursor: "pointer", fontWeight: 600, fontFamily: theme.fonts.body }}>
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </Card>
    </div>
  );
}
