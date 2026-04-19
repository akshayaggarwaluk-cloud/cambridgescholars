---
name: Auth Context
description: ExternalAuthContext holds in-memory access token and persists refresh token + user in localStorage
type: feature
---
The `ExternalAuthContext` manages auth state for the CSP website auth integration:
- **Access token**: kept in memory only via the module-level state in `authService` (`setAccessToken` / `getAccessToken`). Never persisted — protects against XSS exfiltration.
- **Refresh token**: stored in `localStorage` under key `cspRefreshToken` so sessions survive reloads.
- **User profile**: stored in `localStorage` under key `authUser` for instant UI hydration.

On mount the provider attempts a silent refresh: if a refresh token exists, it calls `refreshAccessToken()` to obtain a new access token and rehydrates the session. If refresh fails, all auth state is cleared.

`login(payload)` accepts the full `AuthSuccessResponse` (`{ access_token, refresh_token, user }`) returned by `authService.login` / `authService.register`. `logout()` calls the upstream logout endpoint then wipes all client state.

User shape exposed to the UI: `{ id, email, username, name, firstName, lastName }`.
