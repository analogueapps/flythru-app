import { View, Text, Image, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Plus, Minus } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router, useLocalSearchParams } from "expo-router";
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';

import dp from "../../../assets/images/dpfluthru.jpg"
import call from "../../../assets/images/call.png"
import hash from "../../../assets/images/hash.png"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BOOKING_DETAILS, VERIFY_ORDER } from "../../../network/apiCallers";
import { langaugeContext } from "../../../customhooks/languageContext";
import Translations from "../../../language";
import verticalline from "../../../assets/images/verticalline.png";
import Toast from "react-native-toast-message";
import { useFormik } from "formik";


const bookingdetails = () => {
  const insets = useSafeAreaInsets();
  const { fromSelectLocation = "false" } = useLocalSearchParams();
  const { userId, orderId, baggageId, bookingId, paymentId, message } = useLocalSearchParams();
  console.log("mmmmmmmmmmmmmmmmmmmmmm", message, bookingId)
  const isFromSelectLocation = JSON.parse(fromSelectLocation.toLowerCase());
  const [bookingData, setBookingData] = useState()
  // const { bookingId } = useLocalSearchParams(); 
  const [refreshing, setRefreshing] = useState(false);

  const { applanguage } = langaugeContext()
  const [verifiedBookingId, setVerifiedBookingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data load or wrap actual fetching logic
  useEffect(() => {
    if (bookingData) {
      setIsLoading(false);
    }
  }, [bookingData]);


  const onRefresh = async () => {
    setRefreshing(true);
    await fetchActivities(); // Reuse your existing fetch function
    setRefreshing(false);
  };



  // useEffect(() => {
  //   console.log("Verifying order with orderId:", orderId, "and paymentId:", paymentId);
  //   const verifyOrder = async () => {
  //     if (!orderId || !paymentId) return;

  //     try {
  //       const res = await VERIFY_ORDER(orderId, paymentId);
  //       console.log("Verify order response:", res.data);


  //       if (res.data) {
  //         Toast.show({ type: "success", text1: res.data.message });
  //         setVerifiedBookingId(res.data.bookingId);
  //       } else {
  //         console.log("Unexpected response format:", res);
  //       }
  //     } catch (error) {
  //       console.log("Error verifying order:", error);
  //       Toast.show({ type: "error", text1: "Verification failed" });
  //     }
  //   };

  //   verifyOrder();
  // }, [orderId, paymentId]);



  // useEffect(() => {
  //   if (orderId && paymentId) {
  //     verifyOrder(orderId, paymentId);
  //     console.log("Verifying order with orderId:", orderId, "and paymentId:", paymentId);

  //   }
  // }, [orderId, paymentId]);



  const fetchBookingDetails = async (id) => {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      Toast.show(
        {
          type: "error",
          text1: "Token not found",
        }
      );
      return;
    }

    try {
      console.log("Fetching details for bookingId:", id);
      const res = await BOOKING_DETAILS(id, token);
      setBookingData(res.data);
      console.log("Booking details response:", res.data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error?.response?.data?.message || "Failed to fetch booking details",
      });
    }
  };



  useEffect(() => {
    const finalBookingId = verifiedBookingId || bookingId;
    if (finalBookingId) {
      fetchBookingDetails(finalBookingId);
      console.log("Using bookingId:", finalBookingId);
    }
  }, [verifiedBookingId, bookingId]);


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

          {isFromSelectLocation ? (
            <TouchableOpacity
              onPress={() => {
                // router.dismissAll(); // <-- this clears the current stack history
                router.replace("/(tabs)/home");
              }}
              className="bg-[rgba(255,255,255,0.8)] rounded-full p-1"
            >
              <ChevronLeft color="black" size={18} />
            </TouchableOpacity>
          ) : message === "notify" ? <TouchableOpacity
            onPress={() => {
              // router.dismissAll(); // <-- this clears the current stack history
              router.replace("/(tabs)/home");
            }}
            className="bg-[rgba(255,255,255,0.8)] rounded-full p-1"
          >
            <ChevronLeft color="black" size={18} />
          </TouchableOpacity> : (
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-[rgba(255,255,255,0.8)] rounded-full p-1"
            >
              <ChevronLeft color="black" size={18} />
            </TouchableOpacity>
          )
          }
          <Text className="text-[18px] text-white ml-3" style={{ fontFamily: "CenturyGothic" }}>{
            applanguage === "eng" ? Translations.eng.booking_details : Translations.arb.booking_details
          }</Text>
        </View>
      </View>

      <View
        className="bg-white self-center absolute top-[170px] p-6 z-10 rounded-xl w-[90%] shadow-lg"
        style={{
          maxHeight: "79%",
        }}
      >

        {!bookingData ? (
          // SHIMMER PLACEHOLDER
          <View className="p-5 bg-[#164F901A] border-[#00000026] rounded-2xl border-[1px] w-[90%] self-center mt-[20px]">
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              style={{ height: 30, width: 180, marginBottom: 15, borderRadius: 8 }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              style={{ height: 1, marginBottom: 15 }}
            />

            {[1, 2, 3, 4].map((_, i) => (
              <ShimmerPlaceHolder
                key={i}
                LinearGradient={LinearGradient}
                style={{ height: 20, width: '100%', marginBottom: 15, borderRadius: 6 }}
              />
            ))}

            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              style={{ height: 60, width: '100%', marginVertical: 20, borderRadius: 10 }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              style={{ height: 120, width: '100%', marginBottom: 20, borderRadius: 10 }}
            />
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              style={{ height: 40, width: '100%', borderRadius: 10 }}
            />
          </View>
        ) : (
          // ACTUAL DATA RENDER
          <ScrollView className="" showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View className="p-5 bg-[#164F901A] border-[#00000026] rounded-2xl border-[1px] flex-col gap-5">
              <Text className="text-[#164F90] text-2xl font-bold" style={{ fontFamily: "Lato" }}>
                {
                  applanguage === "eng" ? Translations.eng.baggage_collection : Translations.arb.baggage_collection
                }
              </Text>
              <View className="flex-1 h-[1px] border-t  border-[#00000026] relative" />

              <View className="flex-row justify-between">
                <Text className="text-[#164F90] text-xl" style={{ fontFamily: "Lato" }}>{
                  applanguage === "eng" ? Translations.eng.baggage_count : Translations.arb.baggage_count
                }</Text>
                <Text className="text-[#164F90] text-xl font-bold" style={{ fontFamily: "Lato" }}>{bookingData?.booking?.baggageCount || "-"}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-[#164F90] text-xl" style={{ fontFamily: "Lato" }}>{
                  applanguage === "eng" ? Translations.eng.date : Translations.arb.date
                }</Text>
                <Text className="text-[#164F90] text-xl font-bold" style={{ fontFamily: "Lato" }}>{bookingData?.booking?.date}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-[#164F90] text-xl" style={{ fontFamily: "Lato" }}>{
                  applanguage === "eng" ? Translations.eng.time : Translations.arb.time
                }</Text>
                <Text className="text-[#164F90] text-xl font-bold">{bookingData?.booking?.pickUpTimings || bookingData?.booking?.time}
                </Text>
              </View>


              <>
                <View className="flex-1 h-[1px] border-t border-dashed border-[#00000026] relative" />
                <View className="flex-row justify-between">
                  <Text className="text-[#164F90] text-xl" style={{ fontFamily: "Lato" }}>{
                    applanguage === "eng" ? Translations.eng.total_paid : Translations.arb.total_paid
                  }</Text>
                  <Text className="text-[#164F90] text-xl font-bold" style={{ fontFamily: "Lato" }}>{bookingData?.price}</Text>
                </View>
              </>

            </View>

            {/* <View className="flex flex-row justify-between items-center my-7 gap-2 bg-slate-400">
            <View className="flex flex-row ">

            {bookingData?.booking?.driver?.driverName && <Image
  source={{ uri: bookingData?.booking?.driver?.driverSignedUrl }}
  className="h-16 w-16 rounded-full mr-4"
  resizeMode="cover"
/>
}

            <View>
              <Text className="text-[#164F90] text-3xl font-thin" style={{ fontFamily: "Lato" }}>{bookingData?.booking?.driver?.driverName}</Text>
              <Text style={{ fontFamily: "Lato" }}>{bookingData?.booking?.driver?.driverAddress}</Text>
              </View>

            </View>
            <View>
              <Text className="bg-[#FFB648] p-2 rounded-md px-6" style={{ fontFamily: "Lato" }}>{
                applanguage==="eng"?Translations.eng.status:Translations.arb.status
              } : {bookingData?.booking?.updateStatus || "-"}</Text>

            </View>
          </View> */}

            {/* <View className="flex flex-row justify-between items-center my-7 gap-2 bg-slate-400">
  <View className="flex flex-row">
    {bookingData?.booking?.driver?.driverName && (
      <Image
        source={{ uri: bookingData?.booking?.driver?.driverSignedUrl }}
        className="h-16 w-16 rounded-full mr-4"
        resizeMode="cover"
      />
    )}

    <View style={{ flexShrink: 1 }}>
      <Text
        className="text-[#164F90] font-thin"
        style={{
          fontFamily: "Lato",
          flexWrap: "wrap",
          maxWidth: "80%",
          fontSize: bookingData?.booking?.driver?.driverName.length > 7 ? 18 : 24,  // Decrease font size if length > 7
        }}
        numberOfLines={2}
      >
        {bookingData?.booking?.driver?.driverName}
      </Text>
      <Text
        style={{
          fontFamily: "Lato",
          flexWrap: "wrap",
          maxWidth: "80%",
          fontSize: bookingData?.booking?.driver?.driverName.length > 7 ? 14 : 16,  // Optionally adjust address size too
        }}
        numberOfLines={2}
      >
        {bookingData?.booking?.driver?.driverAddress}
      </Text>
    </View>
  </View>

  <View style={{ maxWidth: 150 }}>
    <Text
      className="bg-[#FFB648] p-2 rounded-md px-6"
      style={{ fontFamily: "Lato", flexShrink: 1 }}
    >
      {applanguage === "eng"
        ? Translations.eng.status
        : Translations.arb.status} :{" "}
      {bookingData?.booking?.updateStatus || "-"}
    </Text>
  </View>
</View> */}

            <View className="flex flex-wrap flex-row justify-between my-7 gap-2 p-2">
              {/* Left Section */}
              <View className="flex flex-row flex-shrink flex-grow basis-[65%]">
                {bookingData?.booking?.driver?.driverName && (
                  <Image
                    source={{ uri: bookingData?.booking?.driver?.driverSignedUrl }}
                    className="h-16 w-16 rounded-full mr-4"
                    resizeMode="cover"
                  />
                )}

                <View style={{ flexShrink: 1 }}>
                  <Text
                    className="text-[#164F90] font-thin flex-1"
                    style={{
                      fontFamily: "Lato",
                      fontSize:
                        bookingData?.booking?.driver?.driverName?.length > 20 ? 16 :
                          bookingData?.booking?.driver?.driverName?.length > 12 ? 18 :
                            22,
                      // maxWidth: "90%",
                    }}

                  >
                    {bookingData?.booking?.driver?.driverName}
                  </Text>

                  <Text
                    style={{
                      flex: 1,
                      fontFamily: "Lato",
                      fontSize:
                        bookingData?.booking?.driver?.driverAddress?.length > 30 ? 12 :
                          bookingData?.booking?.driver?.driverAddress?.length > 20 ? 14 :
                            16,
                      // maxWidth: "90%",
                    }}

                  >
                    {bookingData?.booking?.driver?.driverAddress}
                  </Text>
                </View>
              </View>

              {/* Right Section (Status) */}
              <View className="flex-shrink mt-2">
                <Text
                  className="bg-[#FFB648] p-2 rounded-md text-center"
                  style={{
                    fontFamily: "Lato",
                    minWidth: 100,
                  }}
                >
                  {applanguage === "eng"
                    ? Translations.eng.status
                    : Translations.arb.status}{" "}
                  :
                  {bookingData?.booking?.updateStatus || "-"}
                  {/* hahahahahahahahahahahahaha */}
                </Text>
              </View>
            </View>





            <View className="flex flex-row justify-start gap-x-5 items-start w-[90%] m-auto">
              <Image
                source={verticalline}
                className="h-24 mt-3"
                resizeMode="contain"
              />

              <View className="flex-col gap-5 flex-1">
                <View className="flex-col gap-1">
                  <Text className="text-[#164F90] text-xl font-bold" style={{ fontFamily: "Lato" }}>{
                    applanguage === "eng" ? Translations.eng.pick_up : Translations.arb.pick_up
                  }</Text>
                  <Text className="" style={{ fontFamily: "Lato" }}>{bookingData?.booking?.pickUpLocation || "-"}</Text>
                </View>

                <View className="flex-col gap-1">
                  <Text className="text-[#164F90] text-xl font-bold" style={{ fontFamily: "Lato" }}>{
                    applanguage === "eng" ? Translations.eng.drop_off : Translations.arb.drop_off
                  }</Text>
                  <Text className="text-lg" style={{ fontFamily: "Lato" }}>
                    {/* {bookingData?.booking?.dropOffLocation || "-"} */}
                    {
                      applanguage === "eng" ? Translations.eng.airport : Translations.arb.airport
                    }
                  </Text>
                </View>
              </View>

            </View>

            <View className="flex-1 h-[1px] border-t  border-[#00000026] relative my-5" />

            <View className="flex flex-col justify-left gap-5">
              <View className="flex-row items-center">
                <Image
                  source={call}
                  className="h-10 w-10 rounded-full mr-4"
                  resizeMode="cover"
                />
                <Text className="text-xl" style={{ fontFamily: "Lato" }}>{
                  applanguage === "eng" ? Translations.eng.contact_info : Translations.arb.contact_info
                } : {bookingData?.booking?.driver?.phoneNumber || "-"} </Text>
              </View>

              <View className="flex-row items-center">
                <Image
                  source={hash}
                  className="h-10 w-10 rounded-full mr-4"
                  resizeMode="cover"
                />
                <Text className="text-xl" style={{ fontFamily: "Lato" }}>{
                  applanguage === "eng" ? Translations.eng.booking_no : Translations.arb.booking_no
                } : {bookingData?.booking?.orderId || "-"}</Text>
              </View>
            </View>

            {(bookingData?.booking?.bookingStatus || "").toLowerCase() === "cancelled" &&

              <Text className="text-red-500 text-center mt-4" style={{ fontFamily: "Lato" }}>
                {applanguage === "eng" ? Translations.eng.this_booking_is_cancelled : Translations.arb.this_booking_is_cancelled}
              </Text>
            }


            {isFromSelectLocation ? (
              <TouchableOpacity

                onPress={() => {
                  router.dismissAll(); // <-- this clears the current stack history
                  router.replace("/(tabs)/home");
                }}
                className="border-2 border-[#164F90] rounded-xl py-4 my-5"
              >
                <Text className="text-center text-black font-semibold" style={{ fontFamily: "Lato" }}>
                  {
                    applanguage === "eng" ? Translations.eng.go_back : Translations.arb.go_back
                  }
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                disabled={(bookingData?.booking?.bookingStatus || "").toLowerCase() === "cancelled" || bookingData?.booking?.updateStatus?.toLowerCase() === 'dropped at airport'}
                onPress={() =>
                  router.push({
                    pathname: "/activities/cancellation",
                    params: { bookingId: bookingId },
                  })
                }
                className={`border-2 rounded-xl py-4 my-5 ${((bookingData?.booking?.bookingStatus || "").toLowerCase() === "cancelled" || bookingData?.booking?.updateStatus?.toLowerCase() === 'dropped at airport')
                  ? "border-gray-400 bg-gray-200"
                  : "border-[#164F90]"
                  }`}
              >
                <Text className={`text-center font-semibold ${((bookingData?.booking?.bookingStatus || "").toLowerCase() === "cancelled" || bookingData?.booking?.updateStatus?.toLowerCase() === 'dropped at airport')
                  ? "text-gray-400"
                  : "text-black"
                  }`}>
                  {
                    applanguage === "eng"
                      ? Translations.eng.cancelslot
                      : Translations.arb.cancelslot
                  }
                </Text>
              </TouchableOpacity>

            )}


          </ScrollView>
        )}



      </View>
    </View>
  );
};

export default bookingdetails;





{/* Modify Slot Button */ }
{/* Conditionally Render Buttons */ }
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