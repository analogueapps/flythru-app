// app/splash.js
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useAuth } from "../UseContext/AuthContext";

export default function SplashRedirect() {
  const { SaveMail } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("userEmail");
        if (storedEmail) {
          SaveMail(storedEmail); // Set email in context
          router.replace("/home"); // ✅ Go to home
        } else {
          router.replace("/(auth)"); // 🔐 Go to login
        }
      } catch (e) {
        console.log("Error checking login:", e);
        router.replace("/(auth)");
      }
    };

    checkAuth();
  }, []);

  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
}
