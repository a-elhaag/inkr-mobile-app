import { InkrTheme } from "@/constants/Theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface MarkdownProps {
  content: string;
}

// Very lightweight markdown renderer for headings, bold, italic, bullet lists, code blocks
export const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  const lines = content.split(/\r?\n/);

  return (
    <View style={styles.container}>
      {lines.map((raw, idx) => {
        // Code fence
        if (raw.trim().startsWith("```")) {
          return (
            <View key={idx} style={styles.codeFence}>
              <Text style={styles.codeText}>{raw.replace(/```/g, "")}</Text>
            </View>
          );
        }
        // Headings
        const headingMatch = raw.match(/^(#{1,3})\s+(.*)/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          return (
            <Text
              key={idx}
              style={[
                styles.text,
                level === 1 && styles.h1,
                level === 2 && styles.h2,
                level === 3 && styles.h3,
              ]}
            >
              {headingMatch[2]}
            </Text>
          );
        }
        // Bullet list
        if (/^([-*])\s+/.test(raw)) {
          const item = raw.replace(/^([-*])\s+/, "");
          return (
            <View key={idx} style={styles.bulletRow}>
              <Text style={styles.bulletSymbol}>{"•"}</Text>
              <Text style={styles.text}>{renderInline(item, idx)}</Text>
            </View>
          );
        }
        // Blank line spacing
        if (raw.trim() === "") {
          return <View key={idx} style={styles.blank} />;
        }
        return (
          <Text key={idx} style={styles.text}>
            {renderInline(raw, idx)}
          </Text>
        );
      })}
    </View>
  );
};

function renderInline(text: string, parentIdx: number) {
  const segments: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;
  const patterns: Array<{ regex: RegExp; type: "bold" | "italic" | "code" }> = [
    { regex: /\*\*(.+?)\*\*/, type: "bold" },
    { regex: /\*(.+?)\*/, type: "italic" },
    { regex: /`([^`]+?)`/, type: "code" },
  ];

  while (remaining.length) {
    let earliestIndex = Infinity;
    let matchType: "bold" | "italic" | "code" | null = null;
    let match: RegExpExecArray | null = null;

    for (const p of patterns) {
      const m = p.regex.exec(remaining);
      if (m && m.index < earliestIndex) {
        earliestIndex = m.index;
        matchType = p.type;
        match = m;
      }
    }
    if (!match || matchType === null) {
      segments.push(<Text key={`${parentIdx}-${key++}`}>{remaining}</Text>);
      break;
    }
    if (earliestIndex > 0) {
      segments.push(
        <Text key={`${parentIdx}-${key++}`}>
          {remaining.slice(0, earliestIndex)}
        </Text>
      );
    }
    const captured = match[1];
    const afterIndex = earliestIndex + match[0].length;
    if (matchType === "bold") {
      segments.push(
        <Text key={`${parentIdx}-${key++}`} style={styles.bold}>
          {captured}
        </Text>
      );
    } else if (matchType === "italic") {
      segments.push(
        <Text key={`${parentIdx}-${key++}`} style={styles.italic}>
          {captured}
        </Text>
      );
    } else if (matchType === "code") {
      segments.push(
        <Text key={`${parentIdx}-${key++}`} style={styles.codeInline}>
          {captured}
        </Text>
      );
    }
    remaining = remaining.slice(afterIndex);
  }
  return segments;
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  text: {
    color: InkrTheme.colors.text.main,
    fontSize: InkrTheme.typography.sizes.base,
    lineHeight:
      InkrTheme.typography.lineHeights.relaxed *
      InkrTheme.typography.sizes.base,
    marginBottom: 4,
  },
  h1: {
    fontSize: InkrTheme.typography.sizes.xl,
    fontWeight: InkrTheme.typography.weights.bold,
    marginTop: 8,
  },
  h2: {
    fontSize: InkrTheme.typography.sizes.lg,
    fontWeight: InkrTheme.typography.weights.semibold,
    marginTop: 8,
  },
  h3: {
    fontSize: InkrTheme.typography.sizes.base,
    fontWeight: InkrTheme.typography.weights.semibold,
    marginTop: 6,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  bulletSymbol: {
    color: InkrTheme.colors.primary,
    marginRight: 8,
    lineHeight:
      InkrTheme.typography.lineHeights.normal * InkrTheme.typography.sizes.base,
  },
  bold: { fontWeight: InkrTheme.typography.weights.semibold },
  italic: { fontStyle: "italic" },
  codeInline: {
    fontFamily: "Menlo",
    backgroundColor: InkrTheme.colors.surface,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  codeFence: {
    backgroundColor: InkrTheme.colors.surface,
    padding: 8,
    borderRadius: 6,
    marginVertical: 8,
  },
  codeText: {
    fontFamily: "Menlo",
    color: InkrTheme.colors.text.main,
    fontSize: InkrTheme.typography.sizes.sm,
  },
  blank: { height: 8 },
});

export default Markdown;
