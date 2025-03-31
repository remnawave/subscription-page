import {
    IconCheck,
    IconCloudDownload,
    IconDownload,
    IconInfoCircle,
    IconStar
} from '@tabler/icons-react'
import { Box, Button, Group, Text, ThemeIcon, Timeline } from '@mantine/core'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { IAppConfig } from '@shared/constants/apps-config/interfaces/app-list.interface'

import { IPlatformGuideProps } from './interfaces/platform-guide.props.interface'

export interface IBaseGuideProps extends IPlatformGuideProps {
    firstStepTitle: string
    platform: 'android' | 'ios' | 'pc'
    renderFirstStepButton: (app: IAppConfig) => React.ReactNode
}

export const BaseInstallationGuideWidget = (props: IBaseGuideProps) => {
    const { t, i18n } = useTranslation()
    const { openDeepLink, getAppsForPlatform, platform, firstStepTitle, renderFirstStepButton } =
        props

    const platformApps = getAppsForPlatform(platform)
    const [activeTabId, setActiveTabId] = useState<string>('')
    const isInitializedRef = useRef<{ [key: string]: boolean }>({})

    useEffect(() => {
        if (platformApps.length > 0 && !isInitializedRef.current[platform]) {
            setActiveTabId(platformApps[0].id)
            isInitializedRef.current[platform] = true
        }
    }, [platform, platformApps])

    const handleTabChange = (appId: string) => {
        setActiveTabId(appId)
    }

    const selectedApp =
        (activeTabId && platformApps.find((app) => app.id === activeTabId)) ||
        (platformApps.length > 0 ? platformApps[0] : null)

    const formattedTitle = selectedApp
        ? firstStepTitle.replace(/{appName}/g, selectedApp.name)
        : firstStepTitle

    const getAppDescription = (
        app: IAppConfig | null,
        step: 'addSubscriptionStep' | 'connectAndUseStep' | 'installationStep'
    ) => {
        if (!app) return ''

        const currentLang = i18n.language as 'en' | 'fa' | 'ru'
        const fallbackLang = 'en'

        const stepData = app[step]
        if (!stepData) return ''

        return stepData.description[currentLang] || stepData.description[fallbackLang] || ''
    }

    const getButtonText = (button: { buttonText: { en: string; fa: string; ru: string } }) => {
        const currentLang = i18n.language as 'en' | 'fa' | 'ru'
        const fallbackLang = 'en'

        return button.buttonText[currentLang] || button.buttonText[fallbackLang] || ''
    }

    const getStepTitle = (
        stepData: { title?: { en: string; fa: string; ru: string } },
        defaultTitle: string
    ) => {
        if (!stepData || !stepData.title) return defaultTitle

        const currentLang = i18n.language as 'en' | 'fa' | 'ru'
        const fallbackLang = 'en'

        return stepData.title[currentLang] || stepData.title[fallbackLang] || defaultTitle
    }

    return (
        <Box>
            {platformApps.length > 0 && (
                <Group gap="xs" mb="lg">
                    {platformApps.map((app: IAppConfig) => {
                        const isActive = app.id === activeTabId
                        return (
                            <Button
                                color={isActive ? 'cyan' : 'gray'}
                                key={app.id}
                                leftSection={
                                    app.isFeatured ? <IconStar color="gold" size={16} /> : undefined
                                }
                                onClick={() => handleTabChange(app.id)}
                                styles={{
                                    root: {
                                        padding: '8px 12px',
                                        height: 'auto',
                                        lineHeight: '1.5',
                                        minWidth: 0,
                                        flex: '1 0 auto'
                                    }
                                }}
                                variant={isActive ? 'outline' : 'light'}
                            >
                                {app.name}
                            </Button>
                        )
                    })}
                </Group>
            )}

            <Timeline active={1} bulletSize={32} color="teal" lineWidth={2}>
                <Timeline.Item
                    bullet={
                        <ThemeIcon color="teal.5" radius="xl" size={26}>
                            <IconDownload size={16} />
                        </ThemeIcon>
                    }
                    title={formattedTitle}
                >
                    <Text c="dimmed" mb={16} size="sm">
                        {selectedApp ? getAppDescription(selectedApp, 'installationStep') : ''}
                    </Text>
                    {selectedApp && renderFirstStepButton(selectedApp)}
                </Timeline.Item>

                {selectedApp && selectedApp.additionalBeforeAddSubscriptionStep && (
                    <Timeline.Item
                        bullet={
                            <ThemeIcon color="teal.5" radius="xl" size={26}>
                                <IconInfoCircle size={20} />
                            </ThemeIcon>
                        }
                        title={getStepTitle(
                            selectedApp.additionalBeforeAddSubscriptionStep,
                            'Additional step title is not set'
                        )}
                    >
                        <Text c="dimmed" mb={16} size="sm">
                            {selectedApp.additionalBeforeAddSubscriptionStep.description[
                                i18n.language as 'en' | 'fa' | 'ru'
                            ] || selectedApp.additionalBeforeAddSubscriptionStep.description.en}
                        </Text>
                        <Group>
                            {selectedApp.additionalBeforeAddSubscriptionStep.buttons.map(
                                (button, index) => (
                                    <Button
                                        component="a"
                                        href={button.buttonLink}
                                        key={index}
                                        target="_blank"
                                        variant="light"
                                    >
                                        {getButtonText(button)}
                                    </Button>
                                )
                            )}
                        </Group>
                    </Timeline.Item>
                )}

                <Timeline.Item
                    bullet={
                        <ThemeIcon color="teal.5" radius="xl" size={26}>
                            <IconCloudDownload size={16} />
                        </ThemeIcon>
                    }
                    title={t('installation-guide.widget.add-subscription')}
                >
                    <Text c="dimmed" mb={16} size="sm">
                        {selectedApp
                            ? getAppDescription(selectedApp, 'addSubscriptionStep')
                            : 'Add subscription description is not set'}
                    </Text>
                    {selectedApp && (
                        <Button
                            onClick={() =>
                                openDeepLink(
                                    selectedApp.urlScheme,
                                    selectedApp.isNeedBase64Encoding
                                )
                            }
                            variant="filled"
                        >
                            {t('installation-guide.widget.add-subscription-button')}
                        </Button>
                    )}
                </Timeline.Item>

                {selectedApp && selectedApp.additionalAfterAddSubscriptionStep && (
                    <Timeline.Item
                        bullet={
                            <ThemeIcon color="teal.5" radius="xl" size={26}>
                                <IconStar size={16} />
                            </ThemeIcon>
                        }
                        title={getStepTitle(
                            selectedApp.additionalAfterAddSubscriptionStep,
                            'Additional step title is not set'
                        )}
                    >
                        <Text c="dimmed" mb={16} size="sm">
                            {selectedApp.additionalAfterAddSubscriptionStep.description[
                                i18n.language as 'en' | 'fa' | 'ru'
                            ] || selectedApp.additionalAfterAddSubscriptionStep.description.en}
                        </Text>
                        <Group>
                            {selectedApp.additionalAfterAddSubscriptionStep.buttons.map(
                                (button, index) => (
                                    <Button
                                        component="a"
                                        href={button.buttonLink}
                                        key={index}
                                        target="_blank"
                                        variant="light"
                                    >
                                        {getButtonText(button)}
                                    </Button>
                                )
                            )}
                        </Group>
                    </Timeline.Item>
                )}

                <Timeline.Item
                    bullet={
                        <ThemeIcon color="teal.5" radius="xl" size={26}>
                            <IconCheck size={16} />
                        </ThemeIcon>
                    }
                    title={t('installation-guide.widget.connect-and-use')}
                >
                    <Text c="dimmed" size="sm">
                        {selectedApp
                            ? getAppDescription(selectedApp, 'connectAndUseStep')
                            : 'Connect and use description is not set'}
                    </Text>
                </Timeline.Item>
            </Timeline>
        </Box>
    )
}
