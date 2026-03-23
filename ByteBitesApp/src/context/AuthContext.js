import React, { createContext, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login as apiLogin, register as apiRegister } from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  const register = async (username, password, name) => {
    await apiRegister(username, password, name);
    await signIn(username, password);
  };

  const signIn = async (username, password) => {
    const data = await apiLogin(username, password);
    await AsyncStorage.setItem("token", data.access_token);
    setToken(data.access_token);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, register, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
