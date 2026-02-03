import { defineStore } from "pinia";
import { ref } from "vue";
import type {
  WidgetComponentType,
  ChartProps,
  TableProps,
} from "~/types/agent";

export interface ActiveWidget {
  component: WidgetComponentType;
  props: ChartProps | TableProps;
}

/**
 * Pinia store for managing the active widget displayed on the dynamic canvas.
 * Handles widget state and loading indicators.
 *
 * @returns Store with widget state and mutation methods
 *
 * @example
 * ```ts
 * const widgetStore = useWidgetStore();
 * widgetStore.setActiveWidget({ component: 'SalesChart', props: { title: 'Revenue', data: [1,2,3] } });
 * ```
 */
export const useWidgetStore = defineStore("widget", () => {
  const activeWidget = ref<ActiveWidget | null>(null);

  const setActiveWidget = (widget: ActiveWidget) => {
    activeWidget.value = widget;
  };

  const clearWidget = () => {
    activeWidget.value = null;
  };

  return {
    activeWidget,
    setActiveWidget,
    clearWidget,
  };
});
