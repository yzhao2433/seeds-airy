import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { NavigationContainer } from "@react-navigation/native";
import { app } from "../firebase";
import { auth } from "../firebase";

import Icon from "react-native-vector-icons/MaterialIcons";

import { Feather, Ionicons, AntDesign, Fontisto } from "@expo/vector-icons";

<style>
  @import
  url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');
  @import
  url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
</style>;

const Home = () => {
  return (
    <ImageBackground
      source={require("../../assets/images/home_clouds.png")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.subHeader}>Welcome back, sadbird102!</Text>

        <View style={styles.profileContainer}>
          <Text style={styles.profileRanking}>#25</Text>
          <View style={styles.profileImageContainer}>
            <Image
              source={require("../../assets/images/avatar.png")}
              style={styles.profileImage}
            />
            <View style={styles.editIconContainer}>
              <Icon name="edit" size={12} color="black" />
            </View>
          </View>
          <View>
            <Text style={styles.profileUser}>Sadbird102</Text>
            <Text style={styles.profileTag}>#dance</Text>
          </View>
          <View style={styles.pointContainer}>
            <Image
              source={require("../../assets/images/star.png")}
              style={styles.profileStar}
            />
            <Text style={styles.profilePoints}>13</Text>
          </View>
        </View>

        <Text style={styles.subHeader}>How are you feeling today?</Text>
        <View style={styles.moodWrapper}>
          <View style={styles.moodContainer}>
            <TouchableOpacity>
              <View style={[styles.moodIcon, { backgroundColor: "#FFE785" }]}>
                <Feather name="sun" size={28} color="white" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={[styles.moodIcon, { backgroundColor: "#BFD7EA" }]}>
                <Ionicons name="partly-sunny-outline" size={28} color="white" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={[styles.moodIcon, { backgroundColor: "#6495CC" }]}>
                <AntDesign name="cloudo" size={28} color="white" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={[styles.moodIcon, { backgroundColor: "#4F759B" }]}>
                <Fontisto name="rain" size={28} color="white" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={[styles.moodIcon, { backgroundColor: "#0D1821" }]}>
                <Ionicons name="thunderstorm-outline" size={28} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.subHeader}>Write down your thoughts.</Text>
        <View style={styles.textAreaContainer}>
          <TextInput
            style={[styles.textArea, { height: 50 }]}
            multiline
            numberOfLines={2}
            placeholder="Write your thoughts here..."
            placeholderTextColor="#555"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.motivationContainer}>
          <View style={styles.horizontalContainer}>
            <Image
              source={require("../../assets/images/sun_home_motivation.png")}
              style={styles.motivationImage}
            />
            <View style={styles.verticalContainer}>
              <Text style={styles.motivationTitle}>Daily Motivation</Text>
              <Text style={styles.motivationText}>
                Don't forget to send and check your messages!
              </Text>
              <TouchableOpacity style={styles.checkButton}>
                <Text style={styles.checkButtonText}>Check</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 30,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
  profileImageContainer: {
    position: "relative",
  },
  editIconContainer: {
    position: "absolute",
    width: 20,
    height: 20,
    bottom: 0,
    right: 7,
    borderRadius: 5,
    backgroundColor: "#F3F3F3",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  editIcon: {
    position: "absolute",
    width: 20,
    height: 20,
    bottom: 0,
    right: 7,
    color: "#4285F4",
  },
  profileImage: {
    width: 66,
    height: 66,
    borderRadius: 50,
    marginRight: 10,
  },
  profileRanking: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 9,
    color: "0C092A",
  },
  profileUser: {
    fontSize: 17,
  },
  profileTag: {
    fontSize: 13,
    color: "#858494",
    fontStyle: "italic",
  },
  profilePoints: {
    marginLeft: "auto",
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    position: "absolute",
  },
  pointContainer: {
    position: "relative",
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },
  profileStar: {
    width: 45,
    height: 45,
  },
  subHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    paddingVertical: 15,
    textAlign: "center",
  },
  moodWrapper: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 20,
    marginVertical: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    opacity: 0.7,
    zIndex: 1,
  },
  moodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  moodIcon: {
    width: 48,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "white",
  },
  textAreaContainer: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 20,
    marginVertical: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    opacity: 0.7,
    zIndex: 1,
  },
  textArea: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#FFD700",
    padding: 10,
    paddingVertical: 5,
    borderRadius: 33,
    zIndex: 2,
    opacity: 100,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  motivationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5CF",
    padding: 20,
    borderRadius: 20,
    marginVertical: 36,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    opacity: 0.91,
  },
  motivationImage: {
    width: 90,
    height: 90,
  },
  motivationTitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 5,
    color: "0D1821",
  },
  motivationText: {
    fontSize: 13,
    color: "#0D1821",
  },
  motivationButton: {
    marginLeft: "auto",
    backgroundColor: "#FFD700",
    padding: 10,
    paddingVertical: 5,
    borderRadius: 33,
  },
  motivationButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  verticalContainer: {
    flex: 1,
    marginLeft: 10,
  },
  checkButton: {
    padding: 10,
    marginLeft: "auto",
    backgroundColor: "#FFD700",
    paddingVertical: 5,
    borderRadius: 33,
  },
  checkButtonText: {
    color: "#0D1821",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default Home;
