import { Stack } from "expo-router";
import "../global.css";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { ActivityIndicator } from "react-native";
import { ToastProvider } from "react-native-toast-notifications";
import { AuthProvider } from "../UseContext/AuthContext";


const _layout = () => {

  const [fontsLoaded] = useFonts({
    "CenturyGothic": require("../assets/fonts/centurygothic.ttf"),
  });

  // Show a loader until fonts are loaded
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#000" />;
  }
  return (
    <AuthProvider>

     <ToastProvider
        
        placement="bottom"
        animationType="slide-in"
        animationDuration={250}
        >
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="index" />
    </Stack>
    </ToastProvider>
          </AuthProvider>
    // <StatusBar style="light" backgroundColor="transparent" />
  );
};

export default _layout;
