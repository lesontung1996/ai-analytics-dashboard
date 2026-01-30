<script setup lang="ts">
import { computed } from "vue";
import { useWidgetStore } from "~/stores/widgetStore";
import { useWidgetRegistry } from "~/composables/useWidgetRegistry";

const widgetStore = useWidgetStore();
const { getWidgetComponent } = useWidgetRegistry();

const activeWidgetComponent = computed(() => {
  if (!widgetStore.activeWidget) return null;
  return getWidgetComponent(widgetStore.activeWidget.component);
});

const widgetProps = computed(() => {
  if (!widgetStore.activeWidget) return null;
  return widgetStore.activeWidget.props;
});
</script>

<template>
  <div class="h-full w-full bg-gray-200 p-6">
    <Transition name="widget-fade" mode="out-in">
      <div
        v-if="activeWidgetComponent && widgetProps"
        :key="widgetStore.activeWidget?.component + '-' + widgetProps?.title"
        class="h-full"
      >
        <component :is="activeWidgetComponent" v-bind="widgetProps" />
      </div>
      <div
        v-else
        key="placeholder"
        class="h-full flex items-center justify-center bg-white rounded-lg shadow-lg"
      >
        <div class="text-center text-gray-400">
          <svg
            class="mx-auto h-16 w-16 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p class="text-xl font-medium">No widget active</p>
          <p class="text-sm mt-2">Ask a question to see analytics widgets</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.widget-fade-enter-active,
.widget-fade-leave-active {
  transition: opacity 0.3s ease;
}

.widget-fade-enter-from,
.widget-fade-leave-to {
  opacity: 0;
}
</style>
