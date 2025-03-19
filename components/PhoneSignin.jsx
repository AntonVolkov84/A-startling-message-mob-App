import { View, Text, Button, TextInput, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState, useRef, useContext } from "react";
import * as colors from "../variables/colors";
import styled from "styled-components";
import { getAuth, updateProfile, createUserWithEmailAndPassword, signOut, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { AppContext } from "../App.js";
import { WebView } from "react-native-webview";

const PhoneSignIn = styled.View`
  width: 100%;
  margin-top: 5%;
  height: 100%;
  position: relative;
`;
const BlockPhoneSignIn = styled.View`
  width: 100%;
  height: 82%;
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
  const firebaseAuth = getAuth();
  const [verificationId, setVerificationId] = useState(null);
  const expoPushToken = useContext(AppContext);

  const webviewRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const onMessage = (event) => {
    const token = event.nativeEvent.data;
    if (!token) {
      return Alert.alert("Verification failed");
    }
    register(token);
    setLoading(false);
  };

  const onLoadStart = () => {
    setLoading(true);
  };

  const onLoadEnd = () => {
    setLoading(false);
  };

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
        pushToken: expoPushToken,
      };
      await setDoc(doc(db, "users", emailInLowerCase), user);
    } catch (error) {
      console.log("add to users", error);
    }
  };

  const register = async (token) => {
    try {
      if (!/^\+\d{10,15}$/.test(phone)) {
        throw new Error("Invalid phone number format. Please enter a valid phone number.");
      }
      if (!token) {
        throw new Error("Invalid reCAPTCHA token. Please try again.");
      }
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode?key=${process.env.EXPO_PUBLIC_API_KEY}`,
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
      if (!response.ok) {
        throw new Error(data.error.message);
      }
      setVerificationId(data.sessionInfo);
      setConfirmInput(true);
    } catch (error) {
      console.error("Error registering user", error.message);
      Alert.alert("Registration Error", error.message);
    }
  };

  const verifyCode = async () => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPhoneNumber?key=${process.env.EXPO_PUBLIC_API_KEY}`,
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
      if (!response.ok) {
        throw new Error(result.error.message);
      }
      await registerWithEmail();
      clearInput();
    } catch (error) {
      console.error("Error verifying code", error.message);
      Alert.alert("Verification Error", error.message);
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
      try {
        webviewRef.current.injectJavaScript(`document.dispatchEvent(new MessageEvent('message'));`);
      } catch (error) {
        console.log("recaptcha", error.message);
      }
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        <WebView
          ref={webviewRef}
          source={{
            html: `
          <!DOCTYPE html>
          <html>
            <head>
              <script src="https://www.google.com/recaptcha/enterprise.js?render=6Lc9bfgqAAAAAJiSNs1Oj3h-Ci4vThn3HWnMcL-M"></script>
            </head>
            <body>
              <script>
  document.addEventListener("message", function(event) {
                    grecaptcha.enterprise.ready(async () => {
                      const token = await grecaptcha.enterprise.execute('6Lc9bfgqAAAAAJiSNs1Oj3h-Ci4vThn3HWnMcL-M', {action: 'LOGIN'});
                      window.ReactNativeWebView.postMessage(token);
                    });
                  });
</script>
            </body>
          </html>
        `,
          }}
          onMessage={onMessage}
          onLoadStart={onLoadStart}
          onLoadEnd={onLoadEnd}
          style={{ flex: 1, width: "100%" }}
        />
      </View>
      <BtnGoBack>
        <BtnGoBackText onPress={() => navigation.goBack()}>Go back</BtnGoBackText>
      </BtnGoBack>
    </PhoneSignIn>
  );
}
