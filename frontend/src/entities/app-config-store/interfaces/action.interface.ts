import {
    TSubscriptionPageLanguageCode,
    TSubscriptionPageRawConfig
} from '@remnawave/subscription-page-types'

import { IState } from './state.interface'

export interface IActions {
    actions: {
        getInitialState: () => IState
        resetState: () => Promise<void>
        setConfig: (config: TSubscriptionPageRawConfig) => void
        setLanguage: (lang: TSubscriptionPageLanguageCode) => void
    }
}
