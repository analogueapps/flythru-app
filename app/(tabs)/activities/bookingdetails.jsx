import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Plus, Minus } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router, useLocalSearchParams } from "expo-router";  

import dp from "../../../assets/images/dpfluthru.jpg"
import call from "../../../assets/images/call.png"
import hash from "../../../assets/images/hash.png"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BOOKING_DETAILS, VERIFY_ORDER } from "../../../network/apiCallers";
import { useToast } from "react-native-toast-notifications";
import { langaugeContext } from "../../../customhooks/languageContext";
import Translations from "../../../language";
import verticalline from "../../../assets/images/verticalline.png";


const bookingdetails = () => {
  const insets = useSafeAreaInsets();
  const { fromSelectLocation = "false" } = useLocalSearchParams();
  const { userId, orderId, baggageId, bookingId } = useLocalSearchParams();
  const isFromSelectLocation = JSON.parse(fromSelectLocation.toLowerCase());
    const [bookingData , setBookingData] = useState() 
  // const { bookingId } = useLocalSearchParams(); 
  const toast = useToast()
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
      console.log("bookingid : ", bookingId)

      setBookingData(res.data); 
    } catch (error) {
      // console.error("Error fetching booking details:", error?.response?.data || error);
      toast.show(error?.response?.data?.message || "Failed to fetch booking details");
    }
  };

  const verifyOrder = async (orderId , baggageId , userId,) => {
      try {
        const res = await VERIFY_ORDER(orderId , baggageId , userId,);
        console.log("Response address", res.data);
  
        if (res.data) {
          console.log(res.data);
        } else {
          console.log("Unexpected response format:", res);
          console.log([]);
        } 
      } catch (error) {
        console.log("Error verifying ", error);
        console.log([]);
      }
    };
  
  
    
    useEffect(() => {
      if (userId && orderId && baggageId) {
        verifyOrder(orderId, baggageId, userId);
      }
    }, [userId, orderId, baggageId]);
    


    useEffect(() => {
      if (bookingId) {
        fetchBookingDetails(); 
        console.log("bookingid : ", bookingId)

      }
    }, [bookingId]);
    

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
        className="p-6 absolute w-full mt-5"
      >
        <View className="flex-row  items-center mt-5">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-[rgba(255,255,255,0.8)] rounded-full p-1"
          >
            <ChevronLeft color="black" size={18} />
          </TouchableOpacity>
          <Text className="text-[18px] text-white ml-3" style={{fontFamily: "CenturyGothic"}}>{
                applanguage==="eng"?Translations.eng.booking_details:Translations.arb.booking_details
              }</Text>
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
            {
                applanguage==="eng"?Translations.eng.baggage_collection:Translations.arb.baggage_collection
              }
            </Text>
            <View className="flex-1 h-[1px] border-t  border-[#00000026] relative" />

            <View className="flex-row justify-between">
              <Text className="text-[#164F90] text-xl">{
                applanguage==="eng"?Translations.eng.baggage_count:Translations.arb.baggage_count
              }</Text>
              <Text className="text-[#164F90] text-xl font-bold">{bookingData?.booking?.baggageCount || "-"}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-[#164F90] text-xl">{
                applanguage==="eng"?Translations.eng.date:Translations.arb.date
              }</Text>
              <Text className="text-[#164F90] text-xl font-bold">{new Date(bookingData?.booking?.date).toLocaleDateString()}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-[#164F90] text-xl">{
                applanguage==="eng"?Translations.eng.time:Translations.arb.time
              }</Text>
              <Text className="text-[#164F90] text-xl font-bold">{bookingData?.time}
              </Text>
            </View> 

           
              <>
                <View className="flex-1 h-[1px] border-t border-dashed border-[#00000026] relative" />
                <View className="flex-row justify-between">
                  <Text className="text-[#164F90] text-xl">{
                applanguage==="eng"?Translations.eng.total_paid:Translations.arb.total_paid
              }</Text>
                  <Text className="text-[#164F90] text-xl font-bold">{bookingData?.price}</Text>
                </View>
              </>
           
          </View>

          <View className="flex flex-row justify-between items-center my-7 gap-2">
            <View className="flex flex-row ">

            <Image
              source={dp}
              className="h-16 w-16 rounded-full mr-4"
              resizeMode="cover"
            />

            <View>
              <Text className="text-[#164F90] text-3xl font-thin">{bookingData?.driver?.driverName || "-"}</Text>
              <Text>{bookingData?.driver?.driverAddress}</Text>
              </View>

            </View>
            <View>
              <Text className="bg-[#FFB648] p-2 rounded-md px-6">{
                applanguage==="eng"?Translations.eng.status:Translations.arb.status
              } : {bookingData?.booking?.bookingStatus}</Text>

            </View>
          </View>


          <View className="flex flex-row justify-start gap-x-5 items-center w-[90%] m-auto">
          <Image
              source={verticalline}
              className="h-36"
              resizeMode="contain"
            /> 

          <View className="flex-col gap-5">
            <View className="flex-col gap-3">
            <Text className="text-[#164F90] text-xl font-bold">{
                applanguage==="eng"?Translations.eng.pick_up:Translations.arb.pick_up
              }</Text>
            <Text className="text-lg">{bookingData?.booking?.pickUpLocation || "-"}</Text>
            </View>

            <View className="flex-col gap-3">
            <Text className="text-[#164F90] text-xl font-bold">{
                applanguage==="eng"?Translations.eng.drop_off:Translations.arb.drop_off
              }</Text>
            <Text className="text-lg">{bookingData?.booking?.dropOffLocation || "-"}</Text>
            </View>
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
          <Text className="text-xl">{
                applanguage==="eng"?Translations.eng.contact_info:Translations.arb.contact_info
              } : {bookingData?.driver?.phoneNumber} </Text>
          </View>

          <View className="flex-row">
          <Image
              source={hash}
              className="h-10 w-10 rounded-full mr-4"
              resizeMode="cover"
            />
          <Text className="text-xl">{
                applanguage==="eng"?Translations.eng.booking_no:Translations.arb.booking_no
              } : {bookingData?.booking?.orderId || "-"}</Text>
          </View>
        </View>


       {/* Modify Slot Button */}
      {/* Conditionally Render Buttons */}
{/* {isFromSelectLocation ? (
    // Show "Go Back" button if coming from select location
    <TouchableOpacity
        onPress={() => router.push("/home")}
        className="border-2 border-[#164F90] rounded-xl py-4 my-5"
    >
        <Text className="text-center text-black font-semibold">
        {
                applanguage==="eng"?Translations.eng.go_back:Translations.arb.go_back
              }
        </Text>
    </TouchableOpacity>
) : (
    // Show "Modify Slot" button if not coming from select location
    <TouchableOpacity
onPress={() => // Example navigation code
                        router.push({
                          pathname: "/activities/cancellation",
                          params: { bookingId: "booking_id" }, // ✅ Pass bookingId correctly
                        })
                        }        className="border-2 border-[#164F90] rounded-xl py-4 my-5"
    >
        <Text className="text-center text-black font-semibold">
        {
                applanguage==="eng"?Translations.eng.modify_slot:Translations.arb.modify_slot
              }        </Text>
    </TouchableOpacity>
)} */}

{isFromSelectLocation ? (
    <TouchableOpacity
        onPress={() => router.back()}
        className="border-2 border-[#164F90] rounded-xl py-4 my-5"
    >
        <Text className="text-center text-black font-semibold">
        {
            applanguage==="eng"?Translations.eng.go_back:Translations.arb.go_back
        }
        </Text>
    </TouchableOpacity>
) : (
    <TouchableOpacity
        onPress={() => 
            router.push({
                pathname: "/activities/cancellation",
                params: { bookingId: bookingId }, // ✅ use actual bookingId
            })
        }
        className="border-2 border-[#164F90] rounded-xl py-4 my-5"
    >
        <Text className="text-center text-black font-semibold">
        {
            applanguage==="eng"?Translations.eng.cancelslot:Translations.arb.cancelslot
        }
        </Text>
    </TouchableOpacity>
)}


        </ScrollView>
       
      </View>
    </View>
  );
};

export default bookingdetails;
