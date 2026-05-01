import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Cart() {
  const { items, updateQty, removeItem, subtotal, discount, deliveryFee, tax, total } = useCart();
  const { user, addresses, addAddress, setDefaultAddress, removeAddress, openAuthModal } = useAuth();
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const defaultAddress = addresses.find((address) => address.isDefault) || addresses[0];

  useEffect(() => {
    if (!user) return;
    setSelectedAddressId(defaultAddress?.id || "");
  }, [defaultAddress?.id, user]);

  if (!user) {
    return <div style={lockedStyle}>
      <div style={{ fontSize: 80 }}>Cart</div>
      <h1 style={{ color: "#1A2E1A", fontSize: 28, fontWeight: 800, margin: 0 }}>Your cart is waiting!</h1>
      <p style={{ color: "#666666", fontSize: 16, textAlign: "center", maxWidth: 380 }}>Please login or register to view your cart and place orders.</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}><button onClick={() => openAuthModal("login")} style={{ ...outlineButton, width: 180 }}>Login</button><button onClick={() => openAuthModal("register")} style={{ ...primaryButton, width: 180 }}>Register</button></div>
    </div>;
  }

  if (items.length === 0) {
    return <div style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px", textAlign: "center", color: "#1A1A1A" }}><div style={{ fontSize: 70, marginBottom: 20 }}>Cart</div><h1 style={{ color: "#1A2E1A", fontSize: 34 }}>Your cart is empty</h1><p style={{ color: "#666666", marginBottom: 28 }}>Discover dishes and spices, add to cart, and enjoy.</p><Link to="/menu" style={{ ...primaryButton, textDecoration: "none", display: "inline-flex" }}>Browse Menu</Link></div>;
  }

  return <div style={{ maxWidth: 1200, margin: "0 auto", padding: "30px 24px 60px", color: "#1A1A1A" }}>
    <h1 style={{ color: "#1A2E1A", fontSize: "clamp(32px,5vw,44px)", marginBottom: 24 }}>Your Cart</h1>
    <div className="cart-address-grid" style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((item) => <div key={item.key} style={cartItemStyle}>
          <img src={item.image} alt={item.name} style={{ width: 76, height: 76, borderRadius: 14, objectFit: "cover", background: "#F1F8F1" }} />
          <div style={{ flex: 1 }}><div style={{ color: "#1A2E1A", fontSize: 17, fontWeight: 800 }}>{item.name}</div>{item.variant && <div style={{ color: "#4CAF50", fontSize: 12, marginTop: 2 }}>{item.variant}</div>}<div style={{ color: "#4CAF50", fontWeight: 800, marginTop: 6 }}>Rs {item.price}</div></div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F1F8F1", padding: 4, borderRadius: 10, border: "1px solid #E8F5E9" }}><button onClick={() => updateQty(item.key, item.qty - 1)} style={qtyButton}><Minus size={14} /></button><span style={{ minWidth: 24, textAlign: "center", fontWeight: 800 }}>{item.qty}</span><button onClick={() => updateQty(item.key, item.qty + 1)} style={qtyButton}><Plus size={14} /></button></div>
          <button onClick={() => removeItem(item.key)} style={{ width: 40, height: 40, borderRadius: 10, background: "#FFFFFF", border: "1px solid #FECACA", color: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 size={16} /></button>
        </div>)}
      </div>
      <div>
        <AddressSection addresses={addresses} selectedAddressId={selectedAddressId} setSelectedAddressId={setSelectedAddressId} setDefaultAddress={setDefaultAddress} removeAddress={removeAddress} onAdd={() => setShowAddressModal(true)} />
        <div style={sideCardStyle}>
          <h2 style={{ color: "#1A2E1A", fontSize: 18, margin: "0 0 16px" }}>Order Summary</h2>
          <DefaultAddressSummary address={defaultAddress} onAdd={() => setShowAddressModal(true)} />
          <Row label="Subtotal" value={`Rs ${subtotal}`} />
          <Row label="Discount" value={`-Rs ${discount}`} color="#2E7D32" />
          <Row label="Delivery" value={deliveryFee === 0 ? "FREE" : `Rs ${deliveryFee}`} />
          <Row label="Tax (5%)" value={`Rs ${tax}`} />
          <div style={{ height: 1, background: "#E8F5E9", margin: "14px 0" }} />
          <Row label="Total" value={`Rs ${total}`} big />
          <Link to="/checkout" state={{ selectedAddressId: defaultAddress?.id || selectedAddressId }} style={{ ...primaryButton, textDecoration: "none", width: "100%", marginTop: 18, display: "flex", justifyContent: "center" }}>Proceed to Checkout</Link>
        </div>
      </div>
    </div>
    {showAddressModal && <AddressModal addAddress={addAddress} onClose={() => setShowAddressModal(false)} />}
    <style>{`@media(max-width:900px){.cart-address-grid{grid-template-columns:1fr !important}}`}</style>
  </div>;
}

function AddressSection({ addresses, selectedAddressId, setSelectedAddressId, setDefaultAddress, removeAddress, onAdd }) {
  const makeDefault = (addressId) => {
    setDefaultAddress(addressId);
    setSelectedAddressId(addressId);
  };

  return <div style={sideCardStyle}>
    <h2 style={{ color: "#1A2E1A", fontSize: 18, fontWeight: 800, margin: "0 0 16px" }}>Deliver To</h2>
    {addresses.length ? addresses.map((address) => <div key={address.id} onClick={() => setSelectedAddressId(address.id)} style={{ ...addressCardStyle, border: selectedAddressId === address.id ? "2px solid #4CAF50" : "2px solid #E8F5E9", background: selectedAddressId === address.id ? "#F1F8F1" : "#FFFFFF" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><div style={{ color: "#1A2E1A", fontWeight: 800 }}><span style={{ display: "inline-flex", width: 16, height: 16, borderRadius: "50%", border: "2px solid #4CAF50", marginRight: 8, verticalAlign: "middle", background: selectedAddressId === address.id ? "#4CAF50" : "#FFFFFF" }} />Address</div>{address.isDefault && <span style={defaultBadge}>Default</span>}</div>
      <p style={{ color: "#1A1A1A", fontSize: 14, lineHeight: 1.5, margin: "10px 0" }}>{formatAddress(address)}</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><button disabled={address.isDefault} onClick={(event) => { event.stopPropagation(); makeDefault(address.id); }} style={address.isDefault ? defaultActionButton : setDefaultButton}>{address.isDefault ? "Default Address" : "Set Default Address"}</button><button onClick={(event) => { event.stopPropagation(); if (confirm("Delete this address?")) removeAddress(address.id); }} style={removeAddressButton}>Delete Address</button></div>
    </div>) : <div style={{ textAlign: "center", color: "#888888", padding: "20px 0" }}><div>No saved addresses</div></div>}
    <button onClick={onAdd} onMouseEnter={(event) => (event.currentTarget.style.background = "#F1F8F1")} onMouseLeave={(event) => (event.currentTarget.style.background = "transparent")} style={addAddressButton}>+ Add Address</button>
  </div>;
}

function DefaultAddressSummary({ address, onAdd }) {
  return <div style={summaryAddressBox}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <strong style={{ color: "#1A2E1A", fontSize: 14 }}>Default Delivery Address</strong>
      {address && <span style={defaultBadge}>Default</span>}
    </div>
    {address ? <p style={{ color: "#1A1A1A", fontSize: 13, lineHeight: 1.5, margin: 0 }}>{formatAddress(address)}</p> : <div><p style={{ color: "#888888", fontSize: 13, margin: "0 0 10px" }}>No default address selected.</p><button onClick={onAdd} style={{ ...setDefaultButton, width: "100%" }}>Add Address</button></div>}
  </div>;
}

function AddressModal({ addAddress, onClose }) {
  const [addressForm, setAddressForm] = useState({ houseNo: "", street: "", city: "", state: "", pincode: "", landmark: "", isDefault: false });
  const [errors, setErrors] = useState({});
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState("");
  const autoFilled = Boolean(addressForm.city && addressForm.state);

  useEffect(() => {
    const pincode = addressForm.pincode;
    if (!/^\d{6}$/.test(pincode)) return;
    setPincodeLoading(true);
    fetch("https://api.postalpincode.in/pincode/" + pincode).then((response) => response.json()).then((data) => {
      if (data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        setAddressForm((prev) => ({ ...prev, city: postOffice.District, state: postOffice.State }));
        setPincodeError("");
      } else {
        setPincodeError("Invalid pincode. Please check.");
      }
    }).catch(() => setPincodeError("Invalid pincode. Please check.")).finally(() => setPincodeLoading(false));
  }, [addressForm.pincode]);

  const save = () => {
    const nextErrors = {};
    if (!addressForm.houseNo) nextErrors.houseNo = "House / flat number is required";
    if (!addressForm.street) nextErrors.street = "Street is required";
    if (!/^\d{6}$/.test(addressForm.pincode)) nextErrors.pincode = "Invalid pincode. Please check.";
    if (!addressForm.city || !addressForm.state) nextErrors.pincode = "Please enter valid pincode first";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    addAddress({ id: "ADDR-" + Date.now(), ...addressForm, fullAddress: `${addressForm.houseNo}, ${addressForm.street}, ${addressForm.city}, ${addressForm.state} - ${addressForm.pincode}` });
    toast.success("Address saved successfully!");
    onClose();
  };

  return <div onClick={onClose} style={modalOverlayStyle}><div onClick={(event) => event.stopPropagation()} style={{ ...modalCardStyle, maxWidth: "520px" }}><div style={modalHeaderStyle}><h2 style={modalTitleStyle}>Add New Address</h2><button onClick={onClose} style={modalCloseStyle}>x</button></div><div style={{ padding: 28 }}>
    <Field label="House / Flat / Plot No. *" error={errors.houseNo}><input placeholder="e.g. Flat 4B, Plot No. 12" value={addressForm.houseNo} onChange={(event) => setAddressForm({ ...addressForm, houseNo: event.target.value })} style={inputStyle} onFocus={focusGreen} onBlur={blurGreen} /></Field>
    <Field label="Street / Area / Colony *" error={errors.street}><input placeholder="e.g. MG Road, Shastri Nagar" value={addressForm.street} onChange={(event) => setAddressForm({ ...addressForm, street: event.target.value })} style={inputStyle} onFocus={focusGreen} onBlur={blurGreen} /></Field>
    <Field label="Pincode *" error={errors.pincode || pincodeError}><input type="text" maxLength={6} placeholder="6-digit pincode" value={addressForm.pincode} onChange={(event) => setAddressForm({ ...addressForm, pincode: event.target.value.replace(/\D/g, "") })} style={inputStyle} onFocus={focusGreen} onBlur={blurGreen} />{pincodeLoading && <p style={{ color: "#4CAF50", fontSize: 12, marginTop: 6 }}>Fetching city & state...</p>}</Field>
    <Field label="City / District"><input value={addressForm.city} onChange={(event) => setAddressForm({ ...addressForm, city: event.target.value })} style={{ ...inputStyle, background: autoFilled ? "#F1F8F1" : "#FFFFFF" }} onFocus={focusGreen} onBlur={blurGreen} />{autoFilled && <p style={{ color: "#4CAF50", fontSize: 11, marginTop: 6 }}>Auto-filled from pincode</p>}</Field>
    <Field label="State"><input value={addressForm.state} onChange={(event) => setAddressForm({ ...addressForm, state: event.target.value })} style={{ ...inputStyle, background: autoFilled ? "#F1F8F1" : "#FFFFFF" }} onFocus={focusGreen} onBlur={blurGreen} />{autoFilled && <p style={{ color: "#4CAF50", fontSize: 11, marginTop: 6 }}>Auto-filled from pincode</p>}</Field>
    <Field label="Landmark (optional)"><input placeholder="e.g. Near Apollo Hospital, Opposite City Mall" value={addressForm.landmark} onChange={(event) => setAddressForm({ ...addressForm, landmark: event.target.value })} style={inputStyle} onFocus={focusGreen} onBlur={blurGreen} /></Field>
    <div onClick={() => setAddressForm({ ...addressForm, isDefault: !addressForm.isDefault })} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", borderRadius: "12px", background: addressForm.isDefault ? "#F1F8F1" : "#FAFAFA", border: addressForm.isDefault ? "2px solid #4CAF50" : "2px solid #E8F5E9", cursor: "pointer", marginTop: "8px" }}><div style={{ width: 22, height: 22, borderRadius: 6, background: addressForm.isDefault ? "linear-gradient(135deg, #4CAF50, #388E3C)" : "#FFFFFF", border: addressForm.isDefault ? "none" : "2px solid #C8E6C9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#FFFFFF", fontWeight: 900 }}>{addressForm.isDefault ? "✓" : ""}</div><div><div style={{ color: "#1A1A1A", fontSize: 14, fontWeight: 600 }}>Set as default delivery address</div>{addressForm.isDefault && <div style={{ color: "#888888", fontSize: 12 }}>This address will show in Order Summary</div>}</div></div>
  </div><div style={{ padding: "16px 28px 24px", borderTop: "1px solid #F0F0F0", display: "flex", gap: 12, justifyContent: "flex-end" }}><button onClick={onClose} style={outlineButton}>Cancel</button><button onClick={save} style={primaryButton}>Save Address</button></div></div></div>;
}

function Field({ label, error, children }) { return <div style={{ marginBottom: 18 }}><label style={{ color: "#1A2E1A", fontSize: 14, fontWeight: 600, marginBottom: 6, display: "block" }}>{label}</label>{children}{error && <p style={{ color: "#EF4444", fontSize: 12, fontWeight: 700, margin: "6px 0 0" }}>{error}</p>}</div>; }
function Row({ label, value, color, big }) { return <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0" }}><span style={{ color: big ? "#1A2E1A" : "#666666", fontSize: big ? 16 : 14, fontWeight: big ? 800 : 500 }}>{label}</span><span style={{ color: color || (big ? "#4CAF50" : "#1A1A1A"), fontWeight: 800, fontSize: big ? 22 : 14, fontFamily: "'JetBrains Mono', monospace" }}>{value}</span></div>; }
function formatAddress(address) { return `${address.houseNo}, ${address.street}, ${address.city}, ${address.state} - ${address.pincode}${address.landmark ? `, Near ${address.landmark}` : ""}`; }
function focusGreen(event) { event.target.style.borderColor = "#4CAF50"; }
function blurGreen(event) { event.target.style.borderColor = "#E8F5E9"; }

const lockedStyle = { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "20px", padding: "40px", color: "#1A1A1A" };
const sideCardStyle = { background: "#FFFFFF", borderRadius: "20px", padding: "24px", boxShadow: "0 4px 20px rgba(76,175,80,0.1)", border: "1px solid #E8F5E9", marginBottom: "16px" };
const cartItemStyle = { display: "flex", gap: 16, alignItems: "center", background: "#FFFFFF", border: "1px solid #E8F5E9", borderRadius: 16, padding: 18, boxShadow: "0 4px 20px rgba(76,175,80,0.08)" };
const inputStyle = { width: "100%", padding: "12px 16px", borderRadius: "12px", border: "2px solid #E8F5E9", fontSize: "15px", color: "#1A1A1A", outline: "none", fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#FFFFFF" };
const primaryButton = { background: "linear-gradient(135deg, #4CAF50, #388E3C)", color: "#FFFFFF", border: "none", padding: "12px 28px", borderRadius: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 16px rgba(76,175,80,0.35)", alignItems: "center", justifyContent: "center" };
const outlineButton = { background: "#FFFFFF", color: "#4CAF50", border: "2px solid #4CAF50", padding: "11px 28px", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer" };
const qtyButton = { width: 28, height: 28, border: "none", background: "transparent", color: "#1A1A1A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
const addressCardStyle = { borderRadius: "14px", padding: "14px 16px", marginBottom: "10px", cursor: "pointer", position: "relative", transition: "all 0.2s ease" };
const summaryAddressBox = { background: "#F8FCF8", border: "1px solid #D6E8D6", borderRadius: 14, padding: "13px 14px", marginBottom: 16 };
const defaultBadge = { background: "#E8F5E9", color: "#2E7D32", padding: "3px 10px", borderRadius: "10px", fontSize: "11px", fontWeight: "700" };
const setDefaultButton = { background: "#FFFFFF", border: "1px solid #4CAF50", color: "#2E7D32", borderRadius: 10, padding: "8px 10px", fontSize: 12, fontWeight: 800, cursor: "pointer" };
const defaultActionButton = { ...setDefaultButton, background: "#E8F5E9", color: "#2E7D32", cursor: "default" };
const removeAddressButton = { background: "#FFFFFF", border: "1px solid #FECACA", color: "#EF4444", borderRadius: 10, padding: "8px 10px", fontSize: 12, fontWeight: 800, cursor: "pointer" };
const addAddressButton = { width: "100%", padding: "12px", border: "2px dashed #A5D6A7", borderRadius: "14px", background: "transparent", color: "#4CAF50", fontSize: "14px", fontWeight: "600", cursor: "pointer", textAlign: "center", marginTop: "8px" };
const modalOverlayStyle = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", zIndex: 9999, padding: "20px", animation: "fadeIn 0.2s ease", overflowY: "auto" };
const modalCardStyle = { background: "#FFFFFF", borderRadius: "24px", width: "calc(100% - 32px)", maxHeight: "92vh", overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none", boxShadow: "0 24px 80px rgba(0,0,0,0.18)", animation: "slideUp 0.3s ease", position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
const modalHeaderStyle = { background: "linear-gradient(135deg, #4CAF50, #388E3C)", padding: "22px 28px", borderRadius: "24px 24px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 1 };
const modalTitleStyle = { color: "#FFFFFF", fontSize: "20px", fontWeight: "700", fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0 };
const modalCloseStyle = { background: "rgba(255,255,255,0.2)", border: "none", color: "#FFFFFF", width: "36px", height: "36px", borderRadius: "50%", fontSize: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", lineHeight: 1 };
