import { StatusBar } from "expo-status-bar";
import {
  Button,
  Image,
  Linking,
  processColor,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  MFBoxShadow,
  MFCardPaymentView,
  MFCardViewError,
  MFCardViewInput,
  MFCardViewLabel,
  MFCardViewPlaceHolder,
  MFCardViewStyle,
  MFCardViewText,
  MFCountry,
  MFCurrencyISO,
  MFEnvironment,
  MFExecutePaymentRequest,
  MFFontFamily,
  MFFontWeight,
  MFGetPaymentStatusRequest,
  MFInitiatePaymentRequest,
  MFKeyType,
  MFLanguage,
  MFNotificationOption,
  MFSDK,
  MFSendPaymentRequest,
} from "myfatoorah-reactnative";
import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
export default function Fatoorah() {
  //Add the code in the App()
  const [PaymentMethods, setPaymentMethods] = useState([]);
  const [invoiceid, setInvoiceid] = useState("");
 
  const configure = async () => {
    try {
      console.log("uff");
      // await MFSDK.init(
      //   "lxQppmA5AegM4ccrbUCtZUphlLIr3x6tO17i-6BqNqg5WCYtrUS0yCqd3c2HnjUqArFv_syzd4jzQUXMshi9oPypynqADVd28-jsnp6Quc52VGZ9temRUFzMY6b_LEvWa-d6_LgIkTe8DNDKM7Oqc1GdkRUzpZZDznzVzFrKCqiS8PKS5oD-aq--yQBYZ3amkksgfkb6u8k_UyUu5A-Bbur6DOBkZmjj8jyAo7owdpQ_ljupNxsv-6PJw-nCUiPwKMRAxX3c5KNvei9ZCuyc28PWQYvLP8LvL7MO2YdJuqy_CYstD96JzgDEoQRcKrc_WPlUtVrWwH394xLvOfnu4T0eFzvnq5IuEyGrKjjReM1ZgHk60ex3xYOVmF85W03L8SFhJdShF4I6d_-kh8ZAvddbMh6yiHfG_qpSxKOHN5eCfswbghsnhDtTGvtNIkmOf0uV0zCdl8GK_wdMfd-aK_36ZeqDPqYOl5geQEiWCC_fPTXhEa2BlSr9tRHW9eJbw4flMPE4ngPVaUA9hYo05lKC-YU8vY2CoiotoD7RzpTS9bD1zFDYYCbgwE60gVrFgzGxPcCgPY6Z6gj06-xN-ta8j316ynncvq1bB3D3mmaTTkDf9QzWeQsQPlBUslWo2qa2OpWoPYsYL9dXISrPZeRa8PKf6l49RuEq1Fjo_JrYZJVIxBAC-9z9xyiDeIpUdm6YLw",
      //   MFCountry.KUWAIT,
      //   MFEnvironment.TEST
      // );
      await MFSDK.init(
        "rLtt6JWvbUHDDhsZnfpAhpYk4dxYDQkbcPTyGaKp2TYqQgG7FGZ5Th_WD53Oq8Ebz6A53njUoo1w3pjU1D4vs_ZMqFiz_j0urb_BH9Oq9VZoKFoJEDAbRZepGcQanImyYrry7Kt6MnMdgfG5jn4HngWoRdKduNNyP4kzcp3mRv7x00ahkm9LAK7ZRieg7k1PDAnBIOG3EyVSJ5kK4WLMvYr7sCwHbHcu4A5WwelxYK0GMJy37bNAarSJDFQsJ2ZvJjvMDmfWwDVFEVe_5tOomfVNt6bOg9mexbGjMrnHBnKnZR1vQbBtQieDlQepzTZMuQrSuKn-t5XZM7V6fCW7oP-uXGX-sMOajeX65JOf6XVpk29DP6ro8WTAflCDANC193yof8-f5_EYY-3hXhJj7RBXmizDpneEQDSaSz5sFk0sV5qPcARJ9zGG73vuGFyenjPPmtDtXtpx35A-BVcOSBYVIWe9kndG3nclfefjKEuZ3m4jL9Gg1h2JBvmXSMYiZtp9MR5I6pvbvylU_PP5xJFSjVTIz7IQSjcVGO41npnwIxRXNRxFOdIUHn0tjQ-7LwvEcTXyPsHXcMD8WtgBh-wxR8aKX7WPSsT1O8d8reb2aR7K3rkV3K82K_0OgawImEpwSvp9MNKynEAJQS6ZHe_J_l77652xwPNxMRTMASk1ZsJL",
        MFCountry.KUWAIT,
        MFEnvironment.TEST
      );
      console.log("MyFatoorah SDK Initialized Successfully!");
    } catch (error) {
      console.log("err", error);
    }
  };

  useEffect(() => {
    configure();
    initiatePayment();
  }, []);

  const initiatePayment = async () => {
    try {
      let initiatePaymentRequest = {
        amount: 10, // Amount in the specified currency
        currencyIso: MFCurrencyISO.KUWAIT_KWD,
      };

      const response = await MFSDK.initiatePayment(
        initiatePaymentRequest,
        MFLanguage.ENGLISH
      );
      setPaymentMethods(response.PaymentMethods);
      console.log("Initiate Payment Response:", response);
    } catch (error) {
      console.error("Initiate Payment Error:", error);
    }
  };

  const executePayment = async (id) => {
    var executePaymentRequest = new MFExecutePaymentRequest(10);
    console.log("execute", executePaymentRequest);
    executePaymentRequest.PaymentMethodId = id;
    executePaymentRequest.CustomerEmail = "Test@test.com";
    executePaymentRequest.CustomerMobile = "123456789";
    executePaymentRequest.CustomerReference = "Test12345";
    executePaymentRequest.DisplayCurrencyIso = MFCurrencyISO.QATAR_QAR;
    executePaymentRequest.ExpiryDate = "2026-06-08T17:36:23.173";

    await MFSDK.executePayment(
      executePaymentRequest,
      MFLanguage.ARABIC,
      (invoiceId) => {
        console.log("invoiceId: " + invoiceId);
        setInvoiceid(invoiceId);
      }
    )
      .then((success) => console.log(success))
      .catch((error) => console.log(error));
  };

  const sendPayment = async () => {
    var sendPaymentRequest = new MFSendPaymentRequest(
      11,
      MFNotificationOption.LINK,
      "customerName" 
    );
    sendPaymentRequest.CustomerEmail = "Test@test.com";
    sendPaymentRequest.CustomerMobile = "123456789";
    sendPaymentRequest.CustomerReference = "Test12345";
    sendPaymentRequest.DisplayCurrencyIso = MFCurrencyISO.UNITEDSTATES_USD;
    sendPaymentRequest.ExpiryDate = "2026-06-08T17:36:23.132Z";

    await MFSDK.sendPayment(sendPaymentRequest, MFLanguage.ARABIC)
      .then((success) => {
        console.log("uff", success);
        Linking.openURL(success.InvoiceURL)
        router.push("/bookingdetails")
      })
      .catch((error) => console.log(error));
  };

  const getPaymentStatus = async () => {
    console.log("in", invoiceid);
    var getPaymentStatusRequest = new MFGetPaymentStatusRequest(
      invoiceid,
      MFKeyType.INVOICEID
    );

    await MFSDK.getPaymentStatus(getPaymentStatusRequest, MFLanguage.ARABIC)
      .then((success) => console.log(success))
      .catch((error) => console.log(error));
  };

  const cardPaymentView = useRef(null);

  const paymentCardStyle = () => {
    var cardViewInput = new MFCardViewInput(
      processColor("gray"),
      13,
      MFFontFamily.SansSerif,
      32,
      0,
      processColor("#c7c7c7"),
      2,
      8,
      new MFBoxShadow(10, 10, 5, 0, processColor("gray")),
      new MFCardViewPlaceHolder(
        "Name On Card test",
        "Number test",
        "MM / YY",
        "CVV test"
      )
    );

    var cardViewLabel = new MFCardViewLabel(
      true,
      processColor("black"),
      13,
      MFFontFamily.CourierNew,
      MFFontWeight.Bold,
      new MFCardViewText(
        "Card Holder Name test",
        "Card Number test",
        "Expiry Date test",
        "Security Code test"
      )
    );

    var cardViewError = new MFCardViewError(
      processColor("green"),
      8,
      new MFBoxShadow(10, 10, 5, 0, processColor("yellow"))
    );

    var cardViewStyle = new MFCardViewStyle(
      false,
      "initial",
      230,
      cardViewInput,
      cardViewLabel,
      cardViewError
    );

    return cardViewStyle;
  };
  useEffect(() => {
    if (cardPaymentView.current) {
      console.log("Card Payment View is initialized");
    }
  }, []);

  const pay = async () => {
    if (cardPaymentView.current) {
      try {
        const result = await cardPaymentView.current.pay(); // Ensure .pay() is available
        console.log("Payment successful:", result);
      } catch (error) {
        console.error("Payment failed:", error);
      }
    } else {
      console.error("cardPaymentView is not available.");
    }
  };

  return (
    <ScrollView>
      {/* <Text>Open up App.js to start working on your app!</Text> */}
      {/* <Button title="start" onPress={() => configure()} /> */}
      {/* <Button title="inital" onPress={initiatePayment} /> */}

      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>MyFatoorah Payment Gateway</Text>
          <Text style={styles.subHeaderText}>Choose your payment method</Text>
        </View>

        <View style={styles.paymentMethodsContainer}>
          {PaymentMethods.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.paymentMethodButton}
              onPress={() => executePayment(item.PaymentMethodId)}
              activeOpacity={0.7}
            >
              <View style={styles.paymentMethodContent}>
                <Image
                  source={{ uri: item.ImageUrl }}
                  style={styles.paymentMethodImage}
                />
                {item.PaymentMethodEn && (
                  <Text style={styles.paymentMethodText}>
                    {item.PaymentMethodEn}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={{ padding: 20 }}>
        {/* Card Payment View */}
        <MFCardPaymentView
          ref={cardPaymentView}
          paymentStyle={paymentCardStyle()}
        />

        {/* Pay Button */}
        <Button title="execute" onPress={sendPayment} />
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <TouchableOpacity
            onPress={pay}
            style={{
              backgroundColor: "#007bff",
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              Pay
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Button title="Invoice" onPress={getPaymentStatus} />

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    width: "100%",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  subHeaderText: {
    fontSize: 16,
    color: "#7f8c8d",
    marginTop: 4,
  },
  paymentMethodsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  paymentMethodButton: {
    margin: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    width: "45%",
    maxWidth: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentMethodContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  paymentMethodImage: {
    width: 100,
    height: 50,
    resizeMode: "contain",
    marginBottom: 8,
  },
  paymentMethodText: {
    fontSize: 12,
    color: "#34495e",
    textAlign: "center",
    marginTop: 6,
  },
});
