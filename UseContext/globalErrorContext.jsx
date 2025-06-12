import React, { useState, createContext, useContext } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';

// 1. Create context
const GlobalErrorContext = createContext();

export const useGlobalError = () => useContext(GlobalErrorContext);

// 2. Wrap your app with provider
const GlobalErrorProvider = ({ children }) => {
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const triggerError = (msg) => {
    setErrorMessage(msg);
    setShowError(true);
  };

  const clearError = () => {
    setShowError(false);
    setErrorMessage("");
  };

  return (
    <GlobalErrorContext.Provider value={{ triggerError }}>
      {children}

      {/* Modal JSX */}
      <Modal visible={showError} transparent animationType="fade">
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            width: '80%'
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'red', marginBottom: 10 }}>
              Server Error
            </Text>
            <Text style={{ color: '#333', marginBottom: 20 }}>
              {errorMessage || 'Something went wrong. Please try again later.'}
            </Text>
            <TouchableOpacity
              onPress={clearError}
              style={{
                backgroundColor: '#194F90',
                paddingVertical: 10,
                borderRadius: 8
              }}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </GlobalErrorContext.Provider>
  );
};

export default GlobalErrorProvider;
