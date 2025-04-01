import * as Google from "expo-auth-session/providers/google";
import { useEffect, useState } from "react";
import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { Button } from "react-native";

const provider = new GoogleAuthProvider();

const GOOGLE_CLIENT_ID =
  "960006772821-qgs3e7eqv0sk8t7jmvdgne9tbg5bu27l.apps.googleusercontent.com";

export default function GoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: GOOGLE_CLIENT_ID,
    webClientId: GOOGLE_CLIENT_ID,
    iosClientId: GOOGLE_CLIENT_ID, // Optional for iOS
    androidClientId: GOOGLE_CLIENT_ID, // Optional for Android
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          console.log("User signed in:", userCredential.user);
        })
        .catch((error) => {
          console.error("Sign-in error:", error);
        });
    }
  }, [response]);

  return (
    <Button
      title="Sign in with Google"
      onPress={() => promptAsync()}
      disabled={!request}
    />
  );
}
