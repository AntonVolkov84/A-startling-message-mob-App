import { Keyboard, View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import * as colors from "../variables/colors.js";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import Message from "../components/Message.jsx";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import axios from "axios";
import moment from "moment-timezone";
import tzlookup from "tz-lookup";
import {
  addDoc,
  collection,
  getDocs,
  getDoc,
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
  margin-top: 5px;
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
  margin-bottom: 2px;
  padding-left: 3px;
  background-color: ${colors.MessageScreenModalGiftBackgroung};
  border-radius: 3px;
`;
const ModalGiftText = styled.Text`
  width: 50%;
  font-size: 20px;
  color: ${colors.MessageScreenModalGiftTextColor};
`;
const ModalGiftTextCancel = styled.Text`
  width: 50%;
  font-size: 20px;
  color: ${colors.MessageScreenModalGiftTitle};
`;
const ModalGiftQt = styled.Text`
  width: 30%;
  font-size: 20px;
  color: ${colors.MessageScreenModalGiftTextColor};
`;
const ModalGiftPrice = styled.Text`
  width: 20%;
  font-size: 20px;
  color: ${colors.MessageScreenModalGiftTextColor};
`;
const Loading = styled.Text`
  width: 100%;
  height: 70%;
  text-justify: center;
  text-align: center;
  font-size: 20px;
  color: ${colors.MessageScreenModalGiftTextColor};
`;
const TextAlertExpiredTimeMessage = styled.Text`
  font-size: 20px;
  text-align: center;
  color: ${colors.MessageScreenModalGiftAlertExpiredMessage};
`;

export default function MessageScreen({ route, navigation }) {
  const [messageText, setMessageText] = useState("");
  const [messagesData, setMessagesData] = useState(null);
  const [messagesDataLoading, setMessagesDataLoading] = useState(true);
  const [messagesUpdate, setMessageUpdate] = useState("");
  const [authorsData, setAuthorsData] = useState({});
  const [giftScreen, setGiftScreen] = useState(false);
  const [giftData, setGiftData] = useState(null);
  const [giftDataLoaded, setGiftDataLoaded] = useState(false);
  const [noCustomersAvailable, setNoCustomerAvailable] = useState(false);
  const [alertExpiredTimeForGift, setAlertExpiredTimeForGift] = useState(false);
  const [location, setLocation] = useState(null);
  const [receiverExpoPushToken, setReceiverExpoPushToken] = useState("");
  const [chatId, setChatId] = useState(null);
  const { item } = route.params;
  const { t } = useTranslation();
  const auth = getAuth();
  const currentUserEmail = auth.currentUser.email;
  const receiverEmail = item.email;
  const receiverPhone = item.phoneNumber;
  const flatList = useRef(null);
  const isScrolledToBottom = useRef(true);
  const currentUserUID = auth.currentUser.uid;

  useEffect(() => {
    const uniqueEmails = [currentUserEmail, receiverEmail];
    const unsubscribes = [];
    uniqueEmails.forEach((email) => {
      const unsub = onSnapshot(doc(db, "users", email), (snapshot) => {
        const data = snapshot.data();
        const isAuthorCurrentUser = currentUserEmail === data.email;
        setAuthorsData((prev) => ({
          ...prev,
          [email]: {
            ...data,
            isAuthorCurrentUser,
          },
        }));
      });
      unsubscribes.push(unsub);
    });

    return () => unsubscribes.forEach((unsub) => unsub());
  }, [messagesData]);

  const updateMessage = async () => {
    try {
      await updateDoc(doc(db, "chatRooms", messagesUpdate.parentId, "messages", messagesUpdate.docId), {
        text: messageText,
      });
      setMessageUpdate("");
      setMessageText("");
    } catch (error) {
      console.log("updateMessage", error.message);
    }
  };
  useEffect(() => {
    setMessageText(messagesUpdate.messageText);
  }, [messagesUpdate]);
  const getAdressFromLocation = async () => {
    try {
      const latitude = location.latitude;
      const longitude = location.longitude;
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      if (response.data && response.data.address) {
        const address = response.data.address;
        const street = address.road || address.pedestrian || address.cycleway || address.path || "";
        const houseNumber = address.house_number || "";
        const result = `${street} ${houseNumber}`.trim();
        return result;
      } else {
        throw new Error("Не удалось получить адрес");
      }
    } catch (error) {
      console.log("getAdressFromLocation", error.message);
    }
  };
  const checkUserAmount = async (price) => {
    try {
      const q = await getDoc(doc(db, "users", currentUserEmail));
      const amount = await q.data().userAccount;
      if (amount - price < 0) {
        setGiftScreen(false);
        setLocation(null);
        return false;
      } else {
        const user = auth.currentUser;
        if (user) {
          const idToken = await user.getIdToken();
          const response = await fetch("https://stroymonitoring.info/funds/writeoff", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({
              email: currentUserEmail,
              price: price,
            }),
          });
          if (response.status === 200) {
            return true;
          } else {
            return false;
          }
        }
      }
    } catch (error) {
      console.log("checkUserAmount", error.message);
    }
  };
  const sendGift = async (item) => {
    const code = rendomCode();
    setGiftScreen(false);
    const hasEnoughMoney = await checkUserAmount(item.productPrice);
    if (!hasEnoughMoney) {
      return Alert.alert(`${t("MessageScreenAlertInsufficient")}`);
    }
    const address = await getAdressFromLocation();
    const messageForCustomer = `Some one choose your product for gift to ${receiverPhone}. 
    Product: ${item.productName}, product quantity: ${item.productQuantity}, product price: ${item.productPrice}. 
    Receiver may have code for gift: ${code}. Last address of receiver ${address}. Thank you for your cooperation! 
    
    Ваш товар выбрали для подарка для ${receiverPhone}. 
    Продукт: ${item.productName}, количество продукта: ${item.productQuantity}, цена: ${item.productPrice}. 
    У получателя должен быть код: ${code}. Последнее местоположение получателя ${address}. Спасибо за сотрудничество!`;
    sendEmailToCustomer(item.parentdocId, messageForCustomer);
    const dataForLog = {
      salesEmail: item.parentdocId,
      salesProductName: item.productName,
      salesProductQuantity: item.productQuantity,
      salesProductPrice: item.productPrice,
      receiverPhone: receiverPhone,
    };
    makeLog(dataForLog);
    sendSMSTelegramm(item.parentdocId, messageForCustomer);
    sendMessage(item.selectedEmoji, code);
    setLocation(null);
  };
  const sendSMSTelegramm = async (email, messageForCustomer) => {
    try {
      await axios.post("https://stroymonitoring.info/notify/telegram", {
        email: email,
        message: messageForCustomer,
      });
    } catch (error) {
      console.error("Error occurred while sending message:", error.message);
      setError("Произошла ошибка при отправке сообщения.");
    }
  };
  const makeLog = async (dataForLog) => {
    try {
      await axios.post(`https://stroymonitoring.info/log-purchase`, dataForLog);
    } catch (error) {
      console.log("makeLog", error.message);
    }
  };
  const sendEmailToCustomer = async (toEmail, messageForCustomer) => {
    try {
      await axios.post("https://stroymonitoring.info/notify/email", {
        toEmail,
        messageForCustomer,
      });
    } catch (error) {
      console.log("sendEmailToCustomer", error.message);
    }
  };
  const findCustomersWithinRadius = async (latitude, longitude) => {
    setLocation({ latitude, longitude });
    try {
      const center = [latitude, longitude];
      const radiusInM = 5 * 100;
      const bounds = geofire.geohashQueryBounds(center, radiusInM);
      const promises = [];
      for (const b of bounds) {
        const q = query(collection(db, "customers"), orderBy("geohash"), startAt(b[0]), endAt(b[1]));
        promises.push(getDocs(q));
      }
      const snapshots = await Promise.all(promises);
      const matchingDocs = [];
      const timezone = tzlookup(latitude, longitude);
      const currentTime = moment().tz(timezone);
      const currentHour = currentTime.hour();
      for (const snap of snapshots) {
        for (const doc of snap.docs) {
          const lat = doc.get("location").lat;
          const lng = doc.get("location").lng;
          const distanceInKm = geofire.distanceBetween([lat, lng], center);
          const distanceInM = distanceInKm * 1000;
          if (distanceInM <= radiusInM) {
            const startWorkingTime = parseInt(doc.get("startWorkingTime"), 10);
            const endWorkingTime = parseInt(doc.get("endWorkingTime"), 10);
            if (currentHour >= startWorkingTime && currentHour < endWorkingTime) {
              matchingDocs.push(doc.id);
            }
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
    try {
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
    } catch (error) {
      console.log("findChat", error.message);
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

  const rendomCode = () => {
    const codeForGift = Math.floor(Math.random() * 1000);
    return codeForGift;
  };
  const checkReceiverIncludeCompanion = async () => {
    try {
      const q = await getDocs(
        query(
          collection(db, "companions", receiverEmail, "personal_companions"),
          where("email", "==", currentUserEmail)
        )
      );
      if (!q.empty) {
        return;
      } else {
        addCompanionToReceiver();
      }
    } catch (error) {
      console.log("checkReceiverIncludeCompanion", error.message);
    }
  };
  const addCompanionToReceiver = async () => {
    try {
      console.log("1");
      const q = await getDoc(doc(db, "users", currentUserEmail));
      const phone = q.data().phoneNumber;
      const data = {
        email: currentUserEmail,
        timestamp: serverTimestamp(),
        phoneNumber: phone,
      };
      await addDoc(collection(db, "companions", receiverEmail, "personal_companions"), data);
    } catch (error) {
      console.log("addCompanionToReceiver", error.message);
    }
  };
  const sendMessage = async (messageText, codeForGift) => {
    checkReceiverIncludeCompanion();
    setMessageText("");
    try {
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const text = codeForGift ? `${messageText} ${codeForGift}` : messageText;
      const data = {
        text: text,
        timestamp: serverTimestamp(),
        participants: [currentUserEmail, receiverEmail],
        doNotRead: receiverEmail,
        autorUID: currentUserUID,
        autor: currentUserEmail,
        location,
      };
      await addDoc(collection(db, "chatRooms", chatId, "messages"), data);
      sendPushNotification(receiverExpoPushToken, messageText);
    } catch (error) {
      console.log("sendMessage", error.message);
    }
  };

  useEffect(() => {
    if (!chatId) {
      return;
    }
    markMessagesAsRead(chatId);
    const unsubscribe = onSnapshot(
      query(collection(db, "chatRooms", chatId, "messages"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setMessagesData(
          snapshot.docs.map((doc) => ({ docId: doc.id, parentId: doc.ref.parent.parent.id, ...doc.data() }))
        );
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
      arr.push(
        result.docs.map((doc) => {
          const docRef = doc.ref;
          const parentCollectionRef = docRef.parent;
          const parendDocRef = parentCollectionRef.parent;
          const parentDocId = parendDocRef.id;
          return { parentdocId: parentDocId, docId: doc.id, ...doc.data() };
        })
      );
      return arr;
    } catch (error) {
      console.log("getProductByCustomer", error.message);
      return null;
    }
  };
  const checkTimeOfLastMessage = (timestamp) => {
    const messageDate = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    const currentDate = new Date();
    const timeDifference = currentDate - messageDate;
    const timeDifferenceInMinutes = timeDifference / (1000 * 60);
    if (timeDifferenceInMinutes < 5) {
      return true;
    } else {
      setAlertExpiredTimeForGift(true);
      setGiftData(true);
      setGiftDataLoaded(true);
      return false;
    }
  };

  const getProducts = async () => {
    const filteredMessageData = messagesData.filter((e) => e.autor === receiverEmail);
    const timestemp = filteredMessageData[filteredMessageData.length - 1].timestamp;
    if (!checkTimeOfLastMessage(timestemp)) {
      return;
    }
    const latitude = filteredMessageData[filteredMessageData.length - 1].location.coords.latitude;
    const longitude = filteredMessageData[filteredMessageData.length - 1].location.coords.longitude;
    const customers = await findCustomersWithinRadius(latitude, longitude);

    const productPromises = customers.map(async (customer) => {
      const result = await getProductByCustomer(customer);
      return result;
    });
    const productsArray = await Promise.all(productPromises);
    const arrayOfProducts = productsArray.flat(Infinity);
    if (!arrayOfProducts.length) {
      setNoCustomerAvailable(true);
    }
    setGiftData(arrayOfProducts);
    setGiftDataLoaded(true);
  };
  useEffect(() => {
    if (isScrolledToBottom.current && flatList.current) {
      flatList.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [messagesData]);

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
            {alertExpiredTimeForGift && (
              <TextAlertExpiredTimeMessage>{t("MessageScreenModalGiftExpire")}</TextAlertExpiredTimeMessage>
            )}
            {noCustomersAvailable && (
              <TextAlertExpiredTimeMessage>{t("MessageScreenModalGiftNoCustomers")}</TextAlertExpiredTimeMessage>
            )}
            {giftDataLoaded ? (
              <ModalGiftFlatList
                data={giftData}
                keyExtractor={(item, index) => index}
                renderItem={({ item }) => (
                  <ModalGiftTouchableOpacity
                    onPress={async () => {
                      sendGift(item);
                    }}
                  >
                    <BlockGiftInfo>
                      <ModalGiftText>{item.selectedEmoji + " " + item.productName}</ModalGiftText>
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
                setNoCustomerAvailable(false);
                setGiftDataLoaded(false);
                setAlertExpiredTimeForGift(false);
                setGiftData(null);
                setGiftScreen(false);
                setLocation(null);
              }}
            >
              <ModalGiftTextCancel>{t("Cancel")}</ModalGiftTextCancel>
            </ModalGiftTouchableOpacity>
          </BlockModalGift>
        )}
        <BlockGift
          onPress={() => {
            Keyboard.dismiss();
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
            inverted
            onScroll={(event) => {
              Keyboard.dismiss();
              const offsetY = event.nativeEvent.contentOffset.y;
              isScrolledToBottom.current = offsetY < 100;
            }}
            scrollEventThrottle={16}
            ref={flatList}
            data={messagesData}
            renderItem={({ item }) => (
              <Message userData={authorsData[item.autor]} setMessageUpdate={setMessageUpdate} item={item}></Message>
            )}
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
          <IconSend onPress={() => (messagesUpdate ? updateMessage() : sendMessage(messageText))}>
            <FontAwesome name="send" size={20} color={colors.MessageScreenGoBackIconColor} />
          </IconSend>
        </InputBlock>
      </BlockMessageScreen>
    </LinearGradient>
  );
}
