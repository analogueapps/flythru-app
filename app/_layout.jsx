import { Stack } from "expo-router";
import "../global.css";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider } from "../UseContext/AuthContext";
import { LanguageContext } from "../customhooks/languageContext";
// import Flash from "./flash";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import { NotificationProvider } from "../UseContext/notifications";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { FlightProvider } from "../UseContext/useFlightContext";
import Toast from "react-native-toast-message";
import { NetworkProvider } from "../UseContext/NetworkContext";
import { NetworkErrorModal } from "./networkmodel";

SplashScreen.preventAutoHideAsync(); // Prevent splash from hiding immediately

const _layout = () => {
  const [fontsLoaded] = useFonts({
    CenturyGothic: require("../assets/fonts/centurygothic.ttf"),
    Lato: require("../assets/fonts/Lato-Regular.ttf"),

  });

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      if (status !== 'granted') {
        alert("Permission for notifications not granted");
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    async function registerForPushNotificationsAsync() {
      if (!Device.isDevice) {
        alert("Must use physical device");
        return;
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

     


      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("Expo Push Token:", token);
      return token;
    }

    async function checkFirstTimeUser() {
      try {
        await AsyncStorage.removeItem("hasLaunched"); // ✅ remove this in production
        const firstLaunch = await AsyncStorage.getItem("hasLaunched");

        // 🔔 Register push notifications
        await registerForPushNotificationsAsync();
      } catch (error) {
        console.error("Error in init:", error);
        // setShowFlash(false);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    checkFirstTimeUser();
  }, []);

  return (
    <>
      <NetworkProvider>
        <NotificationProvider>
          <LanguageContext>
            <AuthProvider>
              <FlightProvider>
                <Stack>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="(auth)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="fatoorah"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="nointernet"
                    options={{ headerShown: false }}
                  />
                </Stack>
                <Toast />
              </FlightProvider>
            </AuthProvider>
          </LanguageContext>
        </NotificationProvider>
        <NetworkErrorModal />
      </NetworkProvider>
    </>
  );
};

export default _layout;

{
  /* <Stack.Screen name="index" /> */
}
