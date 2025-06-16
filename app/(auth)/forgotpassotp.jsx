import { View, Text, ScrollView, TouchableOpacity, Animated,Easing, Image, BackHandler, Platform ,TextInput } from "react-native";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import OTPinput from "../../components/OTPinput";
import { router, useFocusEffect } from "expo-router";
import { useFormik } from "formik";
import flightloader from "../../assets/images/flightload.gif";
import logo from '../../assets/images/mainLogo.png';
import { FORGOT_PASSWORD_OTP, RESEND_OTP, VERIFY_OTP } from "../../network/apiCallers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { langaugeContext } from "../../customhooks/languageContext";
import Translations from "../../language";
import { otpValidationSchema } from "../../yupschema/otpSchema";
import { useLocalSearchParams } from "expo-router";
import { registerForPushNotificationsAsync } from "../../utlis/registrationsPushNotifications";
import Toast from "react-native-toast-message";

const forgotpassotp = () => {
  const [codes, setCodes] = useState(Array(4).fill(""));
  const [errorMessages, setErrorMessages] = useState();
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [apiErr, setApiErr] = useState("");
  const [resentOtpMsg, setResentOtpMsg] = useState(false);
  const { applanguage } = langaugeContext();
const [loading, setLoading] = useState(false);
const { token } = useLocalSearchParams();
const [email, setEmail] = useState("");

  const updatedParams = useLocalSearchParams();
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

  const formik = useFormik({
      initialValues: {
        email: updatedParams.email || "",
        otp: "",
      },
      validationSchema: otpValidationSchema(applanguage),
      validateOnChange: true,
      validateOnBlur: true,
      onSubmit: async (values) => {
        console.log("Submitting OTP with values:", values);

        await forgotPassotpHandler(values);
      
      },
    });
  
    const { values, handleSubmit, setFieldValue, errors, touched } = formik;
   
    const forgotPassotpHandler = async (values) => {
        setLoading(true);
        console.log("Forgot Password Email Handler called with values:", values);
    
        try {
          const res = await FORGOT_PASSWORD_OTP(values);
          console.log(res.data.message);
          Toast.show({
            type: "success",
            text1: res.data.message,
          });
           router.push({
      pathname: "/forgotpasschange",
      params: updatedParams,
    });
          
        
        } catch (error) {
          console.log("Error otpppp:", error?.response);
          Toast.show({
            type: "error",
            text1: error.response?.data?.message
          });
        } finally {
          setLoading(false);
        }
      };
  

         const forgotPassResendotpHandler = async (values) => {
        setLoading(true);
        console.log("Forgot Password Email Handler called with values:", values);
    
        try {
          const res = await FORGOT_PASSWORD_OTP(values);
          console.log(res.data.message);
          Toast.show({
            type: "success",
            text1: res.data.message,
          });
           router.push({
      pathname: "/forgotpasschange",
      params: updatedParams,
    });
          
        
        } catch (error) {
          console.log("Error otpppp:", error?.response);
          Toast.show({
            type: "error",
            text1: error.response?.data?.message
          });
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

            {resentOtpMsg && (
              <Text className="text-green-500 text-sm mb-2"  style={{ fontFamily: "Lato" }}>
                {applanguage === "eng"
                  ? Translations.eng.otp_resent_message
                  : Translations.arb.otp_resent_message}
              </Text>
            )}

            

          
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
              className="bg-[#FFB648] rounded-lg w-[90%] h-14 mx-auto flex items-center justify-center mt-40"
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
    <TouchableOpacity onPress={()=>{resendOtpHandler();
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

export default forgotpassotp;


 