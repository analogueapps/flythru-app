import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from "react-native";
import React from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import dp from "../../../assets/images/dpfluthru.jpg"
import { Calendar } from "lucide-react-native";


const notification = () => {

    const insets = useSafeAreaInsets();
  
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
                 <Text className="text-[18px] text-white ml-3" style={{fontFamily: "CenturyGothic"}}>Notification</Text>
               </View>
      </View>
     
    </View>
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>

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
                  ))}


      
     
    </ScrollView>
  </View>
  );
};

export default notification;
 