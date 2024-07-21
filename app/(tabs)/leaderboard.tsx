import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, Modal, FlatList} from 'react-native';
import React, { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { app } from "../firebase";
import { auth } from "../firebase";
import globalFont from '../../styles/globalfont';
import { router } from 'expo-router';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Feather, Ionicons, AntDesign, Fontisto } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const db = getFirestore(app);


const avatars = [
  { id: 1, source: require("../../assets/icons/Bee.png") },
  { id: 2, source: require("../../assets/icons/Cat.png") },
  { id: 3, source: require("../../assets/icons/Chick.png") },
  { id: 4, source: require("../../assets/icons/Crab.png") },
  { id: 5, source: require("../../assets/icons/Fox.png") },
  { id: 6, source: require("../../assets/icons/Frog.png") },
  { id: 7, source: require("../../assets/icons/Koala.png") },
  { id: 8, source: require("../../assets/icons/Lion.png") },
  { id: 9, source: require("../../assets/icons/Turtle.png") },
  { id: 10, source: require("../../assets/icons/Whale.png") },
  { id: 11, source: require("../../assets/icons/alligator.png") },
  { id: 12, source: require("../../assets/icons/ant.png") },
  { id: 13, source: require("../../assets/icons/anteater.png") },
  { id: 14, source: require("../../assets/icons/bird.png") },
  { id: 15, source: require("../../assets/icons/butterfly.png") },
  { id: 16, source: require("../../assets/icons/camel.png") },
  { id: 17, source: require("../../assets/icons/chameleon.png") },
  { id: 18, source: require("../../assets/icons/chicken.png") },
  { id: 19, source: require("../../assets/icons/cow.png") },
  { id: 20, source: require("../../assets/icons/dino.png") },
  { id: 21, source: require("../../assets/icons/dog.png") },
  { id: 22, source: require("../../assets/icons/dolphin.png") },
  { id: 23, source: require("../../assets/icons/elephant.png") },
  { id: 24, source: require("../../assets/icons/fish.png") },
  { id: 25, source: require("../../assets/icons/fox2.png") },
  { id: 26, source: require("../../assets/icons/giraffe.png") },
  { id: 27, source: require("../../assets/icons/hedgehog.png") },
  { id: 28, source: require("../../assets/icons/hippo.png") },
  { id: 29, source: require("../../assets/icons/jellyfish.png") },
  { id: 30, source: require("../../assets/icons/ladybug.png") },
  { id: 31, source: require("../../assets/icons/monkey.png") },
  { id: 32, source: require("../../assets/icons/mouse.png") },
  { id: 33, source: require("../../assets/icons/octopus.png") },
  { id: 34, source: require("../../assets/icons/owl.png") },
  { id: 35, source: require("../../assets/icons/parrot.png") },
  { id: 36, source: require("../../assets/icons/penguin.png") },
  { id: 37, source: require("../../assets/icons/pig.png") },
  { id: 38, source: require("../../assets/icons/pony.png") },
  { id: 39, source: require("../../assets/icons/seahorse.png") },
  { id: 40, source: require("../../assets/icons/seal.png") },
  { id: 41, source: require("../../assets/icons/shark.png") },
  { id: 42, source: require("../../assets/icons/sheep.png") },
  { id: 43, source: require("../../assets/icons/sloth.png") },
  { id: 44, source: require("../../assets/icons/snail.png") },
  { id: 45, source: require("../../assets/icons/snake.png") },
  { id: 46, source: require("../../assets/icons/squirrel.png") },
  { id: 47, source: require("../../assets/icons/stingray.png") },
  { id: 48, source: require("../../assets/icons/tiger.png") },
  { id: 49, source: require("../../assets/icons/panda.png") },
  { id: 50, source: require("../../assets/icons/axolotl.png") },
];

const Leaderboard = () => {
  const [userData, setUserData] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState<
    { id: number; source: any } | undefined
  >();
  const [isavatarModalVisible, setavatarModalVisible] = useState(false);

  
const defaultAvatar = require("../../assets/images/avatar.png");

const getAvatar = (avatarId: number) => {
  const avatar = avatars.find((avatar) => avatar.id === avatarId);
  return avatar ? avatar.source : defaultAvatar;
};

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userDocRef = doc(db, "user", currentUser.uid);
      
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setUserData(userData);
          console.log("User data updated:", userData);
        } else {
          console.log("User document not found");
        }
      }, (error) => {
        console.error("Error fetching user data:", error);
      });

      return () => unsubscribe();
    } else {
      console.log("Current user not found");
    }
  }, []);

  const avatarSource = userData ? getAvatar(userData.avatar) : defaultAvatar;


  return (
    <ImageBackground source={require('@/assets/images/leaderboard_background.png')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.headerContainer}>
          <Text style={[styles.subHeader, globalFont.Nunito]}>Leaderboard</Text>
        </View>

        {/* Your Ranking Section */}
        <View style={styles.yourRankingContainer}>
        <View style={styles.yourRanking}>
          <Text style={[styles.yourRankingText, globalFont.Nunito]}>Your Ranking:</Text>

            <View style={styles.profileContainer}>
              <Text style={[styles.profileRanking, globalFont.Nunito]}>#25</Text>
              <View style={styles.profileImageContainer}>
                <Image source={avatarSource} style={styles.profileImage} />
              </View>
              <View>
                <Text style={[styles.profileUser, globalFont.Montserrat]}>{userData ? userData.nickname : 'User'}</Text>
                <Text style={[styles.profileTag, globalFont.Montserrat]}>#{userData ? userData.hobbies : 'User'}</Text>
              </View>
              <View style={styles.pointContainer}>
                <Image source={require('@/assets/images/star.png')} style={styles.profileStar} />
                <Text style={[styles.profilePoints, globalFont.Montserrat]}>13</Text>
              </View>
            </View>
          </View>
        </View>
  
        {/* Other Rankings Section */}
        <ScrollView contentContainerStyle={styles.otherRankingContainer}>
          { /* Static Profile Containers for now */ }
          <View style={styles.profileContainer}>
            <Text style={[styles.profileRanking, globalFont.Nunito]}>#26</Text>
            <View style={styles.profileImageContainer}>
              <Image source={avatarSource} style={styles.profileImage} />
            </View>
            <View>
              <Text style={[styles.profileUser, globalFont.Montserrat]}>{userData ? userData.nickname : 'User'}</Text>
              <Text style={[styles.profileTag, globalFont.Montserrat]}>#{userData ? userData.hobbies : 'User'}</Text>
            </View>
            <View style={styles.pointContainer}>
              <Image source={require('@/assets/images/star.png')} style={styles.profileStar} />
              <Text style={[styles.profilePoints, globalFont.Montserrat]}>14</Text>
            </View>
          </View>
  
          <View style={styles.profileContainer}>
            <Text style={[styles.profileRanking, globalFont.Nunito]}>#27</Text>
            <View style={styles.profileImageContainer}>
              <Image source={avatarSource} style={styles.profileImage} />
            </View>
            <View>
              <Text style={[styles.profileUser, globalFont.Montserrat]}>{userData ? userData.nickname : 'User'}</Text>
              <Text style={[styles.profileTag, globalFont.Montserrat]}>#{userData ? userData.hobbies : 'User'}</Text>
            </View>
            <View style={styles.pointContainer}>
              <Image source={require('@/assets/images/star.png')} style={styles.profileStar} />
              <Text style={[styles.profilePoints, globalFont.Montserrat]}>15</Text>
            </View>
          </View>
  
          <View style={styles.profileContainer}>
            <Text style={[styles.profileRanking, globalFont.Nunito]}>#28</Text>
            <View style={styles.profileImageContainer}>
              <Image source={avatarSource} style={styles.profileImage} />
            </View>
            <View>
              <Text style={[styles.profileUser, globalFont.Montserrat]}>{userData ? userData.nickname : 'User'}</Text>
              <Text style={[styles.profileTag, globalFont.Montserrat]}>#{userData ? userData.hobbies : 'User'}</Text>
            </View>
            <View style={styles.pointContainer}>
              <Image source={require('@/assets/images/star.png')} style={styles.profileStar} />
              <Text style={[styles.profilePoints, globalFont.Montserrat]}>16</Text>
            </View>
          </View>
  
          <View style={styles.profileContainer}>
            <Text style={[styles.profileRanking, globalFont.Nunito]}>#29</Text>
            <View style={styles.profileImageContainer}>
              <Image source={avatarSource} style={styles.profileImage} />
            </View>
            <View>
              <Text style={[styles.profileUser, globalFont.Montserrat]}>{userData ? userData.nickname : 'User'}</Text>
              <Text style={[styles.profileTag, globalFont.Montserrat]}>#{userData ? userData.hobbies : 'User'}</Text>
            </View>
            <View style={styles.pointContainer}>
              <Image source={require('@/assets/images/star.png')} style={styles.profileStar} />
              <Text style={[styles.profilePoints, globalFont.Montserrat]}>17</Text>
            </View>
          </View>
  
          <View style={styles.profileContainer}>
            <Text style={[styles.profileRanking, globalFont.Nunito]}>#30</Text>
            <View style={styles.profileImageContainer}>
              <Image source={avatarSource} style={styles.profileImage} />
            </View>
            <View>
              <Text style={[styles.profileUser, globalFont.Montserrat]}>{userData ? userData.nickname : 'User'}</Text>
              <Text style={[styles.profileTag, globalFont.Montserrat]}>#{userData ? userData.hobbies : 'User'}</Text>
            </View>
            <View style={styles.pointContainer}>
              <Image source={require('@/assets/images/star.png')} style={styles.profileStar} />
              <Text style={[styles.profilePoints, globalFont.Montserrat]}>18</Text>
            </View>
          </View>

          <View style={styles.profileContainer}>
            <Text style={[styles.profileRanking, globalFont.Nunito]}>#29</Text>
            <View style={styles.profileImageContainer}>
              <Image source={avatarSource} style={styles.profileImage} />
            </View>
            <View>
              <Text style={[styles.profileUser, globalFont.Montserrat]}>{userData ? userData.nickname : 'User'}</Text>
              <Text style={[styles.profileTag, globalFont.Montserrat]}>#{userData ? userData.hobbies : 'User'}</Text>
            </View>
            <View style={styles.pointContainer}>
              <Image source={require('@/assets/images/star.png')} style={styles.profileStar} />
              <Text style={[styles.profilePoints, globalFont.Montserrat]}>17</Text>
            </View>
          </View>
          </ScrollView>
        </ScrollView>
    </ImageBackground>
  );
};
  const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
    container: {
      flexGrow: 1,
      paddingHorizontal: 18,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between', 
      marginVertical: 0,
      paddingVertical: 15,
    },
    subHeader: {
      fontSize: 32,
      fontWeight: 'bold',
      paddingVertical:5,
      textAlign:'center',
      fontFamily:'Nunito-Bold',
      color:'black',
      flex: 1,
    },
    yourRankingContainer: {
      marginBottom: 30,
    },
    yourRankingText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'black',
      marginBottom: 10,
    },
    yourRanking: {
      backgroundColor: '#FFE785',
      borderRadius: 10,
      paddingVertical: 10,
      paddingBottom:5,
      paddingHorizontal: 10,
    },
    otherRankingContainer: {
      backgroundColor: '#BFD7EA',
      borderRadius: 20,
      paddingVertical: 20,
      paddingTop:30,
      paddingHorizontal: 10,
      marginBottom: 30,
      flexGrow: 1,
    },
    profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFF',
      paddingVertical: 10,
      paddingHorizontal: 10,
      marginHorizontal:10,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 3.84,
      marginBottom: 15, 
    },
    profileImageContainer: {
      position: 'relative',
    },
    profileImage: {
      width: 66,
      height: 66,
      borderRadius: 50,
      marginRight: 10,
    },
    profileRanking: {
      fontSize: 24,
      fontWeight: 'bold',
      marginRight: 9,
      color: '#0C092A',
    },
    profileUser: {
      fontSize: 17,
      fontFamily: 'Montserrat-Light',
    },
    profileTag: {
      fontSize: 13,
      color: '#858494',
      fontStyle: 'italic',
      fontFamily: 'Nunito-Bold',
    },
    profilePoints: {
      marginLeft: 'auto',
      fontSize: 14,
      fontWeight: 'bold',
      color: 'white',
      position: 'absolute',
    },
    pointContainer: {
      position: 'relative',
      width: 45,
      height: 45,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 'auto',
    },
    profileStar: {
      width: 45,
      height: 45,
    },
  });

  
  export default Leaderboard;