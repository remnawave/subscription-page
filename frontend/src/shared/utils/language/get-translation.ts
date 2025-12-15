import {
    TSubscriptionPageLanguageCode,
    TSubscriptionPageLocalizedText
} from '@remnawave/subscription-page-types'

export const getLocalizedText = (
    textObj: TSubscriptionPageLocalizedText,
    lang: TSubscriptionPageLanguageCode
): string => {
    if (!textObj) return ''
    return textObj[lang]
}
