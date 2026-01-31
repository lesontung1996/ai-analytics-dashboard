import { describe, it, expect, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import DynamicCanvas from "./DynamicCanvas.vue";
import type { ActiveWidget } from "~/stores/widgetStore";

describe("DynamicCanvas", () => {
  // Stores and composables are auto-imported via @nuxt/test-utils
  let widgetStore: ReturnType<typeof useWidgetStore>;
  let widgetRegistry: ReturnType<typeof useWidgetRegistry>;

  beforeEach(async () => {
    widgetStore = useWidgetStore();
    widgetRegistry = useWidgetRegistry();
    widgetStore.clearWidget();
    widgetStore.setLoading(false);
  });

  it("renders placeholder when no widget is active", async () => {
    widgetStore.clearWidget();
    const wrapper = await mountSuspended(DynamicCanvas);

    expect(wrapper.text()).toContain("No widget active");
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("displays widget when activeWidget is set", async () => {
    const activeWidget: ActiveWidget = {
      component: "SalesChart",
      props: { title: "Test Chart", data: [1, 2, 3] },
    };

    widgetStore.setActiveWidget(activeWidget);
    const wrapper = await mountSuspended(DynamicCanvas);

    const widgetComponent = widgetRegistry.getWidgetComponent("SalesChart");
    expect(widgetComponent).toBeDefined();
    expect(wrapper.text()).not.toContain("No widget active");
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("updates widget when store activeWidget changes", async () => {
    const wrapper = await mountSuspended(DynamicCanvas);
    expect(wrapper.text()).toContain("No widget active");

    const activeWidget: ActiveWidget = {
      component: "KPIList",
      props: {
        title: "Test Table",
        data: [{ metric: "Revenue", value: 125000, change: "+15%" }],
      },
    };

    widgetStore.setActiveWidget(activeWidget);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).not.toContain("No widget active");
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("clears widget when clearWidget is called", async () => {
    const activeWidget: ActiveWidget = {
      component: "SalesChart",
      props: { title: "Test Chart", data: [1, 2, 3] },
    };

    widgetStore.setActiveWidget(activeWidget);
    const wrapper = await mountSuspended(DynamicCanvas);

    widgetStore.clearWidget();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("No widget active");
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders SalesChart widget with props", async () => {
    const activeWidget: ActiveWidget = {
      component: "SalesChart",
      props: { title: "Revenue Chart", data: [10, 20, 30] },
    };

    widgetStore.setActiveWidget(activeWidget);
    const wrapper = await mountSuspended(DynamicCanvas);

    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(wrapper.text()).toContain("Revenue Chart");
    expect(wrapper.find("canvas").exists()).toBe(true);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders KPIList widget with props", async () => {
    const activeWidget: ActiveWidget = {
      component: "KPIList",
      props: {
        title: "Key Metrics",
        data: [
          { metric: "Revenue", value: 125000, change: "+15%" },
          { metric: "Users", value: 5420, change: "+8%" },
        ],
      },
    };

    widgetStore.setActiveWidget(activeWidget);
    const wrapper = await mountSuspended(DynamicCanvas);

    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Key Metrics");
    expect(wrapper.find("table").exists()).toBe(true);
    expect(wrapper.text()).toContain("Revenue");
    expect(wrapper.html()).toMatchSnapshot();
  });
});
