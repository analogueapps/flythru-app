import { View, Text } from "react-native";
import React from "react";
import { Tabs, usePathname } from "expo-router";
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
    "/home/slots",
    "/home/paymentsuccess",
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
  const { applanguage } = langaugeContext()


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#164F90",
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
               tabBarLabel:
            applanguage === "eng"
              ? Translations.eng.home
              : Translations.arb.home,
               tabBarIcon: ({ color }) => <SvgHome color={color} height={30} width={30}/>,
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





<Tabs.Screen
        name="activities"
        options={{
          headerShown: false,
          tabBarLabel:
          applanguage === "eng"
            ? Translations.eng.activities
            : Translations.arb.activities,
          tabBarIcon: ({ color }) => <SvgActivities color={color} />,
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
