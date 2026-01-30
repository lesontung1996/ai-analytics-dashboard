import type { Component } from "vue";
import type { WidgetComponentType } from "~/types/agent";
import WidgetChart from "~/components/widgets/WidgetChart/WidgetChart.vue";
import WidgetTable from "~/components/widgets/WidgetTable/WidgetTable.vue";

const widgetRegistry: Record<WidgetComponentType, Component> = {
  SalesChart: WidgetChart,
  KPIList: WidgetTable,
};

export const useWidgetRegistry = () => {
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
