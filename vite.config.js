import { defineConfig } from "vite";

// GitHub Pages serves the site under /<repo>/, so the asset base has to match.
export default defineConfig({
  base: "/wavelength-test/",
});
