import { useCallback } from 'react'
import { TSubscriptionPageLocalizedText } from '@remnawave/subscription-page-types'

import { useAppConfig, useCurrentLang } from '@entities/app-config-store'
import { getLocalizedText } from '@shared/utils/language/get-translation'

export const useTranslation = () => {
    const config = useAppConfig()
    const currentLang = useCurrentLang()

    const t = useCallback(
        (textObj: TSubscriptionPageLocalizedText) => getLocalizedText(textObj, currentLang),
        [currentLang]
    )

    return {
        t,
        currentLang,
        baseTranslations: config.baseTranslations
    }
}
