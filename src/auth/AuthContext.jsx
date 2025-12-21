import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  // 🔥 CHANGE: email -> identifier
  const login = async (identifier, password) => {

    const res = await api.post("/api/auth/login", {
      identifier,
      password,
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem(
      "user",
      JSON.stringify({ role: res.data.role })
    );

    setUser({ role: res.data.role });
  };

  const logout = async () => {
    await api.post("/api/auth/logout");
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
