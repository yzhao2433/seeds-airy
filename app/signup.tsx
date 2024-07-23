import React from "react";
import {
  Button,
  Text,
  TextInput,
  View,
  ImageBackground,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { useState } from "react";
import { AuthError, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth } from "./firebase";
import { app } from "./firebase";
import { Controller, useForm } from "react-hook-form";
import { Link } from "expo-router";
//yarn add react-native-responsive-screen
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { SubmitHandler } from "react-hook-form";
import globalFont from "../styles/globalfont";
import AntDesign from "@expo/vector-icons/AntDesign";

interface FormValues {
  email: string;
  password: string;
  nickname: string;
  listHobbies: string;
}

const defaultValues: FormValues = {
  email: "",
  password: "",
  nickname: "",
  listHobbies: "",
};

// Get reference to collection
const db = getFirestore(app);

const avatars = [
  { id: 1, source: require("../assets/icons/Bee.png") },
  { id: 2, source: require("../assets/icons/Cat.png") },
  { id: 3, source: require("../assets/icons/Chick.png") },
  { id: 4, source: require("../assets/icons/Crab.png") },
  { id: 5, source: require("../assets/icons/Fox.png") },
  { id: 6, source: require("../assets/icons/Frog.png") },
  { id: 7, source: require("../assets/icons/Koala.png") },
  { id: 8, source: require("../assets/icons/Lion.png") },
  { id: 9, source: require("../assets/icons/Turtle.png") },
  { id: 10, source: require("../assets/icons/Whale.png") },
  { id: 11, source: require("../assets/icons/alligator.png") },
  { id: 12, source: require("../assets/icons/ant.png") },
  { id: 13, source: require("../assets/icons/anteater.png") },
  { id: 14, source: require("../assets/icons/bird.png") },
  { id: 15, source: require("../assets/icons/butterfly.png") },
  { id: 16, source: require("../assets/icons/camel.png") },
  { id: 17, source: require("../assets/icons/chameleon.png") },
  { id: 18, source: require("../assets/icons/chicken.png") },
  { id: 19, source: require("../assets/icons/cow.png") },
  { id: 20, source: require("../assets/icons/dino.png") },
  { id: 21, source: require("../assets/icons/dog.png") },
  { id: 22, source: require("../assets/icons/dolphin.png") },
  { id: 23, source: require("../assets/icons/elephant.png") },
  { id: 24, source: require("../assets/icons/fish.png") },
  { id: 25, source: require("../assets/icons/fox2.png") },
  { id: 26, source: require("../assets/icons/giraffe.png") },
  { id: 27, source: require("../assets/icons/hedgehog.png") },
  { id: 28, source: require("../assets/icons/hippo.png") },
  { id: 29, source: require("../assets/icons/jellyfish.png") },
  { id: 30, source: require("../assets/icons/ladybug.png") },
  { id: 31, source: require("../assets/icons/monkey.png") },
  { id: 32, source: require("../assets/icons/mouse.png") },
  { id: 33, source: require("../assets/icons/octopus.png") },
  { id: 34, source: require("../assets/icons/owl.png") },
  { id: 35, source: require("../assets/icons/parrot.png") },
  { id: 36, source: require("../assets/icons/penguin.png") },
  { id: 37, source: require("../assets/icons/pig.png") },
  { id: 38, source: require("../assets/icons/pony.png") },
  { id: 39, source: require("../assets/icons/seahorse.png") },
  { id: 40, source: require("../assets/icons/seal.png") },
  { id: 41, source: require("../assets/icons/shark.png") },
  { id: 42, source: require("../assets/icons/sheep.png") },
  { id: 43, source: require("../assets/icons/sloth.png") },
  { id: 44, source: require("../assets/icons/snail.png") },
  { id: 45, source: require("../assets/icons/snake.png") },
  { id: 46, source: require("../assets/icons/squirrel.png") },
  { id: 47, source: require("../assets/icons/stingray.png") },
  { id: 48, source: require("../assets/icons/tiger.png") },
  // { id: 49, source: require("../assets/icons/panda.png") },
  // { id: 50, source: require("../assets/icons/axolotl.png") },
];

function SignUp() {
  const [selectedAvatar, setSelectedAvatar] = useState<
    { id: number; source: any } | undefined
  >();
  const [isModalVisible, setModalVisible] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, formState } = useForm();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      const userDocRef = doc(db, "user", user.uid);
      await setDoc(userDocRef, {
        email: data.email,
        nickname: data.nickname,
        hobbies: data.listHobbies,
        avatar: selectedAvatar ? selectedAvatar.id : null,
        uid: user.uid,
        moods: [],
        thoughts: [],
        messagesReceived: [],
        messageLeft: 10,
        score: 0,
        messageLastSent: "",
      });
    } catch (error) {
      console.error("Error creating user: ", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ImageBackground
      source={require("../assets/images/signupCloud.png")}
      style={styles.background}
    >
      <ScrollView>
        <Text style={[styles.title, globalFont.Nunito]}>Get Started!</Text>
        <Text style={[styles.subtitle1, globalFont.Montserrat]}>
          Put your email and password to create an account!
        </Text>

        <Text style={[styles.fields, globalFont.Nunito]}>
          What is your Username/Email?
        </Text>
        <Controller
          control={control}
          name="email"
          rules={{ required: "Please enter your email" }}
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter an email address..."
            />
          )}
        />
        {typeof formState.errors.email?.message === "string" && (
          <Text style={styles.error}>{formState.errors.email?.message}</Text>
        )}

        <Text style={[styles.fields, globalFont.Nunito]}>
          What is your password?
        </Text>
        <View style={styles.passwordContainer}>
          <Controller
            control={control}
            name="password"
            rules={{ required: "Please enter a password" }}
            render={({ field: { onBlur, onChange, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={!showPassword}
              />
            )}
          />

          <TouchableOpacity
            style={styles.visibilityButton}
            onPress={togglePasswordVisibility}
          >
            <AntDesign
              name={showPassword ? "eyeo" : "eye"}
              size={24}
              color="#ccc"
            />
          </TouchableOpacity>
        </View>
        {typeof formState.errors.password?.message === "string" && (
          <Text style={styles.error}>{formState.errors.password?.message}</Text>
        )}

        <Text style={[styles.subtitle2, globalFont.Montserrat]}>
          Now, let’s learn a little bit about you!
        </Text>

        <Text style={[styles.fields, globalFont.Nunito]}>
          What is your nickname?
        </Text>
        <Controller
          control={control}
          name="nickname"
          rules={{ required: "Please enter a nickname" }}
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {typeof formState.errors.nickname?.message === "string" && (
          <Text style={styles.error}>{formState.errors.nickname?.message}</Text>
        )}

        <Text style={[styles.fields, globalFont.Nunito]}>
          List some of your hobbies!
        </Text>
        <Controller
          control={control}
          name="listHobbies"
          rules={{ required: "Please list your hobbies" }}
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {typeof formState.errors.listHobbies?.message === "string" && (
          <Text style={styles.error}>
            {formState.errors.listHobbies?.message}
          </Text>
        )}

        <Text style={[styles.fields, globalFont.Nunito]}>
          Choose your avatar!
        </Text>
        <TouchableOpacity
          style={styles.dropdownContainer}
          onPress={() => setModalVisible(true)}
        >
          {selectedAvatar ? (
            <Image source={selectedAvatar.source} />
          ) : (
            <Text style={styles.avatarText}>Click to select an avatar!</Text>
          )}
        </TouchableOpacity>
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPressOut={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <FlatList
                data={avatars}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedAvatar(item);
                      setModalVisible(false);
                    }}
                    style={styles.avatarTouchable}
                  >
                    <Image source={item.source} style={styles.avatar} />
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
                numColumns={4}
                contentContainerStyle={styles.flatListContent}
              />
            </View>
          </TouchableOpacity>
        </Modal>
        <TouchableOpacity
          style={styles.submitContainer}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={[styles.submitText, globalFont.Nunito]}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.linkContainer}>
          <Link href="/signIn" style={[styles.link, globalFont.Montserrat]}>
            Already have an account? <Link href="login">Log In</Link>
          </Link>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "space-between",
    resizeMode: "cover",
  },

  title: {
    color: "#0C3154",
    fontSize: 47,
    fontFamily: "Nunito",
    fontWeight: "700",
    lineHeight: 50,
    alignSelf: "center",
    // marginTop: -hp("7%"),
    // height: "20%",
    marginTop: hp("5%"),
  },

  subtitle1: {
    color: "#0D1821",
    fontSize: 20,
    fontFamily: "Montserrat",
    fontWeight: "600",
    lineHeight: 20,
    textAlign: "center",
    marginTop: hp("3%"),
    width: "60%",
    alignSelf: "center",
    marginBottom: hp("1.5%"),
  },

  subtitle2: {
    color: "#0D1821",
    fontSize: 20,
    fontFamily: "Montserrat",
    fontWeight: "600",
    lineHeight: 20,
    textAlign: "center",
    marginTop: hp("3%"),
    width: "60%",
    alignSelf: "center",
    marginBottom: hp("4%"),
  },

  fields: {
    color: "#4F759B",
    fontSize: 16,
    fontFamily: "Nunito",
    fontWeight: "700",
    width: "85%",
    alignSelf: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#BFD7EA",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    fontFamily: "Montserrat",
    backgroundColor: "white",
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
  },

  error: {
    color: "red",
    marginBottom: 6,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    marginLeft: 33,
  },

  linkContainer: {
    marginTop: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },

  link: {
    color: "blue",
    textAlign: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },

  avatar: {
    width: 50,
    height: 50,
    margin: 5,
  },

  avatarText: {
    fontFamily: "Montserrat",
    color: "#ccc",
    justifyContent: "flex-start",
  },

  avatarTouchable: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    padding: 3,
  },

  dropdownContainer: {
    margin: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#BFD7EA",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "85%",
    backgroundColor: "white",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    backgroundColor: "white",
    width: "80%",
    padding: 5,
    borderRadius: 10,
    maxHeight: "60%",
    justifyContent: "space-evenly",
  },

  flatListContent: {
    justifyContent: "space-between",
    alignItems: "center",
  },

  submitContainer: {
    borderWidth: 1,
    borderColor: "#BFD7EA",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#4F759B",
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
  },

  submitText: {
    color: "white",
    fontSize: 25,
    fontFamily: "Nunito",
    fontWeight: "600",
    lineHeight: 40,
    alignSelf: "center",
    top: -5,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  visibilityButton: {
    position: "absolute",
    right: 35,
    top: 19,
  },
});

export default SignUp;
