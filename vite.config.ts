import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite(),vanillaExtractPlugin({
    // configuration
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: process.env.VITE_AI_API_URL,
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //     },
  //   },
  // },
});
