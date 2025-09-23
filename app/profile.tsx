import { IconSymbol } from "@/components/ui/IconSymbol";
import { InkrButton } from "@/components/ui/InkrButton";
import { InkrCard } from "@/components/ui/InkrCard";
import { HIT_SLOP_8 } from "@/components/ui/touchable";
import { InkrTheme } from "@/constants/Theme";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface UserProfile {
  name: string;
  age: string;
  gender: "M" | "F" | "Prefer not to say" | "";
  email: string;
  photo: string | null;
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    age: "",
    gender: "",
    email: "",
    photo: null,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Here you would save to local storage or your preferred storage method
    setIsEditing(false);
    Alert.alert("Profile Updated", "Your profile has been saved successfully.");
  };

  const handlePhotoUpload = () => {
    Alert.alert("Upload Photo", "Choose how you would like to add your photo", [
      { text: "Camera", onPress: () => console.log("Camera selected") },
      { text: "Photo Library", onPress: () => console.log("Library selected") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const firstName = profile.name.split(" ")[0];

    if (hour < 12) return `Good morning, ${firstName}!`;
    if (hour < 17) return `Good afternoon, ${firstName}!`;
    return `Good evening, ${firstName}!`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={HIT_SLOP_8}
        >
          <IconSymbol
            name="chevron.left"
            size={24}
            color={InkrTheme.colors.text.main}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          onPress={() => setIsEditing(!isEditing)}
          style={styles.editButton}
          hitSlop={HIT_SLOP_8}
        >
          <IconSymbol
            name={isEditing ? "checkmark" : "pencil"}
            size={24}
            color={InkrTheme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <InkrCard style={styles.greetingCard}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.greetingSubtext}>
            Your personal AI companion is here to help you remember and organize
            your thoughts.
          </Text>
        </InkrCard>

        <InkrCard style={styles.profileCard}>
          <View style={styles.photoSection}>
            <TouchableOpacity
              style={styles.photoContainer}
              onPress={isEditing ? handlePhotoUpload : undefined}
            >
              {profile.photo ? (
                <Image
                  source={{ uri: profile.photo }}
                  style={styles.profilePhoto}
                />
              ) : (
                <View style={styles.placeholderPhoto}>
                  <IconSymbol
                    name="person.circle.fill"
                    size={60}
                    color={InkrTheme.colors.text.muted}
                  />
                </View>
              )}
              {isEditing && (
                <View style={styles.photoOverlay}>
                  <IconSymbol
                    name="camera"
                    size={24}
                    color={InkrTheme.colors.text.inverse}
                  />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Name</Text>
              <TextInput
                value={profile.name}
                onChangeText={(text) =>
                  setProfile((prev) => ({ ...prev, name: text }))
                }
                placeholder="Enter your name"
                placeholderTextColor={InkrTheme.colors.text.muted}
                editable={isEditing}
                style={[
                  styles.textInput,
                  !isEditing && styles.textInputDisabled,
                ]}
                returnKeyType="done"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Age</Text>
              <TextInput
                value={profile.age}
                onChangeText={(text) =>
                  setProfile((prev) => ({ ...prev, age: text }))
                }
                placeholder="Enter your age"
                placeholderTextColor={InkrTheme.colors.text.muted}
                keyboardType="numeric"
                editable={isEditing}
                style={[
                  styles.textInput,
                  !isEditing && styles.textInputDisabled,
                ]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Gender</Text>
              {isEditing ? (
                <View style={styles.genderOptions}>
                  {["M", "F", "Prefer not to say"].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.genderOption,
                        profile.gender === option &&
                          styles.genderOptionSelected,
                      ]}
                      onPress={() =>
                        setProfile((prev) => ({
                          ...prev,
                          gender: option as any,
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.genderOptionText,
                          profile.gender === option &&
                            styles.genderOptionTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.readonlyValueWrapper}>
                  <Text style={styles.readonlyValue}>
                    {profile.gender || "Not specified"}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Email</Text>
              <TextInput
                value={profile.email}
                onChangeText={(text) =>
                  setProfile((prev) => ({ ...prev, email: text }))
                }
                placeholder="Enter your email"
                placeholderTextColor={InkrTheme.colors.text.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={isEditing}
                style={[
                  styles.textInput,
                  !isEditing && styles.textInputDisabled,
                ]}
              />
            </View>
          </View>

          {isEditing && (
            <View style={styles.buttonSection}>
              <InkrButton
                title="Save Changes"
                onPress={handleSave}
                style={styles.saveButton}
              />
              <InkrButton
                title="Cancel"
                onPress={() => setIsEditing(false)}
                variant="outline"
                style={styles.cancelButton}
              />
            </View>
          )}
        </InkrCard>

        <InkrCard style={styles.privacyCard}>
          <View style={styles.privacyHeader}>
            <IconSymbol
              name="shield.fill"
              size={24}
              color={InkrTheme.colors.success}
            />
            <Text style={styles.privacyTitle}>Privacy & Data</Text>
          </View>
          <Text style={styles.privacyText}>
            • All personal information is stored locally on your device{"\n"}•
            We don't collect or share your personal data by default{"\n"}• Your
            information is used only to personalize your experience{"\n"}• You
            can delete all data anytime in Settings
          </Text>
        </InkrCard>

        <InkrCard style={styles.personalizationCard}>
          <View style={styles.personalizationHeader}>
            <IconSymbol
              name="sparkles"
              size={24}
              color={InkrTheme.colors.primary}
            />
            <Text style={styles.personalizationTitle}>
              Personalization Features
            </Text>
          </View>
          <Text style={styles.personalizationText}>
            With your profile information, Inkr can:{"\n\n"}• Greet you
            personally throughout the day{"\n"}• Provide age-appropriate content
            suggestions{"\n"}• Customize the interface to your preferences{"\n"}
            • Remember your communication style
          </Text>
        </InkrCard>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: InkrTheme.spacing.lg,
    paddingVertical: InkrTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: InkrTheme.colors.divider,
    backgroundColor: InkrTheme.colors.surface,
  },

  backButton: {
    padding: InkrTheme.spacing.sm,
  },

  headerTitle: {
    fontSize: InkrTheme.typography.sizes.xl,
    fontWeight: InkrTheme.typography.weights.semibold,
    color: InkrTheme.colors.text.main,
  },

  editButton: {
    padding: InkrTheme.spacing.sm,
  },

  content: {
    flex: 1,
    paddingHorizontal: InkrTheme.spacing.md,
  },

  greetingCard: {
    marginTop: InkrTheme.spacing.md,
    backgroundColor: InkrTheme.colors.primary + "05",
    borderColor: InkrTheme.colors.primary + "20",
    borderWidth: 1,
  },

  greeting: {
    fontSize: InkrTheme.typography.sizes.title,
    fontWeight: InkrTheme.typography.weights.bold,
    color: InkrTheme.colors.primary,
    marginBottom: InkrTheme.spacing.sm,
  },

  greetingSubtext: {
    fontSize: InkrTheme.typography.sizes.base,
    color: InkrTheme.colors.text.main,
    lineHeight:
      InkrTheme.typography.lineHeights.relaxed *
      InkrTheme.typography.sizes.base,
  },

  profileCard: {
    marginTop: InkrTheme.spacing.lg,
  },

  photoSection: {
    alignItems: "center",
    marginBottom: InkrTheme.spacing.xl,
  },

  photoContainer: {
    position: "relative",
  },

  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  placeholderPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: InkrTheme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: InkrTheme.colors.border,
  },

  photoOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: InkrTheme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: InkrTheme.colors.surface,
  },

  formSection: {
    gap: InkrTheme.spacing.lg,
  },

  inputGroup: {
    gap: InkrTheme.spacing.sm,
  },

  label: {
    fontSize: InkrTheme.typography.sizes.base,
    fontWeight: InkrTheme.typography.weights.medium,
    color: InkrTheme.colors.text.main,
  },
  fieldLabel: {
    fontSize: InkrTheme.typography.sizes.sm,
    fontWeight: InkrTheme.typography.weights.semibold,
    color: InkrTheme.colors.text.muted,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  textInput: {
    borderWidth: 1,
    borderColor: InkrTheme.colors.border,
    backgroundColor: InkrTheme.colors.surface,
    borderRadius: InkrTheme.borderRadius.lg,
    paddingHorizontal: InkrTheme.spacing.md,
    paddingVertical: InkrTheme.spacing.sm + 2,
    fontSize: InkrTheme.typography.sizes.base,
    color: InkrTheme.colors.text.main,
  },

  textInputDisabled: {
    backgroundColor: InkrTheme.colors.background,
    opacity: 0.7,
  },

  readonlyValueWrapper: {
    borderWidth: 1,
    borderColor: InkrTheme.colors.border,
    backgroundColor: InkrTheme.colors.background,
    borderRadius: InkrTheme.borderRadius.lg,
    paddingHorizontal: InkrTheme.spacing.md,
    paddingVertical: InkrTheme.spacing.sm + 2,
  },

  readonlyValue: {
    fontSize: InkrTheme.typography.sizes.base,
    color: InkrTheme.colors.text.main,
  },

  disabledInput: {
    backgroundColor: InkrTheme.colors.background,
    opacity: 0.7,
  },

  genderOptions: {
    flexDirection: "row",
    gap: InkrTheme.spacing.sm,
  },

  genderOption: {
    flex: 1,
    paddingVertical: InkrTheme.spacing.md,
    paddingHorizontal: InkrTheme.spacing.lg,
    borderRadius: InkrTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: InkrTheme.colors.border,
    alignItems: "center",
  },

  genderOptionSelected: {
    backgroundColor: InkrTheme.colors.primary,
    borderColor: InkrTheme.colors.primary,
  },

  genderOptionText: {
    fontSize: InkrTheme.typography.sizes.base,
    fontWeight: InkrTheme.typography.weights.medium,
    color: InkrTheme.colors.text.main,
  },

  genderOptionTextSelected: {
    color: InkrTheme.colors.text.inverse,
  },

  buttonSection: {
    marginTop: InkrTheme.spacing.xl,
    gap: InkrTheme.spacing.md,
  },

  saveButton: {
    backgroundColor: InkrTheme.colors.success,
  },

  cancelButton: {
    borderColor: InkrTheme.colors.text.muted,
  },

  privacyCard: {
    marginTop: InkrTheme.spacing.lg,
    backgroundColor: InkrTheme.colors.success + "05",
    borderColor: InkrTheme.colors.success + "20",
    borderWidth: 1,
  },

  privacyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: InkrTheme.spacing.md,
    gap: InkrTheme.spacing.sm,
  },

  privacyTitle: {
    fontSize: InkrTheme.typography.sizes.lg,
    fontWeight: InkrTheme.typography.weights.semibold,
    color: InkrTheme.colors.text.main,
  },

  privacyText: {
    fontSize: InkrTheme.typography.sizes.base,
    color: InkrTheme.colors.text.main,
    lineHeight:
      InkrTheme.typography.lineHeights.relaxed *
      InkrTheme.typography.sizes.base,
  },

  personalizationCard: {
    marginTop: InkrTheme.spacing.lg,
    marginBottom: InkrTheme.spacing.xl,
    backgroundColor: InkrTheme.colors.primary + "05",
    borderColor: InkrTheme.colors.primary + "20",
    borderWidth: 1,
  },

  personalizationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: InkrTheme.spacing.md,
    gap: InkrTheme.spacing.sm,
  },

  personalizationTitle: {
    fontSize: InkrTheme.typography.sizes.lg,
    fontWeight: InkrTheme.typography.weights.semibold,
    color: InkrTheme.colors.text.main,
  },

  personalizationText: {
    fontSize: InkrTheme.typography.sizes.base,
    color: InkrTheme.colors.text.main,
    lineHeight:
      InkrTheme.typography.lineHeights.relaxed *
      InkrTheme.typography.sizes.base,
  },
});
