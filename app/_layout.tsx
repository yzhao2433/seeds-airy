import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import {
  Stack,
  router,
  useFocusEffect,
  useRootNavigationState,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { auth } from "./firebase";
import { SafeAreaView, Text } from "react-native";
import Login from "./login";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const navigationState = useRootNavigationState();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Montserrat: require("../assets/fonts/Montserrat-Light.ttf"),
    Nunito: require("../assets/fonts/Nunito-Bold.ttf"),
  });
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!navigationState?.key) return;

      if (!user) {
        router.replace("/features");
      } else {
        router.replace("/");
      }
    }, [user, navigationState?.key])
  );

  if (!loaded) {
    return null;
  }

  console.log(user);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={{ flex: 1 }}>
        {user ? (
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="received" options={{ headerShown: false }} />
            <Stack.Screen name="features" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
          </Stack>
        ) : (
          <Stack>
            {/* <Stack.Screen name="starting" options={{ headerShown: false }} /> */}
            <Stack.Screen name="features" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
          </Stack>
        )}
      </SafeAreaView>
    </ThemeProvider>
  );
}
