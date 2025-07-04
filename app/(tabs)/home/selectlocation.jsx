import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Linking,
  AppState,
  FlatList,
  TouchableWithoutFeedback,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import images from "../../../constants/images";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { Alert } from "react-native";
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
import { useFormik } from "formik";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { langaugeContext } from "../../../customhooks/languageContext";
import Translations from "../../../language";
import selectlocationSchema from "../../../yupschema/selectLocationSchema";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";
import flightloader from "../../../assets/images/flightload.gif";
import Locationicon from "../../../assets/svgs/location";
import BookingSkeleton from "./BookingSkeleton";
import SuccessModal from "../../successmodal";

const selectlocation = () => {
  const insets = useSafeAreaInsets();
  const locationrefRBSheet = useRef();
  // const { longitude, latitude } = useExpoLocation();
  const { date, time, personsCount, baggageCount, baggagePictures } =
    useLocalSearchParams();
  const [apiErr, setApiErr] = useState("");
  const longitude = Number(useExpoLocation().longitude);
  const latitude = Number(useExpoLocation().latitude);
  const { applanguage } = langaugeContext();
  const [userName, setUserName] = useState("");
  const [price, setPrice] = useState([]);
  const [pickupdate, setPickupdate] = useState([]);
  const [pickuploaction, setPickuploaction] = useState([]);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loader, setLoader] = useState(false)

  const [alertActive, setAlertActive] = useState(false);
  const addressRefRBSheet = useRef();

  const parsedPersonsCount = personsCount ? parseInt(personsCount) : 0;
  const parsedBaggageCount = baggageCount ? parseInt(baggageCount) : 0;
  const parsedBaggagePictures = baggagePictures
    ? JSON.parse(decodeURIComponent(baggagePictures))
    : [];
  const [markerCoords, setMarkerCoords] = useState(null);

  const [addresses, setAddresses] = useState([]);
  const [filteredAddresses, setFilteredAddresses] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [baggageId, setBaggageId] = useState(null);
  const [shouldOpenSheet, setShouldOpenSheet] = useState(false);

  const [region, setRegion] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasVisited, setHasVisited] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const textInputRef = useRef(null);

  const dropdownRef = useRef();
  const [inputFocused, setInputFocused] = useState(false);
  const handleSelectOption = async (selectedItem) => {
    if (selectedItem.disabled) return;

    switch (selectedItem.action) {
      case "map":
        setTimeout(() => {
          router.push({
            pathname: "/home/selectlocationnext",
            params: { date, time, personsCount, baggageCount, baggagePictures }
          });
        }, 100)
        break;
      case "manual":
        Keyboard.dismiss()
        setTimeout(() => {
          router.push("/home/locaddress");
        }, 100)
        break;
      case "select":
        console.log(selectedItem);

        setInputValue(selectedItem.label);
        const coards = await Location.geocodeAsync(selectedItem.label)
        console.log("coards checking................", coards)
        // userLat: '',
        // userLng: '',
        formik.setFieldValue("userLat", coards[0].latitude);
        formik.setFieldValue("userLng", coards[0].longitude);
        console.log(coards);

        setMarkerCoords({ latitude: coards[0].latitude, longitude: coards[0].longitude })
        formik.setFieldValue("pickUpLocation", selectedItem.label);
        break;
    }
    setIsDropdownVisible(false);
  };

  const handleInputPress = () => {
    // Always show dropdown when input is pressed
    setIsDropdownVisible(true);
    textInputRef.current?.focus();
  };

  useEffect(() => {
    const checkVisit = async () => {
      const value = await AsyncStorage.getItem("hasVisitedLocationSheet");
      if (value !== "true") {
        // First time visit
        locationrefRBSheet.current?.open();
        await AsyncStorage.setItem("hasVisitedLocationSheet", "true");
      }
      setHasVisited(true); // Mark visited (used if needed elsewhere)
    };

    checkVisit();
  }, []);

  const translateX = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    translateX.setValue(-30); // Reset position

    Animated.loop(
      Animated.timing(translateX, {
        toValue: 100, // How far to move
        duration: 3000, // Slower movement
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();
  };

  // Run it when loading starts
  useEffect(() => {
    if (loading) {
      startAnimation();
    } else {
      translateX.stopAnimation();
      translateX.setValue(0); // Reset to start
    }
  }, [loading]);

  useEffect(() => {
    if (latitude && longitude) {
      setRegion({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setLoading(false);
    }


  }, [latitude, longitude]);

  const onRegionChangeComplete = async (newRegion) => {
    setRegion(newRegion);
    try {
      const [geo] = await Location.reverseGeocodeAsync({
        latitude: newRegion.latitude,
        longitude: newRegion.longitude,
      });
      const formattedAddress = `${geo.name || ""} ${geo.street || ""}, ${geo.city || ""
        }`;
      setAddress(formattedAddress);
      formik.setFieldValue("pickUpLocation", formattedAddress);
    } catch (error) {
      console.error("Reverse Geocode Error", error);
    }
  };

  // const searchLocation = async () => {
  //   const text = formik.values.pickUpLocation;

  //   if (text.length > 2) {
  //     try {
  //       const results = await Location.geocodeAsync(text);
  //       if (results.length > 0) {
  //         const { latitude, longitude } = results[0];
  //         setMarkerCoords({ latitude, longitude });
  //       }
  //     } catch (error) {
  //       console.error("Geocoding error:", error);
  //     }
  //   }
  // };





  const searchLocation = async () => {
    const text = formik.values.pickUpLocation;

    if (text.length <= 2) {
      Alert.alert(
        "Address is Required",
        "Please enter a valid pickup location.",
        [
          {
            text: "OK",
            onPress: () => {
              // Do NOT open the RBSheet here
            },
          },
        ]
      );
      return;
    }

    try {
      const results = await Location.geocodeAsync(text);

      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        console.log("📍 Searched Location:");
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
        setInputValue(text);
        formik.setFieldValue("userLat", latitude);
        formik.setFieldValue("userLng", longitude);
        // console.log(coards);

        setMarkerCoords({ latitude: latitude, longitude: longitude })
        // formik.setFieldValue("pickUpLocation", selectedItem.label);
        setMarkerCoords({ latitude, longitude });

        // ✅ Open RBSheet only after successful location search
        addressRefRBSheet.current?.open();
      } else {
        await handleFallbackToCurrentLocation();
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      await handleFallbackToCurrentLocation();
    }
  };



  const handleFallbackToCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required to use current location.");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      console.log("📍 Current Device Location:");
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });

      const fullAddress = `${address.name || ""}, ${address.street || ""}, ${address.city || address.subregion || ""
        }, ${address.region || ""}`.replace(/, ,/g, ",").trim();

      setMarkerCoords({ latitude, longitude });
      formik.setFieldValue("pickUpLocation", fullAddress);

      Alert.alert(
        "Invalid Location",
        "We couldn't find that location. Using your current location instead.",
        [
          {
            text: "OK",
            onPress: () => {
              addressRefRBSheet.current?.open();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      Alert.alert("Error", "Could not retrieve your current location. Please try again.");
    }
  };


  const handleLocationInput = (text) => {
    formik.setFieldValue("pickUpLocation", text);
  };

  // Fetch addresses when the screen gains focus

  useFocusEffect(
    useCallback(() => {
      const fetchAddresses = async () => {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          Toast.show({
            type: "info",
            text1: "Please login again",
          });
          return;
        }

        try {
          const res = await ALL_ADDRESS(token);
          const raw = res?.data?.addresses || [];
          console.log(raw);

          const mapped = raw.map((addr) => {
            const officialAddress = `${addr?.flatNo}-${addr?.floorNo}/${addr?.buildingNumber}, ${addr?.addressName} , ${addr?.block} , ${addr?.streetAddress}, ${addr?.area}, ${addr?.avenue}`;

            return {
              label: officialAddress,
              value: addr.id,
              fullData: addr,
            };
          });


          setAddresses(mapped);
          setFilteredAddresses(mapped);
        } catch (error) {
          console.log("Error fetching addresses:", error);
          setAddresses([]);
          setFilteredAddresses([])
        }
      };

      fetchAddresses();
    }, []) // 👈 only re-runs when screen gains focus
  );

  const formik = useFormik({
    initialValues: {
      userLat: '',
      userLng: '',
      pickUpLocation: "",
      pickUpTimings: time,
    },
    validationSchema: selectlocationSchema(applanguage),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      // console.log("values CREATE ORDER", values);
      searchLocation();
      addressRefRBSheet.current.open()
    },
  });

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState !== "active") {
        locationrefRBSheet.current?.close(); // ✅ close sheet when app goes background
        setShouldOpenSheet(false); // ✅ also reset the open flag
      }
    });

    return () => {
      subscription.remove(); // Clean up listener
    };
  }, []);

  // pament api handler

  const paymentApi = async (values) => {
    setLoading(true);
    setLoader(true)
    const token = await AsyncStorage.getItem("authToken");

    if (!token) {
      // Toast.show("No token found. Please log in.");
      Toast.show({
        type: "info",
        text1: "Please login again",
      });
      return;
    }

    try {
      const res = await PAYEMNT_API(values, token);

      console.log("Payment API Response:", res.data);

      const orderIdFromRes = res.data.orderId;
      const userIdFromRes = res.data.baggage?.userId;
      const baggageIdFromRes = res.data.baggage?.id;
      setUserName(res.data.baggage.name)
      setPrice(res.data.price);
      setPickupdate(res.data.baggage.date);
      setPickupdate(res.data.baggage.date);
      setPickuploaction(res.data.baggage.pickUpLocation);
      setOrderId(orderIdFromRes);
      setUserId(userIdFromRes);
      setBaggageId(baggageIdFromRes);
      setPaymentUrl(res?.data?.paymentUrl);
      // setShowSuccess(true)
      // console.log("okieeeeeeeeeeeeeee", paymentUrl);

      // Toast.show({
      //   type: "success",
      //   text1: "Success",
      //   text2: res.data.message,
      // });

      return true;
    } catch (error) {
      console.log("Error sending code:", error?.response);
      setApiErr(error?.response?.data?.message || "error occurred");
      if (error?.response?.data?.message === "User details are missing.") {
        Toast.show({
          type: "error",
          text1: "Please update your profile details.",
        });
        router.replace("/home/editpro");
      }
    } finally {
      setLoading(false);
      setLoader(false)
    }
  };

  useEffect(() => {
    console.log(date, time);
  }, [date, time]);

  // const getUserName = async () => {
  //   try {
  //     const name = await AsyncStorage.getItem("user_name");
  //     if (name !== null) {
  //       console.log("Retrieved user name:", name);
  //       return name;
  //     } else {
  //       console.log("No user name found.");
  //       return "";
  //     }
  //   } catch (error) {
  //     console.error("Failed to retrieve the user name:", error);
  //     return "";
  //   }
  // };

  const getUserName = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log("All AsyncStorage Keys:", keys); // See if 'user_name' exists

      const userName = await AsyncStorage.getItem("user_name");
      console.log("Fetched user_name:", userName); // See actual fetched value

      return userName ?? "";
    } catch (error) {
      console.error("Failed to retrieve the user name:", error);
      return "";
    }
  };


  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsDropdownVisible(true);
    });

    // const hideListener = Keyboard.addListener('keyboardDidHide', () => {
    //   setIsDropdownVisible(false);
    // });

    return () => {
      showListener.remove();
      // hideListener.remove();
    };
  }, []);




  useEffect(() => {
    console.log("pickUpLocation updated:", formik.values.pickUpLocation);
  }, [formik.values.pickUpLocation]);

  return (
    <View className="flex-1">
      {/* Header Background Image */}
      {/* {handlelocation()} */}
      {/* {showSuccess && (
        <SuccessModal
          visible={showSuccess}
          onClose={() => { setShowSuccess(false); locationrefRBSheet.current?.open(); }}
        />
      )} */}
      <RBSheet
        ref={addressRefRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        //   draggable={true}
        // height={Dimensions.get("window").height / 4.5}
        height={200}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
        }}
      >
        <View className="p-3 rounded-2xl flex-col gap-y-6 w-[90%] m-auto">
          {/* Address Header */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mt-4">
              <Text
                className="text-[16px] pb-2"
                style={{ fontFamily: "Lato" }}
              >
                {formik.values.pickUpLocation || "No address selected"}
              </Text>
            </View>

            {/* Divider */}
            <View className="flex-1 h-[1px] w-[90%] mx-auto border-t border-[#00000026] relative" />

            {/* Select Address Button */}
            <TouchableOpacity
              onPress={async () => {
                const requestData = {
                  ...formik.values,
                  date,
                  personsCount: parsedPersonsCount,
                  baggageCount: parsedBaggageCount,
                  baggagePictures: parsedBaggagePictures,
                  CallBackUrl: "flythru://home/paymentsuccess",
                  ErrorUrl: "flythru://home/paymentfailed",
                };

                console.log("values CREATE ORDER", requestData);

                const success = await paymentApi(requestData);
                if (success) {
                  setShowSuccess(true)

                  addressRefRBSheet.current?.close();

                  setTimeout(() => {
                    locationrefRBSheet.current?.open();
                  }, 300);
                }
                // setTimeout(() => {
                //   // formik.handleSubmit();
                //   locationrefRBSheet.current?.open(); // ✅ open location sheet manually
                // }, 500); // Give time for address sheet to close smoothly
              }}
              className="bg-[#FFB648] rounded-lg w-[80%] h-11 mx-auto mt-4 flex items-center justify-center"
              disabled={loader}
            >
              {!loader ? <Text
                className="text-center  text-[#164F90] font-bold text-lg"
                style={{ fontFamily: "Lato" }}
              >
                {applanguage === "eng"
                  ? Translations.eng.select_address
                  : Translations.arb.select_address}
              </Text> : <ActivityIndicator size="small" color="white" />}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </RBSheet>

      <RBSheet
        ref={locationrefRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        draggable={true}
        // height={200}
        height={Dimensions.get("window").height / 2}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
        }}
      >
        {paymentUrl ?
          <ScrollView keyboardShouldPersistTaps="handled" scrollEnabled={!isSwiping} contentContainerStyle={{
            flexGrow: 1,
          }}>

            {/* <View className="p-3 rounded-2xl flex-col gap-y-6  w-[90%] max-w-[400px] m-auto"> */}
            <View className="p-3 rounded-2xl flex-col justify-center items-center   gap-y-6  w-[90%] max-w-[400px] m-auto">

              <View className="flex flex-row w-full justify-between items-center mb-5 mt-7 gap-2">
                <View className="flex flex-row ">
                  {/* <Image
                source={dp}
                className="h-16 w-16 rounded-full mr-4"
                resizeMode="cover" 
              /> */}

                  <View>
                    <Text
                      className=" text-[24px] font-thin"
                      style={{ fontFamily: "Lato" }}
                    >
                      {userName}
                    </Text>
                    {/* <Text>Dubai</Text> */}
                  </View>
                </View>

                <View>
                  <Text
                    className="text-[#164F90] text-[18px] font-bold"
                    style={{ fontFamily: "Lato" }}
                  >
                    {applanguage === "eng"
                      ? Translations.eng.total
                      : Translations.arb.total}{" "}
                    : {price}
                  </Text>
                  <Text className="text-[14px]" style={{ fontFamily: "Lato" }}>
                    {pickupdate} {time}{" "}
                  </Text>
                </View>
              </View>

              <View className="flex flex-row justify-start gap-x-5 items-start w-[90%] m-auto">
                <Image
                  source={verticalline}
                  className="h-24 mt-3" // add negative margin-top
                  resizeMode="contain"
                />

                <View className="flex-col flex-1 gap-5">
                  <View className="flex-col gap-1">
                    <Text
                      className="text-[#164F90] text-[18px] font-bold"
                      style={{ fontFamily: "Lato" }}
                    >
                      {applanguage === "eng"
                        ? Translations.eng.pick_up
                        : Translations.arb.pick_up}{" "}
                    </Text>
                    <Text className="text-[15px]" numberOfLines={2} ellipsizeMode="tail" style={{ fontFamily: "Lato" }}>
                      {pickuploaction}
                    </Text>
                  </View>

                  <View className="flex-col gap-1">
                    <Text
                      className="text-[#164F90] text-[18px] font-bold"
                      style={{ fontFamily: "Lato" }}
                    >
                      {applanguage === "eng"
                        ? Translations.eng.drop_off
                        : Translations.arb.drop_off}{" "}
                    </Text>
                    <Text className="text-[15px]" style={{ fontFamily: "Lato" }}>
                      Airport
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-1 h-[1px] w-[75%] mx-auto border-t  border-[#00000026] relative" />

              <View className="flex flex-row justify-center">
                <SwipeButton
                  title="Swipe Right to Book"
                  thumbIconBackgroundColor="#FFB648"
                  thumbIconWidth={60}
                  thumbIconBorderColor="#FFB800"
                  thumbIconComponent={() => (
                    <AntDesign name="arrowright" size={24} color="#164F90" />
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
                  onSwipeStart={() => {
                    console.log("Swipe started");
                    setIsSwiping(true);
                  }}
                  onSwipeFail={() => {
                    console.log("Swipe failed");
                    setIsSwiping(false);
                  }}
                  onSwipeSuccess={() => {
                    console.log("Booking Confirmed!");
                    setIsSwiping(false);
                    if (locationrefRBSheet.current) {
                      locationrefRBSheet.current.close();
                    }

                    if (paymentUrl) {
                      router.push({
                        pathname: "/home/payment",
                        params: { paymentUrl, orderId },
                      });
                    } else {
                      console.error("No payment URL found");
                    }
                  }}
                />
              </View>
            </View>
          </ScrollView>
          :
          <BookingSkeleton />
        }
      </RBSheet>
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
        <View className="flex-row  items-center mt-5">
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
      <View
        className="bg-white self-center absolute top-36 z-10  p-6 rounded-2xl w-[90%] shadow-lg"
        style={{
          elevation: 9, // 👈 Android shadow
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          overflow: 'visible',
          shadowRadius: 3.84,
        }}
      >


        <View className="relative">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
          // onClose={()=>setIsDropdownVisible(false)}
          >
            <View className="relative flex-row my-2 items-center border-2 border-gray-300 rounded-xl px-4 py-2 bg-gray-50">




              {/* <TouchableWithoutFeedback onPress={() => setIsDropdownVisible(false)}> */}

              {/* </TouchableWithoutFeedback> */}
              {/* </Modal> */}
              <TextInput
                placeholder={
                  applanguage === "eng"
                    ? Translations.eng.select_location
                    : Translations.arb.select_location
                }
                className="flex-1 h-[30px]"
                placeholderTextColor="#2D2A29"
                value={inputValue || formik.values.pickUpLocation}
                onChangeText={(text) => {
                  setInputValue(text);
                  handleLocationInput(text); // Your existing handler
                  setIsDropdownVisible(true);
                  // Filter addresses by label
                  const filtered = addresses.filter((addr) =>
                    addr.label.toLowerCase().includes(text.toLowerCase())
                  );
                  if (text) {
                    setFilteredAddresses(filtered);
                  } else {
                    setFilteredAddresses(addresses);

                  }

                }}
                onFocus={() => setIsDropdownVisible(true)} // Open modal on focus
                onBlur={() => {
                  setTimeout(() => setIsDropdownVisible(false), 100);
                }}
              // pointerEvents="none"
              />

              <TouchableOpacity onPress={searchLocation}>
                <Ionicons
                  name="search-outline"
                  size={20}
                  color="#194F90"
                  style={{
                    backgroundColor: "#194F901A",
                    padding: 8,
                    borderRadius: 12,
                    marginLeft: 8,
                  }}
                />
              </TouchableOpacity>

            </View>
            {formik.touched.pickUpLocation && formik.errors.pickUpLocation && (
              <Text
                className="text-red-500 w-[90%] mx-auto"
                style={{ fontFamily: "Lato" }}
              >
                {formik.errors.pickUpLocation}
              </Text>
            )}
            {isDropdownVisible &&
              // <View style={{ flex: 1 }} className="absolute w-full top-20 left-0">
              <TouchableWithoutFeedback style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 9999, // very high
                backgroundColor: 'white', // or any opaque color
              }}>
                <View
                  style={{
                    backgroundColor: "white",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    width: "100%",
                    alignSelf: "center",
                    // marginTop: 180,
                    maxHeight: 240,
                  }}
                >
                  <ScrollView
                    style={{ flexGrow: 0 }}
                    showsVerticalScrollIndicator={true}
                    keyboardShouldPersistTaps="handled"
                  >
                    {[
                      {
                        label: applanguage === "eng"
                          ? Translations.eng.select_from_map
                          : Translations.arb.select_from_map, action: "map"
                      },
                      {
                        label: applanguage === "eng"
                          ? Translations.eng.enter_manually
                          : Translations.arb.enter_manually, action: "manual"
                      },
                      ...(filteredAddresses.length > 0
                        ? filteredAddresses.map((item) => ({
                          label: item.label,
                          action: "select",
                        }))
                        : [{ label: "No address found", disabled: true }]),
                    ].map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        // disabled={item.disabled}
                        onPress={() => {
                          Keyboard.dismiss();
                          handleSelectOption(item);
                        }}
                        className={`px-4 py-3 w-full  ${item.disabled ? "opacity-50" : ""}`}
                      >
                        <Text
                          className={`text-base ${item.disabled
                            ? "text-gray-400 border-b-[1px] border-gray-300 pb-6"
                            : item.action === "map" || item.action === "manual"
                              ? "text-[#194F90] border-b-[1px] border-gray-300 pb-6"
                              : "text-gray-800 border-b-[1px] border-gray-300 pb-6"
                            }`}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            }

            {/* <TouchableOpacity
              // onPress={() => addressRefRBSheet.current?.open()}
              onPress={() => formik.handleSubmit()}
              disabled={loading}
              className="bg-[#FFB648] z-10 rounded-lg w-[45%] h-11 mx-auto mt-4 flex items-center justify-center"
            >
              <Text className="text-center  text-[#164F90] font-bold text-lg">
                {applanguage === "eng"
                  ? Translations.eng.search
                  : Translations.arb.search}
              </Text>
            </TouchableOpacity>  */}

            <TouchableOpacity
              onPress={searchLocation}
              disabled={loading}
              className="bg-[#FFB648] z-10 rounded-lg w-[45%] h-11 mx-auto mt-4 flex items-center justify-center"
            >
              <Text className="text-center text-[#164F90] font-bold text-lg">
                {applanguage === "eng" ? Translations.eng.search : Translations.arb.search}
              </Text>
            </TouchableOpacity>

          </KeyboardAvoidingView>

        </View>

      </View>
      {/* Safe Area Content */}
      {/* <ScrollView className="flex-1" contentContainerStyle={{}}>
         

        

        // scrollEnabled={false}
        // zoomEnabled={false}
        // rotateEnabled={false}
        // pitchEnabled={false}
        </ScrollView> */}
      <View style={styles.mapContainer}>
        {longitude && latitude ? (
          <MapView
            style={styles.map}
            showsUserLocation={true}
            region={{
              latitude: markerCoords?.latitude || latitude,
              longitude: markerCoords?.longitude || longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: markerCoords?.latitude || latitude,
                longitude: markerCoords?.longitude || longitude,
              }}
            />
          </MapView>
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text style={{ fontFamily: "Lato" }}>Loading Map...</Text>
          </View>
        )}
      </View>

      {/* pin point */}

      {/* <View style={styles.mapContainer}>
        {!loading ? (
          <>
            <MapView
              style={styles.map}
              region={region}
              onRegionChangeComplete={onRegionChangeComplete}
              showsUserLocation={true}
            />

            <View style={styles.centerMarker}>
              <Ionicons name="location-sharp" size={32} color="#194F90" />
            </View>
          </>
        ) : (
          <Text>Loading Map...</Text>
        )}
      </View> */}

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
  centerMarker: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -16, // half of icon width
    marginTop: -32, // adjust based on icon height
    zIndex: 10,
  },
});

