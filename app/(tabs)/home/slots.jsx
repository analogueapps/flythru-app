import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Plus, Minus } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import PlaneIcon from "../../../assets/svgs/PlaneSvg";

const slots = () => {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1">
      {/* Header Background Image */}
      <View>
        <Image
          source={images.HeaderImg2}
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
          <Text className="text-[18px] text-white ml-3">Select Slots</Text>
        </View>
        <View className="flex-row items-center justify-between px-4 mt-8">
          <View className="flex-col items-center">
            <Text className="text-2xl font-bold text-white">HYD</Text>
            <Text className="text-white">Hyderabad</Text>
          </View>
          <View className="flex-1 items-center px-2">
            <View className="w-full flex-row items-center justify-center ">
              <View className="flex-1 h-[1px] border-t border-dashed border-white relative">
                <View className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 px-2">
                  <PlaneIcon />
                </View>
              </View>
            </View>
          </View>
          <View className="flex-col items-center">
            <Text className="text-2xl font-bold text-white">DUB</Text>
            <Text className="text-white">Dubai</Text>
          </View>
        </View>
        <Text className="text-white text-center mt-4">Date : 05/05/2025</Text>
      </View>

      <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
        <View className="flex-1">
          <Text className="text-[16px] mb-4">05/05/2025</Text>
          <View className="flex-row flex-wrap gap-3">
            {[
              { time: "09 : 00", period: "AM" },
              { time: "11 : 30", period: "AM" },
              { time: "02 : 15", period: "PM" },
              { time: "04 : 45", period: "PM" },
            ].map((slot, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center gap-x-2 px-3 py-2 rounded-lg border border-[#A4A4A4] self-start"
              >
                <Text className="text-[#ADADAD] text-[16px]">{slot.time}</Text>
                <Text className="text-[10px] text-[#ADADAD]">
                  {slot.period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className="mt-4">
            <Text className="text-[16px] mb-4">05/05/2025</Text>
            <View className="flex-row flex-wrap gap-3">
              {[
                { time: "09 : 00", period: "AM" },
                { time: "11 : 30", period: "AM" },
                { time: "02 : 15", period: "PM" },
                { time: "04 : 45", period: "PM" },
              ].map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  className="flex-row items-center gap-x-2 px-3 py-2 rounded-lg border border-[#A4A4A4] self-start"
                >
                  <Text className="text-[#ADADAD] text-[16px]">
                    {slot.time}
                  </Text>
                  <Text className="text-[10px] text-[#ADADAD]">
                    {slot.period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Continue Button */}
      </ScrollView>
      <TouchableOpacity className=" my-4 mx-4 bg-[#FFB800] rounded-xl py-4">
        <Text className="text-center text-black font-semibold">Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default slots;
