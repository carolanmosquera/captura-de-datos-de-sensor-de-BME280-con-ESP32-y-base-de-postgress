import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    // Forzamos a Vite a pre-procesar Recharts y su librería interna 
    // react-smooth para resolver y limpiar cualquier función corrupta antes de que llegue al navegador.
    include: ['recharts', 'react-smooth']
  }
})