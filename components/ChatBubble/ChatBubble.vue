<template>
  <div
    class="flex"
    :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
  >
    <!-- Clickable agent message with widget action -->
    <button
      v-if="message.role === 'agent' && message.widgetAction"
      type="button"
      class="max-w-[80%] rounded-lg px-4 py-2 transition-all duration-200 text-left bg-white text-gray-800 shadow-md cursor-pointer hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2"
      :class="[isActive ? 'ring-2 ring-blue-500 ring-offset-2' : '']"
      @click="$emit('click', message)"
    >
      <div class="text-sm font-bold mb-1">AI Agent</div>
      <div class="whitespace-pre-wrap">
        {{ message.content }}
        <span class="sr-only">Click to show the widget</span>
      </div>
      <div class="text-xs mt-1 opacity-70">
        {{ new Date(message.timestamp).toLocaleTimeString() }}
      </div>
    </button>

    <!-- Non-clickable messages (user messages or agent messages without widget) -->
    <div
      v-else
      class="max-w-[80%] rounded-lg px-4 py-2 transition-all duration-200"
      :class="[
        message.role === 'user'
          ? 'bg-blue-500 text-white shadow-md'
          : 'bg-white text-gray-800 shadow-md',
      ]"
    >
      <div v-if="message.role === 'agent'" class="text-sm font-bold mb-1">
        AI Agent
      </div>
      <div class="whitespace-pre-wrap">
        {{ message.content }}
      </div>
      <div class="text-xs mt-1 opacity-70">
        {{ new Date(message.timestamp).toLocaleTimeString() }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessage } from "~/types/agent";

defineProps<{
  message: ChatMessage;
  isActive: boolean;
}>();

defineEmits<{
  click: [message: ChatMessage];
}>();
</script>
