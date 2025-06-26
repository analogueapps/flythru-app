//search 



import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
  Modal,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router, useLocalSearchParams } from "expo-router";
import {
  ADD_FLIGHTS,
  ALL_FLIGHTS,
  ALL_FLIGHTS_CLIENT,
} from "../../../network/apiCallers";
import ShimmerPlaceHolder, {
  createShimmerPlaceholder,
} from "react-native-shimmer-placeholder";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { langaugeContext } from "../../../customhooks/languageContext";
import Translations from "../../../language";
import axios from "axios";
import { LOCAL_URL } from "../../../network/environment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import flightlogo from "../../../assets/images/flight.png";
import jazeera from "../../../assets/images/jazeera.png";

import Toast from "react-native-toast-message";
import { useFormik } from "formik";
import FlightForm from "../../../components/FlightForm";

import addFlightSchema from "../../../yupschema/addFlight";
import AddFlightForm from "../../../components/addflightform";
import SuccessModal from "../../successmodal";
import AlertModal from "../../alertmodal";

const Search = () => {
  const insets = useSafeAreaInsets();
  const { flightNumber, departureDate, departureTime, from, to } =
    useLocalSearchParams();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
  const [animatedValues, setAnimatedValues] = useState([]);
  const { applanguage } = langaugeContext();
  const [specialflightDatas, setSpecialflightDatas] = useState([]);
  const [flightDatas, setFlightDatas] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loginChecked, setLoginChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isModalShow, setIsModalShow] = useState(false)
  const [isSuccessModalShow, setIsSuccessModalShow] = useState(false)
  const [manualSubmitData, setManualSubmitData] = useState(false)

  const DashedLine = ({ dashCount = 20, dashColor = "#164F90" }) => (
    <View className="flex-row flex-1 justify-between items-center">
      {Array.from({ length: dashCount }).map((_, index) => (
        <View
          key={index}
          className="h-[1px]"
          style={{
            width: 4,
            backgroundColor: dashColor,
            marginRight: index !== dashCount - 1 ? 2 : 0,
          }}
        />
      ))}
    </View>
  );

  useEffect(() => {
    // Check if the user is logged in when the component mounts
    console.log(
      departureDate,
      flightNumber,
      "useEffect called with params:",
      flightNumber,
      departureTime
    );
  }, []);

  const handleTime = (time) => {
    const formattedTime = time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    console.log("⏰ Formatted Time:", formattedTime);

    // Set in Formik — CRUCIAL
    formik.setFieldValue("departureTime", formattedTime);
  };

  const formik = useFormik({
    initialValues: {
      // dep_date: "",
      // flight_time: "",
      // flight_number: "",
      // flight_from: "KWI",
      // flight_to: "",


      dep_date: "",
      flight_time: "",
      flight_number: "",
      flight_from: "KWI",
      flight_to: "",
    },





    validationSchema: addFlightSchema(applanguage),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      try {
        // Validate required fields
        if (
          !values.dep_date ||
          !values.flight_time ||
          !values.flight_number ||
          !values.flight_to
        ) {
          // Toast.show({
          //   type: "error",
          //   text1: "Please fill all required fields",
          // });
          setErrorMessage("Please fill all required fields")
          setIsModalShow(true)
          return;
        }

        // Format date consistently (DD-MM-YYYY)
        const [day, month, year] = values.dep_date.split("-");
        const formattedDate = `${day}-${month}-${year}`;



        // const [day, month, year] = departureDate.split("-"); // assuming format is DD-MM-YYYY
        const [hours, minutes] = values.flight_time.split(":"); // assuming format is HH:mm

        const selectedDateTime = new Date(
          `${year}-${month}-${day}T${hours}:${minutes}:00`
        );

        const twelveHoursLater = new Date(Date.now() + 12 * 60 * 60 * 1000); // current time + 12 hrs

        if (selectedDateTime <= twelveHoursLater) {
          setErrorMessage("Departure must be at least 12 hours from now");
          setIsModalShow(true);
          return;
        }

        // Prepare submission data
        const flightData = {
          dep_date: formattedDate,
          flight_time: values.flight_time,
          flight_number: values.flight_number,
          flight_from: values.flight_from,
          flight_to: values.flight_to,
        };

        // ✅ Send API call
        await addFlightshandler(flightData);
        setManualSubmitData({ flightData: JSON.stringify(flightData), departureDate: formattedDate, departureTime: values.flight_time, })
        // ✅ Pass data to baggage screen
        // router.push({
        //   pathname: "/home/baggage",
        //   params: {
        //     flightData: JSON.stringify(flightData),
        //     departureDate: formattedDate,
        //     departureTime: values.flight_time,
        //   },
        // });
      } catch (error) {
        console.error("Submission error:", error);
        // Toast.show({
        //   type: "error",
        //   text1: "Failed to submit flight details",
        // });
        setErrorMessage("Failed to submit flight details")
        setIsModalShow(true)
      }
    },
  });


  const addFlightshandler = async (flightData) => {
    setLoading(true);
    const token = await AsyncStorage.getItem("authToken");

    if (!token) {
      // Toast.show({
      //   type: "error",
      //   text1: "No token found. Please log in.",
      // });
      setErrorMessage("Please login")
      setIsModalShow(true)
      return;
    }

    try {
      const res = await ADD_FLIGHTS(flightData, token);
      console.log(res.data.message);
      // Toast.show({
      //   type: "success",
      //   text1: res.data.message,
      // });
      setSuccessMessage(res.data.message)
      setIsSuccessModalShow(true)
    } catch (error) {
      console.log("Error updating profile:", error?.response);
      // Toast.show({
      //   type: "info",
      //   text1: error?.response?.data?.message || "Failed to update profile",
      // });
      setErrorMessage(error?.response?.data?.message || "Failed to update profile")
      setIsModalShow(true)
    } finally {
      setLoading(false);
    }
  };


  const DashedLine2 = ({
    dashCount = 40,
    dashColor = "#cdcdcd",
    dashWidth = 4,
    dashSpacing = 1,
  }) => (
    <View className="flex-row flex-1 justify-between items-center">
      {Array.from({ length: dashCount }).map((_, index) => (
        <View
          key={index}
          style={{
            width: dashWidth,
            height: 1,
            backgroundColor: dashColor,
            marginRight: index !== dashCount - 1 ? dashSpacing : 0,
          }}
        />
      ))}
    </View>
  );


  // const formatDate = (isoDateStr) => {

  //   const date = new Date(isoDateStr); // Handles "2025-05-12T14:30:00Z"

  //   const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  //   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  //     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  //     const day = date.getDate().toString().padStart(2, '0');       // dd
  //     const month = months[date.getMonth()];                        // MMM
  //     const year = date.getFullYear();                              // yyyy
  //     const weekday = days[date.getDay()];                          // Day
  //     console.log('isoDateStr,',date,date.getDate(),day,month,year,weekday);

  //   return `${day} ${month} ${year} ${weekday}`;
  // };

  const formatDate = (isoDateStr) => {
    const date = new Date(isoDateStr);

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    const weekday = days[date.getUTCDay()];

    return `${day} ${month} ${year} ${weekday}`;
  };

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem("authToken");
    setIsLoggedIn(!!token);
    setLoginChecked(true); // ✅ ensure login state is ready
  };

  // useEffect(() => {
  //   console.log("yayayayayayaya",departureDate)
  // },[])

  // useFocusEffect for re-checking when screen gains focus
  useFocusEffect(
    useCallback(() => {
      checkLoginStatus();
    }, [])
  );

  useEffect(() => {
    if (flights.length > 0) {
      const values = flights.map(() => new Animated.Value(500));
      setAnimatedValues(values);

      values.forEach((animatedValue, index) => {
        setTimeout(() => {
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }).start();
        }, index * 150);
      });
    }
  }, [flights]);

  const fetchSingleFlights = async () => {
    try {
      const res = await ALL_FLIGHTS({
        flightNumber,
        departureDate,
        departureTime,
        from,
        to,
      });
      console.log(
        "resres res res res res res res",
        res?.data?.allFlights,
        departureDate,
        departureTime
      );
      if (res.status === 200 && res.data) {
        if (res?.data?.allFlights) {
          let transformedFlights = res.data.allFlights.map((flight) => ({
            _id: flight._id,
            airline: { name: flight.flightName || "Unknown Airline" },
            flight: { number: flight.flightNumber || "N/A" },
            departure: {
              scheduled: flight.departureDateTime || null,
              airport: flight.startingFrom || "Unknown Airport",
              iata: flight.startingCode || "",
            },
            arrival: {
              scheduled: flight.arrivalDateTime || null,
              airport: flight.ending || "Unknown Airport",
              iata: flight.endingCode || "",
            },
            timing: flight.timing || "N/A",
          }));
          return transformedFlights;
        }
      } else {
        setErrorMessage(res?.data?.message || res?.errors || 'Unknown error')
        setIsModalShow(true)
      }
    } catch (error) {
      console.log("Fetch error:////////////////////////", error.response.data);
      return [];
    }
  };

  useEffect(() => {
    const fetchAllFlights = async () => {
      setLoading(true);
      try {
        const [dbFlights, apiFlights] = await Promise.all([
          fetchSingleFlights(),
          // getAllFlight(), // Now this will properly return the flight data
        ]);

        setSpecialflightDatas(dbFlights || []);
        // setFlightDatas(apiFlights || []);
      } catch (error) {
        console.error("Error fetching flights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllFlights();
  }, [departureDate, flightNumber]);
  const getFlightDuration = (departure, arrival) => {
    const depTime = new Date(departure);
    const arrTime = new Date(arrival);

    const diffMs = arrTime - depTime; // Difference in milliseconds
    const diffMins = Math.floor(diffMs / 60000); // Convert to total minutes

    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;

    let result = "";
    if (hours > 0) result += `${hours} hour${hours > 1 ? "s" : ""} `;
    if (minutes > 0) result += `${minutes} minute${minutes > 1 ? "s" : ""}`;

    return result.trim() || "0 minutes";
  };

  return (
    <View className="flex-1">
      {/* Header Background Image */}
      {isSuccessModalShow && <SuccessModal heading="Success" message={successMessage} onClose={() => {
        setIsSuccessModalShow(false); router.push({
          pathname: "/home/baggage",
          params: { ...manualSubmitData },
        });;
      }} />}
      {isModalShow && <AlertModal message={errorMessage} onClose={() => setIsModalShow(false)} />}

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
        <View className="flex-row items-center mt-5">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-[rgba(255,255,255,0.8)] rounded-full p-1"
          >
            <ChevronLeft color="black" size={18} />
          </TouchableOpacity>
          <Text
            className="text-[18px] text-white ml-3 "
            style={{ fontFamily: "CenturyGothic" }}
          >
            {applanguage === "eng"
              ? Translations.eng.search_result
              : Translations.arb.search_result}{" "}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>
        <Modal
          visible={showLoginPopup}
          transparent
          animationType="fade"
          onRequestClose={() => setShowLoginPopup(false)}
        >
          <View className="flex-1 bg-black/40 justify-center items-center px-4">
            <View className="w-[90%] bg-white rounded-2xl p-6 shadow-xl">
              <Text
                className="text-xl font-bold text-center mb-2"
                style={{ fontFamily: "Lato" }}
              >
                You're not logged in
              </Text>
              <Text
                className="text-base text-center text-gray-700 mb-5"
                style={{ fontFamily: "Lato" }}
              >
                Would you like to log in now?
              </Text>

              <View className="flex-row justify-between gap-x-4">
                <TouchableOpacity
                  className="flex-1 bg-gray-200 py-3 rounded-xl"
                  onPress={() => setShowLoginPopup(false)}
                >
                  <Text
                    className="text-gray-800 font-bold text-center"
                    style={{ fontFamily: "Lato" }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 bg-[#FFB648] py-3 rounded-xl"
                  style={{
                    elevation: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.5,
                    shadowRadius: 3.84,
                  }}
                  onPress={() => {
                    setShowLoginPopup(false);
                    router.replace("/(auth)");
                  }}
                >
                  <Text
                    className="text-black font-bold text-center"
                    style={{ fontFamily: "Lato" }}
                  >
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Display Date */}
        <View className="flex flex-row justify-between items-center mb-6 mx-auto w-full">
          <Text className="text-[#696969] text-lg"> {applanguage === "eng"
            ? Translations.eng.search_results
            : Translations.arb.search_results}{" "}</Text>
          <Text className="text-[#164F90] font-bold">
            {" "}
            {applanguage === "eng"
              ? Translations.eng.date
              : Translations.arb.date}{" "}
            : {departureDate}
          </Text>
        </View>

        {/* Show shimmer if loading */}
        {loading ? (
          <>
            {[1, 2, 3, 4].map((_, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: "#fff",
                  padding: 12,
                  borderRadius: 12,
                  marginBottom: 12,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 4,
                }}
              >
                {/* Flight Header */}
                <View className="flex-row items-start py-4">
                  {/* Airline Logo */}
                  <ShimmerPlaceholder
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                    }}
                    shimmerColors={["#f6f7f8", "#e9ecef", "#f6f7f8"]}
                  />
                  <View className="ml-3">
                    {/* Flight Name */}
                    <ShimmerPlaceholder
                      style={{
                        width: 120,
                        height: 18,
                        borderRadius: 4,
                        marginBottom: 4,
                      }}
                    />
                    {/* Flight Number */}
                    <ShimmerPlaceholder
                      style={{
                        width: 80,
                        height: 14,
                        borderRadius: 4,
                      }}
                    />
                  </View>
                </View>

                {/* Divider */}
                <View
                  style={{
                    height: 1,
                    backgroundColor: "#e1e1e1",
                    marginVertical: 8,
                  }}
                />

                {/* Flight Details */}
                <View className="flex-row justify-between items-center">
                  {/* Departure */}
                  <View>
                    <ShimmerPlaceholder
                      style={{
                        width: 60,
                        height: 24,
                        borderRadius: 4,
                      }}
                    />
                    <ShimmerPlaceholder
                      style={{
                        width: 80,
                        height: 14,
                        borderRadius: 4,
                        marginTop: 4,
                      }}
                    />
                  </View>

                  {/* Duration */}
                  <View className="flex-1 items-center">
                    <ShimmerPlaceholder
                      style={{
                        width: 100,
                        height: 14,
                        borderRadius: 4,
                      }}
                    />
                    <ShimmerPlaceholder
                      style={{
                        width: 80,
                        height: 14,
                        borderRadius: 4,
                        marginTop: 4,
                      }}
                    />
                  </View>

                  {/* Arrival */}
                  <View>
                    <ShimmerPlaceholder
                      style={{
                        width: 60,
                        height: 24,
                        borderRadius: 4,
                      }}
                    />
                    <ShimmerPlaceholder
                      style={{
                        width: 80,
                        height: 14,
                        borderRadius: 4,
                        marginTop: 4,
                      }}
                    />
                  </View>
                </View>
              </View>
            ))}
          </>
        ) : specialflightDatas.length || flightDatas.length ? (
          <>
            {/* Special Flights */}
            {specialflightDatas.map((flight, index) => {
              console.log(
                "flight flight",
                flight.departure.scheduled.split("T")[0]
              );

              return (
                flight.arrival.scheduled ?
                  <TouchableOpacity
                    key={`special-${index}`}
                    // onPress={() => {
                    //   if (!loginChecked) return; 
                    //   if (isLoggedIn) {
                    //   router.push({
                    //     pathname: "/home/baggage",
                    //     params: { flightData: JSON.stringify(flight) },
                    //   })}
                    //   else{
                    //     setShowLoginPopup(true)

                    //   }
                    // }}
                    onPress={() => {
                      if (isLoggedIn) {
                        console.log("Navigating to baggage...");
                        router.push({
                          pathname: "/home/baggage",
                          params: {
                            flightData: JSON.stringify(flight),
                            departureDate: departureDate,
                            departureTime: departureTime,
                          },
                        });
                      } else {
                        setShowLoginPopup(true);
                      }
                    }}
                    className="bg-white w-full rounded-xl shadow-md border border-gray-100 mb-3"
                  >
                    {/* Flight Header */}

                    {/* Divider */}
                    {/* <View className="h-[1px] border-t border-dashed border-[#cdcdcd]" /> */}

                    <View className="w-full px-2">
                      <Image
                        source={jazeera}
                        className="h-11 self-center mt-3"
                        resizeMode="contain"
                      />
                    </View>

                    {/* Flight Details */}
                    <View
                      className="flex-row justify-between items-center pt-1 pb-6 px-5 "
                      style={{ fontFamily: "lato" }}
                    >
                      {/* Departure */}
                      <View className="items-start w-24 ">
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          className="text-[#003C71] font-bold text-center text-[18px] "
                        >
                          {flight.departure?.iata.toUpperCase() || "N/A"}
                        </Text>
                        <Text className="text-[20px]  ">
                          {flight.departure?.scheduled?.includes("T")
                            ? flight.departure?.scheduled
                              .split("T")[1]
                              .slice(0, 5)
                            : flight.departure?.scheduled || "N/A"}
                        </Text>
                        <Text className="text-gray-400 text-start text-[13px] ">
                          {flight.departure?.scheduled?.includes("T")
                            ? formatDate(flight.departure?.scheduled)
                            : formatDate(flight.departure?.scheduled) || "N/A"}
                        </Text>
                      </View>

                      {/* Flight Duration */}
                      {/* <View className="flex-1 items-center">
                    <View className="w-full flex-row items-center justify-center mt-2">
                      <View className="flex-1 h-[1px] border-t border-dashed border-[#164F90] relative">
                        <View className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white px-2">
                          <FontAwesome5 name="plane" size={16} color="#164F90" />
                        </View>
                      </View>
                    </View>
                  </View> */}

                      <View
                        className="flex-1 items-center h-full mt-8"
                        style={{ fontFamily: "lato" }}
                      >
                        <Text className="text-[#000000] text-[14px] font-bold">
                          {flight.flight?.number || "N/A"}
                        </Text>
                        <View className="w-full flex-row items-center justify-center mt-2">
                          <View className="relative flex-row items-center w-full px-1">
                            {/* Plane icon at start */}
                            <FontAwesome5
                              name="plane"
                              size={16}
                              color="#164F90"
                              className="z-10"
                            />

                            {/* Grey line */}
                            <View className="flex-1 h-[1px] border-t border-[#B9B9B9] relative" />

                            {/* Small grey circle at end */}
                            <View className="w-2 h-2 rounded-full bg-[#B9B9B9]" />
                          </View>
                        </View>

                        {/* <Text className="text-[#000000] text-[10px] font-bold mt-3">{getFlightDuration(flight.departure?.scheduled, flight.arrival?.scheduled) || "N/A"}</Text> */}
                      </View>

                      {/* Arrival */}
                      <View
                        className="items-end w-24"
                        style={{ fontFamily: "lato" }}
                      >
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          className="text-[#003C71] font-bold  text-[18px] "
                        >
                          {flight.arrival?.iata.toUpperCase() || "N/A"}
                        </Text>
                        <Text className="text-[20px]  ">
                          {flight.arrival?.scheduled?.includes("T")
                            ? flight.arrival.scheduled.split("T")[1].slice(0, 5)
                            : flight.arrival?.scheduled || "N/A"}
                        </Text>
                        <View className="">
                          <Text className="text-gray-400 text-right text-[13px] ">
                            {flight.arrival?.scheduled?.includes("T")
                              ? formatDate(flight.arrival?.scheduled)
                              : formatDate(flight.arrival?.scheduled) || "N/A"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity
                    key={`special-${index}`}

                    onPress={() => {
                      if (isLoggedIn) {
                        console.log("Navigating to baggage...");
                        router.push({
                          pathname: "/home/baggage",
                          params: {
                            flightData: JSON.stringify(flight),
                            departureDate: departureDate,
                            departureTime: departureTime,
                          },
                        });
                      } else {
                        setShowLoginPopup(true);
                      }
                    }}
                    className="bg-white w-full rounded-xl shadow-md border border-gray-100 mb-3"
                  >
                    {/* Flight Header */}

                    {/* Divider */}
                    {/* <View className="h-[1px] border-t border-dashed border-[#cdcdcd]" /> */}

                    <View className="w-full px-2">
                      <Image
                        source={jazeera}
                        className="h-11 self-center mt-3"
                        resizeMode="contain"
                      />
                    </View>

                    {/* Flight Details */}
                    <View
                      className="flex-row justify-between items-center pt-1 pb-6 px-5 "
                      style={{ fontFamily: "lato" }}
                    >
                      {/* Departure */}
                      <View className="items-start w-24 ">
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          className="text-[#003C71] font-bold text-center text-[18px] "
                        >
                          {flight.departure?.iata.toUpperCase() || "N/A"}
                        </Text>

                      </View>

                      <View
                        className="flex-1 items-center h-full mt-"
                        style={{ fontFamily: "lato" }}
                      >
                        <Text className="text-[#000000] text-[14px] font-bold">
                          {flight.flight?.number || "N/A"}
                        </Text>
                        <View className="w-full flex-row items-center justify-center mt-2">
                          <View className="relative flex-row items-center w-full px-1">
                            {/* Plane icon at start */}
                            <FontAwesome5
                              name="plane"
                              size={16}
                              color="#164F90"
                              className="z-10"
                            />

                            {/* Grey line */}
                            <View className="flex-1 h-[1px] border-t border-[#B9B9B9] relative" />

                            {/* Small grey circle at end */}
                            <View className="w-2 h-2 rounded-full bg-[#B9B9B9]" />
                          </View>
                        </View>

                        {/* <Text className="text-[#000000] text-[10px] font-bold mt-3">{getFlightDuration(flight.departure?.scheduled, flight.arrival?.scheduled) || "N/A"}</Text> */}
                      </View>

                      {/* Arrival */}
                      <View
                        className="items-end w-24"
                        style={{ fontFamily: "lato" }}
                      >
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          className="text-[#003C71] font-bold  text-[18px] "
                        >
                          {flight.arrival?.iata.toUpperCase() || "N/A"}
                        </Text>

                      </View>
                    </View>
                  </TouchableOpacity>
              );
            })}

            {/* Normal Flights */}
          </>
        ) : (
          <View className="h-full  justify-center items-center">
            <Text className=" text-lg text-[#164E8D] font-semibold">
              “No matching flights found.”
            </Text>
            <View
              className={`bg-white self-center mt-3 z-10  p-6 rounded-2xl w-[95%] shadow-xl`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 3, height: 6 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 10,
              }}
            >
              <View>
                <Text className="text-[#164E8D] font-bold mb-2">
                  Add Manually
                </Text>
              </View>
              <AddFlightForm formik={formik} />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Search;
