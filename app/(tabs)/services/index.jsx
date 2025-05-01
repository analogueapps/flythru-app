import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import images from "../../../constants/images";
import miniplane from "../../../assets/images/miniplane.png";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ALL_SERVICES } from "../../../network/apiCallers";
import Translations from "../../../language";
import { langaugeContext } from "../../../customhooks/languageContext";
import { router } from "expo-router";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import LinearGradient from 'expo-linear-gradient';

const Index = () => {
  const insets = useSafeAreaInsets();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { applanguage } = langaugeContext();

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const res = await ALL_SERVICES();
      console.log("API Response:", res.data);

      if (res?.data?.allServices && Array.isArray(res.data.allServices)) {
        setServices(res.data.allServices);
      } else {
        console.log("Unexpected response format:", res.data);
        setServices([]);
      }
    } catch (error) {
      console.log("Error fetching services:", error);
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const cleanDescription = (html) => {
    return html
      .replace(/<[^>]+>/g, "") // Remove HTML tags
      .replace(/&nbsp;/g, " ") // Replace &nbsp;
      .replace(/\r?\n|\r/g, " ") // Remove extra carriage returns
      .replace(/\*/g, "\n• ") // Replace * with new line and bullet
      .replace(/ +/g, " ") // Collapse multiple spaces
      .trim(); // Trim start and end
  };

  const stripHtmlTags = (html) => {
    return html
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  return (
    <View className="flex-1">
      {/* Header Background Image */}
      <View>
        <Image
          source={images.HeaderImg}
          className="w-full h-auto object-cover"
        />
      </View>

      {/* Header Title */}
      <View
        style={{
          top: insets.top,
          zIndex: 1,
        }}
        className="p-6 absolute w-full"
      >
        <View className="flex-row items-center mt-5">
          <Text
            className="text-[20px] font-bold text-white ml-3"
            style={{ fontFamily: "CenturyGothic" }}
          >
            {applanguage === "eng"
              ? Translations.eng.services
              : Translations.arb.services}{" "}
          </Text>
        </View>
      </View>

      {/* Services List */}
      <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
        {isLoading ? (
          // Shimmer loading effect
          <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#164F90" />
            </View>
        ) : services.length > 0 ? (
          services.map((service) => (
            <View key={service._id} className="mb-6">
              {/* Service Title */}
              <Text className="text-[#164F90] text-2xl font-bold mb-3">
                {service.title}
              </Text>

              {/* Service Description */}
              <View className="gap-2 px-4">
                {typeof service.description === "string" &&
                  (() => {
                    const lines = cleanDescription(service.description)
                      .split("\n")
                      .filter((line) => line.trim() !== "");

                    return (
                      <View className="gap-2 px-4">
                        {lines.length > 0 && (
                          <View className="flex-row items-start mb-2">
                            <Image
                              source={miniplane}
                              className="h-5 w-5 mr-2 mt-1"
                              resizeMode="contain"
                            />
                            <Text className="text-[#515151] text-base font-light w-[98%]">
                              {lines[0].trim()}
                            </Text>
                          </View>
                        )}
                        {lines.slice(1).map((line, index) => (
                          <View
                            key={index}
                            className="flex-row items-start mb-1"
                          >
                            <Text className="text-[#515151] text-base font-light pl-7">
                              {line.trim()}
                            </Text>
                          </View>
                        ))}
                      </View>
                    );
                  })()}
              </View>

              {/* Book Now Button */}
              <TouchableOpacity
                className="bg-[#FFB800] rounded-xl py-4 my-4 mx-10 active:opacity-80"
                style={{
                  elevation: 5,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.50,
                  shadowRadius: 3.84,
                }}
                activeOpacity={0.8}
                onPress={() => router.push("/home")}
              >
                <Text className="text-center text-black font-semibold text-lg">
                  {applanguage === "eng"
                    ? Translations.eng.book_now
                    : Translations.arb.book_now}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text className="text-center text-gray-500 text-lg mt-5">
            {applanguage === "eng" 
              ? Translations.eng.no_services_available 
              : Translations.arb.no_services_available}
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Index;