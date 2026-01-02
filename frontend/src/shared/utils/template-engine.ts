import { TSubscriptionPageTemplateKey } from '@remnawave/subscription-page-types'
import { createHappCryptoLink } from '@kastov/cryptohapp'

type TemplateValues = {
    [key in TSubscriptionPageTemplateKey]: number | string | undefined
}

type LazyTemplateValues = {
    [key in TSubscriptionPageTemplateKey]?: (() => string | undefined) | string | undefined
}

export class TemplateEngine {
    static formatWithMetaInfo(
        template: string,
        metaInfo: { subscriptionUrl: string; username: string }
    ): string {
        return this.replaceLazy(template, {
            USERNAME: metaInfo.username,
            SUBSCRIPTION_LINK: metaInfo.subscriptionUrl,
            HAPP_CRYPT3_LINK: () =>
                createHappCryptoLink(metaInfo.subscriptionUrl, 'v3', true) || 'unknown',
            HAPP_CRYPT4_LINK: () =>
                createHappCryptoLink(metaInfo.subscriptionUrl, 'v4', true) || 'unknown'
        })
    }

    static replace(template: string, values: TemplateValues): string {
        let hasReplacement = false
        const result = template.replace(
            /\{\{(\w+)\}\}/g,
            (match, key: TSubscriptionPageTemplateKey) => {
                if (values[key] !== undefined) {
                    hasReplacement = true
                    return values[key]?.toString() || ''
                }
                return match
            }
        )

        return hasReplacement ? result : template
    }

    static replaceLazy(template: string, lazyValues: LazyTemplateValues): string {
        let hasReplacement = false
        const result = template.replace(
            /\{\{(\w+)\}\}/g,
            (match, key: TSubscriptionPageTemplateKey) => {
                const value = lazyValues[key]
                if (value !== undefined) {
                    const resolved = typeof value === 'function' ? value() : value
                    if (resolved !== undefined) {
                        hasReplacement = true
                        return resolved.toString()
                    }
                }
                return match
            }
        )

        return hasReplacement ? result : template
    }
}
