


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
  const [webViewUrl, setWebViewUrl] = useState(paymentUrl)
  console.log('PaymentUrl', paymentUrl);

  const router = useRouter();

  const extractPaymentId = (url) => {
    // const match = url.match(/[?&]PaymentID=([^&]+)/i);
    const match = url.match(/[?&]PaymentID=([^&]+)/i);
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
      console.log("Verify order response2:", paymentUrl, paymentId);
      console.log("Verify order response:", res.data);

      if (res?.data?.paymentStatus === "Verified") {

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

  //  const handleUrlChange = (url) => {
  //   console.log("🔄 Current URL:", url,url.toLowerCase().includes("paymentid="));

  //   // Extract PaymentId if present
  //  if (url.toLowerCase().includes("paymentid=")) {
  //   const paymentId = extractPaymentId(url);
  //   if (paymentId && !paymentIdRef.current) {
  //     console.log("✅ Setting initial PaymentId:", paymentId);
  //     paymentIdRef.current = paymentId;
  //   } else if (paymentIdRef.current && paymentIdRef.current !== paymentId) {
  //     console.warn("⚠️ Ignored new PaymentId (already set):", paymentId);
  //   }
  // }

  //   // Handle failure — only if it's a final failure page
  //   const isFailureUrl =
  //     url.includes("/payment/failure") ||
  //     url.toLowerCase().includes("result?status=failed");

  //   if (isFailureUrl && !verificationAttemptedRef.current) {
  //     console.warn("❌ Detected payment failure:", url);
  //     router.replace("/home/paymentfailed");
  //     return false;
  //   }

  //   // Handle success — only on actual result or final success page
  //   const isSuccessUrl =
  //     url.includes("/payment/success") ||
  //     url.toLowerCase().includes("result?status=success");

  //   if (isSuccessUrl && paymentIdRef.current && !verificationAttemptedRef.current) {
  //     console.log("✅ Detected payment success. Verifying...");
  //     setTimeout(() => {
  //       verifyOrder(paymentIdRef.current);
  //     }, 1500); // give backend time to update status
  //     return false;
  //   }

  //   // Don't trigger anything on intermediate steps (e.g., /PayInvoice/knet)
  //   return true;
  // };


  const handleUrlChange = (url) => {
    console.log("🔄 Current URL:", url);

    const lowerUrl = url.toLowerCase();

    // const isFromMyFatoorah = url.includes("portal.myfatoorah.com");

    // ✅ Only extract PaymentId from MyFatoorah URLs
    if (lowerUrl.includes("paymentid=")) {
      const paymentId = extractPaymentId(url);
      if (paymentId) {
        console.log("✅ Set backend-valid PaymentId:", paymentId);
        paymentIdRef.current = paymentId;
      }
    } else if (lowerUrl.includes("paymentid=")) {
      const ignoredPaymentId = extractPaymentId(url);
      console.warn("⚠️ Ignoring PaymentId from non-MyFatoorah domain:", ignoredPaymentId);
    }

    // Handle failure
    const isFailureUrl =
      lowerUrl.includes("/payment/failure") ||
      lowerUrl.includes("result?status=failed");

    if (isFailureUrl && !verificationAttemptedRef.current) {
      // if (isFailureUrl && !verificationAttemptedRef.current) {
      console.error("❌ Detected payment failure:", url);
      router.replace("/home/paymentfailed");
      return false;
    }

    // Handle success
    const isSuccessUrl =
      lowerUrl.includes("/payment/success") ||
      lowerUrl.includes("result?status=success");

    if (isSuccessUrl && paymentIdRef.current && !verificationAttemptedRef.current) {
      console.log("✅ Final success detected. Verifying with ID:", paymentIdRef.current);
      setTimeout(() => verifyOrder(paymentIdRef.current), 1500);
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

      {/* <WebView
        ref={webViewRef}
        source={{ uri: paymentUrl }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onShouldStartLoadWithRequest={({ url }) => handleUrlChange(url)}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
      // onNavigationStateChange={(navState) => {
      //   // Additional safeguard for navigation changes
      //   handleUrlChange(navState.url);
      // }}
      /> */}

      <WebView
        ref={webViewRef}
        source={{ uri: webViewUrl }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onShouldStartLoadWithRequest={({ url }) => handleUrlChange(url)}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
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