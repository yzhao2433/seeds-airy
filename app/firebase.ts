// Import the functions you need from the SDKs you need

import AsyncStorage from "@react-native-async-storage/async-storage";
// for issues related to async storage use one of the two approaches
// used npm install --save https://github.com/redux-offline/redux-offline#native
// from https://github.com/redux-offline/redux-offline/issues/436
// or npm i @react-native-async-storage/async-storage

import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
// should be fixed via the "@firebase/auth": ["./node_modules/@firebase/auth/dist/index.rn.d.ts"]
// line in tsconfig.json
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//// for set up, if you haven't already, run npm install -- save firebase

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyCDiL4Jh94BByPNwXBjwF_p1vTPBajLzxw",
  authDomain: "airy-daa5f.firebaseapp.com",
  projectId: "airy-daa5f",
  storageBucket: "airy-daa5f.appspot.com",
  messagingSenderId: "162812606206",
  appId: "1:162812606206:web:2d348fe5c9c834dd41d7af",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
