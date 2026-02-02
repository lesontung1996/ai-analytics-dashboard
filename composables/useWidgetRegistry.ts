import type { Component } from "vue";
import type { WidgetComponentType } from "~/types/agent";

const widgetRegistry: Record<WidgetComponentType, Component> = {
  SalesChart: defineAsyncComponent(
    () => import("~/components/widgets/WidgetChart/WidgetChart.vue"),
  ),
  KPIList: defineAsyncComponent(
    () => import("~/components/widgets/WidgetTable/WidgetTable.vue"),
  ),
};

/**
 * Composable for accessing the widget registry and resolving widget components.
 * Provides a centralized way to map widget type names to their implementations.
 *
 * @returns Object containing the registry and lookup function
 * @returns {Function} getWidgetComponent - Resolves a widget type to its component
 * @returns {Record} widgetRegistry - Direct access to the widget registry
 *
 * @example
 * ```ts
 * const { getWidgetComponent } = useWidgetRegistry();
 * const ChartComponent = getWidgetComponent('SalesChart');
 * ```
 */
export const useWidgetRegistry = () => {
  /**
   * Retrieves the Vue component for a given widget type.
   *
   * @param componentName - The widget type name to look up
   * @returns The Vue component for the widget, or undefined if not found
   */
  const getWidgetComponent = (
    componentName: WidgetComponentType,
  ): Component | undefined => {
    return widgetRegistry[componentName];
  };

  return {
    getWidgetComponent,
    widgetRegistry,
  };
};
