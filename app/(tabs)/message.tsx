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
} from "react-native";
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

const db = getFirestore(app);
const currUserId = auth.currentUser?.uid ?? "";
const usersRef = collection(db, "user");

function MessageScreen({ navigation }) {}

// Message sending processer function (makes edit to receiever field)
// Every time a user sends a message, the receiver's message field is updated
// to add the new message recieved and remove the oldest message (the one at the end of the array)
const addRecord = async (
  senderID: string,
  receiverID: string,
  message: string
) => {
  // Get the array for current most recent 5 messages receieved of the
  try {
    const receiverRef = doc(usersRef, receiverID);
    console.log(receiverRef);
    const receiverSnap = await getDoc(receiverRef);
    console.log(receiverSnap);
    if (receiverSnap.exists()) {
      // Obtains the current array of 5 most recent messages received
      const receiverCurrData = receiverSnap.data();
      // If field is not found, then the default is an empty array
      const currentArray = receiverCurrData?.messagesReceived || [];
      const newMessage = { senderID: senderID, message: message };
      console.log(newMessage);
      // Copy over all but last entry of the array (which contains the oldest received message)
      const updatedArray = [newMessage, ...currentArray.slice(0, -1)];
      console.log(updatedArray);
      await updateDoc(receiverRef, { messagesReceived: updatedArray });
    }
  } catch (error) {
    console.error("Error modifying message received array:", error);
  }
};

// ReceiveMessage component
const ReceiveMessage = () => {
  // Initializing sendersData to be an empty array
  const [sendersData, setSendersData] = useState<
    {
      uid: string;
      nickname: string;
      mood: string;
      hobbies: string;
      message: string;
    }[]
  >([]);
  const [isReceivedEnabled, setIsReceivedEnabled] = useState(true);
  const handleSendPress = () => setIsReceivedEnabled(false);
  const handleReceivePress = () => setIsReceivedEnabled(true);

  useEffect(() => {
    getMessages();
  }, []);

  const getMessages = async () => {
    try {
      const currUserRef = doc(usersRef, currUserId);
      const currUserRefSnap = await getDoc(currUserRef);
      const currMessages = currUserRefSnap.data()?.messagesReceived || [];
      if (currMessages.length != 0) {
        // Chat GPT Code used to modify this part: https://chatgpt.com/share/69be0e05-fd13-448e-8448-353b9d1df32b
        const senderArray = await Promise.all(
          currMessages.map(
            async (sender: { senderID: string; message: string }) => {
              const senderRef = doc(usersRef, sender.senderID);
              console.log("senderRef", senderRef);
              const senderSnap = await getDoc(senderRef);
              console.log("senderSnap", senderSnap);
              console.log({
                uid: sender.senderID,
                nickname: senderSnap.data()?.nickname,
                mood: senderSnap.data()?.moods?.[0], // Accessing first mood if available
                hobbies: senderSnap.data()?.hobbies,
                message: sender.message,
              });
              return {
                uid: sender.senderID,
                nickname: senderSnap.data()?.nickname,
                mood: senderSnap.data()?.moods?.[0], // Accessing first mood if available
                hobbies: senderSnap.data()?.hobbies,
                message: sender.message,
              };
            }
          )
        );
        setSendersData(senderArray);
      }
    } catch (error) {
      console.log("haha no friends");
      console.error("Error getting documents: ", error);
    }
  };
  return (
    <ImageBackground
      source={require("../../assets/images/receiveCloud.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[
              styles.switchButton,
              !isReceivedEnabled ? styles.activeButton : styles.inactiveButton,
            ]}
            onPress={handleSendPress} // Assuming handleSendPress toggles to sending mode
          >
            <Text
              style={
                !isReceivedEnabled ? styles.activeText : styles.inactiveText
              }
            >
              Send
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.switchButton,
              isReceivedEnabled ? styles.activeButton : styles.inactiveButton,
            ]}
            onPress={handleReceivePress}
          >
            <Text
              style={
                isReceivedEnabled ? styles.activeText : styles.inactiveText
              }
            >
              Receive
            </Text>
          </TouchableOpacity>
        </View>
        {isReceivedEnabled ? (
          <ScrollView style={styles.userList}>
            {sendersData.map((sender) => (
              <View key={sender.uid} style={styles.userContainer}>
                <Text style={styles.nickName}>Nickname: {sender.nickname}</Text>
                <Text style={styles.userDetails}>
                  Hobbies: {sender.hobbies}
                  Mood: {sender.mood}
                  Message From {sender.nickname}: {sender.message}
                </Text>
                <Button
                  title="Send"
                  onPress={() => {
                    if (currUserId !== "") {
                      addRecord(currUserId, sender.uid, "Hi");
                      alert(`Message sent to ${sender.nickname}`);
                    } else {
                      alert("Message failed to deliver");
                    }
                  }}
                />
              </View>
            ))}
          </ScrollView>
        ) : (
          <ReceiveMessage />
        )}
      </View>
    </ImageBackground>
  );
};

const SendMessage = () => {
  const [usersData, setUsersData] = useState<
    { id: string; nickname?: string; hobbies?: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [isSendEnabled, setIsSendEnabled] = useState(true);

  const handleSendPress = () => setIsSendEnabled(true);
  const handleReceivePress = () => setIsSendEnabled(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    try {
      const usersSnapshot = await getDocs(usersRef);
      const users = usersSnapshot.docs.map((userDoc) => ({
        id: userDoc.id,
        ...userDoc.data(),
      }));

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
        ...userDoc.data(),
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
      source={require("../../assets/images/sendCloud.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[
              styles.switchButton,
              isSendEnabled ? styles.activeButton : styles.inactiveButton,
            ]}
            onPress={handleSendPress}
          >
            <Text
              style={isSendEnabled ? styles.activeText : styles.inactiveText}
            >
              Send
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.switchButton,
              !isSendEnabled ? styles.activeButton : styles.inactiveButton,
            ]}
            onPress={handleReceivePress}
          >
            <Text
              style={!isSendEnabled ? styles.activeText : styles.inactiveText}
            >
              Receive
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Image
            source={require("../../assets/images/refreshButton.png")}
            style={styles.refreshIcon}
          />
        </TouchableOpacity>
        {isSendEnabled ? (
          <ScrollView style={styles.userList}>
            {usersData.map((user) => (
              <View key={user.id} style={styles.userContainer}>
                <Text style={styles.nickName}>Nickname: {user.nickname}</Text>
                <Text style={styles.userDetails}>Hobbies: {user.hobbies}</Text>
                <Button
                  title="Send"
                  onPress={() => {
                    if (currUserId !== "") {
                      addRecord(currUserId, user.id, "Hi");
                      alert(`Message sent to ${user.nickname}`);
                    } else {
                      alert("Message failed to deliver");
                    }
                  }}
                />
              </View>
            ))}
          </ScrollView>
        ) : (
          <ReceiveMessage />
        )}
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
  },
  userContainer: {
    marginTop: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    width: 330,
    height: 150,
    flexShrink: 0,
    backgroundColor: "white",
  },
  nickName: {
    fontWeight: "bold",
  },
  userDetails: {
    marginBottom: 5,
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
    top: 30,
    right: 35,
    zIndex: 1,
    marginBottom: 20,
  },
  refreshIcon: {
    width: 24,
    height: 24,
  },
});

export default SendMessage;
