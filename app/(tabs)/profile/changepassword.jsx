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
import { ChevronLeft, Eye, EyeOff } from "lucide-react-native";
import { router } from "expo-router";
// import { Change_Password } from "../../../network/apiCallers";
import { useFormik } from "formik";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Translations from "../../../language";
import { langaugeContext } from "../../../customhooks/languageContext";
import addaddresSchema from "../../../yupschema/addressSchema";
import flightloader from "../../../assets/images/flightloader.gif";
import Toast from "react-native-toast-message";
import Checkbox from 'expo-checkbox';
import changePassValidationSchema from "../../../yupschema/changePassword";


const ChangePassword = () => {
  const insets = useSafeAreaInsets();
  const { applanguage } = langaugeContext()
  const [loading, setLoading] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
const [showOldPassword,setShowOldPassword] = useState(false)
const [showNewPassword,setShowNewPassword] = useState(false)
const [showConfirmNewPassword,setShowConfirmNewPassword] = useState(false)

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
      oldpassword: "",
      newpassword: "",
      confirmnewpassword: "",
    },
    validationSchema: changePassValidationSchema(applanguage),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      await handleChangePass(values)
    },
  });

  const handleChangePass = async (values) => {
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

      console.log(values);

      // router.back();
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
                {applanguage === "eng" ? Translations.eng.change_password : Translations.arb.change_password
                }
              </Text>
            </View>
          </View>
        </View>
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>
          <View className="w-full flex-col gap-5">

            <View>
              <Text className="mb-2">{applanguage === "eng" ? Translations.eng.old_password : Translations.arb.old_password}</Text>
              <View className="flex-row items-center bg-[#f2f2f2] border border-[#8B8B8B] h-14 px-2 my-4 rounded-lg w-[90%] mx-auto">

                <TextInput
                  // maxLength={50}
                  // keyboardType="number-pad"
                  secureTextEntry={!showOldPassword}
                  onChangeText={(text) => {
                    const cleanedText = text.replace(/\s{2,}/g, " ");
                    if (cleanedText.length < 15)
                      formik.setFieldValue("oldpassword", cleanedText);
                  }}
                  className=" rounded-lg p-3 border-2 border-[#8B8B8B]"
                  // onChangeText={formik.handleChange("oldpassword")}
                  onBlur={formik.handleBlur("oldpassword")}
                  value={formik.values.oldpassword}
                  name="oldpassword"
                  placeholder={
                    applanguage === "eng"
                      ? Translations.eng.old_password_placeholder
                      : Translations.arb.old_password_placeholder
                  } />
                <TouchableOpacity
                  onPress={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? (
                    <EyeOff size={22} color="#8B8B8B" />
                  ) : (
                    <Eye size={22} color="#8B8B8B" />
                  )}
                </TouchableOpacity>
              </View>

              {formik.touched.oldpassword && formik.errors.oldpassword && (
                <Text className="text-red-500  px-3">{formik.errors.oldpassword}</Text>
              )}
            </View>
            <View>
              <Text className="mb-2">{applanguage === "eng" ? Translations.eng.new_password : Translations.arb.new_password}</Text>
              <View className="flex-row items-center bg-[#f2f2f2] border border-[#8B8B8B] h-14 px-2 my-4 rounded-lg w-[90%] mx-auto">

                <TextInput
                  // maxLength={50}
                  secureTextEntry={!showNewPassword}
                  onChangeText={(text) => {
                    const cleanedText = text.replace(/\s{2,}/g, " ");
                    if (cleanedText.length < 15)
                      formik.setFieldValue("newpassword", cleanedText);
                  }}
                  className=" rounded-lg p-3 border-2 border-[#8B8B8B]"
                  // onChangeText={formik.handleChange("newpassword")}
                  onBlur={formik.handleBlur("newpassword")}
                  value={formik.values.newpassword}
                  name="newpassword"
                  placeholder={
                    applanguage === "eng"
                      ? Translations.eng.new_password_placeholder
                      : Translations.arb.new_password_placeholder
                  } />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff size={22} color="#8B8B8B" />
                  ) : (
                    <Eye size={22} color="#8B8B8B" />
                  )}
                </TouchableOpacity>
              </View>

              {formik.touched.newpassword && formik.errors.newpassword && (
                <Text className="text-red-500  px-3">{formik.errors.newpassword}</Text>
              )}
            </View>
            <View>
              <Text className="mb-2">{applanguage === "eng" ? Translations.eng.confirm_new_password : Translations.arb.confirm_new_password}</Text>
              <View className="flex-row items-center bg-[#f2f2f2] border border-[#8B8B8B] h-14 px-2 my-4 rounded-lg w-[90%] mx-auto">

                <TextInput
                  // maxLength={50}
                  secureTextEntry={!showConfirmNewPassword}
                  onChangeText={(text) => {
                    const cleanedText = text.replace(/\s{2,}/g, " "); // Replace multiple spaces with one
                    if (cleanedText.length < 15)
                      formik.setFieldValue("confirmnewpassword", cleanedText);
                  }}
                  className=" rounded-lg p-3 border-2 border-[#8B8B8B]"
                  // onChangeText={formik.handleChange("confirmnewpassword")}
                  onBlur={formik.handleBlur("confirmnewpassword")}
                  value={formik.values.confirmnewpassword}
                  name="confirmnewpassword"
                  placeholder={
                    applanguage === "eng"
                      ? Translations.eng.confirm_new_password_placeholder
                      : Translations.arb.confirm_new_password_placeholder
                  } />

                <TouchableOpacity
                  onPress={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                >
                  {showConfirmNewPassword ? (
                    <EyeOff size={22} color="#8B8B8B" />
                  ) : (
                    <Eye size={22} color="#8B8B8B" />
                  )}
                </TouchableOpacity>
              </View>

              {formik.touched.confirmnewpassword && formik.errors.confirmnewpassword && (
                <Text className="text-red-500  px-3">{formik.errors.confirmnewpassword}</Text>
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
                <Text className="font-bold text-center text-[#164F90] " >{applanguage === "eng" ? Translations.eng.save : Translations.arb.save
                }</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChangePassword;
