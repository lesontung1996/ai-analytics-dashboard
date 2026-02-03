import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ChatMessage } from "~/types/agent";

/**
 * Pinia store for managing chat state including messages and active message tracking.
 *
 * @returns Store with messages state, computed properties, and mutation methods
 *
 * @example
 * ```ts
 * const chatStore = useChatStore();
 * chatStore.addMessage({ id: 'msg-1', role: 'user', content: 'Hello', timestamp: new Date() });
 * ```
 */
export const useChatStore = defineStore("chat", () => {
  const messages = ref<ChatMessage[]>([]);
  const activeMessageId = ref<string | null>(null);

  /**
   * Computed property returning the most recent message in the chat.
   * @returns The last ChatMessage or undefined if no messages exist
   */
  const lastMessage = computed(() => {
    return messages.value[messages.value.length - 1];
  });

  const addMessage = (message: ChatMessage) => {
    messages.value.push(message);
  };

  const clearMessages = () => {
    messages.value = [];
    activeMessageId.value = null;
  };

  /**
   * Updates an existing message with partial data.
   * If no message with the given ID exists, the operation is silently ignored.
   *
   * @param id - The ID of the message to update
   * @param updates - Partial ChatMessage object with properties to update
   */
  const updateMessage = (id: string, updates: Partial<ChatMessage>) => {
    const message = messages.value.find((m) => m.id === id);
    if (message) {
      Object.assign(message, updates);
    }
  };

  /**
   * Sets the currently active message ID.
   * Used to track which message's widget is currently displayed.
   *
   * @param id - The message ID to set as active, or null to clear
   */
  const setActiveMessageId = (id: string | null) => {
    activeMessageId.value = id;
  };

  return {
    messages,
    activeMessageId,
    lastMessage,
    addMessage,
    clearMessages,
    updateMessage,
    setActiveMessageId,
  };
});
