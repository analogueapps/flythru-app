import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
  BackHandler,
  Platform,
  TextInput,
} from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Eye, EyeOff } from "lucide-react-native";
import OTPinput from "../../components/OTPinput";
import { router, useFocusEffect } from "expo-router";
import { useFormik } from "formik";
import flightloader from "../../assets/images/flightload.gif";
import logo from "../../assets/images/mainLogo.png";
import { RESEND_OTP, RESET_PASSWORD, VERIFY_OTP } from "../../network/apiCallers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { langaugeContext } from "../../customhooks/languageContext";
import Translations from "../../language";
import { otpValidationSchema } from "../../yupschema/otpSchema";
import { useLocalSearchParams } from "expo-router";
import { registerForPushNotificationsAsync } from "../../utlis/registrationsPushNotifications";
import Toast from "react-native-toast-message";
import forgotpasschangeSchema from "../../yupschema/forgotpasschange";

const forgotpasschange = () => {
  const [codes, setCodes] = useState(Array(4).fill(""));
  const [errorMessages, setErrorMessages] = useState();
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [apiErr, setApiErr] = useState("");
  const [resentOtpMsg, setResentOtpMsg] = useState(false);
  const { applanguage } = langaugeContext();
  const [loading, setLoading] = useState(false);
  const { token } = useLocalSearchParams();
  const [email, setEmail] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updatedParams = useLocalSearchParams();
  // console.log("Received Token:", restoken);
  const [fcm, setFcm] = useState("");

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
      email: updatedParams.email || "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: forgotpasschangeSchema(applanguage),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      console.log("Submitting OTP with values:", values);
    
      await forgotPasschangeHandler(values);
    },
  }); 
 
  const { values, handleSubmit, setFieldValue, errors, touched } = formik;

  const forgotPasschangeHandler = async (values) => {
    setLoading(true);
    console.log("Forgot Password Email Handler called with values:", values);

    try {
      const res = await RESET_PASSWORD(values);
      console.log(res.data.message);
      Toast.show({
        type: "success",
        text1: res.data.message,
      });
        router.push("/(auth)");
    } catch (error) {
      console.log("Error updating password:", error?.response?.data);
      Toast.show({
        type: "info",
        text1: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-6 pb-0">
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
                ? Translations.eng.create_password
                : Translations.arb.create_password}
            </Text>

           

            {resentOtpMsg && (
              <Text
                className="text-green-500 text-sm mb-2"
                style={{ fontFamily: "Lato" }}
              >
                {applanguage === "eng"
                  ? Translations.eng.otp_resent_message
                  : Translations.arb.otp_resent_message}
              </Text>
            )}

            <View className="flex-col justify-between items-center ">
              <Text className="text-[#8B8B8B] text-[14px] mb-1 self-start">
                {applanguage === "eng"
                  ? Translations.eng.new_password
                  : Translations.arb.new_password}
                <Text className="text-red-700">*</Text>
              </Text>
                <View className="flex-row items-center  border border-[#8B8B8B] h-14 px-2 my-4 rounded-lg w-[100%] mx-auto">
              
              <TextInput
                // value={email}
                // onChangeText={setEmail}
                onChangeText={formik.handleChange("password")}
                onBlur={formik.handleBlur("password")}
                value={formik.values.password}
                className="  h-14 px-2 my-4 py-2 rounded-lg  w-[90%] mx-auto"
                autoCapitalize="none"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={22} color="#8B8B8B" />
                    ) : (
                      <Eye size={22} color="#8B8B8B" />
                    )}
                  </TouchableOpacity>
              </View>
              {formik.touched.password && formik.errors.password && (
                <Text
                  className="text-red-500 self-start"
                  style={{ fontFamily: "Lato" }}
                >
                  {formik.errors.password}
                </Text>
              )}
            </View>

            <View className="flex-col justify-between items-center mb-4">
              <Text className="text-[#8B8B8B] text-[14px] mb-1 self-start">
                {applanguage === "eng" 
                  ? Translations.eng.confirm_new_password
                  : Translations.arb.confirm_new_password}
                <Text className="text-red-700">*</Text>
              </Text>

                <View className="flex-row items-center  border border-[#8B8B8B] h-14 px-2 my-4 rounded-lg w-[100%] mx-auto">

              <TextInput
                // value={email}
                // onChangeText={setEmail}
                onChangeText={formik.handleChange("confirmPassword")}
                onBlur={formik.handleBlur("confirmPassword")}
                value={formik.values.confirmPassword}
                className="  h-14 px-2 my-4 py-2 rounded-lg  w-[90%] mx-auto"
                autoCapitalize="none"
secureTextEntry={!showConfirmPassword}
              />
             <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
  {showConfirmPassword ? (
    <EyeOff size={22} color="#8B8B8B" />
  ) : (
    <Eye size={22} color="#8B8B8B" />
  )}
</TouchableOpacity>
              </View>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <Text
                  className="text-red-500 self-start"
                  style={{ fontFamily: "Lato" }}
                >
                  {formik.errors.confirmPassword}
                </Text>
              )}
            </View>

            <TouchableOpacity
              disabled={loading}
              style={{
                elevation: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
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
                <Text
                  className="text-center text-[#08203C] font-bold text-lg"
                  style={{ fontFamily: "Lato" }}
                >
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

export default forgotpasschange;
