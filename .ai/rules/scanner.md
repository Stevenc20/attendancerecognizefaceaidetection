---
paths:
  - 'resources/js/pages/admin/scanner/**'
---

# Scanner

## Scanner URLs must be root-relative and guarded
The face scanner calls loadFromUri + fetch before starting the camera, so any HTML response (404/500/redirect) aborts init with a JSON parse error. Use Wayfinder helpers (`@/routes/admin/scanner`) for API calls and root-relative paths (`/models`, `/sounds/ding.mp3`) for static app files, and always check `response.ok`/redirect before `.json()` so failures show the real URL + HTTP status.

## Do NOT use import.meta.env.BASE_URL for static paths
In this project BASE_URL compiles to `/build/` (the laravel-vite-plugin asset base), NOT the app root. Prefixing static paths with it produces `/build/models/...` which 404s. Models live at `/models` (served from public/models) exactly like `resources/js/pages/student/enrollment/index.tsx`. Vite-managed asset URLs (fonts/css/js) already get the correct base automatically.
