# Hush Cafe - Project Plan

## Product Vision
Hush Cafe is a curated, minimalist lo-fi radio platform designed to provide users with continuous, high-quality background music for focus, relaxation, and work. It aims to offer a frictionless, immediate listening experience without the overhead of user accounts, subscriptions, or complex interfaces.

## Target Audience
- Students, professionals, and creatives seeking background music for deep work or study.
- Individuals looking for curated lo-fi, chillhop, and ambient streams.
- Users who prefer simple, single-purpose web applications over bloated media platforms.

## MVP Features
- A sleek, responsive web interface for discovering and playing lo-fi radio streams.
- A secure admin dashboard for managing the curated list of radio stations.
- Instant, seamless audio playback.

## User-Facing Features
- **Browse Stations:** View a curated list of available lo-fi radio stations, including highlighted featured stations.
- **Play Streams:** Seamless playback of live audio streams directly in the browser.
- **Switch Stations:** Easily transition between different radio stations without page reloads.
- **Search Stations:** Find specific stations by name or category.
- **View Station Information:** Display metadata such as the station's name, category, and description.

## Admin Features
A simple, authenticated administrative interface restricted to site managers:
- **Manage Radio Stations:** Add new stations, edit existing ones, or remove offline stations.
- **Manage Stream URLs:** Update the live audio stream endpoints for each station.
- **Station Metadata:** Update station names, descriptions, and associated imagery (if applicable).
- **Categories:** Organize stations into thematic categories (e.g., Chillhop, Synthwave, Acoustic, Sleep).
- **Featured Stations:** Select and highlight specific stations to be promoted on the main user interface.

## Content Management Requirements
- A structured data storage system to reliably hold station metadata, stream URLs, and categorization.
- Secure, token-based or password-based authentication to restrict access to the admin interface.
- Straightforward HTML forms within the admin panel for quick content updates and management.

## Technical Requirements
- **Architecture:** Simple Jamstack architecture. No microservices.
- **Frontend:** Lightweight modern web stack (Vanilla HTML/CSS/JS or a minimalistic framework) focusing on fast load times and a responsive layout.
- **Backend/API:** Serverless functions to serve station data to the frontend and securely handle admin CRUD operations.
- **Database:** A simple relational or key-value store to manage the station catalog.
- **Audio:** Native HTML5 Audio API for managing stream playback.

## Deployment Requirements
- **Hosting Target:** Cloudflare Pages.
- **Backend Infrastructure:** Leverage Cloudflare Pages Functions for the API and Cloudflare D1 (SQLite) or KV for the database to maintain a unified, simple, and maintainable deployment stack on Cloudflare's edge network.

## Future Improvements
- **Theme Customization:** Light/dark mode toggles and aesthetic UI themes.
- **Local Favorites:** Allow users to save favorite stations using browser `localStorage` (maintaining the zero-account philosophy).
- **Advanced Audio Controls:** Volume sliders, mute toggles, and potentially basic EQ settings.
- **Keyboard Shortcuts:** Keyboard navigation for play/pause, volume control, and station switching.
