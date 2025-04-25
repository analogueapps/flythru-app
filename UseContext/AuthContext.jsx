import React, { createContext, useState, useContext, useEffect } from "react";

// Add to your imports
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");

  const loadToken = async () => {
    const token = await AsyncStorage.getItem("authToken");
    const storedName = await AsyncStorage.getItem("user_name");
    const storedPhone = await AsyncStorage.getItem("user_phone");

    if (token) {
      setAuthToken(token);
    }
    if (storedName) setUserName(storedName);
    if (storedPhone) setUserPhone(storedPhone);

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
    setUserEmail("");
    setUserName("");
    setUserPhone("");
  };

  const SaveMail = (value) => setUserEmail(value || "");
  const SaveName = (value) => setUserName(value || "");
  const SavePhone = (value) => setUserPhone(value || "");

  return (
    <AuthContext.Provider
      value={{
        userEmail,
        setUserEmail,
        SaveMail,
        userName,
        SaveName,
        userPhone,
        SavePhone,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [userEmail, setUserEmail] = useState("");
//   const loadToken = async () => {
//     const token = await AsyncStorage.getItem("authToken");
//     if (token) {
//       setAuthToken(token);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadToken();
//   }, []);

//   const login = async (token) => {
//     await AsyncStorage.setItem("authToken", token);
//     setAuthToken(token);
//   };

//   const logout = async () => {
//     await AsyncStorage.removeItem("authToken");
//     setAuthToken(null);
//   };

//   async function SaveMail(value) {
//     setUserEmail(value?value:"");
//   }

//   return ( 
//     <AuthContext.Provider value={{ userEmail, setUserEmail, SaveMail }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
