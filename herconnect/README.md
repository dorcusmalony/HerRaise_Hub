# HerConnect (HerRaise Hub) — React + Vite Auth Demo

HerConnect is a lightweight React + Vite frontend demonstrating common authentication flows (register, login, forgot/reset password, logout). It includes a development-only mock API to simplify local testing without a backend and is intended as a starting point for integrating a real authentication backend.

Key goals:
- Minimal, production-approachable React + Vite setup
- Clear examples for auth flows and client-side token handling
- Built-in mock backend for fast local iteration

Features
- Registration, login, forgot-password, reset-password, logout flows
- Mock API for local development (intercepts `/api/*` when no VITE_API_URL is set)
- Token management using localStorage (dev-friendly)
- Simple, composable UI components ready to be adapted

## Link to video
-https://drive.google.com/file/d/1O0W1Qh7WrgFVeE3qEiZB22gGLgpSJ4pR/view?usp=sharing

## Getting started

### Prerequisites
- Node.js 18+ recommended
- npm (or yarn/pnpm)

### Install dependencies
- From repository root (if this repo contains multiple apps):
  ```bash
  npm run install-sub
  ```
  (This runs `cd herconnect && npm install`)
- Or from the project folder:
  ```bash
  cd herconnect
  npm install
  ```

### Development
Start the dev server with Vite:
```bash
npm run dev
```
Open http://localhost:5173 in your browser. The server supports HMR for rapid development.

### Mock API behavior (development only)
When `VITE_API_URL` is not set (or equals `/api`), the app uses a local mock that intercepts requests to `/api/*`. The mock behavior:
- `POST /api/register` — registers a user and stores it in sessionStorage for that browser session.
- `POST /api/login` — logs in a registered user. If the email isn't found, the mock may return a demo login for convenience.
- `POST /api/forgot-password` — returns a neutral success (avoids revealing account existence).
- `POST /api/reset-password` — accepts a new password and returns success.
- `POST /api/logout` — returns success; frontend also clears tokens from localStorage.

### Environment variables
Create a `.env` file in the project root (same folder as package.json) to configure:
- `VITE_API_URL` — Base URL for your real backend (e.g. http://localhost:4000). When set, the mock is disabled and requests go to this backend.
- `VITE_LOGOUT_DELAY` — Optional. Logout redirect delay in milliseconds (default used by the app is 600 ms).

### Vercel deployment checklist
- Build command: `npm run build`
- Output directory: (Vite defaults to `dist`) — leave blank or set to `dist`.
- Set environment variables in Vercel dashboard:
  - VITE_API_URL = https://api.yourdomain.com (or leave unset to use the built-in mock during dev)
- Set Node version to 18+ in Vercel project settings (match `engines.node`).
- If you rely on the mock API for local testing, remember the mock is disabled when you set VITE_API_URL.
- Recommendation: avoid spaces in image filenames (e.g. rename `adich pic.jpg` to `adich-pic.jpg`) — spaces can cause subtle asset resolution issues on some hosting/CDN setups. If you rename images, update their imports in the source code accordingly.
- Check Vercel logs if the build fails — common causes: incompatible package versions, missing env vars, or Node version mismatch.

### Local testing tips
- Use the browser DevTools → Application/Storage to inspect sessionStorage and localStorage keys used by the mock (e.g. `__mock_users__`, `token`, `authToken`).
- Reset the mock state by removing `__mock_users__` from sessionStorage.
- If using a local backend, ensure CORS is enabled or use a proxy to avoid CORS issues.

## Build & Preview
Build production assets:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

## Deployment
- Serve the contents of the `dist` folder with a static host (Netlify, Vercel, GitHub Pages) or integrate into your backend hosting strategy.
- Ensure `VITE_API_URL` points to your production backend when building for production.

## Project structure (excerpt)
- `src/` — React source files
  - `pages/Auth` — Authentication pages and components (login, register, logout, forgot/reset)
  - `components` — Reusable UI components
  - `api/mock` — Development mock API (only active when VITE_API_URL is unset)
- `public/` — Static assets
- `index.html`, `package.json`, `vite.config.js` — build/dev configuration

## Contributing
- Bug reports and PRs welcome. Keep changes focused and include a short description of intent.
- If adding features, update README and include simple usage notes.

## License
- This project is provided as-is. Add a LICENSE file with your preferred license if publishing publicly.

## Contact
- For questions about this template or usage, open an issue or submit a PR with suggested improvements.
