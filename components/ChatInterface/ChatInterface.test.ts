import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ChatInterface from "./ChatInterface.vue";

describe("ChatInterface", () => {
  let chatStore: ReturnType<typeof useChatStore>;
  let widgetStore: ReturnType<typeof useWidgetStore>;

  beforeEach(async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date("2026-01-01T12:00:00"));
    chatStore = useChatStore();
    widgetStore = useWidgetStore();
    chatStore.clearMessages();
    widgetStore.clearWidget();
    widgetStore.setLoading(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("displays messages from chatStore", async () => {
    chatStore.addMessage({
      id: "msg-1",
      role: "user",
      content: "Hello",
      timestamp: new Date(),
    });
    chatStore.addMessage({
      id: "msg-2",
      role: "agent",
      content: "Hi there!",
      timestamp: new Date(),
    });

    const wrapper = await mountSuspended(ChatInterface);
    expect(wrapper.text()).toContain("Hello");
    expect(wrapper.text()).toContain("Hi there!");
  });

  it("submits message and updates store", async () => {
    const wrapper = await mountSuspended(ChatInterface);
    const input = wrapper.find('input[type="text"]');
    const form = wrapper.find("form");

    await input.setValue("Test message");
    await form.trigger("submit");
    await wrapper.vm.$nextTick();

    const userMessages = chatStore.messages.filter((m) => m.role === "user");
    expect(userMessages.length).toBeGreaterThan(0);
    expect(userMessages[userMessages.length - 1].content.trim()).toBe(
      "Test message",
    );
  });

  it("shows thinking indicator after submission", async () => {
    const wrapper = await mountSuspended(ChatInterface);
    const input = wrapper.find('input[type="text"]');
    const form = wrapper.find("form");

    await input.setValue("Test message");
    form.trigger("submit");
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Thinking...");
  });

  it("matches snapshot", async () => {
    chatStore.addMessage({
      id: "msg-1",
      role: "user",
      content: "Hello",
      timestamp: new Date(),
    });

    const wrapper = await mountSuspended(ChatInterface);
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe("handleMessageClick", () => {
    it("does nothing when clicking a user message", async () => {
      chatStore.addMessage({
        id: "user-msg-1",
        role: "user",
        content: "Hello",
        timestamp: new Date(),
      });

      const wrapper = await mountSuspended(ChatInterface);
      const chatBubble = wrapper.findComponent({ name: "ChatBubble" });
      await chatBubble.vm.$emit("click", chatStore.messages[0]);

      expect(chatStore.activeMessageId).toBeNull();
      expect(widgetStore.activeWidget).toBeNull();
    });

    it("does nothing when clicking an agent message without widgetAction", async () => {
      chatStore.addMessage({
        id: "agent-msg-1",
        role: "agent",
        content: "Hello there!",
        timestamp: new Date(),
      });

      const wrapper = await mountSuspended(ChatInterface);
      const chatBubble = wrapper.findComponent({ name: "ChatBubble" });
      await chatBubble.vm.$emit("click", chatStore.messages[0]);

      expect(chatStore.activeMessageId).toBeNull();
      expect(widgetStore.activeWidget).toBeNull();
    });

    it("sets active message and widget when clicking an agent message with widgetAction", async () => {
      const widgetAction = {
        type: "render_widget" as const,
        component: "SalesChart" as const,
        props: {
          title: "Sales Data",
          data: [100, 200, 300],
        },
      };

      chatStore.addMessage({
        id: "agent-msg-2",
        role: "agent",
        content: "Here is your sales chart",
        timestamp: new Date(),
        widgetAction,
      });

      const wrapper = await mountSuspended(ChatInterface);
      const chatBubble = wrapper.findComponent({ name: "ChatBubble" });
      await chatBubble.vm.$emit("click", chatStore.messages[0]);

      expect(chatStore.activeMessageId).toBe("agent-msg-2");
      expect(widgetStore.activeWidget).toEqual({
        component: "SalesChart",
        props: {
          title: "Sales Data",
          data: [100, 200, 300],
        },
      });
    });
  });
});
