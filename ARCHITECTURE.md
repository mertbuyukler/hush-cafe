# Hush Cafe - System Architecture

## Recommended Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** CSS Modules or plain CSS
- **Backend / API:** Next.js Route Handlers (compiled to Cloudflare Pages Functions)
- **Database:** Cloudflare D1 (Serverless SQLite)
- **Deployment:** Cloudflare Pages (via `@cloudflare/next-on-pages`)

*WHY:* This stack allows a solo developer to build a full-stack application natively using React Server Components and Route Handlers, while still deploying entirely within the serverless Cloudflare ecosystem. Next.js 15 provides built-in routing, optimized rendering, and seamless API integration without the need for a separate backend codebase.

---

## 1. High-Level System Architecture
The application leverages the **Next.js App Router** architecture optimized for the edge.
- The user's browser interacts with React Server Components (for fast, SEO-friendly initial loads) and Client Components (for interactive audio controls).
- Next.js Route Handlers (`app/api/...`) act as the backend REST API, which automatically compile to Cloudflare Pages Functions.
- The Route Handlers query the serverless relational database (Cloudflare D1) via Cloudflare environment bindings.

*WHY:* Next.js unifies frontend and backend development. Using `@cloudflare/next-on-pages` allows the Next.js edge runtime to execute directly on Cloudflare's CDN, maintaining the zero-maintenance serverless benefits while providing a superior developer experience.

## 2. Frontend Architecture
The frontend utilizes Next.js **Layouts and Components**.
- A persistent Global Audio Player resides in the root `app/layout.tsx`. In the App Router, root layouts are not unmounted during navigation, ensuring continuous audio playback while the user browses different pages.
- Data fetching for public pages (like the station directory) utilizes React Server Components for instant load times and optimal SEO.
- Interactive elements (Player Controls, Search) utilize Client Components (`"use client"`).

*WHY:* Moving from an SPA to Next.js App Router provides better SEO, faster initial page loads, and native routing while still solving the "continuous playback" problem natively via Next.js Layouts.

## 3. Admin Panel Architecture
The admin panel is integrated into the same Next.js application under the `app/admin` route group.
- Protected via Next.js Middleware or a layout check that verifies a secure HttpOnly session cookie.
- It consists of basic CRUD forms that interact with Next.js Route Handlers or use Next.js Server Actions.

*WHY:* Keeping the admin panel within the Next.js app simplifies data fetching and authentication. A solo developer only manages one deployment pipeline and one set of environment variables.

## 4. Data Storage Strategy
We will use **Cloudflare D1**, a serverless SQL database bound natively to the Next.js edge runtime on Cloudflare Pages.

*WHY:* Relational data is perfect for Hush Cafe since Stations naturally belong to Categories. SQLite (which powers D1) is exceptionally fast for read-heavy workloads (like serving station lists). It is seamlessly accessible from Next.js Route Handlers via Cloudflare bindings.

## 5. Radio Station Data Model
A relational table representing the radio streams.

**Table: `stations`**
- `id` (Primary Key, UUID or Integer)
- `name` (String, required)
- `description` (Text, optional)
- `stream_url` (String, required) - The actual audio stream endpoint.
- `cover_image_url` (String, optional)
- `category_id` (Foreign Key, references `categories.id`)
- `is_featured` (Boolean, default: false)
- `created_at` (Timestamp)

*WHY:* This model captures all necessary metadata without bloat. Separating the `stream_url` allows admins to fix broken streams instantly via the database without needing to redeploy the Next.js app.

## 6. Category Data Model
A relational table for organizing stations.

**Table: `categories`**
- `id` (Primary Key, UUID or Integer)
- `name` (String, required) - e.g., "Chillhop", "Ambient"
- `slug` (String, unique, required) - e.g., "chillhop", for URL routing.

*WHY:* Database-driven categories allow dynamic management of genres without altering the Next.js source code.

## 7. Project Folder Structure
A Next.js App Router structure tailored for Cloudflare Pages.

```text
/
├── app/                  # Next.js 15 App Router
│   ├── layout.tsx        # Root layout (Contains Global Audio Player)
│   ├── page.tsx          # Homepage (Server Component)
│   ├── admin/            # Admin Panel routes
│   └── api/              # API Route Handlers (Compiles to CF Functions)
├── components/           # Reusable UI components
│   ├── client/           # Client components (Player, Search)
│   └── server/           # Server components (Station List)
├── context/              # React Context (Audio state, "use client")
├── lib/                  # Utilities, D1 database client setup
├── db/                   # Database files
│   └── schema.sql        # D1 SQL schema definition
├── next.config.mjs       # Next.js configuration
└── wrangler.toml         # Cloudflare bindings & local dev config
```

*WHY:* This strictly adheres to standard Next.js 15 conventions. By placing the API within `app/api`, the Next.js build process seamlessly transforms them into Cloudflare Pages Functions automatically via `@cloudflare/next-on-pages`.

## 8. State Management Approach
We will use **React Context API** combined with local component state, wrapped in a Client Component at the root layout.

*WHY:* Global state requirements are minimal: tracking the playing station, playback status, and volume. A simple Context Provider inside `app/layout.tsx` is sufficient and avoids the overhead of complex state libraries like Redux, respecting the "no overengineering" constraint.

## 9. Deployment Architecture for Cloudflare Pages
- **Version Control:** GitHub Repository.
- **CI/CD Pipeline:** Cloudflare Pages GitHub integration using the `@cloudflare/next-on-pages` build command. Pushing to `main` builds the Next.js app and deploys both static assets and Edge API routes to Cloudflare.
- **Database Binding:** The D1 database is bound to the Pages project via `wrangler.toml` for local development and the Cloudflare Dashboard for production.

*WHY:* This provides a robust, zero-configuration CI/CD pipeline tailored specifically for Next.js on Cloudflare, requiring zero dedicated server management.

## 10. Future Extension Points
While keeping the MVP simple, the architecture allows for seamless expansion:
- **Client-side Storage:** Implementing `localStorage` in Client Components to let users save favorite stations.
- **Next.js Cache:** Utilizing Next.js native caching and ISR (Incremental Static Regeneration) features to cache database queries and improve performance under heavy traffic.
- **Analytics:** Server Actions or API routes can easily log play events to a separate D1 analytics table without blocking the client thread.

*WHY:* These extensions utilize native Next.js and Cloudflare features without fundamentally altering or rewriting the core architecture.
