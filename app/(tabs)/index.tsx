import { IconSymbol } from '@/components/ui/IconSymbol';
import { InkrButton } from '@/components/ui/InkrButton';
import { InkrCard } from '@/components/ui/InkrCard';
import { InkrFAB } from '@/components/ui/InkrFAB';
import { InkrTheme } from '@/constants/Theme';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const RECENT_NOTES = [
  {
    id: '1',
    title: 'Weekly Team Sync Notes',
    preview: 'Discussed project milestones and upcoming deadlines...',
    time: '2 hours ago',
  },
  {
    id: '2',
    title: 'Restaurant Recommendation',
    preview: 'Sarah mentioned this amazing Italian place downtown...',
    time: '1 day ago',
  },
  {
    id: '3',
    title: 'Book Club Discussion',
    preview: 'Thoughts on the latest chapter and character development...',
    time: '3 days ago',
  },
];

export default function HomeScreen() {
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  });

  const handleNewNote = () => {
    console.log('Creating new note...');
  };

  const handleNotePress = (noteId: string) => {
    console.log('Opening note:', noteId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.subtitle}>What would you like to remember today?</Text>
        </View>

        <InkrCard style={styles.welcomeCard}>
          <View style={styles.welcomeContent}>
            <View style={styles.welcomeIcon}>
              <IconSymbol name="brain.head.profile" size={32} color={InkrTheme.colors.primary} />
            </View>
            <View style={styles.welcomeText}>
              <Text style={styles.welcomeTitle}>Your AI Memory Assistant</Text>
              <Text style={styles.welcomeDescription}>
                Capture thoughts, remember important details, and chat with your memories.
              </Text>
            </View>
          </View>
        </InkrCard>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <InkrButton
              title="New Note"
              onPress={handleNewNote}
              variant="primary"
              style={styles.actionButton}
              icon={<IconSymbol name="plus" size={20} color={InkrTheme.colors.text.inverse} />}
            />
            <InkrButton
              title="Voice Memo"
              onPress={() => console.log('Voice memo')}
              variant="secondary"
              style={styles.actionButton}
              icon={<IconSymbol name="mic.fill" size={20} color={InkrTheme.colors.primary} />}
            />
          </View>
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Memories</Text>
          {RECENT_NOTES.map((note) => (
            <InkrCard
              key={note.id}
              style={styles.noteCard}
              onPress={() => handleNotePress(note.id)}
            >
              <View style={styles.noteHeader}>
                <Text style={styles.noteTitle} numberOfLines={1}>
                  {note.title}
                </Text>
                <Text style={styles.noteTime}>{note.time}</Text>
              </View>
              <Text style={styles.notePreview} numberOfLines={2}>
                {note.preview}
              </Text>
            </InkrCard>
          ))}
        </View>

        <View style={styles.statsPreview}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          <View style={styles.statsRow}>
            <InkrCard style={styles.statCard}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Memories</Text>
            </InkrCard>
            <InkrCard style={styles.statCard}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Chats</Text>
            </InkrCard>
            <InkrCard style={styles.statCard}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Insights</Text>
            </InkrCard>
          </View>
        </View>
      </ScrollView>

      <InkrFAB
        onPress={handleNewNote}
        icon={<IconSymbol name="plus" size={24} color={InkrTheme.colors.text.inverse} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: InkrTheme.colors.background,
  },

  content: {
    flex: 1,
    paddingHorizontal: InkrTheme.spacing.lg,
  },

  header: {
    paddingVertical: InkrTheme.spacing.xl,
  },

  greeting: {
    fontSize: InkrTheme.typography.sizes.display,
    fontWeight: InkrTheme.typography.weights.bold,
    color: InkrTheme.colors.text.main,
    marginBottom: InkrTheme.spacing.sm,
  },

  subtitle: {
    fontSize: InkrTheme.typography.sizes.lg,
    fontWeight: InkrTheme.typography.weights.medium,
    color: InkrTheme.colors.text.muted,
    lineHeight: InkrTheme.typography.lineHeights.relaxed * InkrTheme.typography.sizes.lg,
  },

  welcomeCard: {
    marginBottom: InkrTheme.spacing.xl,
    backgroundColor: InkrTheme.colors.primary + '08',
    borderColor: InkrTheme.colors.primary + '20',
    borderWidth: 1,
  },

  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  welcomeIcon: {
    width: 60,
    height: 60,
    borderRadius: InkrTheme.borderRadius.xl,
    backgroundColor: InkrTheme.colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: InkrTheme.spacing.lg,
  },

  welcomeText: {
    flex: 1,
  },

  welcomeTitle: {
    fontSize: InkrTheme.typography.sizes.xl,
    fontWeight: InkrTheme.typography.weights.semibold,
    color: InkrTheme.colors.text.main,
    marginBottom: InkrTheme.spacing.sm,
  },

  welcomeDescription: {
    fontSize: InkrTheme.typography.sizes.base,
    fontWeight: InkrTheme.typography.weights.regular,
    color: InkrTheme.colors.text.muted,
    lineHeight: InkrTheme.typography.lineHeights.normal * InkrTheme.typography.sizes.base,
  },

  quickActions: {
    marginBottom: InkrTheme.spacing.xl,
  },

  sectionTitle: {
    fontSize: InkrTheme.typography.sizes.xl,
    fontWeight: InkrTheme.typography.weights.semibold,
    color: InkrTheme.colors.text.main,
    marginBottom: InkrTheme.spacing.lg,
  },

  actionsRow: {
    flexDirection: 'row',
    gap: InkrTheme.spacing.md,
  },

  actionButton: {
    flex: 1,
  },

  recentSection: {
    marginBottom: InkrTheme.spacing.xl,
  },

  noteCard: {
    marginBottom: InkrTheme.spacing.md,
    padding: InkrTheme.spacing.lg,
  },

  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: InkrTheme.spacing.sm,
  },

  noteTitle: {
    flex: 1,
    fontSize: InkrTheme.typography.sizes.lg,
    fontWeight: InkrTheme.typography.weights.semibold,
    color: InkrTheme.colors.text.main,
    marginRight: InkrTheme.spacing.md,
  },

  noteTime: {
    fontSize: InkrTheme.typography.sizes.sm,
    fontWeight: InkrTheme.typography.weights.medium,
    color: InkrTheme.colors.text.muted,
  },

  notePreview: {
    fontSize: InkrTheme.typography.sizes.base,
    fontWeight: InkrTheme.typography.weights.regular,
    color: InkrTheme.colors.text.main,
    lineHeight: InkrTheme.typography.lineHeights.normal * InkrTheme.typography.sizes.base,
  },

  statsPreview: {
    marginBottom: 120, // Account for FAB and tab bar
  },

  statsRow: {
    flexDirection: 'row',
    gap: InkrTheme.spacing.md,
  },

  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: InkrTheme.spacing.lg,
  },

  statNumber: {
    fontSize: InkrTheme.typography.sizes.xxl,
    fontWeight: InkrTheme.typography.weights.bold,
    color: InkrTheme.colors.primary,
    marginBottom: InkrTheme.spacing.sm,
  },

  statLabel: {
    fontSize: InkrTheme.typography.sizes.sm,
    fontWeight: InkrTheme.typography.weights.medium,
    color: InkrTheme.colors.text.muted,
  },
});
