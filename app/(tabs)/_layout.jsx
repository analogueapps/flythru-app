import { View, Text } from "react-native";
import React from "react";
import { Tabs, usePathname } from "expo-router";
import SvgHome from "../../assets/svgs/bottomTabs/Home";
import SvgServices from "../../assets/svgs/bottomTabs/Services";
import SvgActivities from "../../assets/svgs/bottomTabs/Activities";
import SvgProfile from "../../assets/svgs/bottomTabs/Profile";


const _layout = () => {

  const pathname = usePathname();

  // Define routes where tabs should be hidden
  const hideTabsRoutes = [
    "/home/search",
    "/home/baggage",
    "/home/notification",
    "/home/notificationdetail",
    "/home/selectlocation",
    "/home/slots",
    "/activities/bookingdetails",
    "/activities/cancellation",
    "/profile/notification",
    "/profile/chat",
    "/profile/editprofile",
    "/profile/address",
    "/profile/addaddress",
    "/profile/faq",
    "/profile/language",
    "/profile/contactus",
    "/profile/feedback",
    "/profile/termsandconditions",
    "/profile/privacypolicy",
    "/profile/cancellationpolicy",
    "/profile/refundpolicy",
  ];

  // Check if current path is in the hideTabsRoutes list
  const shouldHideTabs = hideTabsRoutes.includes(pathname);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#9B9E9F",
        tabBarHideOnKeyboard: true,
        tabBarStyle: shouldHideTabs
        ? { display: "none" }
        : {
            height: 70,
            paddingBottom: 10,
            paddingTop: 5,
            backgroundColor: "#FFFFFF",
          },
      
      
      }}
    >
      <Tabs.Screen
             name="home"
             options={{
               headerShown: false,
               tabBarLabel: "Home",
               tabBarIcon: ({ color }) => <SvgHome color={color} height={30} width={30}/>,
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
