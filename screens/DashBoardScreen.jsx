import { View, Text, Button } from "react-native";
import auth from "@react-native-firebase/auth";
import React from "react";
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
  console.log(auth().currentUser);
  const handleSignedOut = async () => {
    try {
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
