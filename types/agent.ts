/**
 * Available widget component types that can be rendered on the canvas.
 */
export type WidgetComponentType = "SalesChart" | "KPIList";

/**
 * Props for chart-based widgets (e.g., SalesChart).
 */
export interface ChartProps {
  title: string;
  data: number[];
  chartConfig?: {
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  };
}

/**
 * Props for table-based widgets (e.g., KPIList).
 */
export interface TableProps {
  title: string;
  data: Array<Record<string, string | number>>;
}

/**
 * Describes an action for the agent to render a widget on the canvas.
 */
export interface WidgetAction {
  type: "render_widget";
  component: WidgetComponentType;
  props: ChartProps | TableProps;
}

/**
 * Response structure returned by the AI agent.
 */
export interface AgentResponse {
  message: string;
  action: WidgetAction;
}

/**
 * Role of a message sender in the chat.
 */
export type ChatMessageRole = "user" | "agent";

/**
 * Represents a single message in the chat conversation.
 */
export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  widgetAction?: WidgetAction;
}
