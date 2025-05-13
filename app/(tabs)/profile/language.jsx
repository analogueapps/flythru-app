import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import dp from "../../../assets/images/dpfluthru.jpg"
import { Calendar } from "lucide-react-native";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { langaugeContext } from "../../../customhooks/languageContext";
import Translations from "../../../language";
// import {tra}

const language = () => {

  const insets = useSafeAreaInsets();
  const [current, setCurrent] = useState("1");

  const { applanguage, ToogleLanguage } = langaugeContext();
  useEffect(() => {
    if (applanguage === "eng") {
      setCurrent("1");
    } else {
      setCurrent("2");
    }
  }, []);

  const handleSave = async () => {
    if (current === "1") {
      await ToogleLanguage("eng");
    } else {
      await ToogleLanguage("arb");
    }
    router.push("/profile");
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
        className="p-6 absolute w-full mt-5"
      >
        <View className="flex-row  items-center ">

          <View className="flex-row  items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-[rgba(255,255,255,0.8)] rounded-full p-1"
            >
              <ChevronLeft color="black" size={18} />
            </TouchableOpacity>
            <Text className="text-[18px] text-white ml-3" style={{ fontFamily: "CenturyGothic" }}>
              {applanguage === "eng"
                ? Translations.eng.language
                : Translations.arb.language}

            </Text>
          </View>
        </View>

      </View>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>

        <View className="p-5">

          <RadioButtonGroup
            containerStyle={{ marginBottom: 10, display: "flex" }}
            selected={current}
            onSelected={(value) => setCurrent(value)}
            radioBackground="#4E4848"
          >
            {/* <RadioButtonItem
          value="1"
          label={
            <Text style={{ color: "#181716" , fontSize:20 }}>     
            {applanguage === "eng" || current === "1"
              ? Translations.eng.english
              : Translations.arb.english}

</Text>
          }
        />

        <View className="h-3"></View>

<RadioButtonItem
          value="2"
          label={
            <Text style={{ color: "#181716"  , fontSize:20 }}>
               {applanguage === "eng" || current === "1"
                      ? Translations.eng.arabic
                      : Translations.arb.arabic}

            </Text>
          }
        /> */}

            <RadioButtonItem
              value="1"
              label={
                <Text
                  style={{
                    color: "#181716",
                    fontSize: 20,
                    fontWeight: current === "1" ? "bold" : "normal",
                  }}
                >
                  English
                </Text>
              }
            />

            <View className="h-3" />

            <RadioButtonItem
              value="2"
              label={
                <Text
                  style={{
                    color: "#181716",
                    fontSize: 20,
                    fontWeight: current === "2" ? "bold" : "normal",
                  }}
                >
                  العربية
                </Text>
              }
            />

          </RadioButtonGroup>


        </View>


      </ScrollView>

      <TouchableOpacity className=" my-4  mx-12 bg-[#FFB800] rounded-xl py-4 mb-14 shadow-lg"
        onPress={handleSave}
      >
        <Text className="font-bold text-center text-black " style={{ fontFamily: "Lato" }}>
          {applanguage === "eng"
            ? Translations.eng.save
            : Translations.arb.save}

        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default language;
