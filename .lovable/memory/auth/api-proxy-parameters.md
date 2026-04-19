---
name: Auth Proxy Params
description: Required arguments and response shapes for each auth-proxy endpoint
type: feature
---
The `auth-proxy` edge function expects `{ endpoint, ...payload }` in the request body.

| endpoint   | required payload                                       | success response                                  |
|------------|--------------------------------------------------------|---------------------------------------------------|
| `register` | `email`, `password` (8–128), `first_name`, `last_name` | `{ access_token, refresh_token, user }` (201)     |
| `login`    | `email`, `password`                                    | `{ access_token, refresh_token, user }` (200)     |
| `refresh`  | `refresh_token`                                        | `{ access_token }` (200)                          |
| `logout`   | (none)                                                 | `{ message }` (200)                               |

The `user` object includes `id`, `email`, `username`, `display_name`, `first_name`, `last_name`, `phone`, `registered_at`, and nested `billing` / `shipping` address objects.

Errors return `{ error, code? }` with HTTP status 400 (validation), 401 (invalid credentials/expired refresh), 409 (email already registered), or 429 (rate limited).
