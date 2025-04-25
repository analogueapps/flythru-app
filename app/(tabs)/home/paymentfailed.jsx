import { View, Text, Image } from "react-native";
import React, { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import paysuccess from "../../../assets/images/paymentfailed.gif";
import { router } from "expo-router";

const paymentfailed = () => {
  const insets = useSafeAreaInsets();

    useEffect(() => {
      const timeout = setTimeout(() => {
        router.replace("/home");
      }, 3000); // 3 seconds
  
      return () => clearTimeout(timeout); // cleanup on unmount
    }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: insets.top,
        paddingBottom: insets.bottom,  
        paddingHorizontal: 20,
        backgroundColor: "#ffffff",
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
          textAlign: "center",
          color: "#000000", // green tone for success
        }}
      >
        Payment Failed
      </Text>

      <Image
        source={paysuccess}
        style={{
          width: 200,
          height: 200,
        }}
        resizeMode="contain"
      />
    </View>
  );
};

export default paymentfailed;
