


import React, { useRef, useState } from "react";
import { View, Image } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import paymentload from "../../../assets/images/paymentload.gif";
import Toast from "react-native-toast-message";
import { VERIFY_ORDER } from "../../../network/apiCallers";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Payment = () => {
  console.log('jkjkdjfdkdfjkdkjdfkfd ......................fdjgdhjgfdhjgfdhjg');

  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const paymentIdRef = useRef(null);
  const verificationAttemptedRef = useRef(false);
  const verificationInProgressRef = useRef(false);

  const { paymentUrl, orderId } = useLocalSearchParams();
  const router = useRouter();

  const extractPaymentId = (url) => {
    const match = url.match(/[?&]PaymentID=([^&#]+)/);
    return match ? match[1] : null;
  };

  const verifyOrder = async (paymentId) => {
    const token = await AsyncStorage.getItem("authToken");
    if (verificationAttemptedRef.current || verificationInProgressRef.current) {
      return;
    }

    verificationInProgressRef.current = true;
    verificationAttemptedRef.current = true;

    try {
      const res = await VERIFY_ORDER(orderId, paymentId, token);
      console.log("Verify order response:", res);

      if (res.data.paymentStatus === "Verified") {
        Toast.show({ type: "success", text1: res.data.message });
        router.replace({
          pathname: "/home/paymentsuccess",
          params: { bookingid: res.data.bookingId },
        });
      } else {
        router.replace("/home/paymentfailed");
      }
    } catch (error) {
      console.error("Error verifying order:", error);
      router.replace("/home/paymentfailed");
    } finally {
      verificationInProgressRef.current = false;
    }
  };

  const handleUrlChange = (url) => {
    console.log("Current URL:", url);

    // Extract and store PaymentId if found
    if (url.includes("PaymentID=")) {
      const paymentId = extractPaymentId(url);

      if (paymentId) {
        paymentIdRef.current = paymentId;
        console.log("Extracted PaymentId:", paymentId);
      }
    }

    // Handle failure case
    if (url.includes("/payment/failure")) {
      if (!verificationAttemptedRef.current) {
        router.replace("/home/paymentfailed");
      }
      return;
    }

    // Handle success cases
    // const isSuccessUrl =url.includes("/payment/success") || 
    //                     url.includes("PayInvoice/Result");
    const isSuccessUrl = url.includes("/payment/success") ||
      url.includes("PayInvoice");
    console.log('..........................................', isSuccessUrl, !verificationAttemptedRef.current, paymentIdRef.current);


    if (isSuccessUrl && paymentIdRef.current && !verificationAttemptedRef.current) {
      verifyOrder(paymentIdRef.current);
      return false;
    }

    return true;
  };

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <View style={styles.loadingContainer}>
          <Image
            source={paymentload}
            style={styles.loadingImage}
            resizeMode="contain"
          />
        </View>
      )}

      <WebView
        ref={webViewRef}
        source={{ uri: paymentUrl }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        //    onNavigationStateChange={(navState) => {
        //   handleUrlChange(navState.url);
        // }}
        onShouldStartLoadWithRequest={({ url }) => handleUrlChange(url)}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled={false}
        thirdPartyCookiesEnabled={false}
        startInLoadingState
      // onNavigationStateChange={(navState) => {
      //   // Additional safeguard for navigation changes
      //   handleUrlChange(navState.url);
      // }}
      />
    </View>
  );
};

const styles = {
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  loadingImage: {
    width: 200,
    height: 200,
  },
};

export default Payment;