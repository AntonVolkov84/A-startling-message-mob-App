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
const GoBackBtn = styled.TouchableOpacity``;
const GoBackBtnText = styled.Text`
  color: ${colors.RegistrationScreenBtnGoBack};
  font-size: 25px;
`;
const BtnPhoneSignIn = styled.TouchableOpacity`
  background-color: ${colors.RegistrationScreenBtnSignInBackground};
  width: 70%;
  height: 50px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
`;
const BtnPhoneSignInText = styled.Text`
  color: ${colors.RegistrationScreenBtnText};
  font-family: "Pacifico";
  font-size: 22px;
`;
const BtnEmailSignIn = styled.TouchableOpacity`
  background-color: ${colors.RegistrationScreenBtnSignInBackground};
  width: 70%;
  height: 50px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
`;
const BtnEmailSignInText = styled.Text`
  color: ${colors.RegistrationScreenBtnText};
  font-family: "Pacifico";
  font-size: 22px;
`;
const BtnGoogleSignIn = styled.TouchableOpacity`
  background-color: ${colors.RegistrationScreenBtnSignInBackground};
  width: 70%;
  height: 50px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
`;
const BtnGoogleSignInText = styled.Text`
  color: ${colors.RegistrationScreenBtnText};
  font-family: "Pacifico";
  font-size: 22px;
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
      {modalPhoneSignIn || modalEmailSignIn ? (
        <>
          {modalPhoneSignIn ? (
            <PhoneSignin navigation={navigation} setModalPhoneSignIn={setModalPhoneSignIn} />
          ) : (
            <EmailSignIn navigation={navigation} setModalEmailSignIn={setModalEmailSignIn} />
          )}
        </>
      ) : (
        <BlockSignIn>
          <BtnPhoneSignIn
            onPress={() => {
              setModalPhoneSignIn(true);
            }}
          >
            <BtnPhoneSignInText style={{ fontFamily: "Playwrite" }}>Sign in with phone</BtnPhoneSignInText>
          </BtnPhoneSignIn>
          <BtnEmailSignIn
            onPress={() => {
              setModalEmailSignIn(true);
            }}
          >
            <BtnEmailSignInText>Sign in with email</BtnEmailSignInText>
          </BtnEmailSignIn>
          <BtnGoogleSignIn
            onPress={() => {
              console.log("Google");
            }}
          >
            <BtnGoogleSignInText>Sign in with Google</BtnGoogleSignInText>
          </BtnGoogleSignIn>
        </BlockSignIn>
      )}

      <BlockGoBack>
        <GoBackBtn title="Go back" onPress={() => navigation.navigate("Login")}>
          <GoBackBtnText>Go back</GoBackBtnText>
        </GoBackBtn>
      </BlockGoBack>
    </LinearGradient>
  );
}
