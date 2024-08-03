import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import globalFont from "../styles/globalfont";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

/**
 * Lays the features offered by our app
 */
const featureSelection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const features = [
    {
      title: "Track Your Feelings!",
      text: "Share your daily thoughts and mood to fellow airies! Track your latest 7 entries to see how your mood changes over the week!",
      image: require("../assets/images/meetAiriesCloud.png"),
      imageStyle: styles.cloud1,
      titleStyle: styles.feature1Title,
      textStyle: styles.feature1Text,
    },
    {
      title: "Meet Fellow Airies!",
      text: "Connect with your airies friends by responding and receiving messages! Share how you’re feeling and uplift each other!",
      image: require("../assets/images/communicateCloud.png"),
      imageStyle: styles.cloud2,
      titleStyle: styles.feature2Title,
      textStyle: styles.feature2Text,
    },
    {
      title: "Communicate!",
      text: "Send up to 10 daily motivational replies to fellow airies! The more you respond, the more points you earn for the leaderboard!",
      image: require("../assets/images/messagesCloud.png"),
      imageStyle: styles.cloud3,
      titleStyle: styles.feature3Title,
      textStyle: styles.feature3Text,
    },
    {
      title: "Join AIRY!",
      text: "Reduce stress and improve your well-being! Start sharing and responding to uplift fellow airies and rise to the top ten airies!",
      image: require("../assets/images/logo.png"),
      imageStyle: styles.logo,
      titleStyle: styles.feature4Title,
      textStyle: styles.feature4Text,
    },
  ];

  /**
   * Allows the users to scroll through each of the feature description panels.
   */
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / 350);
    setActiveIndex(index);
  };

  return (
    <ImageBackground
      source={require("../assets/images/featuresBackground.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={[styles.title, globalFont.Nunito]}>Welcome to AIRY</Text>

        <Image
          source={require("../assets/images/burst.png")}
          style={styles.burst}
        ></Image>

        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logoImage}
        ></Image>

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.scroll}
          pagingEnabled={false}
          onScroll={handleScroll}
          decelerationRate="fast"
          snapToInterval={330}
          scrollEventThrottle={16}
          snapToAlignment="center"
          contentContainerStyle={[
            styles.contentContainerStyle,
            { paddingLeft: "15%" },
          ]}
        >
          {features.map((feature, index) => (
            <View style={styles.container} key={index}>
              <Text style={[feature.titleStyle]}>{feature.title}</Text>
              <Image source={feature.image} style={feature.imageStyle} />
              <Text style={[feature.textStyle]}>{feature.text}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.dotsContainer}>
          {features.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, { opacity: activeIndex === index ? 1 : 0.5 }]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={() => router.navigate("/login")}
          >
            <Text style={[styles.buttonText, globalFont.Nunito]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.navigate("/signup")}
          >
            <Text style={[styles.buttonText, globalFont.Nunito]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    color: "white",
    fontSize: 45,
    fontFamily: "Nunito",
    fontWeight: "800",
    lineHeight: 45,
    width: "80%",
    textAlign: "center",
    alignSelf: "center",
    marginTop: hp("5%"),
  },
  burst: {
    width: 31.55,
    height: 38.587,
    alignSelf: "flex-end",
    marginTop: "-29%",
    marginRight: "8%",
  },
  logoImage: {
    width: 800,
    height: 275,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: "10%",
  },
  scroll: {
    paddingHorizontal: 0,
  },
  container: {
    flex: 1,
    marginTop: "2%",
    display: "flex",
    width: 284,
    height: 200,
    padding: 16,
    marginRight: 35,
    backgroundColor: "white",
    borderRadius: 32,
    borderColor: "#bebfc3",
    borderWidth: 3,
  },

  feature1Title: {
    color: "#4F759B",
    fontFamily: "Nunito",
    fontSize: 24,
    fontWeight: 700,
    width: "72%",
  },

  cloud1: {
    width: 120,
    height: 85,
    marginTop: "-30%",
    marginLeft: "50%",
  },

  feature1Text: {
    color: "#4f759b",
    fontFamily: "Nunito",
    fontSize: 14,
    fontWeight: 400,
    marginTop: "2%",
  },

  feature2Title: {
    color: "#4F759B",
    fontSize: 24,
    fontFamily: "Nunito",
    fontWeight: "700",
    alignSelf: "flex-end",
    width: "72%",
    textAlign: "right",
  },

  cloud2: {
    width: 117,
    height: 80,
    transform: [{ rotate: "-6.7deg" }],
    marginLeft: "-3%",
    marginTop: "-25%",
  },

  feature2Text: {
    color: "#4f759b",
    fontFamily: "Nunito",
    fontSize: 14,
    fontWeight: 400,
    marginTop: "0%",
  },

  feature3Title: {
    color: "#4F759B",
    fontSize: 24,
    fontFamily: "Nunito",
    fontWeight: "700",
    width: "72%",
  },

  cloud3: {
    width: 125,
    height: 99,
    alignSelf: "flex-end",
    marginRight: "-8%",
    marginTop: "2%",
    marginLeft: "50%",
  },
  feature3Text: {
    color: "#4F759B",
    fontSize: 14,
    fontFamily: "Nunito",
    fontWeight: "700",
    width: "60%",
    marginTop: "-40%",
  },
  feature4Title: {
    color: "#4F759B",
    fontSize: 24,
    fontFamily: "Nunito",
    fontWeight: "700",
    alignSelf: "center",
  },

  logo: {
    width: 100,
    height: 100,
    marginTop: "-5%",
    marginLeft: "-5%",
  },

  feature4Text: {
    color: "#4F759B",
    fontSize: 14,
    fontFamily: "Nunito",
    fontWeight: "700",
    width: "70%",
    alignSelf: "flex-end",
    marginTop: "-35%",
    textAlign: "right",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4F759B",
    marginHorizontal: 4,
  },
  contentContainerStyle: {
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    width: "100%",
  },
  button: {
    backgroundColor: "#FFE785",
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    marginHorizontal: 10,
    width: 160,
  },
  loginButton: {
    marginRight: 10,
  },
  buttonText: {
    color: "#4F759B",
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
  },
  signupButton: {
    marginLeft: 20,
  },
});

export default featureSelection;
