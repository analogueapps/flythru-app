import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState("");
  const loadToken = async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      setAuthToken(token);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadToken();
  }, []);

  const login = async (token) => {
    await AsyncStorage.setItem("authToken", token);
    setAuthToken(token);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("authToken");
    setAuthToken(null);
  };

  async function SaveMail(value) {
    setUserEmail(value?value:"");
  }

  return ( 
    <AuthContext.Provider value={{ userEmail, setUserEmail, SaveMail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
