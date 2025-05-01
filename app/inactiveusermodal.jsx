import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export const inactiveusermodal = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <MaterialIcons name="person-off" size={64} color="#F87171" />
          <Text style={styles.title}>Account Inactive</Text>
          <Text style={styles.description}>
            Your account has been marked inactive. Please contact support to
            resolve this issue.
          </Text>

          <TouchableOpacity
            onPress={() => {
              onClose?.(); // optional callback
              router.replace("/"); // Go to landing or login page
            }}
            style={styles.retryButton}
          >
            <MaterialIcons name="logout" size={24} color="white" />
            <Text style={styles.retryText}>Go to Home</Text>
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
    backgroundColor: "#EF4444",
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
