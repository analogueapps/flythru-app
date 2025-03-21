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
import { ADD_ADDRESS } from "../../network/apiCallers";
import { useToast } from "react-native-toast-notifications";
import { useFormik } from "formik";
import addaddresSchema from "../../yupschema/addressSchema";
import AsyncStorage from "@react-native-async-storage/async-storage";


const addaddress = () => {
  const insets = useSafeAreaInsets();
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      addressData: "",
      city: "",
      state: "",
      postalCode: "",
      locationName: "",
    },
    validationSchema: addaddresSchema,
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
              Add Address
            </Text>
          </View>
        </View>
      </View>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>
        <View className="w-full flex-col gap-5">
          <Text className="w-[90%] m-auto">
            Address<Text className="text-red">*</Text>
          </Text>
          <TextInput
            className="bg-white p-3 w-[90%] m-auto rounded-lg"
            onChangeText={formik.handleChange("addressData")}
            onBlur={formik.handleBlur("addressData")}
            value={formik.values.addressData}
            name="addressData"
            placeholder="Enter Address"
          />

          {formik.touched.addressData && formik.errors.addressData && (
            <Text className="text-red-500">{formik.errors.addressData}</Text>
          )}

          <Text className="w-[90%] m-auto">
            City<Text className="text-red">*</Text>
          </Text>
          <TextInput
            className="bg-white p-3 w-[90%] m-auto rounded-lg"
            onChangeText={formik.handleChange("city")}
            onBlur={formik.handleBlur("city")}
            value={formik.values.city}
            name="city"
            placeholder="Enter City"
          />

          {formik.touched.city && formik.errors.city && (
            <Text className="text-red-500">{formik.errors.city}</Text>
          )}

          <Text className="w-[90%] m-auto">
            State<Text className="text-red">*</Text>
          </Text>
          <TextInput
            className="bg-white p-3 w-[90%] m-auto rounded-lg"
            onChangeText={formik.handleChange("state")}
            onBlur={formik.handleBlur("state")}
            value={formik.values.state}
            name="state"
            placeholder="Enter State"
          />

          {formik.touched.state && formik.errors.state && (
            <Text className="text-red-500">{formik.errors.state}</Text>
          )}

          <Text className="w-[90%] m-auto">
            Postal Code<Text className="text-red">*</Text>
          </Text>
          <TextInput
            className="bg-white p-3 w-[90%] m-auto rounded-lg"
            onChangeText={formik.handleChange("postalCode")}
            onBlur={formik.handleBlur("postalCode")}
            value={formik.values.postalCode}
            name="postalCode"
            placeholder="Enter Postalcode"
          />

          {formik.touched.postalCode && formik.errors.postalCode && (
            <Text className="text-red-500">{formik.errors.postalCode}</Text>
          )}

          <Text className="w-[90%] m-auto">Location Name</Text>
          <TextInput
            className="bg-white p-3 w-[90%] m-auto rounded-lg"
            onChangeText={formik.handleChange("locationName")}
            onBlur={formik.handleBlur("locationName")}
            value={formik.values.locationName}
            name="locationName"
            placeholder="Enter Location"
          />

          {formik.touched.locationName && formik.errors.locationName && (
            <Text className="text-red-500">{formik.errors.locationName}</Text>
          )}
        </View>
      </ScrollView>
      <TouchableOpacity
        className=" my-4  mx-12 bg-[#FFB800] rounded-xl py-4 mb-14 shadow-lg"
        onPress={() => router.push("/profile")}
      >
        <Text className="font-bold text-center text-black " onPress={formik.handleSubmit}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default addaddress;
