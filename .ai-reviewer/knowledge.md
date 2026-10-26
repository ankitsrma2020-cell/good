# good reviewer notes

## Architecture
This is a Vite React 19 frontend with Redux-based application state and a separately packaged Express/TypeScript backend. The frontend entry point (`src/App.tsx`) selects pages directly from `window.location.pathname`; the backend exposes authentication and user-management endpoints under `/api/auth`, backed by MongoDB/Mongoose. Authentication uses JWTs stored client-side and sent as Bearer tokens.

## Conventions
- Backend TypeScript is strict and uses ESM/NodeNext. Relative imports in `backend/src` must include `.js` extensions, even when importing `.ts` sources; see `backend/src/routes/authRoutes.ts`.
- API responses consistently use `{ success, message, ... }` envelopes. Validation failures use 400, authentication failures 401, authorization failures 403, conflicts 409, and missing records 404; follow examples in `backend/src/routes/authRoutes.ts`.
- Protected backend handlers use `authenticateToken` and `AuthenticatedRequest.userId` from `backend/src/middleware/authMiddleware.ts`. Authorization must be checked against that ID, not merely the URL parameter; account deletion demonstrates this.
- User emails are trimmed and lowercased before lookup or persistence. Names are trimmed, and passwords are hashed with bcrypt using `saltRounds = 10`; see `backend/src/routes/authRoutes.ts` and `backend/src/models/User.ts`.
- Never return password fields. Queries explicitly select safe fields or `-password`, and `publicUser()` centralizes the public representation (`backend/src/routes/authRoutes.ts`).
- Frontend components use PascalCase files and default exports (`src/components/Button.tsx`, `src/components/AccountDialogs.tsx`). Redux hooks are typed with `AppDispatch` and `RootState`.
- Frontend styling is class-name based; component-specific classes use the relevant feature prefix, such as `dashboard-*` in `src/components/AccountDialogs.tsx`.
- New frontend page paths must be added explicitly to the pathname dispatch in `src/App.tsx`; there is no router configured in the sampled code.

## Intentional non-standard choices
- Authentication state currently lives in a slice named `signupSlice`; `src/App.tsx` and `src/components/AccountDialogs.tsx` both use `state.signup`. Do not flag this naming unless renaming the slice and all dependent actions/selectors.
- The backend calls `dns.setServers(["8.8.8.8", "1.1.1.1"])` in `backend/src/server.ts`, apparently to control MongoDB DNS resolution. Treat it as an environment workaround rather than a random unused statement.
- The frontend intentionally implements minimal routing with `window.location.pathname` instead of React Router.

## Watch out for
- New protected endpoints must apply `authenticateToken`; destructive operations must verify ownership using `request.userId`.
- Do not broaden user projections or return Mongoose user documents directly, which could expose `password`.
- Preserve profile-image constraints across client and server: JPEG/PNG/WebP, maximum 2 MB, with the server-side validation in `backend/src/routes/authRoutes.ts` treated as authoritative.
- Dynamic sorting must remain restricted to `name`, `email`, or `createdAt`; never pass arbitrary query values into `.sort()`.
- Keep backend payload limits aligned with image handling (`express.json({ limit: "3mb" })` in `backend/src/server.ts`).
- Investigate the root `package.json` description containing `<<<<<<< HEAD`; this appears to be an unresolved merge-conflict artifact.