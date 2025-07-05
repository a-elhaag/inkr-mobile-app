import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { ComponentTokens, InkrTheme } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            height: ComponentTokens.tabBar.height,
            paddingBottom: ComponentTokens.tabBar.paddingBottom,
            borderTopWidth: 0,
            backgroundColor: InkrTheme.colors.surface,
            borderRadius: InkrTheme.borderRadius.full,
            marginHorizontal: InkrTheme.spacing.xl,
            marginBottom: InkrTheme.spacing.xl,
            ...InkrTheme.shadows.lg,
            overflow: 'hidden',
          },
          default: {
            position: 'absolute',
            height: ComponentTokens.tabBar.height,
            paddingBottom: ComponentTokens.tabBar.paddingBottom,
            borderTopWidth: 0,
            backgroundColor: InkrTheme.colors.surface,
            borderRadius: InkrTheme.borderRadius.full,
            marginHorizontal: InkrTheme.spacing.xl,
            marginBottom: InkrTheme.spacing.xl,
            ...InkrTheme.shadows.lg,
            overflow: 'hidden',
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="message.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="book.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
