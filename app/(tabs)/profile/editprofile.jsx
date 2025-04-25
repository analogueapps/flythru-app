import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,Easing
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
import { EDIT_PROFILE } from "../../../network/apiCallers";
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
const { userEmail, userName, userPhone, SaveMail, SaveName, SavePhone } = useAuth();

  // console.log("userEmailaaaaaaaaaa" , userEmail)

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
    
    enableReinitialize: true, // ✅ Ensure reinitialization when values change
    validationSchema: editprofileSchema(applanguage),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      console.log("values submitted edit profile:", values);
      await editprofilehandler(values);
      router.push("/profile");
    },
  });

  const saveUserName = async (name) => {
    if (name) {
      // Check if name is not null or undefined
      try {
        await AsyncStorage.setItem("user_name", name);
        console.log("User name saved successfully");
      } catch (error) {
        console.error("Error saving user name:", error);
      }
    } else {
      console.error("Invalid name: Cannot save null or undefined value");
    }
  };

  const saveUserData = async (name, phoneNumber, email) => {
    try {
      if (email) {
        if (name) {
          await AsyncStorage.setItem(`user_name_${email}`, name);
        }
        if (phoneNumber) {
          await AsyncStorage.setItem(`user_phone_${email}`, phoneNumber);
        }
      } else {
        console.warn("No email provided — cannot save user data.");
      }
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };
  
  useEffect(() => {
    if (userEmail) {
      console.log("userEmail:", userEmail);
      formik.setFieldValue("email", userEmail); // ✅ Set email value after userEmail is available
    }
  }, [userEmail]);

  const editprofilehandler = async (values) => {
    setLoading(true);
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      Toast.show("No token found. Please log in.");
      return;
    }

    try {
      const res = await EDIT_PROFILE(values, token);
      console.log(res.data.message);
      Toast.show({
        type: "success",
        text1: res.data.message, 
      });
      // Update formik values after save
      formik.setValues(values);
      await saveUserData(values.name, values.phoneNumber ); // Local storage
      SaveName(values.name); // Context update
      SavePhone(values.phoneNumber); // Context update
          } catch (error) {
      console.log("Error sending code:", error?.response);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadProfileData = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const email = await AsyncStorage.getItem("user_email"); // Or use from context
    
      if (!token || !email) {
        formik.setFieldValue("name", "");
        formik.setFieldValue("phoneNumber", "");
        return;
      }
    
      try {
        const storedName = await AsyncStorage.getItem("user_name");
        const storedPhone = await AsyncStorage.getItem("user_phone");
    
        if (storedName) formik.setFieldValue("name", storedName);
        if (storedPhone) formik.setFieldValue("phoneNumber", storedPhone);
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadProfileData();
  }, []);

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
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>
        <View className="px-7 flex-col gap-y-4">
          <View className="mb-2">
            <Text className="text-[#40464C] text-lg font-bold">
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
              // onChangeText={formik.handleChange("name")}
              onChangeText={(text) => {
                const cleanedText = text.replace(/\s{2,}/g, " "); // Replace multiple spaces with one
                formik.setFieldValue("name", cleanedText);
              }}
              onBlur={formik.handleBlur("name")}
              value={formik.values.name.trimStart()}
              placeholderTextColor={"#1A1C1E"}
            />
            {formik.touched.name && formik.errors.name && (
              <Text className="text-red-500">{formik.errors.name}</Text>
            )}
          </View>

          <View className="mb-2">
            <Text className="text-[#40464C] text-lg font-bold">
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
              <Text className="text-red-500">{formik.errors.email}</Text>
            )}
          </View>

          <View className="mb-2">
            <Text className="text-[#40464C] text-lg font-bold">
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
              // onChangeText={formik.handleChange("phoneNumber")}
              onChangeText={(text) => {
                const cleanedText = text.replace(/\s{2,}/g, " ");
                const cleanednum = text.replace(/[^0-9]/g, ""); // Replace multiple spaces with one
                formik.setFieldValue("phoneNumber", cleanedText , cleanednum);
              }}
              onBlur={formik.handleBlur("phoneNumber")}
              value={formik.values.phoneNumber}
              placeholderTextColor={"#1A1C1E"}
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <Text className="text-red-500">{formik.errors.phoneNumber}</Text>
            )}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
      disabled={loading}
        className="bg-[#FFB648] rounded-lg w-[90%] h-14 mx-auto mt-4 flex items-center justify-center mb-10"
        onPress={() => {
          saveUserName(formik.values.name);
          formik.handleSubmit();
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
        <Text className="font-bold text-center text-black ">
          {" "}
          {applanguage === "eng"
            ? Translations.eng.save
            : Translations.arb.save}
        </Text>
          )}
      </TouchableOpacity>
    </View>
  );
};

export default editprofile;
