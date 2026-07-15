import { expect, Page, test } from '@playwright/test'

type UserStatus = 'ACTIVE' | 'DISABLED' | 'EXPIRED' | 'LIMITED'

const subscriptionFixture = (status: UserStatus) => ({
    response: {
        isFound: true,
        user: {
            shortUuid: 'demo-user',
            daysLeft: status === 'EXPIRED' ? 0 : 18,
            trafficUsed: status === 'LIMITED' ? '150 GB' : '12.4 GB',
            trafficLimit: '150 GB',
            lifetimeTrafficUsed: '48.2 GB',
            trafficUsedBytes: status === 'LIMITED' ? '161061273600' : '13314398617',
            trafficLimitBytes: '161061273600',
            lifetimeTrafficUsedBytes: '51754355917',
            username: 'demo-user',
            expiresAt:
                status === 'EXPIRED' ? '2026-07-01T12:00:00.000Z' : '2026-08-01T12:00:00.000Z',
            isActive: status === 'ACTIVE',
            userStatus: status,
            trafficLimitStrategy: 'NO_RESET'
        },
        links: [],
        ssConfLinks: {},
        subscriptionUrl: ''
    }
})

const openWithStatus = async (page: Page, status: UserStatus = 'ACTIVE') => {
    await page.route('**/demo-user*', async (route) => {
        if (route.request().resourceType() !== 'document') {
            await route.continue()
            return
        }

        const response = await route.fetch()
        const panelData = Buffer.from(JSON.stringify(subscriptionFixture(status))).toString(
            'base64'
        )
        const html = (await response.text()).replace(
            /data-panel="[^"]*"/,
            `data-panel="${panelData}"`
        )

        await route.fulfill({ response, body: html })
    })

    await page.goto(`/demo-user?status=${status}`)
    await expect(page.getByRole('heading', { level: 1, name: 'demo-user' })).toBeVisible()
}

test.describe('subscription states', () => {
    const states: [UserStatus, string][] = [
        ['ACTIVE', 'Активна'],
        ['DISABLED', 'Отключена'],
        ['LIMITED', 'Лимит исчерпан'],
        ['EXPIRED', 'Срок истёк']
    ]

    for (const [status, label] of states) {
        test(`renders ${status}`, async ({ page }) => {
            await openWithStatus(page, status)
            await expect(page.getByText(label, { exact: true })).toBeVisible()
        })
    }
})

test('shows the supported client matrix and plain import links', async ({ page }) => {
    await openWithStatus(page)
    await page.getByRole('tab', { exact: true, name: 'Android' }).click()

    await expect(page.getByRole('heading', { name: 'Happ' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'V2RayTun' })).toBeVisible()
    await expect(page.locator('a[href^="happ://add/"]')).toBeVisible()
    await expect(page.locator('a[href^="v2raytun://import/"]')).toBeVisible()

    await page.getByRole('tab', { name: 'Linux' }).click()
    await expect(page.getByRole('heading', { name: 'Happ' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'V2RayTun' })).toHaveCount(0)
    await expect(page.getByRole('link', { name: /\.deb/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /\.rpm/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /\.pkg/ })).toBeVisible()

    await page.getByRole('tab', { name: 'Apple TV' }).click()
    await expect(page.getByRole('heading', { name: 'Happ' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'V2RayTun' })).toHaveCount(0)

    const html = await page.locator('body').innerHTML()
    expect(html).not.toMatch(/crypt4|providerid|hide-settings|premium/i)
})

test('offers manual copy, QR code and English copy', async ({ page }) => {
    await openWithStatus(page)

    await expect(page.locator('#subscription-link')).toHaveValue(/\/demo-user$/)
    await page.getByRole('button', { name: 'Показать QR-код' }).click()
    await expect(page.getByRole('dialog', { name: 'QR-код подписки' })).toBeVisible()
    await page.getByRole('button', { name: 'Закрыть' }).click()

    await page.getByRole('button', { name: 'EN' }).click()
    await expect(page.getByRole('heading', { name: 'Choose your device' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Contact support' })).toBeVisible()
})

for (const width of [360, 390, 768, 1440]) {
    test(`has no horizontal page scroll at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 1000 })
        await openWithStatus(page)

        const dimensions = await page.evaluate(() => ({
            viewport: document.documentElement.clientWidth,
            content: document.documentElement.scrollWidth
        }))

        expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport)
    })
}
