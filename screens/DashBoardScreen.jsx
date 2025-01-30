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
  const authFirebase = getAuth();
  console.log("Dash", authFirebase.currentUser);
  const handleSignedOut = async () => {
    try {
      const authFirebase = getAuth();
      signOut(authFirebase);
      auth().signOut();
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
            handleSignedOut();
          }}
        ></Button>
      </BlockDashboard>
    </LinearGradient>
  );
}
