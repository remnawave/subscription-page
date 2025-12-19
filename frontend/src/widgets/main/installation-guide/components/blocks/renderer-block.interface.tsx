import {
    TSubscriptionPageBlockConfig,
    TSubscriptionPageButtonConfig,
    TSubscriptionPageLanguageCode
} from '@remnawave/subscription-page-types'
import { ButtonVariant } from '@mantine/core'

export interface IBlockRendererProps {
    blocks: TSubscriptionPageBlockConfig[]
    currentLang: TSubscriptionPageLanguageCode
    getIconFromLibrary: (iconKey: string) => string
    isMobile: boolean
    renderBlockButtons: (
        buttons: TSubscriptionPageButtonConfig[],
        variant: ButtonVariant
    ) => React.ReactNode
    svgLibrary: Record<string, string>
}
