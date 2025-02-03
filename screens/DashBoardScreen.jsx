import { View, Text, Button, TouchableOpacity, Image, Alert } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import * as colors from "../variables/colors.js";
import { LinearGradient } from "expo-linear-gradient";
import Footer from "../components/Footer.jsx";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db, app } from "../firebaseConfig.js";
import Entypo from "@expo/vector-icons/Entypo";
import ModalNikname from "../components/ModalNikname.jsx";
import * as ImagePicker from "expo-image-picker";

const BlockDashboard = styled.View`
  width: 100%;
  height: 93%;
  justify-content: center;
  align-content: center;
`;
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
const FooterView = styled.View`
  height: 7%;
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
  border-radius: 50%;
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
export default function DashBoardScreen() {
  const [modalProfile, setModalProfile] = useState(false);
  const [modalChangeNikname, setModalChangeNikname] = useState(false);
  const [userData, setUserData] = useState();
  const [userDataPhotoUrl, setUserDataPhotoUrl] = useState();
  const [newPhotoURL, setNewPhotoURL] = useState();
  const authFirebase = getAuth();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (result) {
      const uriForStorage = result.assets[0].uri;
      setNewPhotoURL(uriForStorage);
      updateWithNewPhotoUrl();
    }
  };
  const updateWithNewPhotoUrl = async () => {
    if (newPhotoURL.length < 1) {
      return Alert.alert("Something wrong with your photo");
    }
    const userRef = doc(db, "users", authFirebase.currentUser.email);
    await setDoc(userRef, { photoUrl: newPhotoURL }, { merge: true });
  };
  useEffect(() => {
    onSnapshot(doc(db, "users", authFirebase.currentUser.email), (snapshot) => {
      setUserData(snapshot.data());
    });
  }, []);
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
      style={{ height: "100%", width: "100%", paddingTop: "5%" }}
    >
      {modalProfile ? (
        <>
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
                  {userDataPhotoUrl ? (
                    <Image source={{ uri: userDataPhotoUrl }} style={{ width: "108%", height: "108%" }} />
                  ) : (
                    <>
                      {newPhotoURL ? (
                        <Image source={{ uri: newPhotoURL }} style={{ width: "108%", height: "108%" }} />
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
          {modalChangeNikname ? <ModalNikname setModalChangeNikname={setModalChangeNikname} /> : null}
        </>
      ) : (
        <BlockDashboard>
          <Text>Dash</Text>
        </BlockDashboard>
      )}

      <FooterView>
        <Footer setModalProfile={setModalProfile} modalProfile={modalProfile} />
      </FooterView>
    </LinearGradient>
  );
}
