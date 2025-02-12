import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig.js";

const CompanionAvatar = styled.Image`
  height: 90%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 20px;
`;
const CompanionName = styled.Text``;
const CompanionPhone = styled.Text``;

export default function DashboardCompanion({ item }) {
  const [userData, setUserData] = useState(null);
  const companionEmail = item.email;
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
        </>
      ) : (
        <Text>Loading ..</Text>
      )}
    </>
  );
}
