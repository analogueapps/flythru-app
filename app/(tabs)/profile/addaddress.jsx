import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useEffect } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import dp from "../../../assets/images/dpfluthru.jpg"; 
import { Calendar } from "lucide-react-native";
import Send from "../../../assets/svgs/send";
import { ADD_ADDRESS } from "../../../network/apiCallers";
import { useToast } from "react-native-toast-notifications";
import { useFormik } from "formik";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Translations from "../../../language";
import { langaugeContext } from "../../../customhooks/languageContext";
import addaddresSchema from "../../../yupschema/addressSchema";


const addaddress = () => {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { applanguage } = langaugeContext()


  const formik = useFormik({
    initialValues: {
      addressData: "",
      city: "",
      state: "",
      postalCode: "",
      locationName: "",
    },
    validationSchema: addaddresSchema(applanguage),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      console.log("Submitting values:", values);
      await handleAddress(values)
    },
  });

  const handleAddress = async (values) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        toast.show("No token found. Please log in.");
        return;
      }

      const res = await ADD_ADDRESS(values, token);
      console.log("Address saved successfully", res.data);
      toast.show("Address saved successfully");
      router.back();
    } catch (error) {
      console.log("Error:", error.response);
      toast.show(error?.response?.data?.message || "Failed to submit address");
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
          <View className="flex-row  items-center ">
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
              {applanguage==="eng"?Translations.eng.add_address:Translations.arb.add_address
              }
            </Text>
          </View>
        </View>
      </View>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>
        <View className="w-full flex-col gap-5">
          <Text className="w-[90%] m-auto">
          {applanguage==="eng"?Translations.eng.address:Translations.arb.address
              }<Text className="text-red-500">*</Text>
          </Text>
          <TextInput
          maxLength={50}
            className="bg-white p-3 w-[90%] m-auto rounded-lg"
            // onChangeText={formik.handleChange("addressData")}
            onChangeText={(text) => {
              const cleanedText = text.replace(/\s{2,}/g, " "); // Replace multiple spaces with one
              formik.setFieldValue("addressData", cleanedText);
            }}
            onBlur={formik.handleBlur("addressData")}
            value={formik.values.addressData}
            name="addressData"
            placeholder={
              applanguage === "eng"
                ? Translations.eng.address_placeholder
                : Translations.arb.address_placeholder
            }
          />
 
          {formik.touched.addressData && formik.errors.addressData && (
            <Text className="text-red-500 w-[90%]  px-3 m-auto">{formik.errors.addressData}</Text>
          )}

          <Text className="w-[90%] m-auto">
          {applanguage==="eng"?Translations.eng.city:Translations.arb.city
              }<Text className="text-red-500">*</Text>
          </Text>
          <TextInput
          maxLength={20}
          onChangeText={(text) => {
            const cleanedText = text.replace(/\s{2,}/g, " "); // Replace multiple spaces with one
            formik.setFieldValue("city", cleanedText);
          }}
            className="bg-white p-3 w-[90%] m-auto rounded-lg"
            // onChangeText={formik.handleChange("city")}
            onBlur={formik.handleBlur("city")}
            value={formik.values.city}
            name="city"
            placeholder={
              applanguage === "eng"
                ? Translations.eng.city_placeholder
                : Translations.arb.city_placeholder
            }
          />

          {formik.touched.city && formik.errors.city && (
            <Text className="text-red-500 w-[90%] px-3 m-auto">{formik.errors.city}</Text>
          )}

          <Text className="w-[90%] m-auto">
          {applanguage==="eng"?Translations.eng.state:Translations.arb.state
              }<Text className="text-red-500">*</Text>
          </Text>
          <TextInput
           onChangeText={(text) => {
            const cleanedText = text.replace(/\s{2,}/g, " "); // Replace multiple spaces with one
            formik.setFieldValue("state", cleanedText);
          }}
          maxLength={20}
            className="bg-white p-3 w-[90%] m-auto rounded-lg"
            // onChangeText={formik.handleChange("state")}
            onBlur={formik.handleBlur("state")}
            value={formik.values.state}
            name="state"
            placeholder={
              applanguage === "eng"
                ? Translations.eng.state_placeholder
                : Translations.arb.state_placeholder
            }          />

          {formik.touched.state && formik.errors.state && (
            <Text className="text-red-500 w-[90%] px-3 m-auto">{formik.errors.state}</Text>
          )}

          <Text className="w-[90%] m-auto">
          {applanguage==="eng"?Translations.eng.postal_code:Translations.arb.postal_code
              }<Text className="text-red-500">*</Text>
          </Text>
          <TextInput
          maxLength={5}
          keyboardType="number-pad"
            className="bg-white p-3 w-[90%] m-auto rounded-lg"
            onChangeText={formik.handleChange("postalCode")}
            onBlur={formik.handleBlur("postalCode")}
            value={formik.values.postalCode.trim()}
            name="postalCode"
            placeholder={
              applanguage === "eng"
                ? Translations.eng.postal_placeholder
                : Translations.arb.postal_placeholder
            }          />

          {formik.touched.postalCode && formik.errors.postalCode && (
            <Text className="text-red-500 w-[90%] px-3 m-auto">{formik.errors.postalCode}</Text>
          )}

          <Text className="w-[90%] m-auto">{applanguage==="eng"?Translations.eng.location_name:Translations.arb.location_name
              }</Text>
          <TextInput
          maxLength={50}
          onChangeText={(text) => {
            const cleanedText = text.replace(/\s{2,}/g, " "); // Replace multiple spaces with one
            formik.setFieldValue("locationName", cleanedText);
          }}
            className="bg-white p-3 w-[90%] m-auto rounded-lg"
            // onChangeText={formik.handleChange("locationName")}
            onBlur={formik.handleBlur("locationName")}
            value={formik.values.locationName}
            name="locationName"
            placeholder={
              applanguage === "eng"
                ? Translations.eng.location_placeholder
                : Translations.arb.location_placeholder
            }          />

          {formik.touched.locationName && formik.errors.locationName && (
            <Text className="text-red-500 w-[90%] px-3 m-auto">{formik.errors.locationName}</Text>
          )}
        </View>
      </ScrollView>
      <TouchableOpacity
        className=" my-4  mx-12 bg-[#FFB800] rounded-xl py-4 mb-14 shadow-lg"
        onPress={() =>{ 
          formik.handleSubmit()
        }}
      >
        <Text className="font-bold text-center text-black " >{applanguage==="eng"?Translations.eng.save:Translations.arb.save
              }</Text>
      </TouchableOpacity>
    </View>
  );
};

export default addaddress;
