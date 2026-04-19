---
name: Auth API Direct Integration
description: Direct browser → CSP website auth API v3 integration with 2-step OTP registration and OTP-based password reset
type: feature
---
The authentication system is integrated **directly** with the Cambridge Scholars website auth API at `https://api.cambridgescholars.com/api/website/auth`. There is no Supabase edge function proxy — the React app calls the API straight from the browser via `src/services/authService.ts`. CORS must be configured upstream for this to work.

The API exposes seven endpoints:

- `register/send-otp` — body: `{ email, password, first_name, last_name }`. Validates input, checks for duplicates, sends a 6-digit OTP. Returns `{ message }`. OTP expires in 15 minutes.
- `register/verify-otp` — body: `{ email, password, otp, first_name, last_name }`. Verifies the OTP and creates the account. Returns `{ access_token, refresh_token, user }` (201).
- `login` — body: `{ email, password }`. Returns `{ access_token, refresh_token, user }`.
- `refresh` — body: `{ refresh_token }`. Returns `{ access_token }`.
- `logout` — no body. Returns `{ message }`.
- `forgot-password` — body: `{ email }`. Always returns 200 (prevents enumeration). Sends a reset OTP.
- `reset-password` — body: `{ email, otp, new_password }`. Verifies the OTP and sets the new password.

Error codes: 400 (validation), 401 (invalid creds / refresh expired), 404 (email not found on reset), 409 (already registered), 429 (too many OTP attempts / rate limited), 502 (failed to send email).
