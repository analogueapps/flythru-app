import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import dp from "../../../assets/images/dpfluthru.jpg"
import { Calendar } from "lucide-react-native";
import Translations from "../../../language";
import { langaugeContext } from "../../../customhooks/languageContext";
import { NOTIFICATION } from "../../../network/apiCallers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";


const notification = () => {

    const insets = useSafeAreaInsets();
    const { applanguage } = langaugeContext()
    const [notifications , setNotifications] = useState([])
    const [notiId , setNotiId] = useState({})
    const [loading , setLoading] = useState(false)

    const formatTime = (isoString) => {
      const date = new Date(isoString);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = ((hours + 11) % 12 + 1); // Convert to 12-hour format
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    };
    

    //  const fetchNotifications = async () => {
    //       const token = await AsyncStorage.getItem('authToken');
    //       if (!token) {
    //         toast.show("No token found. Please log in.");
    //         return;
    //       }
        
    //       try {
    //         const res = await NOTIFICATION(token);
    //         console.log("notiofications Response:", res.data);
    //         setNotifications(res.data.userNotifications || [])
    //         console.log("notifications", notifications)
    //       } catch (error) {
    //         console.error("Error fetching notifications:", error);
    //         toast.show(error?.response?.data?.message || "Failed to fetch notifications");
    //       }
    //     };

    const fetchNotifications = async () => {
      setLoading(true);
      const userId = await AsyncStorage.getItem("authUserId"); // <-- get userId here
      try {
        const res = await NOTIFICATION(userId);
console.log("Full response:", res);

if (res?.data?.userNotifications) {
  setNotifications(res.data.userNotifications);
  setNotiId(res.data.userNotifications.body)
} else {
  console.log("No notifications found in response");
  setNotifications([]); // fallback
}

      } catch (error) {
        console.error("Error fetching notifications:", error);
        // Toast.show(error?.response?.data?.message || "Failed to fetch notifications");
        Toast.show({
          type: "info",
          text1: "Alert",
          text2: error?.response?.data?.message || "Failed to fetch notifications",
        });
      }
        finally {
          setLoading(false);
        }
    };
        useEffect(() => {
          fetchNotifications();
        }, []);
        useEffect(() => {
          console.log("notifications", notifications)

        }, [notifications]);
    

  
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
      className="p-6 absolute w-full"
    >
      <View className="flex-row  items-center">
       
       <View className="flex-row  items-center mt-4">
                 <TouchableOpacity
                   onPress={() => router.back()}
                   className="bg-[rgba(255,255,255,0.8)] rounded-full p-1"
                 >
                   <ChevronLeft color="black" size={18} />
                 </TouchableOpacity>
                 <Text className="text-[18px] text-white ml-3" style={{fontFamily: "CenturyGothic"}}> {applanguage==="eng"?Translations.eng.notification:Translations.arb.notification
              }</Text>
               </View>
      </View>
     
    </View>
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>
  {loading ? (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#164F90" />
    </View>
  ) : notifications.length > 0 ? (
    notifications.map((notif, index) => (
      <TouchableOpacity
        key={notif._id || index}
        className="flex-row justify-between px-3 border-b-[1px] border-[#B1B1B1] py-6"
        onPress={() =>
          router.push({
            pathname: "/home/notificationdetail",
            params: {
              notifId: notif._id,
            },
          })
        }
      >
        <View className="w-[300px]">
          <Text className="text-lg font-bold" style={{ fontFamily: "Lato" }}>{notif.title}</Text>
          <Text style={{ fontFamily: "Lato" }}>{notif.body}</Text>
        </View>
        <Text style={{ fontFamily: "Lato" }}>{formatTime(notif.createdAt)}</Text>
      </TouchableOpacity>
    ))
  ) : (
    <Text className="text-center text-gray-500" style={{ fontFamily: "Lato" }}>
      {applanguage === "eng"
        ? Translations.eng.no_notifications_available
        : Translations.arb.no_notifications_available}
    </Text>
  )}
</ScrollView>

  </View>
  );
};

export default notification;
 