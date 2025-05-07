import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router, useLocalSearchParams } from "expo-router";
import { ALL_FLIGHTS, ALL_FLIGHTS_CLIENT } from "../../../network/apiCallers";
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
import Toast from "react-native-toast-message";


const Search = () => {
  const insets = useSafeAreaInsets();
  const { flightNumber, departureDate } = useLocalSearchParams();
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


    const DashedLine = ({ dashCount = 30, dashColor = '#164F90' }) => (
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


    
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("authToken");
      console.log("Token in checkLoginStatus:", token);
      setIsLoggedIn(!!token);
      setLoginChecked(true); // ✅ ensure login state is ready
    };

    useEffect(() => {
      console.log("yayayayayayaya",departureDate)
    },[])
    
  
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
      const res = await ALL_FLIGHTS({ flightNumber, departureDate });
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
    } catch (error) {
      console.log("Fetch error:", error);
      return [];
    }
  };

  const getAllFlight = () => {
    return new Promise((resolve, reject) => {
      const today = new Date();
      const selectedDate = new Date(departureDate);
      const isToday = selectedDate.toDateString() === today.toDateString();
  
      // Debug logs to verify inputs
      console.log(`LOCAL_URL: ${LOCAL_URL}`);
      console.log(`Departure Date: ${departureDate}`);
      console.log(`Flight Number: ${flightNumber}`);
      console.log(`Is Today: ${isToday}`);
  
      const formatTime = (timeString) => {
        if (!timeString) return "N/A";
        return timeString.includes("T")
          ? `${timeString.split("T")[1].split(":")[0]}:${timeString
              .split("T")[1]
              .split(":")[1]
              .split(".")[0]}`
          : timeString;
      };
  
      const mapFlights = (data) => {
        if (!data || !Array.isArray(data)) {
          console.log("Invalid data format received from API:", data);
          return [];
        }
        
        return data.map((flight, index) => ({
          _id: `api_${index}`,
          airline: {
            name: flight?.codeshared
              ? `${flight?.codeshared?.airline?.name} (${flight?.codeshared?.airline?.iataCode})`
              : `${flight?.airline?.name} (${flight?.airline?.iataCode})`,
          },
          flight: { number: flight?.flight?.iataNumber || "N/A" },
          departure: {
            scheduled: formatTime(flight?.departure?.scheduledTime),
            airport: flight?.departure?.iataCode || "Unknown Airport",
            iata: flight?.departure?.iataCode || "",
          },
          arrival: {
            scheduled: formatTime(flight?.arrival?.scheduledTime),
            airport: flight?.arrival?.iataCode || "Unknown Airport",
            iata: flight?.arrival?.iataCode || "",
          },
          timing: `${formatTime(flight?.departure?.scheduledTime)} to ${formatTime(
            flight?.arrival?.scheduledTime
          )}`,
        }));
      };
  
      // Common request handler
      const makeRequest = (endpoint, params) => {
        console.log(`Making request to ${endpoint} with params:`, params);
        
        return axios.get(`${LOCAL_URL}${endpoint}`, { 
          params,
          // Add these headers if needed
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          console.log("API Response:", response.data);
          if (response.data.error) {
            // Toast.show(response.data.error);
            // Toast.show({
            //   type: "error",
            //   text1: "Error",
            //   text2: response.data.error,
            // });
            return [];
          }
          return mapFlights(response.data);
        })
        .catch(error => {
          console.error("API Error Details:", {
            message: error.message,
            url: error.config?.url,
            params: error.config?.params,
            status: error.response?.status,
            data: error.response?.data
          });
          // toast.show(`API Error: ${error.message}`);
          // throw error; // Re-throw to be caught by the Promise chain
        });
      };
  
      try {
        if (isToday) {
          // Today's flights - schedules endpoint
          const params = flightNumber 
            ? { flight_iata: flightNumber } 
            : { date: departureDate };
          
          makeRequest("/aviation/schedules", params)
            .then(data => {
              setFlightDatas(data);
              resolve(data);
            })
            .catch(reject);
        } else {
          // Future flights - futreflights endpoint (with your confirmed spelling)
          const params = { date: departureDate };
          if (flightNumber) params.flight_num = flightNumber;
          
          makeRequest("/aviation/futreflights", params)
            .then(data => {
              setFlightDatas(data);
              resolve(data);
            })
            .catch(reject);
        }
      } catch (error) {
        console.error("Request setup error:", error);
        reject(error);
      }
    });
  };

  useEffect(() => {
    const fetchAllFlights = async () => {
      setLoading(true);
      try {
        const [dbFlights, apiFlights] = await Promise.all([
          fetchSingleFlights(),
          getAllFlight(), // Now this will properly return the flight data
        ]);
  
        console.log("Special flights from DB:", dbFlights);
        console.log("Flights from aviation API:", apiFlights); // Will show actual data now
  
        setSpecialflightDatas(dbFlights || []);
        setFlightDatas(apiFlights || []);
      } catch (error) {
        console.error('Error fetching flights:', error);
        // toast.show('Failed to fetch flights');
      } finally {
        setLoading(false);
      }
    };
  
    fetchAllFlights();
  }, [departureDate, flightNumber]);


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
            <Text className="text-xl font-bold text-center mb-2" style={{ fontFamily: "Lato" }}>
              You're not logged in
            </Text>
            <Text className="text-base text-center text-gray-700 mb-5" style={{ fontFamily: "Lato" }}>
              Would you like to log in now?
            </Text>

            <View className="flex-row justify-between gap-x-4">
             

              <TouchableOpacity
                className="flex-1 bg-gray-200 py-3 rounded-xl"
                onPress={() => setShowLoginPopup(false)}
              >
                <Text className="text-gray-800 font-bold text-center" style={{ fontFamily: "Lato" }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-[#FFB648] py-3 rounded-xl"
                style={{
                  elevation: 5,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.50,
                  shadowRadius: 3.84,
                }}
                onPress={() => {
                  setShowLoginPopup(false);
                  router.replace("/(auth)"); 
                }}
              >
                <Text className="text-black font-bold text-center"  style={{ fontFamily: "Lato" }}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

        {/* Display Date */}
        <View className="flex flex-row gap-x-4 items-center mb-4 mx-auto">
          <Text className="text-[#696969] text-lg">
            {" "}
            {applanguage === "eng"
              ? Translations.eng.date
              : Translations.arb.date}{" "}
            {departureDate}
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
        ) : (specialflightDatas.length || flightDatas.length) ? (
          <>
            {/* Special Flights */}
            {specialflightDatas.map((flight, index) => (
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
                  console.log("Login checked:", loginChecked);
                  console.log("Is Logged In:", isLoggedIn);
                
                
                  if (isLoggedIn) {
                    console.log("Navigating to baggage...");
                    router.push({
                      pathname: "/home/baggage",
                      params: { flightData: JSON.stringify(flight),
                        departureDate: departureDate
                       },
                    });
                  } else {
                    console.log("User not logged in, showing popup");
                    setShowLoginPopup(true);
                  }
                }}
                
                className="bg-white w-full rounded-xl shadow-md border border-gray-100 mb-3"
              >
                {/* Flight Header */}
                <View className="flex-row items-center py-6 px-4">
                  {/* <TempAirWaysLogo /> */}


                  <View className="w-10 h-10 rounded-full border-[1px] border-[#164F90] justify-center items-center">
                  <Image
                  source={flightlogo} className="h-10" resizeMode="contain"
                  />
                  </View>

                  <View className="ml-2 flex flex-col items-start">
                    <Text className="text-gray-600">{flight.airline?.name || "Unknown Airline"}</Text>
                    <Text className="text-[#164F90] text-lg font-bold">{flight.flight?.number || "N/A"}</Text>
                  </View>
                </View>

                {/* Divider */}
                <View className="h-[1px] border-t border-dashed border-[#cdcdcd]" />

                {/* Flight Details */}
                <View className="flex-row justify-between items-center py-6 px-5">
                  {/* Departure */}
                  <View className="items-center">
                    <Text className="text-2xl font-bold text-[#003C71]">
                    {
  flight.departure?.scheduled?.includes("T")
    ? flight.departure.scheduled.split("T")[1].slice(0, 5)
    : flight.departure?.scheduled || "N/A"
}
                    </Text>
                    <Text className="text-gray-500 text-center">
                      {flight.departure?.airport || "N/A"}
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

<View className="flex-1 items-center">
    <View className="w-full flex-row items-center justify-center mt-2">
      <View className="flex-1 relative justify-center">
        <DashedLine />
        <View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 z-10">
          <FontAwesome5 name="plane" size={16} color="#164F90" />
        </View>
      </View>
    </View>
  </View>

                  {/* Arrival */}
                  <View className="items-center">
                    <Text className="text-2xl font-bold text-[#003C71]">
                    {
  flight.arrival?.scheduled?.includes("T")
    ? flight.arrival.scheduled.split("T")[1].slice(0, 5)
    : flight.arrival?.scheduled || "N/A"
}
                    </Text>
                    <Text className="text-gray-500 text-center">
                      {flight.arrival?.airport || "N/A"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {/* Normal Flights */}
            {flightDatas.map((flight, index) => (
              <TouchableOpacity
                key={`normal-${index}`}
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
                  console.log("Login checked:", loginChecked);
                  console.log("Is Logged In:", isLoggedIn);
                
                
                  if (isLoggedIn) {
                    console.log("Navigating to baggage...");
                    router.push({
                      pathname: "/home/baggage",
                      params: {
                        flightData: JSON.stringify(flight),
                        departureDate: departureDate, // ✅ needs to be INSIDE params
                      },
                    });
                    
                  } else {
                    console.log("User not logged in, showing popup");
                    setShowLoginPopup(true);
                  }
                }}
                
                className="bg-white w-full rounded-xl shadow-md border border-gray-100 mb-3"
              >
                {/* Flight Header */}
                <View className="flex-row items-center py-6 px-4">
                  {/* <TempAirWaysLogo /> */}

                  <View className="w-10 h-10 rounded-full border-[1px] border-[#164F90] justify-center items-center">
                  <Image
                  source={flightlogo} className="h-10" resizeMode="contain"
                  />
                  </View>
                  <View className="ml-2 flex flex-col items-start">
                    <Text className="text-gray-600">
                      {flight.airline?.name || "Unknown Airline"}
                      {" "}
                      {/* ({flight.airline?.iata || "N/A"}) */}
                    </Text>
                    <Text className="text-[#164F90] text-lg font-bold">
                      {flight.flight?.number || "N/A"}
                    </Text>
                  </View>
                </View>

                {/* Divider */}
                <View className="h-[1px] border-t border-dashed border-[#cdcdcd]" />

                {/* Flight Details */}
                <View className="flex-row justify-between items-center py-6 px-5">
                  {/* Departure */}
                  <View className="items-center">
                    <Text className="text-2xl font-bold text-[#003C71]">
                      {flight.departure?.scheduled || "N/A"}
                    </Text>
                    <Text className="text-gray-500 text-center">
                      {flight.departure?.iata || "N/A"}
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

<View className="flex-1 items-center">
    <View className="w-full flex-row items-center justify-center mt-2">
      <View className="flex-1 relative justify-center">
        <DashedLine />
        <View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 z-10">
          <FontAwesome5 name="plane" size={16} color="#164F90" />
        </View>
      </View>
    </View>
  </View>

                  {/* Arrival */}
                  <View className="items-center">
                    <Text className="text-2xl font-bold text-[#003C71]">
                      {flight.arrival?.scheduled || "N/A"}
                    </Text>
                    <Text className="text-gray-500 text-center">
                      {flight.arrival?.iata || "N/A"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View className="h-40 justify-center items-center">
            <Text className="text-gray-500 text-2xl">No Flights Found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Search;