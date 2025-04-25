import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const Chat = () => {
  const [loading, setLoading] = useState(true);

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="dark" backgroundColor="white" />
      <View style={styles.container}>
        {/* Show loader when loading is true */}
        <WebView
          source={{
            // uri: "https://tawk.to/chat/67c935007390f819097769cb/1ilkve2kk",
            uri:"https://tawk.to/chat/6805eba46d34aa190b05621b/1ipbi0vk3",
          }}
          style={{ flex: 1 }}
          onLoadStart={() => setLoading(true)} // Show loader when loading starts
          onLoadEnd={() => setLoading(false)} // Hide loader when loading ends
        />
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Optional: Adds a light background
    padding: 20,
    borderRadius: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Chat;