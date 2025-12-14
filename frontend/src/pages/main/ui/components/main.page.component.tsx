import { Box, Center, Container, Group, Image, Stack, Text, Title } from '@mantine/core'

import { LanguagePicker } from '@shared/ui/language-picker/language-picker.shared'
import { LoadingScreen, Page, RemnawaveLogo } from '@shared/ui'

import { SubscriptionLinkWidget } from '../../../../widgets/main/subscription-link/subscription-link.widget'
import {
    SubscriptionInfoCardsWidget,
    SubscriptionInfoCollapsedWidget,
    SubscriptionInfoExpandedWidget
} from '../../../../widgets/main/subscription-info'
import { RawKeysWidget } from '../../../../widgets/main/raw-keys/raw-keys.widget'
import {
    InstallationGuideConnector,
    CardsBlockRenderer,
    TimelineBlockRenderer,
    AccordionBlockRenderer,
    MinimalBlockRenderer
} from '../../../../widgets/main/installation-guide'
import {
    TSubscriptionPageLocales,
    TSubscriptionPagePlatformKey,
    TSubscriptionPageRawConfig
} from '@remnawave/subscription-page-types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface IMainPageComponentProps {
    appConfig: TSubscriptionPageRawConfig
    isMobile: boolean
}

const BLOCK_RENDERERS = {
    cards: CardsBlockRenderer,
    timeline: TimelineBlockRenderer,
    accordion: AccordionBlockRenderer,
    minimal: MinimalBlockRenderer
} as const

const SUBSCRIPTION_INFO_BLOCK_RENDERERS = {
    cards: SubscriptionInfoCardsWidget,
    collapsed: SubscriptionInfoCollapsedWidget,
    expanded: SubscriptionInfoExpandedWidget,
    hidden: null
} as const

export const MainPageComponent = (props: IMainPageComponentProps) => {
    const { appConfig, isMobile } = props

    const { i18n } = useTranslation()

    const [currentLang, setCurrentLang] = useState<TSubscriptionPageLocales>('en')

    const brandName = appConfig.brandingSettings.title
    let hasCustomLogo = !!appConfig.brandingSettings.logoUrl

    if (hasCustomLogo) {
        if (appConfig.brandingSettings.logoUrl.includes('docs.rw')) {
            hasCustomLogo = false
        }
    }

    useEffect(() => {
        const lang = i18n.language

        if (lang.startsWith('en')) {
            setCurrentLang('en')
        } else if (lang.startsWith('fa') && appConfig.additionalLocales.includes('fa')) {
            setCurrentLang('fa')
        } else if (lang.startsWith('ru') && appConfig.additionalLocales.includes('ru')) {
            setCurrentLang('ru')
        } else if (lang.startsWith('zh') && appConfig.additionalLocales.includes('zh')) {
            setCurrentLang('zh')
        } else if (lang.startsWith('fr') && appConfig.additionalLocales.includes('fr')) {
            setCurrentLang('fr')
        } else {
            setCurrentLang('en')
        }
    }, [i18n.language])

    const hasPlatformApps: Record<TSubscriptionPagePlatformKey, boolean> = {
        ios: Boolean(appConfig.platforms.ios && appConfig.platforms.ios.apps.length > 0),
        android: Boolean(
            appConfig.platforms.android && appConfig.platforms.android.apps.length > 0
        ),
        linux: Boolean(appConfig.platforms.linux && appConfig.platforms.linux.apps.length > 0),
        macos: Boolean(appConfig.platforms.macos && appConfig.platforms.macos.apps.length > 0),
        windows: Boolean(
            appConfig.platforms.windows && appConfig.platforms.windows.apps.length > 0
        ),
        androidTV: Boolean(
            appConfig.platforms.androidTV && appConfig.platforms.androidTV.apps.length > 0
        ),
        appleTV: Boolean(appConfig.platforms.appleTV && appConfig.platforms.appleTV.apps.length > 0)
    }

    if (!Object.values(hasPlatformApps).some(Boolean)) {
        return <LoadingScreen height="100vh" />
    }

    const SubscriptionInfoBlockRenderer =
        SUBSCRIPTION_INFO_BLOCK_RENDERERS[appConfig.uiConfig.subscriptionInfo.block]

    return (
        <Page>
            <Box className="header-wrapper" py="md">
                <Container maw={1200} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
                    <Group justify="space-between" wrap="nowrap">
                        <Group gap="sm" wrap="nowrap" style={{ userSelect: 'none' }}>
                            {hasCustomLogo ? (
                                <Image
                                    alt="logo"
                                    fit="contain"
                                    src={appConfig.brandingSettings.logoUrl}
                                    style={{
                                        maxWidth: '32px',
                                        maxHeight: '32px',
                                        width: 'auto',
                                        height: 'auto'
                                    }}
                                />
                            ) : (
                                <RemnawaveLogo c="cyan" size={32} />
                            )}
                            <Title order={4} fw={700} size="lg">
                                <Text component="span" inherit c={hasCustomLogo ? 'white' : 'cyan'}>
                                    {brandName}
                                </Text>
                            </Title>
                        </Group>

                        <Group gap="xs">
                            <SubscriptionLinkWidget
                                supportUrl={appConfig.brandingSettings.supportUrl}
                            />
                        </Group>
                    </Group>
                </Container>
            </Box>

            <Container
                maw={1200}
                px={{ base: 'md', sm: 'lg', md: 'xl' }}
                py="xl"
                style={{ position: 'relative', zIndex: 1 }}
            >
                <Stack gap="xl">
                    {SubscriptionInfoBlockRenderer && (
                        <SubscriptionInfoBlockRenderer isMobile={isMobile} />
                    )}

                    <InstallationGuideConnector
                        config={appConfig}
                        isMobile={isMobile}
                        hasPlatformApps={hasPlatformApps}
                        currentLang={currentLang}
                        BlockRenderer={BLOCK_RENDERERS[appConfig.uiConfig.installationGuides.block]}
                    />

                    <RawKeysWidget
                        config={appConfig}
                        isMobile={isMobile}
                        currentLang={currentLang}
                    />

                    <Center>
                        <LanguagePicker enabledLocales={appConfig.additionalLocales} />
                    </Center>
                </Stack>
            </Container>
        </Page>
    )
}
