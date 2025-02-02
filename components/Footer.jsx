import { View, Text, TouchableOpacity, Alert, Linking } from "react-native";
import React, { useState, useEffect } from "react";
import * as colors from "../variables/colors.js";
import styled from "styled-components";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";

const BlockFooter = styled.View`
  width: 100%;
  padding: 5px;
  height: 100px;
  flex-direction: row;
  justify-content: space-around;
`;
const BtnIcon = styled.TouchableOpacity`
  height: 60%;
  aspect-ratio: 1;
  background-color: ${colors.FooterIconBtnBackgroundColor};
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;
export default function Footer({ setModalProfile, modalProfile }) {
  const redirectToSite = () => {
    const link = "https://a-startling-message.web.app/";
    Linking.openURL(link);
  };
  return (
    <BlockFooter>
      <BtnIcon onPress={() => setModalProfile(!modalProfile)}>
        <AntDesign name="profile" size={40} color={colors.FooterIconColor} />
      </BtnIcon>
      <BtnIcon onPress={() => redirectToSite()}>
        <MaterialCommunityIcons name="link-variant" size={40} color={colors.FooterIconColor} />
      </BtnIcon>
    </BlockFooter>
  );
}
