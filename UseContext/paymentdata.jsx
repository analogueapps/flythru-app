import React, { createContext, useState, useContext, useEffect } from "react";

// Add to your imports
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, usePathname } from "expo-router";
import Toast from "react-native-toast-message";

const PaymentData = createContext();

export const AuthProvider = ({ children }) => {
    const [paymentId, setPaymentId] = useState(null);
    c


 





  return (
    <PaymentData.Provider
      value={{
   
      }}
    >
      {children}
    </PaymentData.Provider>
  );
};

export const usePaymentData = () => useContext(PaymentData);


