import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("yubiUser");
    return stored ? JSON.parse(stored) : null;
  });
  const [addresses, setAddresses] = useState(() => {
    const stored = localStorage.getItem("yubiAddresses");
    return stored ? JSON.parse(stored) : [];
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  function login(userData) {
    localStorage.setItem("yubiUser", JSON.stringify(userData));
    setUser(userData);
    setShowAuthModal(false);
  }

  function logout() {
    localStorage.removeItem("yubiUser");
    setUser(null);
  }

  function addAddress(newAddress) {
    const shouldBeDefault = newAddress.isDefault || addresses.length === 0;
    const updated = shouldBeDefault
      ? [...addresses.map(a => ({ ...a, isDefault: false })), { ...newAddress, isDefault: true }]
      : [...addresses, { ...newAddress, isDefault: false }];
    setAddresses(updated);
    localStorage.setItem("yubiAddresses", JSON.stringify(updated));
  }

  function setDefaultAddress(addressId) {
    const updated = addresses.map(a => ({
      ...a,
      isDefault: a.id === addressId
    }));
    setAddresses(updated);
    localStorage.setItem("yubiAddresses", JSON.stringify(updated));
  }

  function removeAddress(addressId) {
    const removed = addresses.find(a => a.id === addressId);
    let updated = addresses.filter(a => a.id !== addressId);
    if (removed?.isDefault && updated.length) {
      updated = updated.map((address, index) => ({ ...address, isDefault: index === 0 }));
    }
    setAddresses(updated);
    localStorage.setItem("yubiAddresses", JSON.stringify(updated));
  }

  function openAuthModal(mode = "login") {
    setAuthMode(mode);
    setShowAuthModal(true);
  }

  const value = {
    user,
    login,
    logout,
    addresses,
    addAddress,
    setDefaultAddress,
    removeAddress,
    showAuthModal,
    setShowAuthModal,
    authMode,
    setAuthMode,
    openAuthModal
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
