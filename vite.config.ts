import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0", // accessible on local network
    port: 8080,
  },
  plugins: [
    react(),
    // Example: only add extra plugins in development
    ...(mode === "development"
      ? [
          // put dev-only plugins here
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // alias for imports
    },
  },
}));
