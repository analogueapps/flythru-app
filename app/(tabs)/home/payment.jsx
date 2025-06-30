


import React, { useRef, useState } from "react";
import { View, Image } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import paymentload from "../../../assets/images/paymentload.gif";


const Payment = () => {
  console.log('jkjkdjfdkdfjkdkjdfkfd ......................fdjgdhjgfdhjgfdhjg');

  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
 const successUrl = 'https://admin.flythru.net/payment/success';
  const errorUrl = 'https://admin.flythru.net/payment/failure';
  const { paymentUrl, orderId } = useLocalSearchParams();
  const router = useRouter();



  const handleUrlChange = (url) => {
    console.log("Current URL:", url);

  if (url.includes(successUrl)) {
      
      router.replace("/home/paymentsuccess");
      return false;
      
    }

 if (url.includes(errorUrl)) {     
        router.replace("/home/paymentfailed");
   
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
  sharedCookiesEnabled={true}
  thirdPartyCookiesEnabled={true}
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