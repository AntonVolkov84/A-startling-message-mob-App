import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebaseConfig.js";
import { Ionicons } from "@expo/vector-icons";
import * as colors from "../variables/colors.js";
import { getAuth } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { addDoc, doc, onSnapshot, collection, getDocs, where, query } from "firebase/firestore";

const CompanionAvatar = styled.Image`
  height: 90%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 20px;
`;
const CompanionName = styled.Text``;
const CompanionPhone = styled.Text``;
const NewMessageAlert = styled.View`
  position: absolute;
  right: 15px;
  top: 10px;
  width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

export default function DashboardCompanion({ item }) {
  const [userData, setUserData] = useState(null);
  const [newMessageArrived, setNewMessageArrived] = useState(false);
  const [chatId, setChatId] = useState(null);
  const auth = getAuth();
  const currentUserEmail = auth.currentUser.email;
  const companionEmail = item.email;
  const { t } = useTranslation();

  const findChat = async () => {
    const chatQuery = await getDocs(
      query(collection(db, "chatRoomsParticipants"), where("participants", "array-contains", currentUserEmail))
    );
    let foundChatId = null;
    chatQuery.forEach((doc) => {
      const data = doc.data();
      if (data.participants.includes(companionEmail)) {
        setChatId(doc.id);
      }
    });
    return foundChatId;
  };

  useEffect(() => {
    if (!chatId) return;
    const unsubscribe = onSnapshot(
      query(collection(db, "chatRooms", chatId, "messages")),
      where("doNotRead", "==", currentUserEmail),
      (snapshot) => {
        if (!snapshot.empty) {
          let unreadMessagesExist = false;
          snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.doNotRead && data.doNotRead.includes(currentUserEmail)) {
              unreadMessagesExist = true;
            }
          });
          setNewMessageArrived(unreadMessagesExist);
        } else {
          setNewMessageArrived(false);
        }
      }
    );
    return () => unsubscribe();
  }, [chatId, currentUserEmail]);

  useEffect(() => {
    findChat();
  }, []);
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", companionEmail), (snapshot) => {
      setUserData(snapshot.data());
    });
    return () => unsubscribe();
  }, []);
  return (
    <>
      {userData ? (
        <>
          <CompanionAvatar source={{ uri: userData.photoUrl }}></CompanionAvatar>
          <CompanionName>{userData.nikname}</CompanionName>
          <CompanionPhone>{userData.phoneNumber}</CompanionPhone>
          {newMessageArrived ? (
            <NewMessageAlert>
              <Ionicons name="alert-circle-sharp" size={20} color={colors.NewMessageArrivedColor} />
            </NewMessageAlert>
          ) : null}
        </>
      ) : (
        <Text>{t("Loading")}</Text>
      )}
    </>
  );
}
