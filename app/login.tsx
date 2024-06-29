import { AuthError, signInWithEmailAndPassword } from "firebase/auth";
import { useForm, Controller } from "react-hook-form";
import { View, TextInput, Button, Text } from "react-native";
import { auth } from "./firebase";
import { Link } from "expo-router";

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

  const onSubmit = async (values: FormValues) => {
    console.log(values);
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      console.log(user);
    } catch (e) {
      const error = e as AuthError;
      console.log(e);
      // Display some feedback to user
    }
  };

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
        rules={{ required: "Enter your password" }}
        render={({ field: { onBlur, onChange, value } }) => (
          <TextInput onBlur={onBlur} onChangeText={onChange} value={value} />
        )}
      />

      <Button title="Log In" onPress={handleSubmit(onSubmit)} />
      <Text style={{textAlign: 'center'}}>
        Don't have an account? <Link href="signup">Sign Up</Link>
      </Text>
    </View>
  );
}

export default Login;
