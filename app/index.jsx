import { View, Text } from "react-native";
import React, { useEffect } from "react";
import SvgActivities from "../assets/svgs/bottomTabs/Activities";
import { Redirect, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNetwork } from "../UseContext/NetworkContext";


const Index = () => {
  // const {isConnected}=useNetwork()
  // useEffect(()=>{
  //     async function checkToken() {
  //       const token = await AsyncStorage.getItem("authToken")
  //       console.log("connected value",isConnected)
  //       if(!isConnected)
  //       {
  //         router.push("/nointernet")
  //       }
  //       else if ( token){
  //           router.replace("/home")
  //       }
  //       else{
  //         router.replace("/(auth)")
  //       }
  //     }
  //     checkToken()
  // },[isConnected])

  return (
   
    <View>
      <Redirect href={"/(auth)"} />
    </View>
  );
};
export default Index;
