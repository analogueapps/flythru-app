import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState("");

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
