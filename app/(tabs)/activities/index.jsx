import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
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
import { ACTIVITIES, BOOKING_DETAILS } from "../../../network/apiCallers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';

import Toast from "react-native-toast-message";


const index = () => {
 
    const insets = useSafeAreaInsets(); 
    const { applanguage } = langaugeContext()
    const [bookings , setBookings] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    
    // Simulate data loading (you'd replace this with your API call)
    useEffect(() => {
      fetchBookings(); // your actual API call
    }, []);
    
    const fetchBookings = async () => {
      // simulate loading
      setIsLoading(true);
      // fetch and setBookings
      // ...
      setTimeout(() => {
        setIsLoading(false);
      }, 2000); // adjust timing based on real API
    };
    

    const fetchActivities = async () => {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Please login",
        });
        return;
      }
    
      try {
        const res = await ACTIVITIES(token);
        console.log("Activities Response:", res.data);
        // Set bookings to res.data.data (the actual array of bookings)
        setBookings(res.data.data || []); // Fallback to empty array if undefined
      } catch (error) {
        console.error("Error fetching bookings:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error?.response?.data?.message || "Failed to fetch bookings",
        });
        setBookings([]); // Ensure bookings is always an array
      }
      finally {
        setIsLoading(false);
      }

    };
    
    useEffect(() => {
      fetchActivities();
    }, []);

  
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
  <Text className="text-xl mb-4">
    {applanguage === "eng" ? Translations.eng.active_bookings : Translations.arb.active_bookings}
  </Text>

  {isLoading ? (
  // Show shimmer placeholders
  [...Array(3)].map((_, index) => (
    <View className="bg-white w-full rounded-xl shadow-md border border-gray-100 mb-3 p-4">
      {/* Top section - Driver info */}
      <View className="flex-row items-center mb-4">
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          className="h-14 w-14 rounded-full mr-4"
        />
        <ShimmerPlaceholder
          LinearGradient={LinearGradient} 
          className="h-6 w-40 rounded"
        />
      </View>
      
      {/* Divider */}
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        className="w-full h-[1px] my-2"
      />
      
      {/* Bottom section - Booking details */}
      <View className="flex-row items-center my-4">
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          className="h-10 w-10 rounded-full mr-4"
        />
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          className="h-6 w-48 rounded"
        />
      </View>
      
      {/* Buttons */}
      <View className="flex-row justify-between mt-4">
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          className="h-12 w-[45%] rounded-xl"
        />
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          className="h-12 w-[45%] rounded-xl"
        />
      </View>
    </View>
  ))
) : bookings.length === 0 ? (
  <Text className="text-center mt-36">
    {applanguage === "eng" ? Translations.eng.no_booking_available : Translations.arb.no_booking_available}
  </Text>
) : (
    bookings.map((booking) => (
      <View
        key={booking._id}
        className="bg-white w-full rounded-xl shadow-md border border-gray-100 mb-3"
      >
        <View className="flex-row items-start py-6 px-4">
        {booking?.driver?.driverPicture && (
 <Image
 source={{ uri: booking?.driver?.driverSignedUrl }}
 className="h-16 w-16 rounded-full mr-4"
 resizeMode="cover"
/>

)}
          <View className="ml-2 flex flex-col items-start gap-y-1">
            <Text className="text-gray-600 font-extrabold text-xl">
              {booking?.driver?.driverName || "Driver not assigned"} {" "}
            </Text>
            <Text className="text-[#164F90] font-thin text-lg">
              {booking?.driver?.driverAddress} 
            </Text>
          </View>
        </View>
        <View className="flex-1 h-[1px] border-t border-[#e3e2e2] relative" />

        <View className="flex-col justify-left text-left gap-2 items-start py-6 px-5">
          <View className="flex-row justify-center items-center gap-4">

          <Calendar size={20} color="#6B7280" className="rounded-full border-[1px] p-6 border-black" />
          <View className="flex-col gap-y-2">
            <Text className="font-extrabold text-xl">
              {booking.pickUpTimings}, {new Date(booking.date).toLocaleDateString()}
            </Text>
            <Text className="text-[#383F47] text-lg">
              Status: {booking?.updateStatus}
            </Text>
            <Text className="text-[#6a6c6e] text-lg w-[100%]">
            You can cancel 1hr before the service time
                        </Text>
          </View>
          </View>
            <View className="flex flex-row justify-center   w-full">
              <TouchableOpacity
              onPress={()=>router.push('/activities/cancellation')}
              className="my-4 mx-2 border-2 border-[#164F90] rounded-xl py-4 px-10  w-[45%]">
                <Text className="text-center text-[#164F90] font-semibold">
                  {applanguage === "eng" ? Translations.eng.cancel : Translations.arb.cancel}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/activities/bookingdetails",
                    params: { bookingId: booking._id }, // Use the actual booking ID
                  })
                }
                className="my-4 mx-2 bg-[#FFB800] rounded-xl py-4 px-10 shadow-lg w-[45%]"
                style={{
                  elevation: 6, // 👈 Android shadow
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.50,
                  shadowRadius: 3.84,
                }}
              >
                <Text className="text-center text-black font-semibold">
                  {applanguage === "eng" ? Translations.eng.view_details : Translations.arb.view_details}
                </Text>
              </TouchableOpacity>
            </View>
        </View>
      </View>
    ))
  )}
</ScrollView>
  </View>
  );
};

export default index;
 