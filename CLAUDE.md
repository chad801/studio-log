# FamilyHub — Claude Code Handoff

## Project snapshot

- **Repo:** chad801/familyhub (GitHub), branch `main`, HEAD `6b4d206`
- **Local path:** `C:\Users\chad\OneDrive\Documents\New project\familyhub`
- **Type:** React Native family-management app (iOS), Expo SDK 54 / RN 0.81.5
- **Backend:** Node/Express + PostgreSQL + WebSockets
- **CI/CD:** Codemagic — auto-triggers `ios-testflight` on every push to `main`
- **Bundle ID:** `com.broadhead.familyhub`, version `1.0.0`, build `10`

## Stack

| Layer | Tech |
|---|---|
| Mobile | Expo ~54.0.0, RN 0.81.5, React Navigation v7, Zustand v4, expo-secure-store, Ionicons |
| Backend | Node/Express, PostgreSQL (pg), JWT auth, WebSockets (ws), multer |
| API base URLs | Dev: `http://10.1.10.28:3001/api/v1` · Prod: `https://chcportal.synology.me:3002/api/v1` |

## Architecture

### Mobile entry points

- `mobile/App.js` — wraps everything in `ErrorBoundary`
- `mobile/src/api/client.js` — axios instance with JWT refresh interceptor; lazy-requires `authStore` on 401 to avoid circular imports
- `mobile/src/store/authStore.js` — Zustand store: `{ user, isLoading, init(), loginWithPin(userId, pin), loginWithPassword(username, password), logout() }`
- `mobile/src/navigation/RootNavigator.js` — two separate `Stack.Navigator` instances (see critical rules below)
- `mobile/src/navigation/MainTabs.js` — custom `FloatingTabBar` pill UI; hidden tabs use `tabBarButton: () => null`

### Visible tabs

Dashboard, Calendar, Chores, Messages, Schedule

### Hidden tabs (navigated from Dashboard tile grid)

Meals, Finance, Documents, Profile, Albums, Lists, Game

### Stack screens

SelectUser, Pin, Login, Admin

### Server

- `server/index.js` — Express; auto-runs SQL migrations on startup, listens on `PORT 3000`
- `server/routes/` — auth, admin, users, chores, messages, calendar, schedule, meals, finance, documents, albums, lists, notifications
- `server/migrations/` — `001_initial_schema.sql`, `002_phase1_features.sql`

## Critical navigation rules — do not break

1. **Two separate `Stack.Navigator` instances in `RootNavigator.js`.** Using a Fragment or conditional children inside a single navigator crashes Hermes on production builds — this was the root cause of the blank white screen that was just fixed.

2. **`MainTabs.js` must unconditionally register ALL `Tab.Screen` elements.** The Admin tab is hidden via `tabBarButton: () => null`; access is controlled at the screen level. React Navigation throws if tab count changes after mount.

3. **`authStore.init()` has a two-level try/catch** specifically to ensure `isLoading` never gets stuck at `true`.

## Auth flow

1. `SelectUserScreen` — grid of family member avatars
2. Tap → `PinScreen` (4-digit PIN)
3. `LoginScreen` — fallback for admin/password users
4. Tokens stored in `expo-secure-store`; refresh handled automatically in `client.js` interceptor

## Recent work (already pushed)

- Fixed blank-white-screen crash on iOS production builds (Fragment nav children + conditional `Tab.Screen`)
- Added `ErrorBoundary` component wrapping the whole app
- Hardened `authStore.init()` so `isLoading` never gets stuck
- Added Codemagic auto-trigger on push to `main`
- Restored ~20 files truncated by a prior conflict-resolution script — all JS/JSON verified clean

## Known issues / next tasks

- [ ] `GameScreen.js` may not be fully wired into the Dashboard tile grid — verify
- [ ] Push notifications (`server/services/pushNotifications.js`) implemented but not tested end-to-end
- [ ] No unit or integration tests anywhere in the project
- [ ] Server uses emoji characters in some string constants — verify encoding survives the PostgreSQL round-trip in production

## Running locally

```bash
# Mobile
cd mobile
npm install
npx expo start

# Server (requires .env with DATABASE_URL, JWT_SECRET, etc.)
cd server
npm install
npm start
```

## Triggering a build

Push to `main` — Codemagic auto-triggers the `ios-testflight` workflow.
