import { View, Text, Image, Dimensions } from "react-native";
import { InteractionManager } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import flash from "../assets/images/flash.png";
import { NetworkContext } from "../UseContext/NetworkContext";
import { NetworkErrorModal } from "./networkmodel";
import { FirebaseApp, initializeApp } from '@react-native-firebase/app';

const app = initializeApp(); // Optional, if not automatically initialized

export default function Index() {
  const { width } = Dimensions.get("window");
  const router = useRouter();
  const { isConnected } = useContext(NetworkContext);
  const [showFlash, setShowFlash] = useState(true);

  useEffect(() => {
    if (isConnected === null) return; // Still checking

    const handleNavigation = async () => {
      if (!isConnected) return; // Modal will show automatically, don't navigate

      await new Promise((resolve) => setTimeout(resolve, 3000));
      setShowFlash(false);

      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          router.replace("/home");
        } else {
          router.replace("/(auth)");
        }
      } catch (error) {
        console.error("Navigation error:", error);
      }
    };

    InteractionManager.runAfterInteractions(handleNavigation);
  }, [isConnected]);

  if (isConnected === null) {
    return null; // Optional loading
  }

  if (showFlash) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Image
          source={flash}
          style={{ width: width * 0.9, height: width * 0.9 }}
          resizeMode="contain"
        />

        <View className="w-[90%] mt-16  pt-7">
          <Text className="text-[#164F90] font-bold text-5xl text-left pt-2">
            Book Services
          </Text>
          <Text className="text-[#164F90] font-bold text-6xl text-left mt-1 pt-2">
            for Hassle-free Trip
          </Text>
          <Text className="text-[#3E3E3E] text-2xl text-left mt-2">
            Find your flight in just one click to book services.
          </Text>
        </View>

        {/* ✅ Add the modal here */}
        <NetworkErrorModal />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <NetworkErrorModal/>
    </View>
  );
}
