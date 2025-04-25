import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Easing,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
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
import { useFormik } from "formik";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Translations from "../../../language";
import { langaugeContext } from "../../../customhooks/languageContext";
import addaddresSchema from "../../../yupschema/addressSchema";
import flightloader from "../../../assets/images/flightloader.gif";
import Toast from "react-native-toast-message";


const addaddress = () => {
  const insets = useSafeAreaInsets();
  const { applanguage } = langaugeContext()
const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        // Toast.show("No token found. Please log in.");
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Please login again",
        });
        return;
      }

      const res = await ADD_ADDRESS(values, token);
      console.log("Address saved successfully", res.data);
      // Toast.show("Address saved successfully");
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Address saved successfully",
      });
      router.back();
    } catch (error) {
      console.log("Error:", error.response);
      // Toast.show(error?.response?.data?.message || "Failed to submit address");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.message || "Failed to submit address",
    })
  }
    finally { 
      setLoading(false);
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
        className="bg-[#FFB648] rounded-lg w-[90%] h-14 mx-auto mt-4 flex items-center justify-center mb-10"
        onPress={() =>{ 
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
        <Text className="font-bold text-center text-black " >{applanguage==="eng"?Translations.eng.save:Translations.arb.save
              }</Text>
            )}
      </TouchableOpacity>
    </View>
  );
};

export default addaddress;
