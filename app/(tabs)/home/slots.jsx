import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Plus, Minus } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as Calendarpicker from "expo-calendar";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import PlaneIcon from "../../../assets/svgs/PlaneSvg";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { TextInput } from "react-native";
import { useFormik } from "formik";
import { SelectList } from "react-native-dropdown-select-list";
import {  ALL_SLOTS, ALL_TIME_SLOTS } from "../../../network/apiCallers";
import { langaugeContext } from "../../../customhooks/languageContext";
import Translations from "../../../language";
import slotsSchema from "../../../yupschema/slotsSchema";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useFlightContext } from "../../../UseContext/useFlightContext";

const slots = () => {
  const insets = useSafeAreaInsets();
  const [showDatePicker, setShowDatePicker] = useState(false); // For Date Picker visibility
  const [selectedDate, setSelectedDate] = useState("");
  const [selected, setSelected] = React.useState("");
  const [filteredSlotTimes, setFilteredSlotTimes] = useState([]);
  const [timeslot, setTimeslots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterTimeSlot, setFilterTimeSlot] = useState([]);
  const { flightData, departureDate, departureTime } = useLocalSearchParams();

  const flight = JSON.parse(flightData);
  // const { departureDate } = useFlightContext();
  // const time=flight?.departure?.scheduled

  
  // const time =
  //   flight?.departure?.scheduled && flight.departure.scheduled.includes("T")
  //     ? `${flight.departure.scheduled.split("T")[1].split(":")[0]}:${
  //         flight.departure.scheduled.split("T")[1].split(":")[1].split(".")[0]
  //       } `
  //     : flight.departure.scheduled;



  const [depDate, setdepDate] = useState("");
  const { applanguage } = langaugeContext();
  const { personsCount, baggageCount } = useLocalSearchParams();

  useEffect(() =>{
    console.log(flight, "flight data in slots page");
    
  },[])

  const parsedPersonsCount = personsCount ? parseInt(personsCount) : 0;
  const parsedBaggageCount = baggageCount ? parseInt(baggageCount) : 0;

  useEffect(() => {
    if (departureDate) {
      const parsedDepartureDate = new Date(departureDate);
      if (!isNaN(parsedDepartureDate.getTime())) {
        setdepDate(parsedDepartureDate);
      } else {
        console.error("Invalid departureDate format:", departureDate);
      }
    }
  }, [departureDate]);


  const formik = useFormik({
    initialValues: {
      departureDate: "",
      departureTime: "",
    },
    // validationSchema: slotsSchema(applanguage),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      console.log("✔ Submitting", values);

      router.push({
        pathname: "/home/selectlocation",
        params: {
          date: values.departureDate,
          time: values.departureTime,
          personsCount,
          baggageCount,
        },
      });
    },
  });

  const alltimeslots = async (departureDate, departureTime) => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.warn("No auth token found.");
        return;
      }
      console.log("/////////////", departureDate, departureTime);

      // ✅ Pass correct data to API
      const data={ departureDate, departureTime }
      const res = await ALL_SLOTS(data, token);

      const rawSlots = res?.data?.slots;

      if (rawSlots && typeof rawSlots === "object") {

       const formattedSlots = Object.entries(rawSlots).map(([date, times]) => ({
  date,
  times: times.map((slot) => ({
    time: slot.Time,
    available: slot.available,
  })),
}));


        setFilterTimeSlot(formattedSlots);
      } else {
        setFilterTimeSlot([]);
      }
    } catch (error) {
      console.log(
        "Error fetching timeslots:",
        error?.response || error.message
      );
      setFilterTimeSlot([]);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (departureDate && departureTime) {
    alltimeslots(departureDate, departureTime);
    console.log(departureTime, "departureTime//////////////slots/////");
    console.log(departureDate, "departureDate////////////");
  }
}, [departureDate, departureTime]); // <== Add them as dependencies


  // const alltimeslots = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await ALL_TIME_SLOTS();

  //     if (res?.data?.allTimeSlots) {
  //       const slotData = res.data.allTimeSlots;

  //       // Group by createdAt date
  //       const grouped = slotData.reduce((acc, curr) => {
  //         const date = new Date(curr.createdAt).toLocaleDateString("en-CA"); // e.g., "2025-05-29"

  //         if (!acc[date]) {
  //           acc[date] = [];
  //         }
  //         acc[date].push(curr.timeSlot);
  //         return acc;
  //       }, {}); // removed TypeScript type assertion here ✅

  //       const formattedSlots = Object.keys(grouped).map((date) => ({
  //         date,
  //         times: grouped[date],
  //       }));

  //       setFilterTimeSlot(formattedSlots);
  //     } else {
  //       setFilterTimeSlot([]);
  //     }
  //   } catch (error) {
  //     console.log("Error fetching timeslots:", error);
  //     setFilterTimeSlot([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //  const alltimeslots = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await ALL_SLOTS();

  //       if (res?.data?.allTimeSlots) {
  //         const slotData = res.data.allTimeSlots;

  //         // Group by createdAt date
  //         const grouped = slotData.reduce((acc, curr) => {
  //           const date = new Date(curr.createdAt).toLocaleDateString("en-CA"); // e.g., "2025-05-29"

  //           if (!acc[date]) {
  //             acc[date] = [];
  //           }
  //           acc[date].push(curr.timeSlot);
  //           return acc;
  //         }, {}); // removed TypeScript type assertion here ✅

  //         const formattedSlots = Object.keys(grouped).map((date) => ({
  //           date,
  //           times: grouped[date],
  //         }));

  //         setFilterTimeSlot(formattedSlots);
  //       } else {
  //         setFilterTimeSlot([]);
  //       }
  //     } catch (error) {
  //       console.log("Error fetching timeslots:", error);
  //       setFilterTimeSlot([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

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
      formik.setFieldValue("date", formattedDate);
      alltimeslots(formattedDate); // 🔁 Call with selected date
    }
  };

  //  calender component here

  //  calender component ends here

  // Inside your component:

  // Then render:

  const DashedLine = ({ dashCount = 30, dashColor = "white" }) => (
    <View className="flex-row flex-1 justify-between items-center">
      {Array.from({ length: dashCount }).map((_, index) => (
        <View
          key={index}
          style={{
            width: 4,
            height: 1,
            backgroundColor: dashColor,
            marginRight: index !== dashCount - 1 ? 2 : 0,
          }}
        />
      ))}
    </View>
  );

  return (
    <View className="flex-1">
      {/* Header Background Image */}
      <View>
        <Image
          source={images.HeaderImg2}
          className={`w-full ${
            Platform.OS === "android" ? "h-auto" : "h-[250px]"
          } relative`}
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
        <View className="flex-row items-center">
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
            {applanguage === "eng"
              ? Translations.eng.select_slots
              : Translations.arb.select_slots}
          </Text>
        </View>
        <View className="flex-row items-center justify-between px-4 mt-8">
          <View className="flex-col items-center">
            <Text
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "Lato" }}
            >
              {flight?.departure?.iata || flight?.flight_from }
            </Text>
            <Text className="text-white" style={{ fontFamily: "Lato" }}>
              Departure
            </Text>
          </View>

          <View className="flex-1 items-center px-2">
            <View className="w-full flex-row items-center justify-center">
              <View className="flex-1 relative justify-center">
                <DashedLine dashColor="white" />
                <View className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 px-2 z-10">
                  <PlaneIcon />
                </View>
              </View>
            </View>
          </View>
          <View className="flex-col items-center">
            <Text
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "Lato" }}
            >
              {flight?.arrival?.iata || flight?.flight_to }
            </Text>
            <Text className="text-white" style={{ fontFamily: "Lato" }}>
              Arrival
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
        {/* {loading ? (
          <View className="flex-1 items-center justify-center mt-20">
            <Text className="text-[#164F90] text-lg font-bold">
              <ActivityIndicator size="large" color="#164F90" />
            </Text>
          </View>
        ) : (
          <>
            {filterTimeSlot.map((item, index) => (
              <View key={index} className="mt-4">
                <Text className="text-[#164F90] text-lg mb-2 font-bold">
                  {item.date}
                </Text>
                <View className="flex flex-row flex-wrap gap-4 justify-start my-4">
                  {item.times.map((timeslot, i) => {
                    const slotKey = `${item.date}-${timeslot}`;
                    return (
                      <TouchableOpacity
                        key={i}
                        onPress={() => {
                          setSelected(slotKey);
                          formik.setFieldValue("date", item.date);
                          formik.setFieldValue("time", timeslot);
                        }}
                        className={`${
                          selected === slotKey
                            ? "bg-[#164F90] border border-[#FFB648]"
                            : "border"
                        } rounded-xl p-2 px-5`}
                      >
                        <Text
                          className={selected === slotKey ? "text-white" : ""}
                        >
                          {timeslot}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </>
        )} */}

        {loading ? (
          <View className="flex-1 items-center justify-center mt-20">
            <ActivityIndicator size="large" color="#164F90" />
          </View>
        ) : (
        
       <>
  {filterTimeSlot.map((item, index) => (
    <View key={index} className="mt-4">
      <Text className="text-[#164F90] text-lg mb-2 font-bold">{item.date}</Text>

      <View className="flex flex-row flex-wrap gap-4 justify-start my-4">
        {item.times.map((slot, i) => {
          const slotKey = `${item.date}-${slot.time}`;
          const isSelected = selected === slotKey;
          const isDisabled = !slot.available;

          return (
            <TouchableOpacity
              key={i}
              onPress={() => {
                if (isDisabled) return; // prevent clicking
                setSelected(slotKey);
                formik.setFieldValue("departureDate", item.date);
                formik.setFieldValue("departureTime", slot.time);
              }}
              disabled={isDisabled}
              className={`rounded-xl p-2 px-5 border border-[#696969]
                ${isSelected ? "bg-[#164F90] border-[#FFB648]" : ""}
                ${isDisabled ? "opacity-40" : ""}`}
            >
              <Text
                className={`  ${ 
                  isSelected ? "text-white" : "text-[#696969]"
                } ${isDisabled ? "text-gray-500" : ""}`}
              >
                {slot.time}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  ))}
</>


        )}

        {formik.touched.time && formik.errors.time && (
          <Text
            className="text-red-500 w-[90%] mx-auto"
            style={{ fontFamily: "Lato" }}
          >
            {formik.errors.time}
          </Text>
        )}

        {/* Continue Button */}
        <TouchableOpacity
          className="mb-8 mx-4 bg-[#FFB800] rounded-xl py-4 shadow-lg mt-28"
          onPress={() => {
            // createNewCalendar();
            formik.handleSubmit();
            // router.push("/home/selectlocation");
          }}
        >
          <Text
            className="text-center text-[#164F90] font-bold"
            style={{ fontFamily: "Lato" }}
          >
            {applanguage === "eng"
              ? Translations.eng.continue
              : Translations.arb.continue}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default slots;

// all time slots function commented out for now as it is not being used in the current implementation

// const alltimeslots = async () => {
//   try {
//     console.log("Fetching all time slots...", selectedDate, time);

//     const res = await ALL_TIME_SLOTS();
//     console.log("res", res);

//     // if (res?.data?.allTimeSlots && Array.isArray(res.data.allTimeSlots)) {
//     if (res?.data?.allTimeSlots) {
//       let filteredSlots = res.data.allTimeSlots;
//       setTimeslots(filteredSlots);

//       const formattedSlotsdata = filteredSlots.map((slot) => ({
//         key: slot._id,
//         value: slot.timeSlot,
//       }));

//       setFilterTimeSlot([]);
//     } else {
//       setTimeslots([]);
//       setFilterTimeSlot([]);
//     }
//   } catch (error) {
//     console.log("Error fetching timeslots:", error);
//     setTimeslots([]);
//     setFilterTimeSlot([]);
//   }
// };

// useEffect(() => {
//   alltimeslots();
// }, []);

// const baggaevalues = { personsCount, baggagePictures, baggageCount };

// calender component here

// const createNewCalendar = async () => {
//   try {
//     const defaultCalendarSource =
//       Platform.OS === "ios"
//         ? await Calendarpicker.getDefaultCalendarAsync()
//         : { isLocalAccount: true, name: "Expo Calendar" };

//     const newCalendarID = await Calendarpicker.createCalendarAsync({
//       title: "Flight Schedules",
//       color: "#FFB800",
//       entityType: Calendarpicker.EntityTypes.EVENT,
//       sourceId: defaultCalendarSource.id,
//       source: defaultCalendarSource,
//       name: "Flight Schedules",
//       ownerAccount: "personal",
//       accessLevel: Calendarpicker.CalendarAccessLevel.OWNER,
//     });

//     // console.log("New calendar ID:", newCalendarID);
//   } catch (error) {
//     console.log("Error creating calendar:", error);
//   }
// };

{
  /* <View className="flex-1 items-center px-2">
            <View className="w-full flex-row items-center justify-center ">
              <View className="flex-1 h-[1px] border-t border-dashed border-white relative">
                <View className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 px-2">
                  <PlaneIcon />
                </View>
              </View>
            </View>
          </View> */
}

{
  /* <SelectList
            setSelected={(val) => formik.setFieldValue("time", val)} // ✅ Bind to formik state
            value={formik.values.time}
            data={filterTimeSlot}
            // data={filteredSlotTimes}
            save="value"
            boxStyles={{
              flexDirection: "row",
              marginVertical: 16,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#F2F2F2",
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: "#FBFBFB",
            }}
            dropdownStyles={{
              borderColor: "#F2F2F2",
              borderWidth: 1,
              borderRadius: 12,
              backgroundColor: "#FBFBFB",
            }}
            inputStyles={{
              fontSize: 16,
              color: "#333",
            }}
            dropdownTextStyles={{
              fontSize: 16,
              color: "#333",
            }}
          /> */
}
