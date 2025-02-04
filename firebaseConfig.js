import firebase from "firebase/compat/app";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

export const firebaseConfig = {
  apiKey: "AIzaSyA6RB8iNw7-CXgS1GOkGScHK63RJuiMTIQ",
  authDomain: "a-startling-message-de67b.firebaseapp.com",
  projectId: "a-startling-message-de67b",
  storageBucket: "a-startling-message-de67b.firebasestorage.app",
  messagingSenderId: "899594134591",
  appId: "1:899594134591:web:4d67a7ff8fde74a41f448a",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
