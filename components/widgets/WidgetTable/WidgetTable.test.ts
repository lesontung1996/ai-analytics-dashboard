import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import WidgetTable from "./WidgetTable.vue";

describe("WidgetTable", () => {
  const defaultProps = {
    title: "Test Table",
    data: [
      { metric: "Revenue", value: 125000, change: "+15%" },
      { metric: "Users", value: 5420, change: "+8%" },
    ],
  };

  it("renders with correct props", async () => {
    const wrapper = await mountSuspended(WidgetTable, {
      props: defaultProps,
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find("table").exists()).toBe(true);
  });

  it("displays the title", async () => {
    const wrapper = await mountSuspended(WidgetTable, {
      props: defaultProps,
    });

    expect(wrapper.text()).toContain("Test Table");
    expect(wrapper.props("title")).toBe("Test Table");
  });

  it("renders table headers from data keys", async () => {
    const wrapper = await mountSuspended(WidgetTable, {
      props: defaultProps,
    });

    const headers = wrapper.findAll("th");
    expect(headers.length).toBeGreaterThan(0);
    expect(wrapper.text()).toContain("metric");
    expect(wrapper.text()).toContain("value");
    expect(wrapper.text()).toContain("change");
  });

  it("renders table rows with data", async () => {
    const wrapper = await mountSuspended(WidgetTable, {
      props: defaultProps,
    });

    const rows = wrapper.findAll("tbody tr");
    expect(rows.length).toBe(2);
    expect(wrapper.text()).toContain("Revenue");
    expect(wrapper.text()).toContain("125,000");
    expect(wrapper.text()).toContain("Users");
    expect(wrapper.text()).toContain("5,420");
  });

  it("formats numbers with locale string", async () => {
    const wrapper = await mountSuspended(WidgetTable, {
      props: {
        title: "Formatted Table",
        data: [
          { metric: "Revenue", value: 125000 },
          { metric: "Count", value: 5420 },
        ],
      },
    });

    expect(wrapper.text()).toContain("125,000");
    expect(wrapper.text()).toContain("5,420");
  });

  it("handles empty data array", async () => {
    const wrapper = await mountSuspended(WidgetTable, {
      props: {
        title: "Empty Table",
        data: [],
      },
    });

    expect(wrapper.text()).toContain("No data available");
    expect(wrapper.find("table").exists()).toBe(true);
  });

  it("updates table when data prop changes", async () => {
    const wrapper = await mountSuspended(WidgetTable, {
      props: defaultProps,
    });

    expect(wrapper.text()).toContain("Revenue");

    await wrapper.setProps({
      title: "Updated Table",
      data: [{ metric: "Sales", value: 50000, change: "+20%" }],
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Sales");
    expect(wrapper.text()).not.toContain("Revenue");
  });
});
