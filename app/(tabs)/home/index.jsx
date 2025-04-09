import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Platform,
} from "react-native";
import * as Calendarpicker from "expo-calendar";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import images from "../../../constants/images";
import { StatusBar } from "expo-status-bar";
import { Bell } from "lucide-react-native";
import ad from "../../../assets/images/adbanner.png";
import { Calendar } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker"; // Import DateTimePicker
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import { ALL_BANNERS, ALL_FLIGHTS } from "../../../network/apiCallers";
import { useFormik } from "formik";
import { useToast } from "react-native-toast-notifications";
import { langaugeContext } from "../../../customhooks/languageContext";
import Translations from "../../../language";
import { AllflightSchema } from "../../../yupschema/allFlightSchema";


const Index = () => {
  const insets = useSafeAreaInsets();
  const [showDatePicker, setShowDatePicker] = useState(false); // For Date Picker visibility
  const [selectedDate, setSelectedDate] = useState("");
  const [banners, setBanners] = useState([]);
  const toast = useToast();
  const { applanguage } = langaugeContext()


  useEffect(() => {
    (async () => {
      const { status } = await Calendarpicker.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendarpicker.getCalendarsAsync(
          Calendarpicker.EntityTypes.EVENT
        );
        // console.log("Here are all your calendars:", calendars);
      } else {
        Alert.alert("Permission required", "Calendar access is needed.");
      }
    })();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setSelectedDate(formattedDate);
      formik.setFieldValue("departureDate", formattedDate); // Update formik state
    }
  };

  const createNewCalendar = async () => {
    try {
      const defaultCalendarSource =
        Platform.OS === "ios"
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
 
  const formik = useFormik({
    initialValues: {
      departureDate: "",
      flightNumber: "",
      city:"PPI",
      airPortName:""
    },
    validationSchema: AllflightSchema(applanguage),
    validateOnChange: false, // Disable auto-validation on change
    validateOnBlur: false,   // Disable auto-validation on blur
    onSubmit: async (values) => {
      console.log("Submitting values:", values);
      router.push({
        pathname: "/home/search",
        params: {
          departureDate: values.departureDate,
          flightNumber: values.flightNumber,
          city:values.city,
          airPortName:values.airPortName
        },
      });
    },
  });
  

  const allbanners = async () => {
    try {
      const res = await ALL_BANNERS();
      console.log("API Response:", res);

      if (res?.data?.allBanners && Array.isArray(res.data.allBanners)) {
        setBanners(res.data.allBanners);
      } else {
        console.log("Unexpected response format:", res.data);
        setBanners([]);
      }
    } catch (error) {
      console.log("Error fetching banners:", error);
      setBanners([]);
    }
  };

  useEffect(() => {
    allbanners();
  }, []);

  
  return (
    <View className="flex-1">
      {/* Header Background Image */}
      <View>
        <Image
          source={images.HeroHeader}
          className="w-full h-auto relative"
          style={{ resizeMode: "cover" }} // Ensure the image fits nicely
        />
      </View>
      <View
        style={{
          top: insets.top,
          zIndex: 1,
          // height: 90,

          // backgroundColor: "green", // Transparent background
        }}
        className="flex-row justify-between items-center p-6 absolute w-full"
      >
        <Image
          source={images.whiteLogo}
          className="w-[100px] h-[30px]"
          resizeMode="contain"
        />
        <TouchableOpacity
          className="bg-white rounded-full p-2"
          onPress={() => router.push("/home/notification")}
        >
          <Bell color="black" size={18} />
        </TouchableOpacity>
      </View>
      <View className="bg-white self-center absolute top-36 z-10  p-6 rounded-2xl w-[90%] shadow-lg">
        <View className="flex-row my-2 items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
          <TextInput
          placeholder={
            applanguage === "eng"
              ? Translations.eng.select_date
              : Translations.arb.select_date
          }   
            onChangeText={formik.handleChange("departureDate")}
            onBlur={formik.handleBlur("departureDate")}
            value={formik.values.departureDate}
            name="departureDate"
            className="flex-1 h-[30px]"
            placeholderTextColor="#2D2A29"
          />
          <TouchableOpacity
            className=""
            onPress={() => {setShowDatePicker(true);
              console.log("calender pressed")
            }}
          > 
            <Calendar size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
          value={selectedDate ? new Date(selectedDate) : new Date()} // Ensure it has a valid date
          mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <TextInput
          placeholder={
            applanguage === "eng"
              ? Translations.eng.enter_flight_number
              : Translations.arb.enter_flight_number
          }   
          onChangeText={formik.handleChange("flightNumber")}
          onBlur={formik.handleBlur("flightNumber")}
          value={formik.values.flightNumber}
          name="flightNumber"
          className="border h-[50px] border-gray-300 my-2 rounded-xl px-4 py-3 bg-gray-50"
          placeholderTextColor="#2D2A29"
        />

<TextInput
          placeholder={
            applanguage === "eng"
              ? Translations.eng.enterairportname
              : Translations.arb.enterairportname
          }   
          onChangeText={formik.handleChange("airPortName")}
          onBlur={formik.handleBlur("airPortName")}
          value={formik.values.airPortName}
          name="airPortName"
          className="border h-[50px] border-gray-300 my-2 rounded-xl px-4 py-3 bg-gray-50"
          placeholderTextColor="#2D2A29"
        />

<TextInput
          placeholder={
            applanguage === "eng"
              ? Translations.eng.entercity
              : Translations.arb.entercity
          }   
          onChangeText={formik.handleChange("city")}
          onBlur={formik.handleBlur("city")}
          value={formik.values.city}
          name="city"
          className="border h-[50px] border-gray-300 my-2 rounded-xl px-4 py-3 bg-gray-50"
          placeholderTextColor="#2D2A29"
        />
        <TouchableOpacity
       onPress={async () => {
        await formik.validateForm(); // Validate form
        const { departureDate, flightNumber , airPortName , city } = formik.values;
    
        if (!departureDate && !flightNumber && !airPortName && !city) {
          formik.setErrors({
            departureDate: "Please fill at least one field",
            flightNumber: "Please fill at least one field",
            airPortName: "Please fill at least one field",
            city: "Please fill at least one field"
          });
          toast.show("Please fill in at least one field");
        } else {
          formik.handleSubmit();
          createNewCalendar();
        }
      }}
          className="bg-[#FFB800] rounded-lg py-4 mt-2 shadow-lg "
        >
          <Text className="text-center text-black font-semibold text-base">
          {  applanguage==="eng"?Translations.eng.search:Translations.arb.search
                          }
          </Text>
        </TouchableOpacity>
      </View>
      {/* Safe Area Content */}
      <ScrollView className="flex-1" contentContainerStyle={{}}>
        <View className="flex-1 items-center justify-center mt-42 mx-6">
          {/* Ad Card */}
          <Text className="text-[#003C71] my-4 font-bold text-[16px] self-start">
             {  applanguage==="eng"?Translations.eng.ad:Translations.arb.ad
                          }
          </Text>
          {/* Your existing colored boxes */}
          <View className="w-full mx-4 mb-3 rounded-xl">
            {Array.isArray(banners) && banners.length > 0 ? (
              banners.map((banner, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => banner.link && Linking.openURL(banner.link)} // Open link if exists
                >
                  <Image
                    source={{
                      uri: `http://flythru.net/${banner?.bannerPicture}`,
                    }} // Use full URL
                    className="h-[100px] w-full mb-3 rounded-xl"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))
            ) : (
              <Text className="text-center text-gray-500">
                No banners available
              </Text> // Placeholder if empty
            )}
          </View>

          {/* <Text className="text-[#164F90] my-4 font-bold text-[16px] self-start">
            Today Active Flights
          </Text> */}
          {/* Flight Card */}
          {/* {Array.from({ length: 5 }).map((_, index) => (
            <View
              key={index}
              className="bg-white w-full  rounded-xl shadow-md border border-gray-100 mb-3"
            >
              <View className="flex-row items-start  py-6 px-4 ">
                <TempAirWaysLogo />
                <View className=" ml-2 flex flex-col items-start gap-y-1">
                  <Text className="text-gray-600">Turkish AIRWAYS</Text>
                  <Text className="text-[#164F90]">582041B</Text>
                </View>
              </View>
              <View className="flex-1 h-[1px] border-t border-dashed border-[#cdcdcd] relative" />
              <View className="flex-row justify-between items-center py-6 px-5">
                <View>
                  <Text className="text-2xl font-bold text-[#003C71]">
                    14:30
                  </Text>
                  <Text className="text-gray-500">HYD</Text>
                </View>
                <View className="flex-1 items-center">
                  <View className="w-full flex-row items-center justify-center mt-6">
                    <View className="flex-1 h-[1px] border-t border-dashed border-[#164F90] relative">
                      <View className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white px-2">
                        <FontAwesome5 name="plane" size={16} color="#164F90" />
                      </View>
                    </View>
                    
                  </View>
                  <Text className="text-gray-500 text-sm mt-3">5h30m</Text>
                </View>
                <View>
                  <Text className="text-2xl font-bold text-[#003C71]">
                    20:00
                  </Text>
                  <Text className="text-gray-500 self-end">DUB</Text>
                </View>
              </View>
            </View>
          ))} */}
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;
