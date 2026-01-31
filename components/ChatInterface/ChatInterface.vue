<template>
  <div class="flex flex-col h-full bg-gray-50">
    <!-- Messages Container -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
    >
      <ChatBubble
        v-for="message in messages"
        :key="message.id"
        :message="message"
        :is-active="activeMessageId === message.id"
        @click="handleMessageClick"
      />

      <!-- Thinking Indicator -->
      <div v-if="isThinking" class="flex justify-start">
        <div class="bg-white rounded-lg px-4 py-2 shadow-md">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div
              class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style="animation-delay: 0.1s"
            />
            <div
              class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style="animation-delay: 0.2s"
            />
            <span class="text-sm text-gray-600 ml-2">Thinking...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="border-t border-gray-200 p-4 bg-white">
      <form class="flex space-x-2" @submit.prevent="handleSubmit">
        <input
          v-model="inputText"
          type="text"
          name="user-input"
          placeholder="Ask a question..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          :disabled="isThinking"
          @keypress="handleKeyPress"
        />
        <button
          type="submit"
          name="send-button"
          :disabled="!inputText.trim() || isThinking"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, nextTick, watch } from "vue";
import { storeToRefs } from "pinia";
import { useChat } from "~/composables/useChat";
import { useChatStore } from "~/stores/chatStore";
import { useWidgetStore } from "~/stores/widgetStore";
import type { ChatMessage } from "~/types/agent";
import ChatBubble from "./ChatBubble.vue";

const { sendUserMessage, isThinking, messages } = useChat();
const chatStore = useChatStore();
const widgetStore = useWidgetStore();
const { activeMessageId } = storeToRefs(chatStore);

const inputText = ref("");
const messagesContainer = useTemplateRef("messagesContainer");

const handleMessageClick = (message: ChatMessage) => {
  // Only handle clicks on agent messages with widget actions
  if (message.role !== "agent" || !message.widgetAction) return;

  // Set this message as active (highlighted)
  chatStore.setActiveMessageId(message.id);

  // Display the widget associated with this message
  widgetStore.setActiveWidget({
    component: message.widgetAction.component,
    props: message.widgetAction.props,
  });
};

const handleSubmit = async () => {
  if (!inputText.value.trim() || isThinking.value) return;

  const message = inputText.value;
  inputText.value = "";

  await sendUserMessage(message);

  await nextTick();
  scrollToBottom();
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

watch(
  messages,
  () => {
    nextTick(() => {
      scrollToBottom();
    });
  },
  { deep: true },
);

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleSubmit();
  }
};
</script>

<style scoped>
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
