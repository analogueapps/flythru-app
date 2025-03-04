import { Stack } from "expo-router";
import "../global.css";
import { StatusBar } from "expo-status-bar";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="index" />
    </Stack>
    // <StatusBar style="light" backgroundColor="transparent" />
  );
};

export default _layout;
