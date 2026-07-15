import { defineConfig } from '@playwright/test'

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: false,
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
    use: {
        baseURL: 'http://127.0.0.1:3334',
        channel: process.platform === 'win32' ? 'chrome' : undefined,
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure'
    }
})
