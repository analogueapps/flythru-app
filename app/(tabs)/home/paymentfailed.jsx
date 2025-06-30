import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import paysuccess from "../../../assets/images/paymentfailed.gif";
import { router } from "expo-router";
import { langaugeContext } from "../../../customhooks/languageContext";
import Translations from "../../../language";

const Paymentfailed = () => {
  const insets = useSafeAreaInsets();
  const { applanguage } = langaugeContext()
 const timeoutRef = useRef(null);
    useEffect(() => {
       timeoutRef.current  = setTimeout(() => {
        router.replace("/home");
      }, 6000); // 3 seconds
  
      return () => clearTimeout(timeoutRef.current ); // cleanup on unmount
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
                { applanguage === "eng" ? Translations.eng.paymentfail_message1 : Translations.arb.paymentfail_message1}

      </Text>

      <Image
        source={paysuccess}
        style={{
          width: 200,
          height: 200,
        }}
        resizeMode="contain"
      />

      <View className="text-center">
        <Text className="self-center font-semibold">{
                    applanguage === "eng" ? Translations.eng.paymentfail_message2 : Translations.arb.paymentfail_message2
                  }</Text>
        <TouchableOpacity onPress={()=>router.replace('profile/contactus')}>

        <Text className="self-center text-blue-800 font-bold">{
                    applanguage === "eng" ? Translations.eng.contact_us2 : Translations.arb.contact_us2
                  }</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Paymentfailed;
