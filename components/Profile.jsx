import { View, Text, Button, TouchableOpacity, Image, Alert } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import * as colors from "../variables/colors.js";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig.js";
import Entypo from "@expo/vector-icons/Entypo";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import * as Crypto from "expo-crypto";

const BlockDashboardProfile = styled.View`
  width: 100%;
  height: 93%;
  padding-top: 5%;
  padding-left: 5%;
  padding-right: 5%;
`;
const BlockProfileInfo = styled.View`
  width: 100%;
  height: 90%;
`;

const ProfileInfoTitle = styled.View`
  width: 100%;
  height: 50px;
  align-items: center;
`;
const ProfileInfoTitleText = styled.Text`
  width: 100%;
  height: 90%;
  color: ${colors.ProfileInfoText};
  font-size: 40px;
  text-align: center;
`;
const ProfileInfoLine = styled.View`
  width: 100%;
  border: 1px ${colors.ProfileInfoText} solid;
`;
const ProfileInfo = styled.View`
  width: 100%;
  height: 65px;
`;
const ProfileInfoText = styled.Text`
  color: ${colors.ProfileInfoText};
  font-size: 23px;
`;
const BlockWithIcon = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
const Icon = styled.TouchableOpacity`
  width: 10%;
  aspect-ratio: 1;
  background-color: ${colors.ProfileIconBackground};
  align-items: center;
  justify-content: center;
  border-radius: 5px;
`;
const BlockImage = styled.TouchableOpacity`
  background-color: ${colors.ProfileImageBackground};
  width: 70%;
  aspect-ratio: 1;
  margin: 5% auto;
  border-radius: 20%;
  justify-content: center;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  overflow: hidden;
`;
const BlockImageText = styled.Text`
  color: ${colors.ProfileInfoText};
  font-size: 30px;
  text-align: center;
`;
export default function Profile({ setModalChangeNikname, userData }) {
  const [userDataPhotoUrl, setUserDataPhotoUrl] = useState();
  const [newPhotoURL, setNewPhotoURL] = useState();
  const authFirebase = getAuth();
  const fileForDelFromStorage = userData.fileForDel;

  useEffect(() => {
    if (userData) {
      if (userData.hasOwnProperty("photoUrl")) {
        setUserDataPhotoUrl(userData.photoUrl);
      }
    }
  }, [userData]);

  const handleSignedOut = async () => {
    try {
      const authFirebase = getAuth();
      signOut(authFirebase);
    } catch (error) {
      console.log("HandleSignedOut", error.message);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (result) {
      const uriForStorage = result.assets[0].uri;
      const fileName = result.assets[0].uri.split("/").pop();
      const fileData = new FormData();
      fileData.append("file", {
        uri: uriForStorage,
        name: fileName,
        type: "image/png",
      });
      setNewPhotoURL(uriForStorage);
      const { responseUrl, public_id } = await uploadImageToStore(uriForStorage, fileName);

      updateWithNewPhotoUrl(responseUrl, public_id);
    }
  };
  const deleteFileFromStorage = async () => {
    if (fileForDelFromStorage) {
      try {
        const apiUrl = "https://api.cloudinary.com/v1_1/dzzkzubs0/image/destroy";
        const data = {
          public_id: fileForDelFromStorage,
          api_key: process.env.EXPO_PUBLIC_APPLICATION_KEY_ID,
          timestamp: Math.floor(Date.now() / 1000),
        };
        const stringToSign = `public_id=${data.public_id}&timestamp=${data.timestamp}${process.env.EXPO_PUBLIC_APPLICATION_KEY_SECRET}`;
        const signature = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA1, stringToSign);
        data.signature = signature;

        const response = await axios.post(apiUrl, data);
      } catch (error) {
        console.log("deleteFileFromStorage", error.message);
      }
    } else {
      return;
    }
  };
  const uploadImageToStore = async (uriForStorage, fileName) => {
    const apiUrl = "https://api.cloudinary.com/v1_1/dzzkzubs0/image/upload";
    const data = new FormData();
    try {
      data.append("file", {
        uri: uriForStorage,
        type: "image/png",
        name: fileName,
      });
      data.append("upload_preset", "A startling message");
      const response = await axios.post(apiUrl, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { public_id } = response.data;

      const responseUrl = response.data.secure_url;
      if (responseUrl) {
        deleteFileFromStorage();
      }
      return { responseUrl, public_id };
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const updateWithNewPhotoUrl = async (fileForFirebase, public_id) => {
    const userRef = doc(db, "users", authFirebase.currentUser.email);
    await setDoc(userRef, { photoUrl: fileForFirebase, fileForDel: public_id }, { merge: true });
  };

  return (
    <BlockDashboardProfile>
      <BlockProfileInfo>
        <ProfileInfoTitle>
          <ProfileInfoTitleText>Profile</ProfileInfoTitleText>
        </ProfileInfoTitle>
        <ProfileInfo>
          <ProfileInfoText>Email: </ProfileInfoText>

          <ProfileInfoText>{userData?.email || "Loading.."}</ProfileInfoText>

          <ProfileInfoLine></ProfileInfoLine>
          <ProfileInfoText>Nikname: </ProfileInfoText>
          <BlockWithIcon>
            <ProfileInfoText>{userData?.nikname || "Loading.."}</ProfileInfoText>
            <Icon
              onPress={() => setModalChangeNikname(true)}
              style={{
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 7,
                },
                shadowOpacity: 0.41,
                shadowRadius: 9.11,

                elevation: 14,
              }}
            >
              <Entypo name="edit" size={24} color={colors.ProfileIcon} />
            </Icon>
          </BlockWithIcon>
          <ProfileInfoLine></ProfileInfoLine>
          <ProfileInfoText>Phone number: </ProfileInfoText>
          <ProfileInfoText>{userData?.phoneNumber || "Loading.."}</ProfileInfoText>
          <ProfileInfoLine></ProfileInfoLine>
          <ProfileInfoText>Language: </ProfileInfoText>
          <BlockWithIcon>
            <ProfileInfoText>{userData?.language || "Loading.."}</ProfileInfoText>
            <Icon
              onPress={() => console.log("future relise")}
              style={{
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 7,
                },
                shadowOpacity: 0.41,
                shadowRadius: 9.11,

                elevation: 14,
              }}
            >
              <Entypo name="edit" size={24} color={colors.ProfileIcon} />
            </Icon>
          </BlockWithIcon>
          <ProfileInfoLine></ProfileInfoLine>
          <BlockImage onPress={() => pickImage()}>
            {newPhotoURL ? (
              <Image source={{ uri: userDataPhotoUrl || newPhotoURL }} style={{ aspectRatio: 1, height: "100%" }} />
            ) : (
              <>
                {userDataPhotoUrl ? (
                  <Image source={{ uri: userDataPhotoUrl }} style={{ aspectRatio: 1, height: "100%" }} />
                ) : (
                  <BlockImageText>Press here to choose your avatar</BlockImageText>
                )}
              </>
            )}
          </BlockImage>
        </ProfileInfo>
      </BlockProfileInfo>

      <Button
        title="SignOut"
        onPress={() => {
          handleSignedOut();
        }}
      ></Button>
    </BlockDashboardProfile>
  );
}
