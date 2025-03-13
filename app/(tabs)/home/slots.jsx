import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Plus, Minus } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as Calendarpicker from 'expo-calendar';
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import PlaneIcon from "../../../assets/svgs/PlaneSvg";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { TextInput } from "react-native";

const slots = () => {
  const insets = useSafeAreaInsets();
  const [showDatePicker, setShowDatePicker] = useState(false);  // For Date Picker visibility
  const [selectedDate, setSelectedDate] = useState(""); 

  useEffect(() => {
      (async () => {
        const { status } = await Calendarpicker.requestCalendarPermissionsAsync();
        if (status === "granted") {
          const calendars = await Calendarpicker.getCalendarsAsync(Calendarpicker.EntityTypes.EVENT);
          // console.log("Here are all your calendars:", calendars);
        } else {
          Alert.alert("Permission required", "Calendar access is needed.");
        }
      })();
    }, []);
  
    const handleDateChange = (event, selectedDate) => {
      setShowDatePicker(false);
      if (selectedDate) {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        setSelectedDate(formattedDate);
        // formik.setFieldValue("departureDate", formattedDate); // Update formik state
      }
    };
    
    
  
    const createNewCalendar = async () => {
      try {
        const defaultCalendarSource = Platform.OS === 'ios'
          ? await Calendarpicker.getDefaultCalendarAsync()
          : { isLocalAccount: true, name: "Expo Calendar" };
  
        const newCalendarID = await Calendarpicker.createCalendarAsync({
          title: "Flight Schedules",
          color: "#FFB800",
          entityType: Calendarpicker.EntityTypes.EVENT,
          sourceId: defaultCalendarSource.id,
          source: defaultCalendarSource,
          name: "Flight Schedules",
          ownerAccount: "personal",
          accessLevel: Calendarpicker.CalendarAccessLevel.OWNER,
        });
  
        // console.log("New calendar ID:", newCalendarID);
      } catch (error) {
        console.log("Error creating calendar:", error);
      }
    };

   


  return (
    <View className="flex-1"> 
      {/* Header Background Image */}
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
          <Text className="text-[18px] text-white ml-3" style={{fontFamily: "CenturyGothic"}}>Select Slots</Text>
        </View>
        <View className="flex-row items-center justify-between px-4 mt-8">
          <View className="flex-col items-center">
            <Text className="text-2xl font-bold text-white">HYD</Text>
            <Text className="text-white">Hyderabad</Text>
          </View>
          <View className="flex-1 items-center px-2">
            <View className="w-full flex-row items-center justify-center ">
              <View className="flex-1 h-[1px] border-t border-dashed border-white relative">
                <View className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 px-2">
                  <PlaneIcon />
                </View>
              </View>
            </View>
          </View>
          <View className="flex-col items-center">
            <Text className="text-2xl font-bold text-white">DUB</Text>
            <Text className="text-white">Dubai</Text>
          </View>
        </View>
        <Text className="text-white text-center mt-4">Date : 05/05/2025</Text>
      </View>

       <View 
              className="bg-white self-center absolute top-[170px] p-6 z-10 rounded-xl w-[90%] shadow-lg"
              style={{
                maxHeight: "79%",
              }}
            >
              <ScrollView className="" showsVerticalScrollIndicator={false}>
              
              <Text className="font-bold text-xl text-[#164F90]" style={{fontFamily: "CenturyGothic"}}>Select Date</Text>
              <View className=" flex-row my-4 items-center border border-[#F2F2F2] rounded-xl px-4 py-3 bg-[#FBFBFB]">
                        <TextInput
                          placeholder="Pick Up Date"
                          className="flex-1 h-[30px]"
                          placeholderTextColor="#2D2A29"

                        />
                        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
<AntDesign name="calendar"

size={26} color="#194F90" className="bg-[#194F901A] p-2 rounded-xl"/>
                        </TouchableOpacity>

                        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

                        </View>

                        <Text className="font-bold text-xl text-[#164F90] " style={{fontFamily: "CenturyGothic"}}>Select Time</Text>
              <View className="flex-row my-4 items-center border border-[#F2F2F2] rounded-xl px-4 py-3 bg-[#FBFBFB]">
                        <TextInput
                          placeholder="Pick Up Time"
                          className="flex-1 h-[30px]"
                          placeholderTextColor="#2D2A29"
                        />

<MaterialCommunityIcons name="clock-outline" size={26} color="#194F90" className="bg-[#194F901A] p-2 rounded-xl"/>

                        </View>
      
                {/* Continue Button */}
      <TouchableOpacity className=" my-4 mx-4 bg-[#FFB800] rounded-xl py-4 shadow-lg mt-48"
                  onPress={() => {router.push("/home/selectlocation");
                    createNewCalendar();
                  }}
    
      >
        <Text className="text-center text-black font-semibold">Continue</Text>
      </TouchableOpacity>
               
              </ScrollView>
            </View>

       
    </View>
  );
};

export default slots;
