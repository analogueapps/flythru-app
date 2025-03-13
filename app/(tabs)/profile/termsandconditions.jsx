import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import RenderHTML from "react-native-render-html";
import { ALL_SETTINGS } from "../../network/apiCallers";

const TermsAndConditions = () => {
  const insets = useSafeAreaInsets();
  const [termsContent, setTermsContent] = useState("");

  const fetchedSettings = async () => {
    try {
      const res = await ALL_SETTINGS();
      console.log("API Response:", res.data);

      if (
        res?.data?.allSettings &&
        Array.isArray(res.data.allSettings) &&
        res.data.allSettings.length > 0
      ) {
        const settings = res.data.allSettings[0];
        if (settings?.termsAndCondition) {
          setTermsContent(settings.termsAndCondition);
        } else {
          console.log("Terms not available");
          setTermsContent("<p>No terms available.</p>");
        }
      } else {
        console.log("Unexpected response format:", res.data);
        setTermsContent("<p>No terms available.</p>");
      }
    } catch (error) {
      console.log("Error fetching terms:", error);
      setTermsContent("<p>Failed to load terms and conditions.</p>");
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
            Terms And Conditions
          </Text>
        </View>
      </View>

      {/* Terms and Conditions Content */}
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>
        {termsContent ? (
          <RenderHTML
            contentWidth={350}
            source={{ html: termsContent }}
            enableExperimentalMarginCollapsing={true}
          />
        ) : (
          <Text className="text-[15px] font-thin">
            Loading terms and conditions...
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default TermsAndConditions;
