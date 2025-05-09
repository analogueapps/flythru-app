import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Easing,
  ActivityIndicator,
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
import { useAuth } from "../../../UseContext/AuthContext";
import { EDIT_PROFILE, GET_PROFILE } from "../../../network/apiCallers";
import { useFormik } from "formik";
import { langaugeContext } from "../../../customhooks/languageContext";
import Translations from "../../../language";
import editprofileSchema from "../../../yupschema/editProfileSchema";
import AsyncStorage from "@react-native-async-storage/async-storage";
import flightloader from "../../../assets/images/flightloader.gif";
import Toast from "react-native-toast-message";

const editprofile = () => {
  const insets = useSafeAreaInsets();
  const { applanguage } = langaugeContext();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // 👈 for page loader

  const { userEmail, userName, userPhone, SaveMail, SaveName, SavePhone } =
    useAuth();

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
      name: userName || "",
      email: userEmail || "",
      phoneNumber: userPhone || "",
    },

    enableReinitialize: true,
    validationSchema: editprofileSchema(applanguage),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      console.log("values submitted edit profile:", values);
      await editprofilehandler(values);
    },
  });

  useEffect(() => {
    fetchProfileData();
  }, []); 

  useEffect(() => {
    if (userEmail) {
      formik.setFieldValue("email", userEmail);
    }
  }, [userEmail]);

  const fetchProfileData = async () => {
    setInitialLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      console.log("Token:", token);
      
      if (!token) {
        // Clear form values
        formik.setValues({
          name: "",
          email: userEmail || "",
          phoneNumber: "",
        });
      
        // Clear context values
        await SaveName("");
        await SavePhone("");
      
        Toast.show({
          type: "info",
      
          text1: "Please login",
        });
        setInitialLoading(false); // 👈 prevent loader from hanging
        return;
      }
      

      const response = await GET_PROFILE(token);
      const { userDetails } = response.data;
       
      // Update form values with fetched data
      formik.setValues({
        name: userDetails.name || "",
        email: userDetails.email || userEmail || "",
        phoneNumber: userDetails.phoneNumber?.toString() || userPhone || "",
      });

      // Update context with fresh data
      await SaveName(userDetails.name || "");
      await SavePhone(userDetails.phoneNumber?.toString() || "");
      if (userDetails.email) SaveMail(userDetails.email);

    } catch (error) {
      console.log("Error fetching profile:", error);
      Toast.show({
        type: "info",
  
        text1: "Failed to load profile data",
      });
    } 
    finally {
      setInitialLoading(false);
    } 
  };

  const editprofilehandler = async (values) => {
    setLoading(true);
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      Toast.show({
        type: "info",
     
        text1: "Failed to load profile data",
      });
      return;
    }

    try {
      const res = await EDIT_PROFILE(values, token);
      console.log(res.data.message);
      Toast.show({
        type: "success",
        text1: res.data.message,
      });
      
      // Update context with new values
      await SaveName(values.name);
      await SavePhone(values.phoneNumber);
      
      // Optionally refresh profile data
      await fetchProfileData();
      
      router.push("/profile");
    } catch (error) {
      console.log("Error updating profile:", error?.response);
      Toast.show({
        type: "info",
    
        text1: error.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  // if (initialLoading) {
  //   return (
  //     <View className="flex-1 justify-center items-center bg-white">
  //       <ActivityIndicator size="large" color="#0b005c" />
  //     </View>
  //   );
  // }
  

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
              {" "}
              {applanguage === "eng"
                ? Translations.eng.profile_details
                : Translations.arb.profile_details}
            </Text>
          </View>
        </View>
      </View>
      {initialLoading ?
      (

        <View className="flex-1 justify-center items-center bg-white">
       <ActivityIndicator size="large" color="#164F90" />
     </View>
      ):(
     
      <ScrollView className="flex-1 " contentContainerStyle={{ padding: 15 , display:"flex" , justifyContent:"space-between", height:"100%"}}>
        <View className="px-7 flex-col gap-y-4">
          <View className="mb-2">
            <Text className="text-[#40464C] text-lg font-bold" style={{ fontFamily: "Lato" }}>
              {" "}
              {applanguage === "eng"
                ? Translations.eng.name
                : Translations.arb.name}
            </Text>
            <TextInput
              className=" rounded-lg p-3 border-2 border-[#8B8B8B]"
              placeholder={
                applanguage === "eng"
                  ? Translations.eng.name_placeholder
                  : Translations.arb.name_placeholder
              }
              onChangeText={(text) => {
                const cleanedText = text.replace(/\s{2,}/g, " ");
                formik.setFieldValue("name", cleanedText);
              }}
              onBlur={formik.handleBlur("name")}
              value={formik.values.name.trimStart()}
              placeholderTextColor={"#1A1C1E"}
            />
            {formik.touched.name && formik.errors.name && (
              <Text className="text-red-500" style={{ fontFamily: "Lato" }}>{formik.errors.name}</Text>
            )}
          </View>

          <View className="mb-2">
            <Text className="text-[#40464C] text-lg font-bold" style={{ fontFamily: "Lato" }}>
              {" "}
              {applanguage === "eng"
                ? Translations.eng.email_id
                : Translations.arb.email_id}
            </Text>
            <TextInput
              className=" rounded-lg p-3 border-2 border-[#8B8B8B]"
              placeholder={
                applanguage === "eng"
                  ? Translations.eng.email_placeholder
                  : Translations.arb.email_placeholder
              }
              onChangeText={formik.handleChange("email")}
              onBlur={formik.handleBlur("email")}
              placeholderTextColor={"#1A1C1E"}
              value={formik.values.email}
              editable={false}
            />
            {formik.touched.email && formik.errors.email && (
              <Text className="text-red-500" style={{ fontFamily: "Lato" }}>{formik.errors.email}</Text>
            )}
          </View>

          <View className="mb-2">
            <Text className="text-[#40464C] text-lg font-bold" style={{ fontFamily: "Lato" }}>
              {" "}
              {applanguage === "eng"
                ? Translations.eng.phone_number
                : Translations.arb.phone_number}
            </Text>
            <TextInput
              maxLength={8}
              keyboardType="number-pad"
              className=" rounded-lg p-3 border-2 border-[#8B8B8B]"
              placeholder={
                applanguage === "eng"
                  ? Translations.eng.phone_placeholder
                  : Translations.arb.phone_placeholder
              }
              onChangeText={(text) => {
                const cleanedText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
                formik.setFieldValue("phoneNumber", cleanedText);
              }}
              onBlur={formik.handleBlur("phoneNumber")}
              value={formik.values.phoneNumber}
              placeholderTextColor={"#1A1C1E"}
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <Text className="text-red-500" style={{ fontFamily: "Lato" }}>{formik.errors.phoneNumber}</Text>
            )}
          </View>
        </View>

      <TouchableOpacity
        disabled={loading}
        className="bg-[#FFB648] rounded-lg w-[80%] h-14 mx-auto mt-4 flex items-center justify-center mb-10"
        style={{
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.50,
          shadowRadius: 3.84,
        }}
        onPress={formik.handleSubmit}
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
          <Text className="font-bold text-center text-black " style={{ fontFamily: "Lato" }}>
            {" "}
            {applanguage === "eng" ? Translations.eng.save : Translations.arb.save}
          </Text>
        )}
      </TouchableOpacity>
      </ScrollView>
        )}
    </View>
  );
};

export default editprofile;