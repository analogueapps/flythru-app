import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";

const search = () => {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1">
      {/* Header Background Image */}
      <View>
        <Image
          source={images.HeaderImg}
          className="w-full h-auto relative"
          style={{ resizeMode: "cover" }}
        />
      </View>
      <View
        style={{
          top: insets.top,
          zIndex: 1,
        }}
        className="p-6 absolute w-full"
      >
        <View className="flex-row  items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-[rgba(255,255,255,0.8)] rounded-full p-1"
          >
            <ChevronLeft color="black" size={18} />
          </TouchableOpacity>
          <Text className="text-[18px] text-white ml-3">Search Result</Text>
        </View>
        <View className="flex flex-row gap-x-4 items-center mt-6 ">
          <Text className="text-white">Date : 05/05/2025</Text>
          <Text className="text-white">Time : 05:00pm</Text>
        </View>
      </View>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <TouchableOpacity
            onPress={() => router.push("/home/baggage")}
            key={index}
            className="bg-white w-full rounded-xl shadow-md border border-gray-100 mb-3"
          >
            <View className="flex-row items-start  py-6 px-4 ">
              <TempAirWaysLogo />
              <View className=" ml-2 flex flex-col items-start gap-y-1">
                <Text className="text-gray-600">Turkish AIRWAYS</Text>
                <Text className="text-[#164F90]">582041B</Text>
              </View>
            </View>
            <View className="flex-1 h-[1px] border-t border-dashed border-[#cdcdcd] relative" />
            <View className="flex-row justify-between items-center py-6 px-5">
              <View>
                <Text className="text-2xl font-bold text-[#003C71]">14:30</Text>
                <Text className="text-gray-500">HYD</Text>
              </View>
              <View className="flex-1 items-center">
                <View className="w-full flex-row items-center justify-center mt-6">
                  <View className="flex-1 h-[1px] border-t border-dashed border-[#164F90] relative">
                    <View className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white px-2">
                      <FontAwesome5 name="plane" size={16} color="#164F90" />
                    </View>
                  </View>
                </View>
                <Text className="text-gray-500 text-sm mt-3">5h30m</Text>
              </View>
              <View>
                <Text className="text-2xl font-bold text-[#003C71]">20:00</Text>
                <Text className="text-gray-500 self-end">DUB</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default search;
