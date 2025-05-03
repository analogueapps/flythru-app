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
  const [filteredSlotTimes, setFilteredSlotTimes] = useState([]);
  const [timeslot, setTimeslots] = useState([]);
  const [filterTimeSlot, setFilterTimeSlot] = useState([]);
  const { flightData, departureDate } = useLocalSearchParams();

  const flight = JSON.parse(flightData);
  // const { departureDate } = useFlightContext();
  // const time=flight?.departure?.scheduled
  console.log("departureDate", departureDate, flight);
  const time =
    flight?.departure?.scheduled && flight.departure.scheduled.includes("T")
      ? `${flight.departure.scheduled.split("T")[1].split(":")[0]}:${
          flight.departure.scheduled.split("T")[1].split(":")[1].split(".")[0]
        } `
      : flight.departure.scheduled;
  console.log("flight  timeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", time);
  const [depDate, setdepDate] = useState("");
  const { applanguage } = langaugeContext();

  const { personsCount, baggageCount, baggagePictures } =
    useLocalSearchParams();

  const parsedPersonsCount = personsCount ? parseInt(personsCount) : 0;
  const parsedBaggageCount = baggageCount ? parseInt(baggageCount) : 0;
  const parsedBaggagePictures = baggagePictures
    ? JSON.parse(decodeURIComponent(baggagePictures))
    : [];

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

  const alltimeslots = async () => {
    try {
      console.log("Fetching all time slots...", selectedDate, time);

      const res = await ALL_TIME_SLOTS();
      console.log("res", res);

      // if (res?.data?.allTimeSlots && Array.isArray(res.data.allTimeSlots)) {
      if (res?.data?.allTimeSlots) {
        let filteredSlots = res.data.allTimeSlots;
        setTimeslots(filteredSlots);

        const formattedSlotsdata = filteredSlots.map((slot) => ({
          key: slot._id,
          value: slot.timeSlot,
        }));

        setFilterTimeSlot([]);
      } else {
        setTimeslots([]);
        setFilterTimeSlot([]);
      }
    } catch (error) {
      console.log("Error fetching timeslots:", error);
      setTimeslots([]);
      setFilterTimeSlot([]);
    }
  };

  useEffect(() => {
    alltimeslots();
  }, []);

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
            className=" flex-row my-4 justify-between items-center border border-[#F2F2F2] rounded-xl px-4 py-3 bg-[#FBFBFB]"
          >
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
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
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
              }
              mode="date"
              minimumDate={new Date()}
              maximumDate={
                depDate instanceof Date && !isNaN(depDate) ? depDate : undefined
              }
              display="default"
              onChange={async (event, selectedDate) => {
                setShowDatePicker(false);
                if (!selectedDate) return;

                const formattedDate = selectedDate.toISOString().split("T")[0];
                console.log("formateDate", formattedDate);
                setSelectedDate(formattedDate);
                formik.setFieldValue("date", formattedDate);
                const filteredTimeSlots = timeslot.filter((item) => {
                  if (!item.date) return false;
                  const itemDate = new Date(item.date)
                    .toISOString()
                    .split("T")[0];
                  return itemDate === formattedDate && item.isActive;
                });
                console.log("check in oncjkage", departureDate);
                console.log("sssssecccuddffj", flight.departure.scheduled);
                const flightScheduledDateTime = new Date(
                  `${departureDate}T${flight.departure.scheduled}:00`
                ); // Adding :00 for seconds

                console.log(
                  "Flight Scheduled DateTime:",
                  flightScheduledDateTime
                );
                const givenDepartureDate = new Date(departureDate);
                const dateformate = new Date(formattedDate);
                const filterTimeSlotsBefore6Hours = filteredTimeSlots.filter(
                  (slot) => {
                    const slotDateStr = `${formattedDate}T${slot.timeSlot}`;
                    const slotDateTime = new Date(slotDateStr);
                    console.log(
                      "==09-09889677656",
                      dateformate,
                      givenDepartureDate
                    );
                    // If selected date is before flight date, return all slots
                    if (dateformate > givenDepartureDate) {
                      return true;
                    }

                    const diffMs = flightScheduledDateTime - slotDateTime;
                    const diffHours = diffMs / (1000 * 60 * 60);
                    return diffHours >= 6;
                  }
                );
                // If you need to ensure it's in the local time zone, you can log it as local time
                console.log(
                  "Local Flight Scheduled DateTime:",
                  filterTimeSlotsBefore6Hours
                );
                const data = filterTimeSlotsBefore6Hours.map((item) => ({
                  key: item._id,
                  value: item.timeSlot,
                }));

                setFilterTimeSlot(data);
                // setFilteredSlotTimes(filterTimeSlotsBefore6Hours);
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
