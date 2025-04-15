import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function nointernet() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>No Internet Connection</Text>
        <Text style={styles.description}>
          Please check your internet connection and try again. Make sure Wi-Fi or cellular data is turned on and try again.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2d3748", // Tailwind gray-800
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#4a5568", // Tailwind gray-600
    textAlign: "center",
    marginBottom: 20,
  },
});
