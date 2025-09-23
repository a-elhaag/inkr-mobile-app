import { IconSymbol } from "@/components/ui/IconSymbol";
import { InkrFAB } from "@/components/ui/InkrFAB";
import { HIT_SLOP_8 } from "@/components/ui/touchable";
import { InkrTheme } from "@/constants/Theme";
import { storageService } from "@/services/storage";
import { Note } from "@/types/models";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showPinned, setShowPinned] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const loadedNotes = await storageService.loadNotes();
      setNotes(loadedNotes);
    } catch (error) {
      Alert.alert("Error", "Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotes();
    setRefreshing(false);
  };

  const toggleStar = async (noteId: string) => {
    try {
      const updatedNotes = notes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              isStarred: !note.isStarred,
              updatedAt: new Date().toISOString(),
            }
          : note
      );
      setNotes(updatedNotes);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await storageService.saveNotes(updatedNotes);
    } catch (error) {
      Alert.alert("Error", "Failed to update note");
    }
  };

  const deleteNote = async (noteId: string) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await storageService.deleteNote(noteId);
            setNotes(notes.filter((note) => note.id !== noteId));
          } catch (error) {
            Alert.alert("Error", "Failed to delete note");
          }
        },
      },
    ]);
  };

  const filtered = useMemo(() => {
    if (!query.trim()) return notes;
    const q = query.toLowerCase();
    return notes.filter(
      (n) =>
        (n.title && n.title.toLowerCase().includes(q)) ||
        (n.content && n.content.toLowerCase().includes(q)) ||
        (n.summary && n.summary.toLowerCase().includes(q)) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [notes, query]);

  const pinned = useMemo(
    () =>
      filtered
        .filter((n) => n.isStarred)
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ),
    [filtered]
  );
  const unpinned = useMemo(
    () =>
      filtered
        .filter((n) => !n.isStarred)
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ),
    [filtered]
  );

  const sectionize = useCallback((list: Note[]) => {
    const now = new Date();
    const startOfDay = (d: Date) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dayMs = 86400000;
    const categories: { label: string; notes: Note[] }[] = [];
    const groups: Record<string, Note[]> = {};
    list.forEach((n) => {
      const updated = new Date(n.updatedAt);
      const diff = startOfDay(now).getTime() - startOfDay(updated).getTime();
      let key: string;
      if (diff === 0) key = "Today";
      else if (diff === dayMs) key = "Yesterday";
      else if (diff < 7 * dayMs) key = "This Week";
      else if (
        now.getMonth() === updated.getMonth() &&
        now.getFullYear() === updated.getFullYear()
      )
        key = "This Month";
      else key = "Earlier";
      if (!groups[key]) groups[key] = [];
      groups[key].push(n);
    });
    const order = ["Today", "Yesterday", "This Week", "This Month", "Earlier"];
    order.forEach((o) => {
      if (groups[o]) categories.push({ label: o, notes: groups[o] });
    });
    return categories;
  }, []);

  const unpinnedSections = useMemo(
    () => sectionize(unpinned),
    [unpinned, sectionize]
  );

  const formatRelative = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000; // seconds
    if (diff < 60) return "just now";
    if (diff < 3600) return Math.floor(diff / 60) + "m ago";
    if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
    const days = Math.floor(diff / 86400);
    if (days < 7) return days + "d ago";
    return date.toLocaleDateString();
  };

  const handleNewNote = () => router.push("/add");
  const handleNotePress = (noteId: string) => router.push(`/note/${noteId}`);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBarSpacer} />
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search"
            placeholderTextColor={InkrTheme.colors.text.muted}
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery("")}
              style={styles.clearSearchBtn}
              hitSlop={HIT_SLOP_8}
            >
              <IconSymbol
                name="xmark.circle.fill"
                size={16}
                color={InkrTheme.colors.text.muted}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.headerRow}>
        <Text style={styles.appTitle}>Notes</Text>
        <TouchableOpacity
          onPress={() => setShowPinned((s) => !s)}
          style={styles.topBarButton}
          hitSlop={HIT_SLOP_8}
        >
          <IconSymbol
            name={showPinned ? "pin.slash" : "pin"}
            size={18}
            color={InkrTheme.colors.primary}
          />
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={InkrTheme.colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {showPinned && pinned.length > 0 && (
            <View style={styles.sectionGroup}>
              <Text style={styles.sectionTitle}>Pinned</Text>
              {pinned.map((note) => (
                <TouchableOpacity
                  key={note.id}
                  style={styles.listItem}
                  onPress={() => handleNotePress(note.id)}
                >
                  <View style={styles.listItemHeader}>
                    <Text style={styles.listItemTitle} numberOfLines={1}>
                      {note.title || "Untitled"}
                    </Text>
                    <View style={styles.noteActions}>
                      <TouchableOpacity
                        onPress={() => toggleStar(note.id)}
                        style={styles.iconButton}
                        hitSlop={HIT_SLOP_8}
                      >
                        <IconSymbol
                          name={note.isStarred ? "star.fill" : "star"}
                          size={16}
                          color={
                            note.isStarred
                              ? InkrTheme.colors.warning
                              : InkrTheme.colors.text.muted
                          }
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => deleteNote(note.id)}
                        style={styles.iconButton}
                        hitSlop={HIT_SLOP_8}
                      >
                        <IconSymbol
                          name="trash"
                          size={16}
                          color={InkrTheme.colors.error}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.listItemPreview} numberOfLines={2}>
                    {note.summary || note.content}
                  </Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.noteDate}>
                      {formatRelative(note.updatedAt)}
                    </Text>
                    <View style={styles.tagsInline}>
                      {note.tags.slice(0, 3).map((t) => (
                        <Text key={t} style={styles.tagInline}>
                          #{t}
                        </Text>
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {unpinnedSections.map((section) => (
            <View key={section.label} style={styles.sectionGroup}>
              <Text style={styles.sectionTitle}>{section.label}</Text>
              {section.notes.map((note) => (
                <TouchableOpacity
                  key={note.id}
                  style={styles.listItem}
                  onPress={() => handleNotePress(note.id)}
                >
                  <View style={styles.listItemHeader}>
                    <Text style={styles.listItemTitle} numberOfLines={1}>
                      {note.title || "Untitled"}
                    </Text>
                    <View style={styles.noteActions}>
                      <TouchableOpacity
                        onPress={() => toggleStar(note.id)}
                        style={styles.iconButton}
                      >
                        <IconSymbol
                          name={note.isStarred ? "star.fill" : "star"}
                          size={16}
                          color={
                            note.isStarred
                              ? InkrTheme.colors.warning
                              : InkrTheme.colors.text.muted
                          }
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => deleteNote(note.id)}
                        style={styles.iconButton}
                      >
                        <IconSymbol
                          name="trash"
                          size={16}
                          color={InkrTheme.colors.error}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.listItemPreview} numberOfLines={2}>
                    {note.summary || note.content}
                  </Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.noteDate}>
                      {formatRelative(note.updatedAt)}
                    </Text>
                    <View style={styles.tagsInline}>
                      {note.tags.slice(0, 3).map((t) => (
                        <Text key={t} style={styles.tagInline}>
                          #{t}
                        </Text>
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {filtered.length === 0 && !loading && (
            <View style={styles.emptyState}>
              <IconSymbol
                name={query ? "magnifyingglass" : "square.and.pencil"}
                size={48}
                color={InkrTheme.colors.text.muted}
              />
              <Text style={styles.emptyTitle}>
                {query ? "No matches" : "No notes yet"}
              </Text>
              <Text style={styles.emptyDescription}>
                {query
                  ? "Try a different search term."
                  : "Create your first note."}
              </Text>
              {!query && (
                <TouchableOpacity
                  style={styles.emptyCTA}
                  onPress={handleNewNote}
                >
                  <IconSymbol
                    name="plus.circle.fill"
                    size={20}
                    color={InkrTheme.colors.text.inverse}
                  />
                  <Text style={styles.emptyCTAText}>New Note</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      )}

      <InkrFAB
        onPress={handleNewNote}
        icon={
          <IconSymbol
            name="plus"
            size={24}
            color={InkrTheme.colors.text.inverse}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: InkrTheme.colors.background },
  topBarSpacer: { height: InkrTheme.spacing.sm },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: InkrTheme.spacing.lg,
    marginBottom: InkrTheme.spacing.sm,
  },
  appTitle: {
    fontSize: InkrTheme.typography.sizes.title,
    fontWeight: InkrTheme.typography.weights.bold,
    color: InkrTheme.colors.text.main,
  },
  topBarButton: {
    padding: InkrTheme.spacing.sm,
    borderRadius: InkrTheme.borderRadius.full,
  },
  searchWrapper: {
    paddingHorizontal: InkrTheme.spacing.lg,
    marginBottom: InkrTheme.spacing.sm,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: InkrTheme.colors.surface,
    borderRadius: InkrTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: InkrTheme.colors.divider,
    paddingHorizontal: InkrTheme.spacing.md,
    paddingVertical: 6,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: InkrTheme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: InkrTheme.typography.sizes.base,
    color: InkrTheme.colors.text.main,
    padding: 0,
  },
  clearSearchBtn: {
    marginLeft: InkrTheme.spacing.sm,
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: InkrTheme.spacing.lg,
    paddingTop: InkrTheme.spacing.sm,
    paddingBottom: InkrTheme.spacing.xxl * 2,
  },
  sectionGroup: { marginBottom: InkrTheme.spacing.xl },
  sectionTitle: {
    fontSize: InkrTheme.typography.sizes.lg,
    fontWeight: InkrTheme.typography.weights.semibold,
    color: InkrTheme.colors.text.muted,
    marginBottom: InkrTheme.spacing.sm,
    paddingHorizontal: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  listItem: {
    backgroundColor: InkrTheme.colors.surface,
    borderRadius: InkrTheme.borderRadius.lg,
    padding: InkrTheme.spacing.lg,
    marginBottom: InkrTheme.spacing.sm,
    borderWidth: 1,
    borderColor: InkrTheme.colors.divider,
  },
  listItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  listItemTitle: {
    flex: 1,
    fontSize: InkrTheme.typography.sizes.base,
    fontWeight: InkrTheme.typography.weights.semibold,
    color: InkrTheme.colors.text.main,
    marginRight: InkrTheme.spacing.sm,
  },
  listItemPreview: {
    fontSize: InkrTheme.typography.sizes.sm,
    color: InkrTheme.colors.text.main,
    lineHeight: InkrTheme.typography.sizes.sm * 1.4,
    marginBottom: 6,
  },
  noteActions: { flexDirection: "row", alignItems: "center" },
  iconButton: { padding: InkrTheme.spacing.sm },
  noteDate: {
    fontSize: InkrTheme.typography.sizes.xs,
    color: InkrTheme.colors.text.muted,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tagsInline: { flexDirection: "row", flexWrap: "wrap" },
  tagInline: {
    fontSize: InkrTheme.typography.sizes.xs,
    color: InkrTheme.colors.primary,
    marginLeft: InkrTheme.spacing.sm,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: InkrTheme.spacing.xl,
    marginTop: InkrTheme.spacing.xl,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: InkrTheme.spacing.xl,
  },
  emptyTitle: {
    fontSize: InkrTheme.typography.sizes.lg,
    fontWeight: InkrTheme.typography.weights.semibold,
    color: InkrTheme.colors.text.main,
    marginTop: InkrTheme.spacing.lg,
  },
  emptyDescription: {
    fontSize: InkrTheme.typography.sizes.sm,
    color: InkrTheme.colors.text.muted,
    marginTop: 4,
    marginBottom: InkrTheme.spacing.lg,
  },
  emptyCTA: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: InkrTheme.colors.primary,
    paddingHorizontal: InkrTheme.spacing.lg,
    paddingVertical: InkrTheme.spacing.sm,
    borderRadius: InkrTheme.borderRadius.full,
  },
  emptyCTAText: {
    color: InkrTheme.colors.text.inverse,
    marginLeft: 6,
    fontSize: InkrTheme.typography.sizes.sm,
    fontWeight: InkrTheme.typography.weights.medium,
  },
});
