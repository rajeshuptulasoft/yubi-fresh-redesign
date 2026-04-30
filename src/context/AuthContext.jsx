import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext(null);
export function AuthProvider({ children }) { const [user,setUser]=useState(null); useEffect(()=>{try{setUser(JSON.parse(localStorage.getItem("yubiUser")))}catch{setUser(null)}},[]); const signOut=()=>{localStorage.removeItem("yubiUser");setUser(null)}; const signIn=(email,password)=>{const role=email.includes("admin")?"admin":email.includes("delivery")?"delivery":"customer"; const u={email,role}; localStorage.setItem("yubiUser",JSON.stringify(u));setUser(u);return {error:null}}; return <AuthContext.Provider value={{user,role:user?.role,signIn,signOut,loading:false}}>{children}</AuthContext.Provider> }
export const useAuth=()=>useContext(AuthContext);
