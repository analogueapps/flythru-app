import { View, Text, Image, TouchableOpacity, Animated, Easing, ScrollView, TextInput } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import filledstar from "../../../assets/images/filledstar.png"
import emptystar from "../../../assets/images/emptystar.png"
import { Calendar } from "lucide-react-native";
import Filledstar from "../../../assets/svgs/filledstar";
import Emptystar from "../../../assets/svgs/emptystar";
import { FEEDBACK } from "../../../network/apiCallers";
import { useFormik } from "formik";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { langaugeContext } from "../../../customhooks/languageContext";
import Translations from "../../../language";
import feedbackSchema from "../../../yupschema/feedbackSchema";
import flightloader from "../../../assets/images/flightloader.gif";
import Toast from "react-native-toast-message";
import AlertModal from "../../alertmodal";
import SuccessModal from "../../successmodal";


const feedback = () => {

  const insets = useSafeAreaInsets();
  const [selectedStars, setSelectedStars] = useState(0);
  const { applanguage } = langaugeContext()
  const [userName, setUserName] = useState('');
  const [errormsg, setErrormessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
const [modalMessage, setModalMessage] = useState("");
const [successVisible, setSuccessVisible] = useState(false);
const [successMessage, setSuccessMessage] = useState("");




  // Function to update stars based on user click
  const handleStarPress = (index) => {
    const rating = index + 1;
    setSelectedStars(rating);
    formik.setFieldValue("ratingStars", rating);
    formik.setFieldTouched("ratingStars", true);
  };


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


  const formik = useFormik({
    initialValues: {
      ratingStars: 0,
      comment: "",
    },
    validationSchema: feedbackSchema(applanguage),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {

      values.ratingStars = selectedStars || 0;
      formik.setFieldTouched("ratingStars", true);
      console.log("Submitting values:", values);
      await handleFeedback(values);
    },
  });


  const handleFeedback = async (values) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Toast.show({
          type: "info",

          text1: "Please login",
        }
        );
        return;
      }

      const res = await FEEDBACK(values, token);
      console.log("Feedback sent successfully", res.data.message);
      // Toast.show({
      //   type: "success",
      //   text1: res.data.message || "Feedback sent successfully",
      // })
      const message = res.data.message || "Feedback sent successfully";
setSuccessMessage(message);
setSuccessVisible(true);

// Remove router.push("/profile"); and instead navigate after closing modal


      
    } catch (error) {
      console.log("Error:", error);
      // toast.show(error?.response?.data?.message || "Failed to submit feedback");
      // Toast.show({
      //   type: "info",

      //   text1: error?.response?.data?.message || "Failed to submit feedback",
      // });

      setErrormessage(error?.response?.data?.message || "Failed to submit feedback");
setModalMessage(error?.response?.data?.message || "Failed to submit feedback");
setModalVisible(true);

    }
    finally {
      setLoading(false);
    }
  };

  const getUserName = async () => {
    try {
      const name = await AsyncStorage.getItem('user_name');
      if (name !== null) {
        console.log('Retrieved user name:', name);
        return name;
      } else {
        console.log('No user name found.');
        return '';
      }
    } catch (error) {
      console.error('Failed to retrieve the user name:', error);
      return '';
    }
  };
  useEffect(() => {
    // if (!token) {
    //   // If not logged in, clear fields
    //   setUserName("")
    //   return;
    // }
    const fetchUserName = async () => {
      const name = await getUserName();
      setUserName(name);
    };
    fetchUserName();
  }, []);

  return (
    <View className="flex-1">
      {/* Header Background Image */}
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
        className="p-6 absolute w-full mt-5"
      >
        <View className="flex-row  items-center ">

          <View className="flex-row  items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-[rgba(255,255,255,0.8)] rounded-full p-1"
            >
              <ChevronLeft color="black" size={18} />
            </TouchableOpacity>
            <Text className="text-[18px] text-white ml-3" style={{ fontFamily: "CenturyGothic" }}>{applanguage === "eng" ? Translations.eng.feedback : Translations.arb.feedback
            }</Text>
          </View>
        </View>

      </View>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>

        <View className="px-2 flex-col gap-8">
          <View className="flex flex-row justify-between items-center">
            <Text className="font-bold text-[#050505] text-[18px]" style={{ fontFamily: "Lato" }}> {applanguage === "eng" ? Translations.eng.review : Translations.arb.review
            }</Text>
            <View className="flex-row my-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <TouchableOpacity key={index} onPress={() => handleStarPress(index)}>
                  {index < formik.values.ratingStars ? (
                    <Image source={filledstar} className="h-6 w-6 ml-1" resizeMode="contain" />
                  ) : (
                    <Image source={emptystar} className="h-6 w-6 ml-1" resizeMode="contain" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View className="flex flex-col gap-y-2">
            <Text className="text-[#40464C] text-[15px]" style={{ fontFamily: "Lato" }}>{applanguage === "eng" ? Translations.eng.write_feedback : Translations.arb.write_feedback
            }</Text>
            <TextInput
              numberOfLines={10}
              onChangeText={formik.handleChange("comment")}
              onBlur={formik.handleBlur("comment")}
              value={formik.values.comment}
              className="bg-white rounded-lg p-3"
              placeholder={
                applanguage === "eng"
                  ? Translations.eng.type_here
                  : Translations.arb.type_here
              }
              textAlignVertical="top"
              placeholderTextColor={"#1A1C1E"}
            />
            {/* {errormsg && <Text className="text-red-500" style={{ fontFamily: "Lato" }}>{errormsg}
              
            </Text>
            } */}


            {formik.touched.comment && formik.errors.comment && (
              <Text className="text-red-500" style={{ fontFamily: "Lato" }}>{formik.errors.comment}</Text>
            )}

            {formik.touched.ratingStars && formik.errors.ratingStars && (
              <Text className="text-red-500" style={{ fontFamily: "Lato" }}>{formik.errors.ratingStars}</Text>
            )}
          </View>
        </View>

      </ScrollView>
      <TouchableOpacity
        style={{
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.50,
          shadowRadius: 3.84,
        }}
        className="bg-[#FFB648] rounded-lg w-[90%] max-w-[300px] h-14 mx-auto mt-4 flex items-center justify-center mb-10"
        onPress={formik.handleSubmit}
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
          <Text className="font-bold text-center text-[#164F90] " style={{ fontFamily: "Lato" }}>{applanguage === "eng" ? Translations.eng.submit : Translations.arb.submit
          }</Text>
        )}
      </TouchableOpacity>
      {modalVisible && (
  <AlertModal
    message={modalMessage}
    heading={applanguage === "eng" ? "Alert" : "تنبيه"}
    onClose={() => setModalVisible(false)}
  />
)}

{successVisible && (
  <SuccessModal
    visible={successVisible}
    heading={applanguage === "eng" ? "Thank you!" : "شكرًا لك"}
    message={successMessage}
    type="success"
    onClose={() => {
      setSuccessVisible(false);
      router.push("/profile"); // navigate after modal closes
    }}
  />
)}


    </View>
  );
};

export default feedback;
