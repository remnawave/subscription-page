/* eslint-disable indent */
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator'
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
        webfontDownload(undefined, {}),
        obfuscatorPlugin({
            exclude: [/node_modules/, /app.tsx/],
            apply: 'build',
            debugger: false,
            options: {
                compact: true,
                controlFlowFlattening: false,
                deadCodeInjection: false,
                debugProtection: true,
                debugProtectionInterval: 0,
                domainLock: [],
                disableConsoleOutput: true,
                identifierNamesGenerator: 'hexadecimal',
                log: false,
                numbersToExpressions: false,
                renameGlobals: false,
                selfDefending: false,
                simplify: true,
                splitStrings: false,
                stringArray: true,
                stringArrayCallsTransform: false,
                stringArrayCallsTransformThreshold: 0.5,
                stringArrayEncoding: [],
                stringArrayIndexShift: true,
                stringArrayRotate: true,
                stringArrayShuffle: true,
                stringArrayWrappersCount: 1,
                stringArrayWrappersChainedCalls: true,
                stringArrayWrappersParametersMaxCount: 2,
                stringArrayWrappersType: 'variable',
                stringArrayThreshold: 0.75,
                unicodeEscapeSequence: false
                // ...  [See more options](https://github.com/javascript-obfuscator/javascript-obfuscator)
            }
        })
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
                    mantine: [
                        '@mantine/core',
                        '@mantine/hooks',
                        '@mantine/dates',
                        '@mantine/nprogress',
                        '@mantine/notifications',
                        '@mantine/modals',
                        '@remnawave/backend-contract'
                    ],
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
