import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="verifyotp" />
      <Stack.Screen name="forgotpassemail" />
      <Stack.Screen name="forgotpassotp" />
      <Stack.Screen name="forgotpasschange" />

    </Stack>
  );
};

export default _layout;
