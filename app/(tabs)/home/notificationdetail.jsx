import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router, useLocalSearchParams } from "expo-router";
import dp from "../../../assets/images/dpfluthru.jpg"
import { Calendar } from "lucide-react-native";
import { langaugeContext } from "../../../customhooks/languageContext";
import Translations from "../../../language";
import { NOTIFICATION } from "../../../network/apiCallers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";


const notificationdetail = () => {

    const insets = useSafeAreaInsets();
    const { applanguage } = langaugeContext()
    const { notifId } = useLocalSearchParams(); 
    const [notification, setNotification] = useState(null);

        const fetchNotifications = async () => {
          const userId = await AsyncStorage.getItem("authUserId");
          console.log("Fetched userId:", userId); // 👈
        
          try {
            const res = await NOTIFICATION(userId);
            const notifs = res?.data?.userNotifications || [];
        
            console.log("Fetched notifs:", notifs); // 👈
            console.log("Looking for notifId:", notifId); // 👈
        
            const foundNotif = notifs.find((item) => item._id?.trim() === notifId?.trim());
            console.log("Found notification:", foundNotif); // 👈
        
            setNotification(foundNotif);
          } catch (error) {
            console.error("Error fetching notification:", error);
            // Toast.show(error?.response?.data?.message || "Failed to fetch notifications");
            Toast.show({
              type: "info",     
              text1: error?.response?.data?.message || "Failed to fetch notifications",
            });
          }
        };
        

        useEffect(()=>{
          fetchNotifications()
          console.log("notifId",notifId)

        },[])
        const formatTime = (isoString) => {
          const date = new Date(isoString);
          let hours = date.getHours();
          const minutes = date.getMinutes();
          const ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
          const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
          return `${hours}:${formattedMinutes} ${ampm}`;
        };
        
        

        
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
                 <Text className="text-[18px] text-white ml-3" style={{fontFamily: "CenturyGothic"}}>  {applanguage==="eng"?Translations.eng.notification:Translations.arb.notification
              }</Text>
               </View>
      </View>
     
    </View>
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>

        {/* <View className="bg-white p-5 mx-7 rounded-lg">
            <Text className="text-[#1D030099] font-thin text-lg">
            {notification?.body || "No details found."}
            </Text>
                    <Text className="text-[#00000033] text-right">  
                        {new Date(notification?.createdAt).toLocaleTimeString() || ""}
                    </Text>
        </View> */}

{notification ? (
  <View className="bg-white p-5 mx-7 rounded-lg">
    <Text className="text-[#1D030099] font-thin text-lg" style={{ fontFamily: "Lato" }}>
      {notification.body}
    </Text>
    <Text className="text-[#00000033] text-right" style={{ fontFamily: "Lato" }}>
      {/* {new Date(notification.createdAt).toLocaleTimeString()} */}
      {formatTime(notification?.createdAt)}
    </Text>
  </View>
) : (
  <Text className="text-center text-gray-400 mt-10" style={{ fontFamily: "Lato" }}>Loading or notification not found.</Text>
)}


   
  
    </ScrollView>
  </View>
  );
};

export default notificationdetail;

{/* <TouchableOpacity className=" my-4 mx-4 bg-[#FFB800] rounded-xl py-4 mb-3">
       <Text className="text-center text-black font-bold text-lg">Close the Trip</Text>
     </TouchableOpacity> */}