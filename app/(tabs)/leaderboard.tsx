import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import {
  collection,
  getFirestore,
  onSnapshot,
  doc,
  writeBatch,
} from "firebase/firestore";
import globalFont from "../../styles/globalfont";
import { app, auth } from "../firebase";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const db = getFirestore(app);
const userCollection = collection(db, "user");
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

const UserCard = ({ user }) => {
  const avatarSource = getAvatarSource(user.avatar);
  return (
    <View style={styles.profileContainer}>
      <Text style={[styles.profileRanking, globalFont.Nunito]}>
        #{user.rank}
      </Text>
      <View style={styles.profileImageContainer}>
        <Image source={avatarSource} style={styles.profileImage} />
      </View>
      <View>
        <Text style={[styles.profileUser, globalFont.Montserrat]}>
          {user ? user.nickname : "User"}
        </Text>
        <Text style={[styles.profileTag, globalFont.Montserrat]}>
          {user ? user.hobbies : "No hobbies to be displayed yet"}
        </Text>
      </View>
      <View style={styles.pointContainer}>
        <Image
          source={require("../../assets/images/star.png")}
          style={styles.profileStar}
        />
        <Text style={[styles.profilePoints, globalFont.Montserrat]}>
          {user.userScore}
        </Text>
      </View>
    </View>
  );
};

const Leaderboard = () => {
  const [top10Users, setTop10Users] = useState([]);
  const [allUserScore, setAllUserScore] = useState([]);
  const [currUserRank, setCurrUserRank] = useState();
  const [loading, setLoading] = useState(true);

  const [allUserUID, setAllUserUID] = useState<string[]>();

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      userCollection,
      async (userSnapShot) => {
        const tempUserScore = [];
        if (userSnapShot.empty) {
          console.error("No matching documents.");
          return;
        }
        const batch = writeBatch(db);
        userSnapShot.forEach((user) => {
          const userData = {
            userUID: user.id,
            userScore: user.data().score,
            activeDate: user.data().messageLastSent,
            nickname: user.data().nickname,
            hobbies: user.data().hobbies,
            avatar: user.data().avatar,
            rank: user.data().rank ?? 0, // Initialize rank to 0 if it doesn't exist
          };
          tempUserScore.push(userData);
          allUserUID?.push(user.id);
          // Add a rank field if it doesn't exist
          if (userData.rank === 0) {
            const userDoc = doc(db, "user", user.id);
            batch.update(userDoc, { rank: 0 });
          }
        });

        tempUserScore.sort((userA, userB) => {
          if (userA.userScore !== userB.userScore) {
            return userB.userScore - userA.userScore;
          } else if (userA.activeDate !== userB.activeDate) {
            return userB.activeDate - userA.activeDate;
          } else {
            const userAName = userA.nickname.toUpperCase();
            const userBName = userB.nickname.toUpperCase();
            return userAName > userBName ? 1 : -1;
          }
        });

        tempUserScore.forEach((user, index) => {
          user.rank = index + 1;
        });

        setAllUserScore(tempUserScore);
        setTop10Users(tempUserScore.slice(0, 10));

        const currentUserRanking = tempUserScore.find(
          (user) => user.userUID === auth.currentUser?.uid
        );
        setCurrUserRank(currentUserRanking);
        setLoading(false);

        // Update all user ranks in Firestore
        tempUserScore.forEach((user) => {
          const userDoc = doc(db, "user", user.userUID);
          batch.update(userDoc, { rank: user.rank });
        });
        await batch.commit();
      },
      (error) => {
        console.error("Error getting scores array", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // source: https://blog.greenroots.info/how-to-use-javascript-scheduling-methods-with-react-hooks
  const runAtEndOfDay = async (userUIDList) => {
    const batch = writeBatch(db);
    userUIDList.forEach((userUID) => {
      const userDoc = doc(db, "user", userUID);
      batch.update(userDoc, { messageLeft: 10 });
    });
    await batch.commit();
  };

  // Calculate the time remaining until the end of the day
  function getTimeUntilEndOfDay() {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(24, 0, 0, 0);
    return endOfDay - now;
  }

  // will call this function at the end of the day
  setTimeout(() => {
    runAtEndOfDay(allUserUID);
    // 24 hour * 60 min * 60 sec * 1000 millisec
    setInterval(runAtEndOfDay, 24 * 60 * 60 * 1000);
  }, getTimeUntilEndOfDay());

  const runAtEndOfWeek = async (userUIDList) => {
    const batch = writeBatch(db);
    userUIDList.forEach((userUID) => {
      const userDoc = doc(db, "user", userUID);
      batch.update(userDoc, { rank: 0 });
    });
    await batch.commit();
  };

  function getTimeUntilEndOfWeek() {
    const now = new Date();
    const endOfWeek = new Date();
    endOfWeek.setHours(24 * 7, 0, 0, 0);
    return endOfWeek - now;
  }

  setTimeout(() => {
    runAtEndOfWeek(allUserUID);
    // 7 days * 24 hour * 60 min * 60 sec * 1000 millisec
    setInterval(runAtEndOfWeek, 7 * 24 * 60 * 60 * 1000);
  }, getTimeUntilEndOfWeek());

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ImageBackground
      // source={require("../../assets/images/leaderboard_background.png")}
      source={require("../../assets/images/leaderboardCloud.png")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={[styles.subHeader, globalFont.Nunito]}>Leaderboard</Text>
          <TouchableOpacity
            style={styles.instructions}
            onPress={() => openModal()}
          >
            <AntDesign name="questioncircleo" size={32} color="#6a6a6a" />
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.ModalBackground}>
            <View style={styles.modalContent}>
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.logo}
              />
              <TouchableOpacity
                style={styles.headerCloseButton}
                onPress={closeModal}
              >
                <AntDesign name="close" size={25} color="black" />
              </TouchableOpacity>

              <View style={styles.modalTextContent}>
                <Text style={styles.modalTitle}>How It Works</Text>
                <Text style={styles.modalText}>
                  You can send up to 10 motivational messages each day to earn
                  points. The leaderboard refreshes at the end of Sunday,
                  displaying the top 10 users with the highest points.
                </Text>
                <Text style={styles.modalSubtitle}>Points System:</Text>
                <View style={styles.bulletPoints}>
                  <Text style={styles.bulletPoint}>
                    • 1st - 3rd message: 1 pt each
                  </Text>
                  <Text style={styles.bulletPoint}>
                    • 4th - 7th message: 2 pts each
                  </Text>
                  <Text style={styles.bulletPoint}>
                    • 8th - 10th message: 3 pts each
                  </Text>
                </View>
                <Text style={styles.modalText}>
                  Send up to 10 messages daily to accumulate points and become a
                  top Airies! Good luck!
                </Text>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.yourRankingContainer}>
          <View style={styles.yourRanking}>
            <Text style={[styles.yourRankingText, globalFont.Nunito]}>
              Your Ranking:
            </Text>
            {currUserRank && (
              <UserCard key={currUserRank.userUID} user={currUserRank} />
            )}
          </View>
        </View>
        <Text style={[styles.subHeader, globalFont.Nunito]}>Top 10 Airies</Text>

        <View style={styles.otherRankingContainer}>
          {top10Users.map((user) => (
            <UserCard key={user.userUID} user={user} />
          ))}
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
    paddingHorizontal: 18,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 0,
    paddingVertical: 15,
  },
  subHeader: {
    fontSize: 32,
    fontWeight: "bold",
    paddingVertical: 5,
    textAlign: "center",
    fontFamily: "Nunito-Bold",
    color: "black",
    flex: 1,
  },

  instructions: {
    backgroundColor: "white",
    borderRadius: 50,
    padding: 2,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "flex-end",
    position: "absolute",
    right: 35,
  },
  yourRankingContainer: {
    marginBottom: 40,
    opacity: 0.95,
  },
  yourRankingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  yourRanking: {
    backgroundColor: "#FFE785",
    borderRadius: 10,
    paddingVertical: 10,
    paddingBottom: 5,
    paddingHorizontal: 10,
  },
  otherRankingContainer: {
    borderRadius: 20,
    paddingVertical: 20,
    paddingTop: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
    flexGrow: 1,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    marginBottom: 15,
    opacity: 1,
  },
  profileImageContainer: {
    position: "relative",
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
    color: "#0C092A",
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
  ModalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    height: "50%",
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 30,
    borderWidth: 4,
    borderColor: "#BFD7EA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
  headerCloseButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 5,
  },
  modalTextContent: {
    justifyContent: "center",
    alignContent: "center",
  },
  modalTitle: {
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Nunito",
  },
  modalText: {
    marginVertical: 10,
    fontSize: 15,
    fontFamily: "Montserrat",
    textAlign: "left",
    lineHeight: 22,
    marginBottom: 25,
  },
  modalSubtitle: {
    fontSize: 17,
    fontWeight: "bold",
    fontFamily: "Nunito",
    marginBottom: 5,
  },
  bulletPoints: {
    marginLeft: 15,
    fontFamily: "Montserrat",
    marginBottom: 15,
  },
  bulletPoint: {
    fontSize: 13,
    marginBottom: 5,
    fontFamily: "Montserrat",
    lineHeight: 17,
  },
  logo: {
    width: 100,
    height: 100,
    zIndex: 100,
    right: 260,
    top: -65,
    position: "absolute",
  },
});

export default Leaderboard;
