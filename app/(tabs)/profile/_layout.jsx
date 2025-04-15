import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="editprofile"
        options={{ gestureEnabled: true, animation: "slide_from_right" }}
      />

      <Stack.Screen
        name="chat"
        options={{ gestureEnabled: true, animation: "slide_from_right" }}
      />

      <Stack.Screen
        name="address"
        options={{ gestureEnabled: true, animation: "slide_from_right" }}
      />

      <Stack.Screen
        name="language"
        options={{ gestureEnabled: true, animation: "slide_from_right" }}
      />

      <Stack.Screen
        name="faq"
        options={{ gestureEnabled: true, animation: "slide_from_right" }}
      />

      <Stack.Screen
        name="feedback"
        options={{ gestureEnabled: true, animation: "slide_from_right" }}
      />

      <Stack.Screen
        name="termsandconditions"
        options={{ gestureEnabled: true, animation: "slide_from_right" }}
      />

      <Stack.Screen
        name="privacypolicy"
        options={{ gestureEnabled: true, animation: "slide_from_right" }}
      />

      <Stack.Screen
        name="cancellationpolicy"
        options={{ gestureEnabled: true, animation: "slide_from_right" }}
      />

      <Stack.Screen
        name="refundpolicy"
        options={{ gestureEnabled: true, animation: "slide_from_right" }}
      />
    </Stack>
  );
};

export default _layout;
