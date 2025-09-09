/**
 * Note Models and Types
 * Core data structures for the Inkr note-taking app
 */

export interface Note {
  id: string;
  title: string;
  content: string;
  summary?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isStarred: boolean;
}
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  noteId?: string;
}

export type NoteFilter = "all" | "starred" | "recent";
