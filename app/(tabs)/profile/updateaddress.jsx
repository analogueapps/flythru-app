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
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import dp from "../../../assets/images/dpfluthru.jpg";
import { Calendar } from "lucide-react-native";
import Send from "../../../assets/svgs/send";
import { ADD_ADDRESS, DELETE_ADDRESS, UPDATE_ADDRESS } from "../../../network/apiCallers";
import { useFormik } from "formik";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Translations from "../../../language";
import { langaugeContext } from "../../../customhooks/languageContext";
import addaddresSchema from "../../../yupschema/addressSchema";
import flightloader from "../../../assets/images/flightloader.gif";
import Toast from "react-native-toast-message";
import { AntDesign } from "@expo/vector-icons";
import Checkbox from 'expo-checkbox';


const updateaddress = () => {
  const insets = useSafeAreaInsets();
  const { applanguage } = langaugeContext()
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const translateX = useRef(new Animated.Value(0)).current;

  const {address} = useLocalSearchParams();

  const paramAddressData = JSON.parse(address)

  const ischecked = paramAddressData.default
  const [isDefault, setIsDefault] = useState(ischecked);
  console.log("paramAddressData.default", paramAddressData,isDefault);

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
      addressName: paramAddressData.addressName,
      area: paramAddressData.area,
      block: paramAddressData.block,
      streetAddress: paramAddressData.streetAddress,
      avenue: paramAddressData.avenue,
      buildingNumber: paramAddressData.buildingNumber,
      floorNo: paramAddressData.floorNo,
      flatNo: paramAddressData.flatNo,
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
        Toast.show({
          type: "info",
          text1: "Please login to add address",
        });
        return;
      }
      const forSenddata = { ...values, defaultAddress: isDefault }
     
      const res = await UPDATE_ADDRESS(forSenddata, paramAddressData.id, token);

      if (res.data && res.status == 200) {

        Toast.show({
          type: "success",
          text1: "Success",
          text2: res.data.message,
        });
        router.back();
      }
    } catch (error) {
      console.log("Error:", error.response);
      // Toast.show(error?.response?.data?.message || "Failed to submit address");
      Toast.show({
        type: "info",

        text1: error?.response?.data?.message || "Failed to submit address",
      })
    }
    finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (addressId) => {
    if (!addressId) {
      Toast.show({
        type: "info",

        text1: "Invalid address ID",
      });
      return;
    }

    const token = await AsyncStorage.getItem('authToken');
    console.log("Token:", token);

    if (!token) {
      Toast.show({
        type: "info",

        text1: "Please login to add address",
      });
      return;
    }

    try {
      await DELETE_ADDRESS(addressId, token);


      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Address deleted",
      });
      // router.replace('/profile/address');
      router.back();

    } catch (error) {
      console.log(error);

      Toast.show({
        type: "info",

        text1: error?.response?.data?.message || "Failed to delete address",
      });
    }
  };

  const handleDelete = (addressId) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => deleteAddress(addressId),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
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
                {applanguage === "eng" ? Translations.eng.update_address : Translations.arb.update_address
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
                }<Text className="text-red-500">*</Text>
              </Text>
              <TextInput
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

                className=" rounded-lg p-3 border-2 border-[#8B8B8B]"
                onChangeText={formik.handleChange("streetAddress")}
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
              <Text className="mb-2">{applanguage === "eng" ? Translations.eng.avenue : Translations.arb.avenue}<Text className="text-red-500" style={{ fontFamily: "Lato" }}>*</Text></Text>
              <TextInput
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
              <Text className="mb-2">{applanguage === "eng" ? Translations.eng.floor_no : Translations.arb.floor_no}<Text className="text-red-500" style={{ fontFamily: "Lato" }}>*</Text></Text>
              <TextInput
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
              <Text className="mb-2">{applanguage === "eng" ? Translations.eng.flat_no : Translations.arb.flat_no}<Text className="text-red-500" style={{ fontFamily: "Lato" }}>*</Text></Text>
              <TextInput
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
            <View className="flex flex-row gap-2">
              <Checkbox
                value={isDefault}
                className="border-[#164F90]"
                name="default"
                onValueChange={() => setIsDefault(prev => !prev)}
                color="#164F90"
              />
              <Text onPress={()=>setIsDefault(prev => !prev)} className="mb-2">{applanguage === "eng" ? Translations.eng.select_as_default : Translations.arb.select_as_default}</Text>
            </View>
            <View className="mt-4 flex flex-row gap-x-3 mb-3">
              <TouchableOpacity
                style={{
                  elevation: 5,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.50,
                  shadowRadius: 3.84,
                }}
                className="border border-red-600 bg-white rounded-lg h-14 flex-1 max-w-[500px] mx-auto flex items-center justify-center" onPress={() => paramAddressData.id && handleDelete(paramAddressData.id)}>
                {/* <Text className="font-bold text-center text-[#164F90] " >{applanguage === "eng" ? Translations.eng.delete : Translations.arb.delete
          }</Text> */}
                <AntDesign name="delete" size={19} color="red" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  elevation: 5,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.50,
                  shadowRadius: 3.84,
                }}
                className="bg-[#FFB648] rounded-lg flex-1 max-w-[500px] h-14 mx-auto flex items-center justify-center "
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
                      style={{ width: 80, height: 100 }}
                      resizeMode="contain"

                    />
                  </Animated.View>

                ) : (
                  <Text className="font-bold text-center text-[#164F90] " >{applanguage === "eng" ? Translations.eng.save : Translations.arb.save
                  }</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

      </View>
    </KeyboardAvoidingView>
  );
};

export default updateaddress;
