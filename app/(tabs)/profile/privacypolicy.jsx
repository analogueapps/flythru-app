import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import RenderHTML from "react-native-render-html";
import { ALL_SETTINGS } from "../../network/apiCallers";

const PrivacyPolicy = () => {
  const insets = useSafeAreaInsets();
  const [privacyContent, setPrivacyContent] = useState("");

  const fetchedSettings = async () => {
    try {
      const res = await ALL_SETTINGS();
      console.log("API Response:", res.data);

      // ✅ Access privacyPolicy from the first element of allSettings
      if (
        res?.data?.allSettings &&
        Array.isArray(res.data.allSettings) &&
        res.data.allSettings.length > 0
      ) {
        const settings = res.data.allSettings[0];
        if (settings?.privacyPolicy) {
          // ✅ Replace newlines with HTML breaks
          const formattedContent = settings.privacyPolicy.replace(
            /\r\n|\n/g,
            "<br>"
          );
          setPrivacyContent(formattedContent);
        } else {
          console.log("Privacy policy not available");
          setPrivacyContent("<p>No privacy policy available.</p>");
        }
      } else {
        console.log("Unexpected response format:", res.data);
        setPrivacyContent("<p>No privacy policy available.</p>");
      }
    } catch (error) {
      console.log("Error fetching privacy policy:", error);
      setPrivacyContent("<p>Failed to load privacy policy.</p>");
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
            Privacy & Policy
          </Text>
        </View>
      </View>

      {/* Privacy Policy Content */}
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>
        {privacyContent ? (
          <RenderHTML
            contentWidth={350}
            source={{ html: privacyContent }}
            enableExperimentalMarginCollapsing={true}
          />
        ) : (
          <Text className="text-[15px] font-thin">
            Loading privacy policy...
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy;
