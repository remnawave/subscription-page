import {
    TSubscriptionPageLanguageCode,
    TSubscriptionPageRawConfig
} from '@remnawave/subscription-page-types'
import { create } from 'zustand'

import { IActions, IState } from './interfaces'

function detectLanguage(
    supportedLocales: TSubscriptionPageLanguageCode[]
): TSubscriptionPageLanguageCode {
    const cached = window.localStorage.getItem('i18nextLng')
    const shortLang = cached?.split('-')[0]

    if (shortLang && supportedLocales.includes(shortLang as TSubscriptionPageLanguageCode)) {
        return shortLang as TSubscriptionPageLanguageCode
    }

    return supportedLocales[0]!
}

const initialState: IState = {
    config: null,
    currentLang: 'ru',
    isConfigLoaded: false
}

export const useAppConfigStore = create<IActions & IState>()((set) => ({
    ...initialState,
    actions: {
        setConfig: (config: TSubscriptionPageRawConfig) => {
            const detectedLang = detectLanguage(config.locales)

            set({
                config,
                currentLang: detectedLang,
                isConfigLoaded: true
            })
        },

        setLanguage: (lang: TSubscriptionPageLanguageCode) => {
            window.localStorage.setItem('i18nextLng', lang)
            set({ currentLang: lang })
        },

        getInitialState: () => {
            return initialState
        },

        resetState: async () => {
            set({ ...initialState })
        }
    }
}))

export const useAppConfigStoreActions = () => useAppConfigStore((store) => store.actions)

export const useAppConfigNullable = () => useAppConfigStore((state) => state.config)

export const useAppConfig = (): TSubscriptionPageRawConfig => {
    const config = useAppConfigStore((state) => state.config)
    if (!config) {
        throw new Error('useAppConfig must be used after config is loaded (after RootLayout gate)')
    }
    return config
}

export const useLocales = () => useAppConfigStore((state) => state.config!.locales)

export const useCurrentLang = () => useAppConfigStore((state) => state.currentLang)

export const useIsConfigLoaded = () => useAppConfigStore((state) => state.isConfigLoaded)
