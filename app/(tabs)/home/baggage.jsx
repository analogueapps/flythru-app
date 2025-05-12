import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import images from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Plus, Minus } from "lucide-react-native";
import TempAirWaysLogo from "../../../assets/svgs/tempAirways";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router, useLocalSearchParams } from "expo-router";
import PlaneIcon from "../../../assets/svgs/PlaneSvg";
import * as ImagePicker from "expo-image-picker";
import Feather from "@expo/vector-icons/Feather";
import RBSheet from "react-native-raw-bottom-sheet";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFormik } from "formik";
import { langaugeContext } from "../../../customhooks/languageContext";
import Translations from "../../../language";
import { baggageSchema } from "../../../yupschema/baggageSchema";
import Toast from "react-native-toast-message";

const baggage = () => {
  const insets = useSafeAreaInsets();
  const imagerefRBSheet = useRef();
  const { flightData, departureDate } = useLocalSearchParams();
  const flight = JSON.parse(flightData);
  const [persons, setPersons] = useState("1");
  const [bags, setBags] = useState("1");
  const [bagimages, setBagimages] = useState([]);
  const { applanguage } = langaugeContext();

  const numberOfPersons = (type) => {
    const numericPersons = parseInt(persons, 10) || 0;

    if (type === "increase" && numericPersons < 10) {
      const newValue = numericPersons + 1;
      setPersons(newValue.toString());
      formik.setFieldValue("personsCount", newValue);
    } else if (type === "decrease" && numericPersons > 1) {
      const newValue = numericPersons - 1;
      setPersons(newValue.toString());
      formik.setFieldValue("personsCount", newValue);
    }
  };

  const numberOfBags = (type) => {
    const numericBags = parseInt(persons, 10) || 0;
    if (type === "increasebags" && numericBags < 10) {
       const newValue = numericBags + 1;
      setBags(newValue.toString());
   
        formik.setFieldValue("baggageCount", newValue);
        // return newValue;
      
    } else if (type === "decreasebags" && bags > 1) {
       const newValue = numericBags - 1;
      setBags(newValue.toString());
        formik.setFieldValue("baggageCount", newValue);
      
    }
  };

  const removeImage = (index) => {
    setBagimages((prev) => {
      const updatedImages = prev.filter((_, i) => i !== index);
      formik.setFieldValue("baggagePictures", updatedImages);
      return updatedImages;
    });
  };

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    formik.setValues({
      personsCount: persons,
      baggageCount: bags,
      baggagePictures: bagimages,
    });
  }, [persons, bags, bagimages]);

  const pickImage = async () => {
    if (bagimages.length >= 10) {
      alert("You can only upload up to 10 images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const newImage = result.assets[0].uri;
      const image = result.assets[0];
      const imageSizeInMB = (image.base64.length * (3 / 4)) / (1024 * 1024);

      if (imageSizeInMB > 5) {
        Toast.show({
          type: "error",
          text1: "Image must be smaller than 5MB.",
          position: "top",
          visibilityTime: 2000,
          autoHide: true,
          topOffset: 40,
        });
        return;
      }
      setBagimages((prev) => {
        const updatedImages = [...prev, newImage];
        formik.setFieldValue("baggagePictures", updatedImages);
        return updatedImages;
      });
    }
  };

  const takePhoto = async () => {
    if (bagimages.length >= 10) {
      alert("You can only upload up to 10 images.");
      return;
    }
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const newImage = result.assets[0].uri;
      const image = result.assets[0];
      const imageSizeInMB = (image.base64.length * (3 / 4)) / (1024 * 1024);

      if (imageSizeInMB > 5) {
        Toast.show({
          type: "error",
          text1: "Image must be smaller than 5MB.",
          position: "top",
          visibilityTime: 2000,
          autoHide: true,
          topOffset: 40,
        }); return;
      }
      setBagimages((prev) => {
        const updatedImages = [...prev, newImage];
        formik.setFieldValue("baggagePictures", updatedImages);
        return updatedImages;
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      personsCount: persons,
      baggageCount: bags,
      baggagePictures: [],
    },
    validationSchema: baggageSchema(applanguage),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      console.log("values", values);
     
   
      router.push({
        pathname: "/home/slots",
        params: {
          personsCount: String(values.personsCount),
          baggageCount: String(values.baggageCount),
          baggagePictures: JSON.stringify(values.baggagePictures),
          flightData: JSON.stringify(flight),
          departureDate: departureDate
        },
      });
    },
  });

  console.log("Formik errors:", formik.errors);

  const handleImagePicker = () => {
    return (
      <RBSheet
        ref={imagerefRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        draggable={false}
        height={Dimensions.get("window").height / 3.5}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
          container: {
            backgroundColor: "#fff",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -3, // Lift shadow upwards
            },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5, // For Android shadow
          },
          draggableIcon: {
            backgroundColor: "#ccc",
            width: 40,
            height: 5,
            borderRadius: 10,
          },
        }}
      >
        <View className="p-3 rounded-2xl flex-col gap-y-6  w-[90%] m-auto">
          <Text className="text-center mb-4 pb-4 border-b-[1px] border-[#E0E0E0] text-2xl font-bold text-[#164F90]" style={{ fontFamily: "Lato" }}>
            Upload Photo
          </Text>

          <View className="flex flex-row justify-evenly ">
            <View className="">
              <TouchableOpacity
                className=" border-2 border-[#164F90] p-3 rounded-2xl border-dashed"
                onPress={takePhoto}
              >
                <Feather
                  name="camera"
                  size={50}
                  color="#164F90"
                  className="m-auto w-max "
                />
                <Text className="mt-2 font-bold" style={{ fontFamily: "Lato" }}>Click From Camera</Text>
              </TouchableOpacity>
            </View>

            <View className="">
              <TouchableOpacity
                className=" border-2 border-[#164F90] p-3 rounded-2xl  border-dashed"
                onPress={pickImage}
              >
                <FontAwesome
                  name="photo"
                  size={50}
                  color="#164F90"
                  className="m-auto "
                />
                <Text className="mt-2 font-bold" style={{ fontFamily: "Lato" }}>Select From Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RBSheet>
    );
  };

  const DashedLine = ({ dashCount = 30, dashColor = 'white' }) => (
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
      {handleImagePicker()}
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
              ? Translations.eng.baggage_details
              : Translations.arb.baggage_details}
          </Text>
        </View>
        <View className="flex-row items-center justify-between px-4 mt-8">
          <View className="flex-col items-center">
            <Text className="text-2xl font-bold text-white" style={{ fontFamily: "Lato" }}>
              {flight.departure.iata}
            </Text>
            <Text
              className="text-white "
              style={{
                flexWrap: "wrap",
                wordBreak: "break-word",
                fontFamily: "Lato"

              }}

            >
              {/* {flight.departure.airport} */}Departure
            </Text>
          </View>
          {/* <View className="flex-1 items-center px-2">
            <View className="w-full flex-row items-center justify-center ">
              <View className="flex-1 h-[1px] border-t border-dashed border-white relative">
                <View className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 px-2">
                  <PlaneIcon />
                </View>
              </View>
            </View>
          </View> */}

          <View className="flex-1 items-center px-2">
            <View className="w-full flex-row items-center justify-center">
              <View className="flex-1 relative justify-center">
                <DashedLine dashColor="white" />
                <View className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 px-2 bg-transparent z-10">
                  <PlaneIcon />
                </View>
              </View>
            </View>
          </View>

          <View className="flex-col items-center">
            <Text className="text-2xl font-bold text-white" style={{ fontFamily: "Lato" }}>
              {flight.arrival.iata}
            </Text>
            <Text className="text-white " style={{
              flexWrap: "wrap",
              wordBreak: "break-word",
              fontFamily: "Lato"

            }}>
              {/* {flight.arrival.airport} */}
              Arrival</Text>
          </View>
        </View>
      </View>
      <View
        className="bg-white self-center absolute top-[170px] p-6 z-10 rounded-xl w-[90%] shadow-lg"
        style={{
          maxHeight: "79%",
        }}
      >
        <ScrollView className="" showsVerticalScrollIndicator={false}>
          {/* Number of Persons */}
          <View className="mb-6">
            <Text className="text-[#164F90] font-bold text-lg mb-3" style={{ fontFamily: "Lato" }}>
              {applanguage === "eng"
                ? Translations.eng.number_of_persons
                : Translations.arb.number_of_persons}
            </Text>
            <View className="border border-[#F2F2F2] bg-[#FBFBFB] flex-row items-center justify-between p-2 rounded-xl">
              <Text className="text-[#164F90] font-semibold text-lg" style={{ fontFamily: "Lato" }}>
                {applanguage === "eng"
                  ? Translations.eng.number_of_persons
                  : Translations.arb.number_of_persons}{" "}
              </Text>
              <View className="flex-row items-center gap-x-2 bg-[#194f9027] px-3 py-2 rounded-lg">
                <TouchableOpacity
                  className="mr-2"
                  onPress={() => numberOfPersons("decrease")}
                >
                  <Minus color={"#194F90"} size={20} />
                </TouchableOpacity>
                {/* <Text className="text-[#194f90]" style={{ fontFamily: "Lato" }}>{persons}</Text> */}
                {/* <TextInput value={persons} 
                onChange={(e) => {
                  const value = e.target.value
                  if (value) {
                    const numericValue = value.replace(/[^0-9]/g, "");
                    setPersons(numericValue)
                  }
                }} keyboardType="numeric" /> */}
                <TextInput
                  value={persons}
                  onChangeText={(value) => {
                    const numericValue = value.replace(/[^0-9]/g, "");
                    setPersons(numericValue);
                    formik.setFieldValue("personsCount", numericValue);
                  }}
                  keyboardType="numeric"
                  className="text-[#194f90] w-10"
                  style={{ fontFamily: "Lato", minWidth: 30, textAlign: "center" }}
                />
                <TouchableOpacity

                  className="ml-3"
                  onPress={() => numberOfPersons("increase")}
                >
                  <Plus color={"#194F90"} size={20} />
                </TouchableOpacity>
              </View>
            </View>
                <Text className="text-red-500 text-[11px]">{formik.errors.personsCount}</Text>
          </View>
          {/* Baggage */}
          <View className="mb-6">
            <Text className="text-[#164F90] font-bold text-lg mb-3" style={{ fontFamily: "Lato" }}>
              {applanguage === "eng"
                ? Translations.eng.baggage
                : Translations.arb.baggage}{" "}
            </Text>
            <View className="border border-[#F2F2F2] bg-[#FBFBFB] flex-row items-center justify-between p-2 rounded-xl">
              <Text className="text-[#164F90] font-semibold text-lg" style={{ fontFamily: "Lato" }}>
                {applanguage === "eng"
                  ? Translations.eng.checked_in_bags
                  : Translations.arb.checked_in_bags}
              </Text>
              <View className="flex-row items-center gap-x-2 bg-[#194f9027] px-3 py-2 rounded-lg">
                <TouchableOpacity className="mr-2 ">
                  <Minus
                    color={"#194F90"}
                    size={20}
                    onPress={() => numberOfBags("decreasebags")}
                  />
                </TouchableOpacity>
                {/* <Text className="text-[#194f90]" style={{ fontFamily: "Lato" }}>{bags}</Text> */}
                 <TextInput
                  value={bags}
                  onChangeText={(value) => {
                    const numericValue = value.replace(/[^0-9]/g, "");
                    setBags(numericValue);
                    formik.setFieldValue("baggageCount", numericValue);
                  }}
                  keyboardType="numeric"
                  className="text-[#194f90] w-10"
                  style={{ fontFamily: "Lato", minWidth: 30, textAlign: "center" }}
                />
                <TouchableOpacity className="ml-3">
                  <Plus
                    color={"#194F90"}
                    size={20}
                    onPress={() => numberOfBags("increasebags")}
                  />
                </TouchableOpacity>
              </View>
            </View>
                 <Text className="text-red-500 text-[11px]">{formik.errors.baggageCount}</Text>
          </View>
          {/* Image Upload */}
          <View className="mb-6">
            <TouchableOpacity
              className="border border-dashed border-[#8B8B8B] rounded-xl p-6 items-center"
              onPress={() => {
                imagerefRBSheet.current.open();
              }}
            >
              <Text className="text-[#515151] mb-1" style={{ fontFamily: "Lato" }}>
                {applanguage === "eng"
                  ? Translations.eng.upload_image
                  : Translations.arb.upload_image}
              </Text>
            </TouchableOpacity>
            <Text className="text-[#2D2A29] text-sm" style={{ fontFamily: "Lato" }}>
              {applanguage === "eng"
                ? Translations.eng.max_file_size
                : Translations.arb.max_file_size}
            </Text>
            <View className="flex-row flex-wrap mt-3">
              {bagimages.map((img, index) => (
                <View
                  key={index}
                  className="bg-gray-100 rounded-md px-3 py-1 mr-2 mb-2 flex-row items-center"
                >
                  <Image
                    source={{ uri: img }}
                    className="w-16 h-16 rounded-md mr-2"
                    style={{ resizeMode: "cover" }}
                  />
                  <TouchableOpacity onPress={() => removeImage(index)}>
                    <Text className="text-gray-400" style={{ fontFamily: "Lato" }}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            // onPress={()=>formik.handleSubmit()}
            onPress={() => {

              formik.handleSubmit();

              // router.push({
              //   pathname: "/home/slots",
              //   params: { flightData: JSON.stringify(flight) },
              // });
            }}
            className="bg-[#FFB800] rounded-xl py-4"
          >
            <Text className="text-center text-black font-semibold" style={{ fontFamily: "Lato" }}>
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

export default baggage;
