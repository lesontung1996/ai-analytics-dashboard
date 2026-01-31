import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ThinkingIndicator from "./ThinkingIndicator.vue";

describe("ThinkingIndicator", () => {
  it("renders correctly", async () => {
    const wrapper = await mountSuspended(ThinkingIndicator);
    expect(wrapper.text()).toContain("Thinking...");
    expect(wrapper.html()).toMatchSnapshot();
  });
});
