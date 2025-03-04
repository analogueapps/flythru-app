import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import OTPinput from "../../components/OTPinput";
import { router } from "expo-router";

const verifyotp = () => {
  const [codes, setCodes] = useState(Array(4).fill(""));
  const [errorMessages, setErrorMessages] = useState();
  const refs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const [apiErr, setApiErr] = useState("");
  const [resentOtpMsg, setResentOtpMsg] = useState(false);

  //   const onChangeCode = (text, index) => {
  //     // Sanitize input to allow only numbers
  //     setApiErr("");
  //     const numericText = text.replace(/[^0-9]/g, "");

  //     if (numericText.length > 1) {
  //       setErrorMessages(undefined);

  //       // Create a new codes array with all the numericText characters
  //       const newCodes = numericText.split(""); // Split text into individual digits
  //       setCodes(newCodes); // Set the new codes array
  //       if (refs[5] && refs[5].current) {
  //         refs[5].current.focus();
  //       }
  //       return;
  //     }
  //     setErrorMessages(undefined);
  //     const newCodes = [...(codes || [])]; // Ensure codes is not undefined
  //     newCodes[index] = numericText; // Update the specific index with numericText
  //     setCodes(newCodes);

  //     // After updating, focus the next input if necessary
  //     if (
  //       numericText !== "" &&
  //       index < 5 &&
  //       refs[index + 1] &&
  //       refs[index + 1].current
  //     ) {
  //       refs[index + 1].current.focus();
  //     }
  //     setFieldValue("otp", newCodes.join(""));
  //   };

  //! on change pending in verify otp and otp input custom component
  //! handle error messages form api and uncomment err from formik yup
  return (
    <SafeAreaView className="flex-1 bg-white p-6">
      <View className="flex-1">
        <TouchableOpacity className="py-6">
          <ChevronLeft color="black" />
        </TouchableOpacity>
        <ScrollView className="flex-1">
          <View className="px-6">
            <Text className="text-[28px]  py-2">OTP Verification</Text>
            <View className="py-4">
              <Text className="text-[#164F90] font-bold text-[20px] mb-1">
                Enter OTP
              </Text>
              <Text className="font-light">
                An 4 digit code has been sent to your email
              </Text>
            </View>
            {resentOtpMsg && (
              <Text className="text-green-500 text-sm mb-2">
                OTP has been sent to your email!
              </Text>
            )}
            <View className="self-start w-full">
              <OTPinput
                codes={codes}
                refs={refs}
                errorMessages={errorMessages}
              />
              {/* {errors.otp && touched.otp && (
                    <Text
                    className={`${
                        Platform.OS === "ios"
                        ? "font-sfregular"
                        : "font-rbtoregular"
                    } text-center mt-4 text-red-500 text-sm`}
                    >
                    {errors.otp}
                    </Text>
                )} */}
              {apiErr && (
                <Text
                  className={`
                    }text-center mt-4 text-red-500 text-sm`}
                >
                  {apiErr}
                </Text>
              )}
            </View>
            <TouchableOpacity className="self-end mt-4 ">
              <Text className="text-[#575757] text-[12px] relative right-14">
                Resend OTP
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/home")}
              className="bg-[#FFB648]  rounded-lg py-4  mt-[35%]"
            >
              <Text className="text-center text-[#08203C] font-semibold text-lg">
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default verifyotp;
