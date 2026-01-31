import type { AgentResponse, ChartProps, TableProps } from "~/types/agent";

export const useMockAgent = () => {
  const sendMessage = async (query: string): Promise<AgentResponse> => {
    // Simulate latency (1-2 seconds)
    const delay = Math.random() * 1000 + 1000; // 1000-2000ms
    await new Promise((resolve) => setTimeout(resolve, delay));

    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("sales")) {
      return {
        message:
          "I've analyzed the sales data. Revenue is up 15% compared to last quarter. Here's a visual breakdown:",
        action: {
          type: "render_widget",
          component: "SalesChart",
          props: {
            title: "Q3 Revenue",
            data: [10, 20, 15, 30, 25, 35, 40],
            chartConfig: {
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              borderColor: "rgb(75, 192, 192)",
            },
          } as ChartProps,
        },
      };
    }

    if (lowerQuery.includes("table")) {
      return {
        message: "Sure, here's the data in a table format:",
        action: {
          type: "render_widget",
          component: "KPIList",
          props: {
            title: "Key Performance Indicators",
            data: [
              { metric: "Revenue", value: 125000, change: "+15%" },
              { metric: "Users", value: 5420, change: "+8%" },
              { metric: "Conversion", value: 3.2, change: "+0.5%" },
              { metric: "Retention", value: 87, change: "+2%" },
            ],
          } as TableProps,
        },
      };
    }

    if (lowerQuery.includes("growth")) {
      return {
        message: "Here's the user growth data for the past quarter:",
        action: {
          type: "render_widget",
          component: "SalesChart",
          props: {
            title: "User Growth",
            data: [100, 150, 200, 250, 300, 350, 400],
            chartConfig: {
              backgroundColor: "rgba(59, 130, 246, 0.5)",
              borderColor: "rgb(59, 130, 246)",
            },
          } as ChartProps,
        },
      };
    }

    // Default response
    return {
      message: "I've analyzed your data. Here's what I found:",
      action: {
        type: "render_widget",
        component: "SalesChart",
        props: {
          title: "Analytics Overview",
          data: [12, 19, 15, 25, 22, 30, 28],
          chartConfig: {
            backgroundColor: "rgba(255, 205, 86, 0.5)",
            borderColor: "rgb(255, 205, 86)",
          },
        } as ChartProps,
      },
    };
  };

  return {
    sendMessage,
  };
};
