# Low-Level Design (LLD)
## Vitti ASX Intelligence Dashboard

### 1. Data Ingestion Module (`fetch_asx.py`)

#### Purpose
To retrieve, parse, enrich, and serialize the daily ASX market announcements.

#### Workflow details:
1.  **API Call:** Connects to `https://www.asx.com.au/asx/1/company/announcements?...` using a randomized User-Agent to prevent basic rate-limiting/blocking.
2.  **State Management:** Compares the fetched list against existing entries in `logs/{YYYY-MM-DD}.json` utilizing `URL` and `time` as composite primary keys to avoid duplicate processing.
3.  **Enrichment:**
    *   Initiates an HTTP POST to Groq's LLaMA-v3.3 endpoint.
    *   **Prompt Engineering:** Defines a rigid system prompt enforcing JSON output format: `{"summary": [], "tags": [], "score": int}`.
    *   **Fallback Logic:** If the AI fails to respond (due to timeout or quota limits), the announcement is still appended to the log but with empty `summary` and `tags` arrays.
4.  **Serialization:** Reads the target day's JSON, appends the new objects to the `announcements` array, and re-writes the file safely.

### 2. Frontend Application (`Next.js 14 App Router`)

#### A. Backend for Frontend (BFF) Route (`/app/api/logs/[date]/route.ts`)
*   **Method:** GET
*   **Params:** `date` (YYYY-MM-DD format)
*   **Validation:** Regex enforces proper date structure (`/^\d{4}-\d{2}-\d{2}$/`). Returns `400 Bad Request` on failure.
*   **Execution:** Computes the absolute path to the local `logs/` directory using `process.cwd()` to dynamically locate and `readFile` the JSON document. Responds with `404 Not Found` if the file does not exist, triggering a distinct "Empty State" UI rather than a crash.

#### B. Global State & Context (`page.tsx`)
*   **Client Hook:** Forces client-side hydration via `use client` and `useEffect(() => setIsClient(true))` to prevent SSR hydration mismatches when doing timezone math for the `Date` object mapping to AEST.
*   **Polling Engine:** Implements `setInterval` referencing `REFRESH_MS = 300000` (5 minutes). Triggers `fetchLog(date)` silently to keep data fresh.
*   **Memoized Computations:** Utilizes `useMemo` for filtering data to ensure high performance on large datasets:
    1. Filter out non-sensitive announcements (`sensitiveOnly` true/false).
    2. Filter by Category Toggles.
    3. Filter by Sidebar Tags (Set intersection).
    4. Fuzzy text search on `ticker`, `company`, and `headline`.
    5. Sorting weights: Market Sensitive -> Bullish Score -> Chronological.

#### C. Presentation Components
*   **`Sidebar.tsx`:** Manages control inputs (Date picker, Focus Mode switch). Iterates over `tagCounts` to render the dynamic taxonomy.
*   **`Topbar.tsx`:** Handles Global string search, grid/list layout preference, and the light/dark theme toggle integration.
*   **`AnnouncementCard.tsx` / `AnnouncementRow.tsx`:** Smart components that inject semantic styling based on the data props (e.g., rendering the pulsing Red dot if `market_sensitive === true`). Implements heavy Tailwind CSS specific to the nested theme wrappers (`dark:bg-[#0d1022]`).

### 3. Theme Configuration
*   Controlled via Tailwind's `darkMode: 'class'` mode.
*   A user preference token (`vitti-theme`) is cached in `localStorage` upon interaction.
*   React enforces the `dark` or `light` class onto the root `<html>` tag dynamically on mount and change.
