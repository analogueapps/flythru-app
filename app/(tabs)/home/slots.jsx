import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
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
import { ALL_TIME_SLOTS } from "../../../network/apiCallers";
import { langaugeContext } from "../../../customhooks/languageContext";
import Translations from "../../../language";
import slotsSchema from "../../../yupschema/slotsSchema";
// import { useFlightContext } from "../../../UseContext/useFlightContext";

const slots = () => {
  const insets = useSafeAreaInsets();
  const [showDatePicker, setShowDatePicker] = useState(false); // For Date Picker visibility
  const [selectedDate, setSelectedDate] = useState("");
  const [selected, setSelected] = React.useState("");
  const [timeslot, setTimeslots] = useState([]);
  const { flightData, departureDate } = useLocalSearchParams();
  // const { departureDate } = useFlightContext();

  const flight = JSON.parse(flightData);
  const [depDate, setdepDate] = useState("");
  const { applanguage } = langaugeContext();

  const { personsCount, baggageCount, baggagePictures } =
    useLocalSearchParams();

  const parsedPersonsCount = personsCount ? parseInt(personsCount) : 0;
  const parsedBaggageCount = baggageCount ? parseInt(baggageCount) : 0;
  const parsedBaggagePictures = baggagePictures
    ? JSON.parse(decodeURIComponent(baggagePictures))
    : [];


  // useEffect(() => {
  //   if (flight?.departure?.scheduled) {
  //     const extractedDate = new Date(flight.departure.scheduled);

  //     if (!isNaN(extractedDate.getTime())) {
  //       // ✅ Ensure it's a valid date
  //       // setdepDate(new Date(departureDate));
  //       if (departureDate) {
  //         const parsedDate = new Date(departureDate);
  //         if (!isNaN(parsedDate)) {
  //           setdepDate(parsedDate);
  //         } else {
  //           console.error("Invalid departureDate format:", departureDate);
  //         }
  //       }

  //       console.log("deppppppaaaa Date:", departureDate);
  //     } else {
  //       console.error("Invalid departure date:", flight.departure.scheduled);
  //     }
  //   }
  // }, [flight?.departure?.scheduled]);

  useEffect(() => {
    console.log("🛫 departureDate from context:", departureDate);
  }, [departureDate]);
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
  
  
  useEffect(() => {
    console.log("👀 depDate inside useEffect:", depDate);
    if (depDate) {
      console.log("✅ departure date for picker:", depDate);
    } else {
      console.log("❌ depDate is still empty or invalid");
    }
  }, [depDate]);
  
  useEffect(() => {
    console.log("🚨 depDate useEffect running...");
    console.log("depDate value:", depDate);
    console.log("depDate is instanceof Date:", depDate instanceof Date);
    console.log("depDate isNaN:", isNaN(depDate));
  }, [depDate]);
  


  console.log(
    "///////////////////",
    flight?.departure?.scheduled.split("T")[0]
  );

  
  const alltimeslots = async (selectedDate = null) => {
    try {
      const res = await ALL_TIME_SLOTS();
      if (res?.data?.allTimeSlots && Array.isArray(res.data.allTimeSlots)) {
        let filteredSlots = res.data.allTimeSlots;

        if (selectedDate) {
          const selectedISO = new Date(selectedDate)
            .toISOString()
            .split("T")[0];
          filteredSlots = filteredSlots.filter((slot) => {
            const slotDate = new Date(slot.date).toISOString().split("T")[0];
            return slotDate === selectedISO;
          });
        }

        const formattedSlots = filteredSlots.map((slot) => ({
          key: slot._id,
          value: slot.timeSlot,
        }));

        setTimeslots(formattedSlots);
      } else {
        setTimeslots([]);
      }
    } catch (error) {
      console.log("Error fetching timeslots:", error);
      setTimeslots([]);
    }
  };

  useEffect(() => {
    console.log("flightsaaaaaa////////////", flight);
  }, []);
  

  useFocusEffect(
    useCallback(() => {
      alltimeslots();
    }, [])
  );

  const baggaevalues = { personsCount, baggagePictures, baggageCount };

  const formik = useFormik({
    initialValues: {
      date: "",
      time: "",
    },
    validationSchema: slotsSchema(applanguage),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      console.log("values", values);
      console.log("baggssaaaaa", baggaevalues);
      router.push({
        pathname: "/home/selectlocation",
        params: {
          date: values.date,
          time: values.time,
          personsCount: personsCount,
          baggagePictures: baggagePictures,
          baggageCount: baggageCount,
        },
      });
    },
  });

  useEffect(() => {
    console.log(
      "baggage details valuessaaaaaaa",
      parsedBaggagePictures,
      parsedBaggageCount,
      parsedPersonsCount
    );
  }, [parsedBaggagePictures, parsedBaggageCount, parsedPersonsCount]);

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

  // Inside your component:

  
// Then render:

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
            <Text className="text-2xl font-bold text-white">
              {" "}
              {flight?.departure?.iata ?? "--"}
            </Text>
            <Text className="text-white">Departure</Text>
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
            <Text className="text-2xl font-bold text-white">
              {" "}
              {flight?.arrival?.iata ?? "--"}
            </Text>
            <Text className="text-white">Arrival</Text>
          </View>
        </View>
        {/* <Text className="text-white text-center mt-4">Date : 05/05/2025</Text> */}
      </View>

      <View
        className="bg-white self-center absolute top-[170px] p-6 z-10 rounded-xl w-[90%] shadow-lg"
        style={{
          maxHeight: "79%",
        }}
      >
        <ScrollView className="" showsVerticalScrollIndicator={false}>
          <Text
            className="font-bold text-xl text-[#164F90]"
            style={{ fontFamily: "CenturyGothic" }}
          >
            {applanguage === "eng"
              ? Translations.eng.pick_up_date
              : Translations.arb.pick_up_date}
          </Text>
          <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className=" flex-row my-4 justify-between items-center border border-[#F2F2F2] rounded-xl px-4 py-3 bg-[#FBFBFB]">
            <TextInput
              placeholder={
                applanguage === "eng"
                  ? Translations.eng.select_date
                  : Translations.arb.select_date
              }
              className="flex h-[30px] "
              placeholderTextColor="#2D2A29"
              onChangeText={formik.handleChange("date")}
              onBlur={formik.handleBlur("date")}
              value={formik.values.date}
              name="date"
            />
            <TouchableOpacity 
            onPress={() => setShowDatePicker(true)}
            >
              <View
                style={{
                  backgroundColor: "#194F901A",
                  padding: 8,
                  borderRadius: 12,
                }}
              >
                <AntDesign name="calendar" size={26} color="#194F90" />
              </View>
            </TouchableOpacity>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={
                  depDate instanceof Date && !isNaN(depDate)
                    ? depDate
                    : new Date()
                } // Ensure a valid date is used
                mode="date"
                minimumDate={new Date()} // 👈 today's date
                maximumDate={
                  depDate instanceof Date && !isNaN(depDate)
                    ? depDate
                    : undefined
                } // 👈 departure date
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    const formattedDate = selectedDate
                      .toISOString()
                      .split("T")[0];
                    setSelectedDate(formattedDate);
                    formik.setFieldValue("date", formattedDate);
                    alltimeslots(formattedDate); // 👈 Load slots based on selected date
                  }
                }}
              />
            )}






          {formik.touched.date && formik.errors.date && (
            <Text className="text-red-500 w-[90%] mx-auto mb-2">
              {formik.errors.date}
            </Text>
          )}
          <Text
            className="font-bold text-xl text-[#164F90]"
            style={{ fontFamily: "CenturyGothic" }}
          >
            {applanguage === "eng"
              ? Translations.eng.pick_up_time
              : Translations.arb.pick_up_time}
          </Text>

          <SelectList
            setSelected={(val) => formik.setFieldValue("time", val)} // ✅ Bind to formik state
            value={formik.values.time}
            data={timeslot}
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
          />

          {formik.touched.time && formik.errors.time && (
            <Text className="text-red-500 w-[90%] mx-auto">
              {formik.errors.time}
            </Text>
          )}

          {/* Continue Button */}
          <TouchableOpacity
            className=" my-4 mx-4 bg-[#FFB800] rounded-xl py-4 shadow-lg mt-48"
            onPress={() => {
              createNewCalendar();
              formik.handleSubmit();
            }}
          >
            <Text className="text-center text-black font-semibold">
              {applanguage === "eng"
                ? Translations.eng.continue
                : Translations.arb.continue}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

export default slots;

{
  /* {showDatePicker && (
  <DateTimePicker
    value={depDate instanceof Date && !isNaN(depDate) ? depDate : new Date()} // Ensure a valid date is used
    mode="date"
    minimumDate={depDate instanceof Date && !isNaN(depDate) ? depDate : new Date()} // Ensure valid min date
    maximumDate={depDate instanceof Date && !isNaN(depDate) ? depDate : undefined}
    display="default"
    onChange={(event, selectedDate) => {
      setShowDatePicker(false); // Close the picker after selecting a date
      if (selectedDate) {
        const formattedDate = selectedDate.toISOString().split("T")[0];
        setSelectedDate(formattedDate);
        formik.setFieldValue("date", formattedDate);
      }
    }}
  />
)} */
}





