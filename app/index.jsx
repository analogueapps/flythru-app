import { View, Text } from "react-native";
import React from "react";
import SvgActivities from "../assets/svgs/bottomTabs/Activities";
import { Redirect } from "expo-router";


const Index = () => {
  return (
   
    <View>
      <Redirect href={"/(auth)"} />
    </View>
  );
};
export default Index;
