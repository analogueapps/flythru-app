import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useState } from "react";
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
import cancellationSchema from "../../yupschema/cancellationSchema";
import { CANCELLATION } from "../../network/apiCallers";
import { useToast } from "react-native-toast-notifications";

const cancellation = () => {
  const insets = useSafeAreaInsets();
  const {bookingId} = useLocalSearchParams()
  const toast = useToast()
    const [apiErr, setApiErr] = useState("");
  

  const formik = useFormik({
    initialValues: {
      reasonForCancellation: "",
    }, 
    validationSchema: cancellationSchema,
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
      toast.show("No token found. Please log in.");
      return;
    }

    try {
      const res = await CANCELLATION(values, token , bookingId);
      console.log(res.data.message);
      toast.show(res.data.message);
      
    } catch (error) {
      console.log("Error sending code:", error?.response);
      setApiErr(error?.response?.data?.message || "Invalid OTP");
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
              Cancellation
            </Text>
          </View>
        </View>
      </View>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>
        <View className="px-7 flex-col gap-2">
          <Text className="text-[#40464C] text-lg">
            Specify Reason for Cancellation
          </Text>
          <TextInput
            numberOfLines={10}
            className="bg-white rounded-lg p-3"
            placeholder="Type here..."
            onChangeText={formik.handleChange("reasonForCancellation")}
            onBlur={formik.handleBlur("reasonForCancellation")}
            value={formik.values.reasonForCancellation}
            textAlignVertical="top"
            placeholderTextColor={"#1A1C1E"}
          />

          {formik.touched.reasonForCancellation && formik.errors.reasonForCancellation && (
            <Text className="text-red-500 w-[90%] mx-auto">
              {formik.errors.reasonForCancellation}
            </Text>
          )}

          <Text className="text-sm">
            Note : Once its Submitted our Support team will connect with you to
            refund the amount with deducted fine amount.
          </Text>
        </View>
      </ScrollView>
      <TouchableOpacity className=" my-4  mx-12 bg-[#FFB800] rounded-xl py-4 mb-14"
      onPress={()=> formik.handleSubmit()}
      >
        <Text className="font-bold text-center text-black ">Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default cancellation;
