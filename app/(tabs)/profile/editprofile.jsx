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


const editprofile = () => {

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
                 <Text className="text-[18px] text-white ml-3" style={{fontFamily: "CenturyGothic"}}>Edit Profile</Text>
               </View>
      </View>
     
    </View>
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>

      <View className="px-7 flex-col gap-y-4">

        <View className="mb-2">

        <Text className="text-[#40464C] text-lg">Name</Text>
        <TextInput
    className=" rounded-lg p-3 border-2 border-[#8B8B8B]"
    placeholder="Enter Name"
    placeholderTextColor={"#1A1C1E"}
    value="Nike"
/>

    </View>

    <View className="mb-2">

<Text className="text-[#40464C] text-lg">Email Id</Text>
        <TextInput
    className=" rounded-lg p-3 border-2 border-[#8B8B8B]"
    placeholder="Enter Email Id"
    placeholderTextColor={"#1A1C1E"}
    value="nike@gmail.com"
/>

    </View>

    <View className="mb-2">

<Text className="text-[#40464C] text-lg">Phone Number</Text>
        <TextInput
    className=" rounded-lg p-3 border-2 border-[#8B8B8B]"
    placeholder="Enter Phone Number"
    placeholderTextColor={"#1A1C1E"}
    value="894 521 896 258"
/>

    </View>
      </View>
     
    </ScrollView>

    <TouchableOpacity className=" my-4  mx-12 bg-[#FFB800] rounded-xl py-4 mb-14"
    onPress={() => router.push("/profile")}>
            <Text className="font-bold text-center text-black ">Save</Text>
          </TouchableOpacity>
  </View>
  );
};

export default editprofile;
 