export type WidgetComponentType = "SalesChart" | "KPIList";

export interface ChartProps {
  title: string;
  data: number[];
  chartConfig?: {
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  };
}

export interface TableProps {
  title: string;
  data: Array<Record<string, string | number>>;
}

export interface WidgetAction {
  type: "render_widget";
  component: WidgetComponentType;
  props: ChartProps | TableProps;
}

export interface AgentResponse {
  message: string;
  action: WidgetAction;
}

export type ChatMessageRole = "user" | "agent";

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  widgetAction?: WidgetAction;
}
