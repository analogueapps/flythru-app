import {
  View,
  Text,
  Pressable,
  Animated,
  TextInput,
  Platform,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SvgGoogle from "../../assets/svgs/GoogleIcon";
import SvgApple from "../../assets/svgs/AppleIcon";
import images from "../../constants/images";
import { router, useFocusEffect } from "expo-router";
import { useFormik } from "formik";
import { LOGIN_API, SIGN_UP_API } from "../../network/apiCallers";
import loginSchema from "../../yupschema/loginSchema";
import { useToast } from "react-native-toast-notifications";
import { useAuth } from "../../UseContext/AuthContext";
import { langaugeContext } from "../../customhooks/languageContext";
import Translations from "../../language";
import signupSchema from "../../yupschema/signupSchema";
import { Eye, EyeOff } from "lucide-react-native"; // Optional, or use FontAwesome if preferred
import { GoogleSignin } from "@react-native-google-signin/google-signin";
// import GoogleAuth from "../../googleAuth";
import auth, {
  firebase,
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "@react-native-firebase/auth";
import { useNotification } from "../../UseContext/notifications";
import { getApp } from "@react-native-firebase/app";
import { registerForPushNotificationsAsync } from "../../utlis/registrationsPushNotifications";

const Index = () => {
  const [activeTab, setActiveTab] = useState("signup");
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const widthAnim = useRef(new Animated.Value(0)).current;
  const toast = useToast();
  const { setUserEmail, SaveMail } = useAuth();
  const { applanguage } = langaugeContext();
  const [showPassword, setShowPassword] = useState(false);
  // const { expoPushToken } = useNotification();
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "1027382214254-igq7ghhgc2o3o2hs8085npci8ruka5fd.apps.googleusercontent.com",
    });
  }, []);


 

  const signInWithGoogle = async () => {
    try {
      // Ensure Google Play Services is available
      await GoogleSignin.hasPlayServices();

      // Sign in to Google
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);

      // Check if ID Token is present
      // if (!userInfo.data.idToken) {  // Changed from userInfo.data.idToken
      //   throw new Error('Google ID token is missing');
      // }

      // Get the Firebase Auth instance
      const app = getApp();
      const auth = getAuth(app);

      // Create a Google credential with the ID token
      const googleCredential = GoogleAuthProvider.credential(
        userInfo.data.idToken
      );
      // Sign in with Firebase using the Google credential
      const userCredential = await signInWithCredential(auth, googleCredential);
      console.log("Firebase User:", userCredential.user);

      // Handle successful sign-in
      const user = userCredential.user;
      console.log("Signed in as:", user.email);

      // Optionally save user email or perform further actions
      // setUserEmail(user.email);

      // Redirect to the home screen
      router.push("/home");
    } catch (error) {
      // console.error("Google Sign-In Error:", error);
      toast.show("Please select a login method" );
    }
  };

  const animateTab = (tab) => {
    const toValue = tab === "login" ? 0 : 1;
    setActiveTab(tab);

    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue,
        useNativeDriver: true,
        friction: 8,
      }),
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 550,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 550,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(widthAnim, {
        toValue,
        useNativeDriver: false,
        friction: 8,
      }),
    ]).start();
  };

  // signup handler

  const formik = useFormik({
    initialValues: {
      email: "kuldeepgautam52776@gmail.com",
      password: "Password@123",
    },
    validationSchema: signupSchema(applanguage),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      const modifiedValues = {
        ...values,
        email: values.email.toLowerCase()
      };
      await SignupHandler(modifiedValues);
    },
  });

  const SignupHandler = async (values) => {
    try {
      const res = await SIGN_UP_API(values);

      console.log("verification code sent", res.data.message);
      toast.show(res.data.message);
      router.push({
        pathname: "/verifyotp",
        params: { token: res.data.token },
      });

      console.log("message response //////", res);
    } catch (error) {
      console.log("Error signing up:", error?.response);
      toast.show(error?.response?.data?.message);
    }
  };

  // login handler

  const loginFormik = useFormik({
    initialValues: {
      // email: "",
      // password: "",

      email: "naveendaraboina88@gmail.com",
      password: "Lahari@123.",
    },
    validationSchema: loginSchema(applanguage),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      const modifiedValues = {
        ...values,
        email: values.email.toLowerCase(),
      };
      console.log("login values", modifiedValues);
      await LoginHandler(modifiedValues);
      await SaveMail(modifiedValues.email);
    },
  });

  const LoginHandler = async (values) => {
    try {
      const res = await LOGIN_API(values);
      console.log("Login successful", res.data);
      router.push("/home");
      toast.show(res.data.message);
    } catch (error) {
      console.log("Error logging in:", error);

      if (error.response) {
        if (
          error.response.status === 400 &&
          error?.response?.data?.isAuthenticated === false
        ) {
          toast.show(error?.response?.data?.message);
          router.push("/verifyotp");
        } else {
          console.log("error loginnnnnggggg", error?.response);
          toast.show(error?.response?.data?.message);
        }
      }
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1">
        <View className="flex-1 items-center">
          {/* <Text className="text-4xl font-black text-black py-4">LOGO</Text> */}
          <Image
            source={images.mainLogo}
            className="w-[125px] h-auto"
            resizeMode="contain"
          />

          {/* Tab Headers */}
          <View className="flex-row mx-8 relative rounded-full my-4 bg-blue-400">
            <Animated.View
              style={{
                flex: widthAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1.2, 0.8],
                }),
              }}
            >
              <Pressable
                onPress={() => animateTab("login")}
                style={{
                  backgroundColor:
                    activeTab === "login" ? "#164E8D" : "#E3F8F9",
                }}
                className="items-center py-3 rounded-l-full"
              >
                <Text
                  className={`text-lg font-semibold ${
                    activeTab === "login" ? "text-white " : "text-[#164E8D]"
                  }`}
                >
                  {applanguage === "eng"
                    ? Translations.eng.log_in
                    : Translations.arb.log_in}
                </Text>
              </Pressable>
            </Animated.View>
            <View className="w-2 bg-white" />
            <Animated.View
              style={{
                flex: widthAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1.2],
                }),
              }}
            >
              <Pressable
                onPress={() => animateTab("signup")}
                style={{
                  backgroundColor:
                    activeTab === "signup" ? "#164E8D" : "#E3F8F9",
                }}
                className="items-center py-3 rounded-r-full"
              >
                <Text
                  className={`text-lg font-semibold ${
                    activeTab === "signup" ? "text-white" : "text-[#164E8D]"
                  }`}
                >
                  {applanguage === "eng"
                    ? Translations.eng.sign_in
                    : Translations.arb.sign_in}
                </Text>
              </Pressable>
            </Animated.View>
          </View>

          {/* Form Container */}
          <Animated.View
            className="w-full px-4 pt-4"
            style={{ opacity: fadeAnim }}
          >
            {activeTab === "login" ? (
              <View className="">
                {/* Add your login form components here */}
                <Text
                  className="py-4 text-[18px] font-normal text-center"
                  style={{ fontFamily: "CenturyGothic" }}
                >
                  {applanguage === "eng"
                    ? Translations.eng.login_to_your_account
                    : Translations.arb.login_to_your_account}
                </Text>

                <TextInput
                  onChangeText={loginFormik.handleChange("email")}
                  onBlur={loginFormik.handleBlur("email")}
                  value={loginFormik.values.email}
                  className={`bg-[#f2f2f2] border h-14 px-2 my-4 py-2 rounded-lg border-[#8B8B8B] w-[90%] mx-auto`}
                  placeholder={
                    applanguage === "eng"
                      ? Translations.eng.email_placeholder
                      : Translations.arb.email_placeholder
                  }
                />

                {loginFormik.touched.email && loginFormik.errors.email && (
                  <Text className="text-red-500 w-[90%] mx-auto">
                    {loginFormik.errors.email}
                  </Text>
                )}

                <View className="flex-row items-center bg-[#f2f2f2] border border-[#8B8B8B] h-14 px-2 my-4 rounded-lg w-[90%] mx-auto">
                  <TextInput
                    secureTextEntry={!showPassword}
                    onChangeText={loginFormik.handleChange("password")}
                    onBlur={loginFormik.handleBlur("password")}
                    value={loginFormik.values.password}
                    placeholder={
                      applanguage === "eng"
                        ? Translations.eng.password_placeholder
                        : Translations.arb.password_placeholder
                    }
                    className="flex-1 text-base"
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

                {loginFormik.touched.password &&
                  loginFormik.errors.password && (
                    <Text className="text-red-500 w-[90%] mx-auto">
                      {loginFormik.errors.password}
                    </Text>
                  )}

                <TouchableOpacity
                  onPress={loginFormik.handleSubmit}
                  className="bg-[#FFB648] rounded-lg py-4 w-[90%] mx-auto mt-4"
                >
                  <Text className="text-center  text-[#08203C] font-semibold text-lg">
                    {applanguage === "eng"
                      ? Translations.eng.log_in
                      : Translations.arb.log_in}
                  </Text>
                </TouchableOpacity>
                <View className="flex flex-row items-center justify-evenly mt-12 px-3">
                  <View className="flex-1 h-[1px] bg-black" />
                  <Text className="mx-2">
                    {applanguage === "eng"
                      ? Translations.eng.or
                      : Translations.arb.or}
                  </Text>
                  <View className="flex-1 h-[1px] bg-black" />
                </View>
                <View className="flex flex-row items-center justify-center gap-x-8 py-10">
                  <TouchableOpacity onPress={() => signInWithGoogle()}>
                    <SvgGoogle />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <SvgApple />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  className="self-center"
                  onPress={() => router.push("/home")}
                >
                  <Text className="text-[#0F7BE6] text-lg">
                    {applanguage === "eng"
                      ? Translations.eng.skip_and_continue_as_guest
                      : Translations.arb.skip_and_continue_as_guest}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="">
                {/* Add your login form components here */}
                <Text
                  className="py-4 text-[18px] font-normal text-center"
                  style={{ fontFamily: "CenturyGothic" }}
                >
                  {applanguage === "eng"
                    ? Translations.eng.sign_up_to_register
                    : Translations.arb.sign_up_to_register}
                </Text>

                <TextInput
                  onChangeText={formik.handleChange("email")}
                  onBlur={formik.handleBlur("email")}
                  value={formik.values.email}
                  className={`bg-[#f2f2f2] border h-14 px-2  my-4 py-2 rounded-lg border-[#8B8B8B] w-[90%] mx-auto`}
                  placeholder={
                    applanguage === "eng"
                      ? Translations.eng.email_placeholder
                      : Translations.arb.email_placeholder
                  }
                />
                {formik.touched.email && formik.errors.email && (
                  <Text className="text-red-500 w-[90%] mx-auto">
                    {formik.errors.email}
                  </Text>
                )}
                {/* <TextInput
                  className={`bg-[#f2f2f2] border h-14 px-2 my-4 py-2 rounded-lg border-[#8B8B8B] w-full`}
                  placeholder="Enter Phone Number"
                /> */}

                <View className="flex-row items-center bg-[#f2f2f2] border border-[#8B8B8B] h-14 px-2 my-4 rounded-lg w-[90%] mx-auto">
                  <TextInput
                    secureTextEntry={!showPassword}
                    onChangeText={formik.handleChange("password")}
                    onBlur={formik.handleBlur("password")}
                    value={formik.values.password}
                    placeholder={
                      applanguage === "eng"
                        ? Translations.eng.password_placeholder
                        : Translations.arb.password_placeholder
                    }
                    className="flex-1 text-base"
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
                  <Text className="text-red-500 w-[90%] mx-auto">
                    {formik.errors.password}
                  </Text>
                )}

                <TouchableOpacity
                  onPress={formik.handleSubmit}
                  className="bg-[#FFB648] rounded-lg py-4 w-[90%] mx-auto mt-4"
                >
                  <Text className="text-center text-[#08203C] font-semibold text-lg">
                    {applanguage === "eng"
                      ? Translations.eng.sign_up
                      : Translations.arb.sign_up}
                  </Text>
                </TouchableOpacity>
                <View className="flex flex-row items-center justify-evenly mt-12 px-3">
                  <View className="flex-1 h-[1px] bg-black" />
                  <Text className="mx-2">
                    {applanguage === "eng"
                      ? Translations.eng.or
                      : Translations.arb.or}
                  </Text>
                  <View className="flex-1 h-[1px] bg-black" />
                </View>
                <View className="flex flex-row items-center justify-center gap-x-8 py-10">
                  <TouchableOpacity onPress={() => signInWithGoogle()}>
                    {/* <GoogleAuth/> */}
                    <SvgGoogle />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <SvgApple />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  className="self-center"
                  onPress={() => router.push("/home")}
                >
                  <Text className="text-[#0F7BE6] text-lg">
                    {applanguage === "eng"
                      ? Translations.eng.skip_and_continue_as_guest
                      : Translations.arb.log_in}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
