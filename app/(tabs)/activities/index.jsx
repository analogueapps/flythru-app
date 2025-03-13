import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import dp from "../../../assets/images/dpfluthru.jpg"
import { Calendar } from "lucide-react-native";


const index = () => {

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
       
        <Text className="text-[20px] text-white ml-3" style={{fontFamily: "CenturyGothic"}}>Activities</Text>
      </View>
     
    </View>
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>

      <Text className="text-xl mb-4">Active Bookings</Text>
      {Array.from({ length: 5 }).map((_, index) => (
        <View
          onPress={() => router.push("/activities/bookingdetails")}
          key={index}
          className="bg-white w-full rounded-xl shadow-md border border-gray-100 mb-3"
        >
          <View className="flex-row items-start  py-6 px-4 ">
                <Image source={dp} className="h-16 w-16 rounded-full mr-4" resizeMode="cover"/>
            <View className=" ml-2 flex flex-col items-start gap-y-1">
              <Text className="text-gray-600 font-extrabold text-xl">Bat Man</Text>
              <Text className="text-[#164F90] font-thin text-lg">Dubai</Text>
            </View>
          </View>
          <View className="flex-1 h-[1px] border-t  border-[#e3e2e2] relative" />

          <View className="flex-row justify-left text-left items-start py-6 px-5">
                      <Calendar size={20} color="#6B7280"  className="rounded-full border-[1px] p-6"/>
            <View className="flex-col gap-y-2">

            <Text className="font-extrabold text-xl">8:00 AM,  08 Oct</Text>
            <Text className="text-[#383F47] text-lg">Checked in Baggages</Text>
            <Text className="text-[#383F47] text-lg">You can cancel 1hr before the service time</Text>
            <View className="flex flex-row justify-center">

            <TouchableOpacity className=" my-4 mx-4 border-2 border-[#164F90] rounded-xl py-4 px-10 ">
                    <Text className="text-center text-[#164F90] font-semibold">Cancel</Text>
                  </TouchableOpacity>
           

             <TouchableOpacity
                       onPress={() => router.push("/activities/bookingdetails")}
             className=" my-4 mx-4 bg-[#FFB800] rounded-xl py-4 px-10 shadow-lg">
                    <Text className="text-center text-black font-semibold">View Details</Text>
                  </TouchableOpacity>
            </View>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  </View>
  );
};

export default index;
 