import {
    TSubscriptionPageAppConfig,
    TSubscriptionPageButtonConfig,
    TSubscriptionPagePlatformKey
} from '@remnawave/subscription-page-types'
import {
    Box,
    Button,
    ButtonVariant,
    Card,
    Group,
    NativeSelect,
    Stack,
    Title,
    UnstyledButton
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useClipboard } from '@mantine/hooks'
import { useState } from 'react'
import { joinURL } from 'ufo'
import clsx from 'clsx'

import { constructSubscriptionUrl } from '@shared/utils/construct-subscription-url'
import { useSubscription } from '@entities/subscription-info-store'
import { getIconFromLibrary } from '@shared/utils/config-parser'
import { TemplateEngine } from '@shared/utils/template-engine'
import { useAppConfig } from '@entities/app-config-store'
import { vibrate } from '@shared/utils/vibrate'
import { useTranslation } from '@shared/hooks'

import { IBlockRendererProps } from './components/blocks/renderer-block.interface'
import classes from './installation-guide.module.css'

export type TBlockVariant = 'accordion' | 'cards' | 'minimal' | 'timeline'

const HAPP_CRYPT5_BUTTON_TYPES = new Set(['HAPP_CRYPT5_LINK', 'happCrypt5Link'])
const HAPP_CRYPT5_TEMPLATE = '{{HAPP_CRYPT5_LINK}}'

interface IProps {
    BlockRenderer: React.ComponentType<IBlockRendererProps>
    hasPlatformApps: Record<TSubscriptionPagePlatformKey, boolean>
    isMobile: boolean
    platform: TSubscriptionPagePlatformKey | undefined
}

function getButtonType(button: TSubscriptionPageButtonConfig): string {
    return String(button.type)
}

function getButtonLinkTemplate(button: TSubscriptionPageButtonConfig): string | undefined {
    if ('link' in button && typeof button.link === 'string') {
        return button.link
    }

    return undefined
}

async function createHappCrypt5Link(apiUrl: string, url: string): Promise<string> {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
    })

    if (!response.ok) {
        throw new Error(`Happ crypt5 proxy responded with ${response.status}`)
    }

    const data: unknown = await response.json()

    if (data && typeof data === 'object') {
        const payload = data as Record<string, unknown>
        const link = payload.link

        if (typeof link === 'string' && link.startsWith('happ://crypt5/')) {
            return link
        }
    }

    throw new Error('Happ crypt5 proxy returned an invalid link')
}

export const InstallationGuideConnector = (props: IProps) => {
    const { isMobile, hasPlatformApps, BlockRenderer, platform } = props

    const { t, currentLang, baseTranslations } = useTranslation()

    const { platforms, svgLibrary } = useAppConfig()
    const { copy } = useClipboard({ timeout: 2_000 })
    const subscription = useSubscription()

    const [selectedAppIndex, setSelectedAppIndex] = useState(0)
    const [selectedPlatform, setSelectedPlatform] = useState<TSubscriptionPagePlatformKey>(() => {
        if (platform && hasPlatformApps[platform]) {
            return platform
        }

        const firstAvailable = (
            Object.keys(hasPlatformApps) as TSubscriptionPagePlatformKey[]
        ).find((key) => hasPlatformApps[key])
        return firstAvailable!
    })

    const platformApps = platforms[selectedPlatform]!.apps
    const selectedApp = platformApps[selectedAppIndex] ?? platformApps[0]

    const availablePlatforms = (
        Object.entries(hasPlatformApps) as [TSubscriptionPagePlatformKey, boolean][]
    )
        .filter(([_, hasApps]) => hasApps)
        .map(([platform]) => {
            const platformConfig = platforms[platform]!
            return {
                value: platform,
                label: t(platformConfig.displayName),
                icon: getIconFromLibrary(platformConfig.svgIconKey, svgLibrary)
            }
        })

    const subscriptionUrl = constructSubscriptionUrl(
        window.location.href,
        subscription.user.shortUuid
    )
    const happCrypt5ApiUrl = joinURL(subscriptionUrl, 'happ-crypt5')

    const formatButtonUrl = (button: TSubscriptionPageButtonConfig, linkTemplate?: string) => {
        const template = linkTemplate ?? getButtonLinkTemplate(button) ?? subscriptionUrl

        return TemplateEngine.formatWithMetaInfo(template, {
            username: subscription.user.username,
            subscriptionUrl
        })
    }

    const formatButtonUrlAsync = async (button: TSubscriptionPageButtonConfig) => {
        const linkTemplate = getButtonLinkTemplate(button) ?? subscriptionUrl

        if (!linkTemplate.includes(HAPP_CRYPT5_TEMPLATE)) {
            return formatButtonUrl(button, linkTemplate)
        }

        const happCrypt5Link = await createHappCrypt5Link(happCrypt5ApiUrl, subscriptionUrl)
        return formatButtonUrl(button, linkTemplate.replaceAll(HAPP_CRYPT5_TEMPLATE, happCrypt5Link))
    }

    const handleButtonClick = async (button: TSubscriptionPageButtonConfig) => {
        const buttonType = getButtonType(button)
        let formattedUrl: string | undefined

        try {
            if (
                buttonType === 'subscriptionLink' ||
                buttonType === 'copyButton' ||
                HAPP_CRYPT5_BUTTON_TYPES.has(buttonType)
            ) {
                formattedUrl = await formatButtonUrlAsync(button)
            }
        } catch (error) {
            notifications.show({
                title: 'Happ crypt5 link error',
                message:
                    error instanceof Error ? error.message : 'Failed to create Happ crypt5 link',
                color: 'red'
            })
            return
        }

        switch (buttonType) {
            case 'copyButton': {
                if (!formattedUrl) return

                copy(formattedUrl)
                notifications.show({
                    title: t(baseTranslations.linkCopied),
                    message: t(baseTranslations.linkCopiedToClipboard),
                    color: 'cyan'
                })
                break
            }
            case 'external': {
                window.open(getButtonLinkTemplate(button), '_blank')
                break
            }
            case 'subscriptionLink': {
                if (!formattedUrl) return

                window.open(formattedUrl, '_blank')
                break
            }
            default: {
                if (!HAPP_CRYPT5_BUTTON_TYPES.has(buttonType) || !formattedUrl) break

                try {
                    const happCrypt5Link = await createHappCrypt5Link(happCrypt5ApiUrl, formattedUrl)
                    window.open(happCrypt5Link, '_blank')
                } catch (error) {
                    notifications.show({
                        title: 'Happ crypt5 link error',
                        message:
                            error instanceof Error
                                ? error.message
                                : 'Failed to create Happ crypt5 link',
                        color: 'red'
                    })
                }

                break
            }
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
                        leftSection={
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: getIconFromLibrary(button.svgIconKey, svgLibrary)
                                }}
                                style={{ display: 'flex', alignItems: 'center' }}
                            />
                        }
                        onClick={() => handleButtonClick(button)}
                        radius="md"
                        variant={variant}
                    >
                        {t(button.text)}
                    </Button>
                ))}
            </Group>
        )
    }

    const getIcon = (iconKey: string) => getIconFromLibrary(iconKey, svgLibrary)

    return (
        <Card p={{ base: 'sm', xs: 'md', sm: 'lg', md: 'xl' }} radius="lg">
            <Stack gap="md">
                <Group gap="sm" justify="space-between">
                    <Title c="white" fw={600} order={4}>
                        {t(baseTranslations.installationGuideHeader)}
                    </Title>

                    {availablePlatforms.length > 1 && (
                        <NativeSelect
                            data={availablePlatforms.map((opt) => ({
                                value: opt.value,
                                label: opt.label
                            }))}
                            leftSection={
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: availablePlatforms.find(
                                            (opt) => opt.value === selectedPlatform
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
                            onChange={(event) => {
                                vibrate([80])
                                const value = event.target
                                    .value as unknown as TSubscriptionPagePlatformKey
                                setSelectedPlatform(value)
                                setSelectedAppIndex(0)
                            }}
                            radius="md"
                            size="sm"
                            value={selectedPlatform}
                            w={150}
                        />
                    )}
                </Group>

                {platformApps.length > 0 && (
                    <Box>
                        <div className={classes.appsGrid}>
                            {platformApps.map((app: TSubscriptionPageAppConfig, index: number) => {
                                const isActive = index === selectedAppIndex
                                const hasIcon = Boolean(app.svgIconKey)

                                return (
                                    <UnstyledButton
                                        className={clsx(
                                            classes.appButton,
                                            isActive && classes.appButtonActive,
                                            app.featured && classes.appButtonFeatured
                                        )}
                                        key={app.name}
                                        onClick={() => {
                                            vibrate('toggle')
                                            setSelectedAppIndex(index)
                                        }}
                                    >
                                        {app.featured && <span className={classes.featuredBadge} />}
                                        {hasIcon && (
                                            <span
                                                className={clsx(
                                                    classes.bgIcon,
                                                    isActive && classes.bgIconActive
                                                )}
                                                dangerouslySetInnerHTML={{
                                                    __html: getIconFromLibrary(
                                                        app.svgIconKey!,
                                                        svgLibrary
                                                    )
                                                }}
                                            />
                                        )}
                                        <span className={classes.appName}>{app.name}</span>
                                    </UnstyledButton>
                                )
                            })}
                        </div>

                        {selectedApp && (
                            <BlockRenderer
                                blocks={selectedApp.blocks}
                                currentLang={currentLang}
                                getIconFromLibrary={getIcon}
                                isMobile={isMobile}
                                renderBlockButtons={renderBlockButtons}
                                svgLibrary={svgLibrary}
                            />
                        )}
                    </Box>
                )}
            </Stack>
        </Card>
    )
}
