import { useState, useEffect } from "react";
import { theme } from "@/utils/theme";
import { Card, Button, Input } from "@/components/UI";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Profile() {
  const { user, profile, role, refreshProfile } = useAuth();
  const [form, setForm] = useState({ full_name: "", phone: "", address: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setForm({ full_name: profile.full_name || "", phone: profile.phone || "", address: profile.address || "" });
  }, [profile]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").update(form).eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else { toast.success("Profile updated"); refreshProfile(); }
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "30px 24px 60px" }}>
      <h1 style={{ fontFamily: theme.fonts.heading, fontSize: "clamp(32px,5vw,42px)", marginBottom: 20 }}>Your Profile</h1>
      <Card>
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
          <div style={{ width: 70, height: 70, borderRadius: "50%", background: theme.gradient, color: "#0D0D0D", fontWeight: 800, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {(form.full_name || user?.email || "U")[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17 }}>{user?.email}</div>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: 11, color: theme.colors.accent, textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>{role}</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Input placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input placeholder="Default delivery address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <Button onClick={save} disabled={saving} size="lg">{saving ? "Saving..." : "Save Changes"}</Button>
        </div>
      </Card>
    </div>
  );
}
