import { InkrTheme } from "@/constants/Theme";
import { storageService } from "@/services/storage";
import { Note } from "@/types/models";
import React, { useEffect, useMemo, useState } from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function MindMapScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      setNotes(await storageService.loadNotes());
    } catch {}
  };
  useEffect(() => {
    load();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const tagStats = useMemo(() => {
    const counts: Record<string, number> = {};
    notes.forEach((n) =>
      n.tags.forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      })
    );
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const max = entries[0]?.[1] || 1;
    return entries.map(([tag, count]) => ({
      tag,
      count,
      weight: 0.7 + (count / max) * 0.8,
    }));
  }, [notes]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.center}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.pageTitle}>Tag Map</Text>
        {tagStats.length === 0 && (
          <Text style={styles.empty}>
            No tags yet. Create notes with AI tags.
          </Text>
        )}
        <View style={styles.cloud}>
          {tagStats.map(({ tag, weight, count }) => (
            <Text key={tag} style={[styles.tag, { fontSize: 14 * weight }]}>
              #{tag}
            </Text>
          ))}
        </View>
        {tagStats.length > 0 && (
          <View style={styles.legend}>
            <Text style={styles.legendText}>
              Total Tags: {tagStats.length} • Notes: {notes.length}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: InkrTheme.colors.background,
  },

  scroll: { flex: 1 },
  center: { padding: InkrTheme.spacing.lg, alignItems: "center" },

  pageTitle: {
    fontSize: InkrTheme.typography.sizes.title,
    fontWeight: InkrTheme.typography.weights.bold,
    color: InkrTheme.colors.text.main,
    textAlign: "center",
  },
  empty: {
    marginTop: InkrTheme.spacing.xl,
    color: InkrTheme.colors.text.muted,
  },
  cloud: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: InkrTheme.spacing.xl,
  },
  tag: {
    margin: 8,
    color: InkrTheme.colors.primary,
    fontWeight: InkrTheme.typography.weights.medium,
  },
  legend: { marginTop: InkrTheme.spacing.xl },
  legendText: { color: InkrTheme.colors.text.muted },
});
