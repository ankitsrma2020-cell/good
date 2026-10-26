# good reviewer notes

## Architecture

This is a Vite React/TypeScript frontend with Redux-based authentication/state management and an Express/Mongoose backend. The frontend uses pathname-based rendering in `src/App.tsx` rather than a routing library, while backend authentication endpoints are grouped under `/api/auth` in `backend/src/routes/authRoutes.ts`. The backend connects to MongoDB before listening and exposes JSON APIs with centralized 404 and error handling in `backend/src/server.ts`.

## Conventions

- Use TypeScript strict mode; backend source is under `backend/src`, frontend source under `src`. Backend compilation is configured in `backend/tsconfig.json`.
- Backend ES module imports include `.js` extensions, even in `.ts` files, e.g. `backend/src/server.ts` and `backend/src/routes/authRoutes.ts`, matching `module: "NodeNext"`.
- API responses consistently use `{ success: boolean, ... }`; validation and operational failures return structured JSON messages. Follow the patterns in `backend/src/routes/authRoutes.ts`.
- Protected backend routes apply `authenticateToken` directly in the route declaration, and handlers read the authenticated identity from `request.userId` (`backend/src/middleware/authMiddleware.ts`).
- Passwords must never be returned from user responses. Existing queries explicitly use `.select("-password")` or allowlisted fields, and `publicUser()` in `backend/src/routes/authRoutes.ts` defines the public representation.
- Normalize account emails with `trim().toLowerCase()` before lookup or persistence. User names are trimmed; the schema also enforces `trim` and email `lowercase` (`backend/src/models/User.ts`).
- Hash passwords with bcrypt using the module-level `saltRounds = 10`; compare hashes with `bcrypt.compare` (`backend/src/routes/authRoutes.ts`).
- Frontend Redux access uses typed hooks/types such as `AppDispatch` and `RootState` (`src/App.tsx`, `src/components/AccountDialogs.tsx`). Async operations are dispatched as request actions such as `profileUpdateRequested`.
- Frontend pages are selected by exact `window.location.pathname` checks in `src/App.tsx`; navigation uses ordinary links like those in `src/components/DashboardNavbar.tsx`.
- UI styling follows component-specific `dashboard-*` class names, and reusable dashboard controls are split into components such as `DashboardNavbar.tsx`, `AccountDialogs.tsx`, and `ProfileAvatar.tsx`.

## Intentional non-standard choices

- There is no React Router: `src/App.tsx` intentionally implements simple pathname-based navigation for `/dashboard`, `/users`, `/activity`, `/leaderboard`, and `/sessions`.
- Profile images are intentionally stored as validated base64 data URLs in MongoDB rather than uploaded as files. Both frontend and backend enforce JPEG/PNG/WebP and a 2 MB limit (`src/components/AccountDialogs.tsx`, `backend/src/routes/authRoutes.ts`).

## Watch out for

- Do not add authenticated endpoints without `authenticateToken`, and do not trust client-supplied user IDs; account deletion demonstrates enforcing `request.userId === request.params.id` (`backend/src/routes/authRoutes.ts`).
- Never expose `password` or return full Mongoose user documents without an explicit field selection/public mapping.
- Preserve allowlisting for dynamic sort fields and directions. Do not pass arbitrary query parameters into `.sort()`; see `userSortFields` in `backend/src/routes/authRoutes.ts`.
- Keep frontend and backend profile-image limits and MIME validation aligned; `express.json({ limit: "3mb" })` is intentionally larger than the 2 MB decoded image limit to accommodate base64 overhead (`backend/src/server.ts`).
- Avoid changing the backend startup order: MongoDB must connect successfully before `app.listen` is called (`backend/src/server.ts`).