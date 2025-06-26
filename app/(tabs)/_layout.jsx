import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router, Tabs, usePathname } from "expo-router";
import SvgHome from "../../assets/svgs/bottomTabs/Home";
import SvgServices from "../../assets/svgs/bottomTabs/Services";
import SvgActivities from "../../assets/svgs/bottomTabs/Activities";
import SvgProfile from "../../assets/svgs/bottomTabs/Profile";
import { langaugeContext } from "../../customhooks/languageContext";
import Translations from "../../language";


const _layout = () => {
  const pathname = usePathname();

  // Define routes where tabs should be hidden
  const hideTabsRoutes = [
    "/home/search",
    "/home/baggage",
    "/home/notification",
    "/home/notificationdetail",
    "/home/selectlocation",
    "/home/selectlocationnext",
    "/home/slots",
    "/home/locaddress",
    "/home/payment",
    "/home/bookingd",
    "/home/editpro",
    "/home/paymentsuccess",
    "/home/paymentfailed",
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
    "/profile/updateaddress"
  ];

  // Check if current path is in the hideTabsRoutes list
  const shouldHideTabs = hideTabsRoutes.includes(pathname);
  const { applanguage } = langaugeContext();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#164F90",
        tabBarInactiveTintColor: "#9B9E9F",
        tabBarHideOnKeyboard: true,
        tabBarStyle: shouldHideTabs
          ? { display: "none" }
          : {
             lazy: false,
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
          tabBarLabel:
            applanguage === "eng"
              ? Translations.eng.home
              : Translations.arb.home,
          tabBarIcon: ({ color }) => (
            <SvgHome color={color} height={30} width={30} />
          ),
        }}
      />

      <Tabs.Screen
        name="services"
        options={{
          headerShown: false,
          tabBarLabel:
            applanguage === "eng"
              ? Translations.eng.services
              : Translations.arb.services,
          tabBarIcon: ({ color }) => <SvgServices color={color} />,
        }}
      />

     // Simple and effective solution
<Tabs.Screen
  name="activities"
  options={{
    headerShown: false,
    tabBarLabel:
      applanguage === "eng"
        ? Translations.eng.activities
        : Translations.arb.activities,
    tabBarIcon: ({ color }) => <SvgActivities color={color} />,
    tabBarButton: (props) => {
      // const router = useRouter();
      
      return (
        <TouchableOpacity 
          {...props} 
          onPress={() => {
            // Call original onPress for tab state
            props.onPress?.();
            
            // Force navigation to activities index
            // This will reset the activities stack
            router.navigate('/(tabs)/activities');
            
            // Alternative: Use replace for cleaner navigation
            // router.replace('/(tabs)/activities');
          }}
        />
      );
    }
  }}
/>

      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarLabel:
            applanguage === "eng"
              ? Translations.eng.profile
              : Translations.arb.profile,
          tabBarIcon: ({ color }) => <SvgProfile color={color} />,
        }}
      />
    </Tabs>
  );
};

export default _layout;
