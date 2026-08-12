---
paths:
  - 'resources/js/pages/admin/scanner/**'
---

# Scanner

## Scanner URLs must be base-path aware and guarded
The face scanner calls loadFromUri + fetch before starting the camera, so any HTML response (404/500/redirect) aborts init with a JSON parse error. Use the module-level `baseUrl` (import.meta.env.BASE_URL) and Wayfinder helpers (`@/routes/admin/scanner`), and always check `response.ok`/redirect before `.json()` so failures show the real URL + HTTP status. Do not hardcode root-absolute paths.
