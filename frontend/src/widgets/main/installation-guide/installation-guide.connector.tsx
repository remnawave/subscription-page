import { IconStar } from '@tabler/icons-react'
import { Box, Button, ButtonVariant, Card, Group, Select, Stack, Title } from '@mantine/core'
import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useOs } from '@mantine/hooks'

import { constructSubscriptionUrl } from '@shared/utils/construct-subscription-url'
import { useSubscription } from '@entities/subscription-info-store'
import { useAppConfig } from '@entities/app-config-store'
import {
    TSubscriptionPageAppConfig,
    TSubscriptionPageBlockConfig,
    TSubscriptionPageButtonConfig,
    TSubscriptionPageLanguageCode,
    TSubscriptionPagePlatformKey
} from '@remnawave/subscription-page-types'
import { TemplateEngine } from '@shared/utils/template-engine'
import { useTranslation } from '@shared/hooks'

import { getIconFromLibrary } from './utils/get-icon-from-library'

import classes from './installation-guide.module.css'
import { vibrate } from '@shared/utils/vibrate'

export type TBlockVariant = 'cards' | 'timeline' | 'accordion' | 'minimal'

export interface IBlockRendererProps {
    blocks: TSubscriptionPageBlockConfig[]
    isMobile: boolean
    currentLang: TSubscriptionPageLanguageCode
    svgLibrary: Record<string, string>
    renderBlockButtons: (
        buttons: TSubscriptionPageButtonConfig[],
        variant: ButtonVariant
    ) => React.ReactNode
    getIconFromLibrary: (iconKey: string) => string
}

interface IProps {
    isMobile: boolean
    hasPlatformApps: Record<TSubscriptionPagePlatformKey, boolean>
    BlockRenderer: React.ComponentType<IBlockRendererProps>
}

export const InstallationGuideConnector = (props: IProps) => {
    const { isMobile, hasPlatformApps, BlockRenderer } = props

    const { t, currentLang, baseTranslations } = useTranslation()
    const { platforms, svgLibrary } = useAppConfig()
    const subscription = useSubscription()

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
                        label: t(platformConfig.displayName),
                        icon: getIconFromLibrary(platformConfig.svgIconKey, svgLibrary)
                    }
                }),
        [hasPlatformApps, platforms, currentLang, svgLibrary, t]
    )

    const subscriptionUrl = constructSubscriptionUrl(
        window.location.href,
        subscription.user.shortUuid
    )

    const handleButtonClick = (button: TSubscriptionPageButtonConfig) => {
        if (button.type === 'subscriptionLink') {
            const formattedUrl = TemplateEngine.formatWithMetaInfo(button.link, {
                username: subscription.user.username,
                subscriptionUrl: subscriptionUrl
            })
            window.open(formattedUrl, '_blank')
        } else if (button.type === 'external') {
            window.open(button.link, '_blank')
        }
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
                                    __html: getIconFromLibrary(button.svgIconKey, svgLibrary)
                                }}
                                style={{ display: 'flex', alignItems: 'center' }}
                            />
                        }
                        variant={variant}
                        radius="md"
                    >
                        {t(button.text)}
                    </Button>
                ))}
            </Group>
        )
    }

    const getIcon = (iconKey: string) => getIconFromLibrary(iconKey, svgLibrary)

    return (
        <Card p={{ base: 'sm', xs: 'md', sm: 'lg', md: 'xl' }} radius="lg" className="glass-card">
            <Stack gap="md">
                <Group justify="space-between" gap="sm">
                    <Title order={4} c="white" fw={600}>
                        {t(baseTranslations.installationGuideHeader)}
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
                                svgLibrary={svgLibrary}
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
