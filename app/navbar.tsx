import React from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { usePathname, useRouter, useSegments } from "expo-router";

const screenHeight = Dimensions.get("window").height;

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const segments = useSegments();
  const currentRoute = segments.join("/");

  const getIconName = (route: string, iconName: string) => {
    if (pathname === route) {
      return iconName;
    }
    return `${iconName}-outline`;
  };

  return (
    <View style={styles.rectangle}>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => router.push("/home")}
        >
          <Ionicons
            name={getIconName("/home", "home")}
            size={30}
            color={currentRoute === "home" ? "#4F759B" : "#585858"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => router.push("/leaderboard")}
        >
          <MaterialIcons
            name="leaderboard"
            size={30}
            color={currentRoute === "leaderboard" ? "#4F759B" : "#585858"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => router.push("/message")}
        >
          <Ionicons
            name={getIconName("/message", "paper-plane")}
            size={30}
            color={currentRoute === "message" ? "#4F759B" : "#585858"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => router.push("/profile")}
        >
          <Ionicons
            name={getIconName("/profile", "person")}
            size={30}
            color={currentRoute === "profile" ? "#4F759B" : "#585858"}
          />
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
    height: screenHeight * 0.05,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 30,
  },
  icon: {
    marginBottom: -7,
  },
});
