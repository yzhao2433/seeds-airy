import React, { useCallback, useState, useEffect } from "react";
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

const Leaderboard = () => {
  return <Text> Competing is Bad </Text>;
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

export default Leaderboard;
