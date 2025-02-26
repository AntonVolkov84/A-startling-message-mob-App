import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState, useContext } from "react";
import styled from "styled-components";
import { LinearGradient } from "expo-linear-gradient";
import * as colors from "../variables/colors";
import PhoneSignin from "../components/PhoneSignin";
import { AppContext } from "../App.js";

export default function RegistrationScreen({ navigation }) {
  const expoPushToken = useContext(AppContext);
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
      style={{ height: "100%", width: "100%" }}
    >
      <PhoneSignin navigation={navigation} />
    </LinearGradient>
  );
}
