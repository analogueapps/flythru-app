import { View, Text } from "react-native";
import React, { useEffect } from "react";
import SvgActivities from "../assets/svgs/bottomTabs/Activities";
import { Redirect, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Index = () => {
  // useEffect(()=>{
  //     async function checkToken() {
  //       const token = await AsyncStorage.getItem("authToken")
  //       if ( token){
  //           router.replace("/home/slots")
  //       }
  //       else{
  //         router.replace("/(auth)")
  //       }
  //     }
  //     checkToken()
  // },[])

  return (
   
    <View>
      <Redirect href={"/(auth)"} />
    </View>
  );
};
export default Index;
