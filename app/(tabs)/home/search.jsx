import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router, useLocalSearchParams } from "expo-router";
import { ALL_FLIGHTS, ALL_FLIGHTS_CLIENT } from "../../../network/apiCallers";
import { useToast } from "react-native-toast-notifications";
import ShimmerPlaceHolder, {
  createShimmerPlaceholder,
} from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { langaugeContext } from "../../../customhooks/languageContext";
import Translations from "../../../language";
import axios from "axios";

const search = () => {
  const insets = useSafeAreaInsets();
  const { flightNumber, departureDate, airPortName,city } = useLocalSearchParams();
  const toast = useToast();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
  const [animatedValues, setAnimatedValues] = useState([]);
  const { applanguage } = langaugeContext();

  useEffect(() => {
    if (flights.length > 0) {
      // Create animated values for each flight item
      const values = flights.map(() => new Animated.Value(500)); // Start from off-screen (500px down)
      setAnimatedValues(values);

      values.forEach((animatedValue, index) => {
        setTimeout(() => {
          Animated.timing(animatedValue, {
            toValue: 0, // Slide to the original position
            duration: 400,
            useNativeDriver: true,
          }).start();
        }, index * 150); // Staggered effect
      });
    }
  }, [flights]);

  <LinearGradient
    colors={["#4c669f", "#3b5998", "#192f6a"]}
    start={{ x: 0, y: 0 }} // top-left corner
    end={{ x: 1, y: 1 }} // bottom-right corner
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ color: "white", fontSize: 20 }}>Gradient Background</Text>
  </LinearGradient>;

  // useEffect(() => {
  //   const fetchFlights = async () => {
  //     try {
  //       const response = await axios.get('http://api.aviationstack.com/v1/flightsFuture', {
  //         params: {
  //           access_key: 'a601a685ef6add9deaa1c103d7ac3f38',
  //           flight_number: flightNumber, // Prepend airline code
  //           date: departureDate
  //         }
  //       });

  //       if (response.data.data && response.data.data.length > 0) {
  //         setFlights(response.data.data);
  //       } else {
  //         setError('No flights found for this date and number');
  //       }
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchFlights();
  // }, [departureDate, flightNumber]);

  // useEffect(() => {
  //   fetchSingleFlights();
  //   fetchClientAllFlights();
  // }, [departureDate, flightNumber, airPortName, city]);

 
  const fetchClientAllFlights = async () => {
    try {
      const res = await ALL_FLIGHTS_CLIENT();
      if (res?.data?.allFlights?.data) {
        let filteredFlights = res.data.allFlights.data;
  
        if (flightNumber) {
          filteredFlights = filteredFlights.filter(
            (flight) =>
              flight.flight?.number &&
              flight.flight.number.toLowerCase().includes(flightNumber.toLowerCase())
          );
        }
        
        if (departureDate) {
          filteredFlights = filteredFlights.filter(
            (flight) =>
              flight.departure?.scheduled &&
            new Date(flight.departure.scheduled).toISOString().split("T")[0] === departureDate
          );
        }
        
        if (airPortName) {
          filteredFlights = filteredFlights.filter(
            (flight) =>
              flight.departure?.airport?.toLowerCase().includes(airPortName.toLowerCase()) ||
            flight.arrival?.airport?.toLowerCase().includes(airPortName.toLowerCase())
          );
        }
        
        if (city) {
          filteredFlights = filteredFlights.filter(
            (flight) =>
              flight.departure?.iata?.toLowerCase().includes(city.toLowerCase()) ||
            flight.arrival?.iata?.toLowerCase().includes(city.toLowerCase())
          );
        }
        
        return filteredFlights;
      }
    } catch (error) {
      console.log("Fetch error:", error);
      return [];
    }
  };
  
  
  const fetchSingleFlights = async () => {
    try {
      const res = await ALL_FLIGHTS({ flightNumber, departureDate, city, airPortName });
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
        
        if (airPortName) {
          transformedFlights = transformedFlights.filter(
            (flight) =>
              flight.departure?.airport.toLowerCase().includes(airPortName.toLowerCase()) ||
            flight.arrival?.airport.toLowerCase().includes(airPortName.toLowerCase())
          );
        }
        
        if (city) {
          transformedFlights = transformedFlights.filter(
            (flight) =>
              flight.departure?.iata.toLowerCase().includes(city.toLowerCase()) ||
            flight.arrival?.iata.toLowerCase().includes(city.toLowerCase())
          );
        }
        
        return transformedFlights;
      }
    } catch (error) {
      console.log("Fetch error:", error);
      return [];
    }
  };


  const fetchAviationStackFlights = async (iataCode, type, date) => {
    try {
      const accessKey = 'a601a685ef6add9deaa1c103d7ac3f38'; // Replace with your actual AviationStack access key
      const response = await axios.get('https://api.aviationstack.com/v1/flightsFuture', {
        params: {
          access_key: accessKey,
          iataCode,
          type,
          date,
        },
      });
  
      if (response.data && response.data.data) {
        return response.data.data.map((flight) => ({
          airline: { name: flight.airline.name || 'Unknown Airline' },
          flight: { number: flight.flight.number || 'N/A' },
          departure: {
            scheduled: flight.departure.scheduledTime || null,
            airport: flight.departure.iataCode || 'Unknown Airport',
          },
          arrival: {
            scheduled: flight.arrival.scheduledTime || null,
            airport: flight.arrival.iataCode || 'Unknown Airport',
          },
        }));
      }
    } catch (error) {
      console.error('AviationStack API fetch error:', error);
    }
    return [];
  };
  
  useEffect(() => {
    const fetchAllFlights = async () => {
      setLoading(true);
      try {
        const iataCode = city || ''; // Assuming "city" holds the IATA code
        const type = 'departure'; // or 'arrival', depending on what you're showing
        const date = departureDate; // already in 'YYYY-MM-DD' format
  
        const [singleFlights, clientFlights, aviationStackFlights] = await Promise.all([
          fetchSingleFlights(),
          fetchClientAllFlights(),
          fetchAviationStackFlights(iataCode, type, date),
        ]);
  
        const combinedFlights = [
          ...(singleFlights || []),
          ...(clientFlights || []),
          ...(aviationStackFlights || []),
        ];
  
        setFlights(combinedFlights);
        console.log("combinedflightsdata", combinedFlights)
      } catch (error) {
        console.error('Error fetching flights:', error);
        toast.show('Failed to fetch flights');
      } finally {
        setLoading(false);
      }
    };
  
    fetchAllFlights();
  }, [departureDate, flightNumber, airPortName, city]);
  
  
  // useEffect(() => {
  //   const fetchAll = async () => {
  //     setLoading(true);
      
  //     try {
  //       const [singleFlights, clientFlights] = await Promise.all([
  //         fetchSingleFlights(),
  //         fetchClientAllFlights(),
  //       ]);
        
  //       const combined = [...(singleFlights || []), ...(clientFlights || [])];
  //       setFlights(combined);
  //     } catch (error) {
  //       console.log("Fetch error:", error);
  //       toast.show("Failed to fetch flights");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
    
  //   fetchAll();
  // }, [departureDate, flightNumber, airPortName, city]);
  
  
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
        ) : (
          flights.map((flight) => (
            <TouchableOpacity
            key={flight._id}
            onPress={() =>
                router.push({
                  pathname: "/home/baggage",
                  params: { flightData: JSON.stringify(flight) },
                })
              }
              className="bg-white w-full rounded-xl shadow-md border border-gray-100 mb-3"
            >
              {/* Flight Header */}
              <View className="flex-row items-center py-6 px-4">
                <TempAirWaysLogo />
                <View className="ml-2 flex flex-col items-start">
                  <Text className="text-gray-600">
                    {flight.airline.name || "Unknown Airline"}
                  </Text>
                  <Text className="text-[#164F90] text-lg font-bold">
                    {flight.flight.number || "N/A"}
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View className="h-[1px] border-t border-dashed border-[#cdcdcd]" />

              {/* Flight Details */}
              <View className="flex-row justify-between items-center py-6 px-5">
                {/* Departure */}
                <View className=" items-center">
                  <Text className="text-2xl font-bold text-[#003C71]">
                    {flight.departure?.scheduled
                      ? new Date(flight.departure.scheduled).toLocaleTimeString(
                        [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          }
                        )
                        : "N/A"}
                  </Text>
                  <Text className="text-gray-500 text-center">
                    {flight?.departure?.airport
                      ? flight.departure.airport.length > 10
                        ? flight.departure.airport.substring(0, 10) + "..."
                        : flight.departure.airport
                      : "N/A"}
                  </Text>
                </View>

                {/* Flight Duration */}
                <View className="flex-1 items-center">
                  <View className="w-full flex-row items-center justify-center mt-2">
                    <View className="flex-1 h-[1px] border-t border-dashed border-[#164F90] relative">
                      <View className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white px-2">
                        <FontAwesome5 name="plane" size={16} color="#164F90" />
                      </View>
                    </View>
                  </View>
                  <Text className="text-gray-500 text-sm mt-3 text-center">
                    {flight.departure?.scheduled
                      ? new Date(flight.departure.scheduled).toLocaleTimeString(
                        [],
                        {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          }
                        )
                      : "N/A"}{" "}
                    to{" "}
                    {flight.arrival?.scheduled
                      ? new Date(flight.arrival.scheduled).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          }
                        )
                        : "N/A"}
                  </Text>
                </View>

                {/* Arrival */}
                <View className=" items-center">
                  <Text className="text-2xl font-bold text-[#003C71]">
                    {flight.arrival?.scheduled
                      ? new Date(flight.arrival.scheduled).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          }
                        )
                      : "N/A"}
                  </Text>
                  <Text className="text-gray-500 text-center">
                    {flight?.arrival?.airport
                      ? flight.arrival.airport.length > 10
                        ? flight.arrival.airport.substring(0, 10) + "..."
                        : flight.arrival.airport
                      : "N/A"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};


export default search;
// const fetchClientAllFlights = async () => {
//   setLoading(true);
//   try {
//     const res = await ALL_FLIGHTS_CLIENT();
//     console.log("Fetched flights:", res.data);

//     if (res?.data?.allFlights?.data) {
//       let filteredFlights = res.data.allFlights.data;

//       if (flightNumber) {
//         filteredFlights = filteredFlights.filter(
//           (flight) =>
//             flight.flight?.number &&
//             flight.flight.number.toLowerCase().includes(flightNumber.toLowerCase())
//         );
//       }

//       if (departureDate) {
//         filteredFlights = filteredFlights.filter(
//           (flight) =>
//             flight.departure?.scheduled &&
//             new Date(flight.departure.scheduled).toISOString().split("T")[0] === departureDate
//         );
//       }

//       if (airPortName) {
//         filteredFlights = filteredFlights.filter(
//           (flight) =>
//             flight.departure?.airport?.toLowerCase().includes(airPortName.toLowerCase()) ||
//             flight.arrival?.airport?.toLowerCase().includes(airPortName.toLowerCase())
//         );
//       }

//       if (city) {
//         filteredFlights = filteredFlights.filter(
//           (flight) =>
//             flight.departure?.iata?.toLowerCase().includes(city.toLowerCase()) ||
//             flight.arrival?.iata?.toLowerCase().includes(city.toLowerCase())
//         );
//       }

//       console.log("filteredFlights..........", filteredFlights);
//       setFlights(filteredFlights);
//     }
//   } catch (error) {
//     console.log("Fetch error:", error);
//     toast.show(error?.response?.data?.message || "Failed to fetch flights");
//   } finally {
//     setLoading(false);
//   }
// };



// const fetchSingleFlights = async () => {
//   setLoading(true);
//   const values = { flightNumber, departureDate, city , airPortName };
//   console.log("Fetching flights with:", values);

//   try {
//     const res = await ALL_FLIGHTS(values);
//     console.log("Fetched flights:", res.data);

//     if (res?.data?.allFlights) {
//       let transformedFlights = res.data.allFlights.map((flight) => ({
//         _id: flight._id,
//         airline: { name: flight.flightName || "Unknown Airline" },
//         flight: { number: flight.flightNumber || "N/A" },
//         departure: {
//           scheduled: flight.departureDateTime || null,
//           airport: flight.startingFrom || "Unknown Airport",
//           iata: flight.startingCode || "",
//         },
//         arrival: {
//           scheduled: flight.arrivalDateTime || null,
//           airport: flight.ending || "Unknown Airport",
//           iata: flight.endingCode || "",
//         },
//         timing: flight.timing || "N/A",
//       }));

//       // Apply airport name filter
//       if (airPortName) {
//         transformedFlights = transformedFlights.filter(
//           (flight) =>
//             flight.departure?.airport.toLowerCase().includes(airPortName.toLowerCase()) ||
//             flight.arrival?.airport.toLowerCase().includes(airPortName.toLowerCase())
//         );
//       }

//       // Apply city (IATA code) filter
//       if (city) {
//         transformedFlights = transformedFlights.filter(
//           (flight) =>
//             flight.departure?.iata.toLowerCase().includes(city.toLowerCase()) ||
//             flight.arrival?.iata.toLowerCase().includes(city.toLowerCase())
//         );
//       }

//       setFlights(transformedFlights);
//     }
//   } catch (error) {
//     console.log("Fetch error:", error);
//     toast.show(error?.response?.data?.message || "Failed to fetch flights");
//   } finally {
//     setLoading(false);
//   }
// };
