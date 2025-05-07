import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import * as colors from "../variables/colors.js";
import styled from "styled-components";
import { LinearGradient } from "expo-linear-gradient";
import { doc, addDoc, collection, getDocs, where, query, limit, serverTimestamp } from "firebase/firestore";
import { db, app } from "../firebaseConfig.js";
import { getAuth } from "firebase/auth";
import { useTranslation } from "react-i18next";

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
  margin: 3% auto;
  justify-content: center;
  align-items: center;
`;
const PhoneSignInBtnText = styled.Text`
  color: ${colors.PhoneSignInText};
  font-size: 20px;
`;
export default function AddCompanion({ userData, setModalAddCompanion }) {
  const [phone, setPhone] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const authFirebase = getAuth();
  const currentUserEmail = authFirebase.currentUser.email;
  const { t } = useTranslation();
  const isPhone = (checkedPhone) => {
    var regex = /^\+\d{1,3}\d{10,14}$/;
    return regex.test(checkedPhone);
  };
  const alreadyAddedPhone = async () => {
    const addedPhone = phone;
    setPhone("");
    console.log(addedPhone);
    try {
      const q = query(
        collection(db, "companions", currentUserEmail, "personal_companions"),
        where("phoneNumber", "==", addedPhone),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        checkUser(addedPhone);
      } else if (!querySnapshot.empty) {
        Alert.alert(`${t("AddCompanionoAlreadyExistsAlert")}`);
        return true;
      }
    } catch (error) {
      console.log("alreadyAddedPhone", error.message);
    }
  };
  const receiverCheckAddedPhone = async (receiverEmail) => {
    try {
      const q = query(
        collection(db, "companions", receiverEmail, "personal_companions"),
        where("phoneNumber", "==", userData.phoneNumber),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        addCompanionToReceiver(receiverEmail);
      } else if (!querySnapshot.empty) {
        return;
      }
    } catch (error) {
      console.log("receiverCheckAddedPhone", error.message);
    }
  };

  const addCompanionToReceiver = async (receiverEmail) => {
    try {
      const receiverCompanion = {
        phoneNumber: userData.phoneNumber,
        email: userData.email,
        timestamp: serverTimestamp(),
      };
      await addDoc(collection(db, "companions", receiverEmail, "personal_companions"), receiverCompanion);
    } catch (error) {
      console.log("addCompanionToReceiver", error.message);
    }
  };
  const createChatRoomParticipants = async (receiverEmail) => {
    const chatRoomData = {
      participants: [receiverEmail, currentUserEmail],
    };
    try {
      await addDoc(collection(db, "chatRoomsParticipants"), chatRoomData);
    } catch (error) {
      console.log("createChatRoom", error.message);
    }
  };
  const checkUser = async (addedPhone) => {
    if (!checkPhoneNumber(addedPhone)) {
      return;
    }
    try {
      const q = query(collection(db, "users"), where("phoneNumber", "==", addedPhone), limit(1));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return Alert.alert(`${t("AddCompanionoUserAlert")}`);
      }
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const receiverEmail = docSnap.data().email;
        const companion = {
          phoneNumber: docSnap.data().phoneNumber,
          email: docSnap.data().email,
          timestamp: serverTimestamp(),
        };
        await addDoc(collection(db, "companions", authFirebase.currentUser.email, "personal_companions"), companion, {
          merge: true,
        });
        Alert.alert(`${t("AddCompanionAddCompanionAlert")}`);
        await createChatRoomParticipants(receiverEmail);
        await receiverCheckAddedPhone(receiverEmail);
        setModalAddCompanion(false);
      }
    } catch (error) {
      console.log("checkUser", error.message);
    }
  };
  const checkPhoneNumber = (addedPhone = phone) => {
    if (addedPhone === userData.phoneNumber) {
      return Alert.alert(`${t("AddCompanionYourNumberAlert")}`);
    } else {
      if (!isPhone(addedPhone)) {
        return Alert.alert(`${t("AddCompanionIsPhoneAlert")}`);
      } else {
        return true;
      }
    }
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
          <AddCompanionTitleText>{t("AddCompanionTitle")}</AddCompanionTitleText>
        </AddCompanionTitle>
        <BlockInput>
          <Tooltip>{isFocused && <TooltipText>{t("AddCompanionPhoneFormat")}</TooltipText>}</Tooltip>
          <PhoneSignInInput
            placeholder={t("AddCompanionPlaceholder")}
            value={phone}
            onChangeText={setPhone}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          ></PhoneSignInInput>
        </BlockInput>
        <PhoneSignInBtn
          onPress={() => {
            alreadyAddedPhone();
          }}
        >
          <PhoneSignInBtnText>{t("AddCompanionCheckphone")}</PhoneSignInBtnText>
        </PhoneSignInBtn>
        <PhoneSignInBtn
          onPress={() => {
            setPhone("");
            setModalAddCompanion(false);
          }}
        >
          <PhoneSignInBtnText>{t("Cancel")}</PhoneSignInBtnText>
        </PhoneSignInBtn>
      </LinearGradient>
    </BlockAddCompanion>
  );
}
