import { View, Text } from "react-native";
import React from "react";
import { Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";

const _layout = () => {

  const pathname = usePathname();  // Get current route path

  // Define routes where tabs should be hidden
  const hideTabsRoutes = ["/home/search",
    "/home/baggage",
    "/home/notification",
    "/home/notificationdetail",
    "/home/selectlocation",
    "/home/paymentsuccess"];

  // Check if current path is in the hideTabsRoutes list
  const shouldHideTabs = hideTabsRoutes.includes(pathname);

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

        <Stack.Screen
          name="notification"
          options={{ gestureEnabled: true, animation: "slide_from_right", tabBarStyle: { display: "none" }, }}
        />

        <Stack.Screen
          name="notificationdetail"
          options={{ gestureEnabled: true, animation: "slide_from_right", tabBarStyle: { display: "none" }, }}
        />
        <Stack.Screen
          name="selectlocation"
          options={{ gestureEnabled: true, animation: "slide_from_right", tabBarStyle: { display: "none" }, }}
        />

        <Stack.Screen
          name="payment"
          options={{ gestureEnabled: true, animation: "slide_from_right", tabBarStyle: { display: "none" }, }}
        />
        <Stack.Screen
          name="paymentsuccess"
          options={{ gestureEnabled: true, animation: "slide_from_right", tabBarStyle: { display: "none" }, }}
        />
        <Stack.Screen
          name="paymentfailed"
          options={{ gestureEnabled: true, animation: "slide_from_right", tabBarStyle: { display: "none" }, }}
        />

        <Stack.Screen
          name="bookingd"
          options={{ gestureEnabled: true, animation: "slide_from_right", tabBarStyle: { display: "none" }, }}
        />

        <Stack.Screen
          name="editpro"
          options={{ gestureEnabled: true, animation: "slide_from_right", tabBarStyle: { display: "none" }, }}
        />

        <Stack.Screen
          name="locaddress"
          options={{ gestureEnabled: true, animation: "slide_from_right", tabBarStyle: { display: "none" }, }}
        />
      </Stack>
      <StatusBar style="light" backgroundColor="transparent" />
    </>
  );
};

export default _layout;
