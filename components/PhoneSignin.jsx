import { View, Text, Button, TextInput, Alert, TouchableOpacity } from "react-native";
import React, { useState, useRef } from "react";
import * as colors from "../variables/colors";
import styled from "styled-components";
import Recaptcha from "react-native-recaptcha-that-works";
import { getAuth, updateProfile, createUserWithEmailAndPassword, signOut, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { app, db } from "../firebaseConfig";

const PhoneSignIn = styled.View`
  width: 100%;
  margin-top: 5%;
  height: 100%;
  position: relative;
`;
const BlockPhoneSignIn = styled.View`
  width: 100%;
  height: 71%;
  align-items: center;
`;
const PhoneSignInTitle = styled.Text`
  margin-top: 10%;
  width: 100%;
  font-size: 30px;
  color: ${colors.PhoneSignInText};
  text-align: center;
`;
const PhoneSignInInput = styled.TextInput`
  width: 70%;
  height: 50px;
  background-color: #6ba3be;
  padding-left: 10px;
  border-radius: 10px;
  margin-top: 3%;
  font-size: 20px;
`;
const PhoneSignInBtn = styled.TouchableOpacity`
  width: 70%;
  height: 50px;
  background-color: ${colors.PhoneSignInBtnBackgroundColor};
  border-radius: 10px;
  margin-top: 3%;
  justify-content: center;
  align-items: center;
`;
const PhoneSignInBtnText = styled.Text`
  color: ${colors.PhoneSignInText};
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
export default function PhoneSignin({ navigation }) {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nikname, setNikname] = useState("");
  const [code, setCode] = useState("");
  const [confirmInput, setConfirmInput] = useState(false);
  const recaptchaRef = useRef();
  const firebaseAuth = getAuth();
  const [verificationId, setVerificationId] = useState(null);

  const addToUsers = async (userId) => {
    const emailInLowerCase = email.toLowerCase();
    try {
      const user = {
        language: "en",
        timestamp: serverTimestamp(),
        nikname: nikname,
        email: emailInLowerCase,
        userId: userId,
        phoneNumber: phone,
      };
      await setDoc(doc(db, "users", emailInLowerCase), user);
    } catch (error) {
      console.log("add to users", error);
    }
  };

  const register = async (token) => {
    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode?key=AIzaSyDfJfOIoEjz7LsL-G2VafThBMRYCXvl-jI",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: phone,
            recaptchaToken: token,
          }),
        }
      );
      const data = await response.json();
      setVerificationId(data.sessionInfo);
      setConfirmInput(true);
    } catch (error) {
      console.error("Error registering user", error);
    }
  };
  const verifyCode = async () => {
    try {
      await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPhoneNumber?key=AIzaSyDfJfOIoEjz7LsL-G2VafThBMRYCXvl-jI",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionInfo: verificationId,
            code: code,
          }),
        }
      );
      await registerWithEmail();
      clearInput();
    } catch (error) {
      console.error("Error verifying code", error);
    }
  };
  const registerWithEmail = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const user = userCredential.user;
      const userToken = await user.getIdToken();
      await updateProfile(user, { displayName: nikname, phoneNumber: phone });
      const userId = user.uid;
      if (userId) {
        await sendEmailVerification(user);
        Alert.alert("You may recived a mail with link for authorization");
        navigation.navigate("Login");
        addToUsers(userId);
        signOut(firebaseAuth);
      }
      return userToken;
    } catch (error) {
      console.log("registerWithEmail", error.message);
    }
  };
  const phoneSignInApp = () => {
    if (verifyInputs()) {
      recaptchaRef.current.open();
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
    <PhoneSignIn>
      <PhoneSignInTitle>Registration</PhoneSignInTitle>
      <BlockPhoneSignIn>
        <PhoneSignInInput
          placeholder="Phone Number"
          value={phone}
          keyboardType="phone-pad"
          onChangeText={setPhone}
        ></PhoneSignInInput>
        <PhoneSignInInput
          placeholder="Email"
          value={email}
          inputMode="email"
          onChangeText={setEmail}
        ></PhoneSignInInput>
        <PhoneSignInInput
          placeholder="Come up with password"
          value={password}
          secureTextEntry={true}
          onChangeText={setPassword}
        ></PhoneSignInInput>
        <PhoneSignInInput
          placeholder="Confirm your password"
          value={confirmPassword}
          secureTextEntry={true}
          onChangeText={setConfirmPassword}
        ></PhoneSignInInput>
        <PhoneSignInInput
          placeholder="Come up with nikname"
          value={nikname}
          onChangeText={setNikname}
        ></PhoneSignInInput>
        <PhoneSignInBtn onPress={() => phoneSignInApp(phone)}>
          <PhoneSignInBtnText>Registrate me</PhoneSignInBtnText>
        </PhoneSignInBtn>
        {confirmInput ? (
          <>
            <PhoneSignInInput placeholder="Type code from sms" value={code} onChangeText={setCode}></PhoneSignInInput>
            <PhoneSignInBtn onPress={() => verifyCode()}>
              <PhoneSignInBtnText>Confirm code</PhoneSignInBtnText>
            </PhoneSignInBtn>
          </>
        ) : null}
      </BlockPhoneSignIn>
      <Recaptcha
        ref={recaptchaRef}
        siteKey={process.env.EXPO_PUBLIC_API_SITEKEY}
        baseUrl="http://localhost"
        onVerify={(token) => {
          register(token);
        }}
      />
      <BtnGoBack>
        <BtnGoBackText onPress={() => navigation.goBack()}>Go back</BtnGoBackText>
      </BtnGoBack>
    </PhoneSignIn>
  );
}
