---
paths:
  - '**'
---

# Deployment

## Every change or revision must be pushed and deployed
For every change/revision, in order:
1. Run `npm run build` for any frontend change and commit the rebuilt `public/build` assets.
2. `git push origin main`.
3. Provide the server commands the user must run themselves (e.g. `git pull` + cache clear). The app runs on docker-compose with `app/` and `public/build` mounted from the host, so `git pull` on the server applies PHP and JS changes without rebuilding the image.
