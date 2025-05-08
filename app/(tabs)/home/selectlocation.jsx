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

  const [hasVisited, setHasVisited] = useState(false);

useEffect(() => {
  const checkVisit = async () => {
    const value = await AsyncStorage.getItem('hasVisitedLocationSheet');
    if (value !== 'true') {
      // First time visit
      locationrefRBSheet.current?.open();
      await AsyncStorage.setItem('hasVisitedLocationSheet', 'true');
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
      const formattedAddress = `${geo.name || ""} ${geo.street || ""}, ${
        geo.city || ""
      }`;
      setAddress(formattedAddress);
      formik.setFieldValue("pickUpLocation", formattedAddress);
    } catch (error) {
      console.error("Reverse Geocode Error", error);
    }
  };

  const searchLocation = async () => {
    const text = formik.values.pickUpLocation;

    if (text.length > 2) {
      try {
        const results = await Location.geocodeAsync(text);
        if (results.length > 0) {
          const { latitude, longitude } = results[0];
          setMarkerCoords({ latitude, longitude });
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      }
    }
  };

  const handleLocationInput = (text) => {
    formik.setFieldValue("pickUpLocation", text);
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        // Toast.show("No token found. Please log in.");
        Toast.show({
          type: "info",
          text1: "Alert",
          text2: "Please login again",
        });
        return;
      }

      try {
        const res = await ALL_ADDRESS(token);
        const raw = res?.data?.addresses || [];

        const mapped = raw.map((addr) => ({
          label: `${addr.addressData}, ${addr.city}, ${addr.state}`,
          value: addr.id, // or addr._id if that's your backend key
          fullData: addr, // optional, if you want original data
        }));

        setAddresses(mapped); // ✅ Clean array now
      } catch (error) {
        console.log("Error fetching addresses:", error);
        setAddresses([]);
      }
    };

    fetchAddresses();
  }, []);

  const formik = useFormik({
    initialValues: {
      pickUpLocation: "",
      pickUpTimings: time,
    },
    validationSchema: selectlocationSchema(applanguage),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      // console.log("values CREATE ORDER", values);
      searchLocation
      // Include additional data for the API call
      const requestData = {
        ...values,
        date,
        time,
        personsCount: parsedPersonsCount,
        baggageCount: parsedBaggageCount,
        baggagePictures: parsedBaggagePictures,
        CallBackUrl: "flythru://home/paymentsuccess",
        ErrorUrl: "flythru://home/paymentfailed",
      };
      console.log("values CREATE ORDER", requestData);

      const success = await paymentApi(requestData);
      if (success) {
        locationrefRBSheet.current?.open();
      }

      // await paymentApi(requestData);
    },
  });


  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState !== 'active') {
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

    const token = await AsyncStorage.getItem("authToken");

    if (!token) {
      // Toast.show("No token found. Please log in.");
      Toast.show({
        type: "info",
        text1: "Alert",
        text2: "Please login again",
      });
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
      setPaymentUrl(res?.data?.paymentUrl);

      console.log("okieeeeeeeeeeeeeee", paymentUrl);

      Toast.show({
        type: "success",
        text1: "Success",
        text2: res.data.message,
      });

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
    const fetchUserName = async () => {
      const name = await getUserName();
      setUserName(name);
      console.log("User name set:", name);
    };
    fetchUserName();
  }, []);



  

  useEffect(() => {
    console.log("pickUpLocation updated:", formik.values.pickUpLocation);
  }, [formik.values.pickUpLocation]);
  return (
    <View className="flex-1">
      {/* Header Background Image */}
      {/* {handlelocation()} */}
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
                <Text className=" text-3xl font-thin" style={{ fontFamily: "Lato" }}>{userName}</Text>
                {/* <Text>Dubai</Text> */}
              </View>
            </View>

            <View>
              <Text className="text-[#164F90] text-2xl font-bold" style={{ fontFamily: "Lato" }}>
                {applanguage === "eng"
                  ? Translations.eng.total
                  : Translations.arb.total}{" "}
                : {price}
              </Text>
              <Text style={{ fontFamily: "Lato" }}>
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


            <View className="flex-col gap-5">
              <View className="flex-col gap-3">
                <Text className="text-[#164F90] text-xl font-bold" style={{ fontFamily: "Lato" }}>
                  {applanguage === "eng"
                    ? Translations.eng.pick_up
                    : Translations.arb.pick_up}{" "}
                </Text>
                <Text className="text-lg" style={{ fontFamily: "Lato" }}>{pickuploaction}</Text>
              </View>

              <View className="flex-col gap-3">
                <Text className="text-[#164F90] text-xl font-bold" style={{ fontFamily: "Lato" }}>
                  {applanguage === "eng"
                    ? Translations.eng.drop_off
                    : Translations.arb.drop_off}{" "}
                </Text>
                <Text className="text-lg" style={{ fontFamily: "Lato" }}>Airport</Text>
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
              onSwipeSuccess={() => {
                console.log("Booking Confirmed!");

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
      <View className="bg-white self-center absolute top-36 z-10  p-6 rounded-2xl w-[90%] shadow-lg"
       style={{
        elevation: 9, // 👈 Android shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.50,
        shadowRadius: 3.84,
      }}
      >
  

<View className="flex-row my-2 items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">

<SelectDropdown
    data={
      addresses.length > 0
        ? addresses
        : [{ label: "No address found", disabled: true }]
    }
    onSelect={(selectedItem, index) => {
      if (!selectedItem.disabled) {
        formik.setFieldValue("pickUpLocation", selectedItem.label);
      }
    }}
    buttonStyle={{
      width: 40,    // 👈 Keep button small so that icon fits
      height: 30,
      backgroundColor: "transparent",
      padding: 0,
      margin: 0,
    }}
    renderButton={(selectedItem, isOpened) => (
      <TouchableOpacity className="flex-row items-center justify-center">
        <Icon
          name={isOpened ? "chevron-up" : "chevron-down"}
          size={20}
          color="#6B7280"
          backgroundColor="#194F901A"
          className="mr-2 rounded-lg"
        />
      </TouchableOpacity>
    )}
    renderItem={(item, index, isSelected) => (
      <View
        className={`px-4 py-3 w-full ${
          isSelected ? "bg-gray-200" : "bg-white"
        }`}
      >
        <Text
          className={`text-base ${
            item.disabled ? "text-gray-400" : "text-gray-900"
          }`}
          style={{ fontFamily: "Lato" }}>
          {item.label}
        </Text>
      </View>
    )}
    dropdownOverlayStyle={{
      // backgroundColor: "transparent",
      backgroundColor: "#194F901A",
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
    }}
    dropdownStyle={{
      borderRadius: 12,
      backgroundColor: "#194F901A",
      borderColor: "#D1D5DB",
      borderWidth: 1,
      width: "70%",     // ✅ dropdown is centered with 90% width
      maxWidth: "70%",
      alignSelf: "center",
    }}
    showsVerticalScrollIndicator={false}
  />
  <TextInput
    placeholder={
      applanguage === "eng"
        ? Translations.eng.select_location
        : Translations.arb.select_location
    }
    className="flex-1 h-[30px]"
    placeholderTextColor="#2D2A29"
    value={formik.values.pickUpLocation}
    onChangeText={handleLocationInput}
  />



  <TouchableOpacity onPress={searchLocation}>
    <Ionicons
      name="search-outline"
      size={26}
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
          <Text className="text-red-500 w-[90%] mx-auto" style={{ fontFamily: "Lato" }}>
            {formik.errors.pickUpLocation}
          </Text>
        )}

        <View
          className={`flex-row my-2 items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 ${
            showSuggestions ? "-z-10 " : ""
          }`}
        >
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
            formik.handleSubmit(); // now opens RBSheet inside onSubmit
          }}
          style={{
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.50,
            shadowRadius: 3.84,
          }}
          className={`bg-[#FFB648] rounded-lg w-[90%] h-14 mx-auto mt-4 flex items-center justify-center${
            showSuggestions ? "-z-10" : ""
          }`}
        >
          {loading ? (
            <Animated.View
              style={{
                transform: [{ translateX }],
                width: 100,
                height: 100,
                alignSelf: "center",
              }}
            >
              <Image
                source={flightloader}
                style={{ width: 100, height: 100 }}
                resizeMode="contain"
              />
            </Animated.View>
          ) : (
            <Text className="text-center text-black font-semibold text-base" style={{ fontFamily: "Lato" }}>
              {applanguage === "eng"
                ? Translations.eng.submit
                : Translations.arb.submit}
            </Text>
          )}
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
          <Text style={{ fontFamily: "Lato" }}>Loading Map...</Text> // Show a placeholder while location is being fetched
        )}
      </View>

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
