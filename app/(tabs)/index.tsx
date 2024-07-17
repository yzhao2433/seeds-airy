import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
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
  { id: 49, source: require("../../assets/icons/panda.png") },
  { id: 50, source: require("../../assets/icons/axolotl.png") },
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
const Home = () => {
  const [userData, setUserData] = useState(null);
  const [moodIcons, setMoodIcons] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [thought, setThought] = useState("");
  const [placeholder, setPlaceholder] = useState("Write your thoughts here...");
  const [textAreaBgColor, setTextAreaBgColor] = useState("white");
  const [buttonBgColor, setButtonBgColor] = useState({
    skip: "#FFE785",
    submit: "#FFE785",
  });
  const avatarSource = userData ? getAvatar(userData.avatar) : defaultAvatar;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDocRef = doc(db, "user", currentUser.uid);
          console.log("Fetching user data...");
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUserData(userData);
            console.log("User data fetched:", userData);
          } else {
            console.log("User document not found");
          }
        } else {
          console.log("Current user not found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  console.log("Current user data:", userData);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const updateUserMood = async (newMoodIcon) => {
    const todayDate = getTodayDate();
    const userId = auth.currentUser?.uid || "";

    console.log(userId);
    try {
      const userDocRef = doc(db, "user", userId);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.data();
      let moodIcons = userData.moods || [];

      if (moodIcons.length > 0 && moodIcons[0].date === todayDate) {
        moodIcons[0].moodIcon = newMoodIcon;
      } else {
        moodIcons.unshift({ date: todayDate, moodIcon: newMoodIcon });
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
    alert("Thoughts submitted");
    setTextAreaBgColor("#FFFFFF");
    setButtonBgColor({ ...buttonBgColor, submit: "#FFE785" });
  };

  const handleThoughtSkip = () => {
    setThought("");
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
          <Text style={[styles.profileRanking, globalFont.Nunito]}>#25</Text>
          <View style={styles.profileImageContainer}>
            <Image source={avatarSource} style={styles.profileImage} />
            <View style={styles.editIconContainer}>
              <Icon name="edit" size={12} color="black" />
            </View>
          </View>
          <View>
            <Text style={[styles.profileUser, globalFont.Montserrat]}>
              {userData ? userData.nickname : "User"}
            </Text>
            <Text style={[styles.profileTag, globalFont.Montserrat]}>
              #{userData ? userData.hobbies : "User"}
            </Text>
          </View>
          <View style={styles.pointContainer}>
            <Image
              source={require("@/assets/images/star.png")}
              style={styles.profileStar}
            />
            <Text style={[styles.profilePoints, globalFont.Montserrat]}>
              13
            </Text>
          </View>
        </View>

        <Text style={[styles.subHeader, globalFont.Nunito]}>
          How are you feeling today?
        </Text>
        <View style={styles.moodWrapper}>
          <View style={styles.moodContainer}>
            <TouchableOpacity onPress={() => updateUserMood(5)}>
              <View
                style={[
                  styles.moodIcon,
                  {
                    backgroundColor: selectedMood === 5 ? "#FFCD00" : "#FFE785",
                    transform:
                      selectedMood === 5 ? [{ scale: 1.2 }] : [{ scale: 1 }],
                  },
                ]}
              >
                <Feather name="sun" size={28} color="white" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => updateUserMood(4)}>
              <View
                style={[
                  styles.moodIcon,
                  {
                    backgroundColor: selectedMood === 4 ? "#70C0FF" : "#BFD7EA",
                    transform:
                      selectedMood === 4 ? [{ scale: 1.2 }] : [{ scale: 1 }],
                  },
                ]}
              >
                <Ionicons name="partly-sunny-outline" size={28} color="white" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => updateUserMood(3)}>
              <View
                style={[
                  styles.moodIcon,
                  {
                    backgroundColor: selectedMood === 3 ? "#005CC3" : "#6495CC",
                    transform:
                      selectedMood === 3 ? [{ scale: 1.2 }] : [{ scale: 1 }],
                  },
                ]}
              >
                <AntDesign name="cloudo" size={28} color="white" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => updateUserMood(2)}>
              <View
                style={[
                  styles.moodIcon,
                  {
                    backgroundColor: selectedMood === 2 ? "#004D9A" : "#4F759B",
                    transform:
                      selectedMood === 2 ? [{ scale: 1.2 }] : [{ scale: 1 }],
                  },
                ]}
              >
                <Fontisto name="rain" size={28} color="white" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => updateUserMood(1)}>
              <View
                style={[
                  styles.moodIcon,
                  {
                    backgroundColor: selectedMood === 1 ? "#001526" : "#0D1821",
                    transform:
                      selectedMood === 1 ? [{ scale: 1.2 }] : [{ scale: 1 }],
                  },
                ]}
              >
                <Ionicons name="thunderstorm-outline" size={28} color="white" />
              </View>
            </TouchableOpacity>
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
            <TouchableOpacity
              style={[styles.button, { backgroundColor: buttonBgColor.skip }]}
              onPress={handleThoughtSkip}
            >
              <Text style={styles.buttonText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: buttonBgColor.submit }]}
              onPress={handleThoughtSubmit}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
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
    backgroundColor: "#FFF",
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
    backgroundColor: "#FFF",
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
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  motivationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5CF",
    padding: 20,
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
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 5,
    color: "0D1821",
  },
  motivationText: {
    fontSize: 13,
    color: "#0D1821",
  },
  motivationButton: {
    marginLeft: "auto",
    backgroundColor: "#FFD700",
    padding: 10,
    paddingVertical: 5,
    borderRadius: 33,
  },
  motivationButtonText: {
    fontSize: 14,
    fontWeight: "bold",
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
    padding: 10,
    marginLeft: "auto",
    backgroundColor: "#FFD700",
    paddingVertical: 5,
    borderRadius: 33,
  },
  checkButtonText: {
    color: "#0D1821",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default Home;

// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   ImageBackground,
//   TextInput,
// } from "react-native";
// import React, { useState, useEffect } from "react";
// import {
//   getFirestore,
//   collection,
//   getDocs,
//   getDoc,
//   doc,
//   updateDoc,
// } from "firebase/firestore";
// import { NavigationContainer } from "@react-navigation/native";
// import { app } from "../firebase";
// import { auth } from "../firebase";

// import Icon from "react-native-vector-icons/MaterialIcons";

// import { Feather, Ionicons, AntDesign, Fontisto } from "@expo/vector-icons";

// <style>
//   @import
//   url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');
//   @import
//   url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
// </style>;

// const Home = () => {
//   return (
//     <ImageBackground
//       source={require("../../assets/images/home_clouds.png")}
//       style={styles.backgroundImage}
//     >
//       <ScrollView contentContainerStyle={styles.container}>
//         <Text style={styles.subHeader}>Welcome back, sadbird102!</Text>

//         <View style={styles.profileContainer}>
//           <Text style={styles.profileRanking}>#25</Text>
//           <View style={styles.profileImageContainer}>
//             <Image
//               source={require("../../assets/images/avatar.png")}
//               style={styles.profileImage}
//             />
//             <View style={styles.editIconContainer}>
//               <Icon name="edit" size={12} color="black" />
//             </View>
//           </View>
//           <View>
//             <Text style={styles.profileUser}>Sadbird102</Text>
//             <Text style={styles.profileTag}>#dance</Text>
//           </View>
//           <View style={styles.pointContainer}>
//             <Image
//               source={require("../../assets/images/star.png")}
//               style={styles.profileStar}
//             />
//             <Text style={styles.profilePoints}>13</Text>
//           </View>
//         </View>

//         <Text style={styles.subHeader}>How are you feeling today?</Text>
//         <View style={styles.moodWrapper}>
//           <View style={styles.moodContainer}>
//             <TouchableOpacity>
//               <View style={[styles.moodIcon, { backgroundColor: "#FFE785" }]}>
//                 <Feather name="sun" size={28} color="white" />
//               </View>
//             </TouchableOpacity>
//             <TouchableOpacity>
//               <View style={[styles.moodIcon, { backgroundColor: "#BFD7EA" }]}>
//                 <Ionicons name="partly-sunny-outline" size={28} color="white" />
//               </View>
//             </TouchableOpacity>
//             <TouchableOpacity>
//               <View style={[styles.moodIcon, { backgroundColor: "#6495CC" }]}>
//                 <AntDesign name="cloudo" size={28} color="white" />
//               </View>
//             </TouchableOpacity>
//             <TouchableOpacity>
//               <View style={[styles.moodIcon, { backgroundColor: "#4F759B" }]}>
//                 <Fontisto name="rain" size={28} color="white" />
//               </View>
//             </TouchableOpacity>
//             <TouchableOpacity>
//               <View style={[styles.moodIcon, { backgroundColor: "#0D1821" }]}>
//                 <Ionicons name="thunderstorm-outline" size={28} color="white" />
//               </View>
//             </TouchableOpacity>
//           </View>
//         </View>

//         <Text style={styles.subHeader}>Write down your thoughts.</Text>
//         <View style={styles.textAreaContainer}>
//           <TextInput
//             style={[styles.textArea, { height: 50 }]}
//             multiline
//             numberOfLines={2}
//             placeholder="Write your thoughts here..."
//             placeholderTextColor="#555"
//           />
//           <View style={styles.buttonContainer}>
//             <TouchableOpacity style={styles.button}>
//               <Text style={styles.buttonText}>Skip</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.button}>
//               <Text style={styles.buttonText}>Submit</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         <View style={styles.motivationContainer}>
//           <View style={styles.horizontalContainer}>
//             <Image
//               source={require("../../assets/images/sun_home_motivation.png")}
//               style={styles.motivationImage}
//             />
//             <View style={styles.verticalContainer}>
//               <Text style={styles.motivationTitle}>Daily Motivation</Text>
//               <Text style={styles.motivationText}>
//                 Don't forget to send and check your messages!
//               </Text>
//               <TouchableOpacity style={styles.checkButton}>
//                 <Text style={styles.checkButtonText}>Check</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//     resizeMode: "cover",
//   },
//   container: {
//     flexGrow: 1,
//     paddingHorizontal: 30,
//   },
//   profileContainer: {
//     flexDirection: "row",
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
//   },
//   profileImageContainer: {
//     position: "relative",
//   },
//   editIconContainer: {
//     position: "absolute",
//     width: 20,
//     height: 20,
//     bottom: 0,
//     right: 7,
//     borderRadius: 5,
//     backgroundColor: "#F3F3F3",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   editIcon: {
//     position: "absolute",
//     width: 20,
//     height: 20,
//     bottom: 0,
//     right: 7,
//     color: "#4285F4",
//   },
//   profileImage: {
//     width: 66,
//     height: 66,
//     borderRadius: 50,
//     marginRight: 10,
//   },
//   profileRanking: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginRight: 9,
//     color: "0C092A",
//   },
//   profileUser: {
//     fontSize: 17,
//   },
//   profileTag: {
//     fontSize: 13,
//     color: "#858494",
//     fontStyle: "italic",
//   },
//   profilePoints: {
//     marginLeft: "auto",
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "white",
//     position: "absolute",
//   },
//   pointContainer: {
//     position: "relative",
//     width: 45,
//     height: 45,
//     justifyContent: "center",
//     alignItems: "center",
//     marginLeft: "auto",
//   },
//   profileStar: {
//     width: 45,
//     height: 45,
//   },
//   subHeader: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginVertical: 10,
//     paddingVertical: 15,
//     textAlign: "center",
//   },
//   moodWrapper: {
//     backgroundColor: "#FFF",
//     padding: 12,
//     borderRadius: 20,
//     marginVertical: 0,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 3.84,
//     opacity: 0.7,
//     zIndex: 1,
//   },
//   moodContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   moodIcon: {
//     width: 48,
//     height: 50,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: "white",
//   },
//   textAreaContainer: {
//     backgroundColor: "#FFF",
//     padding: 15,
//     borderRadius: 20,
//     marginVertical: 0,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 3.84,
//     opacity: 0.7,
//     zIndex: 1,
//   },
//   textArea: {
//     fontSize: 14,
//     color: "#555",
//     marginBottom: 10,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   button: {
//     backgroundColor: "#FFD700",
//     padding: 10,
//     paddingVertical: 5,
//     borderRadius: 33,
//     zIndex: 2,
//     opacity: 100,
//   },
//   buttonText: {
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   motivationContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFF5CF",
//     padding: 20,
//     borderRadius: 20,
//     marginVertical: 36,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 3.84,
//     opacity: 0.91,
//   },
//   motivationImage: {
//     width: 90,
//     height: 90,
//   },
//   motivationTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     paddingBottom: 5,
//     color: "0D1821",
//   },
//   motivationText: {
//     fontSize: 13,
//     color: "#0D1821",
//   },
//   motivationButton: {
//     marginLeft: "auto",
//     backgroundColor: "#FFD700",
//     padding: 10,
//     paddingVertical: 5,
//     borderRadius: 33,
//   },
//   motivationButtonText: {
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   horizontalContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   verticalContainer: {
//     flex: 1,
//     marginLeft: 10,
//   },
//   checkButton: {
//     padding: 10,
//     marginLeft: "auto",
//     backgroundColor: "#FFD700",
//     paddingVertical: 5,
//     borderRadius: 33,
//   },
//   checkButtonText: {
//     color: "#0D1821",
//     fontSize: 13,
//     textAlign: "center",
//     fontWeight: "bold",
//   },
// });

// export default Home;
