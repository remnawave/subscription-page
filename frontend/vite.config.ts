// import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator'
// import { visualizer } from 'rollup-plugin-visualizer'
// import deadFile from 'vite-plugin-deadfile'
import removeConsole from 'vite-plugin-remove-console'
import webfontDownload from 'vite-plugin-webfont-dl'
import tsconfigPaths from 'vite-tsconfig-paths'
import { ViteEjsPlugin } from 'vite-plugin-ejs'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import 'dotenv/config'

export default defineConfig({
    plugins: [
        react(),
        tsconfigPaths(),
        removeConsole(),
        webfontDownload(undefined, {}),
        ViteEjsPlugin((viteConfig) => {
            if (process.env.NODE_ENV === 'production') {
                return {
                    root: viteConfig.root,
                    panelData: '<%- panelData %>',
                    metaDescription: '<%= metaDescription %>',
                    metaTitle: '<%= metaTitle %>'
                }
            }
            return {
                root: viteConfig.root,
                panelData: process.env.PANEL_DATA,
                metaDescription: process.env.META_DESCRIPTION,
                metaTitle: process.env.META_TITLE
            }
        })
        // obfuscatorPlugin({
        //     exclude: [/node_modules/, /app.tsx/],
        //     apply: 'build',
        //     debugger: false,
        //     options: {
        //         compact: true,
        //         controlFlowFlattening: false,
        //         deadCodeInjection: false,
        //         debugProtection: true,
        //         debugProtectionInterval: 0,
        //         domainLock: [],
        //         disableConsoleOutput: true,
        //         identifierNamesGenerator: 'hexadecimal',
        //         log: false,
        //         numbersToExpressions: false,
        //         renameGlobals: false,
        //         selfDefending: false,
        //         simplify: true,
        //         splitStrings: false,
        //         stringArray: true,
        //         stringArrayCallsTransform: false,
        //         stringArrayCallsTransformThreshold: 0.5,
        //         stringArrayEncoding: [],
        //         stringArrayIndexShift: true,
        //         stringArrayRotate: true,
        //         stringArrayShuffle: true,
        //         stringArrayWrappersCount: 1,
        //         stringArrayWrappersChainedCalls: true,
        //         stringArrayWrappersParametersMaxCount: 2,
        //         stringArrayWrappersType: 'variable',
        //         stringArrayThreshold: 0.75,
        //         unicodeEscapeSequence: false
        //         // ...  [See more options](https://github.com/javascript-obfuscator/javascript-obfuscator)
        //     }
        // })
        // visualizer()
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
                    icons: ['react-icons/pi', '@tabler/icons-react'],
                    date: ['dayjs'],
                    react: [
                        'react',
                        'zustand',
                        'react-dom',
                        'react-router-dom',
                        'react-error-boundary',
                        'react-dom/client'
                    ],
                    mantine: [
                        '@mantine/core',
                        '@mantine/hooks',
                        '@mantine/nprogress',
                        '@mantine/notifications',
                        '@mantine/modals'
                    ],
                    i18n: [
                        'i18next-browser-languagedetector',
                        '@remnawave/backend-contract',
                        '@remnawave/subscription-page-types'
                    ]
                }
            }
        }
    },
    server: {
        host: '0.0.0.0',
        port: 3334,
        cors: false,
        strictPort: true
    },
    resolve: {
        alias: {
            '@entities': fileURLToPath(new URL('./src/entities', import.meta.url)),
            '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
            '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
            '@widgets': fileURLToPath(new URL('./src/widgets', import.meta.url)),
            '@public': fileURLToPath(new URL('./public', import.meta.url)),
            '@shared': fileURLToPath(new URL('./src/shared', import.meta.url))
        }
    }
})
