import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import Translations from "../language";
import Toast from "react-native-toast-message";
import * as Calendarpicker from "expo-calendar";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import Timelogo from "../assets/timelogo";
import Homecal from "../assets/homecalender";
import { langaugeContext } from "../customhooks/languageContext";
import { useFormik } from "formik";
import addFlightSchema from "../yupschema/addFlight";
import { ADD_FLIGHTS } from "../network/apiCallers";


const AddFlightForm = ({ formik }) => {
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false); // For Date Picker visibility
  const [selectedDate, setSelectedDate] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  //   const { loadToken } = useAuth()
  const { applanguage } = langaugeContext();

 

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

  const handleSwap = () => {
    const temp = fromValue;
    setFromValue(toValue);
    setToValue(temp);
  };

  const hideDatePicker = () => {
    setShowDatePicker(false);
  };
  const hideTimePicker = () => {
    setShowTimePicker(false);
  };
  const datePickerShow = () => {
    setShowDatePicker(true);
  };
  const timePickerShow = () => {
    setShowTimePicker(true);
  };

  const handleConfirm = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // JS months are 0-based
    const year = date.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;
    setSelectedDate(formattedDate);
    formik.setFieldValue("dep_date", formattedDate);
    hideDatePicker();
  };

  const handleTime = (time) => {
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;

    console.log("formattedTime", formattedTime);
    setSelectedTime(formattedTime);
    formik.setFieldValue("flight_time", formattedTime);
    hideTimePicker();
  };

  return (
    <>
      <View className=" flex flex-row items-center gap-x-1 border h-[50px] border-gray-300 my-2 rounded-xl text-black px-4 py-3 bg-gray-50">
        <Text>
          {applanguage === "eng"
            ? Translations.eng.from
            : Translations.arb.from}
          :
        </Text>
        <TextInput
          placeholder={
            applanguage === "eng"
              ? Translations.eng.from
              : Translations.arb.from
          }
          value={formik.values.flight_from}
          editable={false}
          // value={fromValue}
          // onChangeText={(text) => setFromValue(text)}
          className="text-black"
          placeholderTextColor="#2D2A29"
        />
      </View>

      {/* <TouchableOpacity
          className="z-[100] absolute right-10 top-[203px]"
          onPress={handleSwap}
        >
          <Fromto size={20} color="#6B7280" />
        </TouchableOpacity> */}
      {/* <View className=" flex flex-row items-center gap-x-1 border h-[50px] border-gray-300 my-2 rounded-xl text-black px-4 py-3 bg-gray-50">
          <Text>{ applanguage === "eng" ? Translations.eng.to : Translations.arb.to}:</Text> */}

      <View className="flex-row items-center border h-[50px] border-gray-300 my-2 rounded-xl px-4 bg-gray-50">
        <Text className="text-[#2D2A29] mr-2 font-medium">
          {applanguage === "eng" ? Translations.eng.to : Translations.arb.to}:
        </Text>
       <TextInput
  maxLength={3}
  value={formik.values.flight_to}
  onChangeText={(text) => {
    // Remove numeric characters
    const filtered = text.replace(/[0-9]/g, '');
    formik.setFieldValue("flight_to", filtered);
  }}
  onBlur={formik.handleBlur("flight_to")}
  className="flex-1 text-black"
  placeholderTextColor="#2D2A29"
  keyboardType="default"
/>

      </View>

      {/* </View> */}
      <TouchableOpacity
        onPress={() => {
          datePickerShow();
        }}
        className="flex-row my-2 justify-between items-center border border-gray-300 rounded-xl px-4 pl-2 py-1 bg-gray-50"
      >
        {showDatePicker ? (
          <DateTimePickerModal
            isVisible={showDatePicker}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            minimumDate={new Date()}
          />
        ) : (
          <TouchableOpacity
            className="bg-gray-100 p-3 rounded-lg"
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{selectedDate || "yyyy-mm-dd"}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          className=""
          onPress={() => {
            datePickerShow();
          }}
        >
          <Homecal size={24} color="#6B7280" />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* {formik.touched.departureDate && formik.errors.departureDate && (
          <Text className="text-red-500 w-[90%] mx-auto" style={{ fontFamily: "Lato" }}>
            {formik.errors.departureDate}
          </Text>
        )} */}

      <TouchableOpacity
        onPress={() => {
          timePickerShow();
        }}
        className="flex-row my-2 justify-between items-center border border-gray-300 rounded-xl px-4 pl-2 py-1 bg-gray-50"
      >
        {showTimePicker ? (
          <DateTimePickerModal
            isVisible={showTimePicker}
            mode="time"
            onConfirm={handleTime}
            onCancel={hideTimePicker}
            is24Hour={true}
            // minimumDate={new Date()}
          />
        ) : (
          <TouchableOpacity
            className="bg-gray-100 p-3 rounded-lg"
            onPress={() => setShowTimePicker(true)}
          >
            <Text>
              {selectedTime ||
                (applanguage === "eng"
                  ? Translations.eng.flight_timing
                  : Translations.arb.flight_timing)}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          className=""
          onPress={() => {
            console.log("second");
            timePickerShow();
          }}
        >
          <Timelogo size={24} color="#6B7280" />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* {formik.touched.departureTime && formik.errors.departureTime && (
          <Text className="text-red-500 w-[90%] mx-auto" style={{ fontFamily: "Lato" }}>
            {formik.errors.departureTime}
          </Text>
        )} */}

      <TextInput
        maxLength={6}
        placeholder={
          applanguage === "eng"
            ? Translations.eng.flight_number
            : Translations.arb.flight_number
        }
        onChangeText={formik.handleChange("flight_number")}
        onBlur={formik.handleBlur("flight_number")}
        value={formik.values.flight_number.toUpperCase()}
        name="flightNumber"
        className="border h-[50px] border-gray-300 my-2 rounded-xl px-4 py-3 bg-gray-50"
        placeholderTextColor="#2D2A29"
      />

      {formik.touched.flight_number && formik.errors.flight_number && (
          <Text className="text-red-500 w-[90%] mx-auto"  style={{ fontFamily: "Lato" }}>
            {formik.errors.flight_number}
          </Text>
        )}
<TouchableOpacity
  onPress={() => {
    // Validate before submitting
    if (
      !formik.values.dep_date ||
      !formik.values.flight_time ||
      !formik.values.flight_number ||
      !formik.values.flight_to ||
      !formik.values.flight_from
    ) {
      Toast.show({
        type: "error",
        text1: "Please fill all required fields",
      });
      return;
    }
    formik.handleSubmit();
  }}
  className="bg-[#FFB800] rounded-lg py-4 mt-2 shadow-lg"
>
  <Text className="text-center text-[#164E8D] font-bold text-base">
    {applanguage === "eng" ? Translations.eng.submit : Translations.arb.submit}
  </Text>
</TouchableOpacity>

    </>
  );
};

export default AddFlightForm;

