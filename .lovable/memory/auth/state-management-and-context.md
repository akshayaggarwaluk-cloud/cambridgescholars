---
name: Auth Context
description: ExternalAuthContext holds in-memory access token; refresh token in sessionStorage; user profile rehydrated from API
type: feature
---
The `ExternalAuthContext` manages auth state for the CSP website auth integration:
- **Access token**: kept in memory only (`setAccessToken`/`getAccessToken` in `authService`). Never persisted — protects against XSS.
- **Refresh token**: stored in `sessionStorage` under `cspRefreshToken`. Cleared when the tab closes.
- **User profile**: NOT persisted. After a page reload, the provider attempts a silent refresh: if successful, it calls `getProfile()` to rehydrate the user, otherwise the session is cleared.

Auth flows:
- **Login** (`apiLogin` → `authLogin(payload)`): one-step. Receives `{ access_token, refresh_token, user }` and stores them.
- **Registration** (2-step OTP): `sendRegisterOtp({ email, password, first_name, last_name })` → user enters the 6-digit code → `verifyRegisterOtp({ email, password, otp, first_name, last_name })` returns `{ access_token, refresh_token, user }` and `authLogin(payload)` is called.
- **Forgot password**: `forgotPassword(email)` always returns 200. User is redirected to `/reset-password?email=...` to enter the OTP and a new password (`resetPassword({ email, otp, new_password })`).
- **Logout**: calls upstream `logout` then wipes all client state.

User shape exposed to the UI: `{ id, email, username, name, firstName, lastName }`.

Routes: `/auth` (login + step-1 of register), `/forgot-password`, `/reset-password`.
