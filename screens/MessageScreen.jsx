import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import * as colors from "../variables/colors.js";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import Message from "../components/Message.jsx";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { addDoc, collection, getDocs, where, query, serverTimestamp, onSnapshot, orderBy } from "firebase/firestore";
import { db, app } from "../firebaseConfig.js";
import { getAuth } from "firebase/auth";

const BlockMessageScreen = styled.View`
  width: 100%;
  height: 100%;
  padding: 10px;
`;
const MessageTitle = styled.Text`
  color: ${colors.MessageScreenTitleColor};
  text-align: center;
  font-size: 20px;
`;
const MessagesFlatList = styled.FlatList`
  width: 100%;
`;
const InputBlock = styled.View`
  flex-direction: row;
  width: 100%;
  height: 50px;
  padding: 0;
`;
const MessageInput = styled.TextInput`
  width: 70%;
  height: 50px;
  background-color: #6ba3be;
  padding-left: 10px;
  border-radius: 10px;
  margin-left: 10px;
  font-size: 20px;
`;
const IconSend = styled.TouchableOpacity`
  height: 50px;
  width: 50px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  background-color: ${colors.MessageScreenGoBackBackground};
`;
const GoBackBlock = styled.TouchableOpacity`
  width: 50px;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: ${colors.MessageScreenGoBackBackground};
  justify-content: center;
  align-items: center;
`;

export default function MessageScreen({ route, navigation }) {
  const [messageText, setMessageText] = useState("");
  const [messagesData, setMessagesData] = useState(null);
  const [messagesDataLoading, setMessagesDataLoading] = useState(true);
  const [chatId, setChatId] = useState(null);
  const { item } = route.params;
  const auth = getAuth();
  const currentUserEmail = auth.currentUser.email;
  const receiverEmail = item.email;
  const flatList = React.useRef(null);
  console.log("messagesData", messagesData);
  const findChat = async () => {
    const chatQuery = await getDocs(
      query(collection(db, "chatRoomsParticipants"), where("participants", "array-contains", currentUserEmail))
    );
    let foundChatId = null;
    chatQuery.forEach((doc) => {
      const data = doc.data();
      if (data.participants.includes(receiverEmail)) {
        setChatId(doc.id);
      }
    });
    return foundChatId;
  };

  const sendMessage = async () => {
    try {
      const data = {
        text: messageText,
        timestamp: serverTimestamp(),
        participants: [currentUserEmail, receiverEmail],
        doNotRead: receiverEmail,
      };
      await addDoc(collection(db, "chatRooms", chatId, "messages"), data);
    } catch (error) {
      console.log("sendMessage", error.message);
    }
  };
  const scrollToEnd = () => {
    if (flatList.current) {
      flatList.current.scrollToEnd({ animated: true });
    }
  };
  useEffect(() => {
    findChat();
  }, []);
  useEffect(() => {
    if (!chatId) {
      console.warn("chatId is null or undefined");
      return;
    }
    const unsubscribe = onSnapshot(
      query(collection(db, "chatRooms", chatId, "messages"), orderBy("timestamp", "asc")),
      (snapshot) => {
        setMessagesData(snapshot.docs.map((doc) => ({ ...doc.data() })));
        scrollToEnd();
        setMessagesDataLoading(false);
      }
    );

    return () => unsubscribe();
  }, [chatId]);

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
      style={{ height: "100%", width: "100%", paddingTop: "10%" }}
    >
      <BlockMessageScreen>
        <MessageTitle>Messages</MessageTitle>
        <MessagesFlatList ref={flatList}></MessagesFlatList>
        <InputBlock>
          <GoBackBlock onPress={() => navigation.navigate("Dashboard")}>
            <AntDesign name="back" size={30} color={colors.MessageScreenGoBackIconColor} />
          </GoBackBlock>
          <MessageInput
            multiline
            placeholder="Type your message"
            value={messageText}
            onChangeText={setMessageText}
          ></MessageInput>
          <IconSend onPress={() => sendMessage()}>
            <FontAwesome name="send" size={20} color={colors.MessageScreenGoBackIconColor} />
          </IconSend>
        </InputBlock>
      </BlockMessageScreen>
    </LinearGradient>
  );
}
