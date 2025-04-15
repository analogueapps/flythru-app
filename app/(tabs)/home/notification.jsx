import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from "react-native";
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
import { useToast } from "react-native-toast-notifications";


const notification = () => {

    const insets = useSafeAreaInsets();
    const { applanguage } = langaugeContext()
    const [notifications , setNotifications] = useState([])
    const [notiId , setNotiId] = useState({})
    const toast = useToast()

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
        toast.show(error?.response?.data?.message || "Failed to fetch notifications");
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
       
       <View className="flex-row  items-center">
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
{/* 
    {Array.from({ length: 5 }).map((_, index) => (

        <TouchableOpacity key={index} className="flex-row justify-between px-3 border-b-[1px] border-[#B1B1B1] py-6"
                  onPress={() => router.push("/home/notificationdetail")}
        
        >
            <View className="w-[300px]">
                <Text className="text-lg font-bold">Your Baggage has been delivered </Text>
                <Text>Your Baggage has been delivered all QR Code. You can confirm from your end to Close the trip</Text>
            </View>
            <Text>a days ago</Text>
        </TouchableOpacity>
                  ))} */}

{notifications.length > 0 ? (
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
        <Text className="text-lg font-bold">{notif.title}</Text>
        <Text>{notif.body}</Text>
      </View>
      <Text>{notif.data?.daysAgo || "Just now"}</Text>
    </TouchableOpacity>
  ))
) : (
  <Text className="text-center text-gray-500">No notifications available</Text>
)}

      
     
    </ScrollView>
  </View>
  );
};

export default notification;
 