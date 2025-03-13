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


const addaddress = () => {

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
                 <Text className="text-[18px] text-white ml-3" style={{fontFamily: "CenturyGothic"}}>Add Address</Text>
               </View>
      </View>
     
    </View>
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>

        <View className="w-full flex-col gap-5">
            <View className="bg-white p-3 w-[90%] m-auto rounded-lg">
                <Text className="text-[#164F90] font-bold">Home</Text>
            <Text>This is a message sent by the priya. You were invited to the event of her birthday!</Text> 
            </View>

            <View className="bg-white p-3  w-[90%] m-auto rounded-lg">
            <Text className="text-[#164F90] font-bold">Home2</Text>

            <Text>This is a message sent by the priya. You were invited to the event of her birthday!</Text> 
           
            </View>

            <Text className="text-[#164F90] font-bold text-right mx-5">Add +</Text>

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

export default addaddress;
 