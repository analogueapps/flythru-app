import React, { createContext, useContext, useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { usePathname, useRouter } from "expo-router";

export const NetworkContext = createContext();

export const useNetwork = () => useContext(NetworkContext);

export const NetworkProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(null);
  const [networkType, setNetworkType] = useState(null);
  const router = useRouter();
  const pathname = usePathname(); // <- Get current route

  //   useEffect(() => {
  //     const unsubscribe = NetInfo.addEventListener((state) => {
  //       setIsConnected(state.isConnected);
  //       setNetworkType(state.type);
  //     });

  //     return () => unsubscribe();
  //   }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      console.log("-0-0",state.isConnected)
      //   setShowModal(state.isConnected === false); // Show modal if disconnected
    });

    return () => unsubscribe();
  }, []);
  // useEffect(() => {
  //   if (!isConnected) {
  //     router.push("/nointernet");
  //   }
  // }, [isConnected]);
  return (
    <NetworkContext.Provider value={{ isConnected, networkType }}>
      {children}
    </NetworkContext.Provider>
  );
};
