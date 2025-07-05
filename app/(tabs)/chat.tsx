import { IconSymbol } from '@/components/ui/IconSymbol';
import { InkrButton } from '@/components/ui/InkrButton';
import { InkrCard } from '@/components/ui/InkrCard';
import { InkrInput } from '@/components/ui/InkrInput';
import { InkrTheme } from '@/constants/Theme';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function ChatScreen() {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    console.log('Sending message:', message);
    setMessage('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Always in Memory</Text>
        <Text style={styles.headerSubtitle}>AI-powered memory assistant</Text>
      </View>
      
      <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
        <InkrCard style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>
            Hi! I'm your AI memory assistant. I can help you remember important things, 
            take notes, and answer questions about your memories.
          </Text>
        </InkrCard>
        
        <InkrCard style={styles.messageCard}>
          <View style={styles.messageBubble}>
            <Text style={styles.messageText}>
              How can I help you remember something today?
            </Text>
          </View>
        </InkrCard>
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <InkrInput
          label="Type your message..."
          value={message}
          onChangeText={setMessage}
          multiline
          style={styles.messageInput}
        />
        <InkrButton
          title="Send"
          onPress={handleSendMessage}
          variant="primary"
          style={styles.sendButton}
          icon={<IconSymbol name="paperplane.fill" size={20} color={InkrTheme.colors.text.inverse} />}
        />
      </View>
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
  
  messagesContainer: {
    flex: 1,
    paddingHorizontal: InkrTheme.spacing.md,
  },
  
  welcomeCard: {
    marginTop: InkrTheme.spacing.lg,
    backgroundColor: InkrTheme.colors.primary + '10',
    borderColor: InkrTheme.colors.primary + '20',
    borderWidth: 1,
  },
  
  welcomeText: {
    fontSize: InkrTheme.typography.sizes.base,
    fontWeight: InkrTheme.typography.weights.medium,
    color: InkrTheme.colors.text.main,
    lineHeight: InkrTheme.typography.lineHeights.relaxed * InkrTheme.typography.sizes.base,
  },
  
  messageCard: {
    alignSelf: 'flex-start',
    maxWidth: '80%',
    marginVertical: InkrTheme.spacing.sm,
  },
  
  messageBubble: {
    backgroundColor: InkrTheme.colors.surface,
  },
  
  messageText: {
    fontSize: InkrTheme.typography.sizes.base,
    fontWeight: InkrTheme.typography.weights.regular,
    color: InkrTheme.colors.text.main,
    lineHeight: InkrTheme.typography.lineHeights.normal * InkrTheme.typography.sizes.base,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: InkrTheme.spacing.md,
    paddingVertical: InkrTheme.spacing.md,
    backgroundColor: InkrTheme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: InkrTheme.colors.divider,
  },
  
  messageInput: {
    flex: 1,
    marginRight: InkrTheme.spacing.md,
  },
  
  sendButton: {
    paddingHorizontal: InkrTheme.spacing.lg,
    height: 48,
  },
});
