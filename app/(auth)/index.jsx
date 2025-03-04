import {
  View,
  Text,
  Pressable,
  Animated,
  TextInput,
  Platform,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SvgGoogle from "../../assets/svgs/GoogleIcon";
import SvgApple from "../../assets/svgs/AppleIcon";
import images from "../../constants/images";
import { router } from "expo-router";

const Index = () => {
  const [activeTab, setActiveTab] = useState("signup");
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const widthAnim = useRef(new Animated.Value(0)).current;

  const animateTab = () => {
    const toValue = tab === "login" ? 0 : 1;
    setActiveTab(tab);

    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue,
        useNativeDriver: true,
        friction: 8,
      }),
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 550,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 550,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(widthAnim, {
        // Add this animation
        toValue,
        useNativeDriver: false,
        friction: 8,
      }),
    ]).start();
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1">
        <View className="flex-1 items-center">
          {/* <Text className="text-4xl font-black text-black py-4">LOGO</Text> */}
          <Image
            source={images.mainLogo}
            className="w-[125px] h-auto"
            resizeMode="contain"
          />

          {/* Tab Headers */}
          <View className="flex-row mx-8 relative rounded-full my-4 bg-blue-400">
            <Animated.View
              style={{
                flex: widthAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1.2, 0.8],
                }),
              }}
            >
              <Pressable
                onPress={() => animateTab("login")}
                style={{
                  backgroundColor:
                    activeTab === "login" ? "#164E8D" : "#E3F8F9",
                }}
                className="items-center py-3 rounded-l-full"
              >
                <Text
                  className={`text-lg font-semibold ${
                    activeTab === "login" ? "text-white " : "text-[#164E8D]"
                  }`}
                >
                  Log In
                </Text>
              </Pressable>
            </Animated.View>
            <View className="w-2 bg-white" />
            <Animated.View
              style={{
                flex: widthAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1.2],
                }),
              }}
            >
              <Pressable
                onPress={() => animateTab("signup")}
                style={{
                  backgroundColor:
                    activeTab === "signup" ? "#164E8D" : "#E3F8F9",
                }}
                className="items-center py-3 rounded-r-full"
              >
                <Text
                  className={`text-lg font-semibold ${
                    activeTab === "signup" ? "text-white" : "text-[#164E8D]"
                  }`}
                >
                  Sign Up
                </Text>
              </Pressable>
            </Animated.View>
          </View>

          {/* Form Container */}
          <Animated.View
            className="w-full px-4 pt-4"
            style={{ opacity: fadeAnim }}
          >
            {activeTab === "login" ? (
              <View className="">
                {/* Add your login form components here */}
                <Text className="py-4 text-[18px] font-normal text-center">
                  Login to your account
                </Text>
                <TextInput
                  className={`bg-[#f2f2f2] border h-14 px-2 my-4 py-2 rounded-lg border-[#8B8B8B] w-full`}
                  placeholder="Enter email Id/ Phone Number"
                />
                <TextInput
                  className={`bg-[#f2f2f2] border h-14 px-2 py-2 my-4 rounded-lg border-[#8B8B8B] w-full`}
                  placeholder="Enter Password"
                />
                <TouchableOpacity
                  onPress={() => router.push("/verifyotp")}
                  className="bg-[#FFB648] rounded-lg py-4 mx-4 mt-4"
                >
                  <Text className="text-center text-[#08203C] font-semibold text-lg">
                    Log In
                  </Text>
                </TouchableOpacity>
                <View className="flex flex-row items-center justify-evenly mt-12 px-3">
                  <View className="flex-1 h-[1px] bg-black" />
                  <Text className="mx-2">OR</Text>
                  <View className="flex-1 h-[1px] bg-black" />
                </View>
                <View className="flex flex-row items-center justify-center gap-x-8 py-10">
                  <TouchableOpacity>
                    <SvgGoogle />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <SvgApple />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity className="self-center">
                  <Text className="text-[#0F7BE6] text-lg">
                    Skip & Continue as a Guest
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="">
                {/* Add your login form components here */}
                <Text className="py-4 text-[18px] font-normal text-center">
                  Sign Up to Register
                </Text>
                <TextInput
                  className={`bg-[#f2f2f2] border h-14 px-2 my-4 py-2 rounded-lg border-[#8B8B8B] w-full`}
                  placeholder="Enter email Id"
                />
                <TextInput
                  className={`bg-[#f2f2f2] border h-14 px-2 my-4 py-2 rounded-lg border-[#8B8B8B] w-full`}
                  placeholder="Enter Phone Number"
                />
                <TextInput
                  className={`bg-[#f2f2f2] border h-14 px-2 py-2 my-4 rounded-lg border-[#8B8B8B] w-full`}
                  placeholder="Enter Password"
                />
                <TouchableOpacity
                  onPress={() => router.push("/verifyotp")}
                  className="bg-[#FFB648] rounded-lg py-4 mx-4 mt-4"
                >
                  <Text className="text-center text-[#08203C] font-semibold text-lg">
                    Sign Up
                  </Text>
                </TouchableOpacity>
                <View className="flex flex-row items-center justify-evenly mt-8 px-3">
                  <View className="flex-1 h-[1px] bg-black" />
                  <Text className="mx-2">OR</Text>
                  <View className="flex-1 h-[1px] bg-black" />
                </View>
                <View className="flex flex-row items-center justify-center gap-x-8 py-6">
                  <TouchableOpacity>
                    <SvgGoogle />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <SvgApple />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity className="self-center">
                  <Text className="text-[#0F7BE6] text-lg">
                    Skip & Continue as a Guest
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
