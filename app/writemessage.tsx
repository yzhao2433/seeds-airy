import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  TextInput,
  Modal,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import {
  doc,
  getDoc,
  updateDoc,
  getFirestore,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { auth } from "./firebase";
import { app } from "./firebase";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Feather, Ionicons, AntDesign, Fontisto } from "@expo/vector-icons";

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

const db = getFirestore(app);
const usersRef = collection(db, "user");

const defaultAvatar = require("../assets/images/avatar.png");

const getAvatarSource = (avatarId) => {
  const avatar = avatars.find((avatar) => avatar.id === avatarId);
  return avatar ? avatar.source : defaultAvatar;
};

const moodIcons = {
  1: <Ionicons name="thunderstorm-outline" size={21} color="#023567" />,
  2: <Fontisto name="rain" size={21} color="#023567" />,
  3: <AntDesign name="cloudo" size={21} color="#023567" />,
  4: <Ionicons name="partly-sunny-outline" size={21} color="#023567" />,
  5: <Feather name="sun" size={21} color="#023567" />,
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
    <View style={[styles.moodiconcenter, { backgroundColor }]}>
      {moodIcons[moodIconNumber]}
    </View>
  );
};

const UserCard = ({ receiverUID, message }) => {
  const [receiver, setReceiver] = useState<{
    uid: String;
    nickname: string;
    firstThought: string;
    todayMood: number;
    hobbies: string;
  }>();
  const receieverDocRef = doc(usersRef, receiverUID);

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

    const unsubscribe = onSnapshot(
      receieverDocRef,
      (receiver) => {
        if (receiver.exists()) {
          const messageDisplayed =
            message.length == 0
              ? receiver
                  .data()
                  .thoughts.find((thought) => thought.date === todayDateMon)
                ? receiver
                    .data()
                    .thoughts.find((thought) => thought.date === todayDateMon)
                    .thought
                : "No thoughts available today"
              : message;
          const receiverData = {
            uid: receiverUID,
            nickname: receiver.data().nickname || "Unknown User",
            firstThought: messageDisplayed,

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

  if (!receiver) {
    return <Text>Loading...</Text>; // or a loading spinner
  }

  const avatarSource = getAvatarSource(receiver.avatar);

  return (
    <View style={styles.profileContainer}>
      <View style={styles.row}>
        <View style={styles.profileImageContainer}>
          <Image source={avatarSource} style={styles.profileImage} />
        </View>
        <View style={styles.profileInfoContainer}>
          <Text style={styles.profileUser}>{receiver.nickname}</Text>
          <Text style={styles.profileTag}>{receiver.hobbies}</Text>
        </View>
        <View style={styles.moodIconsContainer}>
          {receiver.todayMood ? (
            <View
              style={[
                styles.moodbackground,
                { backgroundColor: getBackgroundColor(receiver.todayMood) },
              ]}
            >
              <MoodIcon moodIconNumber={receiver.todayMood} />
            </View>
          ) : (
            <View style={styles.placeholderCircle} />
          )}
        </View>
      </View>
      <View>
        <Text style={styles.profileThought}>{receiver.firstThought}</Text>
      </View>
    </View>
  );
};

export const WritingMessage = ({
  senderUID,
  receiverUID,
  onClose,
  messageDisplayed,
}) => {
  const [message, setMessage] = useState("");
  const [messageTooShort, setMessageTooShort] = useState(false);

  const addRecord = async (senderID, receiverID) => {
    try {
      const receiverRef = doc(usersRef, receiverID);
      const receiverSnap = await getDoc(receiverRef);
      if (receiverSnap.exists()) {
        const receiverCurrData = receiverSnap.data();
        // Get the array of last five users that sent receiver user a message
        const currentArray = receiverCurrData?.messagesReceived || [];
        const newMessage = { senderID, message };
        // Remove the last user (the earliest person who sent the message) and
        // prepend the current user to the receiver's list
        if (currentArray.length == 5) {
          var updatedArray = [newMessage, ...currentArray.slice(0, -1)];
        } else {
          var updatedArray = [newMessage, ...currentArray];
        }
        await updateDoc(receiverRef, { messagesReceived: updatedArray });
      }
      const senderRef = doc(usersRef, senderID);
      const senderSnap = await getDoc(senderRef);
      if (senderSnap.exists()) {
        const senderCurrData = senderSnap.data();
        const senderMessageLeft = senderCurrData?.messageLeft || 1;
        const numMessageSent = 10 - senderMessageLeft + 1;
        const addedNum = numMessageSent <= 3 ? 1 : numMessageSent <= 7 ? 2 : 3;
        const newScore = senderCurrData?.score + addedNum;
        // const messagesReceived = receiverSnap.data()?.messageReceived;
        // if (messagesReceived.length > 0) {
        //   const messages = messagesReceived.map((entry) => entry.message);
        //   setReceivedMessages(messages).filter(
        //     (entry) => entry.senderID == senderID
        //   );
        // }
        await updateDoc(senderRef, { messageLeft: senderMessageLeft - 1 });
        await updateDoc(senderRef, { score: newScore });
        const sendTime = Date();
        await updateDoc(senderRef, { messageLastSend: sendTime });
      }
    } catch (error) {
      console.error("Error modifying message received array:", error);
    }
  };

  const handleSend = () => {
    if (message.length < 2) {
      setMessageTooShort(true);
    } else {
      setMessageTooShort(false);
      addRecord(senderUID, receiverUID);
      onClose();
    }
  };

  const handleBlur = () => {
    console.log("Exited type mode");
  };

  const handleChange = (inputed) => {
    setMessage(inputed);
    if (message.length >= 2) {
      setMessageTooShort(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.headerCloseButton} onPress={onClose}>
            <AntDesign name="close" size={25} color="black" />
          </TouchableOpacity>
          <View style={styles.scrollContainer}>
            <ScrollView
              contentContainerStyle={styles.scrollViewContent}
              // keyboardShouldPersistTaps="handled"
            >
              <View style={styles.centeredContainer}>
                <UserCard
                  key={receiverUID}
                  receiverUID={receiverUID}
                  message={messageDisplayed}
                />
                <View style={styles.you}>
                  <Text> YOU: </Text>
                </View>
                {/*When submit is pressed and message is less than 2 characters
                long, a red border and text will appear*/}
                <View
                  style={[
                    styles.inputSection,
                    {
                      borderColor: "#FF6961",
                      borderWidth: messageTooShort ? 1 : 0,
                      borderRadius: messageTooShort ? 5 : 0,
                    },
                  ]}
                >
                  <TextInput
                    style={styles.inputTextBox}
                    placeholder="Please type the message you want to send to your fellow airies: "
                    placeholderTextColor={"#C0C0C0"}
                    multiline={true}
                    scrollEnabled={true}
                    spellCheck={true}
                    textAlign={"left"}
                    onChangeText={handleChange}
                    value={message}
                    onBlur={handleBlur}
                  ></TextInput>
                  {messageTooShort && (
                    <Text style={styles.warningMessage}>
                      Please enter a message with 2 or more characters. The
                      receiver will appreciate your kind message!
                    </Text>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
          <View style={styles.sendSection}>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => handleSend()}
            >
              <Feather
                name="message-circle"
                size={17}
                style={styles.messageCircle}
              />
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
  },

  modalContent: {
    height: "65%",
    width: "88%",
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
    justifyContent: "flex-end",
  },
  headerCloseButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 5,
  },

  scrollContainer: {
    flex: 9,
    justifyContent: "center",
  },

  scrollViewContent: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    justifyContent: "center",
  },

  centeredContainer: {
    flex: 1,
    justifyContent: "center",
  },

  profileContainer: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    marginTop: 30,
    paddingVertical: 10,
    alignSelf: "center",
    position: "relative",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImageContainer: {
    position: "absolute",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  profileUser: {
    fontSize: 14,
    fontFamily: "Montserrat-Light",
  },
  profileTag: {
    color: "#858494",
    fontSize: 10,
    fontFamily: "Montserrat",
    fontStyle: "italic",
    fontWeight: "400",
    lineHeight: 17.71,
  },

  moodbackground: {
    width: 38,
    height: 38,
    borderRadius: 50,
    alignItems: "center",
    padding: 0,
    justifyContent: "center",
    borderWidth: 0.2,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    opacity: 0.7,
  },

  you: {
    color: "black",
    fontSize: 20,
    fontFamily: "Nunito",
    fontWeight: "700",
    lineHeight: 18.09,
    marginTop: 30,
    marginBottom: 5,
  },

  profileThought: {
    fontSize: 11,
    color: "black",
    marginBottom: 10,
    fontFamily: "Montserrat",
    fontWeight: "400",
    lineHeight: 17.71,
    position: "relative",
    width: 231,
  },
  profileInfoContainer: {
    flex: 1,
    marginLeft: 50,
  },
  inputSection: {
    flex: 1,
    marginBottom: "60%",
  },

  inputTextBox: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlignVertical: "top",
    color: "black",
    fontSize: 13,
    padding: 10,
    fontFamily: "Montserrat",
    lineHeight: 14.69,
    fontWeight: "400",
  },

  warningMessage: {
    color: "#c84f38",
    fontSize: 13,
    fontFamily: "Montserrat",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  sendSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: 10,
  },

  sendButton: {
    backgroundColor: "#4F759B",
    borderRadius: 33.02,
    paddingVertical: 5,
    paddingHorizontal: 10,
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

  moodIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 10,
  },

  placeholderCircle: {
    width: 38,
    height: 38,
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
});

export default WritingMessage;
