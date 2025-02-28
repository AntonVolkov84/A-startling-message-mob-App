import { Keyboard, View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import * as colors from "../variables/colors.js";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import Message from "../components/Message.jsx";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import firebase from "firebase/compat/app";
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
  startAt,
  endAt,
} from "firebase/firestore";
import { db } from "../firebaseConfig.js";
import { getAuth } from "firebase/auth";
import * as Location from "expo-location";
import { useTranslation } from "react-i18next";
import { sendPushNotification } from "../notification.js";
import * as geofire from "geofire-common";

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
  background-color: ${colors.MessageScreenInputBackground};
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
const BlockGift = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  position: absolute;
  right: 50px;
  justify-content: center;
  align-items: center;
`;
const BlockModalGift = styled.View`
  width: 100%;
  background-color: ${colors.MessageScreenModalGiftBackground};
  height: 400px;
  position: absolute;
  z-index: 2;
  left: 3%;
  border-radius: 10px;
  padding: 8px;
`;
const ModalGiftTitle = styled.Text`
  font-size: 25px;
  color: ${colors.MessageScreenModalGiftTitle};
  text-align: center;
`;
const ModalGiftFlatList = styled.FlatList`
  width: 100%;
  height: 100%;
`;
const ModalGiftTouchableOpacity = styled.TouchableOpacity``;
const BlockGiftInfo = styled.View`
  flex-direction: row;
`;
const ModalGiftText = styled.Text`
  width: 50%;
  font-size: 20px;
`;
const ModalGiftQt = styled.Text`
  width: 30%;
  font-size: 20px;
`;
const ModalGiftPrice = styled.Text`
  width: 20%;
  font-size: 20px;
`;
const Loading = styled.Text`
  width: 100%;
  height: 70%;
  text-justify: center;
  text-align: center;
  font-size: 20px;
`;

export default function MessageScreen({ route, navigation }) {
  const [messageText, setMessageText] = useState("");
  const [messagesData, setMessagesData] = useState(null);
  const [messagesDataLoading, setMessagesDataLoading] = useState(true);
  const [giftScreen, setGiftScreen] = useState(false);
  const [giftData, setGiftData] = useState(null);
  const [giftDataLoaded, setGiftDataLoaded] = useState(false);
  const [receiverExpoPushToken, setReceiverExpoPushToken] = useState("");
  const [chatId, setChatId] = useState(null);
  const { item } = route.params;
  const { t } = useTranslation();
  const auth = getAuth();
  const currentUserEmail = auth.currentUser.email;
  const receiverEmail = item.email;
  const flatList = useRef(null);
  const currentUserUID = auth.currentUser.uid;

  const findCustomersWithinRadius = async (latitude, longitude) => {
    try {
      const center = [latitude, longitude];
      const radiusInM = 5 * 1000;
      const bounds = geofire.geohashQueryBounds(center, radiusInM);
      const promises = [];
      for (const b of bounds) {
        const q = query(collection(db, "customers"), orderBy("geohash"), startAt(b[0]), endAt(b[1]));
        promises.push(getDocs(q));
      }
      const snapshots = await Promise.all(promises);
      const matchingDocs = [];
      for (const snap of snapshots) {
        for (const doc of snap.docs) {
          const lat = doc.get("location").lat;
          const lng = doc.get("location").lng;
          const distanceInKm = geofire.distanceBetween([lat, lng], center);
          const distanceInM = distanceInKm * 1000;
          if (distanceInM <= radiusInM) {
            matchingDocs.push(doc.id);
          }
        }
      }
      return matchingDocs;
    } catch (error) {
      console.error("Error finding customers within radius:", error);
      return [];
    }
  };

  useState(() => {
    const unsubscribe = onSnapshot(doc(db, "users", receiverEmail), (snapshot) => {
      setReceiverExpoPushToken(snapshot.data().pushToken);
    });
    return () => {
      unsubscribe();
    };
  }, []);

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
      sendPushNotification(receiverExpoPushToken, messageText);
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
  const getProductByCustomer = async (customer) => {
    try {
      const docRef = collection(db, "products", customer, "personalProducts");
      const result = await getDocs(docRef);
      const arr = [];
      arr.push(result.docs.map((doc) => ({ ...doc.data() })));
      return arr;
    } catch (error) {
      console.log("getProductByCustomer", error.message);
      return null;
    }
  };
  const getProducts = async () => {
    const filteredMessageData = messagesData.filter((e) => e.autor === receiverEmail);
    const latitude = filteredMessageData[filteredMessageData.length - 1].location.coords.latitude;
    const longitude = filteredMessageData[filteredMessageData.length - 1].location.coords.longitude;
    const customers = await findCustomersWithinRadius(latitude, longitude);

    const productPromises = customers.map(async (customer) => {
      const result = await getProductByCustomer(customer);
      return result;
    });
    const productsArray = await Promise.all(productPromises);
    const arrayOfProducts = productsArray.flat(Infinity);
    console.log(arrayOfProducts);
    setGiftData(arrayOfProducts);
    setGiftDataLoaded(true);
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
      style={{ height: "100%", width: "100%", paddingTop: "10%" }}
    >
      <BlockMessageScreen>
        <MessageTitle>{t("MessageScreenMessageTitle")}</MessageTitle>
        {giftScreen && (
          <BlockModalGift>
            <ModalGiftTitle>{t("MessageScreenModalGiftTitle")}</ModalGiftTitle>
            {giftDataLoaded ? (
              <ModalGiftFlatList
                data={giftData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <ModalGiftTouchableOpacity onPress={() => console.log(item.product)}>
                    <BlockGiftInfo>
                      <ModalGiftText>{item.productName}</ModalGiftText>
                      <ModalGiftQt>{item.productQuantity}</ModalGiftQt>
                      <ModalGiftPrice>{item.productPrice}</ModalGiftPrice>
                    </BlockGiftInfo>
                  </ModalGiftTouchableOpacity>
                )}
              />
            ) : (
              <Loading>Loading...</Loading>
            )}

            <ModalGiftTouchableOpacity
              onPress={() => {
                setGiftDataLoaded(false);
                setGiftData(null);
                setGiftScreen(false);
              }}
            >
              <ModalGiftText>{t("Cancel")}</ModalGiftText>
            </ModalGiftTouchableOpacity>
          </BlockModalGift>
        )}
        <BlockGift
          onPress={() => {
            getProducts();
            setGiftScreen(true);
          }}
        >
          <FontAwesome name="gift" size={35} color={colors.MessageScreenIconGiftColor} />
        </BlockGift>
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
            placeholder={t("MessageScreenPlaceholder")}
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
