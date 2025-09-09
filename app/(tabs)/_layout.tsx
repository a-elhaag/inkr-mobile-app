import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { ComponentTokens, InkrTheme } from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            height: ComponentTokens.tabBar.height,
            paddingBottom: ComponentTokens.tabBar.paddingBottom,
            borderTopWidth: 1,
            borderTopColor: InkrTheme.colors.divider,
            backgroundColor: InkrTheme.colors.surface,
          },
          default: {
            height: ComponentTokens.tabBar.height,
            paddingBottom: ComponentTokens.tabBar.paddingBottom,
            borderTopWidth: 1,
            borderTopColor: InkrTheme.colors.divider,
            backgroundColor: InkrTheme.colors.surface,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Notes",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="note.text" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "AI Chat",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="message.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="gearshape.fill" color={color} />
          ),
        }}
      />
      {/* Hidden screens to prevent tab bar display */}
      <Tabs.Screen name="add" options={{ href: null }} />
      <Tabs.Screen name="mindmap" options={{ href: null }} />
      <Tabs.Screen name="library" options={{ href: null }} />
      <Tabs.Screen name="stats" options={{ href: null }} />
      <Tabs.Screen name="note/[id]" options={{ href: null }} />
    </Tabs>
  );
}
