import { Button, Share, Text, TextInput, View } from "react-native";
import { AuthError, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth } from "./firebase";
import { app } from "./firebase";
import { Controller, useForm } from "react-hook-form";
import { Link } from "expo-router";

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

function SignUp() {
  const { control, formState, handleSubmit, setError } = useForm<FormValues>({
    defaultValues,
  });

  const onSubmit = async (values: FormValues) => {
    console.log(values);
    try {
      // add user to auth
      const user = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      // create a new user document to add a new user to the "user" collection
      const newUser = {
        uid: user.user.uid,
        messageLeft: 10,
        // need to edit
        avatar: "blank",
        nickname: values.nickname,
        hobbies: values.listHobbies,
        moods: [],
        thoughts: [],
        messagesReceived: [],
      };
      const newUserRef = doc(db, "user", user.user.uid);
      await setDoc(newUserRef, newUser);

      console.log("User added with ID: ", user.user.uid);
    } catch (error) {
      console.error("Error adding user: ", error);
      // if (error instanceof AuthError) {
      //   setError("email", { message: error.message });
      // } else {
      //   setError("general", { message: "An unexpected error occurred" });
      // }
    }
  };

  console.log(formState.errors);

  return (
    <View>
      <Text>Email</Text>
      <Controller
        control={control}
        name="email"
        rules={{ required: "Please enter an email address" }}
        render={({ field: { onBlur, onChange, value } }) => (
          <TextInput
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Enter an email address"
            value={value}
          />
        )}
      />
      {formState.errors.email && <Text>{formState.errors.email.message}</Text>}

      <Text>Password</Text>
      <Controller
        control={control}
        name="password"
        rules={{ required: true, minLength: 6 }}
        render={({ field: { onBlur, onChange, value } }) => (
          <TextInput onBlur={onBlur} onChangeText={onChange} value={value} />
        )}
      />

      <Text>Preferred Nickname</Text>
      <Controller
        control={control}
        name="nickname"
        rules={{ required: true, minLength: 2 }}
        render={({ field: { onBlur, onChange, value } }) => (
          <TextInput onBlur={onBlur} onChangeText={onChange} value={value} />
        )}
      />

      <Text>Hobbies</Text>
      <Controller
        control={control}
        name="listHobbies"
        rules={{ required: true, minLength: 2 }}
        render={({ field: { onBlur, onChange, value } }) => (
          <TextInput onBlur={onBlur} onChangeText={onChange} value={value} />
        )}
      />

      <Button title="Sign Up" onPress={handleSubmit(onSubmit)} />
      <Text style={{ textAlign: "center" }}>
        Already have an account? <Link href="login">Log In</Link>
      </Text>
    </View>
  );
}

export default SignUp;
