import { IconSymbol } from "@/components/ui/IconSymbol";
import { NoteEditor } from "@/components/ui/NoteEditor";
import { InkrTheme } from "@/constants/Theme";
import { storageService } from "@/services/storage";
import { Note } from "@/types/models";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import uuid from "react-native-uuid";

// Add note screen launched via FAB (not a tab anymore)
export default function AddNoteScreen() {
  const handleSave = async (data: {
    title: string;
    content: string;
    tags: string[];
    summary?: string;
  }) => {
    const note: Note = {
      id: uuid.v4() as string,
      title: data.title.trim(),
      content: data.content,
      summary: data.summary,
      tags: data.tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isStarred: false,
    };
    await storageService.saveNote(note);
    router.back();
  };

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Close new note"
        >
          <IconSymbol
            name="chevron.left"
            size={24}
            color={InkrTheme.colors.text.main}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Note</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}>
        <NoteEditor onSave={handleSave} autoFocus variant="create" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: InkrTheme.colors.background },
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
  headerTitle: {
    fontSize: InkrTheme.typography.sizes.lg,
    fontWeight: InkrTheme.typography.weights.semibold,
    color: InkrTheme.colors.text.main,
  },
  content: {
    flex: 1,
    paddingHorizontal: InkrTheme.spacing.lg,
    paddingTop: InkrTheme.spacing.lg,
  },
});
