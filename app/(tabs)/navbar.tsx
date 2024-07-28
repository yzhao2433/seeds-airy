import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
const screenHeight = Dimensions.get("window").height;
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const Navbar = () => {
  return (
    <View style={styles.rectangle}>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => router.navigate("/index")}>
          <FontAwesome name="home" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.navigate("/leaderboard")}>
          <MaterialIcons name="leaderboard" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.navigate("/message")}>
          <Ionicons name="paper-plane" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.navigate("/profile")}>
          <Ionicons name="person" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  rectangle: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.09,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 30,
  },
});
