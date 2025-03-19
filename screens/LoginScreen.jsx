import React, { useState, useEffect, useContext } from "react";
import { Text, View, TouchableOpacity, Image, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as colors from "../variables/colors.js";
import styled from "styled-components";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Animated, {
  Easing,
  withSequence,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { AppContext } from "../App.js";
import { db } from "../firebaseConfig.js";
import { updateDoc, doc } from "firebase/firestore";

const ButtonRegistration = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  margin-top: 40px;
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
const AnimatedView = styled.View`
  width: 30%;
  height: 30%;
  justify-content: center;
  align-items: center;
  z-index: 3;
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
const Smile = styled.Image`
  width: 140px;
  height: 140px;
  object-fit: cover;
`;
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth();
  const bounceValue = useSharedValue(1);
  const translateXValue = useSharedValue(0);
  const expoPushToken = useContext(AppContext);

  const updateNotificationToken = async (currentUserEmail) => {
    try {
      const firebaseRef = doc(db, "users", currentUserEmail);
      await updateDoc(firebaseRef, {
        pushToken: expoPushToken,
      });
    } catch (error) {
      console.log("updateNotificationToken", error.message);
    }
  };
  useEffect(() => {
    const animate = () => {
      bounceValue.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.3, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );

      translateXValue.value = withRepeat(
        withSequence(
          withTiming(-30, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(30, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    };

    animate();
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: bounceValue.value }, { translateX: translateXValue.value }],
    };
  });

  const LogInWithEmail = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      updateNotificationToken(email);
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
        <AnimatedView>
          <Animated.View style={animatedStyle}>
            <Smile source={require("../assets/smile.png")} />
          </Animated.View>
        </AnimatedView>
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
