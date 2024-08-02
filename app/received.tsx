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
import { auth, app } from "./firebase";
// yarn add react-native-vector-icons
import Icon from "react-native-vector-icons/MaterialIcons";
import { Feather, AntDesign, Ionicons, Fontisto } from "@expo/vector-icons";

const db = getFirestore(app);
const currUserId = auth.currentUser?.uid ?? "";
const usersRef = collection(db, "user");
import { router } from "expo-router";
import WritingMessage from "./writemessage";

const avatars = [
  { id: 1, source: require("../assets/icons/Bee.png") },
  { id: 2, source: require("../assets/icons/Cat.png") },
  { id: 3, source: require("../assets/icons/Chick.png") },
  { id: 4, source: require("../assets/icons/Crab.png") },
  { id: 5, source: require("../assets/icons/Fox.png") },
  { id: 6, source: require("../assets/icons/Frog.png") },
  { id: 7, source: require("../assets/icons/Koala.png") },
  { id: 8, source: require("../assets/icons/Lion.png") },
  { id: 9, source: require("../assets/icons/Turtle.png") },
  { id: 10, source: require("../assets/icons/Whale.png") },
  { id: 11, source: require("../assets/icons/alligator.png") },
  { id: 12, source: require("../assets/icons/ant.png") },
  { id: 13, source: require("../assets/icons/anteater.png") },
  { id: 14, source: require("../assets/icons/bird.png") },
  { id: 15, source: require("../assets/icons/butterfly.png") },
  { id: 16, source: require("../assets/icons/camel.png") },
  { id: 17, source: require("../assets/icons/chameleon.png") },
  { id: 18, source: require("../assets/icons/chicken.png") },
  { id: 19, source: require("../assets/icons/cow.png") },
  { id: 20, source: require("../assets/icons/dino.png") },
  { id: 21, source: require("../assets/icons/dog.png") },
  { id: 22, source: require("../assets/icons/dolphin.png") },
  { id: 23, source: require("../assets/icons/elephant.png") },
  { id: 24, source: require("../assets/icons/fish.png") },
  { id: 25, source: require("../assets/icons/fox2.png") },
  { id: 26, source: require("../assets/icons/giraffe.png") },
  { id: 27, source: require("../assets/icons/hedgehog.png") },
  { id: 28, source: require("../assets/icons/hippo.png") },
  { id: 29, source: require("../assets/icons/jellyfish.png") },
  { id: 30, source: require("../assets/icons/ladybug.png") },
  { id: 31, source: require("../assets/icons/monkey.png") },
  { id: 32, source: require("../assets/icons/mouse.png") },
  { id: 33, source: require("../assets/icons/octopus.png") },
  { id: 34, source: require("../assets/icons/owl.png") },
  { id: 35, source: require("../assets/icons/parrot.png") },
  { id: 36, source: require("../assets/icons/penguin.png") },
  { id: 37, source: require("../assets/icons/pig.png") },
  { id: 38, source: require("../assets/icons/pony.png") },
  { id: 39, source: require("../assets/icons/seahorse.png") },
  { id: 40, source: require("../assets/icons/seal.png") },
  { id: 41, source: require("../assets/icons/shark.png") },
  { id: 42, source: require("../assets/icons/sheep.png") },
  { id: 43, source: require("../assets/icons/sloth.png") },
  { id: 44, source: require("../assets/icons/snail.png") },
  { id: 45, source: require("../assets/icons/snake.png") },
  { id: 46, source: require("../assets/icons/squirrel.png") },
  { id: 47, source: require("../assets/icons/stingray.png") },
  { id: 48, source: require("../assets/icons/tiger.png") },
];

const defaultAvatar = require("../assets/images/avatar.png");

/**
 * Retreives the avatar image source based on the number stored on Firestore
 */
const getAvatarSource = (avatarId: number) => {
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

/**
 * Return the mood container with the matching background color and icon based
 * on the user field moodIcon
 */
const MoodIcon = ({ moodIconNumber }) => {
  const backgroundColor = getBackgroundColor(moodIconNumber);

  return (
    <View style={[styles.moodIconContainer, { backgroundColor }]}>
      {moodIcons[moodIconNumber]}
    </View>
  );
};

/**
 * Returns the profile container of users who has recently sent current user
 * a message.
 */
const UserCard = ({ user, onSend }) => {
  const avatarSource = getAvatarSource(user.avatar);
  const message = user.message;

  return (
    <View style={styles.profileContainer}>
      <View style={styles.row}>
        <View style={styles.profileImageContainer}>
          <Image source={avatarSource} style={styles.profileImage} />
        </View>
        <View style={styles.profileInfoContainer}>
          <Text style={styles.profileUser}>{user.nickname}</Text>
          <Text style={styles.profileTag}>{user.hobbies}</Text>
        </View>
        <View style={styles.moodIconsContainer}>
          {user?.todayMood ? (
            <View
              style={[
                styles.circle,
                { backgroundColor: getBackgroundColor(user?.todayMood) },
              ]}
            >
              <MoodIcon moodIconNumber={user?.todayMood} />
            </View>
          ) : (
            <View style={styles.placeholderCircle} />
          )}
        </View>
      </View>
      <View style={styles.thoughtsContainer}>
        <Text style={styles.profileThought}>{message}</Text>
      </View>
      <TouchableOpacity
        style={styles.sendButton}
        onPress={() => onSend(user, message)}
      >
        <Feather name="message-circle" size={17} style={styles.messageCircle} />
        <Text style={styles.sendButtonText}>Reply</Text>
      </TouchableOpacity>
    </View>
  );
};

const ReceiveMessage = () => {
  const [sendersData, setSendersData] = useState<
    {
      uid: string;
      nickname: string;
      mood: string;
      hobbies: string;
      message: string;
      avatar: number;
    }[]
  >([]);
  const [isLoading, setLoading] = useState(true);
  const [receivedMessages, setReceivedMessages] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageRec, setMessageRec] = useState("");
  const [canSend, setCanSendMessage] = useState(true);
  const [currUserInList, setCurrUserInList] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  /**
   * When the current user choose to reply to an user who sent them a message,
   * - If the message request is valid, then it calls the Writing Message modal.
   * - If the message request is invalid, then an error modal depending on why the
   *  message request was invalid.
   */
  const handleOpenModal = async (user, message) => {
    await checkRequestValid(user);
    // has at least 1 more chance to send a message and current users did not
    // recently send that person a message
    if (!currUserInList && canSend) {
      setSelectedUser(user);
      setMessageRec(message);
      setIsModalVisible(true);
      setErrorModalVisible(false);
    } else {
      setErrorModalVisible(true);
    }
  };

  /**
   * Handles when the Write Message tab is closed either when the current user
   * sends their message or when the modal is exited.
   */
  const handleCloseModal = () => setIsModalVisible(false);

  /**
   * Handles when the error pop up that shows up when the user have already
   * reached their daily message sending capacity and/or when the error pop up
   * is exited.
   */
  const handleExitErrorModal = () => setErrorModalVisible(false);

  /**
   * Checks if the current user have already sent the user a message recently.
   * - If the current user recently sent the user a message, it will set
   *  currUserInList and will prevent current user from spamming the user object
   *  passed in.
   */
  const checkRequestValid = (user) => {
    const unsubscribe = onSnapshot(
      doc(usersRef, user.uid),
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

  /**
   * Sets a listener on the current user's messageRecieved field and dynamically
   * updates the received screen to reflect the 5 most recent messages the current
   * user received. It will fetch the avatar, hobbies, mood, and message sent
   * of those 5 users to display.
   */
  useEffect(() => {
    // Used to fetch the mood for today
    const getTodayDate = () => {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0"); // getDate() returns the day of the month
      return `${day}`;
    };

    const getDayOfWeek = () => {
      const today = new Date();
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return daysOfWeek[today.getDay()];
    };

    const thisDayOfWeek = getDayOfWeek();
    const todayDate = getTodayDate();

    const currUser = auth.currentUser?.uid ?? "";
    const unsubscribe = onSnapshot(
      doc(usersRef, currUser),
      async (currUser) => {
        const currUserData = currUser.data();
        const currMessages = currUserData?.messagesReceived || [];
        const messageChanceLeft =
          currUserData?.messageLeft === 0 ? false : true;
        setCanSendMessage(messageChanceLeft);

        // Check if there are any messages received
        if (currMessages.length !== 0) {
          const tempSenderData = [];
          let completedRequest = 0;
          // Map over the messagesReceived array and fetch sender data for each message
          for (const sender of currMessages) {
            try {
              const senderRef = await getDoc(doc(usersRef, sender.senderID));
              if (senderRef.exists()) {
                const senderData = senderRef.data();
                const senderObj = {
                  uid: senderData?.uid,
                  nickname: senderData?.nickname,
                  // if no mood was detected want to not display it
                  todayMood:
                    senderRef.data().moods &&
                    senderRef
                      .data()
                      .moods.find(
                        (mood) =>
                          mood.date === todayDate &&
                          mood.dayOfWeek === thisDayOfWeek
                      )
                      ? senderRef
                          .data()
                          .moods.find(
                            (mood) =>
                              mood.date === todayDate &&
                              mood.dayOfWeek === thisDayOfWeek
                          ).moodIcon
                      : null,
                  hobbies: senderData?.hobbies,
                  message: sender.message,
                  avatar: senderData?.avatar,
                };
                tempSenderData.push(senderObj);
              }
            } catch (error) {
              console.error("Can't fetch this user");
            }
            completedRequest += 1;
          }
          if (completedRequest === currMessages.length) {
            setSendersData(tempSenderData);
            setReceivedMessages(true);
            setLoading(false);
          }
        } else {
          setReceivedMessages(false);
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error listening to user");
      }
    );
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/images/receivedCloud2.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[styles.switchButton, styles.inactiveButton]}
            onPress={() => router.navigate("/message")}
          >
            <Text style={styles.inactiveText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.switchButton, styles.activeButton]}>
            <Text style={styles.activeText}>Received</Text>
          </TouchableOpacity>
        </View>
        {receivedMessages ? (
          <ScrollView style={styles.userList}>
            {sendersData.map((sender) => (
              <UserCard
                key={sender.uid}
                user={sender}
                onSend={handleOpenModal}
              />
            ))}
          </ScrollView>
        ) : (
          <ScrollView style={styles.noMessageContainer}>
            <Text style={styles.noMessageText}>
              You did not receive any messages yet, start connecting with other
              airies by sending them a message now!
            </Text>
          </ScrollView>
        )}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCloseModal}
        >
          <WritingMessage
            senderUID={auth.currentUser?.uid}
            receiverUID={selectedUser?.uid}
            onClose={handleCloseModal}
            messageDisplayed={messageRec}
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
                  airies! Please come back tomorrow to send more! In the mean
                  time, we believe you will be able to complete your task! You
                  got this. We all believe in you.
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

  moodIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 10,
    marginLeft: "auto",
    color: "#858494",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
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
  noMessageContainer: {
    padding: 20,
    width: 300,
    height: 184,
    alignSelf: "center",
    backgroundColor: "transparent",
    paddingVertical: 13,
    paddingHorizontal: 10,
    flex: 1,
  },

  noMessageText: {
    fontFamily: "Montserrat",
    color: "#0D1821",
    fontWeight: "400",
    fontSize: 15,
    lineHeight: 15,
    // textAlign: "center",
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
    minHeight: "20%",
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

export default ReceiveMessage;
