import { InkrTheme } from '@/constants/Theme';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
} from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { DismissKeyboard } from '../../components/ui/DismissKeyboard';
import { InkrInput } from '../../components/ui/InkrInput';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp?: Date;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      text: 'Hello! How can I help you remember your notes today?', 
      sender: 'ai',
      timestamp: new Date()
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    const aiReply: Message = {
      id: (Date.now() + 1).toString(),
      text: `I've noted: "${input}"\n\nWould you like me to organize this into a specific category or set a reminder?`,
      sender: 'ai',
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg, aiReply]);
    setInput('');
  };

  const formatTime = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userContainer : styles.aiContainer,
      ]}
    >
      {item.sender === 'ai' && (
        <LinearGradient
          colors={['#007AFF', '#339CFF']} 
          style={styles.aiIconContainer}
        >
          <Ionicons name="sparkles" size={16} color="white" />
        </LinearGradient>
      )}
      
      <View style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.aiBubble,
      ]}>
        <ThemedText 
          style={[
            styles.messageText,
            item.sender === 'user' ? styles.userText : styles.aiText
          ]}
        >
          {item.text}
        </ThemedText>
        <ThemedText style={styles.timestamp}>
          {formatTime(item.timestamp)}
        </ThemedText>
      </View>
      
      {item.sender === 'user' && (
        <View style={styles.userIconContainer}>
          <Ionicons name="person" size={16} color="#007AFF" />
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <DismissKeyboard>
        <ThemedView style={styles.container}>
          <LinearGradient
            colors={['#f8f9fa', '#e9ecef']}
            style={styles.header}
          >
            <ThemedText style={styles.headerTitle}>Inker Chat</ThemedText>
            <ThemedText style={styles.headerSubtitle}>AI-Powered Note Taking</ThemedText>
          </LinearGradient>

          <View style={styles.chatWrapper}>
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              contentContainerStyle={styles.chatContainer}
              inverted
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <InkrInput
                label=""
                value={input}
                onChangeText={setInput}
                placeholder="Type your note or question..."
                onSubmitEditing={handleSend}
                returnKeyType="send"
                style={styles.input}
                multiline
              />
              <TouchableOpacity 
                style={styles.sendButton} 
                onPress={handleSend}
                disabled={!input.trim()}
              >
                <LinearGradient
                  colors={['#007AFF', '#339CFF']}
                  style={styles.sendButtonGradient}
                >
                  <Ionicons name="send" size={20} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ThemedView>
      </DismissKeyboard>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#343a40',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6c757d',
    opacity: 0.8,
  },
  chatWrapper: {
    flex: 1,
  },
  chatContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
flexDirection: 'column-reverse' },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 8,
    maxWidth: '90%',
  },
  aiContainer: {
    alignSelf: 'flex-start',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    borderRadius: 18,
    padding: 14,
    marginHorizontal: 8,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  aiBubble: {
    backgroundColor: 'white',
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  aiText: {
    color: '#495057',
  },
  userText: {
    color: 'white',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    opacity: 0.7,
    textAlign: 'right',
  },
  aiIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  userIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: 'rgba(0,122,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,122,255,0.3)',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: 260,
    backgroundColor: 'white',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    marginLeft: 8,
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
