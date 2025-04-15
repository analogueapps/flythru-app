import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";
import React, { useRef, useState } from "react";
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

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { getApp } from "@react-native-firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DELETE_ACCOUNT, LOGOUT } from "../../../network/apiCallers";
import { useFormik } from "formik";
import delaccSchema from "../../../yupschema/delaccYupSchema";
import { useToast } from "react-native-toast-notifications";

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
  const { applanguage } = langaugeContext();
  const toast = useToast();
  const router = useRouter();
  const [otherReason, setOtherReason] = useState(""); // for text input

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
    const token = await AsyncStorage.getItem("authToken");

    if (!token) {
      toast.show("Logged out successfully");
      return;
    }

    try {
      const res = await LOGOUT(token);
      console.log(res);
      router.replace("/(auth)");
      toast.show(res.data.message);
      console.log(res.data.message);
    } catch (error) {
      console.log("Error sending code:", error?.response?.data?.message);
      toast.show(error?.response?.data?.message || "error occured");
    }
  };

  const deleteaccount = async (values) => {
    const token = await AsyncStorage.getItem("authToken");

    if (!token) {
      toast.show("No token found. Please log in.");
      return;
    }

    try {
      const res = await DELETE_ACCOUNT(values, token);
      console.log(res);
      router.push("/(auth)");
      toast.show(res.data.message);
    } catch (error) {
      console.log("Error sending code:", error?.response?.data?.message);
      toast.show(error?.response?.data?.message || "error occured");
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
          <Text className="text-center border-b-[1px] border-[#E0E0E0] py-3 text-2xl font-bold">
            {applanguage === "eng"
              ? Translations.eng.logout
              : Translations.arb.logout}{" "}
          </Text>

          <Text className="text-center text-xl font-bold">
            {applanguage === "eng"
              ? Translations.eng.confirm_logout
              : Translations.arb.confirm_logout}
          </Text>

          <View className="mx-6 flex flex-col gap-3">
            <Text className="text-[#40464C] text-center">
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
              <Text className="text-center text-[#164F90] font-semibold">
                {applanguage === "eng"
                  ? Translations.eng.not_now
                  : Translations.arb.not_now}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className=" my-4 mx-4 bg-[#FFB800] rounded-xl py-4 px-10 shadow-lg"
              // onPress={() => router.push("/(auth)")}
              onPress={() => {
                onSignOut();
                logoutapi();
              }}
            >
              <Text className="text-center text-black font-semibold">
                {applanguage === "eng"
                  ? Translations.eng.yes_logout
                  : Translations.arb.yes_logout}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    );
  };

  const handleDelete = () => {
    return (
      <RBSheet
        ref={drefRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={Dimensions.get("window").height / 1.35}
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
          <Text className="text-center border-b-[1px] border-[#E0E0E0] py-3 text-2xl font-bold">
            {applanguage === "eng"
              ? Translations.eng.delete_account
              : Translations.arb.delete_account}
          </Text>

          <ScrollView>
            <Text className="text-center text-xl font-bold">
              {applanguage === "eng"
                ? Translations.eng.delete_account_reason
                : Translations.arb.delete_account_reason}
            </Text>

            {/* Centering the RadioButtonGroup */}
            <View className=" items-center py-4">
              <RadioButtonGroup
                containerStyle={{ marginBottom: 10 }}
                selected={current}
                // onSelected={(value) => setCurrent(value)}
                onSelected={(value) => {
                  const reasonMap = {
                    "1": Translations.eng.reason_service_not_good,
                    "2": Translations.eng.reason_no_proper_customer_care,
                    "3": Translations.eng.reason_driver_rude,
                    "4": Translations.eng.reason_poor_experience,
                  };
                
                  const selectedReason = applanguage === "eng" ? reasonMap[value] : Object.values(Translations.arb)[parseInt(value) - 1];
                
                  formik.setFieldValue("reasonForDeleteAccount", selectedReason);
                }}
                
                radioBackground="#4E4848"
              >
                <RadioButtonItem
                  value="1"
                  label={
                    <Text
                      style={{
                        color: "#181716",
                        fontSize: 17,
                        fontWeight: "100",
                      }}
                    >
                      {applanguage === "eng"
                        ? Translations.eng.reason_service_not_good
                        : Translations.arb.reason_service_not_good}
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
                          fontSize: 17,
                          fontWeight: "100",
                          textAlign: "left",
                        }}
                      >
                        {applanguage === "eng"
                          ? Translations.eng.reason_no_proper_customer_care
                          : Translations.arb.reason_no_proper_customer_care}
                      </Text>
                    </View>
                  }
                />

                <View className="h-3"></View>

                <RadioButtonItem
                  value="3"
                  label={
                    <Text
                      style={{
                        color: "#181716",
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
                        fontSize: 17,
                        fontWeight: "100",
                      }}
                    >
                      {applanguage === "eng"
                        ? Translations.eng.reason_poor_experience
                        : Translations.arb.reason_poor_experience}
                    </Text>
                  }
                />
              </RadioButtonGroup>
            </View>

            <View className="mx-6 flex flex-col gap-3">
              <Text className="text-[#40464C]">
                {" "}
                {applanguage === "eng"
                  ? Translations.eng.reason_other
                  : Translations.arb.reason_other}
              </Text>

              <TextInput
                numberOfLines={7}
                onChangeText={formik.handleChange("reasonForDeleteAccount")}
                onBlur={formik.handleBlur("reasonForDeleteAccount")}
                value={formik.values.reasonForDeleteAccount}
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
                  <Text className="text-red-500">
                    {formik.errors.reasonForDeleteAccount}
                  </Text>
                )}
            </View>

            <TouchableOpacity
              onPress={formik.handleSubmit}
              className="my-4 mx-12 bg-[#FFB800] rounded-xl py-4 mb-14 shadow-lg"
            >
              <Text className="font-bold text-center text-black">
                {" "}
                {applanguage === "eng"
                  ? Translations.eng.delete_account
                  : Translations.arb.delete_account}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </RBSheet>
    );
  };

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
              <Text className="text-[#515151] text-xl">
                {applanguage === "eng"
                  ? Translations.eng.edit_profile
                  : Translations.arb.edit_profile}
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
              <Text className="text-[#515151] text-xl">
                {applanguage === "eng"
                  ? Translations.eng.add_address
                  : Translations.arb.add_address}
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
              <Text className="text-[#515151] text-xl">
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
              <Text className="text-[#515151] text-xl">
                {applanguage === "eng"
                  ? Translations.eng.contact_us
                  : Translations.arb.contact_us}
              </Text>
            </View>
            <Rightarrow />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
            onPress={() => router.push("/profile/chat")}
          >
            <View className="flex-row gap-3 items-center">
              <Chat />
              <Text className="text-[#515151] text-xl">
                {applanguage === "eng"
                  ? Translations.eng.chat_with_support
                  : Translations.arb.chat_with_support}
              </Text>
            </View>
            <Rightarrow />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
            onPress={() => router.push("/profile/faq")}
          >
            <View className="flex-row gap-3 items-center">
              <Faq />
              <Text className="text-[#515151] text-xl">
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
              <Text className="text-[#515151] text-xl">
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
              <Text className="text-[#515151] text-xl">
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
              <Text className="text-[#515151] text-xl">
                {applanguage === "eng"
                  ? Translations.eng.privacy_policy
                  : Translations.arb.privacy_policy}
              </Text>
            </View>
            <Rightarrow />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
            onPress={() => router.push("/profile/cancellationpolicy")}
          >
            <View className="flex-row gap-3 items-center">
              <Cancel />
              <Text className="text-[#515151] text-xl">
                {applanguage === "eng"
                  ? Translations.eng.cancellation_policy
                  : Translations.arb.cancellation_policy}
              </Text>
            </View>
            <Rightarrow />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
            onPress={() => router.push("/profile/refundpolicy")}
          >
            <View className="flex-row gap-3 items-center">
              <Refund />
              <Text className="text-[#515151] text-xl">
                {applanguage === "eng"
                  ? Translations.eng.refund_policy
                  : Translations.arb.refund_policy}
              </Text>
            </View>
            <Rightarrow />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
            onPress={() => drefRBSheet.current.open()}
          >
            <View className="flex-row gap-3 items-center">
              <DeleteIcon />
              <Text className="text-[#515151] text-xl">
                {applanguage === "eng"
                  ? Translations.eng.delete_account
                  : Translations.arb.delete_account}
              </Text>
            </View>
            <Rightarrow />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row justify-between items-center py-6 border-b-[1px] border-[#CBCBCB]"
            onPress={() => logoutrefRBSheet.current.open()}
          >
            <View className="flex-row gap-3 items-center">
              <Logout />
              <Text className="text-[#515151] text-xl">
                {applanguage === "eng"
                  ? Translations.eng.logout
                  : Translations.arb.logout}
              </Text>
            </View>
            <Rightarrow />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default index;
