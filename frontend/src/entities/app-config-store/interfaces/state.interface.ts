import {
    TSubscriptionPageLanguageCode,
    TSubscriptionPageRawConfig
} from '@remnawave/subscription-page-types'

export interface IState {
    config: null | TSubscriptionPageRawConfig
    currentLang: TSubscriptionPageLanguageCode
    isConfigLoaded: boolean
}
