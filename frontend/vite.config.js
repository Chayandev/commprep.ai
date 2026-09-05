import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom", "@emotion/react", "@emotion/styled"],
  },
  optimizeDeps: {
    include: [
      "react",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-dom",
      "react-dom/client",
      "@mui/material",
      "@mui/material/styles",
      "@mui/icons-material",
      "@emotion/react",
      "@emotion/styled",
      "react-router-dom",
      "react-redux",
      "@reduxjs/toolkit",
    ],
  },
});
