import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import styled from "styled-components";
import LoginScreen from "./screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect, useState } from "react";
import RegistrationScreen from "./screens/RegistrationScreen";
import DashBoardScreen from "./screens/DashBoardScreen";
import auth from "@react-native-firebase/auth";
import { app } from "./firebaseConfig";
import { getAuth, onAuthStateChanged as onFirebaseAuthStateChanged } from "firebase/auth";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState("");

  useEffect(() => {
    customNavigationBar();
  });

  useEffect(() => {
    const firebaseAuth = getAuth();
    const unsubscribeFirebaseAuth = onFirebaseAuthStateChanged(firebaseAuth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });
    const unsubscribeReactNativeFirebaseAuth = auth().onAuthStateChanged(async (reactNativeFirebaseUser) => {
      if (reactNativeFirebaseUser) {
        setUser(reactNativeFirebaseUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribeFirebaseAuth();
      // unsubscribeReactNativeFirebaseAuth();
    };
  }, []);
  const customNavigationBar = async () => {
    await NavigationBar.setBackgroundColorAsync("#1E2322");
    await NavigationBar.setButtonStyleAsync("light");
  };
  if (!user) {
    return (
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator initialRouteName="Registration">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Registration"
            component={RegistrationScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator initialRouteName="Dashboard">
          <Stack.Screen
            name="Dashboard"
            component={DashBoardScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
