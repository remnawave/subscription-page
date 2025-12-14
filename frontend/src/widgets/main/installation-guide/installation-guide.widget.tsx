import { Card, Group, Select, Stack, Title } from '@mantine/core'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOs } from '@mantine/hooks'

import { constructSubscriptionUrl } from '@shared/utils/construct-subscription-url'
import { useSubscriptionInfoStoreInfo } from '@entities/subscription-info-store'
import {
    TSubscriptionPageAppConfig,
    TSubscriptionPageLocales,
    TSubscriptionPagePlatformKey,
    TSubscriptionPageRawConfig
} from '@remnawave/subscription-page-types'
import { TemplateEngine } from '@shared/utils/template-engine'

import { BaseInstallationGuideWidget } from './installation-guide.base.widget'
import { getLocalizedText } from './utils/get-localized-text.util'
import { getIconFromLibrary } from './utils/get-icon-from-library'

interface IProps {
    config: TSubscriptionPageRawConfig
    currentLang: TSubscriptionPageLocales
    isMobile: boolean
    hasPlatformApps: Record<TSubscriptionPagePlatformKey, boolean>
}

export const InstallationGuideWidget = (props: IProps) => {
    const { config, isMobile, currentLang, hasPlatformApps } = props

    const { platforms, uiConfig } = config

    const { t } = useTranslation()
    const { subscription } = useSubscriptionInfoStoreInfo()

    const os = useOs()

    const [defaultTab, setDefaultTab] = useState<TSubscriptionPagePlatformKey>('windows')

    useLayoutEffect(() => {
        const osToplatform: Record<string, TSubscriptionPagePlatformKey> = {
            android: 'android',
            ios: 'ios',
            linux: 'linux',
            macos: 'macos',
            windows: 'windows'
        }

        const preferredPlatform = osToplatform[os] ?? 'windows'

        if (hasPlatformApps[preferredPlatform]) {
            setDefaultTab(preferredPlatform)
            return
        }

        const firstAvailable = (
            Object.keys(hasPlatformApps) as TSubscriptionPagePlatformKey[]
        ).find((key) => hasPlatformApps[key])

        if (firstAvailable) {
            setDefaultTab(firstAvailable)
        }
    }, [os, hasPlatformApps])

    if (!subscription) return null

    const subscriptionUrl = constructSubscriptionUrl(
        window.location.href,
        subscription.user.shortUuid
    )

    const handleSubscriptionLinkClick = (urlTemplate: string) => {
        const formattedUrl = TemplateEngine.formatWithMetaInfo(urlTemplate, {
            username: subscription.user.username,
            subscriptionUrl: subscriptionUrl
        })
        window.open(formattedUrl, '_blank')
    }

    const availablePlatforms = (
        Object.entries(hasPlatformApps) as [TSubscriptionPagePlatformKey, boolean][]
    )
        .filter(([_, hasApps]) => hasApps)
        .map(([platform]) => {
            const platformConfig = platforms[platform]!
            return {
                value: platform,
                label: getLocalizedText(platformConfig.displayName, currentLang),
                icon: getIconFromLibrary(platformConfig.svgIconKey, config.svgLibrary)
            }
        })

    const getAppsForPlatform = (
        platform: TSubscriptionPagePlatformKey
    ): TSubscriptionPageAppConfig[] => {
        const platformConfig = platforms[platform]!
        if (!platformConfig) return []
        return platformConfig.apps
    }

    return (
        <Card p={{ base: 'sm', xs: 'md', sm: 'lg', md: 'xl' }} radius="lg" className="glass-card">
            <Stack gap="md">
                <Group justify="space-between" gap="sm">
                    <Title order={4} c="white" fw={600}>
                        {getLocalizedText(uiConfig.installationGuides.headerText, currentLang)}
                    </Title>

                    {availablePlatforms.length > 1 && (
                        <Select
                            allowDeselect={false}
                            data={availablePlatforms.map((opt) => ({
                                value: opt.value,
                                label: opt.label
                            }))}
                            leftSection={
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: availablePlatforms.find(
                                            (opt) => opt.value === defaultTab
                                        )!.icon
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: 20,
                                        height: 20
                                    }}
                                />
                            }
                            onChange={(value) =>
                                setDefaultTab((value as TSubscriptionPagePlatformKey) || 'windows')
                            }
                            radius="md"
                            size="sm"
                            style={{ width: 150 }}
                            value={defaultTab}
                            withScrollArea={false}
                            styles={{
                                input: {
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    color: 'white'
                                }
                            }}
                        />
                    )}
                </Group>

                {hasPlatformApps[defaultTab] && (
                    <BaseInstallationGuideWidget
                        isMobile={isMobile}
                        currentLang={currentLang}
                        svgLibrary={config.svgLibrary}
                        getAppsForPlatform={getAppsForPlatform}
                        onSubscriptionLinkClick={handleSubscriptionLinkClick}
                        platform={defaultTab}
                    />
                )}
            </Stack>
        </Card>
    )
}
