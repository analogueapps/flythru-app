import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { router, useFocusEffect } from "expo-router";
import { ALL_ADDRESS, DELETE_ADDRESS } from "../../../network/apiCallers";
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { langaugeContext } from "../../../customhooks/languageContext";
import Translations from "../../../language";
import { ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
const Address = () => {
  const insets = useSafeAreaInsets();
  const [addresses, setAddresses] = useState([]);
  const { applanguage } = langaugeContext()
  const [loading, setLoading] = useState(true);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  // Fetch Addresses
  const fetchAddress = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('authToken');

    if (!token) {
      // Toast.show("No token found. Please log in.");
      Toast.show({
        type: "info",

        text1: "Please login to add address",
      });
      return;
    }

    try {
      const res = await ALL_ADDRESS(token);
     

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
    finally {
      setLoading(false);
    }
  };

  // Delete Address
  const deleteAddress = async (addressId) => {
    if (!addressId) {
      Toast.show({
        type: "info",

        text1: "Invalid address ID",
      });
      return;
    }

    const token = await AsyncStorage.getItem('authToken');
    console.log("Token:", token);

    if (!token) {
      Toast.show({
        type: "info",

        text1: "Please login to add address",
      });
      return;
    }

    try {
      await DELETE_ADDRESS(addressId, token); // Pass addressId correctly
      console.log("Address deleted successfully");

      // Remove from state directly
      setAddresses((prev) => prev.filter((address) => address.id !== addressId));

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Address deleted",
      });
    } catch (error) {
      console.log("Error deleting address:", error.response?.data || error.message);
      Toast.show("Failed to delete address");
      Toast.show({
        type: "info",

        text1: error?.response?.data?.message || "Failed to delete address",
      });
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

  useFocusEffect(
    useCallback(() => {
      fetchAddress();
    }, [])
  );


const [selectedId, setSelectedId] = useState(null);
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
            {applanguage === "eng" ? Translations.eng.address : Translations.arb.address
            }
          </Text>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#164F90" />
        </View>
      ) : (
        <ScrollView className="flex-1" contentContainerStyle={{ paddingVertical: 15 }}>
          {/* <Text className="text-[#164F90] font-bold text-right mx-5"style={{ fontFamily: "Lato" }}>
        {applanguage === "eng" ? Translations.eng.add : Translations.arb.add} +
        </Text> */}
          <View className="flex flex-row justify-end">
            <TouchableOpacity style={{
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.50,
              shadowRadius: 3.84,
            }} className="mb-2" onPress={() => router.push("/profile/addaddress")}>

              <Text className="text-[#164F90] bg-[#194F901A] font-bold text-right p-2 rounded-md  mx-5" style={{ fontFamily: "Lato" }}>
                {applanguage === "eng" ? Translations.eng.addnewAddress : Translations.arb.addnewAddress}
              </Text>
            </TouchableOpacity>
          </View>

          {addresses.length > 0 ? (
            addresses.map((address, index) => (
              <View key={address?.id || index} className="w-full flex-col gap-5">
                <View className="bg-white p-3 w-[90%] m-auto rounded-lg my-3 flex flex-row justify-between items-center">
                  <View className="flex-row items-center justify-between gap-3">

                    <View>
                      {/* <Text className="text-[#164F90] font-bold" style={{ fontFamily: "Lato" }}>Home</Text> */}
                     {address.default===true &&<Text className="text-gray-500 text-[11px]">Default Address</Text>}
                      <Text className="w-72 text-[#164F90] font-bold text-[15px]" style={{ fontFamily: "Lato" }}>{address.addressName || "Address"}</Text>
                      <Text className="text-[12px] " style={{ fontFamily: "Lato" }}>{address.area}</Text>
                    </View>
                    {/* <TouchableOpacity onPress={() => address.id && handleDelete(address.id)}>
              <AntDesign name="delete" size={19} color="red" />
            </TouchableOpacity> */}
                    <TouchableOpacity onPress={() =>{console.log("VGbhnjm",address); router.push({ pathname: "/profile/updateaddress", params:{ address:JSON.stringify(address) }})}}>
                      {/* <AntDesign name="delete" size={19} color="red" /> */}
                      <AntDesign name="edit" size={19} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text className="text-center text-gray-500" style={{ fontFamily: "Lato" }}>
              {applanguage === "eng"
                ? Translations.eng.no_address_found
                : Translations.arb.no_address_found}
            </Text>
          )}
        </ScrollView>
      )}

    </View>
  );
};

export default Address;
