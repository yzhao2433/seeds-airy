// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   ImageBackground,
//   Image,
//   Button,
// } from "react-native";
// import {
//   getFirestore,
//   collection,
//   getDocs,
//   getDoc,
//   doc,
//   updateDoc,
// } from "firebase/firestore";
// import { app } from "../firebase";
// // yarn add react-native-vector-icons
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { Ionicons } from "@expo/vector-icons";
// import { Feather } from "@expo/vector-icons";

// import { auth } from "../firebase";
// const db = getFirestore(app);
// const currUserId = auth.currentUser?.uid ?? "";
// const usersRef = collection(db, "user");

// const avatars = [
//   { id: 1, source: require("../../assets/icons/Bee.png") },
//   { id: 2, source: require("../../assets/icons/Cat.png") },
//   { id: 3, source: require("../../assets/icons/Chick.png") },
//   { id: 4, source: require("../../assets/icons/Crab.png") },
//   { id: 5, source: require("../../assets/icons/Fox.png") },
//   { id: 6, source: require("../../assets/icons/Frog.png") },
//   { id: 7, source: require("../../assets/icons/Koala.png") },
//   { id: 8, source: require("../../assets/icons/Lion.png") },
//   { id: 9, source: require("../../assets/icons/Turtle.png") },
//   { id: 10, source: require("../../assets/icons/Whale.png") },
//   { id: 11, source: require("../../assets/icons/alligator.png") },
//   { id: 12, source: require("../../assets/icons/ant.png") },
//   { id: 13, source: require("../../assets/icons/anteater.png") },
//   { id: 14, source: require("../../assets/icons/bird.png") },
//   { id: 15, source: require("../../assets/icons/butterfly.png") },
//   { id: 16, source: require("../../assets/icons/camel.png") },
//   { id: 17, source: require("../../assets/icons/chameleon.png") },
//   { id: 18, source: require("../../assets/icons/chicken.png") },
//   { id: 19, source: require("../../assets/icons/cow.png") },
//   { id: 20, source: require("../../assets/icons/dino.png") },
//   { id: 21, source: require("../../assets/icons/dog.png") },
//   { id: 22, source: require("../../assets/icons/dolphin.png") },
//   { id: 23, source: require("../../assets/icons/elephant.png") },
//   { id: 24, source: require("../../assets/icons/fish.png") },
//   { id: 25, source: require("../../assets/icons/fox2.png") },
//   { id: 26, source: require("../../assets/icons/giraffe.png") },
//   { id: 27, source: require("../../assets/icons/hedgehog.png") },
//   { id: 28, source: require("../../assets/icons/hippo.png") },
//   { id: 29, source: require("../../assets/icons/jellyfish.png") },
//   { id: 30, source: require("../../assets/icons/ladybug.png") },
//   { id: 31, source: require("../../assets/icons/monkey.png") },
//   { id: 32, source: require("../../assets/icons/mouse.png") },
//   { id: 33, source: require("../../assets/icons/octopus.png") },
//   { id: 34, source: require("../../assets/icons/owl.png") },
//   { id: 35, source: require("../../assets/icons/parrot.png") },
//   { id: 36, source: require("../../assets/icons/penguin.png") },
//   { id: 37, source: require("../../assets/icons/pig.png") },
//   { id: 38, source: require("../../assets/icons/pony.png") },
//   { id: 39, source: require("../../assets/icons/seahorse.png") },
//   { id: 40, source: require("../../assets/icons/seal.png") },
//   { id: 41, source: require("../../assets/icons/shark.png") },
//   { id: 42, source: require("../../assets/icons/sheep.png") },
//   { id: 43, source: require("../../assets/icons/sloth.png") },
//   { id: 44, source: require("../../assets/icons/snail.png") },
//   { id: 45, source: require("../../assets/icons/snake.png") },
//   { id: 46, source: require("../../assets/icons/squirrel.png") },
//   { id: 47, source: require("../../assets/icons/stingray.png") },
//   { id: 48, source: require("../../assets/icons/tiger.png") },
//   { id: 49, source: require("../../assets/icons/panda.png") },
//   { id: 50, source: require("../../assets/icons/axolotl.png") },
// ];

// const addRecord = async (
//   senderID: string,
//   receiverID: string,
//   message: string
// ) => {
//   try {
//     const receiverRef = doc(usersRef, receiverID);
//     console.log(receiverRef);
//     const receiverSnap = await getDoc(receiverRef);
//     console.log(receiverSnap);
//     if (receiverSnap.exists()) {
//       const receiverCurrData = receiverSnap.data();
//       // If field is not found, then the default is an empty array
//       const currentArray = receiverCurrData?.messagesReceived || [];
//       const newMessage = { senderID: senderID, message: message };
//       console.log(newMessage);
//       // Copy over all but last entry of the array (which contains the oldest received message)
//       const updatedArray = [newMessage, ...currentArray.slice(0, -1)];
//       console.log(updatedArray);
//       await updateDoc(receiverRef, { messagesReceived: updatedArray });
//     }
//   } catch (error) {
//     console.error("Error modifying message received array:", error);
//   }
// };
// // ReceiveMessage component
// const ReceiveMessage = () => {
//   // Initializing sendersData to be an empty array
//   const [sendersData, setSendersData] = useState<
//     {
//       uid: string;
//       nickname: string;
//       mood: string;
//       hobbies: string;
//       message: string;
//     }[]
//   >([]);
//   const [isReceivedEnabled, setIsReceivedEnabled] = useState(true);

//   useEffect(() => {
//     getMessages();
//   }, []);

//   const getMessages = async () => {
//     try {
//       const currUserRef = doc(usersRef, currUserId);
//       console.log(
//         "line 130: ",
//         currUserRef,
//         " this is the user id",
//         currUserId
//       );
//       const currUserRefSnap = await getDoc(currUserRef);
//       const currMessages = currUserRefSnap.data()?.messagesReceived || [];
//       if (currMessages.length != 0) {
//         // Chat GPT Code used to modify this part: https://chatgpt.com/share/69be0e05-fd13-448e-8448-353b9d1df32b
//         const senderArray = await Promise.all(
//           currMessages.map(
//             async (sender: { senderID: string; message: string }) => {
//               const senderRef = doc(usersRef, sender.senderID);
//               const senderSnap = await getDoc(senderRef);
//               return {
//                 uid: sender.senderID,
//                 nickname: senderSnap.data()?.nickname,
//                 mood: senderSnap.data()?.moods?.[0], // Accessing first mood if available
//                 hobbies: senderSnap.data()?.hobbies,
//                 message: sender.message,
//               };
//             }
//           )
//         );
//         console.log(senderArray);
//         setSendersData(senderArray);
//       }
//     } catch (error) {
//       console.log("haha no friends");
//     }
//   };
//   return (
//     <View>
//       {isReceivedEnabled ? (
//         <ScrollView style={styles.userList}>
//           {sendersData.map((sender) => (
//             <View key={sender.uid} style={styles.profileContainer}>
//               <UserCard key={sender.uid} user={sender} isSendEnabled={false} />
//               {/* <Text style={styles.profileUser}>{sender.nickname}</Text>
//               <Text style={styles.profileTag}>
//                 Hobbies: {sender.hobbies}
//                 Mood: {sender.mood}
//                 Message From {sender.nickname}: {sender.message}
//               </Text>
//               <Button
//                 title="Send"
//                 onPress={() => {
//                   if (currUserId !== "") {
//                     addRecord(currUserId, sender.uid, "Hi");
//                     alert(`Message sent to ${sender.nickname}`);
//                   } else {
//                     alert("Message failed to deliver");
//                   }
//                 }}
//               /> */}
//             </View>
//           ))}
//         </ScrollView>
//       ) : (
//         <ReceiveMessage />
//       )}
//     </View>
//     //{" "}
//   );
// };

// const defaultAvatar = require("../../assets/images/avatar.png");

// const getAvatarSource = (avatarId) => {
//   const avatar = avatars.find((avatar) => avatar.id === avatarId);
//   return avatar ? avatar.source : defaultAvatar;
// };

// const UserCard = ({ user, isSendEnabled }) => {
//   const firstThought =
//     user.thoughts && user.thoughts.length > 0
//       ? user.thoughts[0].thought
//       : "No thoughts available";

//   const avatarSource = getAvatarSource(user.avatar);

//   const message = isSendEnabled ? "" : user.message;
//   // If it is on the recieved screen, then user should have a message field for the passed in object
//   if (!isSendEnabled) {
//   }

//   return (
//     <View style={styles.profileContainer}>
//       <View style={styles.profileImageContainer}>
//         <Image source={avatarSource} style={styles.profileImage} />
//         <View style={styles.editIconContainer}>
//           <Icon name="edit" size={12} color="black" />
//         </View>
//       </View>
//       <View style={styles.profileInfoContainer}>
//         <Text style={styles.profileUser}>{user.nickname}</Text>
//         <Text style={styles.profileTag}>{user.hobbies}</Text>
//       </View>
//       <View style={styles.thoughtsContainer}>
//         <Text style={styles.profileThought}>
//           {isSendEnabled ? firstThought : message}
//         </Text>
//       </View>
//       <TouchableOpacity style={styles.sendButton}>
//         <Feather name="message-circle" size={17} style={styles.messageCircle} />
//         <Text style={styles.sendButtonText}>Send</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const SendMessage = () => {
//   const [usersData, setUsersData] = useState<
//     { id: string; nickname?: string; hobbies?: string }[]
//   >([]);
//   const [loading, setLoading] = useState(true);
//   const [isSendEnabled, setIsSendEnabled] = useState(true);

//   const handleSendPress = () => setIsSendEnabled(true);
//   const handleReceivePress = () => setIsSendEnabled(false);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);

//     const usersRef = collection(db, "user");

//     //account for the fact that your own account cant show up in the messages
//     try {
//       const usersSnapshot = await getDocs(usersRef);
//       const users = usersSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//         thoughts: doc.data().thoughts as string[],
//       }));

//       // Shuffling the array
//       for (let i = users.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [users[i], users[j]] = [users[j], users[i]];
//       }

//       // Choosing the first 5 users from array
//       const randomUsers = users.slice(0, 5);

//       // Getting data from array
//       const userDocsPromises = randomUsers.map((user) =>
//         getDoc(doc(usersRef, user.id))
//       );
//       const userData = await Promise.all(userDocsPromises);

//       const formattedUserData = userData.map((userDoc) => ({
//         id: userDoc.id,
//         ...userDoc.data(),
//       }));

//       setUsersData(formattedUserData);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error getting documents: ", error);
//       setLoading(false);
//     }
//   };

//   const handleRefresh = () => {
//     fetchData();
//   };

//   if (loading) {
//     return (
//       <View style={styles.loading}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <ImageBackground
//       source={
//         isSendEnabled
//           ? require("../../assets/images/sendCloud.png")
//           : require("../../assets/images/receiveCloud.png")
//       }
//       style={styles.background}
//       resizeMode="cover"
//     >
//       <View style={styles.container}>
//         <View style={styles.switchContainer}>
//           <TouchableOpacity
//             style={[
//               styles.switchButton,
//               isSendEnabled ? styles.activeButton : styles.inactiveButton,
//             ]}
//             onPress={handleSendPress}
//           >
//             <Text
//               style={isSendEnabled ? styles.activeText : styles.inactiveText}
//             >
//               Send
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[
//               styles.switchButton,
//               !isSendEnabled ? styles.activeButton : styles.inactiveButton,
//             ]}
//             onPress={handleReceivePress}
//           >
//             <Text
//               style={!isSendEnabled ? styles.activeText : styles.inactiveText}
//             >
//               Received
//             </Text>
//           </TouchableOpacity>
//         </View>
//         <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
//           <Ionicons name="refresh" size={30} color="black" />
//         </TouchableOpacity>
//         {isSendEnabled ? (
//           <ScrollView style={styles.userList}>
//             {usersData.map((user) => (
//               <UserCard key={user.id} user={user} isSendEnabled={true} />
//             ))}
//           </ScrollView>
//         ) : (
//           <ReceiveMessage />
//         )}
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     width: "100%",
//   },

//   background: {
//     flex: 1,
//     resizeMode: "cover",
//     justifyContent: "center",
//   },

//   switchContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginBottom: 20,
//     width: "50%",
//     maxWidth: 300,
//     height: 26,
//     borderRadius: 10,
//     overflow: "hidden",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     backgroundColor: "rgba(255, 255, 255, 0.8)",
//     marginTop: 10,
//   },

//   switchButton: {
//     flex: 1,
//     paddingVertical: 5,
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: "#ccc",
//   },

//   activeButton: {
//     backgroundColor: "#FFFFFF",
//   },

//   inactiveButton: {
//     backgroundColor: "#f4f3f4",
//   },

//   activeText: {
//     color: "black",
//     fontSize: 12,
//     fontFamily: "Nunito",
//     fontWeight: "700",
//   },

//   inactiveText: {
//     color: "#999",
//     fontSize: 12,
//     fontFamily: "Nunito",
//     fontWeight: "700",
//   },

//   userList: {
//     paddingHorizontal: 10,
//     width: "100%",
//   },

//   profileContainer: {
//     flexDirection: "row",
//     flex: 1,
//     alignItems: "center",
//     backgroundColor: "#FFF",
//     paddingVertical: 13,
//     paddingHorizontal: 10,
//     borderRadius: 20,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 3.84,
//     marginTop: 25,
//     padding: 20,
//     width: 343,
//     height: 184,
//     alignSelf: "center",
//     position: "relative",
//   },

//   profileImageContainer: {
//     position: "absolute",
//     top: 10,
//     left: 20,
//   },

//   editIconContainer: {
//     position: "absolute",
//     bottom: 0,
//     right: 0,
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     backgroundColor: "#F3F3F3",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },

//   profileInfoContainer: {
//     flex: 1,
//     marginLeft: 80,
//     marginTop: -110,
//   },

//   profileUser: {
//     color: "#0C092A",
//     fontSize: 16.86,
//     fontFamily: "Montserrat",
//     fontWeight: "300",
//     lineHeight: 25.29,
//   },

//   profileTag: {
//     color: "#858494",
//     fontSize: 12.65,
//     fontFamily: "Montserrat",
//     fontStyle: "italic",
//     fontWeight: "400",
//     lineHeight: 17.71,
//   },

//   loading: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   screen: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   refreshButton: {
//     position: "absolute",
//     top: 35,
//     right: 20,
//     zIndex: 1,
//     marginBottom: 20,
//   },

//   profileHeader: {
//     position: "relative",
//     marginRight: 10,
//   },

//   profileImage: {
//     width: 55,
//     height: 55,
//     borderRadius: 50,
//   },

//   profileInfo: {
//     flex: 1,
//   },

//   thoughtsContainer: {
//     flex: 1,
//     position: "absolute",
//     left: 20,
//     top: 75,
//     width: 302,
//     height: 51,
//   },

//   profileThought: {
//     fontSize: 12.65,
//     color: "black",
//     marginBottom: 10,
//     fontFamily: "Montserrat",
//     fontWeight: "400",
//     lineHeight: 17.71,
//   },

//   sendButton: {
//     backgroundColor: "#4F759B",
//     borderRadius: 33.02,
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     position: "absolute",
//     bottom: 10,
//     right: 10,
//     borderWidth: 0.66,
//     borderColor: "white",
//     width: 85,
//     height: 32,
//     flexDirection: "row",
//   },

//   sendButtonText: {
//     color: "#FFFFFF",
//     fontSize: 15,
//     fontFamily: "Nunito",
//     fontWeight: "700",
//     lineHeight: 22.5,
//     right: -4,
//   },

//   messageCircle: {
//     color: "white",
//     width: 20,
//     height: 20,
//     left: 1.89,
//     top: 2.38,
//   },
// });

// export default SendMessage;

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
import { app } from "../firebase";
// yarn add react-native-vector-icons
import Icon from "react-native-vector-icons/MaterialIcons";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import { auth } from "../firebase";
const db = getFirestore(app);
const currUserId = auth.currentUser?.uid ?? "";
const usersRef = collection(db, "user");
import { router } from "expo-router";
import WritingMessage from "./writemessage";

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

const defaultAvatar = require("../../assets/images/avatar.png");

const getAvatarSource = (avatarId) => {
  const avatar = avatars.find((avatar) => avatar.id === avatarId);
  return avatar ? avatar.source : defaultAvatar;
};

const UserCard = ({ user }) => {
  const firstThought =
    user.thoughts && user.thoughts.length > 0
      ? user.thoughts[0].thought
      : "No thoughts available";

  const avatarSource = getAvatarSource(user.avatar);

  return (
    <View style={styles.profileContainer}>
      <View style={styles.profileImageContainer}>
        <Image source={avatarSource} style={styles.profileImage} />
        <View style={styles.editIconContainer}>
          <Icon name="edit" size={12} color="black" />
        </View>
      </View>
      <View style={styles.profileInfoContainer}>
        <Text style={styles.profileUser}>{user.nickname}</Text>
        <Text style={styles.profileTag}>{user.hobbies}</Text>
      </View>
      <View style={styles.thoughtsContainer}>
        <Text style={styles.profileThought}>{firstThought}</Text>
      </View>
      <TouchableOpacity
        style={styles.sendButton}
        onPress={() =>
          WritingMessage({
            senderUID: auth.currentUser?.uid,
            receiverUID: user.uid,
          })
        }
      >
        <Feather name="message-circle" size={17} style={styles.messageCircle} />
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
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
            <UserCard key={user.id} user={user} />
          ))}
        </ScrollView>
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
});

export default SendMessage;
