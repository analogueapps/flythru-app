import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Platform,
  Modal,
} from "react-native";
import * as Calendarpicker from "expo-calendar";
import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import images from "../../../constants/images";
import { StatusBar } from "expo-status-bar";
import { Bell } from "lucide-react-native";
import ad from "../../../assets/images/adbanner.png";

import icongrey from "../../../assets/images/icongrey.png";
import { Calendar } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker"; // Import DateTimePicker
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router, useFocusEffect } from "expo-router";
import {
  ALL_BANNERS,
  ALL_FLIGHTS,
  NOTIFICATION,
} from "../../../network/apiCallers";
import { useFormik } from "formik";
import { langaugeContext } from "../../../customhooks/languageContext";
import Translations from "../../../language";
import { AllflightSchema } from "../../../yupschema/allFlightSchema";
import Fromto from "../../../assets/svgs/fromto";
import HomeCal from "../../../assets/homecalender";
import Homecal from "../../../assets/homecalender";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { useAuth } from "../../../UseContext/AuthContext";


const Index = () => {
  const insets = useSafeAreaInsets();
  const [showDatePicker, setShowDatePicker] = useState(false); // For Date Picker visibility
  const [selectedDate, setSelectedDate] = useState("");
  const [banners, setBanners] = useState([]);
  const [bannerPicture, setbannerPicture] = useState("");
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const {loadToken}=useAuth()
  // const [showDatePicker,setshowDatePicker]
  // Swap function
  const handleSwap = () => {
    const temp = fromValue;
    setFromValue(toValue);
    setToValue(temp);
  };

  const { applanguage } = langaugeContext();

  useFocusEffect(
    useCallback(() => {

      const checkNotificationStatus = async () => {
        try {
          await loadToken()
          const userId = await AsyncStorage.getItem("authUserId");
          const hasVisited = await AsyncStorage.getItem(
            "hasVisitedNotifications"
          );

          const res = await NOTIFICATION(userId);
          console.log("userId", userId);
          const hasNotifications = res?.data?.userNotifications?.length > 0;

          if (hasNotifications && hasVisited !== "true") {
            setHasUnreadNotifications(true);
          } else {
            setHasUnreadNotifications(false);
          }
        } catch (error) {
          console.error("Error checking notifications:", error);
          setHasUnreadNotifications(false);
        }
      };

      checkNotificationStatus();
    }, [])
  );

  useEffect(() => {
    const markNotificationsVisited = async () => {
      await AsyncStorage.setItem("hasVisitedNotifications", "true");
    };
  
    markNotificationsVisited();
  }, []);
  

  useEffect(() => {
    (async () => {
      const { status } = await Calendarpicker.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendarpicker.getCalendarsAsync(
          Calendarpicker.EntityTypes.EVENT
        );
        // console.log("Here are all your calendars:", calendars);
      } else {
        Alert.alert("Permission required", "Calendar access is needed.");
      }
    })();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setSelectedDate(formattedDate);
      formik.setFieldValue("departureDate", formattedDate); // Update formik state
    }
  };

  const createNewCalendar = async () => {
    try {
      const defaultCalendarSource =
        Platform.OS === "ios"
          ? await Calendarpicker.getDefaultCalendarAsync()
          : { isLocalAccount: true, name: "Expo Calendar" };

      const newCalendarID = await Calendarpicker.createCalendarAsync({
        title: "Flight Schedules",
        color: "#FFB800",
        entityType: Calendarpicker.EntityTypes.EVENT,
        sourceId: defaultCalendarSource.id,
        source: defaultCalendarSource,
        name: "Flight Schedules",
        ownerAccount: "personal",
        accessLevel: Calendarpicker.CalendarAccessLevel.OWNER,
      });

      // console.log("New calendar ID:", newCalendarID);
    } catch (error) {
      console.log("Error creating calendar:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      departureDate: "",
      flightNumber: "",
      from:'kwi',
      to:''
    },
    validationSchema: AllflightSchema(applanguage),
    validateOnChange: false, // Disable auto-validation on change
    validateOnBlur: false, // Disable auto-validation on blur
    onSubmit: async (values) => {
      console.log("Submitting values:", values);
      router.push({
        pathname: "/home/search",
        params: {
          departureDate: values.departureDate,
          flightNumber: values.flightNumber,
        },
      });
    },
  });

  

  const allbanners = async () => {
    try {
      const res = await ALL_BANNERS();
      console.log("API Response:", res);

      if (res?.data?.allBanners && Array.isArray(res.data.allBanners)) {
        setBanners(res.data.allBanners);

        const firstBanner = res.data.allBanners[0];
        if (firstBanner) {
          setbannerPicture(firstBanner.bannerSignedUrl); // Use signed URL
        }
      } else {
        setBanners([]);
      }
    } catch (error) {
      console.log("Error fetching banners:", error);
      setBanners([]);
    }
  };

  useEffect(() => {
    allbanners();
  }, []);

  return (
    <View className="flex-1">
      {/* Header Background Image */}
      <View>
        <Image
          source={images.HeroHeader}
          className="w-full h-auto relative"
          style={{ resizeMode: "cover" }} // Ensure the image fits nicely
        />
      </View>
      <View
        style={{
          top: insets.top,
          zIndex: 1,
          // height: 90,

          // backgroundColor: "green", // Transparent background
        }}
        className="flex-row justify-between items-center p-6 absolute w-full"
      >
        <View></View>
        <Image
          source={images.whiteLogo}
          className="w-[100px] h-[30px] ms-3"
          resizeMode="contain"
        />
        <TouchableOpacity
          className="bg-white rounded-full p-2"
          onPress={() => {
            setHasUnreadNotifications(false);
            router.push("/home/notification");
          }}
        >
          {hasUnreadNotifications && (
            <View className="absolute bg-red-500 rounded-full w-3 h-3 top-0 right-0" />
          )}
          <Bell color="black" size={18} />
        </TouchableOpacity>
      </View>
      <View className={`bg-white self-center absolute ${Platform.OS==="android"?"top-36":"top-44"} z-10  p-6 rounded-2xl w-[90%] shadow-lg`}>
        <TouchableOpacity
          onPress={() => {
            setShowDatePicker(true);
            console.log("calender pressed");
          }}
          className="flex-row my-2 justify-between items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50"
        >
          <TextInput
            placeholder="yyyy-mm-dd"
        
            onChangeText={formik.handleChange("departureDate")}
            onBlur={formik.handleBlur("departureDate")}
            value={formik.values.departureDate}
            name="departureDate"
            className="flex h-[30px]"
            placeholderTextColor="#2D2A29"
          />
          <TouchableOpacity
            className=""
            onPress={() => {
              setShowDatePicker(true);
              console.log("calender pressed");
            }}
          >
            <Homecal size={24} color="#6B7280" />
          </TouchableOpacity>
        </TouchableOpacity>

        {formik.touched.departureDate && formik.errors.departureDate && (
          <Text className="text-red-500 w-[90%] mx-auto"  style={{ fontFamily: "Lato" }}>
            {formik.errors.departureDate}
          </Text>
        )}

        {showDatePicker  &&(
          <DateTimePicker
            value={selectedDate ? new Date(selectedDate) : new Date()} // Ensure it has a valid date
            mode="date"
            display={Platform.OS==="android"?"default":"spinner"}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
{/* {Platform.OS === "ios" && (
  <Modal
    transparent={true}
    animationType="slide"
    visible={showDatePicker}
    onRequestClose={() => setShowDatePicker(false)}
  >
    <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <View style={{ backgroundColor: "white", padding: 16 }}>
       <DateTimePicker
  value={selectedDate ? new Date(selectedDate) : new Date()}
  mode="date"
  display="spinner"
  onChange={(event, date) => {
    if (event.type === "set" && date) {
      const today = new Date();
      const selected = new Date(date);

      // Remove time from both dates for accurate day comparison
      today.setHours(0, 0, 0, 0);
      selected.setHours(0, 0, 0, 0);

      if (selected < today) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Date',
          text2: 'Please select a future date.',
        });
        return; // Don't close or set the date
      }

      handleDateChange(event, selected); // your own handler
      setShowDatePicker(false);
    }
  }}
  minimumDate={new Date()} // optional if you want to prevent past dates entirely
/>

      </View>
    </View>
  </Modal>
)} */}


        <TextInput
          maxLength={6}
          placeholder={
            applanguage === "eng"
              ? Translations.eng.flight_number
              : Translations.arb.flight_number
          }
          onChangeText={formik.handleChange("flightNumber")}
          onBlur={formik.handleBlur("flightNumber")}
          value={formik.values.flightNumber}
          name="flightNumber"
          className="border h-[50px] border-gray-300 my-2 rounded-xl px-4 py-3 bg-gray-50"
          placeholderTextColor="#2D2A29"
        />

        {/* {formik.touched.flightNumber && formik.errors.flightNumber && (
          <Text className="text-red-500 w-[90%] mx-auto"  style={{ fontFamily: "Lato" }}>
            {formik.errors.flightNumber}
          </Text>
        )} */}

        <TextInput
          placeholder={
            applanguage === "eng"
              ? Translations.eng.from
              : Translations.arb.from
          }
          value={formik.values.from}
          readOnly
          // value={fromValue}
          // onChangeText={(text) => setFromValue(text)}
          className="border h-[50px] border-gray-300 my-2 rounded-xl text-black px-4 py-3 bg-gray-50"
          placeholderTextColor="#2D2A29"
        />

        {/* <TouchableOpacity
          className="z-[100] absolute right-10 top-[203px]"
          onPress={handleSwap}
        >
          <Fromto size={20} color="#6B7280" />
        </TouchableOpacity> */}

        <TextInput
          placeholder={
            applanguage === "eng" ? Translations.eng.to : Translations.arb.to
          }
          value={formik.values.to}
          // value={toValue}
          // onChangeText={(text) => setToValue(text)}
          className="border h-[50px] border-gray-300 my-2 rounded-xl px-4 py-3 bg-gray-50"
          placeholderTextColor="#2D2A29"
        />

        <TouchableOpacity
          onPress={async () => {
            await formik.validateForm(); // Validate form
            const { departureDate, flightNumber } = formik.values;

            if (!departureDate && !flightNumber) {
              formik.setErrors({
                departureDate: "Please fill at least one field",
                flightNumber: "Please fill at least one field",
                airPortName: "Please fill at least one field",
                city: "Please fill at least one field",
              });
              Toast.show({
                type: "error",
                text1:
                 " Please fill at least one field"
                    ,
              });
            } else {
              formik.handleSubmit();
              createNewCalendar();
            }
          }}
          className="bg-[#FFB800] rounded-lg py-4 mt-2 shadow-lg "
          style={{
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.50,
            shadowRadius: 3.84,
          }}
        >
          <Text className="text-center text-[#164E8D] font-bold text-base"  style={{ fontFamily: "Lato" }}>
            {applanguage === "eng"
              ? Translations.eng.search
              : Translations.arb.search}
          </Text>
        </TouchableOpacity>
      </View>
      {/* Safe Area Content */}
      <ScrollView className="flex-1" contentContainerStyle={{}}>
        <View className="flex-1 items-center justify-center mt-64 mx-6 ">
          {/* Ad Card */}
          {Array.isArray(banners) && banners.length > 0 && (
            <Text className="text-[#003C71] my-4 font-bold text-[16px] self-start"  style={{ fontFamily: "Lato" }}>
              {applanguage === "eng"
                ? Translations.eng.ad
                : Translations.arb.ad}
            </Text>
          )}

          {/* Your existing colored boxes */}
          <View className="w-full mx-4 mb-3 rounded-xl">
            {Array.isArray(banners) && banners.length > 0 ? (
              banners.map((banner, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => banner.link && Linking.openURL(banner.link)} // Open link if exists
                >
                  <Image
                    source={{
                      uri: banner.bannerSignedUrl, // ✅ Use the unique signed URL here
                    }}
                    className="h-[100px] w-full mb-3 rounded-xl"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))
            ) : (
              <Image
                source={icongrey}
                className="h-20 mt-24 w-full"
                resizeMode="contain"
              />
            )}
          </View>


        </View>
      </ScrollView>
    </View>
  );
};

export default Index;
