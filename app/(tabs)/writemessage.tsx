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

const WritingMessage = ({ senderUID, receiverUID }) => {
  const db = getFirestore(app);
  const usersRef = collection(db, "user");
  //const [message, setMessage] = useState("");
  const message = "";
  console.log("senderID is ", senderUID);
  console.log("receiverID is ", receiverUID);
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
      source={require("../../assets/images/receiveCloud.png")}
      style={styles.background}
    >
      <Modal onRequestClose={() => router.navigate("/message")}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}> Message to A Person</Text>
          </View>
          <View style={styles.modalContent}>
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
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => handleSend()}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.navigate("/message")}>
              <Text style={styles.modalHeaderCloseText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  modalContainer: {
    flex: 1,
    backgroundColor: "#BFD7EA",
    width: "80%",
    padding: 5,
    borderRadius: 10,
    maxHeight: "60%",
    justifyContent: "center",
    alignItems: "center",
  },

  modalHeader: {
    flexDirection: "row",
  },

  modalHeaderCloseText: {
    textAlign: "center",
    paddingLeft: 5,
    paddingRight: 5,
  },

  modalTitle: {
    color: "#0D1821",
    fontSize: 20,
    fontFamily: "Montserrat",
    fontWeight: "600",
    lineHeight: 20,
    textAlign: "center",
    marginTop: hp("3%"),
    width: "60%",
    alignSelf: "center",
    marginBottom: hp("4%"),
  },

  modalContent: {
    flex: 1,
    alignContent: "space-evenly",
  },

  inputTextBox: {
    backgroundColor: "white",
    color: "black",
    fontSize: 12,
    fontFamily: "Nunito",
    fontWeight: "700",
  },

  profileContainer: {
    flexDirection: "row",
    flex: 1,
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
    marginTop: 25,
    padding: 20,
    width: 343,
    height: 184,
    alignSelf: "center",
    position: "relative",
  },

  profileImageContainer: {
    position: "absolute",
    top: 10,
    left: 20,
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

  messageCircle: {
    color: "white",
    width: 20,
    height: 20,
    left: 1.89,
    top: 2.38,
  },
});

export default WritingMessage;
