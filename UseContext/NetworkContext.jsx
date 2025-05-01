import React, { createContext, useContext, useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";

export const NetworkContext = createContext();
export const useNetwork = () => useContext(NetworkContext);
// In NetworkContext.js
export const NetworkProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [manualClose, setManualClose] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      // Only auto-show modal if not manually closed and connection is lost
      if (!manualClose && state.isConnected === false) {
        setShowModal(true);
      }
    });

    return () => unsubscribe();
  }, [manualClose]);

  const CheckNetwork = async () => {
    const state = await NetInfo.fetch();
    setIsConnected(state.isConnected);
    if (!state.isConnected && !manualClose) {
      setShowModal(true);
    }
    return state.isConnected;
  };

  return (
    <NetworkContext.Provider
      value={{ 
        isConnected, 
        showModal, 
        setShowModal, 
        CheckNetwork,
        setManualClose
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

//   return (
//     <NetworkContext.Provider
//       value={{ isConnected, showModal, setShowModal, CheckNetwork }}
//     >
//       {children}
//     </NetworkContext.Provider>
//   );
// };
