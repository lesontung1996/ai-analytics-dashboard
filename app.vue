<template>
  <div class="h-screen w-screen overflow-hidden bg-gray-100">
    <div class="flex h-full flex-col-reverse md:flex-row">
      <!-- Left Panel: Chat Interface -->
      <div
        class="w-full md:w-2/5 h-2/5 md:h-full border-t md:border-r border-gray-200 bg-white shadow-lg md:shadow-none"
      >
        <ChatInterface />
      </div>

      <!-- Right Panel: Dynamic Canvas -->
      <div class="flex-1 w-full md:w-3/5 h-3/5 md:h-full">
        <DynamicCanvas />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatInterface from "~/components/ChatInterface/ChatInterface.vue";
import DynamicCanvas from "~/components/DynamicCanvas/DynamicCanvas.vue";

useHead({
  title: "AI Analytics Dashboard",
  meta: [
    { name: "description", content: "AI Analytics Dashboard" },
    { name: "keywords", content: "AI, Analytics, Dashboard" },
    { name: "author", content: "AI Analytics Dashboard" },
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    { name: "robots", content: "index, follow" },
    { name: "googlebot", content: "index, follow" },
    { name: "bingbot", content: "index, follow" },
    { name: "yandexbot", content: "index, follow" },
  ],
});
</script>
