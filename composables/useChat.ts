import { ref } from "vue";
import { useChatStore } from "~/stores/chatStore";
import { useWidgetStore } from "~/stores/widgetStore";
import { useMockAgent } from "~/composables/useMockAgent";
import type { ChatMessage } from "~/types/agent";

/**
 * Composable for managing chat interactions between user and AI agent.
 * Handles message sending, streaming responses, and coordinating with stores.
 *
 * @returns Object containing chat methods and reactive state
 * @returns {Function} sendUserMessage - Sends a user message and processes agent response
 * @returns {Ref<boolean>} isStreaming - Whether text is currently being streamed
 * @returns {Ref<boolean>} isThinking - Whether the agent is processing a response
 * @returns {Ref<ChatMessage[]>} messages - All chat messages from the store
 *
 * @example
 * ```ts
 * const { sendUserMessage, isStreaming, isThinking, messages } = useChat();
 * await sendUserMessage("Show me sales data");
 * ```
 */
export const useChat = () => {
  const chatStore = useChatStore();
  const widgetStore = useWidgetStore();
  const { sendMessage } = useMockAgent();

  const isStreaming = ref(false);
  const isThinking = ref(false);

  /**
   * Streams text character-by-character to simulate a typing effect.
   * Updates the message content in the store progressively.
   *
   * @param messageId - The ID of the message to update
   * @param text - The full text to stream
   * @param onComplete - Optional callback invoked when streaming completes
   * @returns Promise that resolves when streaming is complete
   */
  const streamText = async (
    messageId: string,
    text: string,
    onComplete?: () => void,
  ): Promise<void> => {
    isStreaming.value = true;
    let displayedText = "";

    for (let i = 0; i < text.length; i++) {
      displayedText += text[i];
      chatStore.updateMessage(messageId, { content: displayedText });
      await new Promise((resolve) => setTimeout(resolve, 20)); // ~50 chars per second
    }

    isStreaming.value = false;
    chatStore.updateMessage(messageId, { isStreaming: false });
    onComplete?.();
  };

  /**
   * Sends a user message and handles the complete agent response flow.
   * Creates user message, waits for agent response, streams the reply,
   * and updates the widget display.
   *
   * @param content - The message content from the user
   * @returns Promise that resolves when the response is fully streamed
   *
   * @remarks
   * - Empty or whitespace-only messages are ignored
   * - Sets isThinking during agent processing
   * - Handles errors gracefully with an error message
   */
  const sendUserMessage = async (content: string): Promise<void> => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };
    chatStore.addMessage(userMessage);

    // Show thinking indicator
    isThinking.value = true;
    widgetStore.setLoading(true);

    try {
      // Get agent response
      const response = await sendMessage(content);

      // Add agent message (initially empty, will be streamed)
      const agentMessage: ChatMessage = {
        id: `msg-${Date.now()}-agent`,
        role: "agent",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
        widgetAction: response.action,
      };
      chatStore.addMessage(agentMessage);

      isThinking.value = false;
      // Stream the message text
      await streamText(agentMessage.id, response.message, () => {
        widgetStore.setLoading(false);
      });

      // Set the widget after streaming completes and mark this message as active
      widgetStore.setActiveWidget({
        component: response.action.component,
        props: response.action.props,
      });
      chatStore.setActiveMessageId(agentMessage.id);
    } catch (error) {
      isThinking.value = false;
      widgetStore.setLoading(false);

      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: "agent",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      chatStore.addMessage(errorMessage);
    }
  };

  return {
    sendUserMessage,
    isStreaming,
    isThinking,
    messages: chatStore.messages,
  };
};
