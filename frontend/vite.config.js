import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(
  {
    plugins: [react()],
  }
  // () => {
  //   return {
  //     define: {
  //       __APP_ENV__: process.env.VITE_BASE_URL,
  //     },
  //   };
  // }
);
