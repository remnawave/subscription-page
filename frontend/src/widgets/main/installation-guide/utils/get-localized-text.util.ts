import {
    TSubscriptionPageLocales,
    TSubscriptionPageLocalizedText
} from '@remnawave/subscription-page-types'

export const getLocalizedText = (
    textObj: TSubscriptionPageLocalizedText | undefined,
    lang: TSubscriptionPageLocales
): string => {
    if (!textObj) return ''
    return textObj[lang as keyof typeof textObj] || textObj.en
}
