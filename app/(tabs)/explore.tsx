import { IconSymbol } from '@/components/ui/IconSymbol';
import { InkrButton } from '@/components/ui/InkrButton';
import { InkrCard } from '@/components/ui/InkrCard';
import { InkrTheme } from '@/constants/Theme';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

const SETTINGS_SECTIONS = [
  {
    title: 'Account',
    items: [
      { id: 'profile', title: 'Profile', icon: 'person.circle.fill' as const, action: 'navigate' },
      { id: 'subscription', title: 'Subscription', icon: 'creditcard.fill' as const, action: 'navigate' },
      { id: 'data', title: 'Data & Privacy', icon: 'shield.fill' as const, action: 'navigate' },
    ],
  },
  {
    title: 'App Settings',
    items: [
      { id: 'notifications', title: 'Notifications', icon: 'bell.fill' as const, action: 'toggle', enabled: true },
      { id: 'haptics', title: 'Haptic Feedback', icon: 'hand.tap.fill' as const, action: 'toggle', enabled: true },
      { id: 'autoBackup', title: 'Auto Backup', icon: 'icloud.fill' as const, action: 'toggle', enabled: false },
    ],
  },
  {
    title: 'Help & Support',
    items: [
      { id: 'help', title: 'Help Center', icon: 'questionmark.circle.fill' as const, action: 'navigate' },
      { id: 'feedback', title: 'Send Feedback', icon: 'envelope.fill' as const, action: 'navigate' },
      { id: 'about', title: 'About Inkr', icon: 'info.circle.fill' as const, action: 'navigate' },
    ],
  },
];

export default function SettingsScreen() {
  const [toggleStates, setToggleStates] = useState({
    notifications: true,
    haptics: true,
    autoBackup: false,
  });

  const handleToggle = (settingId: string) => {
    setToggleStates(prev => ({
      ...prev,
      [settingId]: !prev[settingId as keyof typeof prev],
    }));
  };

  const handleSettingPress = (item: any) => {
    if (item.action === 'toggle') {
      handleToggle(item.id);
    } else {
      console.log('Navigate to:', item.title);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => console.log('Signing out...') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your Inkr experience</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <InkrCard style={styles.profileCard}>
          <View style={styles.profileContent}>
            <View style={styles.avatar}>
              <IconSymbol name="person.fill" size={32} color={InkrTheme.colors.text.inverse} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>John Doe</Text>
              <Text style={styles.profileEmail}>john.doe@example.com</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={InkrTheme.colors.text.muted} />
          </View>
        </InkrCard>

        {SETTINGS_SECTIONS.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <InkrCard style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <View key={item.id}>
                  <InkrCard
                    style={styles.settingItem}
                    onPress={() => handleSettingPress(item)}
                    variant="outlined"
                  >
                    <View style={styles.settingContent}>
                      <View style={styles.settingLeft}>
                        <View style={[styles.settingIcon, { backgroundColor: InkrTheme.colors.primary + '15' }]}>
                          <IconSymbol name={item.icon} size={20} color={InkrTheme.colors.primary} />
                        </View>
                        <Text style={styles.settingTitle}>{item.title}</Text>
                      </View>
                      
                      {item.action === 'toggle' ? (
                        <Switch
                          value={toggleStates[item.id as keyof typeof toggleStates]}
                          onValueChange={() => handleToggle(item.id)}
                          trackColor={{
                            false: InkrTheme.colors.border,
                            true: InkrTheme.colors.primary + '40',
                          }}
                          thumbColor={
                            toggleStates[item.id as keyof typeof toggleStates]
                              ? InkrTheme.colors.primary
                              : InkrTheme.colors.text.muted
                          }
                        />
                      ) : (
                        <IconSymbol name="chevron.right" size={16} color={InkrTheme.colors.text.muted} />
                      )}
                    </View>
                  </InkrCard>
                  {itemIndex < section.items.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </InkrCard>
          </View>
        ))}

        <View style={styles.section}>
          <InkrButton
            title="Sign Out"
            onPress={handleSignOut}
            variant="outline"
            style={styles.signOutButton}
            textStyle={styles.signOutText}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Inkr v1.0.0</Text>
          <Text style={styles.footerText}>Made with ❤️ for better memory</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: InkrTheme.colors.background,
  },
  
  header: {
    paddingHorizontal: InkrTheme.spacing.lg,
    paddingVertical: InkrTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: InkrTheme.colors.divider,
    backgroundColor: InkrTheme.colors.surface,
  },
  
  headerTitle: {
    fontSize: InkrTheme.typography.sizes.title,
    fontWeight: InkrTheme.typography.weights.bold,
    color: InkrTheme.colors.text.main,
    textAlign: 'center',
  },
  
  headerSubtitle: {
    fontSize: InkrTheme.typography.sizes.sm,
    fontWeight: InkrTheme.typography.weights.medium,
    color: InkrTheme.colors.text.muted,
    textAlign: 'center',
    marginTop: InkrTheme.spacing.sm,
  },
  
  content: {
    flex: 1,
    paddingHorizontal: InkrTheme.spacing.md,
  },
  
  profileCard: {
    marginTop: InkrTheme.spacing.lg,
    marginBottom: InkrTheme.spacing.xl,
  },
  
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  avatar: {
    width: 60,
    height: 60,
    borderRadius: InkrTheme.borderRadius.full,
    backgroundColor: InkrTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: InkrTheme.spacing.lg,
  },
  
  profileInfo: {
    flex: 1,
  },
  
  profileName: {
    fontSize: InkrTheme.typography.sizes.xl,
    fontWeight: InkrTheme.typography.weights.semibold,
    color: InkrTheme.colors.text.main,
    marginBottom: InkrTheme.spacing.sm,
  },
  
  profileEmail: {
    fontSize: InkrTheme.typography.sizes.base,
    fontWeight: InkrTheme.typography.weights.regular,
    color: InkrTheme.colors.text.muted,
  },
  
  section: {
    marginBottom: InkrTheme.spacing.xl,
  },
  
  sectionTitle: {
    fontSize: InkrTheme.typography.sizes.lg,
    fontWeight: InkrTheme.typography.weights.semibold,
    color: InkrTheme.colors.text.main,
    marginBottom: InkrTheme.spacing.md,
    paddingHorizontal: InkrTheme.spacing.sm,
  },
  
  sectionCard: {
    padding: 0,
  },
  
  settingItem: {
    margin: 0,
    padding: InkrTheme.spacing.lg,
    borderRadius: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: InkrTheme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: InkrTheme.spacing.lg,
  },
  
  settingTitle: {
    fontSize: InkrTheme.typography.sizes.base,
    fontWeight: InkrTheme.typography.weights.medium,
    color: InkrTheme.colors.text.main,
    flex: 1,
  },
  
  divider: {
    height: 1,
    backgroundColor: InkrTheme.colors.divider,
    marginHorizontal: InkrTheme.spacing.lg,
  },
  
  signOutButton: {
    borderColor: InkrTheme.colors.error,
  },
  
  signOutText: {
    color: InkrTheme.colors.error,
  },
  
  footer: {
    alignItems: 'center',
    paddingVertical: InkrTheme.spacing.xl,
    marginBottom: 100, // Account for tab bar
  },
  
  footerText: {
    fontSize: InkrTheme.typography.sizes.sm,
    fontWeight: InkrTheme.typography.weights.regular,
    color: InkrTheme.colors.text.muted,
    marginBottom: InkrTheme.spacing.sm,
  },
});
