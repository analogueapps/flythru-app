import { View, Text, Image, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import flash from "../assets/images/flash.png";

export default function Index() {
  const { width } = Dimensions.get("window");
  const [showFlash, setShowFlash] = useState(true);

  useEffect(() => {
    const showSplashThenNavigate = async () => {
      // Show flash for 3 seconds
      await new Promise(resolve => setTimeout(resolve, 3000));
      setShowFlash(false);

      // Then redirect to correct screen
      try {
        const token = await AsyncStorage.getItem("authToken");
        console.log("Stored token:", token);
        if (token) {
          router.replace("/home");
        } else {
          router.replace("/(auth)");
        }
      } catch (error) {
        console.error("Navigation error:", error);
      }
    };

    showSplashThenNavigate();
  }, []);

  if (showFlash) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Image
          source={flash}
          style={{ width: width * 0.9, height: width * 0.9 }}
          resizeMode="contain"
        />
        <Text className="text-[#164F90] font-bold text-6xl text-left">
          Book Services
        </Text>
        <Text className="text-[#164F90] font-bold text-[2.7rem] text-left">
          for Hassle-free Trip
        </Text>
        <Text className="text-left text-xl text-[#3E3E3E]">
          Find your flight in just one click to book services.
        </Text>
      </View>
    );
  }

  // While routing is happening (optional fallback)
  return <View className="flex-1 bg-white" />;
}
