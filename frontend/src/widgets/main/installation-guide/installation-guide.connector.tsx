import { IconStar } from '@tabler/icons-react'
import { Box, Button, ButtonVariant, Card, Group, Select, Stack, Title } from '@mantine/core'
import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useOs } from '@mantine/hooks'

import { constructSubscriptionUrl } from '@shared/utils/construct-subscription-url'
import { useSubscriptionInfoStoreInfo } from '@entities/subscription-info-store'
import {
    TSubscriptionPageAppConfig,
    TSubscriptionPageBlockConfig,
    TSubscriptionPageButtonConfig,
    TSubscriptionPageLocales,
    TSubscriptionPagePlatformKey,
    TSubscriptionPageRawConfig
} from '@remnawave/subscription-page-types'
import { TemplateEngine } from '@shared/utils/template-engine'

import { getLocalizedText } from './utils/get-localized-text.util'
import { getIconFromLibrary } from './utils/get-icon-from-library'

import classes from './installation-guide.module.css'
import { vibrate } from '@shared/utils/vibrate'

export type TBlockVariant = 'cards' | 'timeline' | 'accordion' | 'minimal'

export interface IBlockRendererProps {
    blocks: TSubscriptionPageBlockConfig[]
    isMobile: boolean
    currentLang: TSubscriptionPageLocales
    svgLibrary: Record<string, string>
    getLocalizedText: (
        textObj: { en: string; ru?: string; zh?: string; fa?: string; fr?: string } | undefined
    ) => string
    renderBlockButtons: (
        buttons: TSubscriptionPageButtonConfig[],
        variant: ButtonVariant
    ) => React.ReactNode
    getIconFromLibrary: (iconKey: string) => string
}

interface IProps {
    config: TSubscriptionPageRawConfig
    currentLang: TSubscriptionPageLocales
    isMobile: boolean
    hasPlatformApps: Record<TSubscriptionPagePlatformKey, boolean>
    BlockRenderer: React.ComponentType<IBlockRendererProps>
}

export const InstallationGuideConnector = (props: IProps) => {
    const { config, isMobile, currentLang, hasPlatformApps, BlockRenderer } = props

    const { platforms, uiConfig } = config

    const { subscription } = useSubscriptionInfoStoreInfo()

    const os = useOs()

    const [selectedPlatform, setSelectedPlatform] =
        useState<TSubscriptionPagePlatformKey>('windows')
    const [selectedAppName, setSelectedAppName] = useState<string>('')

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
            setSelectedPlatform(preferredPlatform)
            return
        }

        const firstAvailable = (
            Object.keys(hasPlatformApps) as TSubscriptionPagePlatformKey[]
        ).find((key) => hasPlatformApps[key])

        if (firstAvailable) {
            setSelectedPlatform(firstAvailable)
        }
    }, [os, hasPlatformApps])

    const platformApps = useMemo((): TSubscriptionPageAppConfig[] => {
        const platformConfig = platforms[selectedPlatform]
        if (!platformConfig) return []
        return platformConfig.apps
    }, [platforms, selectedPlatform])

    useEffect(() => {
        if (platformApps.length > 0) {
            setSelectedAppName(platformApps[0].name)
        }
    }, [selectedPlatform, platformApps])

    const selectedApp = useMemo(() => {
        if (!selectedAppName) return platformApps[0] ?? null
        return platformApps.find((app) => app.name === selectedAppName) ?? platformApps[0] ?? null
    }, [selectedAppName, platformApps])

    const availablePlatforms = useMemo(
        () =>
            (Object.entries(hasPlatformApps) as [TSubscriptionPagePlatformKey, boolean][])
                .filter(([_, hasApps]) => hasApps)
                .map(([platform]) => {
                    const platformConfig = platforms[platform]!
                    return {
                        value: platform,
                        label: getLocalizedText(platformConfig.displayName, currentLang),
                        icon: getIconFromLibrary(platformConfig.svgIconKey, config.svgLibrary)
                    }
                }),
        [hasPlatformApps, platforms, currentLang, config.svgLibrary]
    )

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

    const handleButtonClick = (button: TSubscriptionPageButtonConfig) => {
        if (button.type === 'subscriptionLink') {
            handleSubscriptionLinkClick(button.link)
        } else {
            window.open(button.link, '_blank')
        }
    }

    const getLocalizedTextForBlock = (
        textObj: { en: string; ru?: string; zh?: string; fa?: string; fr?: string } | undefined
    ): string => {
        if (!textObj) return ''
        return textObj[currentLang as keyof typeof textObj] || textObj.en || ''
    }

    const renderBlockButtons = (
        buttons: TSubscriptionPageButtonConfig[],
        variant: ButtonVariant
    ) => {
        if (buttons.length === 0) return null

        return (
            <Group gap="xs" wrap="wrap">
                {buttons.map((button, index) => (
                    <Button
                        key={index}
                        onClick={() => handleButtonClick(button)}
                        leftSection={
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: getIconFromLibrary(button.svgIconKey, config.svgLibrary)
                                }}
                                style={{ display: 'flex', alignItems: 'center' }}
                            />
                        }
                        variant={variant}
                        radius="md"
                    >
                        {getLocalizedTextForBlock(button.text)}
                    </Button>
                ))}
            </Group>
        )
    }

    const getIcon = (iconKey: string) => getIconFromLibrary(iconKey, config.svgLibrary)

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
                                        __html:
                                            availablePlatforms.find(
                                                (opt) => opt.value === selectedPlatform
                                            )?.icon ?? ''
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: 20,
                                        height: 20
                                    }}
                                />
                            }
                            onChange={(value) => {
                                vibrate('selection')
                                setSelectedPlatform(
                                    (value as TSubscriptionPagePlatformKey) || 'windows'
                                )
                            }}
                            radius="md"
                            size="sm"
                            style={{ width: 150 }}
                            value={selectedPlatform}
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

                {platformApps.length > 0 && (
                    <Box>
                        <Group gap="xs" mb="md">
                            {platformApps.map((app: TSubscriptionPageAppConfig) => {
                                const isActive = app.name === selectedAppName
                                return (
                                    <Button
                                        color={isActive ? 'cyan' : 'gray'}
                                        key={app.name}
                                        leftSection={
                                            app.featured ? (
                                                <IconStar color="gold" size={16} />
                                            ) : undefined
                                        }
                                        onClick={() => {
                                            vibrate('toggle')
                                            setSelectedAppName(app.name)
                                        }}
                                        radius="md"
                                        size="sm"
                                        className={
                                            isActive ? classes.appButtonActive : classes.appButton
                                        }
                                        variant={isActive ? 'outline' : 'subtle'}
                                    >
                                        {app.name}
                                    </Button>
                                )
                            })}
                        </Group>

                        {selectedApp && (
                            <BlockRenderer
                                blocks={selectedApp.blocks}
                                isMobile={isMobile}
                                currentLang={currentLang}
                                svgLibrary={config.svgLibrary}
                                getLocalizedText={getLocalizedTextForBlock}
                                renderBlockButtons={renderBlockButtons}
                                getIconFromLibrary={getIcon}
                            />
                        )}
                    </Box>
                )}
            </Stack>
        </Card>
    )
}
