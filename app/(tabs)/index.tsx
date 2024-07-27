import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TextInput,
  Modal,
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

import Icon from "react-native-vector-icons/MaterialIcons";

import { Feather, Ionicons, AntDesign, Fontisto } from "@expo/vector-icons";

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

const db = getFirestore(app);
const currUserId = auth.currentUser?.uid ?? "";
const usersRef = collection(db, "user");
console.log("line25: ", currUserId);
console.log("line26: ", auth.currentUser);

const defaultAvatar = require("../../assets/images/avatar.png");

const getAvatar = (avatarId: number) => {
  const avatar = avatars.find((avatar) => avatar.id === avatarId);
  return avatar ? avatar.source : defaultAvatar;
};

const getTodayDate = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // getMonth() returns 0-based month index, so add 1
  const day = String(today.getDate()).padStart(2, "0"); // getDate() returns the day of the month
  return `${month}-${day}`;
};

const getTodayDay = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  return day;
};

const getDayOfWeek = () => {
  const today = new Date();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return daysOfWeek[today.getDay()];
};

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [thought, setThought] = useState("");
  const [placeholder, setPlaceholder] = useState("Write your thoughts here...");
  const [textAreaBgColor, setTextAreaBgColor] = useState("white");
  const [buttonBgColor, setButtonBgColor] = useState({
    skip: "#FFE785",
    submit: "#FFE785",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSkipDisabled, setIsSkipDisabled] = useState(false);
  const [messageLeft, setMessageLeft] = useState(0);
  const avatarSource = userData ? getAvatar(userData.avatar) : defaultAvatar;

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userDocRef = doc(db, "user", currentUser.uid);

      const unsubscribe = onSnapshot(
        userDocRef,
        (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            setUserData(userData);
            console.log("User data updated:", userData);
            console.log("User rank:", userData.rank);
            console.log("User score:", userData.score);

            const todayDate = getTodayDay();
            const todayMood = userData.moods?.find(
              (mood) => mood.date === todayDate
            );
            setSelectedMood(todayMood ? todayMood.moodIcon : null);

            setThought(
              userData.thoughts?.find(
                (thought) => thought.date === getTodayDate()
              )?.thought || ""
            );
            setMessageLeft(userData.messageLeft || 0);
            console.log("User data updated:", userData);
          } else {
            console.log("User document not found");
          }
        },
        (error) => {
          console.error("Error fetching user data:", error);
        }
      );

      return () => unsubscribe();
    } else {
      console.log("Current user not found");
    }
  }, []);

  console.log("Current user data:", userData);

  const updateUserMood = async (newMoodIcon) => {
    const todayDate = getTodayDay();
    const todayDayOfWeek = getDayOfWeek();
    const userId = auth.currentUser?.uid || "";

    try {
      const userDocRef = doc(db, "user", userId);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.data();
      let moodIcons = userData.moods || [];

      const existingMood = moodIcons.find((mood) => mood.date === todayDate);
      if (existingMood) {
        existingMood.moodIcon = newMoodIcon;
        existingMood.dayOfWeek = todayDayOfWeek;
      } else {
        moodIcons.unshift({
          date: todayDate,
          moodIcon: newMoodIcon,
          dayOfWeek: todayDayOfWeek,
        });
        if (moodIcons.length > 7) {
          moodIcons.pop();
        }
      }
      await updateDoc(userDocRef, { moods: moodIcons });

      console.log("Mood icons updated successfully");
      setSelectedMood(newMoodIcon);
    } catch (error) {
      console.error("Error updating mood icons:", error);
    }
  };

  const updateUserThoughts = async () => {
    const userId = auth.currentUser?.uid || "";
    const todayDate = getTodayDate();

    try {
      const userDocRef = doc(db, "user", userId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        let thoughts = userData.thoughts || [];

        if (thoughts.length > 0 && thoughts[0].date === todayDate) {
          thoughts[0].thought = thought;
        } else {
          thoughts.unshift({ date: todayDate, thought });
          if (thoughts.length > 7) {
            thoughts.pop();
          }
        }
        await updateDoc(userDocRef, { thoughts });

        console.log("Thoughts updated successfully");
      } else {
        console.log("User document not found");
      }
    } catch (error) {
      console.error("Error updating thoughts:", error);
    }
  };

  const handleThoughtSubmit = () => {
    updateUserThoughts();
    setTextAreaBgColor("#FFFFFF");
    setButtonBgColor({ ...buttonBgColor, submit: "#FFE785" });
    setIsSkipDisabled(true);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleThoughtSkip = () => {
    setThought("No thoughts available");
    setPlaceholder(
      "You skipped your thoughts for now. Remember, you can come back later!"
    );
    setTextAreaBgColor("#D3D3D3");
    setButtonBgColor({ ...buttonBgColor, skip: "gray" });
  };

  return (
    <ImageBackground
      source={require("@/assets/images/home_clouds.png")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.subHeader, globalFont.Nunito]}>
          Welcome back, {userData ? userData.nickname : "User"}!
        </Text>
        <View style={styles.profileContainer}>
          <Text style={[styles.profileRanking, globalFont.Nunito]}>
            #{userData ? userData.rank : 0}
          </Text>
          <View style={styles.profileImageContainer}>
            <Image source={avatarSource} style={styles.profileImage} />
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
              {userData ? userData.score : "User"}
            </Text>
          </View>
        </View>

        <Text style={[styles.subHeader, globalFont.Nunito]}>
          How are you feeling today?
        </Text>
        <View style={styles.moodWrapper}>
          <View style={styles.moodContainer}>
            {[5, 4, 3, 2, 1].map((mood) => (
              <TouchableOpacity key={mood} onPress={() => updateUserMood(mood)}>
                <View
                  style={[
                    styles.moodIcon,
                    {
                      backgroundColor:
                        selectedMood === mood
                          ? [
                              "#FFCD00",
                              "#70C0FF",
                              "#005CC3",
                              "#004D9A",
                              "#001526",
                            ][5 - mood]
                          : [
                              "#FFE785",
                              "#BFD7EA",
                              "#6495CC",
                              "#4F759B",
                              "#0D1821",
                            ][5 - mood],
                      transform:
                        selectedMood === mood
                          ? [{ scale: 1.2 }]
                          : [{ scale: 1 }],
                    },
                  ]}
                >
                  {mood === 5 && <Feather name="sun" size={28} color="white" />}
                  {mood === 4 && (
                    <Ionicons
                      name="partly-sunny-outline"
                      size={28}
                      color="white"
                    />
                  )}
                  {mood === 3 && (
                    <AntDesign name="cloudo" size={28} color="white" />
                  )}
                  {mood === 2 && (
                    <Fontisto name="rain" size={28} color="white" />
                  )}
                  {mood === 1 && (
                    <Ionicons
                      name="thunderstorm-outline"
                      size={28}
                      color="white"
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={[styles.subHeader, globalFont.Nunito]}>
          Write down your thoughts.
        </Text>
        <View
          style={[
            styles.textAreaContainer,
            { backgroundColor: textAreaBgColor },
          ]}
        >
          <TextInput
            style={[styles.textArea, { height: 50 }, globalFont.Montserrat]}
            multiline
            numberOfLines={2}
            placeholder={placeholder}
            placeholderTextColor="black"
            value={thought}
            onChangeText={setThought}
          />
          <View style={styles.buttonContainer}>
            <View style={styles.placeholder}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: buttonBgColor.skip }]}
                onPress={handleThoughtSkip}
                disabled={isSkipDisabled}
              >
                <Text style={styles.buttonText}>Skip</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: buttonBgColor.submit }]}
              onPress={handleThoughtSubmit}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>

            <Modal
              transparent={true}
              animationType="fade"
              visible={isModalVisible}
              onRequestClose={handleCloseModal}
            >
              <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleCloseModal}
                  >
                    <Text style={styles.closeButtonText}>X</Text>
                  </TouchableOpacity>
                  <Text style={styles.modalText}>
                    You have submitted your thoughts today. Feel free to come
                    back and edit this thought if you wish!
                  </Text>
                </View>
              </View>
            </Modal>
          </View>
        </View>

        <View style={styles.motivationContainer}>
          <View style={styles.horizontalContainer}>
            <Image
              source={require("@/assets/images/sun_home_motivation.png")}
              style={styles.motivationImage}
            />
            <View style={styles.verticalContainer}>
              <Text style={[styles.motivationTitle, globalFont.Nunito]}>
                Daily Motivation
              </Text>
              <Text style={[styles.motivationText, globalFont.Nunito]}>
                Don't forget to send and check your messages!
              </Text>
              <View style={styles.row}>
                <Text style={[styles.motivationText, globalFont.Nunito]}>
                  Messages Left to send:{" "}
                </Text>
                <View style={styles.circle}>
                  <Text style={[styles.circleText, globalFont.Nunito]}>
                    {messageLeft}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.checkButton}
                onPress={() => router.navigate("/message")}
              >
                <Text style={[styles.checkButtonText, globalFont.Nunito]}>
                  Check
                </Text>
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
  subHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 5,
    paddingVertical: 15,
    textAlign: "center",
    fontFamily: "Nunito-Bold",
  },
  moodWrapper: {
    backgroundColor: "#FFF5CF",
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
  recentMoodIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  textAreaContainer: {
    backgroundColor: "#red",
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
  placeholder: {
    overflow: "scroll",
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
    paddingVertical: 10,
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
    fontSize: 18,
    fontWeight: "bold",
    paddingBottom: 3,
    color: "0D1821",
  },
  motivationText: {
    fontSize: 13,
    color: "#0D1821",
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
    padding: 8,
    marginLeft: "auto",
    backgroundColor: "#FFD700",
    marginTop: 5,
    paddingVertical: 3,
    borderRadius: 33,
    fontWeight: "bold",
  },
  checkButtonText: {
    color: "#0D1821",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
  },
  messagesLeftContainer: {
    padding: 16,
    backgroundColor: "#fff", // Adjust the background color as needed
    borderRadius: 8, // Adjust the border radius as needed
    marginBottom: 16, // Adjust the margin as needed
    alignItems: "center", // Center items horizontally
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  circleText: {
    color: "#fff",
    fontSize: 11,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    paddingTop: 15,
    paddingBottom: 25,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    width: "85%",
    alignItems: "center",
    minHeight: "10%",
    borderWidth: 4,
    borderColor: "#BFD7EA",
  },
  closeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#fff",
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
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
});

export default Home;
