import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect, useState, useRef, createContext } from "react";
import RegistrationScreen from "./screens/RegistrationScreen";
import DashBoardScreen from "./screens/DashBoardScreen";
import { getAuth, onAuthStateChanged as onFirebaseAuthStateChanged } from "firebase/auth";
import MessageScreen from "./screens/MessageScreen";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "./notification";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
const Stack = createNativeStackNavigator();
export const AppContext = createContext(null);
export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [user, setUser] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const firebaseAuth = getAuth();

  useEffect(() => {
    customNavigationBar();
  });

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

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
        <AppContext.Provider value={expoPushToken}>
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
        </AppContext.Provider>
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
