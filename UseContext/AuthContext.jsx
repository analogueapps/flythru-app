import React, { createContext, useState, useContext, useEffect } from "react";

// Add to your imports
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STATUS } from "../network/apiCallers";
import { router, usePathname } from "expo-router";
import Toast from "react-native-toast-message";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [authToken, setAuthToken] = useState(null);

  const [inactiveModalVisible, setInactiveModalVisible] = useState(false);
  const  pathname  = usePathname();

  const checkUserStatus = async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) return;

    try {
      const res = await STATUS(token);
      if (res.data?.status !== "Active") {
        setInactiveModalVisible(true);
      }
    } catch (error) {
      console.log("Error checking user status:", error);
    }
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  const loadToken = async () => {
    const token = await AsyncStorage.getItem("authToken");
    const storedName = await AsyncStorage.getItem("user_name");
    const storedPhone = await AsyncStorage.getItem("user_phone");

    console.log("Loaded name from AsyncStorage:", storedName);
    console.log("userName after load:", userName);

    console.log("Stored Name:", storedName);
    if (token) {
      setAuthToken(token);
    }
    if (storedName) setUserName(storedName);
    if (storedPhone) setUserPhone(storedPhone);
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

  const SaveName = async (value) => {
    const nameToSave = value || "";
    console.log("Saving user name:", nameToSave);
    setUserName(nameToSave);
    await AsyncStorage.setItem("user_name", nameToSave);
  };

  const SavePhone = async (value) => {
    const phoneToSave = value || "";
    setUserPhone(phoneToSave);
    await AsyncStorage.setItem("user_phone", phoneToSave);
  };

  useEffect(() => {
    async function fun() {
      const token = await AsyncStorage.getItem("authToken");
      try {
        const res = await STATUS(token);
        // console.log("driver status", res);
        if (res.status === 200 && res.data.status === "Inactive") {
          Toast.show({
            type: "info",
            text1: "You account is freezed",
            text2: "Please contact to support team",
          });
          router.replace("/(auth)");
        }
      } catch (error) {
        console.log(error);
      }
    }
    fun();
  }, [pathname]);

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
        loadToken,
        checkUserStatus,
        inactiveModalVisible,
        setInactiveModalVisible,

        
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
