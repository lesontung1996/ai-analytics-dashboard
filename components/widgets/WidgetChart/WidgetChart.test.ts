import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import WidgetChart from "./WidgetChart.vue";

describe("WidgetChart", () => {
  const defaultProps = {
    title: "Test Chart",
    data: [10, 20, 30, 40],
  };

  it("renders with correct props", async () => {
    const wrapper = await mountSuspended(WidgetChart, {
      props: defaultProps,
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find("canvas").exists()).toBe(true);
  });

  it("displays the title", async () => {
    const wrapper = await mountSuspended(WidgetChart, {
      props: defaultProps,
    });

    expect(wrapper.text()).toContain("Test Chart");
    expect(wrapper.props("title")).toBe("Test Chart");
  });

  it("accepts title and data props", async () => {
    const wrapper = await mountSuspended(WidgetChart, {
      props: {
        title: "Custom Title",
        data: [1, 2, 3],
      },
    });

    expect(wrapper.props("title")).toBe("Custom Title");
    expect(wrapper.props("data")).toEqual([1, 2, 3]);
    expect(wrapper.text()).toContain("Custom Title");
  });

  it("handles empty data array", async () => {
    const wrapper = await mountSuspended(WidgetChart, {
      props: {
        title: "Empty Chart",
        data: [],
      },
    });

    expect(wrapper.props("data")).toEqual([]);
    expect(wrapper.exists()).toBe(true);
  });

  it("updates title when prop changes", async () => {
    const wrapper = await mountSuspended(WidgetChart, {
      props: {
        title: "Initial Title",
        data: [1, 2, 3],
      },
    });

    expect(wrapper.text()).toContain("Initial Title");

    await wrapper.setProps({
      title: "Updated Title",
      data: [1, 2, 3],
    });
    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(wrapper.text()).toContain("Updated Title");
  });
});
