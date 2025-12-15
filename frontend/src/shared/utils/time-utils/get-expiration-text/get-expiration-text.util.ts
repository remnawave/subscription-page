import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import 'dayjs/locale/fa'
import {
    TSubscriptionPageLanguageCode,
    TSubscriptionPageRawConfig
} from '@remnawave/subscription-page-types'
import { getLocalizedText } from '@shared/utils/language/get-translation'

export function getExpirationTextUtil(
    expireAt: Date | null | string,
    currentLang: TSubscriptionPageLanguageCode,
    baseTranslations: TSubscriptionPageRawConfig['baseTranslations']
): string {
    if (!expireAt) {
        return 'Unknown'
    }

    const expiration = dayjs(expireAt).locale(currentLang)
    const now = dayjs()

    if (expiration.isBefore(now)) {
        return `${getLocalizedText(baseTranslations.expired, currentLang)} ${expiration.fromNow(false)}`
    }

    if (expiration.year() === 2099) {
        return getLocalizedText(baseTranslations.indefinitely, currentLang)
    }

    return `${getLocalizedText(baseTranslations.expiresIn, currentLang)} ${expiration.fromNow(false)}`
}

export const formatDate = (
    dateStr: Date | string,
    currentLang: TSubscriptionPageLanguageCode,
    baseTranslations: TSubscriptionPageRawConfig['baseTranslations']
) => {
    if (dayjs(dateStr).year() === 2099) {
        return getLocalizedText(baseTranslations.indefinitely, currentLang)
    }
    return dayjs(dateStr).locale(currentLang).format('DD.MM.YYYY')
}
