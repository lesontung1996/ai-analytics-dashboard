import { expect, test } from "@nuxt/test-utils/playwright";
import type { Page } from "playwright-core";

// Helper function to send a message and wait for response
const sendMessage = async (page: Page, message: string) => {
  const input = page.locator('input[name="user-input"]');
  await input.fill(message);
  await page.click('button[type="submit"]');

  // Wait for thinking indicator to appear and disappear
  await page.waitForSelector("text=Thinking...", { timeout: 3000 });
  await page.waitForSelector("text=Thinking...", {
    state: "hidden",
    timeout: 5000,
  });
};

test("should display SalesChart widget when asking about sales", async ({
  page,
  goto,
}) => {
  await goto("/", { waitUntil: "hydration" });

  await sendMessage(page, "Show me the sales data");

  // Verify agent message content
  const agentMessage = page.locator(
    "text=I've analyzed the sales data. Revenue is up 15% compared to last quarter. Here's a visual breakdown:",
  );
  await expect(agentMessage).toBeVisible();

  // Verify the SalesChart widget is displayed with correct title
  const widgetTitle = page.locator("h2:has-text('Q3 Revenue')");
  await expect(widgetTitle).toBeVisible();

  // Verify chart canvas is rendered
  const chartCanvas = page.locator("canvas");
  await expect(chartCanvas).toBeVisible();
});

test("should display KPIList widget when asking for a table", async ({
  page,
  goto,
}) => {
  await goto("/", { waitUntil: "hydration" });

  await sendMessage(page, "Show me the data in a table");

  // Verify agent message
  const agentMessage = page.locator(
    "text=Sure, here's the data in a table format",
  );
  await expect(agentMessage).toBeVisible();

  // Verify the KPIList widget is displayed
  const widgetTitle = page.locator("h2:has-text('Key Performance Indicators')");
  await expect(widgetTitle).toBeVisible();

  // Verify table structure with correct headers
  const tableHeaders = page.locator("th");
  await expect(tableHeaders).toHaveCount(3); // metric, value, change

  // Verify table data is present
  const revenueRow = page.locator("td:has-text('Revenue')");
  await expect(revenueRow).toBeVisible();

  const usersRow = page.locator("td:has-text('Users')");
  await expect(usersRow).toBeVisible();

  const conversionRow = page.locator("td:has-text('Conversion')");
  await expect(conversionRow).toBeVisible();

  const retentionRow = page.locator("td:has-text('Retention')");
  await expect(retentionRow).toBeVisible();
});

test("should display User Growth chart when asking about growth", async ({
  page,
  goto,
}) => {
  await goto("/", { waitUntil: "hydration" });

  await sendMessage(page, "What is our growth rate?");

  // Verify agent message
  const agentMessage = page.locator(
    "text=Here's the user growth data for the past quarter",
  );
  await expect(agentMessage).toBeVisible();

  // Verify the User Growth widget is displayed
  const widgetTitle = page.locator("h2:has-text('User Growth')");
  await expect(widgetTitle).toBeVisible();

  // Verify chart canvas is rendered
  const chartCanvas = page.locator("canvas");
  await expect(chartCanvas).toBeVisible();
});

test("should display Analytics Overview chart for generic queries", async ({
  page,
  goto,
}) => {
  await goto("/", { waitUntil: "hydration" });

  await sendMessage(page, "Hello, analyze my data");

  // Verify default agent message
  const agentMessage = page.locator(
    "text=I've analyzed your data. Here's what I found",
  );
  await expect(agentMessage).toBeVisible();

  // Verify the default Analytics Overview widget is displayed
  const widgetTitle = page.locator("h2:has-text('Analytics Overview')");
  await expect(widgetTitle).toBeVisible();

  // Verify chart canvas is rendered
  const chartCanvas = page.locator("canvas");
  await expect(chartCanvas).toBeVisible();
});

test("should switch widgets when clicking different agent messages", async ({
  page,
  goto,
}) => {
  await goto("/", { waitUntil: "hydration" });

  // Send first query for sales chart
  await sendMessage(page, "Show me sales");
  const salesMessage = page.locator("text=I've analyzed the sales data");
  const salesButton = page.getByRole("button").filter({ has: salesMessage });

  // await salesButton.click();

  // Verify Q3 Revenue widget
  let widgetTitle = page.locator("h2:has-text('Q3 Revenue')");
  await expect(salesMessage).toBeVisible();
  await expect(salesButton).toBeVisible();
  await expect(widgetTitle).toBeVisible();

  // Send second query for table
  await sendMessage(page, "Show as a table");
  const tableMessage = page.locator(
    "text=Sure, here's the data in a table format",
  );
  const tableButton = page.getByRole("button").filter({ has: tableMessage });
  await tableButton.click();

  //   Verify KPI widget is now displayed
  widgetTitle = page.locator("h2:has-text('Key Performance Indicators')");
  await expect(tableMessage).toBeVisible();
  await expect(tableButton).toBeVisible();
  await expect(widgetTitle).toBeVisible();

  //   Click back on first message
  await salesButton.click();

  // Verify Q3 Revenue widget is displayed again
  widgetTitle = page.locator("h2:has-text('Q3 Revenue')");
  await expect(widgetTitle).toBeVisible();
});
