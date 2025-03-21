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
import Send from "../../../assets/svgs/send";


const chat = () => {

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
      className="p-6 absolute w-full mt-5"
    >
      <View className="flex-row  items-center">
       
       <View className="flex-row  items-center">
                 <TouchableOpacity
                   onPress={() => router.back()}
                   className="bg-[rgba(255,255,255,0.8)] rounded-full p-1"
                 >
                   <ChevronLeft color="black" size={18} />
                 </TouchableOpacity>
                 <Text className="text-[18px] text-white ml-3" style={{fontFamily: "CenturyGothic"}}>Chat</Text>
               </View>
      </View>
     
    </View>
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>

        <View className="w-full">
            <View className="bg-white p-3 m-3 w-[80%] rounded-lg">
            <Text>This is a message sent by the priya. You were invited to the event of her birthday!</Text> 
            <Text className="text-right text-[#00000066] text-sm mt-2"> 11.14 AM</Text>           
            </View>

            <View className="bg-white p-3 m-3 w-[80%] ml-20 rounded-lg">
            <Text>This is a message sent by the priya. You were invited to the event of her birthday!</Text> 
            <Text className=" text-[#00000066] text-sm mt-2"> 11.14 AM</Text>           
           
            </View>

        </View>

     
    </ScrollView>
<View className="px-2 py-5 bg-white flex-row justify-between items-center w-full">

        <TextInput
        placeholder="Write your comment..."
        className="p-2 w-[90%]"
        />
        <Send/>

        </View>
    

  </View>
  );
};

export default chat;
 