import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";
import { ALL_ADDRESS, DELETE_ADDRESS } from "../../../network/apiCallers";
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "react-native-toast-notifications";
import { langaugeContext } from "../../../customhooks/languageContext";
import Translations from "../../../language";

const Address = () => {
  const insets = useSafeAreaInsets();
  const [addresses, setAddresses] = useState([]);
  const toast = useToast()
  const { applanguage } = langaugeContext()


  // Fetch Addresses
  const fetchAddress = async () => {
    try {
      const res = await ALL_ADDRESS();
      console.log("Response address", res.data);

      if (res?.data?.addresses && Array.isArray(res.data.addresses)) {
        setAddresses(res.data.addresses);
      } else {
        console.log("Unexpected response format:", res);
        setAddresses([]);
      }
    } catch (error) {
      console.log("Error fetching addresses:", error);
      setAddresses([]);
    }
  };

  // Delete Address
  const deleteAddress = async (addressId) => {
    if (!addressId) {
      toast.show("Invalid address ID");
      return;
    }
  
    const token = await AsyncStorage.getItem('authToken');
    console.log("Token:", token);
  
    if (!token) {
      toast.show("No token found. Please log in.");
      return;
    }
  
    try {
      await DELETE_ADDRESS(addressId, token); // Pass addressId correctly
      console.log("Address deleted successfully");
  
      // Remove from state directly
      setAddresses((prev) => prev.filter((address) => address.id !== addressId));
  
      toast.show("Address deleted");
    } catch (error) {
      console.log("Error deleting address:", error.response?.data || error.message);
      toast.show("Failed to delete address");
    }
  };
  
  

  // Confirm Delete
  const handleDelete = (addressId) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => deleteAddress(addressId),
          style: "destructive",
        },
      ]
    );
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  return (
    <View className="flex-1">
      {/* Header Background Image */}
      <View>
        <Image
          source={images.HeaderImg}
          className="w-full h-auto" 
          style={{ resizeMode: "cover" }}
        />
      </View>

      {/* Header */}
      <View
        style={{
          top: insets.top,
          zIndex: 1,
        }}
        className="p-6 absolute w-full mt-5"
      >
        <View className="flex-row items-center ">
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
            {applanguage==="eng"?Translations.eng.address:Translations.arb.address
              }
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 15 }}>

      <TouchableOpacity onPress={() => router.push("/profile/addaddress")}>
          <Text className="text-[#164F90] font-bold text-right mx-5">
          {applanguage==="eng"?Translations.eng.add:Translations.arb.add
              } +
          </Text>
        </TouchableOpacity>

      {addresses.length > 0 ? (
  addresses.map((address, index) => {
    console.log("Address object:", address);


    return (
      <View 
        key={address?.id || index}  // Use address.id instead of _id
        className="w-full flex-col gap-5"
      >
        <View className="bg-white p-3 w-[90%] m-auto rounded-lg my-3 flex flex-row justify-between items-center">
          <View>
            <Text className="text-[#164F90] font-bold">
                {/* {applanguage==="eng"?Translations.eng.home:Translations.arb.home
              } */}
              Home</Text>
            <Text>{address.addressData}</Text>
          </View>
          <TouchableOpacity 
            onPress={() => {
              console.log("Deleting address ID:", address.id);
              if (address.id) handleDelete(address.id);
            }}
          >
            <AntDesign name="delete" size={19} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  })
) : (
  <Text className="text-center text-gray-500">No addresses found.</Text>
)}




        {/* Add Address Button */}
       
      </ScrollView>
    </View>
  );
};

export default Address;
