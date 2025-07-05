import { IconSymbol } from '@/components/ui/IconSymbol';
import { InkrButton } from '@/components/ui/InkrButton';
import { InkrCard } from '@/components/ui/InkrCard';
import { InkrFAB } from '@/components/ui/InkrFAB';
import { InkrFilter } from '@/components/ui/InkrFilter';
import { InkrInput } from '@/components/ui/InkrInput';
import { InkrTheme } from '@/constants/Theme';
import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const SAMPLE_NOTES = [
  {
    id: '1',
    title: 'Meeting Notes - Q1 Planning',
    content: 'Discussed quarterly goals, budget allocation, and team restructuring...',
    date: '2025-01-15',
    tags: ['work', 'meeting', 'planning'],
    isPinned: true,
  },
  {
    id: '2',
    title: 'Recipe: Grandmother\'s Apple Pie',
    content: 'Traditional apple pie recipe passed down from grandmother...',
    date: '2025-01-14',
    tags: ['recipe', 'family', 'cooking'],
    isPinned: false,
  },
  {
    id: '3',
    title: 'Book Ideas & Inspiration',
    content: 'Collection of ideas for the novel I want to write...',
    date: '2025-01-12',
    tags: ['writing', 'creative', 'ideas'],
    isPinned: true,
  },
  {
    id: '4',
    title: 'Travel Itinerary - Japan 2025',
    content: 'Planning for spring trip to Japan, cherry blossom season...',
    date: '2025-01-10',
    tags: ['travel', 'japan', 'planning'],
    isPinned: false,
  },
  {
    id: '5',
    title: 'Weekly Team Sync Notes',
    content: 'Discussed project milestones and upcoming deadlines...',
    date: '2025-07-05',
    tags: ['work', 'meeting'],
    isPinned: false,
  },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [pinnedNotes, setPinnedNotes] = useState<Set<string>>(
    new Set(SAMPLE_NOTES.filter(note => note.isPinned).map(note => note.id))
  );

  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  });

  // Generate filter chips from all unique tags
  const filterChips = useMemo(() => {
    const allTags = SAMPLE_NOTES.flatMap(note => note.tags);
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const uniqueTags = Object.keys(tagCounts);
    
    return [
      { id: 'all', label: 'All', count: SAMPLE_NOTES.length },
      ...uniqueTags.map(tag => ({
        id: tag,
        label: tag.charAt(0).toUpperCase() + tag.slice(1),
        count: tagCounts[tag],
      })),
    ];
  }, []);

  // Date filter options
  const dateFilters = [
    { id: 'all', label: 'All Time' },
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
  ];

  const handleFilterPress = (filterId: string) => {
    if (filterId === 'all') {
      setSelectedFilters([]);
    } else {
      setSelectedFilters(prev => 
        prev.includes(filterId)
          ? prev.filter(id => id !== filterId)
          : [...prev, filterId]
      );
    }
  };

  const handleDateFilterPress = (dateId: string) => {
    setSelectedDateFilter(dateId);
  };

  const togglePin = (noteId: string) => {
    setPinnedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(noteId)) {
        newSet.delete(noteId);
      } else {
        newSet.add(noteId);
      }
      return newSet;
    });
  };

  const filteredNotes = useMemo(() => {
    let notes = SAMPLE_NOTES.map(note => ({
      ...note,
      isPinned: pinnedNotes.has(note.id)
    }));
    
    // Apply text search
    if (searchQuery.trim()) {
      notes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply tag filters
    if (selectedFilters.length > 0) {
      notes = notes.filter(note =>
        selectedFilters.some(filter => note.tags.includes(filter))
      );
    }

    // Apply date filters
    if (selectedDateFilter !== 'all') {
      const today = new Date();
      const noteDate = (dateStr: string) => new Date(dateStr);
      
      notes = notes.filter(note => {
        const date = noteDate(note.date);
        switch (selectedDateFilter) {
          case 'today':
            return date.toDateString() === today.toDateString();
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return date >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return date >= monthAgo;
          default:
            return true;
        }
      });
    }
    
    // Sort by pinned first, then by date
    return notes.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [searchQuery, selectedFilters, selectedDateFilter, pinnedNotes]);

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
          <Text style={styles.sectionTitle}>Your Memories ({filteredNotes.length})</Text>
          
          <View style={styles.searchContainer}>
            <InkrInput
              label="Search your memories..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
          </View>
          
          <View style={styles.filtersSection}>
            <Text style={styles.filterSectionTitle}>Filter by Tags</Text>
            <InkrFilter
              filters={filterChips}
              selectedFilters={selectedFilters.length === 0 ? ['all'] : selectedFilters}
              onFilterPress={handleFilterPress}
              style={styles.filterContainer}
            />
            
            <Text style={styles.filterSectionTitle}>Filter by Date</Text>
            <InkrFilter
              filters={dateFilters}
              selectedFilters={[selectedDateFilter]}
              onFilterPress={handleDateFilterPress}
              style={styles.filterContainer}
            />
          </View>

          {filteredNotes.map((note) => (
            <InkrCard
              key={note.id}
              style={styles.noteCard}
              onPress={() => handleNotePress(note.id)}
            >
              <View style={styles.noteHeader}>
                <Text style={styles.noteTitle} numberOfLines={1}>
                  {note.title}
                </Text>
                <View style={styles.noteActions}>
                  {note.isPinned && (
                    <View style={styles.pinnedBadge}>
                      <IconSymbol name="pin.fill" size={12} color={InkrTheme.colors.warning} />
                    </View>
                  )}
                  <TouchableOpacity onPress={() => togglePin(note.id)} style={styles.pinButton}>
                    <IconSymbol 
                      name={note.isPinned ? "pin.fill" : "pin"} 
                      size={16} 
                      color={note.isPinned ? InkrTheme.colors.warning : InkrTheme.colors.text.muted} 
                    />
                  </TouchableOpacity>
                  <Text style={styles.noteDate}>
                    {new Date(note.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <Text style={styles.notePreview} numberOfLines={2}>
                {note.content}
              </Text>
              
              <View style={styles.tagsContainer}>
                {note.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </InkrCard>
          ))}

          {filteredNotes.length === 0 && (
            <InkrCard style={styles.emptyCard}>
              <View style={styles.emptyContent}>
                <IconSymbol name="magnifyingglass" size={48} color={InkrTheme.colors.text.muted} />
                <Text style={styles.emptyTitle}>No memories found</Text>
                <Text style={styles.emptyDescription}>
                  Try adjusting your search or filters to find your memories.
                </Text>
              </View>
            </InkrCard>
          )}
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
    marginBottom: InkrTheme.spacing.xxl * 2, // Account for FAB and normal tab bar
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

  searchContainer: {
    paddingHorizontal: InkrTheme.spacing.lg,
    paddingVertical: InkrTheme.spacing.md,
    backgroundColor: InkrTheme.colors.surface,
  },

  searchInput: {
    marginVertical: 0,
  },

  filtersSection: {
    paddingHorizontal: InkrTheme.spacing.lg,
    paddingVertical: InkrTheme.spacing.md,
  },

  filterSectionTitle: {
    fontSize: InkrTheme.typography.sizes.base,
    fontWeight: InkrTheme.typography.weights.semibold,
    color: InkrTheme.colors.text.main,
    marginBottom: InkrTheme.spacing.sm,
    marginTop: InkrTheme.spacing.md,
  },

  filterContainer: {
    borderBottomWidth: 1,
    borderBottomColor: InkrTheme.colors.divider,
  },

  noteActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: InkrTheme.spacing.sm,
  },

  pinnedBadge: {
    width: 20,
    height: 20,
    borderRadius: InkrTheme.borderRadius.full,
    backgroundColor: InkrTheme.colors.warning + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pinButton: {
    padding: InkrTheme.spacing.sm,
  },

  noteDate: {
    fontSize: InkrTheme.typography.sizes.xs,
    fontWeight: InkrTheme.typography.weights.medium,
    color: InkrTheme.colors.text.muted,
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: InkrTheme.spacing.md,
    gap: InkrTheme.spacing.sm,
  },

  tag: {
    paddingHorizontal: InkrTheme.spacing.md,
    paddingVertical: InkrTheme.spacing.sm,
    backgroundColor: InkrTheme.colors.primary + '10',
    borderRadius: InkrTheme.borderRadius.full,
  },

  tagText: {
    fontSize: InkrTheme.typography.sizes.xs,
    fontWeight: InkrTheme.typography.weights.medium,
    color: InkrTheme.colors.primary,
  },

  emptyCard: {
    alignItems: 'center',
    padding: InkrTheme.spacing.xl,
  },

  emptyContent: {
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: InkrTheme.typography.sizes.lg,
    fontWeight: InkrTheme.typography.weights.semibold,
    color: InkrTheme.colors.text.main,
    marginTop: InkrTheme.spacing.lg,
    marginBottom: InkrTheme.spacing.sm,
  },

  emptyDescription: {
    fontSize: InkrTheme.typography.sizes.base,
    fontWeight: InkrTheme.typography.weights.regular,
    color: InkrTheme.colors.text.muted,
    textAlign: 'center',
    lineHeight: InkrTheme.typography.lineHeights.relaxed * InkrTheme.typography.sizes.base,
  },
});
