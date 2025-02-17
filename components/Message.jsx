import { View, Text, Image } from "react-native";
import React, { useState, useEffect, memo } from "react";
import styled from "styled-components";
import * as colors from "../variables/colors.js";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig.js";
import { getAuth } from "firebase/auth";

const BlockMessage = styled.View`
  width: 70%;
  height: fit-content;
  padding-top: 5px;
  padding-right: 5px;
  border-radius: 5px;
  flex-direction: row;
  margin-top: 5px;
`;
const BlockAutor = styled.View`
  justify-content: center;
  align-items: center;
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
  font-size: 10px;
  text-align: center;
`;
export default memo(function Message({ item }) {
  const [userData, setUserData] = useState(null);
  const [isAuthorCurrentUser, setIsAythorCurrentUser] = useState(false);
  const auth = getAuth();
  const autorEmail = item.autor;
  const currentUserEmail = auth.currentUser.email;

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", autorEmail), (snapshot) => {
      setUserData(snapshot.data());
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUserEmail === autorEmail) {
      setIsAythorCurrentUser(true);
    }
  }, []);

  return (
    <>
      {userData ? (
        <BlockMessage
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
            <MessageNameBlockText>{userData.nikname}</MessageNameBlockText>
          </BlockAutor>
          <BoxForMessage>
            <BoxForMessageText>{item.text}</BoxForMessageText>
          </BoxForMessage>
        </BlockMessage>
      ) : null}
    </>
  );
});
