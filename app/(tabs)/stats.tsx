import { IconSymbol } from '@/components/ui/IconSymbol';
import { InkrCard } from '@/components/ui/InkrCard';
import { InkrTheme } from '@/constants/Theme';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const SAMPLE_STATS = [
  {
    id: '1',
    title: 'Total Memories',
    value: '247',
    icon: 'brain.head.profile' as const,
    trend: '+12',
    color: InkrTheme.colors.primary,
  },
  {
    id: '2',
    title: 'This Week',
    value: '18',
    icon: 'calendar' as const,
    trend: '+5',
    color: InkrTheme.colors.success,
  },
  {
    id: '3',
    title: 'Chat Sessions',
    value: '89',
    icon: 'message.fill' as const,
    trend: '+8',
    color: InkrTheme.colors.info,
  },
  {
    id: '4',
    title: 'Insights Generated',
    value: '156',
    icon: 'lightbulb.fill' as const,
    trend: '+23',
    color: InkrTheme.colors.warning,
  },
];

const RECENT_ACTIVITY = [
  'Added memory: "Restaurant recommendation from Sarah"',
  'Generated insight about travel patterns',
  'Searched for cooking recipes',
  'Reviewed meeting notes from last week',
  'Created new note about book ideas',
];

export default function StatsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Insights</Text>
        <Text style={styles.headerSubtitle}>Your memory patterns & statistics</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          {SAMPLE_STATS.map((stat) => (
            <InkrCard key={stat.id} style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '15' }]}>
                  <IconSymbol name={stat.icon} size={24} color={stat.color} />
                </View>
                <View style={[styles.trendBadge, { backgroundColor: InkrTheme.colors.success + '15' }]}>
                  <Text style={[styles.trendText, { color: InkrTheme.colors.success }]}>
                    {stat.trend}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </InkrCard>
          ))}
        </View>
        
        <InkrCard style={styles.activityCard}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            {RECENT_ACTIVITY.map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={styles.activityDot} />
                <Text style={styles.activityText}>{activity}</Text>
              </View>
            ))}
          </View>
        </InkrCard>
        
        <InkrCard style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <IconSymbol name="sparkles" size={24} color={InkrTheme.colors.primary} />
            <Text style={styles.sectionTitle}>AI Insight</Text>
          </View>
          <Text style={styles.insightText}>
            You're most productive with memory creation on Tuesday and Thursday mornings. 
            Consider scheduling important note-taking sessions during these peak times.
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
  
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: InkrTheme.spacing.md,
  },
  
  statCard: {
    width: '48%',
    marginBottom: InkrTheme.spacing.md,
    padding: InkrTheme.spacing.lg,
  },
  
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: InkrTheme.spacing.md,
  },
  
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: InkrTheme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  trendBadge: {
    paddingHorizontal: InkrTheme.spacing.sm,
    paddingVertical: 2,
    borderRadius: InkrTheme.borderRadius.sm,
  },
  
  trendText: {
    fontSize: InkrTheme.typography.sizes.xs,
    fontWeight: InkrTheme.typography.weights.semibold,
  },
  
  statValue: {
    fontSize: InkrTheme.typography.sizes.display,
    fontWeight: InkrTheme.typography.weights.bold,
    color: InkrTheme.colors.text.main,
    marginBottom: InkrTheme.spacing.sm,
  },
  
  statTitle: {
    fontSize: InkrTheme.typography.sizes.sm,
    fontWeight: InkrTheme.typography.weights.medium,
    color: InkrTheme.colors.text.muted,
  },
  
  activityCard: {
    marginBottom: InkrTheme.spacing.lg,
  },
  
  sectionTitle: {
    fontSize: InkrTheme.typography.sizes.xl,
    fontWeight: InkrTheme.typography.weights.semibold,
    color: InkrTheme.colors.text.main,
    marginBottom: InkrTheme.spacing.lg,
  },
  
  activityList: {
    gap: InkrTheme.spacing.md,
  },
  
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: InkrTheme.colors.primary,
    marginRight: InkrTheme.spacing.md,
  },
  
  activityText: {
    flex: 1,
    fontSize: InkrTheme.typography.sizes.base,
    fontWeight: InkrTheme.typography.weights.regular,
    color: InkrTheme.colors.text.main,
    lineHeight: InkrTheme.typography.lineHeights.normal * InkrTheme.typography.sizes.base,
  },
  
  insightCard: {
    backgroundColor: InkrTheme.colors.primary + '05',
    borderColor: InkrTheme.colors.primary + '20',
    borderWidth: 1,
    marginBottom: 100, // Account for tab bar
  },
  
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: InkrTheme.spacing.lg,
    gap: InkrTheme.spacing.md,
  },
  
  insightText: {
    fontSize: InkrTheme.typography.sizes.base,
    fontWeight: InkrTheme.typography.weights.regular,
    color: InkrTheme.colors.text.main,
    lineHeight: InkrTheme.typography.lineHeights.relaxed * InkrTheme.typography.sizes.base,
  },
});
