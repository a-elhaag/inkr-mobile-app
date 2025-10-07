import { IconSymbol } from "@/components/ui/IconSymbol";
import { InkrButton } from "@/components/ui/InkrButton";
import { InkrCard } from "@/components/ui/InkrCard";
import { InkrTheme } from "@/constants/Theme";
import { azureOpenAIService } from "@/services/azureOpenAI";
import { storageService } from "@/services/storage";
import { ChatMessage, Note } from "@/types/models";
import * as Haptics from "expo-haptics";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import uuid from "react-native-uuid";

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [contextNotes, setContextNotes] = useState<Note[]>([]);
  const [showContextDetails, setShowContextDetails] = useState(false);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const lastUserQuestionRef = useRef<string | null>(null);
  const lastAssistantIdRef = useRef<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadChatHistory();
    loadNotes();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new message is added
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const history = await storageService.loadChatHistory();
      setMessages(history);
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const loadNotes = async () => {
    try {
      const loadedNotes = await storageService.loadNotes();
      setNotes(loadedNotes);
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  };

  const buildContext = useCallback(
    (question: string): Note[] => {
      if (notes.length === 0) return [];
      const terms = question
        .toLowerCase()
        .split(/[^a-z0-9#]+/)
        .filter((w) => w.length > 2);
      if (terms.length === 0) {
        return [...notes]
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
          .slice(0, 8);
      }
      const scored = notes.map((n) => {
        const hay = (
          n.title +
          " " +
          n.content +
          " " +
          (n.summary || "") +
          " " +
          n.tags.join(" ")
        ).toLowerCase();
        const score = terms.reduce(
          (acc, t) => acc + (hay.includes(t) ? 1 : 0),
          0
        );
        return { note: n, score };
      });
      return scored
        .sort(
          (a, b) =>
            b.score - a.score ||
            new Date(b.note.updatedAt).getTime() -
              new Date(a.note.updatedAt).getTime()
        )
        .filter((s) => s.score > 0 || terms.length === 0)
        .slice(0, 8)
        .map((s) => s.note);
    },
    [notes]
  );

  const makeNotesContextString = (selected: Note[]) =>
    selected
      .map(
        (n) =>
          `Title: ${n.title}\nContent: ${n.content}\nTags: ${n.tags.join(", ")}`
      )
      .join("\n\n---\n\n");

  const generateFollowUps = useCallback((answer: string, context: Note[]) => {
    const suggestions: string[] = [];
    if (/summary|summarize/i.test(answer))
      suggestions.push("Make it even shorter");
    if (/list|bullet/i.test(answer)) suggestions.push("Turn into action steps");
    if (!/todo|action/i.test(answer)) suggestions.push("Extract to-do items");
    const tagCounts: Record<string, number> = {};
    context.forEach((n) =>
      n.tags.forEach((t) => {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      })
    );
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map((e) => e[0]);
    topTags.forEach((t) => suggestions.push(`Show notes about ${t}`));
    suggestions.push("What am I writing about most recently?");
    return Array.from(new Set(suggestions)).slice(0, 5);
  }, []);

  const sendMessage = async (contentOverride?: string) => {
    const contentToSend = contentOverride || inputText.trim();
    if (!contentToSend) return;

    const userMessage: ChatMessage = {
      id: uuid.v4() as string,
      role: "user",
      content: contentToSend,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    lastUserQuestionRef.current = contentToSend;

    setIsLoading(true);
    setFollowUps([]); // Clear follow-ups while loading
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const selectedContext = buildContext(contentToSend);
      setContextNotes(selectedContext);
      const notesContext = makeNotesContextString(selectedContext);
      const aiResponse = await azureOpenAIService.chatWithNotes(
        contentToSend,
        notesContext
      );
      const assistantMessage: ChatMessage = {
        id: uuid.v4() as string,
        role: "assistant",
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };
      lastAssistantIdRef.current = assistantMessage.id;
      setMessages((prev) => [...prev, assistantMessage]);
      setFollowUps(generateFollowUps(aiResponse, selectedContext));
      await storageService.addChatMessage(userMessage);
      await storageService.addChatMessage(assistantMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        id: uuid.v4() as string,
        role: "assistant",
        content: "Sorry, I hit an issue. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      Alert.alert("Error", "Failed to send message.");
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateLast = () => {
    if (isLoading || !lastUserQuestionRef.current) return;
    const lastMsgId = messages[messages.length - 1]?.id;
    const newMessages = messages.filter(
      (m) => m.role === "user" || m.id !== lastMsgId
    );
    setMessages(newMessages);
    sendMessage(lastUserQuestionRef.current);
  };

  const saveAssistantAsNote = async () => {
    const lastAssistant = [...messages]
      .reverse()
      .find((m) => m.role === "assistant");
    if (!lastAssistant) return Alert.alert("Nothing to save");
    try {
      const newNote: Note = {
        id: uuid.v4() as string,
        title:
          lastAssistant.content.split("\n")[0].slice(0, 60) || "AI Insight",
        content: lastAssistant.content,
        summary: lastAssistant.content.slice(0, 140),
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isStarred: false,
      };
      await storageService.saveNote(newNote);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Saved", "Assistant reply saved as a note.");
    } catch (e) {
      Alert.alert("Save failed", "Could not save note");
    }
  };

  const clearChat = async () => {
    Alert.alert(
      "Clear Chat",
      "Are you sure you want to clear all chat messages?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await storageService.saveChatHistory([]);
              setMessages([]);
              setFollowUps([]);
            } catch (error) {
              Alert.alert("Error", "Failed to clear chat");
            }
          },
        },
      ]
    );
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const hasAssistantReply = useMemo(
    () => messages.some((m) => m.role === "assistant"),
    [messages]
  );

  const insets = useSafeAreaInsets();

  const getSuggestedQuestions = () => [
    "What are my most important notes?",
    "Summarize my recent notes",
    "What topics do I write about most?",
    "Help me organize my notes",
    "Find notes about work",
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER: No changes needed here */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconSymbol
            name="sparkles"
            size={24}
            color={InkrTheme.colors.primary}
          />
          <Text style={styles.headerTitle}>AI Assistant</Text>
        </View>
        <View style={styles.headerActions}>
          {messages.length > 0 && (
            <InkrButton
              title="Regenerate"
              variant="secondary"
              onPress={regenerateLast}
              disabled={isLoading || !lastUserQuestionRef.current}
              style={styles.smallHeaderBtn}
            />
          )}
          <InkrButton
            title="Clear"
            onPress={clearChat}
            variant="secondary"
            style={styles.clearButton}
          />
        </View>
      </View>
      {/* CONTEXT BAR: No changes needed here */}
      {contextNotes.length > 0 && (
        <View style={styles.contextBar}>
          <Text style={styles.contextText}>
            Context: {contextNotes.length} notes
          </Text>
          <InkrButton
            title={showContextDetails ? "Hide" : "View"}
            variant="outline"
            onPress={() => setShowContextDetails((s) => !s)}
            style={styles.contextToggle}
          />
        </View>
      )}
      {showContextDetails && contextNotes.length > 0 && (
        <ScrollView
          horizontal
          style={styles.contextChips}
          showsHorizontalScrollIndicator={false}
        >
          {contextNotes.map((n) => (
            <View key={n.id} style={styles.contextChip}>
              <Text style={styles.contextChipText}>{n.title.slice(0, 30)}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* MESSAGES CONTAINER: No changes needed here */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={{ paddingBottom: InkrTheme.spacing.md }}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <View style={styles.welcomeSection}>
              <View style={styles.welcomeIcon}>
                <IconSymbol
                  name="brain.head.profile"
                  size={48}
                  color={InkrTheme.colors.primary}
                />
              </View>
              <Text style={styles.welcomeTitle}>Chat with Your Notes</Text>
              <Text style={styles.welcomeDescription}>
                Ask questions about your notes, get summaries, and discover
                insights from your content.
              </Text>
              <View style={styles.suggestionsSection}>
                <Text style={styles.suggestionsTitle}>Try asking:</Text>
                {getSuggestedQuestions().map((question, index) => (
                  <InkrCard
                    key={index}
                    style={styles.suggestionCard}
                    onPress={() => sendMessage(question)}
                  >
                    <Text style={styles.suggestionText}>{question}</Text>
                  </InkrCard>
                ))}
              </View>
            </View>
          ) : (
            messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.role === "user"
                    ? styles.userMessage
                    : styles.assistantMessage,
                ]}
              >
                <View style={styles.messageHeader}>
                  <View style={styles.messageSender}>
                    <IconSymbol
                      name={
                        message.role === "user" ? "person.fill" : "sparkles"
                      }
                      size={16}
                      color={
                        message.role === "user"
                          ? InkrTheme.colors.text.inverse
                          : InkrTheme.colors.primary
                      }
                    />
                    <Text
                      style={[
                        styles.senderText,
                        message.role === "user"
                          ? styles.userSenderText
                          : styles.assistantSenderText,
                      ]}
                    >
                      {message.role === "user" ? "You" : "AI Assistant"}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.messageTime,
                      message.role === "user"
                        ? styles.userTimeText
                        : styles.assistantTimeText,
                    ]}
                  >
                    {formatTime(message.timestamp)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.messageText,
                    message.role === "user"
                      ? styles.userMessageText
                      : styles.assistantMessageText,
                  ]}
                >
                  {message.content}
                </Text>
              </View>
            ))
          )}

          {isLoading && (
            <View style={[styles.messageContainer, styles.assistantMessage]}>
              <View style={styles.messageHeader}>
                <View style={styles.messageSender}>
                  <IconSymbol
                    name="sparkles"
                    size={16}
                    color={InkrTheme.colors.primary}
                  />
                  <Text style={styles.assistantSenderText}>AI Assistant</Text>
                </View>
              </View>
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size="small"
                  color={InkrTheme.colors.primary}
                />
                <Text style={styles.loadingText}>Thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* --- ALL NEW COMPOSER UI --- */}
        <View style={styles.composer}>
          {followUps.length > 0 && !isLoading && (
            <View style={styles.followUpsWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: InkrTheme.spacing.lg,
                }}
              >
                {followUps.map((f) => (
                  <TouchableOpacity
                    key={f}
                    style={styles.followUpChip}
                    onPress={() => {
                      setInputText(f);
                      sendMessage(f);
                    }}
                  >
                    <Text style={styles.followUpText}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.inputBar}>
            <TextInput
              placeholder="Ask anything..."
              placeholderTextColor={InkrTheme.colors.text.muted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              style={styles.textInput}
              returnKeyType="send"
              onSubmitEditing={() => {
                if (inputText.trim()) sendMessage();
              }}
              blurOnSubmit={false}
            />

            <InkrButton
              title=""
              onPress={() => sendMessage()}
              variant="primary"
              style={
                (!inputText.trim()
                  ? [styles.sendButton, styles.sendButtonDisabled]
                  : styles.sendButton) as any
              }
              disabled={!inputText.trim() || isLoading}
              icon={
                <IconSymbol
                  name="arrow.up"
                  size={20}
                  color={InkrTheme.colors.text.inverse}
                />
              }
            />
          </View>

          {/* inlineActions moved to fixed footer so it's always visible */}
        </View>
      </KeyboardAvoidingView>

      {/* Fixed footer: always visible save button (respects safe area) */}
      {hasAssistantReply && (
        <View
          style={[
            styles.fixedFooter,
            { paddingBottom: Math.max(insets.bottom, InkrTheme.spacing.sm) },
          ]}
        >
          <InkrButton
            title="Save Reply as Note"
            onPress={saveAssistantAsNote}
            variant="outline"
            style={styles.footerButton}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

// --- STYLES: MAJOR CHANGES BELOW ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: InkrTheme.colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: InkrTheme.spacing.lg,
    paddingVertical: InkrTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: InkrTheme.colors.divider,
    backgroundColor: InkrTheme.colors.surface,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: InkrTheme.spacing.sm,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: InkrTheme.spacing.sm,
  },
  headerTitle: {
    fontSize: InkrTheme.typography.sizes.lg,
    fontWeight: InkrTheme.typography.weights.semibold,
    color: InkrTheme.colors.text.main,
  },
  smallHeaderBtn: { height: 36, paddingHorizontal: InkrTheme.spacing.md },
  clearButton: {
    paddingHorizontal: InkrTheme.spacing.md,
    height: 36,
  },
  contextBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: InkrTheme.spacing.lg,
    paddingVertical: InkrTheme.spacing.sm,
    backgroundColor: InkrTheme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: InkrTheme.colors.divider,
  },
  contextText: {
    fontSize: InkrTheme.typography.sizes.xs,
    color: InkrTheme.colors.text.muted,
  },
  contextToggle: { height: 30, paddingHorizontal: InkrTheme.spacing.md },
  contextChips: {
    maxHeight: 46,
    backgroundColor: InkrTheme.colors.surface,
    paddingHorizontal: InkrTheme.spacing.lg,
    paddingBottom: InkrTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: InkrTheme.colors.divider,
  },
  contextChip: {
    backgroundColor: InkrTheme.colors.primary + "18",
    paddingHorizontal: InkrTheme.spacing.md,
    paddingVertical: InkrTheme.spacing.sm / 2,
    borderRadius: InkrTheme.borderRadius.full,
    marginRight: InkrTheme.spacing.sm,
  },
  contextChipText: {
    fontSize: InkrTheme.typography.sizes.xs,
    color: InkrTheme.colors.primary,
    fontWeight: InkrTheme.typography.weights.medium,
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: InkrTheme.spacing.lg,
    paddingTop: InkrTheme.spacing.md,
  },
  welcomeSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: InkrTheme.spacing.xxl,
  },
  welcomeIcon: {
    width: 80,
    height: 80,
    borderRadius: InkrTheme.borderRadius.xl,
    backgroundColor: InkrTheme.colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: InkrTheme.spacing.lg,
  },
  welcomeTitle: {
    fontSize: InkrTheme.typography.sizes.title,
    fontWeight: InkrTheme.typography.weights.bold,
    color: InkrTheme.colors.text.main,
    marginBottom: InkrTheme.spacing.sm,
  },
  welcomeDescription: {
    fontSize: InkrTheme.typography.sizes.base,
    color: InkrTheme.colors.text.muted,
    textAlign: "center",
    lineHeight:
      InkrTheme.typography.lineHeights.relaxed *
      InkrTheme.typography.sizes.base,
    marginBottom: InkrTheme.spacing.xl,
  },
  suggestionsSection: {
    width: "100%",
    maxWidth: 300,
  },
  suggestionsTitle: {
    fontSize: InkrTheme.typography.sizes.base,
    fontWeight: InkrTheme.typography.weights.semibold,
    color: InkrTheme.colors.text.main,
    marginBottom: InkrTheme.spacing.md,
    textAlign: "center",
  },
  suggestionCard: {
    marginBottom: InkrTheme.spacing.sm,
    padding: InkrTheme.spacing.md,
  },
  suggestionText: {
    fontSize: InkrTheme.typography.sizes.sm,
    color: InkrTheme.colors.text.main,
    textAlign: "center",
  },
  messageContainer: {
    marginBottom: InkrTheme.spacing.md,
    padding: InkrTheme.spacing.md,
    borderRadius: InkrTheme.borderRadius.lg,
    maxWidth: "85%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: InkrTheme.colors.primary,
  },
  assistantMessage: {
    alignSelf: "flex-start",
    backgroundColor: InkrTheme.colors.surface,
    borderWidth: 1,
    borderColor: InkrTheme.colors.border,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: InkrTheme.spacing.sm,
  },
  messageSender: {
    flexDirection: "row",
    alignItems: "center",
    gap: InkrTheme.spacing.sm / 2,
  },
  senderText: {
    fontSize: InkrTheme.typography.sizes.xs,
    fontWeight: InkrTheme.typography.weights.semibold,
  },
  userSenderText: {
    color: InkrTheme.colors.text.inverse,
  },
  assistantSenderText: {
    color: InkrTheme.colors.primary,
  },
  messageTime: {
    fontSize: InkrTheme.typography.sizes.xs,
  },
  userTimeText: {
    color: InkrTheme.colors.text.inverse + "80",
  },
  assistantTimeText: {
    color: InkrTheme.colors.text.muted,
  },
  messageText: {
    fontSize: InkrTheme.typography.sizes.base,
    lineHeight:
      InkrTheme.typography.lineHeights.relaxed *
      InkrTheme.typography.sizes.base,
  },
  userMessageText: {
    color: InkrTheme.colors.text.inverse,
  },
  assistantMessageText: {
    color: InkrTheme.colors.text.main,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: InkrTheme.spacing.sm,
  },
  loadingText: {
    fontSize: InkrTheme.typography.sizes.sm,
    color: InkrTheme.colors.text.muted,
    fontStyle: "italic",
  },

  // --- NEW DESIGN STYLES START HERE ---
  composer: {
    paddingTop: InkrTheme.spacing.sm,
    paddingBottom: InkrTheme.spacing.md,
    backgroundColor: InkrTheme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: InkrTheme.colors.divider,
  },
  followUpsWrapper: {
    marginBottom: InkrTheme.spacing.md,
  },
  followUpChip: {
    backgroundColor: InkrTheme.colors.surface,
    borderWidth: 1,
    borderColor: InkrTheme.colors.border,
    borderRadius: InkrTheme.borderRadius.full,
    paddingVertical: InkrTheme.spacing.sm,
    paddingHorizontal: InkrTheme.spacing.md,
    marginRight: InkrTheme.spacing.sm,
  },
  followUpText: {
    fontSize: InkrTheme.typography.sizes.xs,
    color: InkrTheme.colors.text.main,
    fontWeight: InkrTheme.typography.weights.medium,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: InkrTheme.spacing.sm,
    paddingHorizontal: InkrTheme.spacing.lg,
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    fontSize: InkrTheme.typography.sizes.base,
    color: InkrTheme.colors.text.main,
    paddingHorizontal: InkrTheme.spacing.md,
    paddingVertical: InkrTheme.spacing.sm,
    borderWidth: 1,
    borderColor: InkrTheme.colors.border,
    borderRadius: InkrTheme.borderRadius.lg,
    backgroundColor: InkrTheme.colors.surface,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: InkrTheme.borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2, // Align with input field baseline
  },
  sendButtonDisabled: {
    backgroundColor: InkrTheme.colors.surface + "AA",
  },
  inlineActions: {
    alignItems: "center",
    marginTop: InkrTheme.spacing.md,
  },
  inlineActionBtn: {
    backgroundColor: InkrTheme.colors.surface,
    borderWidth: 1,
    borderColor: InkrTheme.colors.border,
    borderRadius: InkrTheme.borderRadius.full,
    paddingVertical: InkrTheme.spacing.sm,
    paddingHorizontal: InkrTheme.spacing.md,
  },
  inlineActionText: {
    fontSize: InkrTheme.typography.sizes.xs,
    color: InkrTheme.colors.text.main,
    fontWeight: InkrTheme.typography.weights.medium,
  },
  fixedFooter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: InkrTheme.colors.divider,
    backgroundColor: InkrTheme.colors.surface,
    paddingHorizontal: InkrTheme.spacing.lg,
    paddingTop: InkrTheme.spacing.sm,
    // paddingBottom is set dynamically to respect safe area insets
    alignItems: "center",
  },
  footerButton: {
    width: "100%",
    maxWidth: 720,
  },
});
