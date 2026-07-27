import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Tailwind v4: официальный Vite-плагин, PostCSS-конфиг не нужен
// Источник: https://tailwindcss.com/docs/installation/using-vite
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
