# AI Analytics Dashboard

A modern, interactive AI-powered analytics dashboard built with Nuxt 3, Vue 3, and TypeScript. This project demonstrates a chat-based interface where users can query analytics data and receive dynamic visualizations.

---

## Live Demo

🔗 **Live URL:** https://ai-analytics-dashboard-2026.netlify.app/

---

## Demo Video

📹 **Demo Recording:**

[AI analytics dashboard - Video demo](https://youtu.be/IiZ9wNnasBE)

[![IMAGE ALT TEXT HERE](https://github.com/user-attachments/assets/04436fcd-574a-4c82-9b10-1b46a1c524a5)](https://www.youtube.com/watch?v=IiZ9wNnasBE)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         app.vue                                 │
│                    (Main Layout Container)                      │
├─────────────────────────────┬───────────────────────────────────┤
│                             │                                   │
│     ChatInterface           │         DynamicCanvas             │
│     ┌─────────────────┐     │     ┌─────────────────────────┐   │
│     │  ChatBubble[]   │     │     │   Widget Registry       │   │
│     │  (User/Agent)   │     │     │   ┌─────────────────┐   │   │
│     ├─────────────────┤     │     │   │  WidgetChart    │   │   │
│     │ ThinkingIndicator│    │     │   │  (Chart.js)     │   │   │
│     ├─────────────────┤     │     │   ├─────────────────┤   │   │
│     │   ChatInput     │     │     │   │  WidgetTable    │   │   │
│     └─────────────────┘     │     │   │  (Data Grid)    │   │   │
│                             │     │   └─────────────────┘   │   │
└─────────────────────────────┴─────┴─────────────────────────────┘

```

### Key Features

- **Chat Interface**: Real-time conversational UI with text streaming animation
- **Dynamic Widgets**: Automatically renders charts or tables based on AI agent responses
- **Message History**: Click on previous agent messages to restore their associated widget
- **Responsive Design**: Mobile-first layout that adapts to different screen sizes
- **Streaming Responses**: Typewriter effect for AI agent messages
- **Type Safety**: Fully typed with strict TypeScript configuration

### Data Flow

1. User types a query in `ChatInput`
2. `useChat` composable processes the message via `useMockAgent`
3. Agent analyzes the query and returns a response with a widget action
4. Response text streams character-by-character into `ChatBubble`
5. `widgetStore` updates with the new widget configuration
6. `DynamicCanvas` renders the appropriate widget (`WidgetChart` or `WidgetTable`)

## Usage

1. Go to https://ai-analytics-dashboard-2026.netlify.app/
2. Type a question in the chat interface (e.g., "How are our sales doing?")
3. Watch the AI agent respond with streaming text
4. See the corresponding widget appear in the right panel
5. Try follow-up queries like "Show this as a table" to swap widgets
6. Click on on previous agent messages to restore their associated widget

### Example Queries

- "How are our sales doing?" - Shows a sales chart
- "Show me user growth" - Displays user growth chart
- "Show this as a table" - Switches to table view

---

## Tech Stack

| Category         | Technology                    |
| ---------------- | ----------------------------- |
| Framework        | Nuxt 3                        |
| UI Library       | Vue 3 (Composition API)       |
| Language         | TypeScript                    |
| Styling          | Tailwind CSS v4               |
| State Management | Pinia                         |
| Charts           | Chart.js                      |
| Unit Testing     | Vitest + @nuxt/test-utils     |
| E2E Testing      | Playwright + @nuxt/test-utils |
| Linting          | ESLint                        |

---

## Test Results

### Unit Tests

<!-- Run `pnpm test` and paste results here -->

```bash
# Example output:
Test Files  10 passed (10)
      Tests  70 passed (70)
   Start at  21:49:45
   Duration  1.62s (transform 2.20s, setup 2.52s, import 1.48s, tests 724ms, environment 1.72s)

 % Coverage report from v8
-----------------------------------------|---------|----------|---------|---------|-------------------
File                                     | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------------------------|---------|----------|---------|---------|-------------------
All files                                |   94.84 |    90.27 |   97.67 |   96.55 |
 ai-analytics-dashboard-v3               |   66.66 |      100 |     100 |      80 |
  app.vue                                |   66.66 |      100 |     100 |      80 | 23
 ai-analytics-dashboard-v3/assets/css    |       0 |        0 |       0 |       0 |
  main.css                               |       0 |        0 |       0 |       0 |
 ...s-dashboard-v3/components/ChatBubble |     100 |      100 |     100 |     100 |
  ChatBubble.vue                         |     100 |      100 |     100 |     100 |
 ...cs-dashboard-v3/components/ChatInput |     100 |       90 |     100 |     100 |
  ChatInput.vue                          |     100 |       90 |     100 |     100 | 46
 ...ashboard-v3/components/ChatInterface |      88 |       80 |     100 |    90.9 |
  ChatInterface.vue                      |      88 |       80 |     100 |    90.9 | 59-60
 ...ashboard-v3/components/DynamicCanvas |    92.3 |       90 |     100 |     100 |
  DynamicCanvas.vue                      |    92.3 |       90 |     100 |     100 | 15
 ...oard-v3/components/ThinkingIndicator |     100 |      100 |     100 |     100 |
  ThinkingIndicator.vue                  |     100 |      100 |     100 |     100 |
 ...rd-v3/components/widgets/WidgetChart |   80.95 |       50 |   66.66 |   83.33 |
  WidgetChart.vue                        |   80.95 |       50 |   66.66 |   83.33 | 34,40-43
 ...rd-v3/components/widgets/WidgetTable |     100 |      100 |     100 |     100 |
  WidgetTable.vue                        |     100 |      100 |     100 |     100 |
 ai-analytics-dashboard-v3/composables   |     100 |      100 |     100 |     100 |
  useChat.ts                             |     100 |      100 |     100 |     100 |
  useMockAgent.ts                        |     100 |      100 |     100 |     100 |
  useWidgetRegistry.ts                   |     100 |      100 |     100 |     100 |
 ai-analytics-dashboard-v3/stores        |     100 |      100 |     100 |     100 |
  chatStore.ts                           |     100 |      100 |     100 |     100 |
  widgetStore.ts                         |     100 |      100 |     100 |     100 |
-----------------------------------------|---------|----------|---------|---------|-------------------
```

### E2E Tests

<!-- Run `pnpm test:e2e` and paste results here -->

```bash
# Example output:
 ✓ test/e2e/app.test.ts:18:5 › should render the app correctly
 ✓ test/e2e/app.test.ts:30:5 › should display SalesChart widget when asking about sales
 ✓ test/e2e/app.test.ts:53:5 › should display KPIList widget when asking for a table
 ✓ test/e2e/app.test.ts:89:5 › should display User Growth chart when asking about growth
 ✓ test/e2e/app.test.ts:112:5 › should display Analytics Overview chart for generic queries
 ✓ test/e2e/app.test.ts:135:5 › should switch widgets when clicking different agent messages

6 passed
```

---

## Setup & Development

### Prerequisites

- Node.js (check `.nvmrc` for version)
- pnpm (recommended) or npm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/lesontung1996/ai-analytics-dashboard.git
cd ai-analytics-dashboard

# Install dependencies
pnpm install
```

### Development Server

```bash
# Start dev server on http://localhost:3000
pnpm dev
```

### Testing

```bash
# Run unit tests
pnpm test

# Run unit tests in watch mode
pnpm test:watch

# Run unit tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui
```

### Production Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Linting

```bash
# Run ESLint
pnpm lint

# Fix linting issues
pnpm lint:fix
```

---

## Why I made these decisions

### Testing: @nuxt/test-utils + Playwright vs Vue Test Utils + Cypress

**Decision:** `@nuxt/test-utils` with Vitest for unit tests, Playwright for E2E

**Why:**

- **Out-of-the-box support** — Officially supported when creating a new Nuxt 3 app, saving significant project setup time
- **Full Nuxt context** — `mountSuspended` runs Vue components with the complete Nuxt runtime (auto-imports, composables, Pinia stores), eliminating the need to mock framework features
- **Real store testing** — Components can interact with actual Pinia stores rather than mocked implementations, catching integration bugs early
- **Composable testing** — Test composables like `useChat` with real store behavior without complex mocking setups
- **Playwright's reliability** — More stable than Cypress for modern web apps, with better handling of async operations

**Alternative considered:** Vue Test Utils + Cypress was considered due to familiarity, but would require:

- Manual mocking of Nuxt's auto-imports (`defineAsyncComponent`, composables)
- Separate Pinia store setup in each test file
- More configuration boilerplate
- Cypress's heavier runtime for E2E tests

The time saved on setup and reduced mocking complexity outweighed the learning curve.

---

### Widget Registry Pattern vs Direct Imports

**Decision:** Centralized widget registry (`useWidgetRegistry`)

**Why:**

- **Dynamic component resolution** — Agent responses specify widget types as strings; registry maps them to components
- **Single source of truth** — All widget mappings in one place
- **Extensibility** — Adding new widgets requires only updating the registry and types
- **Type safety** — `WidgetComponentType` union ensures only valid widgets can be referenced

---

### Async Components for Code Splitting

**Decision:** Use `defineAsyncComponent` with dynamic imports in `useWidgetRegistry`

```typescript
const widgetRegistry: Record<WidgetComponentType, Component> = {
  SalesChart: defineAsyncComponent(
    () => import("~/components/widgets/WidgetChart/WidgetChart.vue"),
  ),
  KPIList: defineAsyncComponent(
    () => import("~/components/widgets/WidgetTable/WidgetTable.vue"),
  ),
};
```

**Why:**

- **Reduced initial bundle** — Widget components are loaded on-demand, not included in the main JavaScript bundle
- **Faster first paint** — Users see the chat interface immediately; widget code loads only when needed
- **Automatic chunk splitting** — Nuxt/Vite creates separate chunks for each widget, enabling parallel loading
- **Future scalability** — As more widgets are added, initial load time remains constant

**Alternative considered:** Direct static imports would be simpler but would bloat the initial bundle as the widget library grows.

---

### ESLint for Code Quality

**Decision:** ESLint with `@nuxt/eslint` preset

**Why:**

- **Consistent code style** — Enforces formatting and best practices across the codebase
- **Catch bugs early** — Identifies potential issues before runtime (unused variables, type errors)
- **Team scalability** — New contributors follow the same patterns automatically
- **IDE integration** — Real-time feedback in VS Code/Cursor with auto-fix on save
- **Nuxt-specific rules** — `@nuxt/eslint` includes Vue 3 and Nuxt best practices

---

### Why Two Separate Stores?

**Decision:** `chatStore` and `widgetStore` as independent Pinia stores

**Why:**

- **Single Responsibility** — Chat logic (messages, streaming state) is separate from widget display logic
- **Independent lifecycles** — Widget can change without affecting chat history (e.g., clicking old messages)
- **Easier testing** — Each store can be tested in isolation
- **Performance** — Components only subscribe to the state they need

**Alternative considered:** A single store would reduce boilerplate but would couple unrelated concerns and make the codebase harder to reason about.

---

### Why Store Widget Actions on Messages?

Each `ChatMessage` optionally stores its `widgetAction`:

```typescript
interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  widgetAction?: WidgetAction; // Attached to agent messages
}
```

**Why:**

- **Improved UX** — Clicking a past message restores its widget
- **No separate mapping** — Widget context lives with the message that created it
- **Simpler data flow** — No need to maintain a separate message-to-widget mapping

**Alternative considered:** A separate message-to-widget mapping would add complexity that's out of scope for this project. I wanted to keep the overall architecture of this project stay in line with the requirements while improve the UX by enhancing the functionality of the chat interface.

---

### Component Unit Tests: Co-location & Snapshot Strategy

**Decision:** Tests live alongside components, focus on behavior, use snapshots for UI

```
components/
├── ChatBubble/
│   ├── ChatBubble.vue
│   ├── ChatBubble.test.ts      # Co-located test
│   └── __snapshots__/
│       └── ChatBubble.test.ts.snap
```

**Why co-location:**

- **Discoverability** — Tests are immediately visible when working on a component
- **Easier maintenance** — Renaming or moving a component includes its tests
- **Clear ownership** — Each component's test responsibilities are obvious
- **IDE navigation** — Quick switching between implementation and tests

**Why behavior-focused tests + snapshots:**

- **Core function testing** — Unit tests verify component behavior (events emitted, props handled, store interactions)
- **Snapshot tests for UI** — `toMatchSnapshot()` captures HTML output, detecting unintended visual changes
- **Reduced maintenance** — No need to write detailed UI assertions; snapshots auto-update when intentional changes are made
- **Full Nuxt context** — `mountSuspended` from `@nuxt/test-utils` provides real auto-imports and store access

Example from `ChatBubble.test.ts`:

```typescript
it("renders agent message and emits click event", async () => {
  const wrapper = await mountSuspended(ChatBubble, {
    props: { message: mockAgentMessage, isActive: false },
  });

  // Behavior test: verify click event
  await wrapper.find("button").trigger("click");
  expect(wrapper.emitted("click")).toBeTruthy();

  // Snapshot test: verify UI structure
  expect(wrapper.html()).toMatchSnapshot();
});
```
