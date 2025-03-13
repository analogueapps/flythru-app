import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import React, { useEffect, useRef } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import images from "../../../constants/images";
import { StatusBar } from "expo-status-bar";
import SwipeButton from 'rn-swipe-button'; 
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Bell, ChevronLeft } from "lucide-react-native";
import { Calendar } from "lucide-react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import verticalline from "../../../assets/images/verticalline.png"
import { router } from "expo-router";
import dp from "../../../assets/images/dpfluthru.jpg"
import MapView, { Marker, Polyline } from "react-native-maps";
import useExpoLocation from "../../customhooks/useExpolocation";
import RBSheet from 'react-native-raw-bottom-sheet';
import Swiperarrow from "../../../assets/svgs/swiperarrow";
import mapimg from "../../../assets/images/mapimg.jpg"



const selectlocation = () => {
  const insets = useSafeAreaInsets();
    const locationrefRBSheet = useRef();
  const { longitude, latitude } = useExpoLocation();

  const handlelocation = () => {
    return (
      <RBSheet
        ref={locationrefRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        draggable={true}
        height={Dimensions.get("window").height / 2}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
        }}
      >
        <View className="p-3 rounded-2xl flex-col gap-y-6  w-[90%] m-auto">
          <View className="flex flex-row justify-between items-center my-7 gap-2">
            <View className="flex flex-row ">
              <Image
                source={dp}
                className="h-16 w-16 rounded-full mr-4"
                resizeMode="cover"
              />

              <View>
                <Text className=" text-3xl font-thin">Bat Man</Text>
                <Text>Dubai</Text>
              </View>
            </View>

            <View>
              <Text className="text-[#164F90] text-2xl font-bold">
                Total : ₹500
              </Text>
              <Text>05 May 2025 05:15 PM </Text>
            </View>
          </View>

        <View className="flex flex-row justify-start gap-x-5 items-center w-[90%] m-auto">

            <Image source={verticalline} className="h-36" resizeMode="contain" />

          <View className="flex-col gap-5">
            <View className="flex-col gap-3">
              <Text className="text-[#164F90] text-xl font-bold">Pick Up</Text>
              <Text className="text-lg">
                4372 Romano Street, Bedford, 01730
              </Text>
            </View>

            <View className="flex-col gap-3">
              <Text className="text-[#164F90] text-xl font-bold">Drop Off</Text>
              <Text className="text-lg">
                4372 Romano Street, Bedford, 01730
              </Text>
            </View>
          </View>

        </View>


          <View className="flex-1 h-[1px] w-[75%] mx-auto border-t  border-[#00000026] relative" />

          <View className="flex flex-row justify-center">
            <SwipeButton
              title="Swipe Right to Book"
              thumbIconBackgroundColor="#FFB648"
              thumbIconWidth={65}
              thumbIconBorderColor="#FFB800"
              thumbIconComponent={()=>(<AntDesign name="arrowright" size={24} color="black" />)}
           

              railBackgroundColor="white"
              railBorderColor="#A6A6A6"
              railFillBackgroundColor="#FFB800"
              railFillBorderColor="#FFB800"
                            titleColor="#000"
              titleFontSize={16}
              containerStyles={{
                width: "95%", // Ensure the button is wide enough
                alignSelf: "center", // Center it horizontally
              }}
              onSwipeSuccess={() => {
                // router.push("/activities/bookingdetails")
                router.push({
                    pathname: "/activities/bookingdetails",
                    params: { fromSelectLocation: true },  // Pass param here
                  });
                console.log("Booking Confirmed!");
                // Add any action on success here
              }}
            />
          </View>
        </View>
      </RBSheet>
    );
  };

  return (
    <View className="flex-1">
      {/* Header Background Image */}
      {handlelocation()}
     <View>
            <Image
              source={images.HeaderImg2}
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
        <View className="flex-row  items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-[rgba(255,255,255,0.8)] rounded-full p-1"
          >
            <ChevronLeft color="black" size={18} />
          </TouchableOpacity>
          <Text className="text-[18px] text-white ml-3" style={{fontFamily: "CenturyGothic"}}>Select Location</Text>
        </View>
      </View>
      <View className="bg-white self-center absolute top-36 z-10  p-6 rounded-2xl w-[90%] shadow-lg">

        <View className="flex-row my-2 items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
          <TextInput
            placeholder="Pick Up Location"
            className="flex-1 h-[30px]"
            placeholderTextColor="#2D2A29"
          />
<Ionicons name="search-outline" size={26} color="#194F90" className="bg-[#194F901A] p-2 rounded-xl"/>
        </View>
        

        <View className="flex-row my-2 items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
          <TextInput
            placeholder="Pick Up Time"
            className="flex-1 h-[30px]"
            placeholderTextColor="#2D2A29"
          />
        <MaterialCommunityIcons name="clock-outline" size={26} color="#194F90" className="bg-[#194F901A] p-2 rounded-xl"/>
        </View>

     
        <TouchableOpacity

onPress={() => locationrefRBSheet.current.open()}

className="bg-[#FFB800] rounded-lg py-4 mt-2"
        >
          <Text className="text-center text-black font-semibold text-base">
            Search
          </Text>
        </TouchableOpacity>
      </View>
      {/* Safe Area Content */}
      {/* <ScrollView className="flex-1" contentContainerStyle={{}}>
         

        

        </ScrollView> */}
      <View style={styles.mapContainer}>
        {/* <MapView
          style={styles.map}
      
        >
          {latitude && longitude && (
            <Marker coordinate={{ longitude: longitude, latitude: latitude }} />
          )}
        </MapView> */}

        <Image source={mapimg} className="h-full " />
      </View>

    </View>
  );
};

export default selectlocation;

const styles = StyleSheet.create({
  mapContainer: {
    flex:1,
    width: "100%",
    height: "60%",
    // marginTop: 0,
  },
  map: {
    width: "100%",
    height:"100%"
  },
});


  //   initialRegion={{
        //     latitude: 37.78825,
        //     longitude: -122.4324,
        //     latitudeDelta: 0.1,
        //     longitudeDelta: 0.1,
        //   }}