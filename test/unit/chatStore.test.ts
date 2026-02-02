import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useChatStore } from "~/stores/chatStore";
import type { ChatMessage } from "~/types/agent";

const createMockMessage = (overrides: Partial<ChatMessage> = {}): ChatMessage => ({
  id: `msg-${Date.now()}`,
  role: "user",
  content: "Test message",
  timestamp: new Date(),
  ...overrides,
});

describe("chatStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("addMessage", () => {
    it("adds a message to the messages array", () => {
      const store = useChatStore();
      const message = createMockMessage({ id: "msg-1" });

      store.addMessage(message);

      expect(store.messages).toHaveLength(1);
      expect(store.messages[0]).toEqual(message);
    });

    it("preserves existing messages when adding new ones", () => {
      const store = useChatStore();
      const message1 = createMockMessage({ id: "msg-1", content: "First" });
      const message2 = createMockMessage({ id: "msg-2", content: "Second" });

      store.addMessage(message1);
      store.addMessage(message2);

      expect(store.messages).toHaveLength(2);
      expect(store.messages[0].content).toBe("First");
      expect(store.messages[1].content).toBe("Second");
    });
  });

  describe("clearMessages", () => {
    it("empties the messages array", () => {
      const store = useChatStore();
      store.addMessage(createMockMessage({ id: "msg-1" }));
      store.addMessage(createMockMessage({ id: "msg-2" }));

      store.clearMessages();

      expect(store.messages).toHaveLength(0);
    });

    it("resets activeMessageId to null", () => {
      const store = useChatStore();
      store.addMessage(createMockMessage({ id: "msg-1" }));
      store.setActiveMessageId("msg-1");

      store.clearMessages();

      expect(store.activeMessageId).toBeNull();
    });
  });

  describe("updateMessage", () => {
    it("updates existing message properties", () => {
      const store = useChatStore();
      const message = createMockMessage({ id: "msg-1", content: "Original" });
      store.addMessage(message);

      store.updateMessage("msg-1", { content: "Updated" });

      expect(store.messages[0].content).toBe("Updated");
    });

    it("updates multiple properties at once", () => {
      const store = useChatStore();
      const message = createMockMessage({
        id: "msg-1",
        content: "Original",
        isStreaming: true,
      });
      store.addMessage(message);

      store.updateMessage("msg-1", { content: "Updated", isStreaming: false });

      expect(store.messages[0].content).toBe("Updated");
      expect(store.messages[0].isStreaming).toBe(false);
    });

    it("does nothing if message ID not found", () => {
      const store = useChatStore();
      const message = createMockMessage({ id: "msg-1", content: "Original" });
      store.addMessage(message);

      store.updateMessage("non-existent", { content: "Updated" });

      expect(store.messages[0].content).toBe("Original");
    });

    it("preserves other messages when updating one", () => {
      const store = useChatStore();
      store.addMessage(createMockMessage({ id: "msg-1", content: "First" }));
      store.addMessage(createMockMessage({ id: "msg-2", content: "Second" }));

      store.updateMessage("msg-1", { content: "Updated First" });

      expect(store.messages[0].content).toBe("Updated First");
      expect(store.messages[1].content).toBe("Second");
    });
  });

  describe("setActiveMessageId", () => {
    it("sets the active message ID", () => {
      const store = useChatStore();

      store.setActiveMessageId("msg-1");

      expect(store.activeMessageId).toBe("msg-1");
    });

    it("can set active message ID to null", () => {
      const store = useChatStore();
      store.setActiveMessageId("msg-1");

      store.setActiveMessageId(null);

      expect(store.activeMessageId).toBeNull();
    });
  });

  describe("lastMessage computed", () => {
    it("returns the last message", () => {
      const store = useChatStore();
      store.addMessage(createMockMessage({ id: "msg-1", content: "First" }));
      store.addMessage(createMockMessage({ id: "msg-2", content: "Last" }));

      expect(store.lastMessage?.content).toBe("Last");
    });

    it("returns undefined for empty messages", () => {
      const store = useChatStore();

      expect(store.lastMessage).toBeUndefined();
    });

    it("updates when new message is added", () => {
      const store = useChatStore();
      store.addMessage(createMockMessage({ id: "msg-1", content: "First" }));

      expect(store.lastMessage?.content).toBe("First");

      store.addMessage(createMockMessage({ id: "msg-2", content: "New Last" }));

      expect(store.lastMessage?.content).toBe("New Last");
    });
  });

  describe("messageCount computed", () => {
    it("returns correct count", () => {
      const store = useChatStore();

      expect(store.messageCount).toBe(0);

      store.addMessage(createMockMessage({ id: "msg-1" }));
      expect(store.messageCount).toBe(1);

      store.addMessage(createMockMessage({ id: "msg-2" }));
      expect(store.messageCount).toBe(2);
    });

    it("updates when messages are cleared", () => {
      const store = useChatStore();
      store.addMessage(createMockMessage({ id: "msg-1" }));
      store.addMessage(createMockMessage({ id: "msg-2" }));

      expect(store.messageCount).toBe(2);

      store.clearMessages();

      expect(store.messageCount).toBe(0);
    });
  });
});
