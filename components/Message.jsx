import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect, memo } from "react";
import styled from "styled-components";
import * as colors from "../variables/colors.js";
import { doc, getDoc, onSnapshot, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig.js";
import { getAuth } from "firebase/auth";
import { useTranslation } from "react-i18next";

const BlockMessage = styled.TouchableOpacity`
  width: 70%;
  height: fit-content;
  padding-right: 5px;
  border-radius: 5px;
  flex-direction: row;
  margin-top: 5px;
`;
const BlockAutor = styled.View`
  justify-content: center;
  align-items: center;
  padding-top: 5px;
`;
const MessageAvatarBlock = styled.Image`
  height: 40px;
  aspect-ratio: 1;
  border-radius: 10px;
  object-fit: cover;
`;
const BoxForMessage = styled.View`
  width: 84%;
  padding-left: 5px;
`;
const BoxForMessageText = styled.Text`
  font-size: 18px;
`;
const MessageNameBlockText = styled.Text`
  width: 50px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 8px;
  text-align: center;
`;
const Modal = styled.View`
  width: 70%;
  height: fit-content;
  padding: 5px;
  border-radius: 5px;
  margin-top: 5px;
  margin-left: 30%;
  background-color: ${colors.MessageBackgroundColorWithAuthor};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const ModalBtn = styled.TouchableOpacity`
  width: 70px;
  height: 30px;
  background-color: ${colors.MessageBackgroundColor};
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ModalBtnText = styled.Text`
  font-size: 12px;
  text-align: center;
  color: white;
`;

export default memo(function Message({ item, setMessageUpdate, userData }) {
  const [changeMessage, setChangeMessage] = useState(false);
  const auth = getAuth();
  const { t } = useTranslation();
  const isAuthorCurrentUser = userData.isAuthorCurrentUser;

  const deleteMessage = async () => {
    try {
      await deleteDoc(doc(db, "chatRooms", item.parentId, "messages", item.docId));
    } catch (error) {
      console.log("deleteMessage", error.message);
    }
  };
  return (
    <>
      {changeMessage && isAuthorCurrentUser ? (
        <Modal>
          <ModalBtn onPress={() => setChangeMessage(false)}>
            <ModalBtnText>{t("Cancel")}</ModalBtnText>
          </ModalBtn>
          <ModalBtn
            onPress={() => {
              setMessageUpdate({
                messageText: item.text,
                parentId: item.parentId,
                docId: item.docId,
              });
              setChangeMessage(false);
            }}
          >
            <ModalBtnText>{t("Update")}</ModalBtnText>
          </ModalBtn>
          <ModalBtn>
            <ModalBtnText
              onPress={() => {
                deleteMessage();
                setChangeMessage(false);
              }}
            >
              {t("Delete")}
            </ModalBtnText>
          </ModalBtn>
        </Modal>
      ) : (
        <BlockMessage
          onLongPress={() => setChangeMessage(true)}
          style={{
            paddingLeft: isAuthorCurrentUser ? 15 : 5,
            backgroundColor: isAuthorCurrentUser
              ? colors.MessageBackgroundColorWithAuthor
              : colors.MessageBackgroundColor,
            borderRadius: 5,
            flexDirection: isAuthorCurrentUser ? "row-reverse" : "row",
            marginLeft: isAuthorCurrentUser ? "30%" : "0",
          }}
        >
          <BlockAutor>
            <MessageAvatarBlock
              source={{
                uri: userData.photoUrl,
              }}
            ></MessageAvatarBlock>
            <MessageNameBlockText numberOfLines={1}>{userData.nikname}</MessageNameBlockText>
          </BlockAutor>
          <BoxForMessage>
            <BoxForMessageText style={{ marginRight: isAuthorCurrentUser ? 0 : 10 }}>{item.text}</BoxForMessageText>
          </BoxForMessage>
        </BlockMessage>
      )}
    </>
  );
});
