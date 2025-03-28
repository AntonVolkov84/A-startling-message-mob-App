import { View, Text, Button, TouchableOpacity, Image, Alert, FlatList, SafeAreaView } from "react-native";
import { getAuth } from "firebase/auth";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import * as colors from "../variables/colors.js";
import { LinearGradient } from "expo-linear-gradient";
import Footer from "../components/Footer.jsx";
import { collection, doc, onSnapshot, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig.js";
import ModalNikname from "../components/ModalNikname.jsx";
import Profile from "../components/Profile.jsx";
import AddCompanion from "../components/AddCompanion.jsx";
import DashboardCompanion from "../components/DashboardCompanion.jsx";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

const BlockDashboard = styled.View`
  width: 100%;
  height: 93%;
  justify-content: center;
  align-content: center;
  position: relative;
  padding-left: 5%;
  padding-right: 5%;
`;
const BlockLogo = styled.View`
  margin-top: 18%;
  width: 100%;
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const LogoIcon = styled.Image`
  width: 45px;
  aspect-ratio: 1;
  object-fit: cover;
`;
const LogoTitle = styled.Text`
  font-size: 20px;
  color: ${colors.DashLogoText};
  width: 70%;
  font-family: "Playwrite";
  margin-left: 5px;
`;
const BlockFlatList = styled.FlatList`
  margin-top: 2%;
  width: 100%;
  margin-bottom: 65px;
`;
const BlockCompanion = styled.TouchableOpacity`
  background-color: ${colors.DashCompaniomBlockBackgroundColor};
  width: 100%;
  height: 50px;
  border-radius: 15px;
  padding-left: 15px;
  align-items: center;
  flex-direction: row;
  margin-bottom: 5px;
  gap: 10px;
`;
const FooterView = styled.View`
  height: 60px;
`;
const ModalDelCompanionWindow = styled.View`
  z-index: 2;
  width: 100%;
  height: 100%;
  padding-top: 50px;
`;
const ModalDelCompanionWindowInfo = styled.View`
  width: 100%;
  height: fit-content;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;
const ModalDelCompanionWindowInfoText = styled.Text`
  text-align: center;
  font-size: 20px;
  color: ${colors.DashboardDelCompanionInfo};
`;
const ModalDelCompanionWindowBlockButton = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-top: 10px;
`;
const ModalDelCompanionWindowButton = styled.TouchableOpacity`
  height: 30px;
  width: 100px;
  background-color: ${colors.PhoneSignInBtnBackgroundColor};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;
const ModalDelCompanionWindowButtonText = styled.Text`
  text-align: center;
  color: ${colors.DashboardDelCompanionInfo};
`;

export default function DashBoardScreen({ navigation }) {
  const [modalProfile, setModalProfile] = useState(false);
  const [modalChangeNikname, setModalChangeNikname] = useState(false);
  const [modalAddCompanion, setModalAddCompanion] = useState(false);
  const [modalDelCompanion, setModalDelCompanion] = useState("");
  const [userData, setUserData] = useState();
  const [companionsData, setCompanionsData] = useState();
  const [companionsDataLoading, setCompanionsDataLoading] = useState(true);
  const authFirebase = getAuth();
  const userEmail = authFirebase.currentUser.email;
  const { t } = useTranslation();

  useEffect(() => {
    if (!userData) return;
    i18next.changeLanguage(userData.language);
  }, [userData]);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", authFirebase.currentUser.email), (snapshot) => {
      setUserData(snapshot.data());
    });
    return () => {
      unsubscribe();
    };
  }, []);
  const delCompanion = async () => {
    try {
      await deleteDoc(doc(db, "companions", userEmail, "personal_companions", modalDelCompanion.docId));
      setModalDelCompanion("");
    } catch (error) {
      console.log("delCompanion", error.message);
    }
  };
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "companions", authFirebase.currentUser.email, "personal_companions"),
      (snapshot) => {
        setCompanionsData(snapshot.docs.map((doc) => ({ docId: doc.id, ...doc.data() })));
        setCompanionsDataLoading(false);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

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
          <Profile setModalChangeNikname={setModalChangeNikname} userData={userData} />
          {modalChangeNikname ? <ModalNikname setModalChangeNikname={setModalChangeNikname} /> : null}
        </>
      ) : (
        <>
          {modalDelCompanion && (
            <ModalDelCompanionWindow>
              <BlockCompanion>
                <DashboardCompanion item={modalDelCompanion} />
              </BlockCompanion>
              <ModalDelCompanionWindowInfo>
                <ModalDelCompanionWindowInfoText>{t("DashboardDelCompanionInfo")}</ModalDelCompanionWindowInfoText>
              </ModalDelCompanionWindowInfo>
              <ModalDelCompanionWindowBlockButton>
                <ModalDelCompanionWindowButton onPress={() => setModalDelCompanion("")}>
                  <ModalDelCompanionWindowButtonText>{t("Cancel")}</ModalDelCompanionWindowButtonText>
                </ModalDelCompanionWindowButton>
                <ModalDelCompanionWindowButton
                  onPress={() => {
                    delCompanion();
                  }}
                >
                  <ModalDelCompanionWindowButtonText>{t("Delete")}</ModalDelCompanionWindowButtonText>
                </ModalDelCompanionWindowButton>
              </ModalDelCompanionWindowBlockButton>
            </ModalDelCompanionWindow>
          )}
          <BlockDashboard>
            <BlockLogo>
              <LogoIcon source={require("../assets/smileWithHand.png")}></LogoIcon>
              <LogoTitle>A startling message</LogoTitle>
            </BlockLogo>
            {companionsDataLoading ? (
              <Text style={{ textAlign: "center" }}>{t("Loading")}</Text>
            ) : (
              <SafeAreaView style={{ width: "100%", height: "100%" }}>
                <BlockFlatList
                  data={companionsData}
                  renderItem={({ item }) => (
                    <BlockCompanion
                      onLongPress={() => setModalDelCompanion(item)}
                      onPress={() => navigation.navigate("MessageScreen", { item })}
                    >
                      <DashboardCompanion item={item} />
                    </BlockCompanion>
                  )}
                  keyExtractor={(item) => item.docId}
                />
              </SafeAreaView>
            )}
          </BlockDashboard>
        </>
      )}
      <FooterView>
        <Footer
          setModalProfile={setModalProfile}
          modalProfile={modalProfile}
          setModalAddCompanion={setModalAddCompanion}
          modalAddCompanion={modalAddCompanion}
          setModalChangeNikname={setModalChangeNikname}
        />
      </FooterView>
      {modalAddCompanion && <AddCompanion userData={userData} setModalAddCompanion={setModalAddCompanion} />}
    </LinearGradient>
  );
}
