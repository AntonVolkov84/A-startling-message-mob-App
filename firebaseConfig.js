import firebase from "firebase/compat/app";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

export const firebaseConfig = {
  apiKey: "AIzaSyDfJfOIoEjz7LsL-G2VafThBMRYCXvl-jI",
  authDomain: "a-startling-message.firebaseapp.com",
  projectId: "a-startling-message",
  storageBucket: "a-startling-message.firebasestorage.app",
  messagingSenderId: "784492008154",
  appId: "1:784492008154:web:f172e6caedf9b048338be3",
  measurementId: "G-KS8ZE1PKX3",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
