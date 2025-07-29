import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr()
  ],
  resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  },
  define: {
    // thay thế 'global' trong bundle thành 'window'
    global: 'window'
  },
  optimizeDeps: {
    // ép Vite bundle riêng hai lib này trước, để define tác dụng lên chúng
    include: ['sockjs-client', 'stompjs']
  }
})
