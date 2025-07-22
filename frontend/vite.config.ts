import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config()

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  preview: {
    port: Number(process.env.FRONTEND_PORT),
    strictPort: true,
  },
  server: {
    port: Number(process.env.FRONTEND_PORT),
    strictPort: true,
    host: true,
    origin: "http://0.0.0.0:8080",
    allowedHosts: ['qkeliq.eu'],
  },
});
