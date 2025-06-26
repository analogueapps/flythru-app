import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../utlis/registrationsPushNotifications";
import { Platform } from "react-native";
import { router } from "expo-router";

const NotificationContext = createContext(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  // const [expoPushToken, setExpoPushToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // registerForPushNotificationsAsync().then(
    //   (token) => setExpoPushToken(token),
    //   (error) => setError(error)
    // );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("🔔 Notification Received: ", notification);
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "🔔 Notification Response: ",
          JSON.stringify(response, null, 2),
          JSON.stringify(response.notification.request.content.data, null, 2)
        );
        // Handle the notification response here
        if (Platform.OS === "android") {
          const data = response?.notification?.request?.content?.data
          if (data?.action) {
            router.push({
              pathname: `/${data.action}`,
              params: { bookingId: data?.bookingId, message: "notify" }

            })
          }
        }
        else{
          const iosdata=response?.notification?.request?.trigger?.payload
          if(iosdata?.action)
          {
               router.push({
              pathname: `/${iosdata?.action}`,
              params: { bookingId: iosdata?.bookingId, message: "notify" }

            })
          }
        }
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notification, error }}
    >
      {children}
    </NotificationContext.Provider>
  );
};