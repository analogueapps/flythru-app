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
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SvgGoogle from "../../assets/svgs/GoogleIcon";
import SvgApple from "../../assets/svgs/AppleIcon";
import images from "../../constants/images";
import { router } from "expo-router";
import { useFormik } from "formik";
import { LOGIN_API, SIGN_UP_API } from "../../network/apiCallers";
import loginSchema from "../../yupschema/loginSchema";
import { useToast } from "react-native-toast-notifications";
import { useAuth } from "../../UseContext/AuthContext";
import { langaugeContext, } from "../../customhooks/languageContext";
import Translations from "../../language";
import signupSchema from "../../yupschema/signupSchema";
import {GoogleSignin} from '@react-native-google-signin/google-signin'
// import GoogleAuth from "../../googleAuth";
import auth from '@react-native-firebase/auth';


const Index = () => {
  const [activeTab, setActiveTab] = useState("signup");
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const widthAnim = useRef(new Animated.Value(0)).current;
  const toast = useToast()
  const { setUserEmail,SaveMail } = useAuth();
  const { applanguage } = langaugeContext()




 // Configure Google Sign-In
//  GoogleSignin.configure({
//   webClientId: "1027382214254-igq7ghhgc2o3o2hs8085npci8ruka5fd.apps.googleusercontent.com",
// });

// const [initializing, setInitializing] = useState(true);
// const [user, setUser] = useState();

// // Handle user state changes
// function onAuthStateChanged(user) {
//   setUser(user);
//   if (initializing) setInitializing(false);
// }

// useEffect(() => {
//   const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
//   return subscriber; // unsubscribe on unmount
// }, []);

// if (initializing) return null;

// // Initialize Firebase if not initialized
// if (!firebase.apps.length) {
//   firebase.initializeApp();
// } else {
//   firebase.app(); // Use the existing app if already initialized
// }

// // Google Sign-In
// async function onGoogleButtonPress() {
//   try {
//     // Check if your device supports Google Play
//     await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

//     // Get the user's ID token
//     const signInResult = await GoogleSignin.signIn();
//     let idToken = signInResult.idToken;

//     if (!idToken) {
//       throw new Error("No ID token found");
//     }

//     // Create a Google credential with the token
//     const googleCredential = auth.GoogleAuthProvider.credential(idToken);

//     // Sign-in the user with the credential
//     const userCredential = await auth().signInWithCredential(googleCredential);
//     console.log(userCredential);
//   } catch (error) {
//     console.error("Google Sign-In Error: ", error);
//     toast.show(error.message, { type: "danger" });
//   }
// }


  // const animateTab = () => {
  //   const toValue = tab === "login" ? 0 : 1;
  //   setActiveTab(tab);

  //   Animated.parallel([
  //     Animated.spring(slideAnim, {
  //       toValue,
  //       useNativeDriver: true,
  //       friction: 8,
  //     }),
  //     Animated.sequence([
  //       Animated.timing(fadeAnim, {
  //         toValue: 0,
  //         duration: 550,
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(fadeAnim, {
  //         toValue: 1,
  //         duration: 550,
  //         useNativeDriver: true,
  //       }),
  //     ]),
  //     Animated.spring(widthAnim, {
  //       // Add this animation
  //       toValue,
  //       useNativeDriver: false,
  //       friction: 8,
  //     }),
  //   ]).start();
  // };

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
      ...values , email: values.email.toLowerCase(), 
    };
    await SignupHandler(modifiedValues);
    
  },
});

const SignupHandler = async (values) => {

  
  try {
    const res = await SIGN_UP_API(values);

        console.log("verification code sent", res.data.message);
        router.push("/verifyotp"); 
        toast.show(res.data.message)
        router.push({ pathname: "/verifyotp", params: { token: res.data.token } });

        console.log("message response //////",res)
      } catch (error) {
        console.log("Error signing up:", error?.response?.data?.errors);
        toast.show(error?.response?.data?.message)

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
        console.log("login values", modifiedValues)
        await LoginHandler(modifiedValues);
        await SaveMail(modifiedValues.email)
        
      },
    });
   
    
    const LoginHandler = async (values) => {
      try {
        const res = await LOGIN_API(values);
        console.log("Login successful", res.data);
        router.push("/home");
        toast.show(res.data.message)
      } catch (error) {
        console.log("Error logging in:", error);
        
        if (error.response){
          if(error.response.status === 400 && error?.response?.data?.isAuthenticated === false){
            toast.show(error?.response?.data?.message)
            router.push("/verifyotp")
          }
          else {
            console.log("error loginnnnnggggg" , error?.response)
            toast.show(error?.response?.data?.errors)
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
                   {
                applanguage==="eng"?Translations.eng.log_in:Translations.arb.log_in
              }
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
                  {
                applanguage==="eng"?Translations.eng.sign_in:Translations.arb.sign_in
              }
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
                  {
                applanguage==="eng"?Translations.eng.login_to_your_account:Translations.arb.login_to_your_account
              }
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
                  <Text className="text-red-500 w-[90%] mx-auto">{loginFormik.errors.email}</Text>
                )}

                <TextInput
                secureTextEntry
                 onChangeText={loginFormik.handleChange("password")}
                 onBlur={loginFormik.handleBlur("password")}
                 value={loginFormik.values.password}
                  className={`bg-[#f2f2f2] border h-14 px-2 py-2 my-4 rounded-lg border-[#8B8B8B] w-[90%] mx-auto`}
                  placeholder={
                    applanguage === "eng"
                      ? Translations.eng.password_placeholder
                      : Translations.arb.password_placeholder
                  }                />

{loginFormik.touched.password && loginFormik.errors.password && (
                  <Text className="text-red-500 w-[90%] mx-auto">{loginFormik.errors.password}</Text>
                )}

                <TouchableOpacity
                  onPress={loginFormik.handleSubmit}
                  className="bg-[#FFB648] rounded-lg py-4 w-[90%] mx-auto mt-4"
                >
                  <Text className="text-center  text-[#08203C] font-semibold text-lg">
                  {
                applanguage==="eng"?Translations.eng.log_in:Translations.arb.log_in
              }</Text>
                </TouchableOpacity>
                <View className="flex flex-row items-center justify-evenly mt-12 px-3">
                  <View className="flex-1 h-[1px] bg-black" />
                  <Text className="mx-2">

                  {
                applanguage==="eng"?Translations.eng.or:Translations.arb.or
              }
                  </Text>
                  <View className="flex-1 h-[1px] bg-black" />
                </View>
                <View className="flex flex-row items-center justify-center gap-x-8 py-10">
                  <TouchableOpacity 
                  // onPress={()=>onGoogleButtonPress()}
                  >
                    <SvgGoogle />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <SvgApple />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity className="self-center"
                onPress={() => router.push("/home")}>
                  <Text className="text-[#0F7BE6] text-lg">
                  {
                applanguage==="eng"?Translations.eng.skip_and_continue_as_guest:Translations.arb.skip_and_continue_as_guest
              }
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
{
                applanguage==="eng"?Translations.eng.sign_up_to_register:Translations.arb.sign_up_to_register
              }
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
                  <Text className="text-red-500 w-[90%] mx-auto">{formik.errors.email}</Text>
                )}
                {/* <TextInput
                  className={`bg-[#f2f2f2] border h-14 px-2 my-4 py-2 rounded-lg border-[#8B8B8B] w-full`}
                  placeholder="Enter Phone Number"
                /> */}

                <TextInput
                  secureTextEntry
                  onChangeText={formik.handleChange("password")}
                  onBlur={formik.handleBlur("password")}
                  value={formik.values.password}
                  className={`bg-[#f2f2f2] border h-14 px-2 py-2 my-4 rounded-lg border-[#8B8B8B] w-[90%] mx-auto`}
                  placeholder={
                    applanguage === "eng"
                      ? Translations.eng.password_placeholder
                      : Translations.arb.password_placeholder
                  }   
                />
                {formik.touched.password && formik.errors.password && (
                  <Text className="text-red-500 w-[90%] mx-auto">{formik.errors.password}</Text>
                )}

                <TouchableOpacity
                  onPress={formik.handleSubmit}
                  className="bg-[#FFB648] rounded-lg py-4 w-[90%] mx-auto mt-4"
                >
                  <Text className="text-center text-[#08203C] font-semibold text-lg">
                  {
                applanguage==="eng"?Translations.eng.sign_up:Translations.arb.sign_up
              }
                  </Text>
                </TouchableOpacity>
                <View className="flex flex-row items-center justify-evenly mt-12 px-3">
                  <View className="flex-1 h-[1px] bg-black" />
                  <Text className="mx-2">
                  {
                applanguage==="eng"?Translations.eng.or:Translations.arb.or
              }
                  </Text>
                  <View className="flex-1 h-[1px] bg-black" />
                </View>
                <View className="flex flex-row items-center justify-center gap-x-8 py-10">
                  <TouchableOpacity>
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
                  {
                applanguage==="eng"?Translations.eng.skip_and_continue_as_guest:Translations.arb.log_in
              }
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
