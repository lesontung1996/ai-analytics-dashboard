# AI Analytics Dashboard

A modern, interactive AI-powered analytics dashboard built with Nuxt 3, Vue 3, and TypeScript. This project demonstrates a chat-based interface where users can query analytics data and receive dynamic visualizations.

---

## Live Demo

🔗 **Live URL:** https://ai-analytics-dashboard-2026.netlify.app/

---

## Demo Video

📹 **Demo Recording:**

<!-- Paste your demo video link or embed below -->
<!-- Example: -->
<!-- [![Demo Video](https://img.youtube.com/vi/VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=VIDEO_ID) -->

[_Paste your demo video link here_]

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

1. Start the development server
2. Open the application in your browser
3. Type a question in the chat interface (e.g., "How are our sales doing?")
4. Watch the AI agent respond with streaming text
5. See the corresponding widget appear in the right panel
6. Try follow-up queries like "Show this as a table" to swap widgets

### Example Queries

- "How are our sales doing?" - Shows a sales chart
- "Show me user growth" - Displays user growth chart
- "Show this as a table" - Switches to table view

---

## Tech Stack

| Category         | Technology              |
| ---------------- | ----------------------- |
| Framework        | Nuxt 3                  |
| UI Library       | Vue 3 (Composition API) |
| Language         | TypeScript              |
| Styling          | Tailwind CSS v4         |
| State Management | Pinia                   |
| Charts           | Chart.js                |
| Unit Testing     | Vitest + Vue Test Utils |
| E2E Testing      | Playwright              |
| Linting          | ESLint                  |

---

## Test Results

### Unit Tests

<!-- Run `pnpm test` and paste results here -->

```bash
# Example output:
Test Files  7 passed (7)
      Tests  31 passed (31)
   Start at  17:49:38
   Duration  3.07s (transform 4.59s, setup 6.21s, import 2.20s, tests 732ms, environment 3.14s)

 % Coverage report from v8
-----------------------------------------|---------|----------|---------|---------|-------------------
File                                     | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------------------------|---------|----------|---------|---------|-------------------
All files                                |   72.82 |    70.83 |   76.74 |   74.85 |
 ai-analytics-dashboard-v3               |   66.66 |      100 |     100 |      80 |
  app.vue                                |   66.66 |      100 |     100 |      80 | 23
 ai-analytics-dashboard-v3/assets/css    |       0 |        0 |       0 |       0 |
  main.css                               |       0 |        0 |       0 |       0 |
 ...s-dashboard-v3/components/ChatBubble |     100 |    94.44 |     100 |     100 |
  ChatBubble.vue                         |     100 |    94.44 |     100 |     100 | 11
 ...cs-dashboard-v3/components/ChatInput |     100 |       90 |     100 |     100 |
  ChatInput.vue                          |     100 |       90 |     100 |     100 | 46
 ...ashboard-v3/components/ChatInterface |      72 |       40 |   83.33 |   77.27 |
  ChatInterface.vue                      |      72 |       40 |   83.33 |   77.27 | 42-48,59-60
 ...ashboard-v3/components/DynamicCanvas |    92.3 |       90 |     100 |     100 |
  DynamicCanvas.vue                      |    92.3 |       90 |     100 |     100 | 15
 ...oard-v3/components/ThinkingIndicator |     100 |      100 |     100 |     100 |
  ThinkingIndicator.vue                  |     100 |      100 |     100 |     100 |
 ...rd-v3/components/widgets/WidgetChart |   80.95 |       50 |   66.66 |   83.33 |
  WidgetChart.vue                        |   80.95 |       50 |   66.66 |   83.33 | 34,40-43
 ...rd-v3/components/widgets/WidgetTable |     100 |      100 |     100 |     100 |
  WidgetTable.vue                        |     100 |      100 |     100 |     100 |
 ai-analytics-dashboard-v3/composables   |   45.76 |     12.5 |      70 |   47.27 |
  useChat.ts                             |      40 |       50 |      40 |   43.24 | 20-31,55-88
  useMockAgent.ts                        |   42.85 |        0 |     100 |   38.46 | 9-68
  useWidgetRegistry.ts                   |     100 |      100 |     100 |     100 |
 ai-analytics-dashboard-v3/stores        |   76.66 |        0 |   58.33 |   79.31 |
  chatStore.ts                           |      65 |        0 |    37.5 |   68.42 | 9,13,26-28,33
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
