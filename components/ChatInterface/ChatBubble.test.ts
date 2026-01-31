import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ChatBubble from "./ChatBubble.vue";
import type { ChatMessage } from "~/types/agent";

const mockMessage: ChatMessage = {
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

describe("ChatBubble", () => {
  it("emits click event with message when clicking button", async () => {
    const wrapper = await mountSuspended(ChatBubble, {
      props: { message: mockMessage, isActive: false },
    });

    await wrapper.find("button").trigger("click");

    expect(wrapper.emitted("click")).toBeTruthy();
    expect(wrapper.emitted("click")![0]).toEqual([mockMessage]);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
