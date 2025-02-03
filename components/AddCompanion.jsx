import { View, Text } from "react-native";
import React from "react";
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

export default function AddCompanion() {
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
      </LinearGradient>
    </BlockAddCompanion>
  );
}
