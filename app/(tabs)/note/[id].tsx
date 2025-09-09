import { IconSymbol } from "@/components/ui/IconSymbol";
import { NoteEditor } from "@/components/ui/NoteEditor";
import { InkrTheme } from "@/constants/Theme";
import { storageService } from "@/services/storage";
import { Note } from "@/types/models";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import uuid from "react-native-uuid";

export default function EditNoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      const found = await storageService.getNote(id);
      setNote(found || null);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleSave = async (data: {
    title: string;
    content: string;
    tags: string[];
    summary?: string;
  }) => {
    try {
      const existing = note;
      const updated: Note = {
        id: existing?.id || (uuid.v4() as string),
        title: data.title,
        content: data.content,
        summary: data.summary,
        tags: data.tags,
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isStarred: existing?.isStarred || false,
      };
      await storageService.saveNote(updated);
      router.back();
    } catch (e) {
      Alert.alert("Save failed", "Could not update note");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol
            name="chevron.left"
            size={24}
            color={InkrTheme.colors.text.main}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {note ? "Edit Note" : "New Note"}
        </Text>
        <View style={{ width: 24 }} />
      </View>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={InkrTheme.colors.primary} />
        </View>
      ) : (
        <View style={styles.content}>
          <NoteEditor
            initial={note || undefined}
            onSave={handleSave}
            variant={note ? "edit" : "create"}
            autoFocus={!note}
          />
        </View>
      )}
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
  loader: { flex: 1, alignItems: "center", justifyContent: "center" },
});
