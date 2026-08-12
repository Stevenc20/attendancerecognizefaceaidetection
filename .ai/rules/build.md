---
paths:
  - 'public/build/**'
---

# Build

## public/build assets are tracked in git
Frontend changes must run `npm run build` and commit the resulting `public/build` assets (tracked deliberately in commit e8f17d4 so users always get compiled JS). Never ship a frontend change without committing the rebuilt bundle.
