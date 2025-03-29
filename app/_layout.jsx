import { Stack } from "expo-router";
import "../global.css";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { ActivityIndicator } from "react-native";
import { ToastProvider } from "react-native-toast-notifications";
import { AuthProvider } from "../UseContext/AuthContext";
import { LanguageContext } from "../customhooks/languageContext";

const _layout = () => {
  const [fontsLoaded] = useFonts({
    CenturyGothic: require("../assets/fonts/centurygothic.ttf"),
  });

  // Show a loader until fonts are loaded
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#000" />;
  }
  return (
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
    // <StatusBar style="light" backgroundColor="transparent" />
  );
};

export default _layout;
