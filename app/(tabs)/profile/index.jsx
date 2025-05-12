import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  AppState,
  Easing,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Linking,
  Platform,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Delete } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import dp from "../../../assets/images/dpfluthru.jpg";
import { Calendar } from "lucide-react-native";
import Editprofile from "../../../assets/svgs/editprofile";
import Rightarrow from "../../../assets/svgs/rightarrow";
import Addaddress from "../../../assets/svgs/addaddress";
import Language from "../../../assets/svgs/language";
import Contactus from "../../../assets/svgs/contactus";
import Chat from "../../../assets/svgs/chat";
import Faq from "../../../assets/svgs/faq";
import Feedback from "../../../assets/svgs/feedback";
import Terms from "../../../assets/svgs/terms";
import Privacy from "../../../assets/svgs/privacy";
import Cancel from "../../../assets/svgs/cancel";
import Refund from "../../../assets/svgs/refund";
import Logout from "../../../assets/svgs/logout";
import DeleteIcon from "../../../assets/svgs/delete";
import RBSheet from "react-native-raw-bottom-sheet";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import Translations from "../../../language";
import { langaugeContext } from "../../../customhooks/languageContext";
// import {  signOut } from "firebase/auth";
import auth, {
  firebase,
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
} from "@react-native-firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { getApp } from "@react-native-firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DELETE_ACCOUNT, LOGOUT } from "../../../network/apiCallers";
import { useFormik } from "formik";
import delaccSchema from "../../../yupschema/delaccYupSchema";
import Cut from "../../../assets/svgs/cut";
import flightloader from "../../../assets/images/flightloader.gif";
import Toast from "react-native-toast-message";
import Constants from "expo-constants";

// import { Alert, Button } from "react-native";

// const handleSignOut = async () => {
//   try {
//     const app = getApp();
//     const auth = getAuth(app);

//     // Sign out from Firebase
//     await signOut(auth);

//     // Sign out from Google (if using Google Sign-In)
//     await GoogleSignin.signOut();

//     console.log("User signed out successfully");
//     return true; // Success
//   } catch (error) {
//     console.error("Sign-out error:", error);
//     throw error; // Re-throw to handle in the UI
//   }
// };

const handleSignOut = async () => {
  try {
    const app = getApp();
    const auth = getAuth(app);

    const currentUser = auth.currentUser;

    // If Firebase user exists, sign out from Firebase + Google
    if (currentUser) {
      await signOut(auth);
      await GoogleSignin.signOut();
      console.log("Signed out from Firebase and Google");
    } else {
      console.log("No Firebase user, proceeding with normal logout");
    }

    // Always clear custom tokens or app data
    await AsyncStorage.removeItem("authToken"); // or whatever you store
    return true;
  } catch (error) {
    console.error("Sign-out error:", error);
    throw error;
  }
};

const index = () => {
  const insets = useSafeAreaInsets();
  const drefRBSheet = useRef();
  const logoutrefRBSheet = useRef();
  const [current, setCurrent] = useState("1");
  const [loading, setLoading] = useState(false);
  const [shouldOpenSheet, setShouldOpenSheet] = useState(false);
  const [accountDeleted, setAccountDeleted] = useState(false);
  const [selectedRadioReason, setSelectedRadioReason] = useState("");

  const { applanguage } = langaugeContext();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [otherReason, setOtherReason] = useState(""); // for text input

  // useFocusEffect(
  //   useCallback(() => {
  //     const checkLoginStatus = async () => {
  //       const token = await AsyncStorage.getItem("authToken");
  //       const skipped = await AsyncStorage.getItem("skippedLogin");
  //       const isLoggedIn = !!token && skipped !== "true";
  //       setIsLoggedIn(isLoggedIn);
  //       console.log("Token:", token, "Skipped:", skipped, "isLoggedIn:", isLoggedIn);
  //     };

  //     checkLoginStatus();
  //   }, [])
  // );

  const translateX = useRef(new Animated.Value(0)).current;

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

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem("authToken");
    console.log("Token in checkLoginStatus:", token); // Debugging
    setIsLoggedIn(!!token); // Will correctly set the logged-in status
  };

  // useFocusEffect for re-checking when screen gains focus
  useFocusEffect(
    useCallback(() => {
      checkLoginStatus();
    }, [])
  );

  const formik = useFormik({
    initialValues: {
      reasonForDeleteAccount: "",
    },
    validationSchema: delaccSchema(applanguage),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      console.log("values CREATE ORDER", values);

      await deleteaccount(values);
    },
  });

  const logoutapi = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("authToken");

    try {
      if (token) {
        const res = await LOGOUT(token);
        console.log(res);
        Toast.show({
          type: "success",
          text1: res.data.message,
        });
      } else {
        Toast.show({
          type: "info",
          text1: "Logged out successfully",
        });
      }
    } catch (error) {
      console.log("Error during logout:", error?.response?.data?.message);
      Toast.show({
        type: "info",
        text1: "Logged out successfully",
      });
    } finally {
      setLoading(false);
      // Clear all user-related data from AsyncStorage
      await AsyncStorage.multiRemove([
        "authToken",
        "authUserId",
        "isGuestUser",
        "userEmail",
        // Add any other keys you store
      ]);
      setIsLoggedIn(false); // 👈 Ensure UI updates to "Login"

      // Navigate to the auth screen
      router.replace("/(auth)");
    }
  };

  const onSignOut = async () => {
    try {
      await handleSignOut();
      // Redirect to login/sign-in screen
      router.replace("/(auth)");
    } catch (error) {
      console.log("Error", error.message); // or toast.show(...)
    }
  };

  const handleLogout = () => {
    return (
      <RBSheet
        ref={logoutrefRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={Dimensions.get("window").height / 2.7}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },

          container: {
            backgroundColor: "#fff",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -3, // Lift shadow upwards
            },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5, // For Android shadow
          },
          draggableIcon: {
            backgroundColor: "#ccc",
            width: 40,
            height: 5,
            borderRadius: 10,
          },
        }}
      >
        <View className="p-3 rounded-2xl flex-col gap-y-6">
          <Text className="text-center border-b-[1px] border-[#E0E0E0] py-3 text-2xl font-bold" style={{ fontFamily: "Lato" }}>
            {applanguage === "eng"
              ? Translations.eng.logout
              : Translations.arb.logout}{" "}
          </Text>

          <Text className="text-center text-xl font-bold" style={{ fontFamily: "Lato" }}>
            {applanguage === "eng"
              ? Translations.eng.confirm_logout
              : Translations.arb.confirm_logout}
          </Text>

          <View className="mx-6 flex flex-col gap-3">
            <Text className="text-[#40464C] text-center" style={{ fontFamily: "Lato" }}>
              {applanguage === "eng"
                ? Translations.eng.logging_out_message
                : Translations.arb.logging_out_message}
            </Text>
          </View>

          <View className="flex flex-row justify-center">
            <TouchableOpacity
              className=" my-4 mx-4 border-2 border-[#164F90] rounded-xl py-4 px-10 "
              onPress={() => logoutrefRBSheet.current.close()}
            >
              <Text className="text-center text-[#164F90] font-semibold" style={{ fontFamily: "Lato" }}>
                {applanguage === "eng"
                  ? Translations.eng.not_now
                  : Translations.arb.not_now}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="my-4 mx-4 bg-[#FFB800] rounded-xl py-4 px-10 shadow-lg items-center"
              onPress={() => {
                onSignOut();
                logoutapi();
              }}
            >
              {loading ? (
                <View style={{ width: 72, alignItems: "center" }}>
                  <ActivityIndicator size="small" color="#000000" />
                </View>
              ) : (
                <Text className="text-center text-black font-semibold" style={{ fontFamily: "Lato" }}>
                  {applanguage === "eng"
                    ? Translations.eng.yes_logout
                    : Translations.arb.yes_logout}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    );
  };

  const deleteaccount = async (values) => {
    const finalReason = formik.values.reasonForDeleteAccount;

    setLoading(true);

    const token = await AsyncStorage.getItem("authToken");

    if (!token) {
      Toast.show("No token found. Please log in.");
      return;
    }

    try {
      const res = await DELETE_ACCOUNT(values, token);
      console.log(res);
      setAccountDeleted(true); // prevent reuse
      drefRBSheet.current?.close();
      router.push("/(auth)");
      // Toast.show(res.data.message);
      Toast.show({
        type: "success",
        text1: res.data.message,
      });
    } catch (error) {
      console.log("Error sending code:", error?.response?.data?.message);
      // Toast.show(error?.response?.data?.message || "error occured");
      Toast.show({
        type: "error",
        text1: error?.response?.data?.message || "error occured",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (accountDeleted) return null; // Prevent rendering if already deleted

    return (
      <RBSheet
        ref={drefRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={Platform.OS==="android"?Dimensions.get("window").height / 1.35:Dimensions.get("window").height / 1.65}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },

          container: {
            backgroundColor: "#fff",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -3, // Lift shadow upwards
            },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5, // For Android shadow
          },
          draggableIcon: {
            backgroundColor: "#ccc",
            width: 40,
            height: 5,
            borderRadius: 10,
          },
        }}
      >
        <View className="p-3 rounded-2xl flex-col gap-y-6">
          <View className="relative justify-center items-center border-b border-[#E0E0E0] px-4 py-3">
            <Text className="text-2xl font-bold text-center" style={{ fontFamily: "Lato" }}>
              {applanguage === "eng"
                ? Translations.eng.delete_account
                : Translations.arb.delete_account}
            </Text>
            <TouchableOpacity
              onPress={() => drefRBSheet.current.close()}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <Cut className="h-6 w-6" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <Text className="text-center text-xl font-bold" style={{ fontFamily: "Lato" }} >
              {applanguage === "eng"
                ? Translations.eng.delete_account_reason
                : Translations.arb.delete_account_reason}
            </Text>

            {/* Centering the RadioButtonGroup */}
            <View className=" items-center py-4">
              <RadioButtonGroup
                containerStyle={{ marginBottom: 10 }}
                // selected={current}
                selected={selectedRadioReason}
                // onSelected={(value) => setCurrent(value)}
                onSelected={(value) => {
                  setSelectedRadioReason(value);

                  const reasonMap = {
                    1: Translations.eng. reason_I_no_longer_need_this_service_or_app,
                    2: Translations.eng. reason_I_had_a_poor_experience_or_encountered_issues,
                   
                  };

                  const selectedReason =
                    applanguage === "eng"
                      ? reasonMap[value]
                      : {
                          1: Translations.arb. reason_I_no_longer_need_this_service_or_app,
                          2: Translations.arb. reason_I_had_a_poor_experience_or_encountered_issues,
                         
                        }[value];

                  // ✅ Set in Formik but don't show in the input
                  formik.setFieldValue(
                    "reasonForDeleteAccount",
                    selectedReason
                  );
                }}
                radioBackground="#4E4848"
              >
                <RadioButtonItem
                  value="1"
                  label={
                    <Text
                      style={{
                        color: "#181716",
                        fontFamily: "Lato",
                        fontSize: 17,
                        fontWeight: "100",
                      }}
                    >
                      {applanguage === "eng"
                        ? Translations.eng. reason_I_no_longer_need_this_service_or_app
                        : Translations.arb. reason_I_no_longer_need_this_service_or_app}
                    </Text>
                  }
                />

                <View className="h-3"></View>

                <RadioButtonItem
                  value="2"
                  label={
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          color: "#181716",
                          fontFamily: "Lato",
                          fontSize: 17,
                          fontWeight: "100",
                          textAlign: "left",
                        }}
                      >
                        {applanguage === "eng"
                          ? Translations.eng. reason_I_had_a_poor_experience_or_encountered_issues
                          : Translations.arb. reason_I_had_a_poor_experience_or_encountered_issues}
                      </Text>
                    </View>
                  }
                />

                {/* <View className="h-3"></View>

                <RadioButtonItem
                  value="3"
                  label={
                    <Text
                      style={{
                        color: "#181716",
                        fontFamily: "Lato", 
                        fontSize: 17,
                        fontWeight: "100",
                      }}
                    >
                      {applanguage === "eng"
                        ? Translations.eng.reason_driver_rude
                        : Translations.arb.reason_driver_rude}
                    </Text>
                  }
                />

                <View className="h-3"></View>

                <RadioButtonItem
                  value="4"
                  label={
                    <Text
                      style={{

                        color: "#181716",
                        fontFamily: "Lato",
                        fontSize: 17,
                        fontWeight: "100",
                      }}
                    >
                      {applanguage === "eng"
                        ? Translations.eng.reason_poor_experience
                        : Translations.arb.reason_poor_experience}
                    </Text>
                  }
                /> */}
              </RadioButtonGroup>
            </View>

            <View className="mx-6 flex flex-col gap-3">
              <Text className="text-[#40464C]" style={{ fontFamily: "Lato" }}>
                {" "}
                {applanguage === "eng"
                  ? Translations.eng.reason_other
                  : Translations.arb.reason_other}
              </Text>

              <TextInput
              style={{ height: 170 }}
                multiline={true}
                numberOfLines={7}
                onChangeText={(text) => {
                  // If user types manually, deselect radio
                  setSelectedRadioReason("");
                  formik.setFieldValue("reasonForDeleteAccount", text);
                }}
                // onChangeText={formik.handleChange("reasonForDeleteAccount")}
                onBlur={formik.handleBlur("reasonForDeleteAccount")}
                value={
                  selectedRadioReason
                    ? ""
                    : formik.values.reasonForDeleteAccount
                }
                className="bg-white rounded-lg p-3 border-[#EDF1F3] border-[1px]"
                placeholder={
                  applanguage === "eng"
                    ? Translations.eng.type_here
                    : Translations.arb.type_here
                }
                textAlignVertical="top"
                placeholderTextColor={"#1A1C1E"}
              />
              {formik.touched.reasonForDeleteAccount &&
                formik.errors.reasonForDeleteAccount && (
                  <Text className="text-red-500" style={{ fontFamily: "Lato" }}>
                    {formik.errors.reasonForDeleteAccount}
                  </Text>
                )}
            </View>

            <TouchableOpacity
              disabled={loading}
              onPress={formik.handleSubmit}
              style={{
                elevation: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 3.84,
              }}
              className="bg-[#FFB648] rounded-lg w-[90%] h-14 mx-auto mt-4 flex items-center justify-center mb-10"
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
                <Text className="font-bold text-center text-black" style={{ fontFamily: "Lato" }}>
                  {" "}
                  {applanguage === "eng"
                    ? Translations.eng.delete_account
                    : Translations.arb.delete_account}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </RBSheet>
    );
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState !== "active") {
        drefRBSheet.current?.close(); // ✅ close sheet when app goes background
        setShouldOpenSheet(false); // ✅ also reset the open flag
      }
    });

    return () => {
      subscription.remove(); // Clean up listener
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState !== "active") {
        logoutrefRBSheet.current?.close(); // ✅ close sheet when app goes background
        setShouldOpenSheet(false); // ✅ also reset the open flag
      }
    });

    return () => {
      subscription.remove(); // Clean up listener
    };
  }, []);

  return (
    <View className="flex-1">
      {/* Header Background Image */}
      {handleDelete()}
      {handleLogout()}
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
        <View className="flex-row  items-center  mt-5">
          <Text
            className="text-[20px] font-bold text-white ml-3"
            style={{ fontFamily: "CenturyGothic" }}
          >
            {applanguage === "eng"
              ? Translations.eng.profile
              : Translations.arb.profile}
          </Text>
        </View>
      </View>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>
        <View className="px-4">
          <TouchableOpacity
            className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
            onPress={() => router.push("/profile/editprofile")}
          >
            <View className="flex-row gap-3 items-center">
              <Editprofile />
              <Text className="text-[#515151] text-xl" style={{ fontFamily: "Lato" }}>
                {applanguage === "eng"
                  ? Translations.eng.profile_details
                  : Translations.arb.profile_details}
              </Text>
            </View>
            <Rightarrow />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
            onPress={() => router.push("/profile/address")}
          >
            <View className="flex-row gap-3 items-center">
              <Addaddress />
              <Text className="text-[#515151] text-xl" style={{ fontFamily: "Lato" }}>
                {applanguage === "eng"
                  ? Translations.eng.address
                  : Translations.arb.address}
              </Text>
            </View>
            <Rightarrow />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
            onPress={() => router.push("/profile/language")}
          >
            <View className="flex-row gap-3 items-center">
              <Language />
              <Text className="text-[#515151] text-xl" style={{ fontFamily: "Lato" }}>
                {applanguage === "eng"
                  ? Translations.eng.language
                  : Translations.arb.language}
              </Text>
            </View>
            <Rightarrow />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
            onPress={() => router.push("/profile/contactus")}
          >
            <View className="flex-row gap-3 items-center">
              <Contactus />
              <Text className="text-[#515151] text-xl" style={{ fontFamily: "Lato" }}>
                {applanguage === "eng"
                  ? Translations.eng.contact_us
                  : Translations.arb.contact_us}
              </Text>
            </View>
            <Rightarrow />
          </TouchableOpacity>

          {/* <TouchableOpacity
            className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
            onPress={() => router.push("/profile/chat")}
          >
            <View className="flex-row gap-3 items-center">
              <Chat />
              <Text className="text-[#515151] text-xl" style={{ fontFamily: "Lato" }}>
                {applanguage === "eng"
                  ? Translations.eng.chat_with_support
                  : Translations.arb.chat_with_support}
              </Text>
            </View>
            <Rightarrow />
          </TouchableOpacity> */}

          <TouchableOpacity
            className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
            onPress={() => router.push("/profile/faq")}
          >
            <View className="flex-row gap-3 items-center">
              <Faq />
              <Text className="text-[#515151] text-xl" style={{ fontFamily: "Lato" }}>
                {applanguage === "eng"
                  ? Translations.eng.faq
                  : Translations.arb.faq}
              </Text>
            </View>
            <Rightarrow />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
            onPress={() => router.push("/profile/feedback")}
          >
            <View className="flex-row gap-3 items-center">
              <Feedback />
              <Text className="text-[#515151] text-xl" style={{ fontFamily: "Lato" }}>
                {applanguage === "eng"
                  ? Translations.eng.feedback
                  : Translations.arb.feedback}
              </Text>
            </View>
            <Rightarrow />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
            onPress={() => router.push("/profile/termsandconditions")}
          >
            <View className="flex-row gap-3 items-center">
              <Terms />
              <Text className="text-[#515151] text-xl" style={{ fontFamily: "Lato" }}>
                {applanguage === "eng"
                  ? Translations.eng.terms_and_conditions
                  : Translations.arb.terms_and_conditions}
              </Text>
            </View>
            <Rightarrow />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
            onPress={() => router.push("/profile/privacypolicy")}
          >
            <View className="flex-row gap-3 items-center">
              <Privacy />
              <Text className="text-[#515151] text-xl" style={{ fontFamily: "Lato" }}>
                {applanguage === "eng"
                  ? Translations.eng.privacy_policy
                  : Translations.arb.privacy_policy}
              </Text>
            </View>
            <Rightarrow />
          </TouchableOpacity>

          {/* <TouchableOpacity
            className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
            onPress={() => router.push("/profile/cancellationpolicy")}
          >
            <View className="flex-row gap-3 items-center">
              <Cancel />
              <Text className="text-[#515151] text-xl" style={{ fontFamily: "Lato" }}>
                {applanguage === "eng"
                  ? Translations.eng.cancellation_policy
                  : Translations.arb.cancellation_policy}
              </Text>
            </View>
            <Rightarrow />
          </TouchableOpacity> */}

          {/* <TouchableOpacity
            className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
            onPress={() => router.push("/profile/refundpolicy")}
          >
            <View className="flex-row gap-3 items-center">
              <Refund />
              <Text className="text-[#515151] text-xl" style={{ fontFamily: "Lato" }}>
                {applanguage === "eng"
                  ? Translations.eng.refund_policy
                  : Translations.arb.refund_policy}
              </Text>
            </View>
            <Rightarrow />
          </TouchableOpacity> */}

          {isLoggedIn && (
            <TouchableOpacity
              className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
              onPress={() => drefRBSheet.current.open()}
            >
              <View className="flex-row gap-3 items-center">
                <DeleteIcon />
                <Text className="text-[#515151] text-xl" style={{ fontFamily: "Lato" }}>
                  {applanguage === "eng"
                    ? Translations.eng.delete_account
                    : Translations.arb.delete_account}
                </Text>
              </View>
              <Rightarrow />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
            onPress={() => {
              if (isLoggedIn) {
                logoutrefRBSheet.current.open(); // open sheet only if logged in
              } else {
                router.replace("/(auth)"); // go to auth screen if not logged in
              }
            }}
          >
            <View className="flex-row gap-3 items-center">
              <Logout />
              <Text className="text-[#515151] text-xl" style={{ fontFamily: "Lato" }}>
                {isLoggedIn
                  ? applanguage === "eng"
                    ? Translations.eng.logout
                    : Translations.arb.logout
                  : applanguage === "eng"
                  ? Translations.eng.log_in
                  : Translations.arb.log_in}
              </Text>
            </View>
            <Rightarrow />
          </TouchableOpacity>
        </View>

        <View className="">
          <Text className="text-center text-[#A0A0A0] text-[12px] mt-4 mb-4" style={{ fontFamily: "Lato" }}>
            {applanguage === "eng"
              ? Translations.eng.app_version
              : Translations.arb.app_version}{" "}
            -{Constants.expoConfig.version}
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://analogueitsolutions.com/")}
            className=" "
          >
            <Text className="text-center text-[#164E8D] font-bold text-[12px] mb-4 " style={{ fontFamily: "Lato" }}>
              © Analogue IT Solutions
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default index;
