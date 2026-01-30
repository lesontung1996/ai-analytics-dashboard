import { ref } from "vue";
import { useChatStore } from "~/stores/chatStore";
import { useWidgetStore } from "~/stores/widgetStore";
import { useMockAgent } from "~/composables/useMockAgent";
import type { ChatMessage } from "~/types/agent";

export const useChat = () => {
  const chatStore = useChatStore();
  const widgetStore = useWidgetStore();
  const { sendMessage } = useMockAgent();

  const isStreaming = ref(false);
  const isThinking = ref(false);

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
      console.error("Error sending message:", error);
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
