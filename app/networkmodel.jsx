import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNetwork } from "../UseContext/NetworkContext";

export const NetworkErrorModal = ({ method }) => {
    const { showModal, setShowModal, CheckNetwork, setManualClose } = useNetwork();
  
    const handleRetry = async () => {
      const isConnected = await CheckNetwork();
      if (!isConnected) {
        // Stay visible if still not connected
        return;
      }
      // Only hide if connection is restored
      setManualClose(true);
      setShowModal(false);
      if (method) {
        await method();
      }
    };
  
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {}}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <MaterialIcons name="signal-wifi-off" size={64} color="#EF4444" />
            <Text style={styles.title}>No Internet Connection</Text>
            <Text style={styles.description}>
              Please check your internet connection and try again.
            </Text>
  
            <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
              <MaterialIcons name="refresh" size={24} color="white" />
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 360,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    textAlign: "center",
  },
  description: {
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  retryText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 8,
  },
});
