import { IconStar } from '@tabler/icons-react'
import { Box, Button, Card, Group, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { useEffect, useMemo, useState } from 'react'

import {
    TSubscriptionPageAppConfig,
    TSubscriptionPageButtonConfig,
    TSubscriptionPageLocales,
    TSubscriptionPagePlatformKey
} from '@remnawave/subscription-page-types'
import { BlockCardWidget } from './block-card.widget'

interface IBaseGuideProps {
    isMobile: boolean
    platform: TSubscriptionPagePlatformKey
    currentLang: TSubscriptionPageLocales
    getAppsForPlatform: (platform: TSubscriptionPagePlatformKey) => TSubscriptionPageAppConfig[]
    onSubscriptionLinkClick: (link: string) => void
}

export const BaseInstallationGuideWidget = (props: IBaseGuideProps) => {
    const { isMobile, onSubscriptionLinkClick, getAppsForPlatform, platform, currentLang } = props

    const platformApps = getAppsForPlatform(platform)
    const [activeTabId, setActiveTabId] = useState<string>('')

    useEffect(() => {
        if (platformApps.length > 0) {
            setActiveTabId(platformApps[0].name)
        }
    }, [platform, platformApps])

    const handleTabChange = (appName: string) => {
        setActiveTabId(appName)
    }

    const selectedApp = useMemo(() => {
        if (!activeTabId) return platformApps[0] ?? null
        return platformApps.find((app) => app.name === activeTabId) ?? platformApps[0] ?? null
    }, [activeTabId, platformApps])

    const getLocalizedText = (
        textObj: { en: string; ru?: string; zh?: string; fa?: string; fr?: string } | undefined
    ): string => {
        if (!textObj) return ''
        return textObj[currentLang as keyof typeof textObj] || textObj.en || ''
    }

    const handleButtonClick = (button: TSubscriptionPageButtonConfig) => {
        if (button.type === 'subscriptionLink') {
            onSubscriptionLinkClick(button.link)
        } else {
            window.open(button.link, '_blank')
        }
    }

    const renderBlockButtons = (buttons: TSubscriptionPageButtonConfig[]) => {
        if (buttons.length === 0) return null

        return (
            <Group gap="xs" wrap="wrap">
                {buttons.map((button, index) => (
                    <Button
                        key={index}
                        onClick={() => handleButtonClick(button)}
                        leftSection={
                            <span
                                dangerouslySetInnerHTML={{ __html: button.svgIcon }}
                                style={{ display: 'flex', alignItems: 'center' }}
                            />
                        }
                        variant="light"
                        radius="md"
                        size="sm"
                    >
                        {getLocalizedText(button.text)}
                    </Button>
                ))}
            </Group>
        )
    }

    return (
        <Box>
            {platformApps.length > 0 && (
                <Group gap="xs" mb="lg">
                    {platformApps.map((app: TSubscriptionPageAppConfig) => {
                        const isActive = app.name === activeTabId
                        return (
                            <Button
                                color={isActive ? 'cyan' : 'gray'}
                                key={app.name}
                                leftSection={
                                    app.featured ? <IconStar color="gold" size={16} /> : undefined
                                }
                                onClick={() => handleTabChange(app.name)}
                                radius="md"
                                styles={{
                                    root: {
                                        padding: '10px 16px',
                                        height: 'auto',
                                        lineHeight: '1.5',
                                        minWidth: 0,
                                        flex: '1 0 auto',
                                        background: isActive
                                            ? 'linear-gradient(135deg, rgba(34, 211, 238, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)'
                                            : 'rgba(255, 255, 255, 0.02)',
                                        border: isActive
                                            ? '1px solid rgba(34, 211, 238, 0.4)'
                                            : '1px solid rgba(255, 255, 255, 0.08)',
                                        transition: 'all 0.2s ease'
                                    }
                                }}
                                variant={isActive ? 'outline' : 'subtle'}
                            >
                                {app.name}
                            </Button>
                        )
                    })}
                </Group>
            )}

            <Stack gap="sm">
                {selectedApp &&
                    selectedApp.blocks.map((block, index) => (
                        <BlockCardWidget
                            key={index}
                            isMobile={isMobile}
                            icon={
                                <span
                                    dangerouslySetInnerHTML={{ __html: block.svgIcon }}
                                    style={{ display: 'flex', alignItems: 'center' }}
                                />
                            }
                            title={getLocalizedText(block.title)}
                            description={getLocalizedText(block.description)}
                            color={block.svgIconColor}
                        >
                            {renderBlockButtons(block.buttons)}
                        </BlockCardWidget>
                    ))}
            </Stack>
        </Box>
    )
}
