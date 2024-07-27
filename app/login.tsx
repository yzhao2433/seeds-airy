import { AuthError, signInWithEmailAndPassword } from "firebase/auth";
import { useForm, Controller } from "react-hook-form";
import {
  View,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { auth } from "./firebase";
import { Link, router } from "expo-router";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import globalFont from "../styles/globalfont";
import { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

interface FormValues {
  email: string;
  password: string;
}

const defaultValues: FormValues = {
  email: "",
  password: "",
};

function Login() {
  const { control, formState, handleSubmit } = useForm<FormValues>({
    defaultValues,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (values: FormValues) => {
    console.log(values);
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      console.log(user);
      router.navigate("./(tabs)");
    } catch (e) {
      const error = e as AuthError;
      if (error.code === "auth/invalid-credential") {
        setErrorMessage("Incorrect username or password. Please try again.");
      } else {
        setErrorMessage("An error has occured. Please try again.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require("@/assets/images/login_background.png")}
        style={styles.background}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Icon name="arrow-back" size={30} color="#0C3154" />
        </TouchableOpacity>

        <Text style={[styles.welcomeText, globalFont.Nunito]}>
          Welcome back!
        </Text>

        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="email"
              rules={{ required: "Please enter an email address" }}
              render={({ field: { onBlur, onChange, value } }) => (
                <TextInput
                  style={[styles.input, globalFont.Montserrat]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Email"
                  placeholderTextColor="#aaa"
                  value={value}
                  autoCapitalize="none"
                />
              )}
            />
            {formState.errors.email && (
              <Text style={styles.errorText}>
                {formState.errors.email.message}
              </Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Controller
              control={control}
              name="password"
              rules={{ required: "Enter your password" }}
              render={({ field: { onBlur, onChange, value } }) => (
                <TextInput
                  style={[styles.input, globalFont.Montserrat]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Password"
                  placeholderTextColor="#aaa"
                  value={value}
                  secureTextEntry={!showPassword}
                />
              )}
            />
            {formState.errors.password && (
              <Text style={styles.errorText}>
                {formState.errors.password.message}
              </Text>
            )}
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

          {errorMessage && (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          )}

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={[styles.loginButtonText, globalFont.Nunito]}>
              Login
            </Text>
          </TouchableOpacity>

          <Text style={styles.signup}>
            Don't have an account? <Link href="signup">Sign Up</Link>
          </Text>
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    position: "relative",
  },
  backIcon: {
    position: "absolute",
    top: "1%",
    left: 20,
  },
  welcomeText: {
    fontSize: 50,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#0C3154",
    paddingHorizontal: 50,
    fontFamily: "Montserrat",
    lineHeight: 55,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 10,
  },
  input: {
    height: 38,
    borderColor: "#CEE7FF",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginTop: 10,
    fontSize: 14,
    backgroundColor: "#fff",
    color: "#000",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
  loginButton: {
    width: "100%",
    height: 55,
    backgroundColor: "#4F759B",
    borderRadius: 8,
    borderColor: "#CEE7FF",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    marginBottom: "60%",
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "bold",
  },
  visibilityButton: {
    position: "absolute",
    right: 15,
    top: 19,
  },

  errorMessage: {
    color: "red",
    marginBottom: 5,
    marginLeft: -15,
    textAlign: "center",
  },

  signup: {
    textAlign: "center",
    marginBottom: hp("-5%"),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    color: "blue",
  },
});

export default Login;

// import { AuthError, signInWithEmailAndPassword } from "firebase/auth";
// import { useForm, Controller } from "react-hook-form";
// import { View, TextInput, Button, Text } from "react-native";
// import { auth } from "./firebase";
// import { Link } from "expo-router";

// interface FormValues {
//   email: string;
//   password: string;
// }

// const defaultValues: FormValues = {
//   email: "",
//   password: "",
// };

// function Login() {
//   const { control, formState, handleSubmit } = useForm<FormValues>({
//     defaultValues,
//   });

//   const onSubmit = async (values: FormValues) => {
//     console.log(values);
//     try {
//       const user = await signInWithEmailAndPassword(
//         auth,
//         values.email,
//         values.password
//       );
//       console.log(user);
//     } catch (e) {
//       const error = e as AuthError;
//       console.log(e);
//       // Display some feedback to user
//     }
//   };

//   return (
//     <View>
//       <Text>Email</Text>
//       <Controller
//         control={control}
//         name="email"
//         rules={{ required: "Please enter an email address" }}
//         render={({ field: { onBlur, onChange, value } }) => (
//           <TextInput
//             onBlur={onBlur}
//             onChangeText={onChange}
//             placeholder="Enter an email address"
//             value={value}
//           />
//         )}
//       />
//       {formState.errors.email && <Text>{formState.errors.email.message}</Text>}

//       <Text>Password</Text>
//       <Controller
//         control={control}
//         name="password"
//         rules={{ required: "Enter your password" }}
//         render={({ field: { onBlur, onChange, value } }) => (
//           <TextInput onBlur={onBlur} onChangeText={onChange} value={value} />
//         )}
//       />

//       <Button title="Log In" onPress={handleSubmit(onSubmit)} />
//       <Text style={{ textAlign: "center" }}>
//         Don't have an account? <Link href="signup">Sign Up</Link>
//       </Text>
//     </View>
//   );
// }

// export default Login;
