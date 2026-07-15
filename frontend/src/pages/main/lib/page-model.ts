import { TSubscriptionPageLanguageCode } from '@remnawave/subscription-page-types'

type UserStatus = 'ACTIVE' | 'DISABLED' | 'EXPIRED' | 'LIMITED'

export const normalizeLanguage = (language: TSubscriptionPageLanguageCode): 'en' | 'ru' =>
    language === 'en' ? 'en' : 'ru'

export const formatExpiryDate = (date: Date, language: 'en' | 'ru'): string =>
    new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }).format(new Date(date))

export const formatDaysLeft = (days: number, language: 'en' | 'ru'): string => {
    const safeDays = Math.max(0, days)

    if (language === 'en') {
        return `${safeDays} ${safeDays === 1 ? 'day' : 'days'}`
    }

    const category = new Intl.PluralRules('ru-RU').select(safeDays)
    let unit = 'дней'

    if (category === 'one') unit = 'день'
    if (category === 'few') unit = 'дня'

    return `${safeDays} ${unit}`
}

export const statusTone = (status: UserStatus): 'negative' | 'positive' | 'warning' => {
    if (status === 'ACTIVE') return 'positive'
    if (status === 'LIMITED') return 'warning'
    return 'negative'
}
