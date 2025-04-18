import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import filledstar from "../../../assets/images/filledstar.png"
import emptystar from "../../../assets/images/emptystar.png"
import { Calendar } from "lucide-react-native";
import Filledstar from "../../../assets/svgs/filledstar";
import Emptystar from "../../../assets/svgs/emptystar";
import { FEEDBACK } from "../../../network/apiCallers";
import { useFormik } from "formik";
import { useToast } from "react-native-toast-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { langaugeContext } from "../../../customhooks/languageContext";
import Translations from "../../../language";
import feedbackSchema from "../../../yupschema/feedbackSchema";


const feedback = () => {

    const insets = useSafeAreaInsets();
    const [selectedStars, setSelectedStars] = useState(0); 
    const toast = useToast()
    const { applanguage } = langaugeContext()
    const [userName, setUserName] = useState('');



    // Function to update stars based on user click
    const handleStarPress = (index) => {
      const rating = index + 1;
      setSelectedStars(rating);
      formik.setFieldValue("ratingStars", rating);
    };
    
    

    const formik = useFormik({
      initialValues: {
        ratingStars: 0, 
        comment: "",
      },
      validationSchema: feedbackSchema(applanguage),
      validateOnChange: true,
      validateOnBlur: true,
      onSubmit: async (values) => {
      
        values.ratingStars = selectedStars || 0;
        console.log("Submitting values:", values); 
        await handleFeedback(values);
      },
    });
    

    const handleFeedback = async (values) => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          toast.show("No token found. Please log in."); 
          return;
        }
    
        const res = await FEEDBACK(values, token);
        console.log("Feedback sent successfully", res.data.message);
        toast.show(res.data.message);
        router.push("/profile");
      } catch (error) {
        console.log("Error:", error);
        toast.show(error?.response?.data?.message || "Failed to submit feedback");
      }
    };
    
    const getUserName = async () => {
      try {
        const name = await AsyncStorage.getItem('user_name');
        if (name !== null) {
          console.log('Retrieved user name:', name);
          return name;
        } else {
          console.log('No user name found.');
          return '';
        }
      } catch (error) {
        console.error('Failed to retrieve the user name:', error);
        return '';
      }
    };
    useEffect(() => {
      // if (!token) {
      //   // If not logged in, clear fields
      //   setUserName("")
      //   return;
      // }
      const fetchUserName = async () => {
          const name = await getUserName();
          setUserName(name);
      };
      fetchUserName();
  }, []);
  
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
                 <Text className="text-[18px] text-white ml-3" style={{fontFamily: "CenturyGothic"}}>{applanguage==="eng"?Translations.eng.feedback:Translations.arb.feedback
              }</Text>
               </View>
      </View>
     
    </View>
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>

      <View className="px-7 flex-col gap-8">
        <View className="flex flex-row justify-between items-center">
        <Text className="font-bold text-[#050505] text-2xl">Rate</Text>
        <View className="flex-row my-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <TouchableOpacity key={index} onPress={() => handleStarPress(index)}>
                {index < formik.values.ratingStars ? (
                    <Image source={filledstar} className="h-7 w-7" resizeMode="contain"/>
) : (
                    <Image source={emptystar} className="h-7 w-7" resizeMode="contain"/>
)}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Text className="text-[#40464C] text-lg">{applanguage==="eng"?Translations.eng.write_feedback:Translations.arb.write_feedback
              }</Text>
        <TextInput
    numberOfLines={10}
    onChangeText={formik.handleChange("comment")}
                 onBlur={formik.handleBlur("comment")}
                 value={formik.values.comment}
    className="bg-white rounded-lg p-3"
    placeholder={
      applanguage === "eng"
        ? Translations.eng.type_here
        : Translations.arb.type_here
    }
    textAlignVertical="top"  
    placeholderTextColor={"#1A1C1E"}
/>

{formik.touched.comment && formik.errors.comment && (
                  <Text className="text-red-500">{formik.errors.comment}</Text>
                )}
      </View>
     
    </ScrollView>
    <TouchableOpacity className=" my-4  mx-12 bg-[#FFB800] rounded-xl py-4 mb-14"
    onPress={formik.handleSubmit}
    >
                <Text className="font-bold text-center text-black ">{applanguage==="eng"?Translations.eng.submit:Translations.arb.submit
              }</Text>
              </TouchableOpacity>
  </View>
  );
};

export default feedback;
 