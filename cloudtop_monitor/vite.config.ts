import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const PORT = +env.VITE_PORT || 8000

  return {
    server: {
      port: PORT,
    },
    preview: {
      host: true,
      port: PORT,
      strictPort: true,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            antd_lib: ['antd/lib'],
            antd: ['antd'],
            echarts: ['echarts'],
          },
        },
      },
    },
    plugins: [react()],
  }
})
