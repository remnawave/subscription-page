// import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator'
// import { visualizer } from 'rollup-plugin-visualizer'
// import deadFile from 'vite-plugin-deadfile'
import removeConsole from 'vite-plugin-remove-console'
import { ViteEjsPlugin } from 'vite-plugin-ejs'
import { dirname, resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import 'dotenv/config'

const currentDirectory = dirname(fileURLToPath(import.meta.url))
const isYungLinkTest = process.env.YUNG_LINK_TEST === '1'
const testPanelData = isYungLinkTest
    ? Buffer.from(
        readFileSync(resolve(currentDirectory, 'tests/fixtures/subscription.json'), 'utf8')
    ).toString('base64')
    : undefined
const testSubpageConfig = isYungLinkTest
    ? readFileSync(resolve(currentDirectory, '../config/yung-link.subpage.json'), 'utf8')
    : undefined

export default defineConfig({
    plugins: [
        react(),
        removeConsole(),
        {
            name: 'yung-link-test-config',
            configureServer(server) {
                if (!testSubpageConfig) return

                server.middlewares.use((request, response, next) => {
                    const path = request.url?.split('?')[0]

                    if (path !== '/assets/.app-config-v2.json') {
                        next()
                        return
                    }

                    response.statusCode = 200
                    response.setHeader('Content-Type', 'application/json; charset=utf-8')
                    response.end(testSubpageConfig)
                })
            }
        },
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
                panelData: process.env.PANEL_DATA ?? testPanelData,
                metaDescription: process.env.META_DESCRIPTION,
                metaTitle: process.env.META_TITLE
            }
        })
    ],
    optimizeDeps: {
        include: ['html-parse-stringify']
    },
    build: {
        target: 'esnext',
        outDir: 'dist',
        rollupOptions: {
            output: {
                codeSplitting: {
                    groups: [
                        {
                            name: 'icons',
                            test: /node_modules[\\/](react-icons|@tabler[\\/]icons-react)[\\/]/
                        },
                        {
                            name: 'date',
                            test: /node_modules[\\/]dayjs[\\/]/
                        },
                        {
                            name: 'react',
                            test: /node_modules[\\/](react|zustand|react-dom|react-router|react-error-boundary)[\\/]/
                        },
                        {
                            name: 'mantine',
                            test: /node_modules[\\/]@mantine[\\/](core|hooks|nprogress|notifications|modals)[\\/]/
                        },
                        {
                            name: 'remnawave',
                            test: /node_modules[\\/]@remnawave[\\/](backend-contract|subscription-page-types)[\\/]/
                        }
                    ]
                }
            }
        }
    },
    server: {
        host: '0.0.0.0',
        port: 3334,
        cors: false,
        strictPort: true,
        allowedHosts: true
    },
    resolve: { tsconfigPaths: true }
})
