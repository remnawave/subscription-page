import { SubscriptionPageRawConfigSchema } from '@remnawave/subscription-page-types'
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

import { formatDaysLeft, statusTone } from '../../src/pages/main/lib/page-model'

const config = JSON.parse(
    readFileSync(new URL('../../../config/yung-link.subpage.json', import.meta.url), 'utf8')
)

describe('Yung Link subpage config', () => {
    it('passes the Remnawave schema', () => {
        expect(SubscriptionPageRawConfigSchema.safeParse(config).success).toBe(true)
    })

    it('contains the exact supported application matrix', () => {
        const matrix = Object.fromEntries(
            Object.entries(config.platforms).map(([key, value]) => [
                key,
                (value as { apps: { name: string }[] }).apps.map((app) => app.name)
            ])
        )

        expect(matrix).toEqual({
            android: ['Happ', 'V2RayTun'],
            androidTV: ['Happ', 'V2RayTun'],
            ios: ['Happ', 'V2RayTun'],
            macos: ['Happ', 'V2RayTun'],
            windows: ['Happ', 'V2RayTun'],
            appleTV: ['Happ'],
            linux: ['Happ']
        })
    })

    it('uses only plain Happ and V2RayTun subscription schemes', () => {
        const serialized = JSON.stringify(config)

        expect(serialized).toContain('happ://add/{{SUBSCRIPTION_LINK}}')
        expect(serialized).toContain('v2raytun://import/{{SUBSCRIPTION_LINK}}')
        expect(serialized).not.toMatch(/crypt4|providerid|hide-settings|premium/i)
    })

    it('keeps individual connection keys hidden', () => {
        expect(config.baseSettings.showConnectionKeys).toBe(false)
        expect(config.baseSettings.hideGetLinkButton).toBe(false)
    })
})

describe('subscription state helpers', () => {
    it('maps all Remnawave states to semantic tones', () => {
        expect(statusTone('ACTIVE')).toBe('positive')
        expect(statusTone('LIMITED')).toBe('warning')
        expect(statusTone('DISABLED')).toBe('negative')
        expect(statusTone('EXPIRED')).toBe('negative')
    })

    it('formats remaining days in both locales', () => {
        expect(formatDaysLeft(1, 'en')).toBe('1 day')
        expect(formatDaysLeft(2, 'ru')).toBe('2 дня')
        expect(formatDaysLeft(-1, 'ru')).toBe('0 дней')
    })
})
