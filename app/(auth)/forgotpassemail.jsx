import { View, Text, ScrollView, TouchableOpacity, Animated,Easing, Image, BackHandler, Platform ,TextInput } from "react-native";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import OTPinput from "../../components/OTPinput";
import { router, useFocusEffect } from "expo-router";
import { useFormik } from "formik";
import flightloader from "../../assets/images/flightload.gif";
import logo from '../../assets/images/mainLogo.png';
import { FORGOT_PASSWORD_EMAIL, RESEND_OTP, VERIFY_OTP } from "../../network/apiCallers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { langaugeContext } from "../../customhooks/languageContext";
import Translations from "../../language";
import { otpValidationSchema } from "../../yupschema/otpSchema";
import { useLocalSearchParams } from "expo-router";
import { registerForPushNotificationsAsync } from "../../utlis/registrationsPushNotifications";
import Toast from "react-native-toast-message";
import forgotpassemailSchema from "../../yupschema/forgotPassemailSchema";

const forgotpassemail = () => {
  const [codes, setCodes] = useState(Array(4).fill(""));
  const [errorMessages, setErrorMessages] = useState();
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [apiErr, setApiErr] = useState("");
  const [resentOtpMsg, setResentOtpMsg] = useState(false);
  const {verifytoken} = useLocalSearchParams()
  const { applanguage } = langaugeContext();
const [loading, setLoading] = useState(false);
const { token } = useLocalSearchParams();
const [email, setEmail] = useState("");

  const params = useLocalSearchParams();
  const restoken = params.token;
  // console.log("Received Token:", restoken); 
  const [fcm,setFcm]=useState("")

  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  
  const translateX = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    translateX.setValue(-30); // Reset position
  
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
      email: "",
    },

    enableReinitialize: true,
    validationSchema: forgotpassemailSchema(applanguage),
    validateOnChange: true,
    validateOnBlur: true,
onSubmit: async (values) => {
  const success = await forgotPassemailHandler(values);
  if (success) {
    const updatedParams = {
      ...params,
      email: values.email,
    };

    router.push({
      pathname: "/forgotpassotp",
      params: updatedParams,
    });
  }
},


  });

  const forgotPassemailHandler = async (values) => {
    setLoading(true);
    console.log("Forgot Password Email Handler called with values:", values);

    try {
      const res = await FORGOT_PASSWORD_EMAIL(values);
      console.log(res.data.message);
      Toast.show({
        type: "success",
        text1: res.data.message,
      });
       return true;
    
    } catch (error) {
      console.log("Error updating profile:", error?.response);
      Toast.show({
        type: "info",
        text1: error.response?.data?.message || "Failed to update profile",
      });
       return false;
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <SafeAreaView className="flex-1 bg-white p-6">
      <View className="flex-1">
        {/* Back Button */}
        <TouchableOpacity className="py-6" onPress={() => router.back()}>
          <ChevronLeft color="black" />
        </TouchableOpacity>

        <ScrollView className="flex-1">

             <View className="flex-1 mb-12 justify-center items-center bg-white">
                    <Image
                      source={logo}
                      className="w-44 self-center"
                      resizeMode="contain"
                    />
            </View>
          <View className="px-6">
            <Text 
             className="py-4 text-[18px] font-normal text-center"
                  style={{ fontFamily: "CenturyGothic" }}
            >
              {" "}
              {applanguage === "eng"
                ? Translations.eng.forgot_password_heading
                : Translations.arb.forgot_password_heading}
            </Text>

            <View className="py-4">
              <Text className="text-[#164F90] font-bold text-[20px] "  style={{ fontFamily: "Lato" }}>
                {applanguage === "eng"
                  ? Translations.eng.enter_email_id
                  : Translations.arb.enter_email_id}
              </Text>
             
            </View>

       
            <View className="flex-col justify-between items-center mb-4">
               <TextInput
                    onChangeText={formik.handleChange("email")}
              onBlur={formik.handleBlur("email")}
              value={formik.values.email}
              placeholderTextColor={"#1A1C1E"}
                placeholder={
                  applanguage === "eng"
                    ? Translations.eng.email_placeholder
                    : Translations.arb.email_placeholder
                }
                className=" border h-14 px-2 my-4 py-2 rounded-lg border-[#8B8B8B] w-[100%] mx-auto"
                keyboardType="email-address"
                autoCapitalize="none"
              />

                {formik.touched.email && formik.errors.email && (
              <Text className="text-red-500 self-start" style={{ fontFamily: "Lato" }}>{formik.errors.email}</Text>
            )}

            </View>

          
            <TouchableOpacity
            disabled={loading}
            style={{
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.50,
              shadowRadius: 3.84,
            }}
              onPress={formik.handleSubmit} //  Use handleSubmit instead of router.push
              className="bg-[#FFB648] rounded-lg w-[100%] h-14 mx-auto flex items-center justify-center "
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
              <Text className="text-center text-[#08203C] font-bold text-lg"  style={{ fontFamily: "Lato" }}>
                {applanguage === "eng"
                  ? Translations.eng.submit
                  : Translations.arb.submit}
              </Text>
  )}
            </TouchableOpacity>

            


          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default forgotpassemail;


 