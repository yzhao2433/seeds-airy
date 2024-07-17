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

const featureSelection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const features = [
    {
      title: "Meet fellow Airies!",
      text: "Receive daily messages from your five airies friends sharing their moods and thoughts.",
      image: require("../assets/images/meetAiriesCloud.png"),
      imageStyle: styles.cloud1,
      titleStyle: styles.feature1Title,
      textStyle: styles.feature1Text,
    },
    {
      title: "Communicate!",
      text: "Send motivational replies to fellow airies. The more you respond, the more points you earn for the leaderboard.",
      image: require("../assets/images/communicateCloud.png"),
      imageStyle: styles.cloud2,
      titleStyle: styles.feature2Title,
      textStyle: styles.feature2Text,
    },
    {
      title: "Connect!",
      text: "Receive responses from fellow users. Know that you're not alone!",
      image: require("../assets/images/messagesCloud.png"),
      imageStyle: styles.cloud3,
      titleStyle: styles.feature3Title,
      textStyle: styles.feature3Text,
    },
    {
      title: "Join AIRY!",
      text: "Reduce stress and improve your well-being by sharing and receiving thoughtful messages.",
      image: require("../assets/images/logo.png"),
      imageStyle: styles.logo,
      titleStyle: styles.feature4Title,
      textStyle: styles.feature4Text,
    },
  ];

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

        <TouchableOpacity
          style={styles.getStartedContainer}
          onPress={() => router.navigate("/signup")}
        >
          <Text style={[styles.getStartedText, globalFont.Nunito]}>
            Get Started!
          </Text>
        </TouchableOpacity>
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
    width: "70%",
  },

  cloud1: {
    width: 127,
    height: 90,
    marginTop: "-27%",
    marginLeft: "50%",
  },

  feature1Text: {
    color: "#4f759b",
    fontFamily: "Nunito",
    fontSize: 14,
    fontWeight: 400,
    marginTop: "10%",
  },
  feature2Title: {
    color: "#4F759B",
    fontSize: 24,
    fontFamily: "Nunito",
    fontWeight: "700",
    alignSelf: "flex-end",
    marginTop: "10%",
  },

  cloud2: {
    width: 117,
    height: 80,
    transform: [{ rotate: "-6.7deg" }],
    marginTop: "-17%",
    marginLeft: "-8%",
  },

  feature2Text: {
    color: "#4F759B",
    fontSize: 14,
    fontFamily: "Nunito",
    fontWeight: "700",
    // textAlign: "center",
    marginLeft: "5%",
  },
  feature3Title: {
    color: "#4F759B",
    fontSize: 24,
    fontFamily: "Nunito",
    fontWeight: "700",
    marginTop: "10%",
  },

  cloud3: {
    width: 141,
    height: 99,
    alignSelf: "flex-end",
    marginRight: "-8%",
    marginTop: "-8%",
  },

  feature3Text: {
    color: "#4F759B",
    fontSize: 14,
    fontFamily: "Nunito",
    fontWeight: "700",
    width: "60%",
    marginTop: "-25%",
  },
  feature4Title: {
    color: "#4F759B",
    fontSize: 24,
    fontFamily: "Nunito",
    fontWeight: "700",
    alignSelf: "flex-end",
    marginTop: "10%",
  },

  logo: {
    width: 100,
    height: 100,
    marginTop: "-20%",
    marginLeft: "-5%",
  },

  feature4Text: {
    color: "#4F759B",
    fontSize: 14,
    fontFamily: "Nunito",
    fontWeight: "700",
    width: "65%",
    alignSelf: "flex-end",
    marginTop: "-15%",
    // marginRight: "%",
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
  getStartedContainer: {
    borderWidth: 1,
    borderColor: "#BFD7EA",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#FFE785",
    width: "85%",
    alignSelf: "center",
    marginBottom: hp("2%"),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    height: 55,
    marginTop: "12%",
  },
  getStartedText: {
    color: "#4F759B",
    fontSize: 25,
    fontFamily: "Nunito",
    fontWeight: "600",
    lineHeight: 40,
    alignSelf: "center",
    top: -5,
  },
  contentContainerStyle: {
    alignItems: "center",
  },
});

export default featureSelection;
