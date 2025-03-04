import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import SvgHome from "../../assets/svgs/bottomTabs/Home";
import SvgServices from "../../assets/svgs/bottomTabs/Services";
import SvgActivities from "../../assets/svgs/bottomTabs/Activities";
import SvgProfile from "../../assets/svgs/bottomTabs/Profile";

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#9B9E9F",
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <SvgHome color={color} />,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          headerShown: false,
          tabBarLabel: "Services",
          tabBarIcon: ({ color }) => <SvgServices color={color} />,
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          headerShown: false,
          tabBarLabel: "Activities",
          tabBarIcon: ({ color }) => <SvgActivities color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => <SvgProfile color={color} />,
        }}
      />
    </Tabs>
  );
};

export default _layout;
