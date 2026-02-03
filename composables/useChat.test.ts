import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ref } from "vue";
import type { ChatMessage, AgentResponse } from "~/types/agent";

// Mock stores and composables
const mockAddMessage = vi.fn();
const mockUpdateMessage = vi.fn();
const mockSetActiveMessageId = vi.fn();
const mockMessages = ref<ChatMessage[]>([]);

const mockSetActiveWidget = vi.fn();
const mockSetLoading = vi.fn();

const mockSendMessage = vi.fn();

vi.mock("~/stores/chatStore", () => ({
  useChatStore: vi.fn(() => ({
    addMessage: mockAddMessage,
    updateMessage: mockUpdateMessage,
    setActiveMessageId: mockSetActiveMessageId,
    messages: mockMessages,
  })),
}));

vi.mock("~/stores/widgetStore", () => ({
  useWidgetStore: vi.fn(() => ({
    setActiveWidget: mockSetActiveWidget,
    setLoading: mockSetLoading,
  })),
}));

vi.mock("~/composables/useMockAgent", () => ({
  useMockAgent: vi.fn(() => ({
    sendMessage: mockSendMessage,
  })),
}));

// Import useChat after mocks are set up
import { useChat } from "~/composables/useChat";

describe("useChat", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    mockMessages.value = [];
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("initialization", () => {
    it("returns the expected interface", () => {
      const chat = useChat();

      expect(chat).toHaveProperty("sendUserMessage");
      expect(chat).toHaveProperty("isStreaming");
      expect(chat).toHaveProperty("isThinking");
      expect(chat).toHaveProperty("messages");
      expect(typeof chat.sendUserMessage).toBe("function");
    });

    it("initializes with isStreaming as false", () => {
      const { isStreaming } = useChat();
      expect(isStreaming.value).toBe(false);
    });

    it("initializes with isThinking as false", () => {
      const { isThinking } = useChat();
      expect(isThinking.value).toBe(false);
    });
  });

  describe("sendUserMessage", () => {
    const mockAgentResponse: AgentResponse = {
      message: "Test agent response",
      action: {
        type: "render_widget",
        component: "SalesChart",
        props: {
          title: "Test Chart",
          data: [1, 2, 3],
        },
      },
    };

    it("does nothing for empty input", async () => {
      const { sendUserMessage } = useChat();

      await sendUserMessage("");

      expect(mockAddMessage).not.toHaveBeenCalled();
    });

    it("does nothing for whitespace-only input", async () => {
      const { sendUserMessage } = useChat();

      await sendUserMessage("   ");

      expect(mockAddMessage).not.toHaveBeenCalled();
    });

    it("adds user message to store", async () => {
      mockSendMessage.mockResolvedValue(mockAgentResponse);
      const { sendUserMessage } = useChat();

      const messagePromise = sendUserMessage("Hello agent");

      // Let the sendMessage resolve
      await vi.runAllTimersAsync();
      await messagePromise;

      expect(mockAddMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          role: "user",
          content: "Hello agent",
        })
      );
    });

    it("trims user message content", async () => {
      mockSendMessage.mockResolvedValue(mockAgentResponse);
      const { sendUserMessage } = useChat();

      const messagePromise = sendUserMessage("  Hello agent  ");

      await vi.runAllTimersAsync();
      await messagePromise;

      expect(mockAddMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          content: "Hello agent",
        })
      );
    });

    it("sets isThinking to true while waiting for response", async () => {
      let resolveAgent: (value: AgentResponse) => void;
      mockSendMessage.mockReturnValue(
        new Promise((resolve) => {
          resolveAgent = resolve;
        })
      );

      const { sendUserMessage, isThinking } = useChat();
      const messagePromise = sendUserMessage("Hello");

      // Before agent responds
      expect(isThinking.value).toBe(true);

      // Resolve agent response
      resolveAgent!(mockAgentResponse);
      await vi.runAllTimersAsync();
      await messagePromise;

      expect(isThinking.value).toBe(false);
    });

    it("sets widget loading state", async () => {
      mockSendMessage.mockResolvedValue(mockAgentResponse);
      const { sendUserMessage } = useChat();

      const messagePromise = sendUserMessage("Hello");

      // Loading should be set to true
      expect(mockSetLoading).toHaveBeenCalledWith(true);

      await vi.runAllTimersAsync();
      await messagePromise;

      // Loading should be set to false after completion
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });

    it("adds agent message after receiving response", async () => {
      mockSendMessage.mockResolvedValue(mockAgentResponse);
      const { sendUserMessage } = useChat();

      const messagePromise = sendUserMessage("Hello");
      await vi.runAllTimersAsync();
      await messagePromise;

      // Should have been called twice: once for user, once for agent
      expect(mockAddMessage).toHaveBeenCalledTimes(2);
      expect(mockAddMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          role: "agent",
          content: "",
          isStreaming: true,
        })
      );
    });

    it("sets active widget after streaming completes", async () => {
      mockSendMessage.mockResolvedValue(mockAgentResponse);
      const { sendUserMessage } = useChat();

      const messagePromise = sendUserMessage("Hello");
      await vi.runAllTimersAsync();
      await messagePromise;

      expect(mockSetActiveWidget).toHaveBeenCalledWith({
        component: mockAgentResponse.action.component,
        props: mockAgentResponse.action.props,
      });
    });

    it("sets active message ID after streaming completes", async () => {
      mockSendMessage.mockResolvedValue(mockAgentResponse);
      const { sendUserMessage } = useChat();

      const messagePromise = sendUserMessage("Hello");
      await vi.runAllTimersAsync();
      await messagePromise;

      expect(mockSetActiveMessageId).toHaveBeenCalled();
    });

    it("handles errors gracefully with error message", async () => {
      mockSendMessage.mockRejectedValue(new Error("Network error"));
      const { sendUserMessage, isThinking } = useChat();

      const messagePromise = sendUserMessage("Hello");
      await vi.runAllTimersAsync();
      await messagePromise;

      expect(isThinking.value).toBe(false);
      expect(mockSetLoading).toHaveBeenCalledWith(false);
      expect(mockAddMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          role: "agent",
          content: "Sorry, I encountered an error. Please try again.",
        })
      );
    });
  });

  describe("streamText behavior", () => {
    const mockAgentResponse: AgentResponse = {
      message: "Hi",
      action: {
        type: "render_widget",
        component: "SalesChart",
        props: { title: "Test", data: [1] },
      },
    };

    it("updates message content character by character", async () => {
      mockSendMessage.mockResolvedValue(mockAgentResponse);
      const { sendUserMessage } = useChat();

      const messagePromise = sendUserMessage("Hello");

      // Wait for agent response to be added
      await Promise.resolve();
      await Promise.resolve();

      // Advance timers for streaming (20ms per character, "Hi" = 2 characters)
      vi.advanceTimersByTime(20);
      await Promise.resolve();

      // First character should be updated
      expect(mockUpdateMessage).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ content: "H" })
      );

      vi.advanceTimersByTime(20);
      await Promise.resolve();

      // Second character should be updated
      expect(mockUpdateMessage).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ content: "Hi" })
      );

      await vi.runAllTimersAsync();
      await messagePromise;
    });

    it("sets isStreaming to false when complete", async () => {
      mockSendMessage.mockResolvedValue(mockAgentResponse);
      const { sendUserMessage, isStreaming } = useChat();

      const messagePromise = sendUserMessage("Hello");
      await vi.runAllTimersAsync();
      await messagePromise;

      expect(isStreaming.value).toBe(false);
      expect(mockUpdateMessage).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ isStreaming: false })
      );
    });
  });
});
