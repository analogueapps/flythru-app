import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import RenderHTML from "react-native-render-html";
import logo from "../../../assets/images/mainLogo.png";

import { ALL_SETTINGS } from "../../../network/apiCallers";
import Translations from "../../../language";
import { langaugeContext } from "../../../customhooks/languageContext";
import TranslateText from "../../../network/translate";

const PrivacyPolicy = () => {
  const insets = useSafeAreaInsets();
  const [privacyContent, setPrivacyContent] = useState("");
  const { applanguage } = langaugeContext();

  function splitTextIntoChunks(text, chunkSize = 4500) {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
  }
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
            /\r\n|\n/g
            // "<br>"
          );
          if (applanguage !== "eng") {
            const chunks = splitTextIntoChunks(formattedContent);
            const translatedChunks = await Promise.all(
              chunks.map((chunk) => TranslateText(chunk, "ar"))
            );
            finalHtml = translatedChunks.join("");
            setPrivacyContent(finalHtml);
          } else {
            setPrivacyContent(formattedContent);
          }
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
        className="p-6 absolute w-full "
      >
        <View className="flex-row items-center mt-5">
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
            {applanguage === "eng"
              ? Translations.eng.privacy_policy
              : Translations.arb.privacy_policy}
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
          <Text className="text-[15px] font-thin" style={{ fontFamily: "Lato" }}>
            {applanguage === "eng"
              ? Translations.eng.loading_privacy_policy
              : Translations.arb.loading_privacy_policy}{" "}
          </Text>
        )}

        <View className="flex justify-center ">
          <Image
            source={logo}
            className="h-52 w-52 self-center"
            resizeMode="contain"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy;
