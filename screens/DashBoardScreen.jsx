import { View, Text, Button, TouchableOpacity, Image, Alert } from "react-native";
import { getAuth } from "firebase/auth";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import * as colors from "../variables/colors.js";
import { LinearGradient } from "expo-linear-gradient";
import Footer from "../components/Footer.jsx";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig.js";
import ModalNikname from "../components/ModalNikname.jsx";
import Profile from "../components/Profile.jsx";
import AddCompanion from "../components/AddCompanion.jsx";

const BlockDashboard = styled.View`
  width: 100%;
  height: 93%;
  justify-content: center;
  align-content: center;
  position: relative;
  padding-left: 5%;
  padding-right: 5%;
`;

const FooterView = styled.View`
  height: 7%;
`;

export default function DashBoardScreen() {
  const [modalProfile, setModalProfile] = useState(false);
  const [modalChangeNikname, setModalChangeNikname] = useState(false);
  const [modalAddCompanion, setModalAddCompanion] = useState(false);
  const [userData, setUserData] = useState();
  const authFirebase = getAuth();
  useEffect(() => {
    onSnapshot(doc(db, "users", authFirebase.currentUser.email), (snapshot) => {
      setUserData(snapshot.data());
    });
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
        <BlockDashboard>
          <Text>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum amet exercitationem perspiciatis
            laudantium architecto. Id aspernatur itaque quibusdam exercitationem accusamus voluptates, est sit rerum nam
            suscipit possimus sunt nemo ratione. Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
            assumenda rerum consectetur deleniti provident magnam excepturi ex aut quae blanditiis fugit quo quos, fuga
            saepe vitae dicta. Temporibus, quia doloribus.
          </Text>
        </BlockDashboard>
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
