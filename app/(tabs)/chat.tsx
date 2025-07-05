import { DismissKeyboard } from '@/components/ui/DismissKeyboard';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { InkrButton } from '@/components/ui/InkrButton';
import { InkrInput } from '@/components/ui/InkrInput';
import { InkrTheme } from '@/constants/Theme';
import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function ChatScreen() {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    console.log('Sending message:', message);
    setMessage('');
  };

  return (
    <DismissKeyboard>
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <IconSymbol name="message.fill" size={48} color={InkrTheme.colors.text.muted} />
          </View>
          <Text style={styles.emptyTitle}>Start a conversation</Text>
          <Text style={styles.emptyDescription}>
            Your AI memory assistant is ready to help you remember anything important.
          </Text>
        </View>
        
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
    </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: InkrTheme.colors.background,
  },
  
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: InkrTheme.spacing.xl,
  },
  
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: InkrTheme.borderRadius.full,
    backgroundColor: InkrTheme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: InkrTheme.spacing.xl,
    borderWidth: 2,
    borderColor: InkrTheme.colors.border,
  },
  
  emptyTitle: {
    fontSize: InkrTheme.typography.sizes.title,
    fontWeight: InkrTheme.typography.weights.bold,
    color: InkrTheme.colors.text.main,
    marginBottom: InkrTheme.spacing.md,
    textAlign: 'center',
  },
  
  emptyDescription: {
    fontSize: InkrTheme.typography.sizes.base,
    fontWeight: InkrTheme.typography.weights.regular,
    color: InkrTheme.colors.text.muted,
    textAlign: 'center',
    lineHeight: InkrTheme.typography.lineHeights.relaxed * InkrTheme.typography.sizes.base,
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
