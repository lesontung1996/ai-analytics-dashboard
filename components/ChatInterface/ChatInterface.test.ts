import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ChatInterface from "./ChatInterface.vue";
import { useChatStore } from "~/stores/chatStore";
import { useWidgetStore } from "~/stores/widgetStore";
import { useMockAgent } from "~/composables/useMockAgent";
import type { AgentResponse } from "~/types/agent";

vi.mock("~/composables/useMockAgent", () => ({
  useMockAgent: vi.fn(),
}));

describe("ChatInterface", () => {
  let chatStore: ReturnType<typeof useChatStore>;
  let widgetStore: ReturnType<typeof useWidgetStore>;
  let mockSendMessage: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    chatStore = useChatStore();
    widgetStore = useWidgetStore();
    chatStore.clearMessages();
    widgetStore.clearWidget();
    widgetStore.setLoading(false);

    mockSendMessage = vi.fn().mockResolvedValue({
      message: "Test response",
      action: {
        type: "render_widget",
        component: "SalesChart",
        props: { title: "Test Chart", data: [1, 2, 3] },
      },
    }) as any;

    vi.mocked(useMockAgent).mockReturnValue({
      sendMessage: mockSendMessage,
    } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", async () => {
    const wrapper = await mountSuspended(ChatInterface);
    expect(wrapper.exists()).toBe(true);
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

  it("updates messages when store changes", async () => {
    const wrapper = await mountSuspended(ChatInterface);
    expect(wrapper.text()).not.toContain("New message");

    chatStore.addMessage({
      id: "msg-new",
      role: "user",
      content: "New message",
      timestamp: new Date(),
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("New message");
  });

  it("shows thinking indicator when isThinking is true", async () => {
    let resolvePromise: () => void;
    const delayedPromise = new Promise<AgentResponse>((resolve) => {
      resolvePromise = () =>
        resolve({
          message: "Test response",
          action: {
            type: "render_widget",
            component: "SalesChart",
            props: { title: "Test", data: [1, 2, 3] },
          },
        });
    });

    mockSendMessage.mockReturnValue(delayedPromise);

    const wrapper = await mountSuspended(ChatInterface);
    const input = wrapper.find('input[type="text"]') as any;
    const form = wrapper.find("form");

    await input.setValue("Test message");
    const submitPromise = form.trigger("submit");
    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(wrapper.text()).toContain("Thinking...");
    resolvePromise!();
    await submitPromise;
  });

  it("submits message and updates store", async () => {
    const wrapper = await mountSuspended(ChatInterface);
    const input = wrapper.find('input[type="text"]') as any;
    const form = wrapper.find("form");

    await input.setValue("Test message");
    await form.trigger("submit");
    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 200));

    const userMessages = chatStore.messages.filter((m) => m.role === "user");
    expect(userMessages.length).toBeGreaterThan(0);
    expect(userMessages[userMessages.length - 1].content.trim()).toBe(
      "Test message",
    );
  });

  it("clears input after submission", async () => {
    const wrapper = await mountSuspended(ChatInterface);
    const input = wrapper.find('input[type="text"]') as any;
    const form = wrapper.find("form");

    await input.setValue("Test message");
    await form.trigger("submit");
    await wrapper.vm.$nextTick();

    expect(input.element.value).toBe("");
  });

  it("does not submit empty message", async () => {
    const wrapper = await mountSuspended(ChatInterface);
    const form = wrapper.find("form");
    const initialCount = chatStore.messages.length;

    await form.trigger("submit");
    await wrapper.vm.$nextTick();

    expect(chatStore.messages.length).toBe(initialCount);
  });

  it("submits on Enter key press", async () => {
    const wrapper = await mountSuspended(ChatInterface);
    const input = wrapper.find('input[type="text"]') as any;
    const initialCount = chatStore.messages.length;

    await input.setValue("Test message");
    await input.trigger("keypress", { key: "Enter" });
    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(chatStore.messages.length).toBeGreaterThan(initialCount);
  });
});
