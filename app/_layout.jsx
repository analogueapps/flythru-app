import { Stack } from "expo-router";
import "../global.css";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { ActivityIndicator, View } from "react-native";
import { ToastProvider } from "react-native-toast-notifications";
import { AuthProvider } from "../UseContext/AuthContext";
import { LanguageContext } from "../customhooks/languageContext";
import Flash from "./flash"; // Flash screen component
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import { NotificationProvider } from "../UseContext/notifications";

SplashScreen.preventAutoHideAsync(); // Prevent splash from hiding immediately

const _layout = () => {
  const [fontsLoaded] = useFonts({
    CenturyGothic: require("../assets/fonts/centurygothic.ttf"),
  });

  const [showFlash, setShowFlash] = useState(null); // Control flash screen visibility

  useEffect(() => {
    async function checkFirstTimeUser() {
      try {
        await AsyncStorage.removeItem("hasLaunched"); // ✅ Reset for testing
        const firstLaunch = await AsyncStorage.getItem("hasLaunched");

        if (firstLaunch === null) {
          await AsyncStorage.setItem("hasLaunched", "true");
          setShowFlash(true);

          setTimeout(() => {
            setShowFlash(false);
          }, 3000);
        } else {
          setShowFlash(false);
        }
      } catch (error) {
        console.error("Error checking AsyncStorage:", error);
        setShowFlash(false);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    checkFirstTimeUser();
  }, []);

  // Show a loader while fonts are loading
  if (!fontsLoaded || showFlash === null) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  // Show flash screen for 3 seconds on first launch
  if (showFlash) {
    return <Flash />;
  }

  // Normal app flow after the flash screen
  return (
    <NotificationProvider>
      <LanguageContext>
        <AuthProvider>
          <ToastProvider
            placement="bottom"
            animationType="slide-in"
            animationDuration={250}
          >
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="fatoorah" options={{ headerShown: false }} />
              <Stack.Screen name="index" />
            </Stack>
          </ToastProvider>
        </AuthProvider>
      </LanguageContext>
    </NotificationProvider>
  );
};

export default _layout;
