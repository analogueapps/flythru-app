import { View, Text, Image, TouchableOpacity, ScrollView, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import mail from "../../../assets/images/mail.png";
import call from "../../../assets/images/callicon2.png";
import whatsapp from "../../../assets/images/whatsapp.png";
import Rightarrow from "../../../assets/svgs/rightarrow";
import { CONTACT_US } from "../../network/apiCallers";

const ContactUs = () => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const fetchContacts = async () => {
    try {
      const res = await CONTACT_US();
      if (res?.data?.allContactUs?.length > 0) {
        const contact = res.data.allContactUs[0];
        setEmail(contact.email);
        setWhatsappNumber(contact.whatsapp);
        setContactNumber(contact.call);
        console.log("Contacts fetched:", contact);
      }
    } catch (error) {
      console.log("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  
  const handleEmailPress = () => {
    if (email) {
      Linking.openURL(`mailto:${email}`).catch((err) => 
        console.log("Error opening email:", err)
      );
    }
  };

  
  const handleWhatsappPress = () => {
    if (whatsappNumber) {
      Linking.openURL(`whatsapp://send?phone=${whatsappNumber}`).catch((err) => 
        console.log("Error opening WhatsApp:", err)
      );
    }
  };

  
  const handleCallPress = () => {
    if (contactNumber) {
      Linking.openURL(`tel:${contactNumber}`).catch((err) => 
        console.log("Error opening dialer:", err)
      );
    }
  };

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

      {/* Header */}
      <View
        style={{
          top: insets.top,
          zIndex: 1,
        }}
        className="p-6 absolute w-full "
      >
        <View className="flex-row items-center mt-5">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-[rgba(255,255,255,0.8)] rounded-full p-1"
          >
            <ChevronLeft color="black" size={18} />
          </TouchableOpacity>
          <Text
            className="text-[18px] text-white ml-3"
            style={{ fontFamily: "CenturyGothic" }}
          >
            Contact Us
          </Text>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>
        {/* Email */}
        <TouchableOpacity 
          className="flex-row justify-between items-center py-6"
          onPress={handleEmailPress}
        >
          <View className="flex-row items-center gap-4">
            <Image source={mail} className="h-8 w-8" resizeMode="contain" />
            <Text className="text-[#515151] text-xl">Send Mail</Text>
          </View>
          <Rightarrow />
        </TouchableOpacity>

        {/* WhatsApp */}
        <TouchableOpacity 
          className="flex-row justify-between items-center py-6"
          onPress={handleWhatsappPress}
        >
          <View className="flex-row items-center gap-4">
            <Image source={whatsapp} className="h-8 w-8" resizeMode="contain" />
            <Text className="text-[#515151] text-xl">Chat in WhatsApp</Text>
          </View>
          <Rightarrow />
        </TouchableOpacity>

        {/* Call */}
        <TouchableOpacity 
          className="flex-row justify-between items-center py-6"
          onPress={handleCallPress}
        >
          <View className="flex-row items-center gap-4">
            <Image source={call} className="h-8 w-8" resizeMode="contain" />
            <Text className="text-[#515151] text-xl">Call</Text>
          </View>
          <Rightarrow />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ContactUs;
