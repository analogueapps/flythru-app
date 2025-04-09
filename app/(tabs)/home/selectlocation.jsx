import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Linking,
  FlatList,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import images from "../../../constants/images";
import { StatusBar } from "expo-status-bar";
import SwipeButton from "rn-swipe-button";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Bell, ChevronLeft } from "lucide-react-native";
import { Calendar } from "lucide-react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import verticalline from "../../../assets/images/verticalline.png";
import { router, useLocalSearchParams } from "expo-router";
import dp from "../../../assets/images/dp2flythru.jpeg";
import MapView, { Marker, Polyline } from "react-native-maps";
import useExpoLocation from "../../../customhooks/useExpolocation";
import RBSheet from "react-native-raw-bottom-sheet";
import Swiperarrow from "../../../assets/svgs/swiperarrow";
import mapimg from "../../../assets/images/mapimg.jpg";
import { ALL_ADDRESS, PAYEMNT_API } from "../../../network/apiCallers";
import { useToast } from "react-native-toast-notifications";
import { useFormik } from "formik";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { langaugeContext } from "../../../customhooks/languageContext";
import Translations from "../../../language";
import selectlocationSchema from "../../../yupschema/selectLocationSchema";
import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const selectlocation = () => {
  const insets = useSafeAreaInsets();
  const locationrefRBSheet = useRef();
  // const { longitude, latitude } = useExpoLocation();
  const { date, time, personsCount, baggageCount, baggagePictures } =
    useLocalSearchParams();
  const toast = useToast();
  const [apiErr, setApiErr] = useState("");
  const longitude = Number(useExpoLocation().longitude);
  const latitude = Number(useExpoLocation().latitude);
  const { applanguage } = langaugeContext();
  const [userName, setUserName] = useState("");
  const [price, setPrice] = useState([]);
  const [pickupdate, setPickupdate] = useState([]);
  const [pickuploaction, setPickuploaction] = useState([]);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const parsedPersonsCount = personsCount ? parseInt(personsCount) : 0;
  const parsedBaggageCount = baggageCount ? parseInt(baggageCount) : 0;
  const parsedBaggagePictures = baggagePictures
    ? JSON.parse(decodeURIComponent(baggagePictures))
    : [];
    
  const [addresses, setAddresses] = useState([]);
  const [filteredAddresses, setFilteredAddresses] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [baggageId, setBaggageId] = useState(null);

  const emojisWithIcons = [
    {title: 'happy'},
    {title: 'cool'},
    {title: 'lo'},
    {title: 'sa'},
    {title: 'cr'},
    {title: 'angry'},
    {title: 'confused'},
    {title: 'excited'},
    {title: 'devil'},
    {title: 'wink'},
    {title: 'sick'},
    {title: 'frown'},
  ];

  // const handleLocationChange = (text) => {
  //   formik.setFieldValue("pickUpLocation", text);

  //   if (text.length > 0) {
  //     const filtered = addresses.filter(address =>
  //       typeof address === "string" &&
  //       address.toLowerCase().includes(text.toLowerCase())
  //     );
  //     setFilteredAddresses(filtered);
  //     setShowSuggestions(true);
  //   } else {
  //     setShowSuggestions(false);
  //   }
  // };

  // Fetch address list
  // useEffect(() => {
  //   const fetchAddresses = async () => {
  //     try {
  //       const res = await ALL_ADDRESS();
  //       if (res?.data?.addresses && Array.isArray(res.data.addresses)) {
  //         console.log("addresses" , res?.data?.addresses)
  //         setAddresses(res.data.addresses);
  //       } else {
  //         setAddresses([]);
  //       }
  //     } catch (error) {
  //       console.log("Error fetching addresses:", error);
  //       setAddresses([]);
  //     }
  //   };

  //   fetchAddresses();
  // }, []);

  useEffect(() => {
    console.log("slotssssssss", "date :", date);
    console.log("slotssssssss", "time :", time);
    console.log(
      "baggage details",
      parsedPersonsCount,
      parsedBaggageCount,
      parsedBaggagePictures
    );
  }, []);

  const formik = useFormik({
    initialValues: {
      pickUpLocation: "Bhilai",
      pickUpTimings: time,
    },
    validationSchema: selectlocationSchema(applanguage),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      console.log("values CREATE ORDER", values);

      // Include additional data for the API call
      const requestData = {
        ...values,
        date,
        time,
        personsCount: parsedPersonsCount,
        baggageCount: parsedBaggageCount,
        baggagePictures: parsedBaggagePictures,
        // successUrl: "flythru://paymentsuccess",
        // errorUrl: "flythru://paymentfailed",
      };
      console.log("values CREATE ORDER", requestData);

      await paymentApi(requestData);
    },
  });

  // pament api handler

  // const paymentApi = async (values) => {
  //   const token = await AsyncStorage.getItem("authToken");

  //   if (!token) {
  //     toast.show("No token found. Please log in.");
  //     return;
  //   }

  //   try {
  //     const res = await PAYEMNT_API(values, token);
  //     console.log(res.data.message);
  //     console.log(res);
  //     setPrice(res.data.price)
  //     setPickupdate(res.data.date)
  //     setPickuploaction(res.data.baggage.pickUpLocation)
  //     toast.show(res.data.message);
  //     setPaymentUrl(res.data.paymentUrl);  // Store URL from backend
  //     console.log("URLLLLLL", paymentUrl )

  //   } catch (error) {
  //     console.log("Error sending code:", error?.response);
  //     setApiErr(error?.response?.data?.message || "error occured");
  //   }
  // };

  const paymentApi = async (values) => {
    const token = await AsyncStorage.getItem("authToken");

    if (!token) {
      toast.show("No token found. Please log in.");
      return;
    }

    try {
      const res = await PAYEMNT_API(values, token);

      console.log("Payment API Response:", res.data);

      const orderIdFromRes = res.data.orderId;
      const userIdFromRes = res.data.baggage?.userId;
      const baggageIdFromRes = res.data.baggage?.id;

      setPrice(res.data.price);
      setPickupdate(res.data.date);
      setPickuploaction(res.data.baggage.pickUpLocation);
      setOrderId(orderIdFromRes);
      setUserId(userIdFromRes);
      setBaggageId(baggageIdFromRes);
      setPaymentUrl(res.data.paymentUrl);

      // Log here after extracting directly
      console.log("okieeeeeeeeeeeeeee", {
        orderId: orderIdFromRes,
        userId: userIdFromRes,
        baggageId: baggageIdFromRes,
      });

      toast.show(res.data.message);
    } catch (error) {
      console.log("Error sending code:", error?.response);
      setApiErr(error?.response?.data?.message || "error occurred");
    }
  };

  useEffect(() => {
    console.log(date, time);
  }, [date, time]);

  const getUserName = async () => {
    try {
      const name = await AsyncStorage.getItem("user_name");
      if (name !== null) {
        console.log("Retrieved user name:", name);
        return name;
      } else {
        console.log("No user name found.");
        router.push("/profile/editprofile");
        return "";
      }
    } catch (error) {
      console.error("Failed to retrieve the user name:", error);
      return "";
    }
  };
  useEffect(() => {
    const fetchUserName = async () => {
      const name = await getUserName();
      setUserName(name);
    };
    fetchUserName();
  }, []);

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
              {/* <Image
                source={dp}
                className="h-16 w-16 rounded-full mr-4"
                resizeMode="cover" 
              /> */}

              <View>
                <Text className=" text-3xl font-thin">{userName}</Text>
                {/* <Text>Dubai</Text> */}
              </View>
            </View>

            <View>
              <Text className="text-[#164F90] text-2xl font-bold">
                {applanguage === "eng"
                  ? Translations.eng.total
                  : Translations.arb.total}{" "}
                : {price}
              </Text>
              <Text>
                {pickupdate} {time}{" "}
              </Text>
            </View>
          </View>

          <View className="flex flex-row justify-start gap-x-5 items-center w-[90%] m-auto">
            <Image
              source={verticalline}
              className="h-36"
              resizeMode="contain"
            />

            <View className="flex-col gap-5">
              <View className="flex-col gap-3">
                <Text className="text-[#164F90] text-xl font-bold">
                  {applanguage === "eng"
                    ? Translations.eng.pick_up
                    : Translations.arb.pick_up}{" "}
                </Text>
                <Text className="text-lg">{pickuploaction}</Text>
              </View>

              <View className="flex-col gap-3">
                <Text className="text-[#164F90] text-xl font-bold">
                  {applanguage === "eng"
                    ? Translations.eng.drop_off
                    : Translations.arb.drop_off}{" "}
                </Text>
                <Text className="text-lg">Airport</Text>
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
              thumbIconComponent={() => (
                <AntDesign name="arrowright" size={24} color="black" />
              )}
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
              //   onSwipeSuccess={() => {
              //     console.log("Booking Confirmed!");
              //     router.push("/activities/bookingdetails")
              //   }
              // }

              onSwipeSuccess={() => {
                console.log("Booking Confirmed!");

                if (orderId && userId && baggageId) {
                  router.push({
                    pathname: "/activities/bookingdetails",
                    params: {
                      orderId,
                      userId,
                      baggageId,
                    },
                  });
                } else {
                  toast.show("Missing booking details. Please try again.");
                }
              }}

              //   onSwipeSuccess={() => {
              //     console.log("Booking Confirmed!");
              //     if (paymentUrl) {
              //       Linking.openURL(paymentUrl).catch((err) =>
              //         console.error("Failed to open URL:", err)
              //       );
              //     } else {
              //       console.error("No payment URL found");
              //     }
              //   }
              // }
            />
          </View>
        </View>
      </RBSheet>
    );
  };

  useEffect(() => {
    console.log("pickUpLocation updated:", formik.values.pickUpLocation);
  }, [formik.values.pickUpLocation]);
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
          <Text
            className="text-[18px] text-white ml-3"
            style={{ fontFamily: "CenturyGothic" }}
          >
            {applanguage === "eng"
              ? Translations.eng.select_location
              : Translations.arb.select_location}{" "}
          </Text>
        </View>
      </View>
      <View className="bg-white self-center absolute top-36 z-10  p-6 rounded-2xl w-[90%] shadow-lg">
        

      <View className="flex-row my-2 items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">

      <SelectDropdown
    data={emojisWithIcons}
    onSelect={(selectedItem, index) => {
      console.log(selectedItem, index);
    }}
    renderButton={(selectedItem, isOpened) => {
      return (
        <View style={styles.dropdownButtonStyle}>
          {selectedItem && (
            <Icon name={selectedItem.icon} style={styles.dropdownButtonIconStyle} />
          )}
          <Text style={styles.dropdownButtonTxtStyle}>
            {(selectedItem && selectedItem.title) || 'Select your mood'}
          </Text>
          <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
        </View>
      );
    }}
    renderItem={(item, index, isSelected) => {
      return (
        <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
          <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
          <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
        </View>
      );
    }}
    showsVerticalScrollIndicator={false}
    dropdownStyle={styles.dropdownMenuStyle}
  />

</View>


        <View className="flex-row my-2 items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
          <TextInput
            placeholder={
              applanguage === "eng"
                ? Translations.eng.pick_up_location
                : Translations.arb.pick_up_location
            }
            className="flex-1 h-[30px]"
            placeholderTextColor="#2D2A29"
            value={formik.values.pickUpLocation}
            onChangeText={(text) => {
              formik.setFieldValue("pickUpLocation", text);
                         }}
          
          />



          <Ionicons
            name="search-outline"
            size={26}
            color="#194F90"
            className="bg-[#194F901A] p-2 rounded-xl"
          />

        </View>

        <View  className={`flex-row my-2 items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 ${showSuggestions?"-z-10 ":""}`}>
          <TextInput
            placeholder={
              applanguage === "eng"
                ? Translations.eng.pick_up_timings
                : Translations.arb.pick_up_timings
            }
            className="flex-1 h-[30px]"
            placeholderTextColor="#2D2A29"
            value={time}
            editable={false}
          />
          <MaterialCommunityIcons
            name="clock-outline"
            size={26}
            color="#194F90"
            className="bg-[#194F901A] p-2 rounded-xl"
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            formik.handleSubmit();

            locationrefRBSheet.current.open();
          }}
          className={`bg-[#FFB800] rounded-lg py-4 mt-2 ${showSuggestions?"-z-10":""}`}
        >
          <Text className="text-center text-black font-semibold text-base">
            {applanguage === "eng"
              ? Translations.eng.submit
              : Translations.arb.submit}
          </Text>
        </TouchableOpacity>
      </View>
      {/* Safe Area Content */}
      {/* <ScrollView className="flex-1" contentContainerStyle={{}}>
         

        

        </ScrollView> */}
      <View style={styles.mapContainer}>
        {longitude && latitude ? (
          <MapView
            style={styles.map}
            showsUserLocation={true}
            region={{
              longitude: longitude,
              latitude: latitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {/* {latitude && longitude && (
              <Marker
                coordinate={{ longitude: longitude, latitude: latitude }}
              />
            )} */}
          </MapView>
        ) : (
          <Text>Loading Map...</Text> // Show a placeholder while location is being fetched
        )}
      </View>

      {/* <Image source={mapimg} className="h-full " /> */}
    </View>
  );
};

export default selectlocation;

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    width: "100%",
    height: "60%",
    // marginTop: 0,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

//   initialRegion={{
//     latitude: 37.78825,
//     longitude: -122.4324,
//     latitudeDelta: 0.1,
//     longitudeDelta: 0.1,
//   }}

{
  /* <View className="flex-row my-2 items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
    <TextInput
      placeholder="Drop Off Location"
      className="flex-1 h-[30px]"
      onChangeText={formik.handleChange("dropOffLocation")}
      onBlur={formik.handleBlur("dropOffLocation")}
      value={formik.values.dropOffLocation}
      placeholderTextColor="#2D2A29"
    />
  <Ionicons name="search-outline" size={26} color="#194F90" className="bg-[#194F901A] p-2 rounded-xl"/>
  </View> */
}
