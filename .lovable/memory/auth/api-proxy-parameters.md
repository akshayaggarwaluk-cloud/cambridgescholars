---
name: Auth API Endpoint Params
description: Required arguments and response shapes for each CSP auth API endpoint (v3 OTP flow)
type: feature
---
All auth endpoints are at `https://api.cambridgescholars.com/api/website/auth/<endpoint>` and called directly from the browser via `authService.ts`.

| endpoint                | required payload                                                       | success response                              |
|-------------------------|------------------------------------------------------------------------|-----------------------------------------------|
| `register/send-otp`     | `email`, `password` (≥8), `first_name`, `last_name`                    | `{ message }` (200)                           |
| `register/verify-otp`   | `email`, `password`, `otp` (6 digits), `first_name`, `last_name`       | `{ access_token, refresh_token, user }` (201) |
| `login`                 | `email`, `password`                                                    | `{ access_token, refresh_token, user }` (200) |
| `refresh`               | `refresh_token`                                                        | `{ access_token }` (200)                      |
| `logout`                | (none)                                                                 | `{ message }` (200)                           |
| `forgot-password`       | `email`                                                                | `{ message }` (200, always)                   |
| `reset-password`        | `email`, `otp` (6 digits), `new_password` (≥8)                         | `{ message }` (200)                           |

The `user` object includes `id`, `email`, `username`, `display_name`, `first_name`, `last_name`, `phone`, `registered_at`, plus nested `billing` / `shipping` address objects.

Errors return `{ error, code? }` with status 400 / 401 / 404 / 409 / 429 / 502.
