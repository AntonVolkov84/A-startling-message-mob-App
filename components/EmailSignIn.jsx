import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import styled from "styled-components";
import * as colors from "../variables/colors";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

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
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nikname, setNikname] = useState("");
  const auth = getAuth();

  const SignInEmail = async () => {
    try {
      if (verifyInputs()) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        console.log(user);
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        console.log("That email address is already in use!");
      }
      console.log("SignInEmail", error.message);
    }
  };

  const clearInput = () => {
    setPhone("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setNikname("");
  };
  const isEmail = (email) => {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  };
  const verifyInputs = () => {
    if (!nikname || !password || !confirmPassword || !email || !phone) {
      return Alert.alert("Some field is empty! Check it, please!");
    } else if (password !== confirmPassword) {
      return Alert.alert("Passwords don't match");
    } else if (password.length < 6) {
      return Alert.alert("Your password should be longer than 6 symbols");
    } else if (!isEmail(email)) {
      return Alert.alert("Something wrong with your email");
    } else {
      return true;
    }
  };

  return (
    <EmailSign>
      <EmailSignTitle>EmailSignIn</EmailSignTitle>
      <BlockEmailSign>
        <EmailSignInput placeholder="Email" value={email} inputMode="email" onChangeText={setEmail}></EmailSignInput>
        <EmailSignInput
          placeholder="Phone Number"
          value={phone}
          keyboardType="phone-pad"
          onChangeText={setPhone}
        ></EmailSignInput>
        <EmailSignInput
          placeholder="Come up with password"
          value={password}
          secureTextEntry={true}
          onChangeText={setPassword}
        ></EmailSignInput>
        <EmailSignInput
          placeholder="Confirm your password"
          value={confirmPassword}
          secureTextEntry={true}
          onChangeText={setConfirmPassword}
        ></EmailSignInput>
        <EmailSignInput placeholder="Come up with nikname" value={nikname} onChangeText={setNikname}></EmailSignInput>
        <EmailSignBtn onPress={() => SignInEmail()}>
          <EmailSignBtnText>Registrate me</EmailSignBtnText>
        </EmailSignBtn>
      </BlockEmailSign>

      <BtnGoBack>
        <BtnGoBackText onPress={() => navigation.navigate("Registration")}>Go back</BtnGoBackText>
      </BtnGoBack>
    </EmailSign>
  );
}
