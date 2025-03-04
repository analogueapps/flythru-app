import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Plus, Minus } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import PlaneIcon from "../../../assets/svgs/PlaneSvg";

const baggage = () => {
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
          <Text className="text-[18px] text-white ml-3">Baggage Details</Text>
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
      </View>
      <View
        className="bg-white self-center absolute top-[170px] p-6 z-10 rounded-xl w-[90%] shadow-lg"
        style={{
          maxHeight: "79%",
        }}
      >
        <ScrollView className="" showsVerticalScrollIndicator={false}>
          {/* Number of Persons */}
          <View className="mb-6">
            <Text className="text-[#164F90] font-bold text-lg mb-3">
              Number of Persons
            </Text>
            <View className="border border-[#F2F2F2] bg-[#FBFBFB] flex-row items-center justify-between p-3 rounded-xl">
              <Text className="text-[#164F90] font-semibold text-lg">
                Number of Persons
              </Text>
              <View className="flex-row items-center gap-x-2 bg-[#194f9027] px-3 py-2 rounded-lg">
                <TouchableOpacity className="mr-2">
                  <Minus color={"#194F90"} size={13} />
                </TouchableOpacity>
                <Text className="text-[#194f90]">1</Text>
                <TouchableOpacity className="ml-3">
                  <Plus color={"#194F90"} size={13} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* Baggage */}
          <View className="mb-6">
            <Text className="text-[#164F90] font-bold text-lg mb-3">
              Baggage
            </Text>
            <View className="border border-[#F2F2F2] bg-[#FBFBFB] flex-row items-center justify-between p-3 rounded-xl">
              <Text className="text-[#164F90] font-semibold text-lg">
                Checked in Bags
              </Text>
              <View className="flex-row items-center gap-x-2 bg-[#194f9027] px-3 py-2 rounded-lg">
                <TouchableOpacity className="mr-2">
                  <Minus color={"#194F90"} size={13} />
                </TouchableOpacity>
                <Text className="text-[#194f90]">1</Text>
                <TouchableOpacity className="ml-3">
                  <Plus color={"#194F90"} size={13} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* Image Upload */}
          <View className="mb-6">
            <TouchableOpacity className="border border-dashed border-[#8B8B8B] rounded-xl p-6 items-center">
              <Text className="text-[#515151] mb-1">Upload Image</Text>
            </TouchableOpacity>
            <Text className="text-[#2D2A29] text-sm">
              Max 5MB - JPG, PNG allowed
            </Text>
            <View className="flex-row flex-wrap mt-3">
              {["img1", "img2", "img3", "img4", "img5", "img6"].map(
                (img, index) => (
                  <View
                    key={index}
                    className="bg-gray-100 rounded-md px-3 py-1 mr-2 mb-2 flex-row items-center"
                  >
                    <Text className="text-gray-600 mr-2">{img}</Text>
                    <TouchableOpacity>
                      <Text className="text-gray-400">×</Text>
                    </TouchableOpacity>
                  </View>
                )
              )}
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={() => router.push("/home/slots")}
            className="bg-[#FFB800] rounded-xl py-4"
          >
            <Text className="text-center text-black font-semibold">
              Continue
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

export default baggage;
