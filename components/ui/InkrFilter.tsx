import { InkrTheme } from '@/constants/Theme';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface FilterChip {
  id: string;
  label: string;
  count?: number;
}

interface InkrFilterProps {
  filters: FilterChip[];
  selectedFilters: string[];
  onFilterPress: (filterId: string) => void;
  style?: any;
}

export function InkrFilter({ 
  filters, 
  selectedFilters, 
  onFilterPress, 
  style 
}: InkrFilterProps) {
  return (
    <View style={[styles.container, style]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filters.map((filter) => {
          const isSelected = selectedFilters.includes(filter.id);
          return (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.chip,
                isSelected && styles.chipSelected,
              ]}
              onPress={() => onFilterPress(filter.id)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.chipText,
                isSelected && styles.chipTextSelected,
              ]}>
                {filter.label}
                {filter.count !== undefined && (
                  <Text style={[
                    styles.chipCount,
                    isSelected && styles.chipCountSelected,
                  ]}>
                    {' '}({filter.count})
                  </Text>
                )}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: InkrTheme.spacing.md,
  },
  
  scrollContent: {
    paddingHorizontal: InkrTheme.spacing.md,
    gap: InkrTheme.spacing.sm,
  },
  
  chip: {
    paddingHorizontal: InkrTheme.spacing.lg,
    paddingVertical: InkrTheme.spacing.sm,
    borderRadius: InkrTheme.borderRadius.full,
    backgroundColor: InkrTheme.colors.surface,
    borderWidth: 1,
    borderColor: InkrTheme.colors.border,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  chipSelected: {
    backgroundColor: InkrTheme.colors.primary,
    borderColor: InkrTheme.colors.primary,
  },
  
  chipText: {
    fontSize: InkrTheme.typography.sizes.sm,
    fontWeight: InkrTheme.typography.weights.medium,
    color: InkrTheme.colors.text.main,
  },
  
  chipTextSelected: {
    color: InkrTheme.colors.text.inverse,
  },
  
  chipCount: {
    fontSize: InkrTheme.typography.sizes.xs,
    fontWeight: InkrTheme.typography.weights.regular,
    color: InkrTheme.colors.text.muted,
  },
  
  chipCountSelected: {
    color: InkrTheme.colors.text.inverse,
    opacity: 0.8,
  },
});
