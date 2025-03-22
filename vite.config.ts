import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // Enable source maps
  },
  server: {
    port: 5173,
    proxy: {
      '/create-checkout-session': {
        target: 'http://localhost:3000', // Replace with your backend server URL
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'https://1davqfh3i7.execute-api.eu-north-1.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
