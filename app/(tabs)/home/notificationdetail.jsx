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
import { langaugeContext } from "../../../customhooks/languageContext";
import Translations from "../../../language";


const notificationdetail = () => {

    const insets = useSafeAreaInsets();
    const { applanguage } = langaugeContext()

  
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
                 <Text className="text-[18px] text-white ml-3" style={{fontFamily: "CenturyGothic"}}>  {applanguage==="eng"?Translations.eng.notification:Translations.arb.notification
              }</Text>
               </View>
      </View>
     
    </View>
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>

        <View className="bg-white p-5 mx-7 rounded-lg">
            <Text className="text-[#1D030099] font-thin text-lg">Your Baggage has been delivered all QR Code is verified. You can confirm from your end to Close the trip. You can use below button to close the trip by verifying your bag once you reached the airpoort.</Text>
             {/* <TouchableOpacity className=" my-4 mx-4 bg-[#FFB800] rounded-xl py-4 mb-3">
                    <Text className="text-center text-black font-bold text-lg">Close the Trip</Text>
                  </TouchableOpacity> */}
                    <Text className="text-[#00000033] text-right">11.14 AM</Text>
        </View>

   
  
    </ScrollView>
  </View>
  );
};

export default notificationdetail;
 