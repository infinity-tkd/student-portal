# Infinity Taekwondo Student Portal

A modern, responsive, and high-performance Progressive Web Application (PWA) designed exclusively for Infinity Taekwondo students. This portal serves as a centralized hub for students to track their martial arts journey, including attendance, rank progression, curriculum videos, and school events.

## Key Features

- **Real-Time Dashboard**: Instant access to student profiles, active belt ranks, and upcoming events.
- **SWR Data Synchronization**: Loads instantaneously from a secure local cache, then silently revalidates and pulls the newest data in the background without interrupting the user experience.
- **Streaming Library**: A premium, Netflix-style video curriculum hub with horizontal scrolling categories, watch history tracking, and a custom bookmarking system.
- **Progress Tracking**: Visual representations of belt testing history and attendance milestones.
- **PWA Native Experience**: Fully installable on iOS and Android devices directly from the browser, complete with safe-area rendering and offline caching support.

---

## Tech Stack Analysis

This application was engineered with a strict focus on mobile-first responsiveness, immediate load times, and maintainability.

### Frontend Architecture
- **[React 18](https://reactjs.org/) (TypeScript)**
  - *Why:* Chosen for its robust component ecosystem, type safety, and efficient virtual DOM rendering. The application relies heavily on modern React features like Context API and custom Hooks (`useData`, `useAuth`) for global state management.
- **[Vite](https://vitejs.dev/)**
  - *Why:* Serves as the build tool and development server, providing incredibly fast Hot Module Replacement (HMR) and highly optimized, minified production bundles.
- **[React Router v6](https://reactrouter.com/)**
  - *Why:* Handles complex client-side navigation seamlessly, ensuring instantaneous page transitions without triggering full browser reloads.

### Styling & UI
- **[Tailwind CSS](https://tailwindcss.com/)**
  - *Why:* A utility-first CSS framework that allowed us to strictly enforce the Infinity "Paper & Ink" brand guidelines (Brand Red, Pure White, Pitch Black). It enables rapid UI iteration and ensures cross-device consistency.
- **[Lucide React](https://lucide.dev/)**
  - *Why:* Provides crisp, consistent, and lightweight SVG icons that scale perfectly on high-DPI mobile screens.

### Performance & Integration
- **PWA Tooling (`vite-plugin-pwa` & `workbox-window`)**
  - *Why:* Automatically generates service workers and web manifests to support offline caching, extremely fast secondary load times, and native "Add to Home Screen" capabilities.
- **Google Apps Script (GAS) Backend Integration**
  - *Why:* The portal acts as a headless frontend, communicating asynchronously via `fetch` with a GAS backend to securely retrieve student data, keeping the database architecture lightweight and directly integrated with the school's administrative tools.

---

## Running Locally

To run the Student Portal locally for development:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Create a `.env.local` file in the root directory and configure the target API endpoints:
   ```env
   VITE_API_URL=your_google_apps_script_web_app_url
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   ```
