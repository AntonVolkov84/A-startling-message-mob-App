import React, { useState } from "react";
import { Text, View, TouchableOpacity, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as colors from "../variables/colors.js";
import styled from "styled-components";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
const ButtonRegistration = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;
const ButtonRegistrationText = styled.Text`
  font-size: 20px;
  color: ${colors.LoginScreenButtonRegistrationText};
`;
const BlockLogIn = styled.View`
  margin-top: 15%;
  width: 100%;
  height: 50%;
  align-items: center;
  justify-content: center;
`;
const LogInInput = styled.TextInput`
  width: 70%;
  height: 50px;
  background-color: #6ba3be;
  padding-left: 10px;
  border-radius: 10px;
  margin-top: 3%;
  font-size: 20px;
`;
const LogInBtn = styled.TouchableOpacity`
  width: 70%;
  height: 50px;
  background-color: ${colors.PhoneSignInBtnBackgroundColor};
  border-radius: 10px;
  margin-top: 3%;
  justify-content: center;
  align-items: center;
`;
const LogInBtnText = styled.Text`
  color: ${colors.PhoneSignInText};
  font-size: 20px;
`;
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth();
  const LogInWithEmail = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      Alert.alert("Wrong email or password");
      console.log("LogInWithEmail", error.message);
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
      <BlockLogIn>
        <LogInInput placeholder="Email" value={email} inputMode="email" onChangeText={setEmail}></LogInInput>
        <LogInInput
          placeholder="Come up with password"
          value={password}
          secureTextEntry={true}
          onChangeText={setPassword}
        ></LogInInput>
        <LogInBtn
          onPress={() => {
            LogInWithEmail();
          }}
        >
          <LogInBtnText>Log in</LogInBtnText>
        </LogInBtn>
      </BlockLogIn>
      <ButtonRegistration onPress={() => navigation.navigate("Registration")}>
        <ButtonRegistrationText>Registration</ButtonRegistrationText>
      </ButtonRegistration>
    </LinearGradient>
  );
}

export default LoginScreen;
