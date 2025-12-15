import {
    TSubscriptionPageLanguageCode,
    TSubscriptionPageRawConfig
} from '@remnawave/subscription-page-types'

export interface IState {
    config: TSubscriptionPageRawConfig | null
    currentLang: TSubscriptionPageLanguageCode
    isConfigLoaded: boolean
}
