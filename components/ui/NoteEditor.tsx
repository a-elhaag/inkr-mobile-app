import { InkrTheme } from "@/constants/Theme";
import { azureOpenAIService } from "@/services/azureOpenAI";
import { Note } from "@/types/models";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { IconSymbol } from "./IconSymbol";
import { InkrButton } from "./InkrButton";
import Markdown from "./Markdown";

interface NoteEditorProps {
  initial?: Partial<Note>;
  onSave: (data: {
    title: string;
    content: string;
    tags: string[];
    summary?: string;
  }) => Promise<void> | void;
  autoFocus?: boolean;
  variant?: "create" | "edit";
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  initial,
  onSave,
  autoFocus,
  variant = "create",
}) => {
  const [title, setTitle] = useState(initial?.title || "");
  const [content, setContent] = useState(initial?.content || "");
  const [summary, setSummary] = useState<string | undefined>(initial?.summary);
  const [tags, setTags] = useState<string[]>(initial?.tags || []);
  const [isProcessing, setIsProcessing] = useState(false);
  const [didRewrite, setDidRewrite] = useState(false);
  const [originalBeforeRewrite, setOriginalBeforeRewrite] = useState<
    string | null
  >(null);
  const [preview, setPreview] = useState(false);
  const [showMeta, setShowMeta] = useState(true); // collapse summary & tags section

  useEffect(() => {
    setTitle(initial?.title || "");
    setContent(initial?.content || "");
    setSummary(initial?.summary);
    setTags(initial?.tags || []);
  }, [initial?.title, initial?.content, initial?.summary, initial?.tags]);

  const enhance = async () => {
    if (!content.trim()) return Alert.alert("Add content first");
    setIsProcessing(true);
    try {
      const s = await azureOpenAIService.summarizeNote(content);
      setSummary(s);
      const g = await azureOpenAIService.generateTags(content);
      setTags(g);
    } catch (e) {
      Alert.alert("Enhance failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const rewrite = async () => {
    if (!content.trim()) return Alert.alert("Add content first");
    setIsProcessing(true);
    try {
      setOriginalBeforeRewrite(content);
      const r = await azureOpenAIService.rewriteNote(content);
      setContent(r.trim());
      setDidRewrite(true);
    } catch (e) {
      Alert.alert("Rewrite failed");
      setOriginalBeforeRewrite(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const undoRewrite = () => {
    if (originalBeforeRewrite) {
      setContent(originalBeforeRewrite);
      setOriginalBeforeRewrite(null);
      setDidRewrite(false);
    }
  };

  const removeTag = (idx: number) =>
    setTags((t) => t.filter((_, i) => i !== idx));

  const deriveTitle = useCallback(() => {
    if (title.trim()) return title.trim();
    const firstLine = content.split("\n").find((l) => l.trim());
    return firstLine?.trim().slice(0, 60) || "Untitled Note";
  }, [title, content]);

  const handleSave = () => {
    if (!title.trim() && !content.trim())
      return Alert.alert("Empty", "Add some content.");
    onSave({ title: deriveTitle(), content: content.trim(), tags, summary });
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <TextInput
          style={styles.titleInput}
          autoFocus={autoFocus}
          placeholder="Title"
          placeholderTextColor={InkrTheme.colors.text.muted}
          value={title}
          onChangeText={setTitle}
          multiline
        />
        <View style={styles.toolbarRow}>
          <View style={styles.leftTools}>
            <TouchableOpacity
              style={styles.toolButton}
              disabled={isProcessing || !content.trim()}
              onPress={enhance}
            >
              {isProcessing ? (
                <ActivityIndicator size={16} color={InkrTheme.colors.primary} />
              ) : (
                <IconSymbol
                  name="sparkles"
                  size={18}
                  color={InkrTheme.colors.primary}
                />
              )}
              <Text style={styles.toolText}>Enhance</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.toolButton}
              disabled={isProcessing || !content.trim()}
              onPress={didRewrite ? undoRewrite : rewrite}
            >
              <IconSymbol
                name={didRewrite ? "arrow.uturn.left.circle" : "pencil"}
                size={18}
                color={
                  didRewrite
                    ? InkrTheme.colors.warning
                    : InkrTheme.colors.primary
                }
              />
              <Text style={styles.toolText}>
                {didRewrite ? "Undo" : "Rewrite"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.toolButton}
              onPress={() => setPreview((p) => !p)}
            >
              <IconSymbol
                name={
                  preview ? "square.and.pencil" : "doc.text.magnifyingglass"
                }
                size={18}
                color={InkrTheme.colors.primary}
              />
              <Text style={styles.toolText}>
                {preview ? "Edit" : "Preview"}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.metaToggle}
            onPress={() => setShowMeta((m) => !m)}
          >
            <IconSymbol
              name={showMeta ? "chevron.down" : "chevron.right"}
              size={14}
              color={InkrTheme.colors.text.muted}
            />
            <Text style={styles.metaToggleText}>Info</Text>
          </TouchableOpacity>
        </View>
        {preview ? (
          <View style={styles.previewContainer}>
            {content.trim() ? (
              <Markdown content={content} />
            ) : (
              <Text style={styles.previewPlaceholder}>Nothing to preview</Text>
            )}
          </View>
        ) : (
          <TextInput
            style={styles.bodyInput}
            placeholder="Start writing... (Markdown supported)"
            placeholderTextColor={InkrTheme.colors.text.muted}
            multiline
            value={content}
            onChangeText={setContent}
            textAlignVertical="top"
          />
        )}

        {showMeta && (
          <View style={styles.metaSection}>
            {summary && (
              <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>Summary</Text>
                <Text style={styles.summaryText}>{summary}</Text>
              </View>
            )}
            {tags.length > 0 && (
              <View style={styles.tagsWrap}>
                {tags.map((t, i) => (
                  <View key={t + i} style={styles.tagChip}>
                    <Text style={styles.tagText}>#{t}</Text>
                    <TouchableOpacity onPress={() => removeTag(i)}>
                      <IconSymbol
                        name="xmark"
                        size={12}
                        color={InkrTheme.colors.primary}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
        <View style={styles.saveButtonArea}>
          <InkrButton
            title={variant === "create" ? "Save" : "Update"}
            onPress={handleSave}
            variant="primary"
            icon={
              <IconSymbol
                name="tray.and.arrow.down.fill"
                size={18}
                color={InkrTheme.colors.text.inverse}
              />
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  scrollContent: { paddingBottom: InkrTheme.spacing.xl },
  titleInput: {
    fontSize: InkrTheme.typography.sizes.display,
    fontWeight: InkrTheme.typography.weights.bold,
    paddingHorizontal: InkrTheme.spacing.lg,
    paddingTop: InkrTheme.spacing.lg,
    paddingBottom: InkrTheme.spacing.md,
    color: InkrTheme.colors.text.main,
  },
  toolbarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: InkrTheme.spacing.lg,
    paddingBottom: InkrTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: InkrTheme.colors.divider,
    marginBottom: InkrTheme.spacing.sm,
  },
  leftTools: { flexDirection: "row", alignItems: "center" },
  toolButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: InkrTheme.spacing.md,
  },
  toolText: {
    marginLeft: 4,
    fontSize: InkrTheme.typography.sizes.sm,
    color: InkrTheme.colors.primary,
    fontWeight: InkrTheme.typography.weights.medium,
  },
  metaToggle: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    gap: 2,
  },
  metaToggleText: {
    fontSize: InkrTheme.typography.sizes.xs,
    color: InkrTheme.colors.text.muted,
    marginLeft: 2,
  },
  bodyInput: {
    minHeight: 240,
    fontSize: InkrTheme.typography.sizes.base,
    lineHeight: InkrTheme.typography.sizes.base * 1.4,
    paddingHorizontal: InkrTheme.spacing.lg,
    color: InkrTheme.colors.text.main,
    marginBottom: InkrTheme.spacing.md,
  },
  previewContainer: {
    paddingHorizontal: InkrTheme.spacing.lg,
    paddingBottom: InkrTheme.spacing.md,
  },
  previewPlaceholder: {
    color: InkrTheme.colors.text.muted,
    fontStyle: "italic",
  },
  metaSection: {
    paddingHorizontal: InkrTheme.spacing.lg,
    gap: InkrTheme.spacing.md,
    marginBottom: InkrTheme.spacing.lg,
  },
  summaryBox: {
    backgroundColor: InkrTheme.colors.primary + "12",
    padding: InkrTheme.spacing.md,
    borderRadius: InkrTheme.borderRadius.sm,
  },
  summaryLabel: {
    fontSize: InkrTheme.typography.sizes.xs,
    color: InkrTheme.colors.primary,
    fontWeight: InkrTheme.typography.weights.medium,
    marginBottom: 4,
  },
  summaryText: {
    fontSize: InkrTheme.typography.sizes.sm,
    color: InkrTheme.colors.text.main,
  },
  tagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: InkrTheme.spacing.sm,
  },
  tagChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: InkrTheme.colors.primary + "1A",
    paddingHorizontal: InkrTheme.spacing.sm,
    paddingVertical: 4,
    borderRadius: InkrTheme.borderRadius.full,
  },
  tagText: {
    fontSize: InkrTheme.typography.sizes.xs,
    color: InkrTheme.colors.primary,
    marginRight: 4,
  },
  saveButtonArea: {
    paddingHorizontal: InkrTheme.spacing.lg,
    marginBottom: InkrTheme.spacing.xl,
  },
});

export default NoteEditor;
