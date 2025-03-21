import { View, Text, Image, TouchableOpacity, ScrollView , Animated} from "react-native";
import React, { useEffect, useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router, useLocalSearchParams } from "expo-router";
import { ALL_FLIGHTS } from "../../network/apiCallers";
import { useToast } from "react-native-toast-notifications";
import ShimmerPlaceHolder, { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import {LinearGradient} from 'expo-linear-gradient';

const search = () => {
  const insets = useSafeAreaInsets();
  const { flightNumber, departureDate } = useLocalSearchParams();
  const toast = useToast();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
  const [animatedValues, setAnimatedValues] = useState([]);

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
  colors={['#4c669f', '#3b5998', '#192f6a']}
  start={{ x: 0, y: 0 }} // top-left corner
  end={{ x: 1, y: 1 }} // bottom-right corner
  style={{
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
  }}
>
  <Text style={{ color: 'white', fontSize: 20 }}>Gradient Background</Text>
</LinearGradient>


  useEffect(() => {
    fetchAllFlights(); 
  }, [departureDate, flightNumber]);

  const fetchAllFlights = async () => {
    setLoading(true); // Start loading
    const values = { flightNumber, departureDate };
    console.log("Fetched flights", values);

    try {
      const res = await ALL_FLIGHTS(values);
      console.log("Fetched flights:", res.data);
      
      if (res?.data?.allFlights) {
        setFlights(res.data.allFlights);
      }
    } catch (error) {
      console.log("Fetch error:", error);
      toast.show(error?.response?.data?.message || "Failed to fetch flights");
    } finally {
      setLoading(false); // Stop loading after data is fetched
    }
  };

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
          <Text className="text-[18px] text-white ml-3 " style={{ fontFamily: "CenturyGothic" }}>
            Search Result
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>
        {/* Display Date */}
        <View className="flex flex-row gap-x-4 items-center mb-4 mx-auto">
          <Text className="text-[#696969] text-lg">
            Date: {departureDate}
          </Text>
        </View>

        {/* Show shimmer if loading */}
        
        {loading ? (
  <>
    {[1, 2, 3, 4].map((_, index) => (
      <View
        key={index}
        style={{
          backgroundColor: '#fff',
          padding: 12,
          borderRadius: 12,
          marginBottom: 12,
          shadowColor: '#000',
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
            shimmerColors={['#f6f7f8', '#e9ecef', '#f6f7f8']}
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
            backgroundColor: '#e1e1e1',
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
              <View className="flex-row items-start py-6 px-4">
                <TempAirWaysLogo />
                <View className="ml-2 flex flex-col items-start gap-y-1">
                  <Text className="text-gray-600">{flight.flightName || "Unknown Airline"}</Text>
                  <Text className="text-[#164F90]">{flight.flightNumber || "N/A"}</Text>
                </View>
              </View>

              {/* Divider */}
              <View className="flex-1 h-[1px] border-t border-dashed border-[#cdcdcd] relative" />

              {/* Flight Details */}
              <View className="flex-row justify-between items-center py-6 px-5">
                {/* Departure */}
                <View>
                  <Text className="text-2xl font-bold text-[#003C71]">
                    {flight.timing?.split("to")[0].trim() || "N/A"}
                  </Text>
                  <Text className="text-gray-500">
                    {flight.startingFrom || "N/A"}
                  </Text>
                </View>

                {/* Flight Duration */}
                <View className="flex-1 items-center">
                  <View className="w-full flex-row items-center justify-center mt-6">
                    <View className="flex-1 h-[1px] border-t border-dashed border-[#164F90] relative">
                      <View className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white px-2">
                        <FontAwesome5 name="plane" size={16} color="#164F90" />
                      </View>
                    </View>
                  </View>
                  <Text className="text-gray-500 text-sm mt-3">
                    {(() => {
                      const timing = flight.timing?.split("to");
                      if (timing?.length === 2) {
                        const start = timing[0].trim();
                        const end = timing[1].trim();
                        return `${start} - ${end}`;
                      }
                      return "N/A";
                    })()}
                  </Text>
                </View>

                {/* Arrival */}
                <View>
                  <Text className="text-2xl font-bold text-[#003C71]">
                    {flight.timing?.split("to")[1].trim() || "N/A"}
                  </Text>
                  <Text className="text-gray-500 self-end">
                    {flight.ending || "N/A"}
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
