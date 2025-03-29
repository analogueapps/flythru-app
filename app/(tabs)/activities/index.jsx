import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import dp from "../../../assets/images/dpfluthru.jpg"
import { Calendar } from "lucide-react-native";
import { langaugeContext } from "../../../customhooks/languageContext";
import Translations from "../../../language";
import { BOOKING_DETAILS } from "../../../network/apiCallers";
import AsyncStorage from "@react-native-async-storage/async-storage";


const index = () => {
 
    const insets = useSafeAreaInsets(); 
    const { applanguage } = langaugeContext()

    const fetchBookingDetails = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        toast.show("No token found. Please log in.");
        return;
      }
    
      try {
        console.log("Fetching details for bookingId:", bookingId);
        const res = await BOOKING_DETAILS(bookingId, token);
        console.log("API Response:", res.data);
        setBookingData(res.data); 
      } catch (error) {
        // console.error("Error fetching booking details:", error?.response?.data || error);
        toast.show(error?.response?.data?.message || "Failed to fetch booking details");
      }
    };
    
    
    useEffect(() => {
      if (bookingId) {
        fetchBookingDetails(); 
      }
    }, [bookingId]);

  
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
      <View className="flex-row  items-center  mt-5">
       
        <Text className="text-[20px] font-bold text-white ml-3" style={{fontFamily: "CenturyGothic"}}>{
                applanguage==="eng"?Translations.eng.activities:Translations.arb.activities
              }  </Text>
      </View>
     
    </View>
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>

      <Text className="text-xl mb-4">{
                applanguage==="eng"?Translations.eng.active_bookings:Translations.arb.active_bookings
              }</Text>
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
            <Text className="text-[#383F47] text-lg">{
                applanguage==="eng"?Translations.eng.cancel_policy:Translations.arb.cancel_policy
              }</Text>
            <View className="flex flex-row justify-center">

            <TouchableOpacity className=" my-4 mx-4 border-2 border-[#164F90] rounded-xl py-4 px-10 ">
                    <Text className="text-center text-[#164F90] font-semibold">{
                applanguage==="eng"?Translations.eng.cancel:Translations.arb.cancel
              }</Text>
                  </TouchableOpacity>
           

             <TouchableOpacity
                       onPress={() => // Example navigation code
                        router.push({
                          pathname: "/activities/bookingdetails",
                          params: { bookingId: "67e68847e3932ba583f44567" }, // ✅ Pass bookingId correctly
                        })
                        }
             className=" my-4 mx-4 bg-[#FFB800] rounded-xl py-4 px-10 shadow-lg">
                    <Text className="text-center text-black font-semibold">{
                applanguage==="eng"?Translations.eng.view_details:Translations.arb.view_details
              }</Text>
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
 