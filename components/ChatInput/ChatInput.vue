<template>
  <div class="border-t border-gray-200 p-4 bg-white">
    <form class="flex space-x-2" @submit.prevent="handleSubmit">
      <input
        v-model="inputText"
        type="text"
        name="user-input"
        placeholder="Ask a question..."
        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        :disabled="disabled"
        @keypress="handleKeyPress"
      >
      <button
        type="submit"
        name="send-button"
        :disabled="!inputText.trim() || disabled"
        class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Send
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  disabled?: boolean;
}>();

const emit = defineEmits<{
  submit: [message: string];
}>();

const inputText = ref("");

const handleSubmit = () => {
  if (!inputText.value.trim()) return;

  emit("submit", inputText.value.trim());
  inputText.value = "";
};

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleSubmit();
  }
};
</script>
