import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import styled from "styled-components";
import { LinearGradient } from "expo-linear-gradient";
import * as colors from "../variables/colors";
import PhoneSignin from "../components/PhoneSignin";
import EmailSignIn from "../components/EmailSignIn";

const BlockSignIn = styled.View`
  width: 100%;
  height: 86%;
  justify-content: space-around;
  align-items: center;
`;
const BlockGoBack = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
`;
const GoBackBtn = styled.TouchableOpacity`
  background-color: green;
`;
const GoBackBtnText = styled.Text`
  color: ${colors.RegistrationScreenBtnGoBack};
  font-size: 25px;
`;

export default function RegistrationScreen({ navigation }) {
  const [modalPhoneSignIn, setModalPhoneSignIn] = useState(false);
  const [modalEmailSignIn, setModalEmailSignIn] = useState(false);

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
      <PhoneSignin navigation={navigation} setModalPhoneSignIn={setModalPhoneSignIn} />
      <BlockGoBack>
        <GoBackBtn onPress={() => navigation.goBack()}>
          <GoBackBtnText>Go back</GoBackBtnText>
        </GoBackBtn>
      </BlockGoBack>
    </LinearGradient>
  );
}
