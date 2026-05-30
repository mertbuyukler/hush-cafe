# Hush Cafe - Implementation Tasks

This document outlines the step-by-step implementation roadmap for Hush Cafe, utilizing Next.js 15 (App Router) and Cloudflare Pages. Each task is designed to be small, independently completable, and suitable for a solo developer.

## Phase 1: Project Setup

**Task ID:** SETUP-01
- **Description:** Initialize the project directory and Git repository.
- **Dependencies:** None
- **Success Criteria:** A local Git repository exists.

**Task ID:** SETUP-02
- **Description:** Scaffold the Next.js 15 application using `create-next-app` (App Router enabled).
- **Dependencies:** SETUP-01
- **Success Criteria:** `npm run dev` successfully serves the default Next.js page on `localhost`.

**Task ID:** SETUP-03
- **Description:** Install and configure `@cloudflare/next-on-pages` and `wrangler` for local development.
- **Dependencies:** SETUP-02
- **Success Criteria:** The Next.js application can be built and previewed using the Cloudflare Pages local emulator.

**Task ID:** SETUP-04
- **Description:** Set up the root `app/layout.tsx` to include placeholder structure for the Global Audio Player and main content area.
- **Dependencies:** SETUP-02
- **Success Criteria:** The layout wrapper is visible across all routes, verifying that root layouts persist.

---

## Phase 2: Core Data Layer

**Task ID:** DATA-01
- **Description:** Create the Cloudflare D1 database and bind it to the local environment in `wrangler.toml`.
- **Dependencies:** SETUP-03
- **Success Criteria:** Local Wrangler Next.js dev server starts successfully with D1 bindings active.

**Task ID:** DATA-02
- **Description:** Write the `schema.sql` file defining the `stations` and `categories` tables.
- **Dependencies:** DATA-01
- **Success Criteria:** The schema is executed locally, and tables are created in the local D1 instance.

**Task ID:** DATA-03
- **Description:** Implement Next.js Route Handler `app/api/categories/route.ts` (GET) to fetch categories from D1.
- **Dependencies:** DATA-02
- **Success Criteria:** Hitting `/api/categories` returns a JSON array of categories.

**Task ID:** DATA-04
- **Description:** Implement Next.js Route Handler `app/api/stations/route.ts` (GET) to fetch stations from D1.
- **Dependencies:** DATA-02
- **Success Criteria:** Hitting `/api/stations` returns a JSON array of stations.

---

## Phase 3: Public Website

**Task ID:** WEB-01
- **Description:** Implement the `CategoryList` component (Server Component) to fetch and display categories directly from the database or API.
- **Dependencies:** DATA-03
- **Success Criteria:** Categories are fetched and rendered on the homepage.

**Task ID:** WEB-02
- **Description:** Implement the `StationCard` component to display individual station metadata.
- **Dependencies:** WEB-01
- **Success Criteria:** Hardcoded dummy data renders correctly in the component.

**Task ID:** WEB-03
- **Description:** Update `app/page.tsx` (Server Component) to fetch the station list from D1 and display a grid of `StationCard`s.
- **Dependencies:** WEB-02, DATA-04
- **Success Criteria:** The homepage successfully displays the actual list of stations fetched from the database.

**Task ID:** WEB-04
- **Description:** Implement client-side search and filtering logic using a Client Component wrapper.
- **Dependencies:** WEB-03
- **Success Criteria:** Typing in the search bar or selecting a category filters the visible stations instantly.

---

## Phase 4: Audio Player

**Task ID:** AUDIO-01
- **Description:** Set up the React Context (`AudioContext`) as a Client Component (`"use client"`) and inject it into the root `app/layout.tsx`.
- **Dependencies:** SETUP-04
- **Success Criteria:** The global audio state (playing station, volume) is accessible anywhere in the application tree.

**Task ID:** AUDIO-02
- **Description:** Implement the hidden HTML5 `<audio>` element within the root layout, tied to the `AudioContext`.
- **Dependencies:** AUDIO-01
- **Success Criteria:** The `<audio>` element's `src` updates dynamically based on the Next.js global context state.

**Task ID:** AUDIO-03
- **Description:** Implement the `PlayerControls` Client Component (Play, Pause, Volume) in the main layout.
- **Dependencies:** AUDIO-02
- **Success Criteria:** The player controls successfully play, pause, and adjust the volume of the audio stream.

**Task ID:** AUDIO-04
- **Description:** Wire the `StationCard` components to update the global `AudioContext` when a user clicks play.
- **Dependencies:** AUDIO-03, WEB-03
- **Success Criteria:** Clicking a station card on any page instantly starts playback in the persistent global player.

---

## Phase 5: Admin Panel

**Task ID:** ADMIN-01
- **Description:** Implement authentication logic (e.g., Next.js Middleware checking a secure cookie) to protect the `app/admin` route group.
- **Dependencies:** SETUP-02
- **Success Criteria:** Unauthenticated users attempting to access `/admin` are redirected to `/admin/login`.

**Task ID:** ADMIN-02
- **Description:** Create the `app/admin/login/page.tsx` and the authentication Route Handler (`app/api/auth/route.ts`).
- **Dependencies:** ADMIN-01
- **Success Criteria:** Submitting the correct credentials sets an HttpOnly cookie and redirects to the admin dashboard.

**Task ID:** ADMIN-03
- **Description:** Create Next.js Route Handlers for category management (`POST`, `PUT`, `DELETE` at `app/api/categories/route.ts`).
- **Dependencies:** ADMIN-01, DATA-02
- **Success Criteria:** Authenticated API calls successfully mutate category records in D1.

**Task ID:** ADMIN-04
- **Description:** Implement the Category Management UI inside the protected `app/admin` layout.
- **Dependencies:** ADMIN-02, ADMIN-03
- **Success Criteria:** Admins can visually list, add, edit, and delete categories.

**Task ID:** ADMIN-05
- **Description:** Create Next.js Route Handlers for station management (`POST`, `PUT`, `DELETE` at `app/api/stations/route.ts`).
- **Dependencies:** ADMIN-01, DATA-02
- **Success Criteria:** Authenticated API calls successfully mutate station records in D1.

**Task ID:** ADMIN-06
- **Description:** Implement the Station Management UI inside the protected `app/admin` layout.
- **Dependencies:** ADMIN-02, ADMIN-05
- **Success Criteria:** Admins can visually manage stations, stream URLs, and assign them to categories.

---

## Phase 6: SEO & Polish

**Task ID:** POLISH-01
- **Description:** Utilize Next.js Metadata API in `app/layout.tsx` and `app/page.tsx` for dynamic SEO tags and open graph images.
- **Dependencies:** WEB-03
- **Success Criteria:** The site generates correct `<title>` and `<meta>` tags automatically based on Next.js routing.

**Task ID:** POLISH-02
- **Description:** Add `loading.tsx` and `error.tsx` files to routes to leverage Next.js native loading states and error boundaries.
- **Dependencies:** WEB-03, AUDIO-04
- **Success Criteria:** Users see native skeleton loaders during data fetches and friendly error pages on failure.

**Task ID:** POLISH-03
- **Description:** Ensure responsive design for mobile and tablet views using standard CSS.
- **Dependencies:** WEB-01, ADMIN-02
- **Success Criteria:** The Next.js application renders perfectly on small screens without breaking the layout.

---

## Phase 7: Deployment

**Task ID:** DEPLOY-01
- **Description:** Connect the GitHub repository to Cloudflare Pages, configuring the build command to use `@cloudflare/next-on-pages`.
- **Dependencies:** All previous tasks
- **Success Criteria:** The Cloudflare Pages project builds successfully.

**Task ID:** DEPLOY-02
- **Description:** Apply the production D1 database schema via Cloudflare dashboard or Wrangler.
- **Dependencies:** DEPLOY-01, DATA-02
- **Success Criteria:** The production database is ready for data.

**Task ID:** DEPLOY-03
- **Description:** Bind the production D1 database to the Cloudflare Pages project in the dashboard and set environment variables.
- **Dependencies:** DEPLOY-02
- **Success Criteria:** The live Next.js application connects to the production D1 database successfully.

**Task ID:** DEPLOY-04
- **Description:** Perform end-to-end testing on the live deployment URL to verify Next.js edge routing and continuous playback.
- **Dependencies:** DEPLOY-03
- **Success Criteria:** The live application loads stations, plays audio continuously across route changes, and handles admin actions securely.
