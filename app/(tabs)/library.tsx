import { InkrCard } from '@/components/ui/InkrCard';
import { InkrInput } from '@/components/ui/InkrInput';
import { InkrTheme } from '@/constants/Theme';
import React, { useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';

const SAMPLE_NOTES = [
  {
    id: '1',
    title: 'Meeting Notes - Q1 Planning',
    content: 'Discussed quarterly goals, budget allocation, and team restructuring...',
    date: '2025-01-15',
    tags: ['work', 'meeting', 'planning'],
  },
  {
    id: '2',
    title: 'Recipe: Grandmother\'s Apple Pie',
    content: 'Traditional apple pie recipe passed down from grandmother...',
    date: '2025-01-14',
    tags: ['recipe', 'family', 'cooking'],
  },
  {
    id: '3',
    title: 'Book Ideas & Inspiration',
    content: 'Collection of ideas for the novel I want to write...',
    date: '2025-01-12',
    tags: ['writing', 'creative', 'ideas'],
  },
  {
    id: '4',
    title: 'Travel Itinerary - Japan 2025',
    content: 'Planning for spring trip to Japan, cherry blossom season...',
    date: '2025-01-10',
    tags: ['travel', 'japan', 'planning'],
  },
];

export default function LibraryScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = SAMPLE_NOTES.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderNoteCard = ({ item }: { item: typeof SAMPLE_NOTES[0] }) => (
    <InkrCard
      style={styles.noteCard}
      onPress={() => console.log('Opening note:', item.title)}
    >
      <View style={styles.noteHeader}>
        <Text style={styles.noteTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.noteDate}>{item.date}</Text>
      </View>
      
      <Text style={styles.noteContent} numberOfLines={3}>
        {item.content}
      </Text>
      
      <View style={styles.tagsContainer}>
        {item.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </InkrCard>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Library</Text>
        <Text style={styles.headerSubtitle}>Your memory collection</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <InkrInput
          label="Search your memories..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>
      
      <FlatList
        data={filteredNotes}
        renderItem={renderNoteCard}
        keyExtractor={(item) => item.id}
        style={styles.notesList}
        showsVerticalScrollIndicator={false}
        numColumns={1}
        contentContainerStyle={styles.notesListContent}
      />
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
  
  searchContainer: {
    paddingHorizontal: InkrTheme.spacing.md,
    paddingVertical: InkrTheme.spacing.md,
    backgroundColor: InkrTheme.colors.surface,
  },
  
  searchInput: {
    marginVertical: 0,
  },
  
  notesList: {
    flex: 1,
  },
  
  notesListContent: {
    paddingHorizontal: InkrTheme.spacing.sm,
    paddingBottom: 100, // Account for tab bar
  },
  
  noteCard: {
    marginHorizontal: InkrTheme.spacing.sm,
    marginVertical: InkrTheme.spacing.sm,
  },
  
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: InkrTheme.spacing.md,
  },
  
  noteTitle: {
    flex: 1,
    fontSize: InkrTheme.typography.sizes.lg,
    fontWeight: InkrTheme.typography.weights.semibold,
    color: InkrTheme.colors.text.main,
    marginRight: InkrTheme.spacing.md,
  },
  
  noteDate: {
    fontSize: InkrTheme.typography.sizes.sm,
    fontWeight: InkrTheme.typography.weights.medium,
    color: InkrTheme.colors.text.muted,
  },
  
  noteContent: {
    fontSize: InkrTheme.typography.sizes.base,
    fontWeight: InkrTheme.typography.weights.regular,
    color: InkrTheme.colors.text.main,
    lineHeight: InkrTheme.typography.lineHeights.relaxed * InkrTheme.typography.sizes.base,
    marginBottom: InkrTheme.spacing.md,
  },
  
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: InkrTheme.spacing.sm,
  },
  
  tag: {
    backgroundColor: InkrTheme.colors.primary + '15',
    borderRadius: InkrTheme.borderRadius.md,
    paddingHorizontal: InkrTheme.spacing.md,
    paddingVertical: InkrTheme.spacing.sm,
  },
  
  tagText: {
    fontSize: InkrTheme.typography.sizes.sm,
    fontWeight: InkrTheme.typography.weights.medium,
    color: InkrTheme.colors.primary,
  },
});
