import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import RenderHTML from "react-native-render-html";
import { ALL_SETTINGS } from "../../network/apiCallers";

const RefundPolicy = () => {
  const insets = useSafeAreaInsets();
  const [refundContent, setRefundContent] = useState("");

  const fetchedSettings = async () => {
    try {
      const res = await ALL_SETTINGS();
      console.log("API Response:", res.data);

      // ✅ Extract `refundPolicy` from API
      if (
        res?.data?.allSettings &&
        Array.isArray(res.data.allSettings) &&
        res.data.allSettings.length > 0
      ) {
        const settings = res.data.allSettings[0];
        if (settings?.refundPolicy) {
          // ✅ Replace newlines with HTML breaks
          const formattedContent = settings.refundPolicy.replace(
            /\r\n|\n/g,
            "<br>"
          );
          setRefundContent(formattedContent);
        } else {
          console.log("Refund policy not available");
          setRefundContent("<p>No refund policy available.</p>");
        }
      } else {
        console.log("Unexpected response format:", res.data);
        setRefundContent("<p>No refund policy available.</p>");
      }
    } catch (error) {
      console.log("Error fetching refund policy:", error);
      setRefundContent("<p>Failed to load refund policy.</p>");
    }
  };

  useEffect(() => {
    fetchedSettings();
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

      {/* Header */}
      <View
        style={{
          top: insets.top,
          zIndex: 1,
        }}
        className="p-6 absolute w-full"
      >
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-[rgba(255,255,255,0.8)] rounded-full p-1"
          >
            <ChevronLeft color="black" size={18} />
          </TouchableOpacity>
          <Text
            className="text-[18px] text-white ml-3"
            style={{ fontFamily: "CenturyGothic" }}
          >
            Refund Policy
          </Text>
        </View>
      </View>

      {/* Refund Policy Content */}
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>
        {refundContent ? (
          <RenderHTML
            contentWidth={350}
            source={{ html: refundContent }}
            enableExperimentalMarginCollapsing={true}
          />
        ) : (
          <Text className="text-[15px] font-thin">
            Loading refund policy...
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default RefundPolicy;
