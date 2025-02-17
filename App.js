import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect, useState } from "react";
import RegistrationScreen from "./screens/RegistrationScreen";
import DashBoardScreen from "./screens/DashBoardScreen";
import { getAuth, onAuthStateChanged as onFirebaseAuthStateChanged } from "firebase/auth";
import MessageScreen from "./screens/MessageScreen";
import * as Location from "expo-location";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const firebaseAuth = getAuth();
  useEffect(() => {
    customNavigationBar();
  });

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        if (errorMsg) {
          console.log("location from App", errorMsg);
        }
        return;
      }
    };
    requestLocationPermission();
  }, []);

  useEffect(() => {
    const unsubscribeFirebaseAuth = onFirebaseAuthStateChanged(firebaseAuth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribeFirebaseAuth();
    };
  }, [firebaseAuth]);
  const customNavigationBar = async () => {
    await NavigationBar.setBackgroundColorAsync("#1E2322");
    await NavigationBar.setButtonStyleAsync("light");
  };
  if (!user || !user.emailVerified) {
    return (
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator initialRouteName="Login">
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
          <Stack.Screen
            name="MessageScreen"
            component={MessageScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
