import { useState } from "react";
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
} from "react-native";
import {
  doc,
  getDoc,
  updateDoc,
  getFirestore,
  collection,
} from "firebase/firestore";
import { auth } from "../firebase";
import { app } from "../firebase";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

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

const db = getFirestore(app);
const usersRef = collection(db, "user");

const defaultAvatar = require("../../assets/images/avatar.png");

const getAvatarSource = (avatarId) => {
  const avatar = avatars.find((avatar) => avatar.id === avatarId);
  return avatar ? avatar.source : defaultAvatar;
};

const fetchReceiverData = async (receiverUID: string) => {
  try {
    const receiverRef = doc(usersRef, receiverUID);
    console.log("line 92 ", receiverRef);
    const receiverSnap = await getDoc(receiverRef);
    console.log("line 94 ", receiverSnap);
    if (receiverSnap.exists()) {
      const receiverData = {
        uid: receiverUID,
        ...receiverSnap.data(),
      };
      console.log("line 100 ", receiverData);
      return {
        nickname: receiverData.nickname || "Unknown User",
        firstThought:
          receiverData.thoughts?.[0]?.thought ||
          "User did not input a thought yet",
        avatar: receiverData.avatar || 0,
        messageToMe: receiverData.messagesReceived || "",
        mood: receiverData.moods?.[0] || 0,
      };
    } else {
      throw new Error("Receiver data not found");
    }
  } catch (error) {
    console.error("Error getting the receiver data:", error);
  }
};

const UserCard = (receiverUID) => {
  console.log("User Card received ", receiverUID);
  const receiver = fetchReceiverData(receiverUID);
  const avatarSource = getAvatarSource(receiver.avatar);

  return (
    <View style={styles.profileContainer}>
      <View style={styles.profileImageContainer}>
        <Image source={avatarSource} style={styles.profileImage} />
      </View>
      <View style={styles.profileInfoContainer}>
        <Text style={styles.profileUser}>{receiver.nickname}</Text>
        <Text style={styles.profileTag}>{receiver.hobbies}</Text>
      </View>
      <View style={styles.thoughtsContainer}>
        <Text style={styles.profileThought}>{receiver.firstThought}</Text>
      </View>
    </View>
  );
};

export const WritingMessage = ({ senderUID, receiverUID }) => {
  //const [message, setMessage] = useState("");
  const message = "";
  console.log("senderID is for writing message ", senderUID);
  console.log("receiverID is for writing message ", receiverUID);
  const addRecord = async (senderID: string, receiverID: string) => {
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
        const updatedArray = [newMessage, ...currentArray.slice(0, -1)];
        await updateDoc(receiverRef, { messagesReceived: updatedArray });
      }
      const senderRef = doc(usersRef, senderID);
      const senderSnap = await getDoc(senderRef);
      if (senderSnap.exists()) {
        const senderCurrData = receiverSnap.data();
        const senderMessageLeft = senderCurrData?.messageLeft || 1;
        await updateDoc(senderRef, { messageLeft: senderMessageLeft - 1 });
      }
    } catch (error) {
      console.error("Error modifying message received array:", error);
    }
  };

  const handleSend = () => {
    addRecord(senderUID, receiverUID);
    router.navigate("/message");
  };

  //   const handleChange = (inputed) => {
  //     setMessage(inputed);
  //   };

  return (
    // <SafeAreaView>
    <ImageBackground
      source={require("../../assets/images/writingCloud.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <UserCard key={receiverUID} receiverUID={receiverUID} />
          {/* <Text style={styles.textTitle}> Message to A Person</Text> */}
          <TouchableOpacity
            style={styles.headerCloseButton}
            onPress={() => router.navigate("/message")}
          >
            <Text style={styles.headerCloseText}>X</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputSection}>
          <TextInput
            style={styles.inputTextBox}
            placeholder="Please type the message you want to send to your fellow airies: "
            placeholderTextColor={"#C0C0C0"}
            multiline={true}
            scrollEnabled={true}
            spellCheck={true}
            textAlign={"left"}
            //   onChangeText={handleChange}
            value={message}
          ></TextInput>
        </View>
        <View style={styles.sendSection}>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => handleSend()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },

  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#BFD7EA",
    width: "80%",
    height: hp("60%"),
    padding: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "20%",
    left: "10%",
    borderWidth: 2,
    borderColor: "#4F759B",
  },

  headerSection: {
    flex: 3,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  profileContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    // marginTop: 25,
    padding: 20,
    marginLeft: 15,
    marginRight: 15,
    height: "50%",
    alignSelf: "center",
    position: "relative",
  },

  profileImageContainer: {
    position: "absolute",
    top: 10,
    left: 20,
  },

  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#F3F3F3",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  profileInfoContainer: {
    flex: 1,
    marginLeft: 80,
    marginTop: -110,
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
  },

  profileThought: {
    fontSize: 12.65,
    color: "black",
    marginBottom: 10,
    fontFamily: "Montserrat",
    fontWeight: "400",
    lineHeight: 17.71,
  },

  headerCloseButton: {
    textAlign: "right",
    padding: 5,
    position: "absolute",
    right: -30,
    top: 5,
  },

  headerCloseText: {
    color: "#0D1821",
    fontSize: 15,
  },

  textTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 5,
    paddingVertical: 15,
    textAlign: "center",
    fontFamily: "Nunito-Bold",
  },

  inputSection: {
    flex: 6,
    marginVertical: 10,
  },

  inputTextBox: {
    flex: 1,
    backgroundColor: "white",
    color: "black",
    fontSize: 16,
    fontFamily: "Nunito",
    fontWeight: "700",
    padding: 10,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 5,
  },

  sendSection: {
    flex: 1,
    alignSelf: "flex-end",
  },

  sendButton: {
    flex: 1,
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
    flexDirection: "column",
  },

  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Nunito",
    fontWeight: "700",
    lineHeight: 22.5,
    right: -4,
  },
});

export default WritingMessage;
