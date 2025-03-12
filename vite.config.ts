/* eslint-disable indent */
import removeConsole from 'vite-plugin-remove-console'
// import { visualizer } from 'rollup-plugin-visualizer'
import webfontDownload from 'vite-plugin-webfont-dl'
import tsconfigPaths from 'vite-tsconfig-paths'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
// import deadFile from 'vite-plugin-deadfile'

export default defineConfig({
    plugins: [
        react(),
        tsconfigPaths(),
        removeConsole(),
        webfontDownload(undefined, {})
        // visualizer() as PluginOption
    ],
    optimizeDeps: {
        include: ['html-parse-stringify']
    },
    build: {
        target: 'esNext',
        outDir: 'dist',
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ['react', 'react-dom', 'react-router-dom', 'zustand'],
                    icons: ['react-icons/pi'],
                    date: ['dayjs'],
                    zod: ['zod'],
                    mantine: [
                        '@mantine/core',
                        '@mantine/hooks',
                        '@mantine/dates',
                        '@mantine/nprogress',
                        '@mantine/notifications',
                        '@mantine/modals'
                    ],
                    remnawave: ['@remnawave/backend-contract'],
                    consola: ['consola'],
                    i18n: ['i18next', 'i18next-http-backend', 'i18next-browser-languagedetector'],
                    motion: ['framer-motion']
                }
            }
        }
    },
    define: {},
    server: {
        host: '0.0.0.0',
        port: 3334,
        cors: false,
        strictPort: true
    },
    resolve: {
        alias: {
            '@entities': fileURLToPath(new URL('./client/src/entities', import.meta.url)),
            '@features': fileURLToPath(new URL('./client/src/features', import.meta.url)),
            '@pages': fileURLToPath(new URL('./client/src/pages', import.meta.url)),
            '@widgets': fileURLToPath(new URL('./client/src/widgets', import.meta.url)),
            '@public': fileURLToPath(new URL('./public', import.meta.url)),
            '@shared': fileURLToPath(new URL('./client/src/shared', import.meta.url))
        }
    }
})
