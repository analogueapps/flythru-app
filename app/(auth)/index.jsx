import {
  View,
  Text,
  Pressable,
  Animated,
  Easing,
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
import {
  LOGIN_API,
  OAUTH,
  RESEND_OTP,
  SIGN_UP_API,
} from "../../network/apiCallers";
import loginSchema from "../../yupschema/loginSchema";
import { useAuth } from "../../UseContext/AuthContext";
import { langaugeContext } from "../../customhooks/languageContext";
import Translations from "../../language";
import flightloader from "../../assets/images/flightload.gif";
import signupSchema from "../../yupschema/signupSchema";
import { AlertTriangle, X, Eye, EyeOff } from "lucide-react-native"; // Optional, or use FontAwesome if preferred
import { GoogleSignin } from "@react-native-google-signin/google-signin";
// import GoogleAuth from "../../googleAuth";
import Toast from "react-native-toast-message";

// import auth, {
//   firebase,
//   getAuth,
//   GoogleAuthProvider,
//   signInWithCredential,
// } from "@react-native-firebase/auth";
import { useNotification } from "../../UseContext/notifications";

import { registerForPushNotificationsAsync } from "../../utlis/registrationsPushNotifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut } from "@react-native-firebase/auth";
import { StatusBar } from "expo-status-bar";
import {auth} from "../../firebaseConfig"
const Index = () => {
  const [activeTab, setActiveTab] = useState("login");
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const widthAnim = useRef(new Animated.Value(1)).current;
  const [fcm, setFcm] = useState("");
  const [authPopupVisible, setAuthPopupVisible] = useState(false);
  const [authPopupMessage, setAuthPopupMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [verifytoken, setVerifytoken] = useState("");

  const { setUserEmail, SaveMail } = useAuth();
  const { applanguage } = langaugeContext();
  const [showPassword, setShowPassword] = useState(false);
  // const { expoPushToken } = useNotification();

  const translateX = useRef(new Animated.Value(0)).current;

  //google configuration 
  GoogleSignin.configure({
    webClientId:
      "1027382214254-igq7ghhgc2o3o2hs8085npci8ruka5fd.apps.googleusercontent.com",

    scopes: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/userinfo.profile"
    ]

  });

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



  // const signInWithGoogle = async () => {
  //   try {
  //     // Ensure Google Play Services is available
  //     await GoogleSignin.hasPlayServices();

  //     // Sign in to Google
  //     const userInfo = await GoogleSignin.signIn();
  //     console.log(userInfo);

  //     // Check if ID Token is present
  //     // if (!userInfo.data.idToken) {  // Changed from userInfo.data.idToken
  //     //   throw new Error('Google ID token is missing');
  //     // }

  //     // Get the Firebase Auth instance
  //     const app = getApp();
  //     const auth = getAuth(app);

  //     // Create a Google credential with the ID token
  //     const googleCredential = GoogleAuthProvider.credential(
  //       userInfo.data.idToken

  //     );
  //     console.log("user id token", userInfo.data.idToken);
  //     // Sign in with Firebase using the Google credential
  //     const userCredential = await signInWithCredential(auth, googleCredential);

  //     console.log("Firebase User:", userCredential.user);

  //     const firebaseUser = userCredential.user;
  //     const firebaseIdToken = await firebaseUser.getIdToken();
  //     console.log("Firebase ID Token:", firebaseIdToken);

  //     // await oauthHandler({ oAuthToken: firebaseIdToken });
  //     await oauthHandler(firebaseIdToken);

  //     router.push("/home");
  //     // Handle successful sign-in
  //     const user = userCredential.user;
  //     console.log("Signed in as:", user.email);

  //     // Optionally save user email or perform further actions
  //     // setUserEmail(user.email);
  //     await SaveMail(user.email);
  //     await checkLoginStatus(); // 👈 Add this

  //     // Redirect to the home screen
  //     router.push("/home");
  //   } catch (error) {
  //     // console.error("Google Sign-In Error:", error);
  //     Toast.show({
  //       type: "info",
  //       text1: "Google Sign-In failed",
  //       // text1: error.message || "Unknown error"

  //     });
  //     console.log("Google Sign-In Error:", error);
  //   }
  // };



  async function onGoogleButtonPress() {
    try {


      console.log("Preessed button");
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Get the users ID token

      console.log("Step 1");
      const signInResult = await GoogleSignin.signIn();

      console.log("step2");
      console.log("signInResult", signInResult);

      if (signInResult.type === 'cancelled' || !signInResult.data) {
        console.warn("User cancelled Google Sign-In.");
        Toast.show({
          type: "info",
          text1: "User cancelled Google Sign-In."
        })
        return;
      }
      // Try the new style of google-sign in result, from v13+ of that module

      let idToken = signInResult.idToken || signInResult.data?.idToken;




      if (!idToken) {
        throw new Error("No ID token found");
      }

      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(
        signInResult.data?.idToken || signInResult.idToken
      );

      console.log("GoogleCredentail", googleCredential);
      

      // Sign-in the user with the credential
      const userCredential = await signInWithCredential(auth, googleCredential);
      console.log(userCredential)
      console.log("token sending to backend",googleCredential?.token)

      const firebaseUser = userCredential.user;
      const firebaseIdToken = await firebaseUser.getIdToken();

      console.log("Firebase Token",firebaseIdToken)

      await oauthHandler(firebaseIdToken)
      await SaveMail(userCredential?.user.email);
      await checkLoginStatus(); // 👈 Add this
      

    } catch (error) {
      console.error("Sign-in error:", error.message);
      Toast.show({
        type: "info",
        text1: "Google Sign-In failed",
        // text1: error.message || "Unknown error"

      });
    }
  }



  useEffect(() => {
    if (activeTab === "login") {
      loginFormik.resetForm();
    } else {
      formik.resetForm();
    }
  }, [activeTab]);

  // tab animation

  const animateTab = (tab) => {
    const toValue = tab === "login" ? 0 : 1;
    setActiveTab(tab);

    // Animated.parallel([
    //   Animated.spring(slideAnim, {
    //     toValue,
    //     useNativeDriver: true,
    //     friction: 8,
    //   }),
    //   Animated.sequence([
    //     Animated.timing(fadeAnim, {
    //       toValue: 0,
    //       duration: 550,
    //       useNativeDriver: true,
    //     }),
    //     Animated.timing(fadeAnim, {
    //       toValue: 1,
    //       duration: 550,
    //       useNativeDriver: true,
    //     }),
    //   ]),
    //   Animated.spring(widthAnim, {
    //     toValue,
    //     useNativeDriver: false,
    //     friction: 8,
    //   }),
    // ]).start();

    setTimeout(() => {
      setActiveTab(tab);
    }, 300);
  };


  useFocusEffect(
    useCallback(() => {
      getToken();
    }, [])
  );
  const getToken = async () => {
    try {
      const fcmToken = await registerForPushNotificationsAsync();
      console.log("fcm", fcmToken);
      setFcm(fcmToken);
    } catch (error) {
      console.error("Push notification error:", error);
    }
  };

  // signup handler

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",


      //  email: "tarunaaatej.2002@gmail.com",
      //       password: "Tarun@12",

    },
    validationSchema: signupSchema(applanguage),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      const modifiedValues = {
        ...values,
        email: values.email.toLowerCase(),
      };
      await SignupHandler(modifiedValues);
    },
  });

  const SignupHandler = async (values) => {
    setLoading(true);
    try {
      const res = await SIGN_UP_API(values);

      console.log("verification code sent", res.data.message);
      Toast.show({
        type: "success",
        text1: res.data.message || "Verification code sent",
      });

      router.push({
        pathname: "/verifyotp",
        params: { token: res.data.token },
      });

      console.log("message response //////", res);
    } catch (error) {
      console.log("Error signing up:", error?.response);
      Toast.show({
        type: "error",
        text1: error?.response?.data?.message || "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  // login handler

  const loginFormik = useFormik({
    initialValues: {

      email: "",
      password: "",

      // email: "shiva321@gmail.com",
      // password:"Shiva@12",

      // email: "twinkley2002@gmail.com",
      // password:"Twinkle@123",

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
    setLoading(true);
    const data = {
      email: values.email,
      password: values.password,
      fcmToken: fcm,
      fcmTokenType: Platform.OS === "android" ? "android" : "ios"

    };

    if (values.email) await AsyncStorage.setItem("user_email", values.email);
    setUserEmail(values.email);

    try {
      const res = await LOGIN_API(data, values);
      console.log("Login successful", res.data);

      Toast.show({
        type: "success",
        text1: res?.data?.message?.trim() || "Login successful",
      });
      router.replace("/home");
    } catch (error) {
      console.log("Error logging in:", error);

      if (error.response) {
        if (
          error.response.status === 400 &&
          error?.response?.data?.isAuthenticated === false
        ) {
          const token = error?.response?.data?.token;

          setAuthPopupMessage(error?.response?.data?.message);
          setAuthPopupVisible(true);
          setVerifytoken("jajajajajajajajaja", token); // You can still keep this for later use

          await AsyncStorage.setItem("authToken", token); // ✅ Save the token

          // ✅ Use token directly here — not verifytoken
          resendOtpHandler(token);

          setTimeout(() => {
            setAuthPopupVisible(false);
            router.push({
              pathname: "/verifyotp",
              // You can also pass token via params if needed later
              params: { token },
            });
          }, 2000);
        } else {
          console.log("error loginnnnnggggg", error?.response);
          // Toast.show(error?.response?.data?.message || error?.response?.data?.errors);
          Toast.show({
            type: "error",
            text1:
              error?.response?.data?.message ||
              (typeof error?.response?.data?.errors === "string"
                ? error.response.data.errors
                : "Something went wrong. Please try again."),
          });

        }
      }
    } finally {
      setLoading(false);
    }
  };

  // resend otp handler

  const resendOtpHandler = async (verifytoken) => {
    console.log("resend method", verifytoken);
    if (!verifytoken) {
      Toast.show({ type: "error", text1: "No token found. Please log in." });
      return;
    }

    try {
      const res = await RESEND_OTP(verifytoken); // Only one API call here
      console.log("OTP resend success:", res.data);
      setResentOtpMsg(true);
    } catch (error) {
      console.log("Error sending code:", error?.response);
      setApiErr(error?.response?.data?.message || "Failed to resend OTP");
    }
  };




  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      // Navigate to home directly if token exists
      // router.replace("/home");

    };
    console.log("Token in checkLoginStatus:", token); // Ensure the token is saved
    setIsLoggedIn(!!token); // Update the login status
  };

  const oauthHandler = async (oAuthToken) => {
    try {
      const res = await OAUTH(oAuthToken);
      console.log("OAuth response:", res);
 router.replace("/home")
      await checkLoginStatus();
     
      Toast.show({
        type: "success",
        text1: res.data.message || "OAuth successful",
      });
    } catch (error) {
      console.log("Error signing up:", error?.response?.data);
      Toast.show({
        type: "error",
        text1: error?.response?.data?.message || "OAuth failed",
      });
    }
  };

  // Update code ...

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="dark" />
      {/* {authPopupVisible && (
  <View className="absolute top-10 left-5 right-5 bg-white px-4 py-3 rounded-xl shadow-lg border border-[#FFB648] z-50">
    <Text className="text-black text-center font-medium">
      {authPopupMessage}
    </Text>
  </View>
)} */}

      {authPopupVisible && (
        <View className="absolute top-10 left-4 right-4 bg-white px-4 py-4 rounded-2xl shadow-xl border-l-4 border-[#FFB648] z-50 flex-row items-start space-x-3">
          {/* Icon */}
          <View className="mt-1">
            <AlertTriangle size={24} color="#FFB648" />
          </View>

          {/* Message and Close */}
          <View className="flex-1">
            <Text className="text-[#08203C] font-semibold text-base mb-1">
              Authentication Required
            </Text>
            <Text className="text-sm text-[#333]">{authPopupMessage}</Text>
          </View>

          {/* Close Button */}
          <TouchableOpacity onPress={() => setAuthPopupVisible(false)}>
            <X size={20} color="#999" />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView className="flex-1">
        <View className="flex-1 items-center">
          {/* <Text className="text-4xl font-black text-black py-4">LOGO</Text> */}
          <Image
            source={images.mainLogo}
            className="w-[125px] h-auto"
            resizeMode="contain"
          />

          {/* Tab Headers */}
          {/* <View className="flex-row mx-8 relative rounded-full my-4 bg-blue-400">
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
                style={{ fontFamily: "Lato" }}
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
                 style={{ fontFamily: "Lato" }}
                  className={`text-lg font-semibold ${
                    activeTab === "signup" ? "text-white" : "text-[#164E8D]"
                  }`}
                >
                  {applanguage === "eng"
                    ? Translations.eng.sign_up
                    : Translations.arb.sign_up}
                </Text>
              </Pressable>
            </Animated.View>
          </View> */}

          <View className="flex-row mx-8 relative rounded-full my-4 ">
            <Animated.View
              style={{
                flex: widthAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1],
                }),
              }}
            >
              <Pressable
                onPress={() => animateTab("login")}
                style={{
                  backgroundColor:
                    activeTab === "login" ? "#164E8D" : "rgba(0,0,0,0)",
                }}
                className={`items-center py-3 rounded-full border-2 ${activeTab === "signup" ? "border-[#164E8D]" : "border-[#164E8D]"}`}
              >
                <Text
                  style={{ fontFamily: "Lato" }}
                  className={`text-lg font-semibold ${activeTab === "login" ? "text-white " : "text-[#164E8D]"
                    }`}
                >
                  {applanguage === "eng"
                    ? Translations.eng.log_in
                    : Translations.arb.log_in}
                </Text>
              </Pressable>
            </Animated.View>
            <View className="w-2 " />
            <Animated.View
              style={{
                flex: widthAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1],
                }),
              }}
            >
              <Pressable
                onPress={() => animateTab("signup")}
                style={{
                  backgroundColor:
                    activeTab === "signup" ? "#164E8D" : "rgba(0,0,0,0)",
                }}
                className={`items-center py-3 rounded-full border-2 ${activeTab === "signup" ? "border-[#164E8D]" : "border-[#164E8D]"}`}
              >
                <Text
                  style={{ fontFamily: "Lato" }}
                  className={`text-lg font-semibold ${activeTab === "signup" ? "text-white" : "text-[#164E8D]"
                    }`}
                >
                  {applanguage === "eng"
                    ? Translations.eng.sign_up
                    : Translations.arb.sign_up}
                </Text>
              </Pressable>
            </Animated.View>
          </View>

     


          {/* Form Container */}
          <Animated.View
            className="w-full max-w-[500px] px-4 pt-4"
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
                  <Text className="text-red-500 w-[90%] mx-auto"
                    style={{ fontFamily: "Lato" }}>
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
                    <Text className="text-red-500 w-[90%] mx-auto" style={{ fontFamily: "Lato" }}>
                      {loginFormik.errors.password}
                    </Text>
                  )}
                <View className=" w-[90%] flex flex-row justify-end">

                <TouchableOpacity className=""><Text className="  text-[#164F90] font-bold" onPress={()=> router.push("/forgotpassemail")}>
                      {applanguage === "eng"
                        ? Translations.eng.forgot_password
                        : Translations.arb.forgot_password}
                    
                  </Text></TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={loginFormik.handleSubmit}
                  disabled={loading}
                  className="bg-[#FFB648] rounded-lg w-[90%] h-14 mx-auto mt-4 flex items-center justify-center"
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
                    <Text className="text-center  text-[#164F90] font-bold text-lg" style={{ fontFamily: "Lato" }}>
                      {applanguage === "eng"
                        ? Translations.eng.log_in
                        : Translations.arb.log_in}
                    </Text>
                  )}
                </TouchableOpacity>
                <View className="flex flex-row items-center justify-evenly mt-12 px-3">
                  <View className="flex-1 h-[1px] bg-black" />
                  <Text className="mx-2" style={{ fontFamily: "Lato" }}>
                    {applanguage === "eng"
                      ? Translations.eng.or
                      : Translations.arb.or}
                  </Text>
                  <View className="flex-1 h-[1px] bg-black" />
                </View>
                <View className="flex flex-row items-center justify-center gap-x-8 py-10">
                  <TouchableOpacity
                    onPress={() => onGoogleButtonPress()}
                    className=" border-gray-300 border-[2px] rounded-xl w-[80%] p-2 py-3 flex flex-row items-center justify-center gap-x-5  "
                  >
                    <SvgGoogle />
                    <Text className="font-bold text-lg mr-10" style={{ fontFamily: "Lato" }}>
                      Login with Google
                    </Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity>
                    <SvgApple />
                  </TouchableOpacity> */}
                </View>
                {/* <TouchableOpacity
                  className="self-center"
                  onPress={() => router.push("/home")}
                >
                  <Text className="text-[#0F7BE6] text-lg">
                    {applanguage === "eng"
                      ? Translations.eng.skip_login
                      : Translations.arb.skip_login}
                  </Text>
                </TouchableOpacity> */}

                <TouchableOpacity
                  className="self-center"
                  onPress={async () => {
                    // Ensure no token is saved
                    await AsyncStorage.removeItem("authToken");
                    await AsyncStorage.removeItem("authUserId"); // if you're storing userId

                    // Mark as skipped
                    await AsyncStorage.setItem("skippedLogin", "true");

                    // Navigate to home
                    router.replace("/home");
                  }}
                >
                  <Text className="text-[#0F7BE6] text-lg" style={{ fontFamily: "Lato" }}>
                    {applanguage === "eng"
                      ? Translations.eng.skip_login
                      : Translations.arb.skip_login}
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
                  <Text className="text-red-500 w-[90%] mx-auto" style={{ fontFamily: "Lato" }}>
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
                  <Text className="text-red-500 w-[90%] mx-auto" style={{ fontFamily: "Lato" }}>
                    {formik.errors.password}
                  </Text>
                )}

                <TouchableOpacity
                  onPress={formik.handleSubmit}
                  disabled={loading}
                  className="bg-[#FFB648] rounded-lg w-[90%] h-14 mx-auto mt-4 flex items-center justify-center"
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
                    <Text className="text-[#164F90] font-bold text-lg " style={{ fontFamily: "Lato" }}>
                      {applanguage === "eng"
                        ? Translations.eng.sign_up
                        : Translations.arb.sign_up}
                    </Text>
                  )}
                </TouchableOpacity>

                <View className="flex flex-row items-center justify-evenly mt-12 px-3">
                  <View className="flex-1 h-[1px] bg-black" />
                  <Text className="mx-2" style={{ fontFamily: "Lato" }}>
                    {applanguage === "eng"
                      ? Translations.eng.or
                      : Translations.arb.or}
                  </Text>
                  <View className="flex-1 h-[1px] bg-black" />
                </View>
                <View className="flex flex-row items-center justify-center gap-x-8 py-10">
                  <TouchableOpacity
                    onPress={() => onGoogleButtonPress()}
                    className=" border-gray-300 border-[2px] rounded-xl w-[80%] p-2 py-3 flex flex-row items-center justify-center gap-x-5  "
                  >
                    <SvgGoogle />
                    <Text className="font-bold text-lg mr-10" style={{ fontFamily: "Lato" }}>
                      Signup with Google
                    </Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity>
                    <SvgApple />
                  </TouchableOpacity> */}
                </View>
                <TouchableOpacity
                  className="self-center"
                  // onPress={() => router.push("/home")}
                  onPress={async () => {
                    // Ensure no token is saved
                    await AsyncStorage.removeItem("authToken");
                    await AsyncStorage.removeItem("authUserId"); // if you're storing userId

                    // Mark as skipped
                    await AsyncStorage.setItem("skippedLogin", "true");

                    // Navigate to home
                    router.replace("/home");
                  }}
                >
                  <Text className="text-[#0F7BE6] text-lg" style={{ fontFamily: "Lato" }}>
                    {applanguage === "eng"
                      ? Translations.eng.skip_signin
                      : Translations.arb.skip_signin}
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
//////////////////////////////////
