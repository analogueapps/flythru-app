import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAnalytics, isSupported } from 'firebase/analytics';



import {getAuth} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAHmuSgBYpBIYpo04BMmfKQgcRtcn1rYkw",
//   authDomain: "flythru.firebaseapp.com",
//   databaseURL: "https://flythru-default-rtdb.firebaseio.com",
//   projectId: "flythru",
//   storageBucket: "flythru.firebasestorage.app",
//   messagingSenderId: "960006772821",
//   appId: "1:960006772821:web:48b92dcc6ed038d1199cdc",
//   measurementId: "G-D9B9VYXQL8"
// };



const firebaseConfig = {
  apiKey: "AIzaSyAT9u5lqHcYWUgr7BlVStg58ocUNKBSWt0",
  authDomain: "analogue-flythru-335b9.firebaseapp.com",
  projectId: "analogue-flythru-335b9",
  storageBucket: "analogue-flythru-335b9.firebasestorage.app",
  messagingSenderId: "1027382214254",
  appId: "1:1027382214254:web:4934b803d92b2aaf72707f",
  measurementId: "G-EJQSD1F1Q9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
if (isSupported()) {
  const analytics = getAnalytics(app); // Initialize analytics only if supported
}
const auth = getAuth(app)