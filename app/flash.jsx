import { View, Text, Image } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import flash from "../assets/images/flash.png";

SplashScreen.preventAutoHideAsync(); // Prevent auto-hiding splash screen


const Flash = () => {
  const insets = useSafeAreaInsets();


  return (
    <View className="flex-1 justify-center">
      {/* Header Background Image */}
      <View style={{ height: 400 }}> 
  <Image source={flash} className="w-[90%] h-[90%] self-center" resizeMode="contain" />
</View>


      <View className="w-[85%] mx-auto">
      <Text className="text-[#164F90] font-bold text-6xl text-left">Book Services</Text>
      <Text className="text-[#164F90] font-bold text-[2.7rem] text-left">for Hassle-free Trip</Text>
      <Text className="text-left text-xl text-[#3E3E3E]">Find your flight in just one click to book services.</Text>
      </View>


    </View>
  );
};

export default Flash;
