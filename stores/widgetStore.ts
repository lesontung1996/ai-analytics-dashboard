import { defineStore } from "pinia";
import type {
  WidgetComponentType,
  ChartProps,
  TableProps,
} from "~/types/agent";

export interface ActiveWidget {
  component: WidgetComponentType;
  props: ChartProps | TableProps;
}

export const useWidgetStore = defineStore("widget", () => {
  const activeWidget = ref<ActiveWidget | null>(null);
  const isLoading = ref(false);

  const setActiveWidget = (widget: ActiveWidget) => {
    activeWidget.value = widget;
  };

  const clearWidget = () => {
    activeWidget.value = null;
  };

  const setLoading = (loading: boolean) => {
    isLoading.value = loading;
  };

  return {
    activeWidget,
    isLoading,
    setActiveWidget,
    clearWidget,
    setLoading,
  };
});
