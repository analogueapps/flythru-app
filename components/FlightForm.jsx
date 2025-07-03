// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   Platform,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import Translations from "../language";
// import Toast from "react-native-toast-message";
// import * as Calendarpicker from "expo-calendar";

// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import Timelogo from "../assets/timelogo";
// import Homecal from "../assets/homecalender";
// import { langaugeContext } from "../customhooks/languageContext";
// import { useFormik } from "formik";
// import addFlightSchema from "../yupschema/addFlight";
// import { ADD_FLIGHTS } from "../network/apiCallers";
// const FlightForm = ({ formik }) => {
//   const [fromValue, setFromValue] = useState("");
//   const [toValue, setToValue] = useState("");
//   const [showDatePicker, setShowDatePicker] = useState(false); // For Date Picker visibility
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const { applanguage } = langaugeContext();

//   const createNewCalendar = async () => {
//     try {
//       const defaultCalendarSource =
//         Platform.OS === "ios"
//           ? await Calendarpicker.getDefaultCalendarAsync()
//           : { isLocalAccount: true, name: "Expo Calendar" };

//       const newCalendarID = await Calendarpicker.createCalendarAsync({
//         title: "Flight Schedules",
//         color: "#FFB800",
//         entityType: Calendarpicker.EntityTypes.EVENT,
//         sourceId: defaultCalendarSource.id,
//         source: defaultCalendarSource,
//         name: "Flight Schedules",
//         ownerAccount: "personal",
//         accessLevel: Calendarpicker.CalendarAccessLevel.OWNER,
//       });

//       // console.log("New calendar ID:", newCalendarID);
//     } catch (error) {
//       console.log("Error creating calendar:", error);
//     }
//   };

//   useEffect(() => {
//     (async () => {
//       const { status } = await Calendarpicker.requestCalendarPermissionsAsync();
//       if (status === "granted") {
//         const calendars = await Calendarpicker.getCalendarsAsync(
//           Calendarpicker.EntityTypes.EVENT
//         );
//         // console.log("Here are all your calendars:", calendars);
//       } else {
//         Alert.alert("Permission required", "Calendar access is needed.");
//       }
//     })();
//   }, []);

//   const handleSwap = () => {
//     const temp = fromValue;
//     setFromValue(toValue);
//     setToValue(temp);
//   };

//   const hideDatePicker = () => {
//     setShowDatePicker(false);
//   };
//   const hideTimePicker = () => {
//     setShowTimePicker(false);
//   };
//   const datePickerShow = () => {
//     setShowDatePicker(true);
//   };
//   const timePickerShow = () => {
//     setShowTimePicker(true);
//   };

//   const handleConfirm = (date) => {
//     const day = date.getDate().toString().padStart(2, "0");
//     const month = (date.getMonth() + 1).toString().padStart(2, "0"); // JS months are 0-based
//     const year = date.getFullYear();

//     const formattedDate = `${day}-${month}-${year}`;
//     // setSelectedDate(formattedDate);
//     formik.setFieldValue("departureDate", formattedDate);
//     hideDatePicker();
//   };

//   const handleTime = (time) => {
//     const hours = time.getHours().toString().padStart(2, "0");
//     const minutes = time.getMinutes().toString().padStart(2, "0");
//     const formattedTime = `${hours}:${minutes}`;

//     console.log("formattedTime", formattedTime);
//     // setSelectedTime(formattedTime);
//     formik.setFieldValue("departureTime", formattedTime);
//     hideTimePicker();
//   };

//   return (
//     <>
//       <View className=" flex flex-row items-center gap-x-1 border h-[50px] border-gray-300 my-2 rounded-xl text-black px-4 py-3 bg-gray-50">
//         <Text>
//           {applanguage === "eng"
//             ? Translations.eng.from
//             : Translations.arb.from}
//           :
//         </Text>
//         <TextInput
//           placeholder={
//             applanguage === "eng"
//               ? Translations.eng.from
//               : Translations.arb.from
//           }
//           value={formik.values.from}
//           editable={false}
//           // value={fromValue}
//           // onChangeText={(text) => setFromValue(text)}
//           className="text-black"
//           placeholderTextColor="#2D2A29"
//         />
//       </View>
//       <View className="flex-row items-center border h-[50px] border-gray-300 my-2 rounded-xl px-4 bg-gray-50">
//         <Text className="text-[#2D2A29] mr-2 font-medium">
//           {applanguage === "eng" ? Translations.eng.to : Translations.arb.to}:
//         </Text>
//         <TextInput
//           maxLength={3}
//           value={formik.values.to}
//           onChangeText={(text) => {
//             // Remove any numbers from the input
//             const filteredText = text.replace(/[0-9]/g, '');
//             formik.setFieldValue("to", filteredText);
//           }}
//           onBlur={formik.handleBlur("to")}
//           className="flex-1 text-black"
//           placeholderTextColor="#2D2A29"
//           keyboardType="default" // Prevents number keypad
//         />

//       </View>

//       {/* </View> */}
//       <TouchableOpacity
//         onPress={() => {
//           datePickerShow();
//         }}
//         className="flex-row my-2 justify-between items-center border border-gray-300 rounded-xl px-4 pl-2 py-1 bg-gray-50"
//       >
//         {showDatePicker ? (
//           <DateTimePickerModal
//             isVisible={showDatePicker}
//             mode="date"
//             onConfirm={handleConfirm}
//             onCancel={hideDatePicker}
//             minimumDate={new Date()}
//           />
//         ) : (
//           <TouchableOpacity
//             className="bg-gray-100 p-3 rounded-lg"
//             onPress={() => setShowDatePicker(true)}
//           >
//             <Text>{formik.values.departureDate || "yyyy-mm-dd"}</Text>
//           </TouchableOpacity>
//         )}

//         <TouchableOpacity
//           className=""
//           onPress={() => {
//             datePickerShow();
//           }}
//         >
//           <Homecal size={24} color="#6B7280" />
//         </TouchableOpacity>
//       </TouchableOpacity>


//       <TouchableOpacity
//         onPress={() => {
//           timePickerShow();
//         }}
//         className="flex-row my-2 justify-between items-center border border-gray-300 rounded-xl px-4 pl-2 py-1 bg-gray-50"
//       >
//         {showTimePicker ? (
//           <DateTimePickerModal
//             isVisible={showTimePicker}
//             mode="time"
//             onConfirm={handleTime}
//             onCancel={hideTimePicker}
//             is24Hour={true}
//           // minimumDate={new Date()}
//           />
//         ) : (
//           <TouchableOpacity
//             className="bg-gray-100 p-3 rounded-lg"
//             onPress={() => setShowTimePicker(true)}
//           >
//             <Text>
//               {formik.values.departureTime ||
//                 (applanguage === "eng"
//                   ? Translations.eng.flight_timing
//                   : Translations.arb.flight_timing)}
//             </Text>
//           </TouchableOpacity>
//         )}

//         <TouchableOpacity
//           className=""
//           onPress={() => {
//             console.log("second");
//             timePickerShow();
//           }}
//         >
//           <Timelogo size={24} color="#6B7280" />
//         </TouchableOpacity>
//       </TouchableOpacity>

//       {/* {formik.touched.departureTime && formik.errors.departureTime && (
//           <Text className="text-red-500 w-[90%] mx-auto" style={{ fontFamily: "Lato" }}>
//             {formik.errors.departureTime}
//           </Text>
//         )} */}

//       <TextInput
//         maxLength={6}
//         placeholder={
//           applanguage === "eng"
//             ? Translations.eng.flight_number
//             : Translations.arb.flight_number
//         }
//         onChangeText={formik.handleChange("flightNumber")}
//         onBlur={formik.handleBlur("flightNumber")}
//         value={formik.values.flightNumber.toUpperCase()}
//         name="flightNumber"
//         className="border h-[50px] border-gray-300 my-2 rounded-xl px-4 py-3 bg-gray-50"
//         placeholderTextColor="#2D2A29"
//       />

//       {formik.touched.flightNumber && formik.errors.flightNumber && (
//         <Text className="text-red-500 w-[90%] mx-auto" style={{ fontFamily: "Lato" }}>
//           {formik.errors.flightNumber}
//         </Text>
//       )}

//       <TouchableOpacity
//         activeOpacity={0.5}
//         onPress={async () => {
//           console.log("1");

//           formik.handleSubmit();
//           console.log(2);

//           createNewCalendar();
//         }}
//         className="bg-[#FFB800] rounded-lg py-4 mt-2 shadow-lg "
//         style={{
//           elevation: 5,
//           shadowColor: "#000",
//           shadowOffset: { width: 0, height: 2 },
//           shadowOpacity: 0.5,
//           shadowRadius: 3.84,
//         }}
//       >
//         <Text
//           className="text-center text-[#164E8D] font-bold text-base"
//           style={{ fontFamily: "Lato" }}
//         >
//           {applanguage === "eng"
//             ? Translations.eng.search
//             : Translations.arb.search}
//         </Text>
//       </TouchableOpacity>
//     </>
//   );
// };

// export default FlightForm;


import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import React, { useState } from "react";
import Translations from "../language";
import Toast from "react-native-toast-message";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Timelogo from "../assets/timelogo";
import Homecal from "../assets/homecalender";
import { langaugeContext } from "../customhooks/languageContext";
import { useFormik } from "formik";
import addFlightSchema from "../yupschema/addFlight";
import { ADD_FLIGHTS } from "../network/apiCallers";

const FlightForm = ({ formik }) => {
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { applanguage } = langaugeContext();

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
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;
    formik.setFieldValue("departureDate", formattedDate);
    hideDatePicker();
  };

  const handleTime = (time) => {
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;

    console.log("formattedTime", formattedTime);
    formik.setFieldValue("departureTime", formattedTime);
    hideTimePicker();
  };

  // Function to save flight data to device calendar (iOS/Android native)
  const saveToDeviceCalendar = async () => {
    try {
      const flightData = formik.values;
      
      // Create event title
      const eventTitle = `Flight ${flightData.flightNumber} - ${flightData.from} to ${flightData.to}`;
      
      // Parse date and time
      const [day, month, year] = flightData.departureDate.split('-');
      const [hours, minutes] = flightData.departureTime.split(':');
      
      const eventDate = new Date(year, month - 1, day, hours, minutes);
      const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours
      
      // For iOS, we can use EventKit through a bridge or third-party library
      // For Android, we can use Intent to open calendar app
      
      // if (Platform.OS === 'ios') {
      //   // iOS: You can use react-native-add-calendar-event or similar
      //   // This is a safer alternative to expo-calendar
      //   console.log('iOS: Opening calendar with event details');
      //   // Implementation depends on the library you choose
        
      //   Toast.show({
      //     type: 'success',
      //     text1: 'Flight Added',
      //     text2: 'Please add this flight to your calendar manually',
      //   });
      // } else {
      //   // Android: Use Intent to open calendar
      //   console.log('Android: Opening calendar with event details');
        
      //   Toast.show({
      //     type: 'success',
      //     text1: 'Flight Added',
      //     text2: 'Please add this flight to your calendar manually',
      //   });
      // }
    } catch (error) {
      console.log('Error saving to calendar:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not save to calendar',
      });
    }
  };

  return (
    <>
      <View className="flex flex-row items-center gap-x-1 border h-[50px] border-gray-300 my-2 rounded-xl text-black px-4 py-3 bg-gray-50">
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
          value={formik.values.from}
          editable={false}
          className="text-black"
          placeholderTextColor="#2D2A29"
        />
      </View>

      <View className="flex-row items-center border h-[50px] border-gray-300 my-2 rounded-xl px-4 bg-gray-50">
        <Text className="text-[#2D2A29] mr-2 font-medium">
          {applanguage === "eng" ? Translations.eng.to : Translations.arb.to}:
        </Text>
        <TextInput
          maxLength={3}
          value={formik.values.to}
          onChangeText={(text) => {
            const filteredText = text.replace(/[0-9]/g, '');
            formik.setFieldValue("to", filteredText);
          }}
          onBlur={formik.handleBlur("to")}
          className="flex-1 text-black"
          placeholderTextColor="#2D2A29"
          keyboardType="default"
        />
      </View>

      {/* Date Picker */}
      <TouchableOpacity
        onPress={datePickerShow}
        className="flex-row my-2 justify-between items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50"
      >
        <View className="flex-1">
          <Text className="text-[#2D2A29] text-base">
            {formik.values.departureDate || "Select Date"}
          </Text>
        </View>
        <Homecal size={24} color="#6B7280" />
      </TouchableOpacity>

      {/* Time Picker */}
      <TouchableOpacity
        onPress={timePickerShow}
        className="flex-row my-2 justify-between items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50"
      >
        <View className="flex-1">
          <Text className="text-[#2D2A29] text-base">
            {formik.values.departureTime ||
              (applanguage === "eng"
                ? Translations.eng.flight_timing
                : Translations.arb.flight_timing)}
          </Text>
        </View>
        <Timelogo size={24} color="#6B7280" />
      </TouchableOpacity>

      {/* Flight Number Input */}
      <TextInput
        maxLength={6}
        placeholder={
          applanguage === "eng"
            ? Translations.eng.flight_number
            : Translations.arb.flight_number
        }
        onChangeText={formik.handleChange("flightNumber")}
        onBlur={formik.handleBlur("flightNumber")}
        value={formik.values.flightNumber.toUpperCase()}
        name="flightNumber"
        className="border h-[50px] border-gray-300 my-2 rounded-xl px-4 py-3 bg-gray-50"
        placeholderTextColor="#2D2A29"
      />

      {formik.touched.flightNumber && formik.errors.flightNumber && (
        <Text className="text-red-500 w-[90%] mx-auto" style={{ fontFamily: "Lato" }}>
          {formik.errors.flightNumber}
        </Text>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={async () => {
          console.log("Form submitted");
          formik.handleSubmit();
          
          // Save to device calendar instead of creating new calendar
          await saveToDeviceCalendar();
        }}
        className="bg-[#FFB800] rounded-lg py-4 mt-2 shadow-lg"
        style={{
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 3.84,
        }}
      >
        <Text
          className="text-center text-[#164E8D] font-bold text-base"
          style={{ fontFamily: "Lato" }}
        >
          {applanguage === "eng"
            ? Translations.eng.search
            : Translations.arb.search}
        </Text>
      </TouchableOpacity>

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      />

      {/* Time Picker Modal */}
      <DateTimePickerModal
        isVisible={showTimePicker}
        mode="time"
        onConfirm={handleTime}
        onCancel={hideTimePicker}
        is24Hour={true}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      />
    </>
  );
};

export default FlightForm;
