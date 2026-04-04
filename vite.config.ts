import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  base: '/CRYPTO-GONOX/',
  plugins: [react()], 
   resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        // Выносим Firebase в отдельный файл, так как он самый жирный
        if (id.includes('node_modules/@firebase') || id.includes('node_modules/firebase')) {
          return 'firebase-bundle';
        }
        // Все остальные библиотеки из node_modules пойдут в vendor
        if (id.includes('node_modules')) {
          return 'vendor';
        }
      }
    }
  }
}
})