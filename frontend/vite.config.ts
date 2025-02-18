import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  //Alowed host to host the aplication
  preview: {
    allowedHosts: ["truthful-respect-production-c10c.up.railway.app"]
  }
});