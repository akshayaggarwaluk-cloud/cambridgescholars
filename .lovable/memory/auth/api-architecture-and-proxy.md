---
name: Auth API Proxy
description: Supabase auth-proxy edge function bridges the React app to the CSP website auth API to bypass CORS
type: feature
---
The authentication system is integrated with the Cambridge Scholars website auth API at `https://api.cambridgescholars.com/api/website/auth`. To bypass CORS, all auth requests are routed through the `auth-proxy` Supabase edge function, which validates input (rate-limit, email, password length, name length) and forwards sanitized payloads upstream.

The proxy supports exactly four endpoints, matching the v2 spec:
- `register` — body: `{ email, password, first_name, last_name }`. Returns `{ access_token, refresh_token, user }`.
- `login` — body: `{ email, password }`. Returns `{ access_token, refresh_token, user }`.
- `refresh` — body: `{ refresh_token }`. Returns `{ access_token }`.
- `logout` — no body. Returns `{ message }`.

The legacy OTP endpoints (`send-otp`, `validate-otp`, `user-exist`, `forgot-password`, `reset-password`) and the `/set-password` page are no longer supported by the upstream API and have been removed.
