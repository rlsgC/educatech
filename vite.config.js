import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// base './': la página funciona en cualquier dirección (por ejemplo GitHub Pages: usuario.github.io/repositorio/).
export default defineConfig({
  base: './',
  plugins: [react()],
})
