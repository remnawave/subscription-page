import { spawn } from 'node:child_process'
import { resolve } from 'node:path'

const frontendDirectory = resolve(import.meta.dirname, '..')
const viteEntry = resolve(frontendDirectory, 'node_modules/vite/bin/vite.js')
const playwrightEntry = resolve(frontendDirectory, 'node_modules/@playwright/test/cli.js')
const healthUrl = 'http://127.0.0.1:3334/assets/favicon.svg'

const waitForServer = async () => {
    const deadline = Date.now() + 60_000

    const check = async () => {
        if (Date.now() >= deadline) {
            throw new Error(`Vite test server did not become ready at ${healthUrl}`)
        }

        try {
            const response = await fetch(healthUrl, { signal: AbortSignal.timeout(2_000) })

            if (response.ok) return true
        } catch {
            await new Promise((resolveDelay) => {
                setTimeout(resolveDelay, 250)
            })
        }

        return check()
    }

    return check()
}

const vite = spawn(process.execPath, [viteEntry, '--host', '127.0.0.1'], {
    cwd: frontendDirectory,
    env: {
        ...process.env,
        YUNG_LINK_TEST: '1'
    },
    stdio: 'inherit'
})

const stopVite = () => {
    if (!vite.killed) vite.kill()
}

process.once('SIGINT', stopVite)
process.once('SIGTERM', stopVite)

try {
    await waitForServer()

    const playwright = spawn(process.execPath, [playwrightEntry, 'test'], {
        cwd: frontendDirectory,
        env: process.env,
        stdio: 'inherit'
    })

    const exitCode = await new Promise((resolveExit) => {
        playwright.once('exit', (code) => resolveExit(code ?? 1))
    })

    stopVite()
    process.exitCode = exitCode
} catch (error) {
    stopVite()
    throw error
}
