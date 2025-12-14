import { SubscriptionPageTemplateKeys } from '@remnawave/subscription-page-types'

type TemplateValues = {
    [key in SubscriptionPageTemplateKeys]: number | string | undefined
}

export class TemplateEngine {
    static replace(template: string, values: TemplateValues): string {
        let hasReplacement = false
        const result = template.replace(
            /\{\{(\w+)\}\}/g,
            (match, key: SubscriptionPageTemplateKeys) => {
                if (values[key] !== undefined) {
                    hasReplacement = true
                    return values[key]?.toString() || ''
                }
                return match
            }
        )

        return hasReplacement ? result : template
    }

    static formatWithMetaInfo(
        template: string,
        metaInfo: { username: string; subscriptionUrl: string }
    ): string {
        return this.replace(template, {
            USERNAME: metaInfo.username,
            SUBSCRIPTION_LINK: metaInfo.subscriptionUrl
        })
    }
}
