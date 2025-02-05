import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import * as colors from "../variables/colors.js";
import styled from "styled-components";
import { LinearGradient } from "expo-linear-gradient";

const BlockAddCompanion = styled.View`
  width: 100%;
  height: 96%;
  position: absolute;
`;
const AddCompanionTitle = styled.View`
  width: 100%;
  height: 50px;
  justify-content: center;
  align-items: center;
`;
const AddCompanionTitleText = styled.Text`
  color: ${colors.AddCompanionTitle};
  font-size: 25px;
`;
const BlockInput = styled.View`
  align-items: center;
  margin-top: 70px;
`;
const Tooltip = styled.View`
  width: 100%;
  height: 20px;
  align-items: center;
`;
const TooltipText = styled.Text`
  color: ${colors.AddCompanionTitle};
  font-size: 15px;
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
export default function AddCompanion() {
  const [phone, setPhone] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const isPhone = (checkedPhone) => {
    var regex = /^\+\d{1,3}\d{11,14}$/;
    return regex.test(checkedPhone);
  };
  const checkUser = async () => {
    if (!isPhone(phone)) {
      return Alert.alert("Something wrong with format your phone");
    }
    console.log(phone);
    setPhone("");
  };

  return (
    <BlockAddCompanion>
      <LinearGradient
        colors={[
          colors.LoginScreenGradientStart,
          colors.LoginScreenGradientEnd,
          colors.LoginScreenGradientEnd2,
          colors.LoginScreenGradientEnd3,
        ]}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 1.0 }}
        style={{ height: "100%", width: "100%", paddingTop: "15%" }}
      >
        <AddCompanionTitle>
          <AddCompanionTitleText>AddCompanion</AddCompanionTitleText>
        </AddCompanionTitle>
        <BlockInput>
          <Tooltip>{isFocused && <TooltipText>Phone format: + "country code" "phone number"</TooltipText>}</Tooltip>
          <PhoneSignInInput
            placeholder="Type phone for search"
            value={phone}
            onChangeText={setPhone}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          ></PhoneSignInInput>
          <PhoneSignInBtn onPress={() => checkUser()}>
            <PhoneSignInBtnText>Check</PhoneSignInBtnText>
          </PhoneSignInBtn>
        </BlockInput>
      </LinearGradient>
    </BlockAddCompanion>
  );
}
