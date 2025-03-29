import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from "react-native";
import React, { useEffect } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import dp from "../../../assets/images/dpfluthru.jpg"
import { Calendar } from "lucide-react-native";
import { useAuth } from "../../../UseContext/AuthContext";
import { EDIT_PROFILE } from "../../../network/apiCallers";
import { useToast } from "react-native-toast-notifications";
import { useFormik } from "formik";
import { langaugeContext } from "../../../customhooks/languageContext";
import Translations from "../../../language";
import editprofileSchema from "../../../yupschema/editProfileSchema";


const editprofile = () => {

    const insets = useSafeAreaInsets();
    const toast = useToast()
    const { applanguage } = langaugeContext()


    const { userEmail } = useAuth();
    console.log("userEmailaaaaaaaaaa" , userEmail)

    const formik = useFormik({
      initialValues: {
        name: "",
        email: userEmail || "",
        phoneNumber: "",
      },
      enableReinitialize: true, // ✅ Ensure reinitialization when values change
      validationSchema: editprofileSchema(applanguage),
      validateOnChange: true,
      validateOnBlur: true,
      onSubmit: async (values) => {
        console.log("values submitted edit profile:", values);
        await editprofilehandler(values);
        router.push("/profile");
      },
    });
    
    useEffect(() => {
      if (userEmail) {
        console.log("userEmail:", userEmail);
        formik.setFieldValue("email", userEmail); // ✅ Set email value after userEmail is available
      }
    }, [userEmail]);
    

    const editprofilehandler = async (values) => {

      const token = await AsyncStorage.getItem('authToken');
          if (!token) {
            toast.show("No token found. Please log in.");
            return;
          }
  
      try {
        const res = await EDIT_PROFILE(values , token); 
        console.log(res.data.message);
        toast.show(res.data.message)
      } catch (error) {
        console.log("Error sending code:", error?.response);
      }
    };

    useEffect(()=>{
      
    },[])

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

      <View className="flex-row  items-center mt-5">
       
       <View className="flex-row  items-center ">
                 <TouchableOpacity
                   onPress={() => router.back()}
                   className="bg-[rgba(255,255,255,0.8)] rounded-full p-1"
                 >
                   <ChevronLeft color="black" size={18} />
                 </TouchableOpacity>
                 <Text className="text-[18px] text-white ml-3" style={{fontFamily: "CenturyGothic"}}> {
                applanguage==="eng"?Translations.eng.edit_profile:Translations.arb.edit_profile
              }</Text>
               </View>
      </View>
     
    </View>
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>

      <View className="px-7 flex-col gap-y-4">

        <View className="mb-2">

        <Text className="text-[#40464C] text-lg font-bold"> {
                applanguage==="eng"?Translations.eng.name:Translations.arb.name
              }</Text>
        <TextInput
    className=" rounded-lg p-3 border-2 border-[#8B8B8B]"
    placeholder={
      applanguage === "eng"
        ? Translations.eng.name_placeholder
        : Translations.arb.name_placeholder
    }
    onChangeText={formik.handleChange("name")}
    onBlur={formik.handleBlur("name")}
    value={formik.values.name.trimStart()}
    placeholderTextColor={"#1A1C1E"}
/>
{formik.touched.name && formik.errors.name && (
                  <Text className="text-red-500">{formik.errors.name}</Text>
                )}


    </View>

    <View className="mb-2">

<Text className="text-[#40464C] text-lg font-bold"> {
                applanguage==="eng"?Translations.eng.email_id:Translations.arb.email_id
              }</Text>
        <TextInput
    className=" rounded-lg p-3 border-2 border-[#8B8B8B]"
    placeholder={
      applanguage === "eng"
        ? Translations.eng.email_placeholder
        : Translations.arb.email_placeholder
    }    onChangeText={formik.handleChange("email")}
    onBlur={formik.handleBlur("email")}
    placeholderTextColor={"#1A1C1E"}
    value={formik.values.email}
    editable={false}
/>
{formik.touched.email && formik.errors.email && (
                  <Text className="text-red-500">{formik.errors.email}</Text>
                )}
    </View>

    <View className="mb-2">

<Text className="text-[#40464C] text-lg font-bold"> {
                applanguage==="eng"?Translations.eng.phone_number:Translations.arb.phone_number
              }</Text>
        <TextInput
    className=" rounded-lg p-3 border-2 border-[#8B8B8B]"
    placeholder={
      applanguage === "eng"
        ? Translations.eng.phone_placeholder
        : Translations.arb.phone_placeholder
    }
    onChangeText={formik.handleChange("phoneNumber")}
    onBlur={formik.handleBlur("phoneNumber")}
    value={formik.values.phoneNumber}
    placeholderTextColor={"#1A1C1E"}
/>
{formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <Text className="text-red-500">{formik.errors.phoneNumber}</Text>
                )}

    </View>
      </View>
     
    </ScrollView>

    <TouchableOpacity className=" my-4  mx-12 bg-[#FFB800] rounded-xl py-4 mb-14"
    onPress={() => formik.handleSubmit()}>
            <Text className="font-bold text-center text-black "> {
                applanguage==="eng"?Translations.eng.save:Translations.arb.save
              }</Text>
          </TouchableOpacity>
  </View>
  );
};

export default editprofile;
 