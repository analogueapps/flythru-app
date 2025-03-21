import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from "react-native";
import React, { useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import dp from "../../../assets/images/dpfluthru.jpg"
import { Calendar } from "lucide-react-native";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";


const language = () => {

    const insets = useSafeAreaInsets();
    const [current, setCurrent] = useState("1");

  
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
                 <Text className="text-[18px] text-white ml-3" style={{fontFamily: "CenturyGothic"}}>Language</Text>
               </View>
      </View>
     
    </View>
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>

    <View className="p-5">

    <RadioButtonGroup
        containerStyle={{ marginBottom: 10 , display:"flex"}}
        selected={current}
        onSelected={(value) => setCurrent(value)}
        radioBackground="#4E4848"
      >
        <RadioButtonItem
               
          value="1"
          label={
            <Text style={{ color: "#181716" , fontSize:20 }}>English</Text>
          }
        />

        <View className="h-3"></View>

<RadioButtonItem
          value="2"
          label={
            <Text style={{ color: "#181716"  , fontSize:20 }}>Arabic</Text>
          }
        />
      </RadioButtonGroup>
        

    </View>
   
  
    </ScrollView>

    <TouchableOpacity className=" my-4  mx-12 bg-[#FFB800] rounded-xl py-4 mb-14 shadow-lg"
    onPress={() => router.push("/profile")}
    >
                <Text className="font-bold text-center text-black ">Save</Text>
              </TouchableOpacity>
  </View>
  );
};

export default language;
 