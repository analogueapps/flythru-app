import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import images from "../../../constants/images";
import { StatusBar } from "expo-status-bar";
import { Bell } from "lucide-react-native";
import { Calendar } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
const Index = () => {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1">
      {/* Header Background Image */}
      <View>
        <Image
          source={images.HeroHeader}
          className="w-full h-auto relative"
          style={{ resizeMode: "cover" }} // Ensure the image fits nicely
        />
      </View>
      <View
        style={{
          top: insets.top,
          zIndex: 1,
          // height: 90,

          // backgroundColor: "green", // Transparent background
        }}
        className="flex-row justify-between items-center p-6 absolute w-full"
      >
        <Image
          source={images.whiteLogo}
          className="w-[100px] h-[30px]"
          resizeMode="contain"
        />
        <TouchableOpacity className="bg-white rounded-full p-2">
          <Bell color="black" size={18} />
        </TouchableOpacity>
      </View>
      <View className="bg-white self-center absolute top-36 z-10  p-6 rounded-2xl w-[90%] shadow-lg">
        <View className="flex-row my-2 items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
          <TextInput
            placeholder="Select Date"
            className="flex-1 h-[30px]"
            placeholderTextColor="#9CA3AF"
          />
          <Calendar size={20} color="#6B7280" />
        </View>
        <TextInput
          placeholder="Enter Flight Number"
          className="border h-[50px] border-gray-300 my-2 rounded-xl px-4 py-3 bg-gray-50"
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity
          onPress={() => router.push("/home/search")}
          className="bg-[#FFB800] rounded-lg py-4 mt-2"
        >
          <Text className="text-center text-black font-semibold text-base">
            Search
          </Text>
        </TouchableOpacity>
      </View>
      {/* Safe Area Content */}
      <ScrollView className="flex-1" contentContainerStyle={{}}>
        <View className="flex-1 items-center justify-center mt-28 mx-6">
          {/* Ad Card */}
          <Text className="text-[#003C71] my-4 font-bold text-[16px] self-start">
            Ad
          </Text>
          {/* Your existing colored boxes */}
          <View className="bg-yellow-400 w-full h-[100px] mx-4 mb-3 rounded-xl"></View>
          <Text className="text-[#164F90] my-4 font-bold text-[16px] self-start">
            Today Active Flights
          </Text>
          {/* Flight Card */}
          {Array.from({ length: 5 }).map((_, index) => (
            <View
              key={index}
              className="bg-white w-full  rounded-xl shadow-md border border-gray-100 mb-3"
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
                  <Text className="text-2xl font-bold text-[#003C71]">
                    14:30
                  </Text>
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
                  <Text className="text-2xl font-bold text-[#003C71]">
                    20:00
                  </Text>
                  <Text className="text-gray-500 self-end">DUB</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;
