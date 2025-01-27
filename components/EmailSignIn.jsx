import { View, Text } from "react-native";
import React from "react";
import styled from "styled-components";
import auth from "@react-native-firebase/auth";
import * as colors from "../variables/colors";

const EmailSign = styled.View`
  width: 100%;
  height: 100%;
  position: relative;
`;
const BlockEmailSign = styled.View`
  width: 100%;
  height: 71%;
  align-items: center;
`;
const EmailSignTitle = styled.Text`
  margin-top: 10%;
  width: 100%;
  font-size: 30px;
  color: ${colors.EmailSignInText};
  text-align: center;
`;
const EmailSignInput = styled.TextInput`
  width: 70%;
  height: 50px;
  background-color: #6ba3be;
  padding-left: 10px;
  border-radius: 10px;
  margin-top: 3%;
  font-size: 20px;
`;
const EmailSignBtn = styled.TouchableOpacity`
  width: 70%;
  height: 50px;
  background-color: ${colors.EmailSignInBtnBackgroundColor};
  border-radius: 10px;
  margin-top: 3%;

  justify-content: center;
  align-items: center;
`;
const EmailSignBtnText = styled.Text`
  color: ${colors.EmailSignInText};
  font-size: 20px;
`;
const BtnGoBack = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 15%;
  width: 100%;
`;
const BtnGoBackText = styled.Text`
  color: ${colors.RegistrationScreenBtnGoBack};
  font-size: 25px;
`;

export default function EmailSignIn({ navigation }) {
  return (
    <EmailSign>
      <EmailSignTitle>EmailSignIn</EmailSignTitle>
      <BtnGoBack>
        <BtnGoBackText onPress={() => navigation.navigate("Login")}>Go back</BtnGoBackText>
      </BtnGoBack>
    </EmailSign>
  );
}
