import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import RenderHTML from "react-native-render-html";
import { ALL_SETTINGS } from "../../../network/apiCallers";
import logo from '../../../assets/images/mainLogo.png'

import { langaugeContext } from "../../../customhooks/languageContext";
import Translations from "../../../language";

const RefundPolicy = () => {
  const insets = useSafeAreaInsets();
  const [refundContent, setRefundContent] = useState("");
  const { applanguage } = langaugeContext()


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
        if (settings?.refundPolicy) {
          const formattedContent = settings.refundPolicy.replace(
            /\r\n|\n/g,
            // "<br>"
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
           {applanguage==="eng"?Translations.eng.refund_policy:Translations.arb.refund_policy
              }
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
{applanguage==="eng"?Translations.eng.loading_refund_policy:Translations.arb.loading_refund_policy
              }          </Text>
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

export default RefundPolicy;
