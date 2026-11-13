import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite is the tool that runs your React code in the browser while you work, the way `node` runs your JavaScript
// files. The react plugin lets it understand JSX.
export default defineConfig({
  plugins: [react()],
});
