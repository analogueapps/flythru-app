import React, { useRef, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";

const Payment = () => {
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const { paymentUrl } = useLocalSearchParams();
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

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <ActivityIndicator
          size="large"
          color="#000"
          style={{ position: "absolute", top: "50%", left: "50%" }}
        />
      )}
      <WebView
        ref={webViewRef}
        source={{ uri: paymentUrl }}
        onLoadEnd={() => setLoading(false)}
        onShouldStartLoadWithRequest={(request) => {
            const url = request.url;
            console.log("Trying to load:", url);
        
            if (url.includes("https://portal.myfatoorah.com/En/KWT/PayInvoice/Result")) {
              router.replace("/home/paymentsuccess");
              return false; // Prevent WebView from continuing
            }
        
            return true; // Allow the WebView to load the URL
          }}
        onNavigationStateChange={handleNavigationChange}
        javaScriptEnabled
        startInLoadingState
      />
    </View>
  );
};

export default Payment;
