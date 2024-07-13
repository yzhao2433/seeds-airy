import { StyleSheet } from "react-native";
import fonts from "./fonts";

const globalFont = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  Nunito: {
    fontFamily: fonts.Nunito.bold,
  },
  Montserrat: {
    fontFamily: fonts.Montserrat.light,
  },
});

export default globalFont;
