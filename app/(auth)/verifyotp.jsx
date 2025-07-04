import { View, Text, ScrollView, TouchableOpacity, Animated,Easing, Image, BackHandler, Platform, } from "react-native";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import OTPinput from "../../components/OTPinput";
import { router, useFocusEffect } from "expo-router";
import { useFormik } from "formik";
import flightloader from "../../assets/images/flightload.gif";

import { RESEND_OTP, VERIFY_OTP } from "../../network/apiCallers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { langaugeContext } from "../../customhooks/languageContext";
import Translations from "../../language";
import { otpValidationSchema } from "../../yupschema/otpSchema";
import { useLocalSearchParams } from "expo-router";
import { registerForPushNotificationsAsync } from "../../utlis/registrationsPushNotifications";
import Toast from "react-native-toast-message";

const verifyotp = () => {
  const [codes, setCodes] = useState(Array(4).fill(""));
  const [errorMessages, setErrorMessages] = useState();
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [apiErr, setApiErr] = useState("");
  const [resentOtpMsg, setResentOtpMsg] = useState(false);
  const {verifytoken} = useLocalSearchParams()
  const { applanguage } = langaugeContext();
const [loading, setLoading] = useState(false);
const { token } = useLocalSearchParams();

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
  

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
  
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);
  
  const handleResend = () => {
    if (isTimerRunning) return; // prevent if still timing
    resendOtpHandler(restoken || token); // Trigger API only here

    setTimer(60);
    setIsTimerRunning(true);
  };

  useFocusEffect(
    useCallback(() => {
      const clearToken = async () => {
        try {
          // Clear any previous auth token
          await AsyncStorage.removeItem("authToken");
        } catch (error) {
          console.error("Error clearing token:", error);
        }
      };
      clearToken();
      getToken();

      // Handle back button press
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          // Clear the temporary verification token when going back
          router.back();
          return true;
        }
      );

      return () => backHandler.remove();
    }, [])
  );
  


  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: otpValidationSchema(applanguage),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      console.log("Submitting OTP with values:", values);

      await verifyOtpHandler(values);
    
    },
  });

  const { values, handleSubmit, setFieldValue, errors, touched } = formik;
 
  

   useFocusEffect(useCallback(()=> 
    {
      getToken()
    },[]))
    const getToken = async () => {
      try {
        const fcmToken = await registerForPushNotificationsAsync();
        console.log("fcm", fcmToken);
        setFcm(fcmToken);
      } catch (error) {
        console.error("Push notification error:", error);
      }
    };

  // const verifyOtpHandler = async (values) => {

  //   setLoading(true);
  //   const token = await AsyncStorage.getItem("authToken");
  //   if (!token) {
  //     Toast.show({
  //       type: "error",
  //       text1: "No token found. Please log in again.",
  //     });
  //     return;
  //   }
    
  //   const data={
  //     otp:values.otp,
  //     fcmToken:fcm
  //   }
  //   try {
  //     const res = await VERIFY_OTP(data, token);
  //     await AsyncStorage.setItem("authToken", res.data.token); // Ensure this token is being returned and stored

  //     console.log(res.data.message);
  //     Toast.show({
  //       type: "success",
  //       text1: res.data.message || "Signup Successful",
  //     });
  //     console.log("OTP verified response", res.data);
  //     router.replace("/home");
  //   } catch (error) {
  //     console.log("Error sending code:", error?.response);
  //     setApiErr(error?.response?.data?.message || "Invalid OTP");
  //   }
  //   finally{
  //     setLoading(false);
  //   }
  // };

  const verifyOtpHandler = async (values) => {
    setLoading(true);

    try {
      const data = {
        otp: values.otp,
        fcmToken: fcm,
        fcmTokenType: Platform.OS === "android" ? "android" : "ios"
      };
      // Use the token from signup (passed via params) for verification
      const verificationToken = restoken || token;
      if (!verificationToken) {
        throw new Error("Verification token is missing");
      }
      
      const res = await VERIFY_OTP(data, verificationToken);
      
      // Only store token after successful verification
      await AsyncStorage.setItem("authToken", res.data.token);
      
      Toast.show({
        type: "success",
        text1: res.data.message || "Signup Successful",
      });
      
      router.replace("/home");
    } catch (error) {
      console.log("Error sending code:", error?.response);
      setApiErr(error?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOtpHandler = async (token) => {
    console.log("resend method token:", token);

    
  
    if (!token) {
      Toast.show({
        type: "error",
        text1: "Token is missing. Please try again.",
      });
      return;
    }
  
    try {
      const res = await RESEND_OTP(token); // Use the passed token directly
      console.log("OTP resend success:", res.data);
  
      Toast.show({
        type: "success",
        text1: res?.data?.message?.trim() || "OTP Resent",
        duration: 2000,
      });
      setResentOtpMsg(true);
    } catch (error) {
      console.log("Error sending code:", error?.response);
      setApiErr(error?.response?.data?.message || "Failed to resend OTP");
    }
  };
  

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace") {
      if (codes[index] === "") {
        const newCodes = [...codes];
        if (index > 0) {
          newCodes[index - 1] = "";
          setCodes(newCodes);
          setFieldValue("otp", newCodes.join(""));
          refs[index - 1]?.current?.focus();
        }
      }
    }
  };
  
  const onChangeCode = (text, index) => {
    const numericText = text.replace(/[^0-9]/g, "");
    const newCodes = [...codes];
    newCodes[index] = numericText;
    setCodes(newCodes);
    setFieldValue("otp", newCodes.join(""));

    if (apiErr) setApiErr("");
  
    if (numericText && index < refs.length - 1) {
      refs[index + 1]?.current?.focus();
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
          <View className="px-6">
            <Text className="text-[28px] py-2" style={{ fontFamily: "Lato" }}>
              {" "}
              {applanguage === "eng"
                ? Translations.eng.otp_verification
                : Translations.arb.otp_verification}
            </Text>

            <View className="py-4">
              <Text className="text-[#164F90] font-bold text-[20px] mb-1"  style={{ fontFamily: "Lato" }}>
                {applanguage === "eng"
                  ? Translations.eng.enter_otp
                  : Translations.arb.enter_otp}
              </Text>
              <Text className="font-light"  style={{ fontFamily: "Lato" }}>
                {applanguage === "eng"
                  ? Translations.eng.otp_sent_message
                  : Translations.arb.otp_sent_message}{" "}
              </Text>
            </View>

            {resentOtpMsg && (
              <Text className="text-green-500 text-sm mb-2"  style={{ fontFamily: "Lato" }}>
                {applanguage === "eng"
                  ? Translations.eng.otp_resent_message
                  : Translations.arb.otp_resent_message}
              </Text>
            )}

            {/* OTP Input */}
            <View className="w-[90%] mx-auto flex items-center justify-center ">
            <OTPinput   
              
                codes={codes}
                refs={refs}
                errorMessages={errorMessages}
                onChangeCode={onChangeCode}
                onKeyPress={handleKeyPress}
              />

              {/*  Show Formik error */}
              {errors.otp && touched.otp && (
                <Text className="text-center mt-4 text-red-500 text-sm" style={{ fontFamily: "Lato" }}>
                  {errors.otp}
                </Text>
              )}

              {apiErr && (
                <Text className="text-center mt-4 text-red-500 text-sm" style={{ fontFamily: "Lato" }}>
                  {apiErr}
                </Text>
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
              onPress={handleSubmit} //  Use handleSubmit instead of router.push
              className="bg-[#FFB648] rounded-lg w-[90%] h-14 mx-auto mt-4 flex items-center justify-center mt-40"
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

            <View className="mt-6 items-center">
  {isTimerRunning ? (
    <Text className="text-[#164F90] text-base" style={{ fontFamily: "CenturyGothic" }}>
      {applanguage === "eng"
        ? `0.${timer} sec`
        : `0.${timer} ثانية `}
    </Text>
  ) : (
    <TouchableOpacity onPress={()=>{resendOtpHandler(restoken || token);
                                      handleResend()}}>
      <Text className="text-[#164F90] font-semibold text-base underline"  style={{ fontFamily: "CenturyGothic" }}>
        {applanguage === "eng"
          ? Translations.eng.resend_otp
          : Translations.arb.resend_otp}
      </Text>
    </TouchableOpacity>
  )}
</View>


          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default verifyotp;


  // const resendOtpHandler = async (restoken) => {
  //   if (!restoken) {
  //     Toast.show({
  //       type: "error",
  //       text1: "Token is missing. Please try again.",
  //     });
  //     return;
  //   }
  
  //   const token = await AsyncStorage.getItem("authToken");
  //   console.log("resend method",token)
  //   if (!token) {
  //     Toast.show({
  //       type: "error",
  //       text1: "No token found. Please log in.",
  //     });
  //     return;
  //   }

  //   try {
  //     const res = await RESEND_OTP(token); // Pass token to API caller
  //     console.log(res);
  //     const message = res?.data?.message?.trim();

  //   Toast.show({
  //     type: "success",
  //     text1: message && message.length > 0 ? message : "OTP Resent",
  //     duration: 2000,
  //   });
  //     setResentOtpMsg(true);
  //   } catch (error) {
  //     console.log("Error sending code:", error?.response);
  //     setApiErr(error?.response?.data?.message || "Failed to resend OTP");
  //   }
  // };

