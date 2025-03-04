import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const _layout = () => {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="slots"
          options={{ gestureEnabled: true, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="search"
          options={{ gestureEnabled: true, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="baggage"
          options={{ gestureEnabled: true, animation: "slide_from_right" }}
        />
      </Stack>
      <StatusBar style="light" backgroundColor="transparent" />
    </>
  );
};

export default _layout;
