# HerConnect (HerRaise Hub) — Frontend (React + Vite)

HerConnect is the frontend application for HerRaise Hub: a responsive mentorship platform UI built with modern web tooling. This repository contains the production-approachable React + Vite codebase that implements user-facing pages (home, about, contact, resources, authentication screens) and reusable UI components.

## Link to video
-https://drive.google.com/file/d/1O0W1Qh7WrgFVeE3qEiZB22gGLgpSJ4pR/view?usp=sharing

Purpose
- Present a professional, accessible, and responsive frontend for mentorship and community features.
- Provide clear examples of authentication flows, resource pages, and common UI patterns.
- Serve as the design and interaction layer to be integrated with backend services.

Key features
- Responsive pages for Home, About, Contact, Resources, and Auth (register, login, reset, logout)
- Reusable components (header, footer, search, reports button, contact modal)
- Client-side token handling and simple UX safeguards
- Accessible markup and responsive layout with Bootstrap and custom CSS

Tech stack
- Framework: React
- Bundler / Dev server: Vite
- Styling: CSS + Bootstrap 5, custom CSS variables
- Icons: react-icons
- Routing: react-router-dom
- Optional HTTP client: axios (included but usage is optional)

Getting started (frontend only)

Prerequisites
- Node.js 18+ recommended
- npm (or yarn/pnpm)

Install dependencies
From the project folder:
  cd herconnect
  npm install

Development
Start the dev server:
  npm run dev
Open http://localhost:5173. Vite provides fast HMR and a streamlined developer experience.

Environment variables
You may provide simple frontend-only environment variables in a .env file (in the project root):
- VITE_LOGOUT_DELAY — Optional. Configure the delay (ms) after logout before redirecting (default: 600).

Build & preview
Build production assets:
  npm run build

Preview the production build locally:
  npm run preview

Deployment
- Deploy the contents of the `dist/` folder to any static hosting (Netlify, Vercel, static file server) or integrate into your full-stack deployment pipeline.
- When integrating with a backend, adjust configuration in your hosting/build pipeline as needed.

Project structure (high level)
- src/
  - pages/ — page views (HomePage, About, Contact, Resources, Auth flows)
  - components/ — shared UI components (Header, Footer, SearchBar, etc.)
  - styles/ — CSS variables and global styles
  - images/ — static images referenced by the app
  - main.jsx, App.jsx — application entry and routing
- index.html, package.json, vite.config.js — build and project configuration

Developer notes
- CSS variables are declared in src/styles/variables.css and consumed across components for consistent theming.
- The UI uses Bootstrap utilities together with custom classes for layout and responsiveness.
- Keep components small and focused: prefer props and composition to global state unless necessary.

Contributing
- Contributions are welcome. Open issues for bugs or feature requests and submit focused pull requests with a concise description of intent.
- Update documentation and tests (if added) when introducing features.

License
- This repository contains the frontend implementation. Add a LICENSE file with your preferred license before publishing publicly.

Contact
- For questions, open an issue or submit a pull request with suggested improvements.
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



