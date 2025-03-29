import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useContext, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import OTPinput from "../../components/OTPinput";
import { router } from "expo-router";
import { useFormik } from "formik";
import { RESEND_OTP, VERIFY_OTP } from "../../network/apiCallers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "react-native-toast-notifications";
import { langaugeContext, } from "../../customhooks/languageContext";
import Translations from "../../language";
import { otpValidationSchema } from "../../yupschema/otpSchema";


const verifyotp = () => {
  const [codes, setCodes] = useState(Array(4).fill(""));
  const [errorMessages, setErrorMessages] = useState();
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [apiErr, setApiErr] = useState("");
  const [resentOtpMsg, setResentOtpMsg] = useState(false);
  const toast = useToast()
  const { applanguage } = langaugeContext()


  const formik = useFormik({
    initialValues: {
      otp: "", 
    },
    validationSchema: otpValidationSchema(applanguage),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      await verifyOtpHandler(values);
    },
  });

  const { values, handleSubmit, setFieldValue, errors, touched } = formik;

  const onChangeCode = (text, index) => {
    setApiErr(""); 
    const numericText = text.replace(/[^0-9]/g, "");

    const newCodes = [...codes];
    newCodes[index] = numericText;
    setCodes(newCodes);

    setFieldValue("otp", newCodes.join(""));

    // Move to next input
    if (numericText && index < refs.length - 1) {
      refs[index + 1].current.focus();
    }
  };

  const verifyOtpHandler = async (values) => {

    const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          toast.show("No token found. Please log in.");
          return;
        }

    try {
      const res = await VERIFY_OTP(values , token); 
      console.log(res.data.message);
      toast.show(res.data.message)
      router.push("/home");
    } catch (error) {
      console.log("Error sending code:", error?.response);
      setApiErr(error?.response?.data?.message || "Invalid OTP");
    }
  };

  const resendOtpHandler = async () => {
    const token = await AsyncStorage.getItem("authToken");
  
    if (!token) {
      toast.show("No token found. Please log in.");
      return;
    }
  
    try {
      const res = await RESEND_OTP(token); 
      console.log(res);
      toast.show(res.data.message);
      setResentOtpMsg(true); 
    } catch (error) {
      console.log("Error sending code:", error?.response);
      setApiErr(error?.response?.data?.message || "Failed to resend OTP");
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
            <Text className="text-[28px] py-2"> {
                applanguage==="eng"?Translations.eng.otp_verification:Translations.arb.otp_verification
              }</Text>

            <View className="py-4">
              <Text className="text-[#164F90] font-bold text-[20px] mb-1">
              {
                applanguage==="eng"?Translations.eng.enter_otp:Translations.arb.enter_otp
              }
              </Text>
              <Text className="font-light">
              {
                applanguage==="eng"?Translations.eng.otp_sent_message:Translations.arb.otp_sent_message
              }              </Text>
            </View>

            {resentOtpMsg && (
              <Text className="text-green-500 text-sm mb-2">
               {
                applanguage==="eng"?Translations.eng.otp_resent_message:Translations.arb.otp_resent_message
              }
              </Text>
            )}

            {/* OTP Input */}
            <View className="self-start w-full">
              <OTPinput
                codes={codes}
                refs={refs}
                errorMessages={errorMessages}
                onChangeCode={onChangeCode} 
              />

              {/*  Show Formik error */}
              {errors.otp && touched.otp && (
                <Text className="text-center mt-4 text-red-500 text-sm">
                  {errors.otp}
                </Text>
              )}

              {apiErr && (
                <Text className="text-center mt-4 text-red-500 text-sm">
                  {apiErr}
                </Text>
              )}
            </View>

            {/* Resend OTP */}
            <TouchableOpacity className="self-end mt-4"
            onPress={()=>resendOtpHandler()}>
              <Text className="text-[#575757] text-[12px] relative right-14">
              {
                applanguage==="eng"?Translations.eng.resend_otp:Translations.arb.resend_otp
              }
              </Text>
            </TouchableOpacity>

            {/*  Trigger Formik submission */}
            <TouchableOpacity
              onPress={handleSubmit} //  Use handleSubmit instead of router.push
              className="bg-[#FFB648] rounded-lg py-4 mt-[35%]"
            >
              <Text className="text-center text-[#08203C] font-semibold text-lg">
              {
                applanguage==="eng"?Translations.eng.submit:Translations.arb.submit
              }
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default verifyotp;
