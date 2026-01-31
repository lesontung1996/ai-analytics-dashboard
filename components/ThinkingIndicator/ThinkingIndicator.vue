<template>
  <div class="flex justify-start">
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
</template>

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
