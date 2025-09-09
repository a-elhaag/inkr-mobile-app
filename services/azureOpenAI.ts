/**
 * Azure OpenAI Service
 * Service for interacting with Azure OpenAI API
 */

import { AZURE_CONFIG, AZURE_OPENAI_URL } from "../config/azure";

export interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenAIResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

class AzureOpenAIService {
  private async makeRequest(messages: OpenAIMessage[]): Promise<string> {
    try {
      const response = await fetch(AZURE_OPENAI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": AZURE_CONFIG.OPENAI_API_KEY,
        },
        body: JSON.stringify({
          messages,
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || "No response generated";
    } catch (error) {
      console.error("Azure OpenAI API error:", error);
      throw new Error("Failed to get AI response");
    }
  }

  async summarizeNote(content: string): Promise<string> {
    const messages: OpenAIMessage[] = [
      {
        role: "system",
        content:
          "You are a helpful assistant that creates concise summaries of notes. Provide a clear, brief summary that captures the main points.",
      },
      {
        role: "user",
        content: `Please summarize this note: ${content}`,
      },
    ];

    return this.makeRequest(messages);
  }

  async generateTags(content: string): Promise<string[]> {
    const messages: OpenAIMessage[] = [
      {
        role: "system",
        content:
          "You are a helpful assistant that generates relevant tags for notes. Return only 3-5 relevant tags as a comma-separated list.",
      },
      {
        role: "user",
        content: `Generate tags for this note: ${content}`,
      },
    ];

    const response = await this.makeRequest(messages);
    return response
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  }

  async chatWithNotes(question: string, notesContext: string): Promise<string> {
    const messages: OpenAIMessage[] = [
      {
        role: "system",
        content:
          "You are an intelligent assistant that helps users interact with their notes. You can answer questions about the notes, provide insights, and help with organization. Be helpful and concise.",
      },
      {
        role: "user",
        content: `Based on these notes: ${notesContext}\n\nQuestion: ${question}`,
      },
    ];

    return this.makeRequest(messages);
  }

  async enhanceNote(content: string): Promise<string> {
    const messages: OpenAIMessage[] = [
      {
        role: "system",
        content:
          "You are a helpful assistant that enhances and improves notes. Make the content clearer, better organized, and more comprehensive while maintaining the original meaning.",
      },
      {
        role: "user",
        content: `Please enhance this note: ${content}`,
      },
    ];

    return this.makeRequest(messages);
  }

  async rewriteNote(content: string): Promise<string> {
    const messages: OpenAIMessage[] = [
      {
        role: "system",
        content:
          "You rewrite notes in clean, concise Apple Notes style markdown. Preserve factual meaning, remove redundancy, improve clarity, and structure with simple headings and lists where natural. Return ONLY the rewritten markdown (no extra commentary).",
      },
      {
        role: "user",
        content: `Rewrite this note in improved concise markdown style:\n\n${content}`,
      },
    ];
    return this.makeRequest(messages);
  }
}

export const azureOpenAIService = new AzureOpenAIService();
