import { View, Text, TouchableOpacity, Alert, Linking } from "react-native";
import React from "react";
import * as colors from "../variables/colors.js";
import styled from "styled-components";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";

const BlockFooter = styled.View`
  width: 100%;
  padding: 5px;
  height: 100%;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  position: relative;
  z-index: 2;
  background-color: ${colors.FooterBackgroundColor};
`;
const BtnIcon = styled.TouchableOpacity`
  height: 75%;
  aspect-ratio: 1;
  background-color: ${colors.FooterIconBtnBackgroundColor};
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;
const BtnIconAdd = styled.TouchableOpacity`
  height: 130%;
  aspect-ratio: 1;
  background-color: ${colors.FooterIconBtnBackgroundColor};
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  position: absolute;
  left: 43%;
  top: -10px;
`;
export default function Footer({
  setModalProfile,
  modalProfile,
  setModalAddCompanion,
  modalAddCompanion,
  setModalChangeNikname,
}) {
  const redirectToSite = () => {
    const link = "https://a-startling-message.web.app/";
    Linking.openURL(link);
  };
  return (
    <BlockFooter>
      <BtnIcon
        onPress={() => {
          setModalProfile(!modalProfile);
          setModalAddCompanion(false);
        }}
      >
        <AntDesign name="profile" size={30} color={colors.FooterIconColor} />
      </BtnIcon>
      <BtnIconAdd
        onPress={() => {
          setModalAddCompanion(!modalAddCompanion);
          setModalProfile(false);
          setModalChangeNikname(false);
        }}
      >
        <Entypo name="add-user" size={30} color={colors.FooterIconColor} />
      </BtnIconAdd>
      <BtnIcon onPress={() => redirectToSite()}>
        <MaterialCommunityIcons name="link-variant" size={30} color={colors.FooterIconColor} />
      </BtnIcon>
    </BlockFooter>
  );
}
