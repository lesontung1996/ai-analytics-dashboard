import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ChatBubble from "./ChatBubble.vue";
import type { ChatMessage } from "~/types/agent";

const mockAgentMessage: ChatMessage = {
  id: "msg-1",
  role: "agent",
  content: "Test message",
  timestamp: new Date("2026-01-01T12:00:00"),
  widgetAction: {
    type: "render_widget",
    component: "SalesChart",
    props: { title: "Sales Chart", data: [100, 200, 300] },
  },
};

const mockUserMessage: ChatMessage = {
  id: "msg-2",
  role: "user",
  content: "Show me the sales chart",
  timestamp: new Date("2026-01-01T12:00:00"),
};

describe("ChatBubble", () => {
  it("renders user message correctly", async () => {
    const wrapper = await mountSuspended(ChatBubble, {
      props: { message: mockUserMessage, isActive: false },
    });
    expect(wrapper.text()).toContain("Show me the sales chart");
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("renders agent message correctl and emits click event when clicking on it", async () => {
    const wrapper = await mountSuspended(ChatBubble, {
      props: { message: mockAgentMessage, isActive: false },
    });

    await wrapper.find("button").trigger("click");

    expect(wrapper.emitted("click")).toBeTruthy();
    expect(wrapper.emitted("click")![0]).toEqual([mockAgentMessage]);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
