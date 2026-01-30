import { defineStore } from "pinia";
import type { ChatMessage } from "~/types/agent";

export const useChatStore = defineStore("chat", () => {
  const messages = ref<ChatMessage[]>([]);
  const activeMessageId = ref<string | null>(null);

  const lastMessage = computed(() => {
    return messages.value[messages.value.length - 1];
  });

  const messageCount = computed(() => {
    return messages.value.length;
  });

  const addMessage = (message: ChatMessage) => {
    messages.value.push(message);
  };

  const clearMessages = () => {
    messages.value = [];
    activeMessageId.value = null;
  };

  const updateMessage = (id: string, updates: Partial<ChatMessage>) => {
    const message = messages.value.find((m) => m.id === id);
    if (message) {
      Object.assign(message, updates);
    }
  };

  const setActiveMessageId = (id: string | null) => {
    activeMessageId.value = id;
  };

  return {
    messages,
    activeMessageId,
    lastMessage,
    messageCount,
    addMessage,
    clearMessages,
    updateMessage,
    setActiveMessageId,
  };
});
