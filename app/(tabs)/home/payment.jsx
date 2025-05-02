// import React, { useRef, useState } from "react";
// import { View, Image } from "react-native";
// import { WebView } from "react-native-webview";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import paymentload from "../../../assets/images/paymentload.gif";
// import Toast from "react-native-toast-message";
// import { VERIFY_ORDER } from "../../../network/apiCallers";

// const Payment = () => {
//   const webViewRef = useRef(null);
//   const [loading, setLoading] = useState(true);
//   const [tempPaymentId, setTempPaymentId] = useState("");
//   const isVerifyingRef = useRef(false);

//   const { paymentUrl, orderId } = useLocalSearchParams();
//   const router = useRouter();

//   const extractPaymentId = (url) => {
//     const match = url.match(/[?&]PaymentId=([^&]+)/);
//     return match ? match[1] : null;
//   };

//   const verifyOrder = async (paymentId) => {
//     if (isVerifyingRef.current) return; // Prevent duplicate calls
//   isVerifyingRef.current = true;
//     try {
//       const res = await VERIFY_ORDER(orderId, paymentId);
//       console.log("Verify order response:", res.data);

//       if (res.data.paymentStatus === "Verified") {
//         Toast.show({ type: "success", text1: res.data.message });
//         router.replace({
//           pathname: "/home/paymentsuccess",
//           params: { orderId, paymentId },
//         });
//       } else {
//         router.replace("/home/paymentfailed");
//       }
//     } catch (error) {
//       console.error("Error verifying order:", error);
//       router.replace("/home/paymentfailed");
//     }
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       {loading && (
//         <View
//           style={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: "white",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 10,
//           }}
//         >
//           <Image
//             source={paymentload}
//             style={{ width: 200, height: 200 }}
//             resizeMode="contain"
//           />
//         </View>
//       )}

//       <WebView
//         ref={webViewRef}
//         source={{ uri: paymentUrl }}
//         onLoadStart={() => setLoading(true)}
//         onLoadEnd={() => setLoading(false)}
//         onShouldStartLoadWithRequest={(request) => {
//           const url = request.url;
//           console.log("Trying to load:", url);

//           // Save the PaymentId early if it appears
//           if (url.includes("PayInvoice/Mpgs2") && url.includes("PaymentId=")) {
//             const paymentId = extractPaymentId(url);
//             if (paymentId) {
//               console.log("Extracted early PaymentId:", paymentId);
//               setTempPaymentId(paymentId);
//             }
//           }

//           // Payment failure route
//           if (url.includes("/payment/failure")) {
//             router.replace("/home/paymentfailed");
//             return false;
//           }

//           // Payment success route (uses stored PaymentId)
//           if (url.includes("/payment/success")) {
//             if (tempPaymentId) {
//               verifyOrder(tempPaymentId);
//             } else {
//               router.replace("/home/paymentfailed");
//             }
//             return false;
//           }

//           // Result route (uses stored PaymentId)
//           if (url.includes("PayInvoice/Result")) {
//             if (tempPaymentId) {
//               verifyOrder(tempPaymentId);
//             } else {
//               router.replace("/home/paymentfailed");
//             }
//             return false;
//           }

//           return true;
//         }}
//         javaScriptEnabled
//       />
//     </View>
//   );
// };

// export default Payment;


import React, { useRef, useState } from "react";
import { View, Image } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import paymentload from "../../../assets/images/paymentload.gif";
import Toast from "react-native-toast-message";
import { VERIFY_ORDER } from "../../../network/apiCallers";

const Payment = () => {
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const paymentIdRef = useRef(null);
  const verificationAttemptedRef = useRef(false);
  const verificationInProgressRef = useRef(false);

  const { paymentUrl, orderId } = useLocalSearchParams();
  const router = useRouter();

  const extractPaymentId = (url) => {
    const match = url.match(/[?&]PaymentId=([^&]+)/);
    return match ? match[1] : null;
  };

  const verifyOrder = async (paymentId) => {
    if (verificationAttemptedRef.current || verificationInProgressRef.current) {
      return;
    }

    verificationInProgressRef.current = true;
    verificationAttemptedRef.current = true;

    try {
      const res = await VERIFY_ORDER(orderId, paymentId);
      console.log("Verify order response:", res.data);

      if (res.data.paymentStatus === "Verified") {
        Toast.show({ type: "success", text1: res.data.message });
        router.replace({
          pathname: "/home/paymentsuccess",
          params: { orderId, paymentId },
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
    if (url.includes("PaymentId=")) {
      const paymentId = extractPaymentId(url);
      if (paymentId) {
        console.log("Extracted PaymentId:", paymentId);
        paymentIdRef.current = paymentId;
      }
    }

    // Handle failure case
    if (url.includes("/payment/failure")) {
      if (!verificationAttemptedRef.current) {
        router.replace("/home/paymentfailed");
      }
      return false;
    }

    // Handle success cases
    const isSuccessUrl = url.includes("/payment/success") || 
                        url.includes("PayInvoice/Result");

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
        onShouldStartLoadWithRequest={({ url }) => handleUrlChange(url)}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        onNavigationStateChange={(navState) => {
          // Additional safeguard for navigation changes
          handleUrlChange(navState.url);
        }}
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