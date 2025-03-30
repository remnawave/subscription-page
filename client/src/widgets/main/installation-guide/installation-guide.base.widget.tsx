import { IconCheck, IconCloudDownload, IconDownload, IconStar } from '@tabler/icons-react'
import { Box, Button, Group, Text, ThemeIcon, Timeline } from '@mantine/core'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { IAppList } from '@shared/constants/apps/interfaces/app-list.interface'

import { IPlatformGuideProps } from './interfaces/platform-guide.props.interface'

export interface IBaseGuideProps extends IPlatformGuideProps {
    firstStepDescription: string
    firstStepTitle: string
    platform: 'android' | 'ios' | 'pc'
    renderFirstStepButton: (app: IAppList) => React.ReactNode
    secondStepDescription: string
    thirdStepDescription?: string
}

export const BaseInstallationGuideWidget = (props: IBaseGuideProps) => {
    const { t } = useTranslation()
    const {
        openDeepLink,
        getAppsForPlatform,
        platform,
        firstStepTitle,
        firstStepDescription,
        secondStepDescription,
        thirdStepDescription,
        renderFirstStepButton
    } = props

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

    return (
        <Box>
            {platformApps.length > 0 && (
                <Group gap="xs" mb="lg">
                    {platformApps.map((app: IAppList) => {
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
                        {firstStepDescription}
                    </Text>
                    {selectedApp && renderFirstStepButton(selectedApp)}
                </Timeline.Item>

                <Timeline.Item
                    bullet={
                        <ThemeIcon color="teal.5" radius="xl" size={26}>
                            <IconCloudDownload size={16} />
                        </ThemeIcon>
                    }
                    title={t('installation-guide.widget.add-subscription')}
                >
                    <Text c="dimmed" mb={16} size="sm">
                        {secondStepDescription}
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

                <Timeline.Item
                    bullet={
                        <ThemeIcon color="teal.5" radius="xl" size={26}>
                            <IconCheck size={16} />
                        </ThemeIcon>
                    }
                    title={t('installation-guide.widget.connect-and-use')}
                >
                    <Text c="dimmed" size="sm">
                        {thirdStepDescription ||
                            t('installation-guide.widget.connect-and-use-description')}
                    </Text>
                </Timeline.Item>
            </Timeline>
        </Box>
    )
}
