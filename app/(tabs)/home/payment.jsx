import React, { useEffect, useRef, useState } from "react";
import { View, Image } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import paymentload from "../../../assets/images/paymentload.gif";


const Payment = () => {
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [tempPaymentId, setTempPaymentId] = useState("");

  const { paymentUrl , orderId} = useLocalSearchParams();
  const router = useRouter();

  const handleNavigationChange = (navState) => {
    const { url } = navState;
    console.log("WebView URL:", url);

    if (url.includes("paymentsuccess")) {
      router.replace("/home/paymentsuccess"); // This must match the file name
    } else if (url.includes("paymentfailed")) {
      router.replace("/home/paymentfailed");
    }
  };

  const extractPaymentId = (url) => {
    const match = url.match(/[?&]PaymentId=([^&]+)/);
    return match ? match[1] : null;
  };
  

  useEffect(() => {
    console.log("Payment order id:", orderId); // Log the orderId
  }, []);

  return (
    <View style={{ flex: 1 }}>
     {loading && (
  <View
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
    }}
  >
    <Image
      source={paymentload}
      style={{
        width: 200,
        height: 200,
      }}
      resizeMode="contain"
    />
  </View>
)}

      <WebView 
        ref={webViewRef}
        source={{ uri: paymentUrl }}
        onLoadStart={() => setLoading(true)}  // start custom loader
        onLoadEnd={() => setLoading(false)}         
        onShouldStartLoadWithRequest={(request) => {
          const url = request.url;
          console.log("Trying to load:", url);
        
          // Extract PaymentId if it appears in the URL
          if (url.includes("PayInvoice/Mpgs2") && url.includes("PaymentId=")) {
            const paymentId = extractPaymentId(url);
            console.log("Extracted PaymentId:", paymentId);
        
            // We store the paymentId temporarily to pass it later when the result page hits
            // You can use useRef or useState here
            setTempPaymentId(paymentId);
          }
        
          if (url.includes("PayInvoice/Result")) {
            // Use the saved paymentId here
            router.replace({
              pathname: "/home/paymentsuccess",

              params: {
                orderId,
                paymentId: tempPaymentId, // From state/ref
              },
            });
            return false;
          }
        
          return true;
        }}
        
        
        onNavigationStateChange={handleNavigationChange}
        javaScriptEnabled
        // startInLoadingState
        />
    </View>
  );
};

export default Payment;


// import React, { useEffect, useRef, useState } from "react";
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
//   const [verified, setVerified] = useState(false);

//   const { paymentUrl, orderId } = useLocalSearchParams();
//   const router = useRouter();

//   const extractPaymentId = (url) => {
//     const match = url.match(/[?&]PaymentId=([^&]+)/);
//     return match ? match[1] : null;
//   };

//   const verifyOrder = async (paymentId) => {
//     try {
//       const res = await VERIFY_ORDER(orderId, paymentId);
//       console.log("Verify order response:", res.data);

//       if (res.data.paymentStatus === "Verified") {
//         Toast.show({ type: "success", text1: res.data.message });
//         router.replace({
//           pathname: "/home/paymentsuccess",
//           params: {
//             orderId,
//             paymentId,
//           },
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

//           if (url.includes("PayInvoice/Result")) {
//             const paymentId = extractPaymentId(url);
//             if (paymentId) {
//               verifyOrder(paymentId);
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
