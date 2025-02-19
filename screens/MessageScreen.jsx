import { Keyboard, View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import * as colors from "../variables/colors.js";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import Message from "../components/Message.jsx";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  addDoc,
  collection,
  getDocs,
  where,
  doc,
  query,
  serverTimestamp,
  onSnapshot,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { db, app } from "../firebaseConfig.js";
import { getAuth } from "firebase/auth";
import * as Location from "expo-location";

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
  const flatList = useRef(null);
  const currentUserUID = auth.currentUser.uid;

  const findChat = async () => {
    const chatQuery = await getDocs(
      query(collection(db, "chatRoomsParticipants"), where("participants", "array-contains", currentUserEmail))
    );
    let foundChatId = null;
    chatQuery.forEach((doc) => {
      const data = doc.data();
      if (data.participants.includes(receiverEmail)) {
        foundChatId = doc.id;
        setChatId(doc.id);
      }
    });
    return foundChatId;
  };
  const scrollToEnd = () => {
    if (flatList.current) {
      flatList.current.scrollToEnd({ animated: true });
    }
  };
  useEffect(() => {
    const initializeChat = async () => {
      const foundChatId = await findChat();
      if (foundChatId) {
        setChatId(foundChatId);
      } else {
        console.warn("Chat not found");
      }
    };
    initializeChat();
  }, []);

  const markMessagesAsRead = async (chatId) => {
    if (!chatId) return;
    try {
      const refForChangeMessageStatus = query(
        collection(db, "chatRooms", chatId, "messages"),
        where("doNotRead", "==", currentUserEmail)
      );
      const docForUpdate = [];
      const unreadMessages = await getDocs(refForChangeMessageStatus);
      unreadMessages.forEach((doc) => {
        docForUpdate.push(doc.id);
      });
      docForUpdate.forEach(async (id) => {
        const messageRef = doc(db, "chatRooms", chatId, "messages", id);
        await updateDoc(messageRef, { doNotRead: "read" });
      });
    } catch (error) {
      console.log("markMessagesAsRead", error.message);
    }
  };

  // useEffect(() => {
  //   Location.watchPositionAsync(
  //     {
  //       accuracy: Location.Accuracy.High,
  //       timeInterval: 10000, // обновление каждые 10 секунд
  //       distanceInterval: 50, // обновление при изменении на 50 метров
  //     },
  //     (newLocation) => {
  //       console.log("Interval", newLocation);
  //     }
  //   );
  // }, []);
  const sendMessage = async () => {
    let location = await Location.getCurrentPositionAsync({});
    try {
      const data = {
        text: messageText,
        timestamp: serverTimestamp(),
        participants: [currentUserEmail, receiverEmail],
        doNotRead: receiverEmail,
        autorUID: currentUserUID,
        autor: currentUserEmail,
        location,
      };
      await addDoc(collection(db, "chatRooms", chatId, "messages"), data);
      setMessageText("");
    } catch (error) {
      console.log("sendMessage", error.message);
    }
  };
  useEffect(() => {
    if (!chatId) {
      console.warn("chatId is null or undefined");
      return;
    }
    markMessagesAsRead(chatId);
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
        {messagesDataLoading ? (
          <MessagesFlatList></MessagesFlatList>
        ) : (
          <MessagesFlatList
            onScroll={() => Keyboard.dismiss()}
            onContentSizeChange={scrollToEnd}
            ref={flatList}
            data={messagesData}
            renderItem={({ item }) => <Message item={item}></Message>}
            keyExtractor={(item, index) => index}
          ></MessagesFlatList>
        )}

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
