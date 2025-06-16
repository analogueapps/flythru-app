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
import { Bell } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import ad from "../../../assets/images/adbanner.png";
import DateTimePickerModal from "react-native-modal-datetime-picker";
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

import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { useAuth } from "../../../UseContext/AuthContext";
import FlightForm from "../../../components/FlightForm";
import { AllflightSchema } from "../../../yupschema/allFlightSchema";

const Index = () => {
  const insets = useSafeAreaInsets();

  const [banners, setBanners] = useState([]);
  const [bannerPicture, setbannerPicture] = useState("");
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  const { loadToken } = useAuth();
  // const [showDatePicker,setshowDatePicker]
  // Swap function

  const { applanguage } = langaugeContext();

  useFocusEffect(
    useCallback(() => {
      const checkNotificationStatus = async () => {
        try {
          await loadToken();
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

  const formik = useFormik({
    initialValues: {
      departureDate: "20-06-2025",
      departureTime: "01:10",
      flightNumber: "AA567",
      from: "kwi",
      to: "hyd",
    },
    // validationSchema: AllflightSchema(applanguage),
    validateOnChange: false, // Disable auto-validation on change
    validateOnBlur: false, // Disable auto-validation on blur
    onSubmit: async (values) => {
      console.log("Form Values:", values);

      const { departureDate, flightNumber, to, from, departureTime } = values;

      if (!departureDate || !flightNumber || !from || !to || !departureTime) {
        Toast.show({
          type: "error",
          text1: "Please fill all fields",
        });
        return;
      }
      const [day, month, year] = departureDate.split("-");
      // const parsedDepartureDate = `${year}-${month}-${day}`;
      const parsedDepartureDate = `${day}-${month}-${year}`;

      router.push({
        // pathname: "/home/search",
        pathname: "/home/search",
        params: {
          departureDate: parsedDepartureDate,
          flightNumber: flightNumber,
          departureTime: departureTime,
          from: from,
          to: to,
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
      <View
        className={`bg-white self-center absolute ${
          Platform.OS === "android" ? "top-36" : "top-44"
        } z-10  p-6 rounded-2xl w-[90%] shadow-lg`}
      >
        <View>
          <Text className="text-[#164E8D] font-semibold mb-2">Search By</Text>
        </View>
        <FlightForm formik={formik} />
      </View>
      {/* Safe Area Content */}
      <ScrollView className="flex-1" contentContainerStyle={{}}>
        <View className="flex-1 items-center justify-center mt-80 mx-6 ">
          {/* Ad Card */}
          {Array.isArray(banners) && banners.length > 0 && (
            <Text
              className="text-[#003C71] my-4 font-bold text-[16px] self-start"
              style={{ fontFamily: "Lato" }}
            >
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
