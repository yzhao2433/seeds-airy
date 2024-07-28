import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Modal,
  FlatList,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
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
import globalFont from "../../styles/globalfont";
import { router } from "expo-router";

import Icon from "react-native-vector-icons/FontAwesome";
import { Feather, Ionicons, AntDesign, Fontisto } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

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
];

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [thoughts, setThoughts] = useState([]);
  const [selectedPost, setSelectedPost] = useState({});
  const [moods, setMoods] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<
    { id: number; source: any } | undefined
  >();
  const [isavatarModalVisible, setavatarModalVisible] = useState(false);
  const [isMoodsVisible, setMoodsVisible] = useState(false);

  const defaultAvatar = require("../../assets/images/avatar.png");

  const getAvatar = (avatarId: number) => {
    const avatar = avatars.find((avatar) => avatar.id === avatarId);
    return avatar ? avatar.source : defaultAvatar;
  };

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userDocRef = doc(db, "user", currentUser.uid);
      console.log("Setting up real-time listener...");

      const unsubscribe = onSnapshot(
        userDocRef,
        (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            setUserData(userData);
            setThoughts(userData.thoughts || []);
            setMoods(userData.moods || []);
            console.log("User data updated:", userData);
          } else {
            console.log("User document not found");
          }
        },
        (error) => {
          console.error("Error fetching user data:", error);
        }
      );

      // Clean up the listener on component unmount
      return () => unsubscribe();
    } else {
      console.log("Current user not found");
    }
  }, []);

  console.log("Current user data:", userData);

  const moodIcons = {
    1: <Ionicons name="thunderstorm-outline" size={20} color="#023567" />,
    2: <Fontisto name="rain" size={20} color="#023567" />,
    3: <AntDesign name="cloudo" size={20} color="#023567" />,
    4: <Ionicons name="partly-sunny-outline" size={20} color="#023567" />,
    5: <Feather name="sun" size={20} color="#023567" />,
  };

  const getBackgroundColor = (moodIconNumber: number) => {
    switch (moodIconNumber) {
      case 5:
        return "#FFE785";
      case 4:
        return "#BFD7EA";
      case 3:
        return "#6495CC";
      case 2:
        return "#4F759B";
      case 1:
        return "#0D1821";
      default:
        return "#3498db";
    }
  };

  const openModal = (post) => {
    setSelectedPost(post);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedPost({});
    setModalVisible(false);
  };

  const handleAvatarSelect = async (item: { id: number; source: any }) => {
    const usersRef = collection(db, "user");
    const currentUser = auth.currentUser?.uid;
    const currUserDoc = doc(usersRef, currentUser);
    setSelectedAvatar(item);
    await updateDoc(currUserDoc, { avatar: item.id });
    setavatarModalVisible(false);
  };

  const handleModalClose = () => {
    setavatarModalVisible(false);
  };

  const avatarSource = userData ? getAvatar(userData.avatar) : defaultAvatar;

  return (
    <ImageBackground
      source={require("@/assets/images/profilebackground.png")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={[styles.subHeader, globalFont.Nunito]}>Profile</Text>
          <TouchableOpacity
            style={styles.logoutContainer}
            onPress={() => router.navigate("/features")}
          >
            <MaterialIcons name="logout" size={28} color="#023567" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileContainer}>
          <Text style={[styles.profileRanking, globalFont.Nunito]}>
            #{userData ? userData.rank : 0}
          </Text>
          <View style={styles.profileImageContainer}>
            <Image source={avatarSource} style={styles.profileImage} />
            <View style={styles.editIconContainer}>
              <Icon
                name="edit"
                size={12}
                color="black"
                onPress={() => {
                  setavatarModalVisible(true);
                }}
              />
            </View>
          </View>
          <View>
            <Text style={[styles.profileUser, globalFont.Montserrat]}>
              {userData ? userData.nickname : "User"}
            </Text>
            <Text style={[styles.profileTag, globalFont.Montserrat]}>
              {userData ? userData.hobbies : "User"}
            </Text>
          </View>
          <View style={styles.pointContainer}>
            <Image
              source={require("@/assets/images/star.png")}
              style={styles.profileStar}
            />
            <Text style={[styles.profilePoints, globalFont.Montserrat]}>
              {userData ? userData.score : 0}
            </Text>
          </View>
        </View>

        <Modal
          visible={isavatarModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={handleModalClose}
        >
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPressOut={handleModalClose}
          >
            <View style={styles.modalContainer}>
              <FlatList
                data={avatars}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleAvatarSelect(item)}
                    style={styles.avatarTouchable}
                  >
                    <Image source={item.source} style={styles.avatar} />
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
                numColumns={4}
                contentContainerStyle={styles.flatListContent}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* <View style={styles.whiteContainer}>
          <Text style={styles.title}>Mood Tracker</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {moods.map((mood, index) => (
              <View
                key={index}
                style={[
                  styles.moodEntry,
                  { backgroundColor: getBackgroundColor(mood.moodIcon) },
                ]}
              >
                <Text style={styles.mooddayLabel}>{mood.date}</Text>
                <Text style={styles.mooddayofweekLabel}>{mood.dayOfWeek}</Text>
                <View style={styles.moodIconContainer}>
                  <View style={styles.circle}>{moodIcons[mood.moodIcon]}</View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View> */}
        <View style={styles.whiteContainer}>
          <Text style={styles.title}>Mood Tracker</Text>
          {moods.length === 0 ? (
            <View>
              {/* <TouchableOpacity onPress={() => router.navigate("/index")}> */}
              <Text style={styles.noMoodOrThought}>
                {" "}
                Check out home to input a mood.
              </Text>
              {/* </TouchableOpacity> */}
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {moods.map((mood, index) => (
                <View
                  key={index}
                  style={[
                    styles.moodEntry,
                    { backgroundColor: getBackgroundColor(mood.moodIcon) },
                  ]}
                >
                  <Text style={styles.mooddayLabel}>{mood.date}</Text>
                  <Text style={styles.mooddayofweekLabel}>
                    {mood.dayOfWeek}
                  </Text>
                  <View style={styles.moodIconContainer}>
                    <View style={styles.circle}>
                      {moodIcons[mood.moodIcon]}
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.whiteContainer}>
          <Text style={styles.title}>Thought Bubble History</Text>

          {thoughts.length === 0 ? (
            <View>
              {/* <TouchableOpacity onPress={() => router.navigate("/index")}> */}
              <Text style={styles.noMoodOrThought}>
                Check out home to input your thoughts.
              </Text>
              {/* </TouchableOpacity> */}
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {thoughts.map((thought, index) => (
                <View key={index} style={styles.postItContainer}>
                  <Text style={styles.dayLabel}>{thought.date}</Text>
                  <TouchableOpacity
                    style={styles.postIt}
                    onPress={() => openModal(thought)}
                  >
                    <Text style={styles.postItText}>
                      {thought.thought.slice(0, 62)}
                      {thought.thought.length > 50 ? "..." : ""}
                    </Text>
                    <View style={styles.seeMoreButton}>
                      <Text style={styles.seeMoreText}>See More</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.thoughtModalBackground}>
              <View style={styles.modalContent}>
              <TouchableOpacity style={styles.headerCloseButton} onPress={closeModal}>
                      <AntDesign name="close" size={25} color="black" />
                    </TouchableOpacity>
                <ScrollView style={styles.scrollView}>
                  <Text style={styles.modalText}>{selectedPost.thought}</Text>
                </ScrollView>
              </View>
            </View>
        </Modal>
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
    justifyContent: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 0,
    paddingVertical: 15,
    paddingHorizontal: "25%",
  },
  subHeader: {
    fontSize: 32,
    fontWeight: "bold",
    paddingVertical: 5,
    textAlign: "center",
    fontFamily: "Nunito-Bold",
    color: "white",
    flex: 1,
  },
  logoutIcon: {
    marginRight: "auto",
  },
  logoutContainer: {
    backgroundColor: "#FFE785",
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 2,
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
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
    fontFamily: "Montserrat-Light",
  },
  profileTag: {
    fontSize: 13,
    color: "#858494",
    fontStyle: "italic",
    fontFamily: "Nunito-Bold",
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
  dropdownContainer: {
    margin: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#BFD7EA",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "85%",
    backgroundColor: "white",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    width: "80%",
    padding: 5,
    borderRadius: 10,
    maxHeight: "60%",
    justifyContent: "space-evenly",
  },
  flatListContent: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    margin: 5,
  },
  avatarText: {
    fontFamily: "Montserrat",
    color: "#ccc",
    justifyContent: "flex-start",
  },
  avatarTouchable: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    padding: 3,
  },
  fields: {
    color: "#4F759B",
    fontSize: 16,
    fontFamily: "Nunito",
    fontWeight: "700",
    width: "85%",
    alignSelf: "center",
  },

  noMoodsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noMoodsText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
    textAlign: "center",
  },

  moodEntry: {
    marginRight: 10,
    padding: 10,
    paddingHorizontal: 7,
    backgroundColor: "#3498db",
    borderRadius: 10,
    opacity: 0.7,
  },
  moodContent: {
    alignItems: "center",
  },
  mooddayLabel: {
    fontSize: 20,
    marginBottom: 1,
    color: "white",
    textAlign: "center",
  },
  moodIconContainer: {
    alignItems: "center",
    marginTop: 5,
  },
  mooddayofweekLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Nunito",
    color: "white",
    textAlign: "center",
  },
  circle: {
    width: 35,
    height: 35,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.2,
    borderColor: "white",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Nunito",
    textAlign: "center",
  },
  whiteContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    padding: 20,
    alignItems: "center",
    marginTop: "10%",
    paddingHorizontal: 5,
  },
  horizontalScroll: {
    flexDirection: "row",
    overflow: "hidden",
  },
  postItContainer: {
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 10,
  },
  dayLabel: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "Nunito",
  },
  postIt: {
    width: 83,
    height: 83,
    aspectRatio: 1,
    backgroundColor: "#FAF4DD",
    borderWidth: 1,
    borderColor: "#BFD7EA",
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postItText: {
    marginBottom: 10,
    fontSize: 7,
    fontFamily: "Montserrat",
  },
  seeMoreButton: {
    backgroundColor: "#ccc",
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 7,
    right: 7,
  },
  seeMoreText: {
    color: "#000",
    fontSize: 7,
    fontFamily: "Nunito",
  },

  modalContent: {
    height: "38%",
    width: "78%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 4,
    borderColor: "#BFD7EA",
    alignContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCloseButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 5,
  },
  closeButtonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalText: {
    marginTop: 20,
    fontSize: 13,
    fontFamily: "Montserrat",
    textAlign: "left",
  },

  thoughtModalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  
  scrollView: {
    maxHeight: 300,
    width: "100%",
    marginTop: 10,
  },

  noMoodOrThought: {
    fontFamily: "Montserrat",
  },
});

export default Profile;
