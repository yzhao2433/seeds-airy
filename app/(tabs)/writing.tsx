import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  doc,
  getDoc,
  updateDoc,
  getFirestore,
  collection,
} from "firebase/firestore"; // Ensure these are imported from your Firebase setup

import { auth } from "../firebase";
import { app } from "../firebase";
import { router } from "expo-router";

const db = getFirestore(app);
const usersRef = collection(db, "user");

const WritingMessage = ({ senderID, receiverID }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState("");

  const addRecord = async (
    senderID: string,
    receiverID: string,
    message: string
  ) => {
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
    addRecord(senderID, receiverID, message);
    setModalVisible(false);
    setMessage("");
    router.navigate("/message");
  };

  return (
    <View style={styles.container}>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder="Enter your message"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => setModalVisible(true)}
        >
          <Feather
            name="message-circle"
            size={17}
            style={styles.messageCircle}
          />
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  sendButtonText: {
    color: "white",
    fontSize: 16,
  },
  messageCircle: {
    marginRight: 5,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: "white",
    width: "80%",
    marginBottom: 20,
  },
});

export default WritingMessage;
