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


const db = getFirestore(app);

const Leaderboard = () => {
  const [userData, setUserData] = useState(null);

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

  return (
    <View style={styles.container}>
      <Text>Leaderboard</Text>
      {userData ? (
        <View>
          <Text>User ID: {auth.currentUser.uid}</Text>
          <Text>Nickname: {userData.nickname}</Text>
        </View>
      ) : (
        <Text>Loading user data...</Text>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
});

export default Leaderboard;
