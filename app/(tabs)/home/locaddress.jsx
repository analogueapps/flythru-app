import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import { ADD_ADDRESS } from "../../../network/apiCallers";
import { useFormik } from "formik";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Translations from "../../../language";
import { langaugeContext } from "../../../customhooks/languageContext";
import addaddresSchema from "../../../yupschema/addressSchema";
import flightloader from "../../../assets/images/flightloader.gif";
import Toast from "react-native-toast-message";
import Checkbox from 'expo-checkbox';
import AlertModal from "../../alertmodal";
import SuccessModal from "../../successmodal";
// import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
// import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
// import dp from "../../../assets/images/dpfluthru.jpg";
// import { Calendar } from "lucide-react-native";
// import Send from "../../../assets/svgs/send";

const locaddress = () => {
  const insets = useSafeAreaInsets();
  const { applanguage } = langaugeContext()
  const [loading, setLoading] = useState(false);
  const [isDefault, setIsDefault] = useState(false);
 const [errorMessage, setErrorMessage] = useState('')
  const [isModalShow, setIsModalShow] = useState(false)
  const [isSuccessModalShow, setIsSuccessModalShow] = useState(false)
  const translateX = useRef(new Animated.Value(0)).current;


  const startAnimation = () => {
    translateX.setValue(-40); // Reset position

    Animated.loop(
      Animated.timing(translateX, {
        toValue: 100, // How far to move
        duration: 3000, // Slower movement
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();
  };

  // Run it when loading starts
  useEffect(() => {
    if (loading) {
      startAnimation();
    } else {
      translateX.stopAnimation();
      translateX.setValue(0); // Reset to start
    }
  }, [loading]);



  const formik = useFormik({
    initialValues: {
      addressName: "",
      area: "",
      block: "",
      streetAddress: "",
      avenue: "",
      buildingNumber: "",
      floorNo: "",
      flatNo: "",
    },
    validationSchema: addaddresSchema(applanguage),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      await handleAddress(values)
    },
  });

  const handleAddress = async (values) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        // Toast.show("No token found. Please log in.");
        // Toast.show({
        //   type: "info",
        //   text1: "Please login to add address",
        // });
        setErrorMessage('Please login to add address"')
        setIsModalShow(true)
        return;
      }

      const forSenddata = { ...values, defaultAddress: isDefault }



      const res = await ADD_ADDRESS(forSenddata, token);
      // Toast.show("Address saved successfully");
      // Toast.show({
      //   type: "success",
      //   text1: "Success",
      //   text2: "Address saved successfully",
      // });
      setIsSuccessModalShow(true)
      router.back();
    } catch (error) {
      console.log("Error:", error.response);
      // Toast.show(error?.response?.data?.message || "Failed to submit address");
      // Toast.show({
      //   type: "info",

      //   text1: error?.response?.data?.message || "Failed to submit address",
      // })
      setErrorMessage(error?.response?.data?.message || "Failed to submit address")
        setIsModalShow(true)
    }
    finally {
      setLoading(false);
    }
  };



  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
            {isModalShow && <AlertModal message={errorMessage} onClose={() => setIsModalShow(false)} />}
            {isSuccessModalShow && <SuccessModal heading="Success" message='Address saved successfully' onClose={() => setIsSuccessModalShow(false)} />}

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
                {applanguage === "eng" ? Translations.eng.address : Translations.arb.address
                }
              </Text>
            </View>
          </View>
        </View>
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>
          <View className="w-full flex-col gap-5">
            <View>
              <Text className="mb-2" style={{ fontFamily: "Lato" }}>
                {applanguage === "eng" ? Translations.eng.enter_address_name : Translations.arb.enter_address_name
                }
              </Text>
              <TextInput
                // maxLength={50}
                className=" rounded-lg p-3 border-2 border-[#8B8B8B]"
                // onChangeText={formik.handleChange("addressName")}
                onChangeText={(text) => {
                  const cleanedText = text.replace(/\s{2,}/g, " "); // Replace multiple spaces with one
                  formik.setFieldValue("addressName", cleanedText);
                }}
                onBlur={formik.handleBlur("addressName")}
                value={formik.values.addressName}
                name="addressName"
                placeholder={
                  applanguage === "eng"
                    ? Translations.eng.address_placeholder
                    : Translations.arb.address_placeholder
                }
              />

              {formik.touched.addressName && formik.errors.addressName && (
                <Text className="text-red-500   px-3" style={{ fontFamily: "Lato" }}>{formik.errors.addressName}</Text>
              )}
            </View>

            <View>
              <Text className="mb-2" style={{ fontFamily: "Lato" }}>
                {applanguage === "eng" ? Translations.eng.area : Translations.arb.area
                }<Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                // maxLength={20}
                onChangeText={(text) => {
                  const cleanedText = text.replace(/\s{2,}/g, " "); // Replace multiple spaces with one
                  formik.setFieldValue("area", cleanedText);
                }}
                className=" rounded-lg p-3 border-2 border-[#8B8B8B]"
                // onChangeText={formik.handleChange("city")}
                onBlur={formik.handleBlur("area")}
                value={formik.values.area}
                name="area"
                placeholder={
                  applanguage === "eng"
                    ? Translations.eng.area_placeholder
                    : Translations.arb.area_placeholder
                }
              />

              {formik.touched.area && formik.errors.area && (
                <Text className="text-red-500  px-3" style={{ fontFamily: "Lato" }}>{formik.errors.area}</Text>
              )}
            </View>

            <View>
              <Text className="mb-2" style={{ fontFamily: "Lato" }}>
                {applanguage === "eng" ? Translations.eng.block : Translations.arb.block
                }<Text className="text-red-500" style={{ fontFamily: "Lato" }}>*</Text>
              </Text>
              <TextInput
                onChangeText={(text) => {
                  const cleanedText = text.replace(/\s{2,}/g, " "); // Replace multiple spaces with one
                  formik.setFieldValue("block", cleanedText);
                }}
                // maxLength={20}
                className=" rounded-lg p-3 border-2 border-[#8B8B8B]"
                // onChangeText={formik.handleChange("block")}
                onBlur={formik.handleBlur("block")}
                value={formik.values.block}
                name="block"
                placeholder={
                  applanguage === "eng"
                    ? Translations.eng.block_placeholder
                    : Translations.arb.block_placeholder
                } />

              {formik.touched.block && formik.errors.block && (
                <Text className="text-red-500  px-3" style={{ fontFamily: "Lato" }}>{formik.errors.block}</Text>
              )}
            </View>

            <View>
              <Text className="mb-2" style={{ fontFamily: "Lato" }}>
                {applanguage === "eng" ? Translations.eng.street_address : Translations.arb.street_address
                }<Text className="text-red-500" style={{ fontFamily: "Lato" }}>*</Text>
              </Text>
              <TextInput
                // maxLength={5}

                className=" rounded-lg p-3 border-2 border-[#8B8B8B]"
                onChangeText={(text) => {
                  const cleanedText = text.replace(/\s{2,}/g, " "); // Replace multiple spaces with one
                  formik.setFieldValue("streetAddress", cleanedText);
                }}
                // onChangeText={
                //   formik.handleChange("streetAddress")}
                onBlur={formik.handleBlur("streetAddress")}
                value={formik.values.streetAddress}
                name="streetAddress"
                placeholder={
                  applanguage === "eng"
                    ? Translations.eng.street_address_placeholder
                    : Translations.arb.street_address_placeholder
                } />

              {formik.touched.streetAddress && formik.errors.streetAddress && (
                <Text className="text-red-500  px-3">{formik.errors.streetAddress}</Text>
              )}
            </View>

            <View>
              <Text className="mb-2">{applanguage === "eng" ? Translations.eng.avenue : Translations.arb.avenue}</Text>
              <TextInput
                // maxLength={50}
                onChangeText={(text) => {
                  const cleanedText = text.replace(/\s{2,}/g, " "); // Replace multiple spaces with one
                  formik.setFieldValue("avenue", cleanedText);
                }}
                className=" rounded-lg p-3 border-2 border-[#8B8B8B]"
                // onChangeText={formik.handleChange("avenue")}
                onBlur={formik.handleBlur("avenue")}
                value={formik.values.avenue}
                name="avenue"
                placeholder={
                  applanguage === "eng"
                    ? Translations.eng.avenue_placeholder
                    : Translations.arb.avenue_placeholder
                } />

              {formik.touched.avenue && formik.errors.avenue && (
                <Text className="text-red-500  px-3">{formik.errors.avenue}</Text>
              )}
            </View>
            <View>
              <Text className="mb-2">{applanguage === "eng" ? Translations.eng.house_building : Translations.arb.house_building}<Text className="text-red-500" style={{ fontFamily: "Lato" }}>*</Text></Text>
              <TextInput
                // maxLength={50}
                onChangeText={(text) => {
                  const cleanedText = text.replace(/\s{2,}/g, " "); // Replace multiple spaces with one
                  formik.setFieldValue("buildingNumber", cleanedText);
                }}
                className=" rounded-lg p-3 border-2 border-[#8B8B8B]"
                // onChangeText={formik.handleChange("buildingNumber")}
                onBlur={formik.handleBlur("buildingNumber")}
                value={formik.values.buildingNumber}
                name="buildingNumber"
                placeholder={
                  applanguage === "eng"
                    ? Translations.eng.house_building_placeholder
                    : Translations.arb.house_building_placeholder
                } />

              {formik.touched.buildingNumber && formik.errors.buildingNumber && (
                <Text className="text-red-500  px-3">{formik.errors.buildingNumber}</Text>
              )}
            </View>
            <View>
              <Text className="mb-2">{applanguage === "eng" ? Translations.eng.floor_no : Translations.arb.floor_no}</Text>
              <TextInput
                // maxLength={50}
                keyboardType="number-pad"
                onChangeText={(text) => {
                  const cleanedText = text.replace(/\s{2,}/g, " "); // Replace multiple spaces with one
                  formik.setFieldValue("floorNo", cleanedText);
                }}
                className=" rounded-lg p-3 border-2 border-[#8B8B8B]"
                // onChangeText={formik.handleChange("floorNo")}
                onBlur={formik.handleBlur("floorNo")}
                value={formik.values.floorNo}
                name="floorNo"
                placeholder={
                  applanguage === "eng"
                    ? Translations.eng.floor_no_placeholder
                    : Translations.arb.floor_no_placeholder
                } />

              {formik.touched.floorNo && formik.errors.floorNo && (
                <Text className="text-red-500  px-3">{formik.errors.floorNo}</Text>
              )}
            </View>
            <View>
              <Text className="mb-2">{applanguage === "eng" ? Translations.eng.flat_no : Translations.arb.flat_no}</Text>
              <TextInput
                // maxLength={50}
                keyboardType="number-pad"
                onChangeText={(text) => {
                  const cleanedText = text.replace(/\s{2,}/g, " "); // Replace multiple spaces with one
                  formik.setFieldValue("flatNo", cleanedText);
                }}
                className=" rounded-lg p-3 border-2 border-[#8B8B8B]"
                // onChangeText={formik.handleChange("flatNo")}
                onBlur={formik.handleBlur("flatNo")}
                value={formik.values.flatNo}
                name="flatNo"
                placeholder={
                  applanguage === "eng"
                    ? Translations.eng.flat_no_placeholder
                    : Translations.arb.flat_no_placeholder
                } />

              {formik.touched.flatNo && formik.errors.flatNo && (
                <Text className="text-red-500  px-3">{formik.errors.flatNo}</Text>
              )}
            </View>
           
            <TouchableOpacity
              style={{
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.50,
                shadowRadius: 3.84,
              }}
              className="bg-[#FFB648] rounded-lg w-[90%] h-14 mx-auto mt-4 flex items-center justify-center mb-3"
              onPress={() => {
                formik.handleSubmit()
              }}
            >
              {loading ? (
                <Animated.View
                  style={{
                    transform: [{ translateX }],

                    width: 100,
                    height: 100,
                    alignSelf: "center",
                  }}
                >
                  <Image
                    source={flightloader}
                    style={{ width: 100, height: 100 }}
                    resizeMode="contain"

                  />
                </Animated.View>

              ) : (
                <Text className="font-bold text-center text-[#164F90] " 
                
                >{applanguage === "eng" ? Translations.eng.next : Translations.arb.next
                }</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default locaddress;
