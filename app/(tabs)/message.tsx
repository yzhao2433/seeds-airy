import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  Button,
  Modal,
} from "react-native";
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
// yarn add react-native-vector-icons
import Icon from "react-native-vector-icons/FontAwesome";
import { Feather, Ionicons, AntDesign, Fontisto } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import { auth } from "../firebase";
const db = getFirestore(app);
const currUserId = auth.currentUser?.uid ?? "";
const usersRef = collection(db, "user");
import { router } from "expo-router";
import { WritingMessage } from "../writemessage";

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

const defaultAvatar = require("../../assets/images/avatar.png");

const getAvatarSource = (avatarId) => {
  const avatar = avatars.find((avatar) => avatar.id === avatarId);
  return avatar ? avatar.source : defaultAvatar;
};

const moodIcons = {
  1: <Ionicons name="thunderstorm-outline" size={25} color="#023567" />,
  2: <Fontisto name="rain" size={25} color="#023567" />,
  3: <AntDesign name="cloudo" size={25} color="#023567" />,
  4: <Ionicons name="partly-sunny-outline" size={25} color="#023567" />,
  5: <Feather name="sun" size={25} color="#023567" />,
};

const getBackgroundColor = (moodIconNumber) => {
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

const MoodIcon = ({ moodIconNumber }) => {
  const backgroundColor = getBackgroundColor(moodIconNumber);

  return (
    <View style={[styles.moodIconContainer, { backgroundColor }]}>
      {moodIcons[moodIconNumber]}
    </View>
  );
};

const UserCard = ({ user, onSend }) => {
  const [receiver, setReceiver] = useState<{
    uid: String;
    nickname: string;
    firstThought: string;
    todayMood: number;
    hobbies: string;
    avatar: string;
  }>();

  const avatarSource = getAvatarSource(receiver?.avatar);

  useEffect(() => {
    const getTodayDate = () => {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0"); // getDate() returns the day of the month
      return `${day}`;
    };

    const getTodayDateMon = () => {
      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // getMonth() returns 0-based month index, so add 1
      const day = String(today.getDate()).padStart(2, "0"); // getDate() returns the day of the month
      return `${month}-${day}`;
    };

    const getDayOfWeek = () => {
      const today = new Date();
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return daysOfWeek[today.getDay()];
    };

    const thisDayOfWeek = getDayOfWeek();
    const todayDate = getTodayDate();
    const todayDateMon = getTodayDateMon();

    const receieverDocRef = doc(usersRef, user.id);
    const unsubscribe = onSnapshot(
      receieverDocRef,
      (receiver) => {
        if (receiver.exists()) {
          const receiverData = {
            uid: user.id,
            nickname: receiver.data().nickname || "Unknown User",
            firstThought: receiver
              .data()
              .thoughts.find((thought) => thought.date === todayDateMon)
              ? receiver
                  .data()
                  .thoughts.find((thought) => thought.date === todayDateMon)
                  .thought
              : "No thoughts available today",
            todayMood:
              receiver.data().moods &&
              receiver
                .data()
                .moods.find(
                  (mood) =>
                    mood.date === todayDate && mood.dayOfWeek === thisDayOfWeek
                )
                ? receiver
                    .data()
                    .moods.find(
                      (mood) =>
                        mood.date === todayDate &&
                        mood.dayOfWeek === thisDayOfWeek
                    ).moodIcon
                : null,
            avatar: receiver.data().avatar,
            hobbies: receiver.data().hobbies || "",
          };
          setReceiver(receiverData);
        } else {
          throw new Error("Receiver data not found");
        }
      },
      (error) => {
        console.error("Error listening to receiver ", error);
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.profileContainer}>
      <View style={styles.row}>
        <View style={styles.profileImageContainer}>
          <Image source={avatarSource} style={styles.profileImage} />
        </View>
        <View style={styles.profileInfoContainer}>
          <Text style={styles.profileUser}>{receiver?.nickname}</Text>
          <Text style={styles.profileTag}>{receiver?.hobbies}</Text>
        </View>
        <View style={styles.moodIconsContainer}>
          {receiver?.todayMood ? (
            <View
              style={[
                styles.circle,
                { backgroundColor: getBackgroundColor(receiver?.todayMood) },
              ]}
            >
              <MoodIcon moodIconNumber={receiver?.todayMood} />
            </View>
          ) : (
            <View style={styles.placeholderCircle} />
          )}
        </View>
      </View>
      <ScrollView style={styles.thoughtsContainer}>
        <Text style={styles.profileThought}>{receiver?.firstThought}</Text>
      </ScrollView>

      {/* <TouchableOpacity style={styles.sendButton} onPress={handleSend}> */}
      <TouchableOpacity style={styles.sendButton} onPress={() => onSend(user)}>
        <Feather name="message-circle" size={17} style={styles.messageCircle} />
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const SendMessage = () => {
  const [usersData, setUsersData] = useState<{ id: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSendEnabled, setIsSendEnabled] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [canSend, setCanSendMessage] = useState(true);
  const [currUserInList, setCurrUserInList] = useState(true);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [oneMessageLeft, setOneMessageLeft] = useState(false);

  const handleSendPress = () => setIsSendEnabled(true);
  const handleReceivePress = () => setIsSendEnabled(false);
  // Handles when current user sends someone else a message
  const handleOpenModal = async (user, message) => {
    await checkChancesLeft();
    await checkSentBefore(user);
    console.log("Checking request validity sender...");
    // has at least 1 more chance to send a message and current users did not
    // recently send that person a message
    if (!currUserInList && canSend) {
      setSelectedUser(user);
      setIsModalVisible(true);
      setErrorModalVisible(false);
    } else {
      setErrorModalVisible(true);
    }
  };
  const handleCloseModal = () => setIsModalVisible(false);
  const handleExitErrorModal = () => setErrorModalVisible(false);

  // user is an object with fields about the user current user want to send a message to
  const checkSentBefore = (user) => {
    // check if I am on that user's messageRecieved field
    const unsubscribe = onSnapshot(
      doc(usersRef, user.id),
      (receiverCheck) => {
        const receiverMessageList =
          receiverCheck.data()?.messagesReceived || [];
        const currUserSeen = receiverMessageList.some((messageEntry) => {
          return messageEntry.senderID == auth.currentUser?.uid;
        });
        setCurrUserInList(currUserSeen);
      },
      (error) => {
        console.error(
          "Error checking the messageReceived field of ",
          user.uid,
          " ",
          error
        );
      }
    );
    return () => unsubscribe();
  };

  const checkChancesLeft = () => {
    const unsubscribe = onSnapshot(
      doc(usersRef, auth.currentUser?.uid),
      (senderCheck) => {
        const userChancesLeft = senderCheck.data()?.messageLeft;
        const canSendMessage = userChancesLeft === 0 ? false : true;
        setOneMessageLeft(userChancesLeft === 1 ? false : true);
        setCanSendMessage(canSendMessage);
      },
      (error) => {
        console.error("Error setting listener to current user");
      }
    );
    return () => unsubscribe();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const usersRef = collection(db, "user");
    const currUserId = auth.currentUser?.uid ?? "";

    //account for the fact that your own account cant show up in the messages

    try {
      const usersSnapshot = await getDocs(usersRef);
      const users = usersSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          thoughts: doc.data().thoughts as string[],
        }))
        .filter((user) => user.id !== currUserId);

      // Shuffling the array
      for (let i = users.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [users[i], users[j]] = [users[j], users[i]];
      }

      // Choosing the first 5 users from array
      const randomUsers = users.slice(0, 5);

      // Getting data from array
      const userDocsPromises = randomUsers.map((user) =>
        getDoc(doc(usersRef, user.id))
      );
      const userData = await Promise.all(userDocsPromises);

      const formattedUserData = userData.map((userDoc) => ({
        id: userDoc.id,
      }));

      setUsersData(formattedUserData);
      setLoading(false);
    } catch (error) {
      console.error("Error getting documents: ", error);
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      // source={require("../../assets/images/sendCloud.png")}
      source={require("../../assets/images/sendCloud2.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[styles.switchButton, styles.activeButton]}
            onPress={handleSendPress}
          >
            <Text style={styles.activeText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.switchButton, styles.inactiveButton]}
            onPress={() => router.navigate("/received")}
          >
            <Text style={styles.inactiveText}>Received</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Ionicons name="refresh" size={30} color="black" />
        </TouchableOpacity>
        <ScrollView style={styles.userList}>
          {usersData.map((user) => (
            <UserCard key={user.id} user={user} onSend={handleOpenModal} />
          ))}
        </ScrollView>
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCloseModal}
        >
          <WritingMessage
            senderUID={auth.currentUser?.uid}
            receiverUID={selectedUser?.id}
            onClose={handleCloseModal}
            messageDisplayed={""}
            messagesLeft={oneMessageLeft}
          />
        </Modal>
        <Modal
          visible={errorModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={handleExitErrorModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.headerCloseButton}
                onPress={handleExitErrorModal}
              >
                <AntDesign name="close" size={25} color="black" />
              </TouchableOpacity>
              {canSend ? (
                <Text style={styles.modalText}>
                  You have recently sent this user a message. Connect with
                  another airy on this app!
                </Text>
              ) : (
                <Text style={styles.modalText}>
                  Great work on sending 10 messages today and uplifting fellow
                  airies! Please come back tomorrow to send more!
                </Text>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
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

  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    width: "50%",
    maxWidth: 300,
    height: 26,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    marginTop: 10,
  },

  switchButton: {
    flex: 1,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },

  activeButton: {
    backgroundColor: "#FFFFFF",
  },

  inactiveButton: {
    backgroundColor: "#f4f3f4",
  },

  activeText: {
    color: "black",
    fontSize: 12,
    fontFamily: "Nunito",
    fontWeight: "700",
  },

  inactiveText: {
    color: "#999",
    fontSize: 12,
    fontFamily: "Nunito",
    fontWeight: "700",
  },

  userList: {
    paddingHorizontal: 10,
    width: "100%",
  },

  profileContainer: {
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 13,
    paddingHorizontal: 25,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    marginTop: 25,
    padding: 20,
    width: 343,
    height: 184,
    alignSelf: "center",
    position: "relative",
  },

  profileImageContainer: {
    position: "absolute",
  },

  profileInfoContainer: {
    flex: 1,
    marginLeft: 65,
  },

  profileUser: {
    color: "#0C092A",
    fontSize: 16.86,
    fontFamily: "Montserrat",
    fontWeight: "300",
    lineHeight: 25.29,
  },

  profileTag: {
    color: "#858494",
    fontSize: 12.65,
    fontFamily: "Montserrat",
    fontStyle: "italic",
    fontWeight: "400",
    lineHeight: 17.71,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  refreshButton: {
    position: "absolute",
    top: 35,
    right: 20,
    zIndex: 1,
    marginBottom: 20,
  },

  profileHeader: {
    position: "relative",
    marginRight: 10,
  },

  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 50,
  },

  profileInfo: {
    flex: 1,
  },

  thoughtsContainer: {
    flex: 1,
    position: "absolute",
    left: 20,
    top: 75,
    width: 302,
    height: 51,
    paddingVertical: 10,
  },

  profileThought: {
    fontSize: 12.65,
    color: "black",
    marginBottom: 10,
    fontFamily: "Montserrat",
    fontWeight: "400",
    lineHeight: 17.71,
  },
  moodIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 10,
    marginLeft: "auto",
    color: "#858494",
  },
  placeholderCircle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#F5F5F5",
    right: "auto",
    padding: 0,
    borderWidth: 0.2,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.2,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    opacity: 0.7,
  },
  sendButton: {
    backgroundColor: "#4F759B",
    borderRadius: 33.02,
    paddingVertical: 5,
    paddingHorizontal: 10,
    position: "absolute",
    bottom: 10,
    right: 10,
    borderWidth: 0.66,
    borderColor: "white",
    width: 85,
    height: 32,
    flexDirection: "row",
  },

  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Nunito",
    fontWeight: "700",
    lineHeight: 22.5,
    right: -4,
  },

  messageCircle: {
    color: "white",
    width: 20,
    height: 20,
    left: 1.89,
    top: 2.38,
  },

  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContent: {
    backgroundColor: "#fff",
    paddingHorizontal: 40,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    width: "85%",
    alignItems: "center",
    minHeight: "15%",
    borderWidth: 4,
    borderColor: "#BFD7EA",
  },

  modalText: {
    marginTop: 20,
    fontSize: 13,
    fontFamily: "Montserrat",
    textAlign: "left",
    color: "#0D1821",
  },

  headerCloseButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 5,
  },
});

export default SendMessage;
