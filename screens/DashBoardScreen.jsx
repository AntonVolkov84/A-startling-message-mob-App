import { View, Text, Button } from "react-native";
import auth from "@react-native-firebase/auth";
import { getAuth, signOut } from "firebase/auth";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import * as colors from "../variables/colors.js";
import { LinearGradient } from "expo-linear-gradient";

const BlockDashboard = styled.View`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-content: center;
`;

export default function DashBoardScreen() {
  const [authInfo, setAuthInfo] = useState({ provider: "none", user: null });
  const checkCurrentAuth = () => {
    const firebaseAuth = getAuth();
    const firebaseUser = firebaseAuth.currentUser;
    const reactNativeFirebaseUser = auth().currentUser;
    console.log("firebase", firebaseUser, "reactNative", reactNativeFirebaseUser);
    if (firebaseUser) {
      return { provider: "firebase", user: firebaseUser };
    } else if (reactNativeFirebaseUser) {
      return { provider: "react-native-firebase", user: reactNativeFirebaseUser };
    } else {
      return { provider: "none", user: null };
    }
  };
  useEffect(() => {
    const authStatus = checkCurrentAuth();
    setAuthInfo(authStatus);
  }, []);
  const handleSignedOut = async (authInfo) => {
    try {
      if (authInfo.provider === "react-native-firebase") {
        auth().signOut();
      } else if (authInfo.provider === "firebase") {
        const auth = getAuth();
        signOut(auth);
      }
    } catch (error) {
      console.log("HandleSignedOut", error.message);
    }
  };

  return (
    <LinearGradient
      colors={[
        colors.LoginScreenGradientStart,
        colors.LoginScreenGradientEnd,
        colors.LoginScreenGradientEnd2,
        colors.LoginScreenGradientEnd3,
      ]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={{ height: "100%", width: "100%", paddingTop: "5%" }}
    >
      <BlockDashboard>
        <Button
          title="SignOut"
          onPress={() => {
            handleSignedOut(authInfo);
          }}
        ></Button>
      </BlockDashboard>
    </LinearGradient>
  );
}
