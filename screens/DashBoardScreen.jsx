import { View, Text, Button, TouchableOpacity, Alert } from "react-native";
import auth from "@react-native-firebase/auth";
import { getAuth, signOut } from "firebase/auth";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import * as colors from "../variables/colors.js";
import { LinearGradient } from "expo-linear-gradient";
import Footer from "../components/Footer.jsx";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig.js";
import Entypo from "@expo/vector-icons/Entypo";

const BlockDashboard = styled.View`
  width: 100%;
  height: 93%;
  justify-content: center;
  align-content: center;
`;
const BlockDashboardProfile = styled.View`
  width: 100%;
  height: 93%;
  padding-top: 5%;
  padding-left: 5%;
  padding-right: 5%;
`;
const BlockProfileInfo = styled.View`
  width: 100%;
  height: 90%;
`;

const ProfileInfoTitle = styled.View`
  width: 100%;
  height: 50px;
  align-items: center;
`;
const ProfileInfoTitleText = styled.Text`
  width: 100%;
  height: 90%;
  color: ${colors.ProfileInfoText};
  font-size: 40px;
  text-align: center;
`;
const ProfileInfoLine = styled.View`
  width: 100%;
  border: 1px ${colors.ProfileInfoText} solid;
`;
const ProfileInfo = styled.View`
  width: 100%;
  height: 65px;
`;
const ProfileInfoText = styled.Text`
  color: ${colors.ProfileInfoText};
  font-size: 23px;
`;
const FooterView = styled.View`
  height: 7%;
`;
const BlockWithIcon = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
const Icon = styled.TouchableOpacity`
  width: 10%;
  aspect-ratio: 1;
  background-color: ${colors.ProfileIconBackground};
  align-items: center;
  justify-content: center;
  border-radius: 5px;
`;
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
export default function DashBoardScreen() {
  const [modalProfile, setModalProfile] = useState(false);
  const [modalChangeNikname, setModalChangeNikname] = useState(false);
  const [modalChangeLanguage, setModalChangeLanguage] = useState(false);
  const [newNikname, setNewNikname] = useState("");
  const [lng, setLng] = useState("");
  const [userData, setUserData] = useState();
  const authFirebase = getAuth();

  useEffect(() => {
    onSnapshot(doc(db, "users", authFirebase.currentUser.email), (snapshot) => {
      setUserData(snapshot.data());
    });
  }, []);
  const handleSignedOut = async () => {
    try {
      const authFirebase = getAuth();
      signOut(authFirebase);
      auth().signOut();
    } catch (error) {
      console.log("HandleSignedOut", error.message);
    }
  };
  const handleChangeNikname = async () => {
    if (newNikname.length < 1) {
      return Alert.alert("Your nikname should be longer then 1 symbol");
    }
    const cityRef = doc(db, "users", authFirebase.currentUser.email);
    await setDoc(cityRef, { nikname: newNikname }, { merge: true });
  };
  const handleChangeLanguage = async () => {
    if (lng.length < 1) {
      return Alert.alert("Your language should be longer then 1 symbol");
    }
    const cityRef = doc(db, "users", authFirebase.currentUser.email);
    await setDoc(cityRef, { language: lng }, { merge: true });
    setNewNikname("");
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
      {modalProfile ? (
        <>
          <BlockDashboardProfile>
            <BlockProfileInfo>
              <ProfileInfoTitle>
                <ProfileInfoTitleText>Profile</ProfileInfoTitleText>
              </ProfileInfoTitle>
              <ProfileInfo>
                <ProfileInfoText>Email: </ProfileInfoText>

                <ProfileInfoText>{userData?.email || "Loading.."}</ProfileInfoText>

                <ProfileInfoLine></ProfileInfoLine>
                <ProfileInfoText>Nikname: </ProfileInfoText>
                <BlockWithIcon>
                  <ProfileInfoText>{userData?.nikname || "Loading.."}</ProfileInfoText>
                  <Icon
                    onPress={() => setModalChangeNikname(true)}
                    style={{
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 7,
                      },
                      shadowOpacity: 0.41,
                      shadowRadius: 9.11,

                      elevation: 14,
                    }}
                  >
                    <Entypo name="edit" size={24} color={colors.ProfileIcon} />
                  </Icon>
                </BlockWithIcon>
                <ProfileInfoLine></ProfileInfoLine>
                <ProfileInfoText>Phone number: </ProfileInfoText>
                <ProfileInfoText>{userData?.phoneNumber || "Loading.."}</ProfileInfoText>
                <ProfileInfoLine></ProfileInfoLine>
                <ProfileInfoText>Language: </ProfileInfoText>
                <BlockWithIcon>
                  <ProfileInfoText>{userData?.language || "Loading.."}</ProfileInfoText>
                  <Icon
                    onPress={() => setModalChangeLanguage(true)}
                    style={{
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 7,
                      },
                      shadowOpacity: 0.41,
                      shadowRadius: 9.11,

                      elevation: 14,
                    }}
                  >
                    <Entypo name="edit" size={24} color={colors.ProfileIcon} />
                  </Icon>
                </BlockWithIcon>
                <ProfileInfoLine></ProfileInfoLine>
              </ProfileInfo>
            </BlockProfileInfo>

            <Button
              title="SignOut"
              onPress={() => {
                handleSignedOut();
              }}
            ></Button>
          </BlockDashboardProfile>
          {modalChangeNikname ? (
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
          ) : null}
          {modalChangeLanguage ? (
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
                <ChangeBtn
                  onPress={() => {
                    handleChangeLanguage();
                    setModalChangeLanguage(false);
                  }}
                >
                  <ChangeBtnText>Change language</ChangeBtnText>
                </ChangeBtn>
                <ChangeBtnCansel onPress={() => setModalChangeLanguage(false)}>
                  <ChangeBtnCanselText>Cansel</ChangeBtnCanselText>
                </ChangeBtnCansel>
              </LinearGradient>
            </BlockModalChangeNikname>
          ) : null}
        </>
      ) : (
        <BlockDashboard>
          <Text>Dash</Text>
        </BlockDashboard>
      )}

      <FooterView>
        <Footer setModalProfile={setModalProfile} modalProfile={modalProfile} />
      </FooterView>
    </LinearGradient>
  );
}
