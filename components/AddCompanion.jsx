import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import * as colors from "../variables/colors.js";
import styled from "styled-components";
import { LinearGradient } from "expo-linear-gradient";
import {
  doc,
  setDoc,
  addDoc,
  getDoc,
  collection,
  getDocs,
  where,
  query,
  arrayUnion,
  deleteDoc,
  updateDoc,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db, app } from "../firebaseConfig.js";
import { getAuth } from "firebase/auth";

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
export default function AddCompanion({ userData, setModalAddCompanion }) {
  const [phone, setPhone] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const authFirebase = getAuth();

  const isPhone = (checkedPhone) => {
    var regex = /^\+\d{1,3}\d{11,14}$/;
    return regex.test(checkedPhone);
  };
  const checkUser = async () => {
    if (!checkPhoneNumber()) {
      return;
    }
    try {
      const q = query(collection(db, "users"), where("phoneNumber", "==", phone), limit(1));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return Alert.alert("There is not users with this phone number");
      }
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const companion = {
          nikname: docSnap.data().nikname,
          photoUrl: docSnap.data().photoUrl,
          phoneNumber: docSnap.data().phoneNumber,
          email: docSnap.data().email,
          timestamp: serverTimestamp(),
        };
        await setDoc(doc(db, "companions", authFirebase.currentUser.email, "personal_companions", phone), companion);
        Alert.alert("You add a companion");
        setPhone("");
        setModalAddCompanion(false);
      }
    } catch (error) {
      console.log("checkUser", error.message);
    }
  };
  const checkPhoneNumber = () => {
    if (phone === userData.phoneNumber) {
      return Alert.alert("This is your number");
    } else {
      if (!isPhone(phone)) {
        return Alert.alert("Something wrong with format your phone");
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
