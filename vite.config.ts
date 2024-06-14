import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import vitePluginImp from 'vite-plugin-imp'

// eslint-disable-next-line no-undef
const pathSrc = path.resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return defineConfig({
    server: {
      host: '0.0.0.0',
      proxy: {
        '^/api/.*': {
          target: env.VITE_API,
          // target: 'http://localhost:9999',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    plugins: [
      react(),
      vitePluginImp({
        libList: [
          {
            libName: 'antd-mobile',
            style: () => false,
            libDirectory: 'es/components',
            replaceOldImport: true,
          },
        ],
      }),
    ],

    resolve: {
      alias: {
        '~/': `${pathSrc}/`,
      },
    },
  })
}
