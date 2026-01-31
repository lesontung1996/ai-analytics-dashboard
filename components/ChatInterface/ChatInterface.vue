<template>
  <div class="flex flex-col h-full bg-gray-50">
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

      <ThinkingIndicator v-if="isThinking" />
    </div>

    <ChatInput :disabled="isThinking" @submit="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef, nextTick, watch } from "vue";
import { storeToRefs } from "pinia";
import { useChat } from "~/composables/useChat";
import { useChatStore } from "~/stores/chatStore";
import { useWidgetStore } from "~/stores/widgetStore";
import type { ChatMessage } from "~/types/agent";
import ChatBubble from "~/components/ChatBubble/ChatBubble.vue";
import ThinkingIndicator from "~/components/ThinkingIndicator/ThinkingIndicator.vue";
import ChatInput from "~/components/ChatInput/ChatInput.vue";

const { sendUserMessage, isThinking, messages } = useChat();
const chatStore = useChatStore();
const widgetStore = useWidgetStore();
const { activeMessageId } = storeToRefs(chatStore);

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

const handleSubmit = async (message: string) => {
  if (isThinking.value) return;

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
</script>
