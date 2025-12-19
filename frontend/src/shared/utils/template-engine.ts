import { TSubscriptionPageTemplateKey } from '@remnawave/subscription-page-types'

type TemplateValues = {
    [key in TSubscriptionPageTemplateKey]: number | string | undefined
}

export class TemplateEngine {
    static formatWithMetaInfo(
        template: string,
        metaInfo: { subscriptionUrl: string; username: string }
    ): string {
        return this.replace(template, {
            USERNAME: metaInfo.username,
            SUBSCRIPTION_LINK: metaInfo.subscriptionUrl
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
}
