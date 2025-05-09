import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router, useLocalSearchParams } from "expo-router";
import dp from "../../../assets/images/dpfluthru.jpg";
import { Calendar } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFormik } from "formik";
import { CANCELLATION } from "../../../network/apiCallers";
import { langaugeContext } from "../../../customhooks/languageContext";
import cancellationSchema from "../../../yupschema/cancellationSchema";
import Translations from "../../../language";
import Toast from "react-native-toast-message";

const cancellation = () => {
  const insets = useSafeAreaInsets();
  const {bookingId} = useLocalSearchParams()
    const [apiErr, setApiErr] = useState("");
    const { applanguage } = langaugeContext()

  

  const formik = useFormik({
    initialValues: {
      reasonForCancellation: "", 
    }, 
    validationSchema: cancellationSchema(applanguage),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async ( values) => {
      await cancellationBookingHandler(bookingId , values);
      router.push("/home");
    },
  });

  const cancellationBookingHandler = async (bookingId , values) => {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      Toast.show({
        type: "info",
        text1: "Please login",
      });
      return;
    }

    try {
      const res = await CANCELLATION(values, token , bookingId);
      Toast.show({
        type: "success",
        text1:"Booking cancelled successfully",
        text2: `Your amount will be refunded within "2" days`,
      });
      console.log("booking details" , bookingId);
      console.log("cancelllllllaaaaaaaaaaaaaaaaaa", res.data.message);

      
    } catch (error) {
      console.log("Error sending code:", error?.response);
      setApiErr(error?.response?.data?.message || "Invalid OTP");
    }
  };

  useEffect(()=>{
    console.log("booking details" , bookingId);
      
  },[])

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
        <View className="flex-row  items-center mt-5">
          <View className="flex-row  items-center">
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
              {
                applanguage==="eng"?Translations.eng.cancellation:Translations.arb.cancellation
              }
            </Text>
          </View>
        </View>
      </View>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>
        <View className="px-7 flex-col gap-2">
          <Text className="text-[#40464C] text-lg" style={{ fontFamily: "Lato" }}>
          {
                applanguage==="eng"?Translations.eng.specify_reason_for_cancellation:Translations.arb.specify_reason_for_cancellation
              }
          </Text>
          <TextInput
            numberOfLines={10}
            className="bg-white rounded-lg p-3"
            placeholder={
              applanguage === "eng"
                ? Translations.eng.type_here
                : Translations.arb.type_here
            }   
            onChangeText={formik.handleChange("reasonForCancellation")}
            onBlur={formik.handleBlur("reasonForCancellation")}
            value={formik.values.reasonForCancellation}
            textAlignVertical="top"
            placeholderTextColor={"#1A1C1E"}
          />

          {formik.touched.reasonForCancellation && formik.errors.reasonForCancellation && (
            <Text className="text-red-500 w-[90%] mx-auto" style={{ fontFamily: "Lato" }}>
              {formik.errors.reasonForCancellation}
            </Text>
          )}

          <Text className="text-sm" style={{ fontFamily: "Lato" }}>
          {
                applanguage==="eng"?Translations.eng.cancellation_note:Translations.arb.cancellation_note
              }
          </Text>
        </View>
      </ScrollView>
      <TouchableOpacity className=" my-4  mx-12 bg-[#FFB800] rounded-xl py-4 mb-14"
      onPress={()=> {formik.handleSubmit();
        router.dismissAll();
      }}
      >
        <Text className="font-bold text-center text-black " style={{ fontFamily: "Lato" }}>
        {
                applanguage==="eng"?Translations.eng.submit:Translations.arb.submit
              }
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default cancellation;
