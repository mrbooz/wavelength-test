import { defineConfig } from "vite";

// GitHub Pages serves a project site under /<repo>/, so the asset base has to
// match the repo name. CI passes it in (see .github/workflows/deploy.yml) so a
// rename or fork doesn't silently break the deploy; local dev falls back to "/".
export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
});
