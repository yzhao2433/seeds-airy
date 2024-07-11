// npm install react-native-vector-icons
// npm i --save-dev @types/react-native-vector-icons
import { Tabs } from "expo-router";
import React from "react";
import { View, StyleSheet } from "react-native";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 55,
            justifyContent: "center",
            paddingBottom: -0,
            marginBottom: 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
                style={styles.icon}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="leaderboard"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons
                name="leaderboard"
                size={33}
                color={color}
                style={styles.icon}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="message"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "paper-plane" : "paper-plane-outline"}
                color={color}
                style={styles.icon}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  icon: {
    marginBottom: -25,
  },
});
