import { View, Text, Button, TouchableOpacity, Alert } from "react-native";
import { getAuth } from "firebase/auth";
import React, { useState } from "react";
import styled from "styled-components";
import * as colors from "../variables/colors.js";
import { LinearGradient } from "expo-linear-gradient";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig.js";

const BlockModalChangeNikname = styled.View`
  position: absolute;
  width: 100%;
  height: 110%;
  padding-top: 5%;
  z-index: 2;
`;
const ChangeNiknameInput = styled.TextInput`
  width: 70%;
  height: 50px;
  background-color: #6ba3be;
  padding-left: 10px;
  border-radius: 10px;
  margin-top: 3%;
  font-size: 20px;
`;
const ChangeBtn = styled.TouchableOpacity`
  width: 70%;
  height: 50px;
  background-color: ${colors.PhoneSignInBtnBackgroundColor};
  border-radius: 10px;
  margin-top: 3%;
  justify-content: center;
  align-items: center;
`;
const ChangeBtnText = styled.Text`
  color: ${colors.PhoneSignInText};
  font-size: 20px;
`;
const ChangeBtnCansel = styled.TouchableOpacity`
  width: 70%;
  height: 50px;
  background-color: ${colors.PhoneSignInBtnBackgroundColor};
  border-radius: 10px;
  margin-top: 3%;
  justify-content: center;
  align-items: center;
`;
const ChangeBtnCanselText = styled.Text`
  color: ${colors.PhoneSignInText};
  font-size: 20px;
`;
export default function ModalNikname({ setModalChangeNikname }) {
  const [newNikname, setNewNikname] = useState("");
  const authFirebase = getAuth();
  const handleChangeNikname = async () => {
    if (newNikname.length < 1) {
      return Alert.alert("Your nikname should be longer then 1 symbol");
    }
    const cityRef = doc(db, "users", authFirebase.currentUser.email);
    await setDoc(cityRef, { nikname: newNikname }, { merge: true });
  };
  return (
    <BlockModalChangeNikname>
      <LinearGradient
        colors={[
          colors.LoginScreenGradientStart,
          colors.LoginScreenGradientEnd,
          colors.LoginScreenGradientEnd2,
          colors.LoginScreenGradientEnd3,
        ]}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 1.0 }}
        style={{
          height: "100%",
          width: "100%",
          paddingTop: "15%",
          paddingLeft: "5%",
          alignItems: "center",
        }}
      >
        <ChangeNiknameInput
          placeholder="Come up with new nikname"
          value={newNikname}
          onChangeText={setNewNikname}
        ></ChangeNiknameInput>
        <ChangeBtn
          onPress={() => {
            handleChangeNikname();
            setModalChangeNikname(false);
          }}
        >
          <ChangeBtnText>Change nikname</ChangeBtnText>
        </ChangeBtn>
        <ChangeBtnCansel onPress={() => setModalChangeNikname(false)}>
          <ChangeBtnCanselText>Cansel</ChangeBtnCanselText>
        </ChangeBtnCansel>
      </LinearGradient>
    </BlockModalChangeNikname>
  );
}
