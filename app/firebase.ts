// Import the functions you need from the SDKs you need
//import AsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
// used npm install --save https://github.com/redux-offline/redux-offline#native
// from https://github.com/redux-offline/redux-offline/issues/436
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcGa5X5xr6AMMGrGhzwibGvhtbDUtylt4",
  authDomain: "airyseeds.firebaseapp.com",
  projectId: "airyseeds",
  storageBucket: "airyseeds.appspot.com",
  messagingSenderId: "892588792705",
  appId: "1:892588792705:web:f144386199fe8698c36680",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
