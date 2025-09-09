/**
 * Note Storage Service
 * Local storage service for notes using AsyncStorage
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChatMessage, Note } from "../types/models";

const NOTES_KEY = "inkr_notes";
const CHAT_HISTORY_KEY = "inkr_chat_history";
// voice memos removed

class StorageService {
  // Notes Management
  async saveNotes(notes: Note[]): Promise<void> {
    try {
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error("Error saving notes:", error);
      throw new Error("Failed to save notes");
    }
  }

  async loadNotes(): Promise<Note[]> {
    try {
      const notesJson = await AsyncStorage.getItem(NOTES_KEY);
      return notesJson ? JSON.parse(notesJson) : [];
    } catch (error) {
      console.error("Error loading notes:", error);
      return [];
    }
  }

  async getNote(noteId: string): Promise<Note | undefined> {
    const notes = await this.loadNotes();
    return notes.find((n) => n.id === noteId);
  }

  async saveNote(note: Note): Promise<void> {
    try {
      const notes = await this.loadNotes();
      const existingIndex = notes.findIndex((n) => n.id === note.id);

      if (existingIndex >= 0) {
        notes[existingIndex] = note;
      } else {
        notes.unshift(note);
      }

      await this.saveNotes(notes);
    } catch (error) {
      console.error("Error saving note:", error);
      throw new Error("Failed to save note");
    }
  }

  async deleteNote(noteId: string): Promise<void> {
    try {
      const notes = await this.loadNotes();
      const filteredNotes = notes.filter((note) => note.id !== noteId);
      await this.saveNotes(filteredNotes);
    } catch (error) {
      console.error("Error deleting note:", error);
      throw new Error("Failed to delete note");
    }
  }

  // Chat History Management
  async saveChatHistory(messages: ChatMessage[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("Error saving chat history:", error);
      throw new Error("Failed to save chat history");
    }
  }

  async loadChatHistory(): Promise<ChatMessage[]> {
    try {
      const chatJson = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
      return chatJson ? JSON.parse(chatJson) : [];
    } catch (error) {
      console.error("Error loading chat history:", error);
      return [];
    }
  }

  async addChatMessage(message: ChatMessage): Promise<void> {
    try {
      const history = await this.loadChatHistory();
      history.push(message);
      await this.saveChatHistory(history);
    } catch (error) {
      console.error("Error adding chat message:", error);
      throw new Error("Failed to add chat message");
    }
  }

  // Voice memos removed from storage service

  // Clear all data
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([NOTES_KEY, CHAT_HISTORY_KEY]);
    } catch (error) {
      console.error("Error clearing data:", error);
      throw new Error("Failed to clear data");
    }
  }
}

export const storageService = new StorageService();
