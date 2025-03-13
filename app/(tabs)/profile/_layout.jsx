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
                 name="addaddress"
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
            
    </Stack>
  );
};

export default _layout;
