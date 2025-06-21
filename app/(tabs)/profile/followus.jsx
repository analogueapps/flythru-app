import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import logo from "../../../assets/images/mainLogo.png";
import instagramImg from "../../../assets/images/instagram.png";
import youtubeImg from "../../../assets/images/youtube.png";
import xImg from "../../../assets/images/x.png";
import linkdinImg from "../../../assets/images/linkdin.png";
import facebookImg from "../../../assets/images/facebook.png";

import Translations from "../../../language";
import { langaugeContext } from "../../../customhooks/languageContext";
import TranslateText from "../../../network/translate";
import { FOLLOW_LINKS } from "../../../network/apiCallers";
import * as Linking from "expo-linking";

const FollowUs = () => {
  const insets = useSafeAreaInsets();
  const { applanguage } = langaugeContext();
  const [links, setLinks] = useState({
  instagram: "",
  facebook: "",
  linkedin: "",
  youtube: "",
  twitter: "",
});
const [loading, setLoading] = useState(false);


const openLink = (url) => {
  if (url) {
    Linking.openURL(url);
  } else {
    alert("Link not available");
  }
};


 const fetchlinks = async () => {
  setLoading(true);
  try {
    const res = await FOLLOW_LINKS();
    console.log("res follow links", res.data);

    if (res?.data) {
      console.log("res data", res.data);
      
      setLinks({
        instagram: res.data.instgram,
        facebook: res.data.facebook,
        linkedin: res.data.linkedin,
        youtube: res.data.youtube,
        twitter: res.data.twitter,
      });
    } else {
      console.log("Unexpected response format:", res.data);
    }
  } catch (error) {
    console.log("Error fetching links:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchlinks();
  }, []);




const socialLinks = [
  { name: applanguage === "eng" ? Translations.eng.instagram : Translations.arb.instagram, icon: instagramImg, url: links.instagram },
  { name: applanguage === "eng" ? Translations.eng.facebook : Translations.arb.facebook, icon: facebookImg, url: links.facebook },
  { name: applanguage === "eng" ? Translations.eng.linkedIn : Translations.arb.linkedIn, icon: linkdinImg, url: links.linkedin },
  { name: applanguage === "eng" ? Translations.eng.twitter : Translations.arb.twitter, icon: xImg, url: links.twitter },
  { name: applanguage === "eng" ? Translations.eng.youtube : Translations.arb.youtube, icon: youtubeImg, url: links.youtube },
];

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
              ? Translations.eng.follow_us
              : Translations.arb.follow_us}
          </Text>
        </View>
      </View>

      {/* Privacy Policy Content */}
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>

        {/* <TouchableOpacity className="w-[95%] my-2 mx-auto flex flex-row items-center gap-x-4 border border-[#007AFF7D] rounded-[11px] bg-white shadow-lg p-3"
        >
          <View className="w-9 h-9">
            <Image
              resizeMode="contain"
              className="w-full h-full"
              source={instagramImg}
            />
          </View>
          <Text className="text-[16px] font-semibold"  style={{ fontFamily: "CenturyGothic" }}>Instagram</Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-[95%] my-2 mx-auto flex flex-row items-center gap-x-4 border border-[#007AFF7D] rounded-[11px] bg-white shadow-lg p-3"
        >
          <View className="w-9 h-9">
            <Image
              resizeMode="contain"
              className="w-full h-full"
              source={facebookImg}
            />
          </View>
          <Text className="text-[16px] font-semibold"  style={{ fontFamily: "CenturyGothic" }}>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-[95%] my-2 mx-auto flex flex-row items-center gap-x-4 border border-[#007AFF7D] rounded-[11px] bg-white shadow-lg p-3"
        >
          <View className="w-9 h-9">
            <Image
              resizeMode="contain"
              className="w-full h-full"
              source={linkdinImg}
            />
          </View>
          <Text className="text-[16px] font-semibold"  style={{ fontFamily: "CenturyGothic" }}>LinkedIn</Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-[95%] my-2 mx-auto flex flex-row items-center gap-x-4 border border-[#007AFF7D] rounded-[11px] bg-white shadow-lg p-3"
        >
          <View className="w-9 h-9">
            <Image
              resizeMode="contain"
              className="w-full h-full"
              source={xImg}
            />
          </View>
          <Text className="text-[16px] font-semibold"  style={{ fontFamily: "CenturyGothic" }}>Twitter</Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-[95%] my-2 mx-auto flex flex-row items-center gap-x-4 border border-[#007AFF7D] rounded-[11px] bg-white shadow-lg p-3"
        >
          <View className="w-9 h-9">
            <Image
              resizeMode="contain"
              className="w-full h-full"
              source={youtubeImg}
            />
          </View>
          <Text className="text-[16px] font-semibold"  style={{ fontFamily: "CenturyGothic" }}>YouTube</Text>
        </TouchableOpacity> */}


        {socialLinks.map((item, index) => (
  <TouchableOpacity
    key={index}
    onPress={() => openLink(item.url)}
    className="w-[95%] my-2 mx-auto flex flex-row items-center gap-x-4 border border-[#007AFF7D] rounded-[11px] bg-white shadow-lg p-3"
  >
    <View className="w-9 h-9">
      <Image resizeMode="contain" className="w-full h-full" source={item.icon} />
    </View>
    <Text
      className="text-[16px] font-semibold"
      style={{ fontFamily: "CenturyGothic" }}
    >
      {item.name}
    </Text>
  </TouchableOpacity>
))}


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

export default FollowUs;
