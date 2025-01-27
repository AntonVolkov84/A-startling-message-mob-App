import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as colors from "../variables/colors.js";
import styled from "styled-components";
const ButtonRegistration = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  height: 100%;
`;
const ButtonRegistrationText = styled.Text`
  font-size: 20px;
  color: ${colors.LoginScreenButtonRegistrationText};
`;
function LoginScreen({ navigation }) {
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
      <ButtonRegistration onPress={() => navigation.navigate("Registration")}>
        <ButtonRegistrationText>Registration</ButtonRegistrationText>
      </ButtonRegistration>
    </LinearGradient>
  );
}

export default LoginScreen;
