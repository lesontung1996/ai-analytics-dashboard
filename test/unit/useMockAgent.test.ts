import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useMockAgent } from "~/composables/useMockAgent";

describe("useMockAgent", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("sendMessage", () => {
    it("returns sales response when query contains 'sales'", async () => {
      const { sendMessage } = useMockAgent();

      const promise = sendMessage("Show me the sales data");
      vi.advanceTimersByTime(2000);
      const response = await promise;

      expect(response.message).toContain("sales data");
      expect(response.message).toContain("15%");
      expect(response.action.component).toBe("SalesChart");
      expect(response.action.props.title).toBe("Q3 Revenue");
    });

    it("returns table/KPI response when query contains 'table'", async () => {
      const { sendMessage } = useMockAgent();

      const promise = sendMessage("Show me the table");
      vi.advanceTimersByTime(2000);
      const response = await promise;

      expect(response.message).toContain("table format");
      expect(response.action.component).toBe("KPIList");
      expect(response.action.props.title).toBe("Key Performance Indicators");
      expect(response.action.props.data).toHaveLength(4);
    });

    it("returns growth response when query contains 'growth'", async () => {
      const { sendMessage } = useMockAgent();

      const promise = sendMessage("What about user growth?");
      vi.advanceTimersByTime(2000);
      const response = await promise;

      expect(response.message).toContain("user growth");
      expect(response.action.component).toBe("SalesChart");
      expect(response.action.props.title).toBe("User Growth");
    });

    it("returns default analytics response for unmatched queries", async () => {
      const { sendMessage } = useMockAgent();

      const promise = sendMessage("Tell me something interesting");
      vi.advanceTimersByTime(2000);
      const response = await promise;

      expect(response.message).toContain("analyzed your data");
      expect(response.action.component).toBe("SalesChart");
      expect(response.action.props.title).toBe("Analytics Overview");
    });

    it("is case-insensitive for keyword matching", async () => {
      const { sendMessage } = useMockAgent();

      const promise1 = sendMessage("SALES DATA");
      vi.advanceTimersByTime(2000);
      const response1 = await promise1;

      const promise2 = sendMessage("SaLeS dAtA");
      vi.advanceTimersByTime(2000);
      const response2 = await promise2;

      expect(response1.action.component).toBe("SalesChart");
      expect(response2.action.component).toBe("SalesChart");
    });

    it("simulates latency between 1-2 seconds", async () => {
      const { sendMessage } = useMockAgent();

      // Mock Math.random to return 0 (minimum delay: 1000ms)
      vi.spyOn(Math, "random").mockReturnValue(0);

      let resolved = false;
      const promise = sendMessage("test").then(() => {
        resolved = true;
      });

      // Should not resolve before 1000ms
      vi.advanceTimersByTime(999);
      await Promise.resolve();
      expect(resolved).toBe(false);

      // Should resolve at 1000ms
      vi.advanceTimersByTime(1);
      await promise;
      expect(resolved).toBe(true);

      vi.restoreAllMocks();
    });
  });
});
