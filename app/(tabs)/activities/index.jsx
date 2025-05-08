import { View, Text, Image, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
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
    const [refreshing, setRefreshing] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    const onRefresh = async () => {
      setRefreshing(true);
      await fetchActivities(); // Reuse your existing fetch function
      setRefreshing(false);
    };
    
    
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
          type: "info",
          text1: "Alert",
          text2: "Please login",
        });
        return;
      }
    
      try {
        const res = await ACTIVITIES(token);
        // Set bookings to res.data.data (the actual array of bookings)
        setBookings(res.data.data || []); // Fallback to empty array if undefined
        console.log("Activities Response:", res.data);
      } catch (error) {
        console.log("Error fetching bookings:", error?.response);
        // Toast.show({
        //   type: "error",
        //   text1: "Error",
        //   text2: error?.response?.data?.message || "Failed to fetch bookings",
        // });
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
  

<ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}
 refreshControl={
  <RefreshControl  refreshing={refreshing} onRefresh={onRefresh} />
}
>
  <Text className="text-xl mb-4" style={{ fontFamily: "Lato" }}>
    {applanguage === "eng" ? Translations.eng.active_bookings : Translations.arb.active_bookings}
  </Text>

  {isLoading ? (
  // Show shimmer placeholders
 

  [...Array(3)].map((_, index) => (
    <View key={index} className="bg-white w-full rounded-xl shadow-md border border-gray-100 mb-3 p-4">
      {/* Top: Driver section */}
      <View className="flex-row items-center mb-4">
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={{ height: 64, width: 64, borderRadius: 32, marginRight: 12 }}
        />
        <View>
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={{ height: 20, width: 140, borderRadius: 6, marginBottom: 6 }}
          />
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={{ height: 16, width: 100, borderRadius: 6 }}
          />
        </View>
      </View>
  
      {/* Divider */}
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={{ height: 1, width: "100%", marginVertical: 8 }}
      />
  
      {/* Bottom: Booking info section */}
      <View className="flex-row items-center mb-4">
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={{ height: 24, width: 24, borderRadius: 12, marginRight: 12 }}
        />
        <View>
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={{ height: 20, width: 180, borderRadius: 6, marginBottom: 6 }}
          />
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={{ height: 16, width: 120, borderRadius: 6, marginBottom: 6 }}
          />
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={{ height: 16, width: 160, borderRadius: 6 }}
          />
        </View>
      </View>
  
      {/* Buttons section */}
      <View className="flex-row justify-between">
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={{ height: 48, width: "45%", borderRadius: 12 }}
        />
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={{ height: 48, width: "45%", borderRadius: 12 }}
        />
      </View>
    </View>
  ))
  

) : bookings.length === 0 ? (
  <Text className="text-center mt-36" style={{ fontFamily: "Lato" }}>
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
            <Text className="text-gray-600 font-extrabold text-xl" style={{ fontFamily: "Lato" }}>
              {booking?.driver?.driverName || "Driver not assigned"} {" "}
            </Text>
            <Text className="text-[#164F90] font-thin text-lg" style={{ fontFamily: "Lato" }}>
              {booking?.driver?.driverAddress} 
            </Text>
          </View>
        </View>
        <View className="flex-1 h-[1px] border-t border-[#e3e2e2] relative" />

        <View className="flex-col justify-left text-left gap-2 items-start py-6 px-5">
          <View className="flex-row justify-center items-center gap-4">

          <Calendar size={20} color="#6B7280" className="rounded-full border-[1px] p-6 border-black" />
          <View className="flex-col gap-y-2">
            <Text className="font-extrabold text-xl" style={{ fontFamily: "Lato" }}>
              {booking.pickUpTimings}, {new Date(booking.date).toLocaleDateString()}
            </Text>
            <Text className="text-[#383F47] text-lg" style={{ fontFamily: "Lato" }}>
            {applanguage === "eng" ? Translations.eng.status : Translations.arb.status}: {booking?.updateStatus || "-"}
            </Text>
            <Text className="text-[#6a6c6e] text-lg w-[100%]" style={{ fontFamily: "Lato" }}>
            {applanguage === "eng" ? Translations.eng.service_time_cancel : Translations.arb.service_time_cancel}
                        </Text>
          </View>
          </View>
            <View className="flex flex-row justify-center   w-full">
              {/* <TouchableOpacity
              onPress={()=>router.push('/activities/cancellation')}
              className="my-4 mx-2 border-2 border-[#164F90] rounded-xl py-4 px-10  w-[45%]">
                <Text className="text-center text-[#164F90] font-semibold" style={{ fontFamily: "Lato" }}>
                  {applanguage === "eng" ? Translations.eng.cancel : Translations.arb.cancel}
                </Text>
              </TouchableOpacity> */}

<TouchableOpacity
  onPress={() => {
    if (booking.bookingStatus !== "Cancelled") {
      router.push("/activities/cancellation");
    }
  }}
  disabled={booking.bookingStatus === "Cancelled"}
  className={`my-4 mx-2 border-2 rounded-xl py-4 px-10 w-[45%] ${
    booking.bookingStatus === "Cancelled"
      ? "border-gray-300 bg-gray-200"
      : "border-[#164F90]"
  }`}
>
  <Text
    className={`text-center font-semibold ${
      booking.bookingStatus === "Cancelled" ? "text-gray-400" : "text-[#164F90]"
    }`}
    style={{ fontFamily: "Lato" }}
  >
    {applanguage === "eng"
      ? Translations.eng.cancel
      : Translations.arb.cancel}
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
                <Text className="text-center text-black font-semibold" style={{ fontFamily: "Lato" }}>
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
 