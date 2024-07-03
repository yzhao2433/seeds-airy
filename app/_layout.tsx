// chat edits: https://chatgpt.com/share/63d551b2-6af7-470c-ba14-440e77c84d0d
// removed incomplete functions and added code from following article to debug navigating before mounting rootlayer:
//https://github.com/expo/router/issues/740#issuecomment-1625033355
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import {
  Stack,
  useRouter,
  useFocusEffect,
  useRootNavigationState,
} from "expo-router"; // Correct import for useRouter
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

import { useColorScheme } from "@/hooks/useColorScheme";
import { auth } from "./firebase";
import { SafeAreaView, Text } from "react-native";
import login from "./login";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [user, setUser] = useState(auth.currentUser);
  const router = useRouter(); // Correct usage of useRouter

  const [isNavigationReady, setNavigationReady] = useState(false);
  const rootNavigation = useNavigation();

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

  useEffect(() => {
    const unsubscribe = rootNavigation?.addListener("state", (event) => {
      // console.log("INFO: rootNavigation?.addListener('state')", event);
      setNavigationReady(true);
    });
    return function cleanup() {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [rootNavigation]);

  useEffect(() => {
    if (!isNavigationReady) {
      return;
    }

    if (!user) {
      router.replace("/login");
    } else {
      router.replace("/");
    }
  }, [isNavigationReady, user, router]);

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        router.replace("/login");
      } else {
        router.replace("/");
      }
    }, [user, router])
  );

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={{ marginTop: 30, flex: 1 }}>
        {user ? (
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        ) : (
          <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
          </Stack>
        )}
      </SafeAreaView>
    </ThemeProvider>
  );
}
