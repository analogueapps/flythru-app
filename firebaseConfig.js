import { initializeApp } from "@react-native-firebase/app";
import { getAuth } from "@react-native-firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAT9u5lqHcYWUgr7BlVStg58ocUNKBSWt0",
  authDomain: "analogue-flythru-335b9.firebaseapp.com",
  projectId: "analogue-flythru-335b9",
  storageBucket: "analogue-flythru-335b9.firebasestorage.app",
  messagingSenderId: "1027382214254",
  appId: "1:1027382214254:web:4934b803d92b2aaf72707f",
  measurementId: "G-EJQSD1F1Q9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);