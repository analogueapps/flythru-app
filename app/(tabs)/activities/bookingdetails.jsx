import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Plus, Minus } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router, useLocalSearchParams } from "expo-router";  

import dp from "../../../assets/images/dpfluthru.jpg"
import call from "../../../assets/images/call.png"
import hash from "../../../assets/images/hash.png"

const bookingdetails = () => {
  const insets = useSafeAreaInsets();
  const { fromSelectLocation = false } = useLocalSearchParams();

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
          <Text className="text-[18px] text-white ml-3" style={{fontFamily: "CenturyGothic"}}>Booking Details</Text>
        </View>
      </View>
      
      <View
        className="bg-white self-center absolute top-[170px] p-6 z-10 rounded-xl w-[90%] shadow-lg"
        style={{
          maxHeight: "79%",
        }}
      >
        <ScrollView className="" showsVerticalScrollIndicator={false}>
          <View className="p-5 bg-[#164F901A] border-[#00000026] rounded-2xl border-[1px] flex-col gap-5">
            <Text className="text-[#164F90] text-2xl font-bold">
              Baggage Collecting
            </Text>
            <View className="flex-1 h-[1px] border-t  border-[#00000026] relative" />

            <View className="flex-row justify-between">
              <Text className="text-[#164F90] text-xl">Checked in Bag</Text>
              <Text className="text-[#164F90] text-xl font-bold">14</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-[#164F90] text-xl">Date</Text>
              <Text className="text-[#164F90] text-xl font-bold">15 May</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-[#164F90] text-xl">Time</Text>
              <Text className="text-[#164F90] text-xl font-bold">05:15 pm</Text>
            </View>

            {fromSelectLocation && (
              <>
                <View className="flex-1 h-[1px] border-t border-dashed border-[#00000026] relative" />
                <View className="flex-row justify-between">
                  <Text className="text-[#164F90] text-xl">Total Paid</Text>
                  <Text className="text-[#164F90] text-xl font-bold">₹500</Text>
                </View>
              </>
            )}
          </View>

          <View className="flex flex-row justify-between items-center my-7 gap-2">
            <View className="flex flex-row ">

            <Image
              source={dp}
              className="h-16 w-16 rounded-full mr-4"
              resizeMode="cover"
            />

            <View>
              <Text className="text-[#164F90] text-3xl font-thin">Bat Man</Text>
              <Text>Dubai</Text>
              </View>

            </View>
            <View>
              <Text className="bg-[#FFB648] p-2 rounded-md px-6">Status : In Transist</Text>

            </View>
          </View>

          <View className="flex-col gap-5">
            <View className="flex-col gap-3">
            <Text className="text-[#164F90] text-xl font-bold">Pick Up</Text>
            <Text className="text-lg">4372 Romano Street, Bedford, 01730</Text>
            </View>

            <View className="flex-col gap-3">
            <Text className="text-[#164F90] text-xl font-bold">Drop Off</Text>
            <Text className="text-lg">4372 Romano Street, Bedford, 01730</Text>
            </View>
          </View>

          <View className="flex-1 h-[1px] border-t  border-[#00000026] relative my-5" />

        <View className="flex flex-col justify-left gap-5">
          <View className="flex-row">
          <Image
              source={call}
              className="h-10 w-10 rounded-full mr-4"
              resizeMode="cover"
            />
          <Text className="text-xl">Contact info : +965 51234567 </Text>
          </View>

          <View className="flex-row">
          <Image
              source={hash}
              className="h-10 w-10 rounded-full mr-4"
              resizeMode="cover"
            />
          <Text className="text-xl">Booking no : #123456</Text>
          </View>
        </View>


       {/* Modify Slot Button */}
      {/* Conditionally Render Buttons */}
{fromSelectLocation ? (
    // Show "Go Back" button if coming from select location
    <TouchableOpacity
        onPress={() => router.push("/home")}
        className="border-2 border-[#164F90] rounded-xl py-4 my-5"
    >
        <Text className="text-center text-black font-semibold">
            Go Back
        </Text>
    </TouchableOpacity>
) : (
    // Show "Modify Slot" button if not coming from select location
    <TouchableOpacity
        onPress={() => router.push("/activities/cancellation")}
        className="border-2 border-[#164F90] rounded-xl py-4 my-5"
    >
        <Text className="text-center text-black font-semibold">
            Modify Slot
        </Text>
    </TouchableOpacity>
)}

        </ScrollView>
       
      </View>
    </View>
  );
};

export default bookingdetails;
