import { describe, it, expect, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import ChatInterface from "./ChatInterface.vue";

describe("ChatInterface", () => {
  let chatStore: ReturnType<typeof useChatStore>;
  let widgetStore: ReturnType<typeof useWidgetStore>;

  beforeEach(async () => {
    chatStore = useChatStore();
    widgetStore = useWidgetStore();
    chatStore.clearMessages();
    widgetStore.clearWidget();
    widgetStore.setLoading(false);
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
    const wrapper = await mountSuspended(ChatInterface);
    const input = wrapper.find('input[type="text"]');
    const form = wrapper.find("form");

    await input.setValue("Test message");
    form.trigger("submit");
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Thinking...");
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

  it("clears input after submission", async () => {
    const wrapper = await mountSuspended(ChatInterface);
    const input = wrapper.find('input[type="text"]');
    const form = wrapper.find("form");

    await input.setValue("Test message");
    await form.trigger("submit");
    await wrapper.vm.$nextTick();

    expect((input.element as HTMLInputElement).value).toBe("");
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
    const input = wrapper.find('input[type="text"]');
    const initialCount = chatStore.messages.length;

    await input.setValue("Test message");
    await input.trigger("keypress", { key: "Enter" });
    await wrapper.vm.$nextTick();

    expect(chatStore.messages.length).toBeGreaterThan(initialCount);
  });
});
