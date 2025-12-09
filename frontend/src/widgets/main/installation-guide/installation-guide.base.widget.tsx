import {
    IconCheck,
    IconCloudDownload,
    IconDownload,
    IconExternalLink,
    IconInfoCircle,
    IconStar
} from '@tabler/icons-react'
import { Box, Button, Card, Group, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

import {
    IAppConfig,
    ILocalizedText,
    TEnabledLocales,
    TPlatform
} from '@shared/constants/apps-config/interfaces/app-list.interface'

import { IPlatformGuideProps } from './interfaces/platform-guide.props.interface'

export interface IBaseGuideProps extends IPlatformGuideProps {
    isMobile: boolean
    firstStepTitle: string
    platform: TPlatform
    renderFirstStepButton: (app: IAppConfig) => React.ReactNode
    currentLang: TEnabledLocales
}

interface StepCardProps {
    isMobile: boolean
    icon: React.ReactNode
    title: string
    description: string
    children?: React.ReactNode
    color?: string
}

const StepCard = ({
    isMobile,
    icon,
    title,
    description,
    children,
    color = 'cyan'
}: StepCardProps) => {
    return (
        <Card p={{ base: 'sm', xs: 'md', sm: 'lg' }} radius="lg" className="step-card">
            <Group gap={isMobile ? 'sm' : 'md'} wrap="nowrap" align="flex-start">
                <ThemeIcon
                    color={color}
                    size={isMobile ? 36 : 44}
                    radius="xl"
                    variant="light"
                    style={{
                        background: `linear-gradient(135deg, rgba(34, 211, 238, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)`,
                        border: '1px solid rgba(34, 211, 238, 0.3)',
                        flexShrink: 0
                    }}
                >
                    {icon}
                </ThemeIcon>
                <Stack gap={isMobile ? 'xs' : 'sm'} style={{ flex: 1, minWidth: 0 }}>
                    <Title order={6} c="white" fw={600} style={{ wordBreak: 'break-word' }}>
                        {title}
                    </Title>
                    {description && (
                        <Text
                            size={isMobile ? 'xs' : 'sm'}
                            style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}
                        >
                            {description}
                        </Text>
                    )}
                    {children}
                </Stack>
            </Group>
        </Card>
    )
}

export const BaseInstallationGuideWidget = (props: IBaseGuideProps) => {
    const { t } = useTranslation()
    const {
        isMobile,
        openDeepLink,
        getAppsForPlatform,
        platform,
        firstStepTitle,
        renderFirstStepButton,
        currentLang
    } = props

    const platformApps = getAppsForPlatform(platform)
    const [activeTabId, setActiveTabId] = useState<string>('')

    useEffect(() => {
        if (platformApps.length > 0) {
            setActiveTabId(platformApps[0].id)
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

        const stepData = app[step]
        if (!stepData) return ''

        return stepData.description[currentLang] || ''
    }

    const getButtonText = (button: { buttonText: ILocalizedText }) => {
        return button.buttonText[currentLang] || ''
    }

    const getStepTitle = (stepData: { title?: ILocalizedText }, defaultTitle: string) => {
        if (!stepData || !stepData.title) return defaultTitle

        return stepData.title[currentLang] || defaultTitle
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
                <StepCard
                    isMobile={isMobile}
                    icon={<IconDownload size={20} />}
                    title={formattedTitle}
                    description={
                        selectedApp ? getAppDescription(selectedApp, 'installationStep') : ''
                    }
                >
                    {selectedApp && renderFirstStepButton(selectedApp)}
                </StepCard>

                {selectedApp && selectedApp.additionalBeforeAddSubscriptionStep && (
                    <StepCard
                        isMobile={isMobile}
                        icon={<IconInfoCircle size={20} />}
                        title={getStepTitle(
                            selectedApp.additionalBeforeAddSubscriptionStep,
                            'Additional step title is not set'
                        )}
                        description={
                            selectedApp.additionalBeforeAddSubscriptionStep.description[
                                currentLang
                            ] || selectedApp.additionalBeforeAddSubscriptionStep.description.en
                        }
                        color="violet"
                    >
                        <Group gap="xs" wrap="wrap">
                            {selectedApp.additionalBeforeAddSubscriptionStep.buttons.map(
                                (button, index) => (
                                    <Button
                                        component="a"
                                        href={button.buttonLink}
                                        key={index}
                                        target="_blank"
                                        variant="light"
                                        radius="md"
                                        size="sm"
                                    >
                                        {getButtonText(button)}
                                    </Button>
                                )
                            )}
                        </Group>
                    </StepCard>
                )}

                <StepCard
                    isMobile={isMobile}
                    icon={<IconCloudDownload size={20} />}
                    title={t('installation-guide.widget.add-subscription')}
                    description={
                        selectedApp
                            ? getAppDescription(selectedApp, 'addSubscriptionStep')
                            : 'Add subscription description is not set'
                    }
                >
                    {selectedApp && (
                        <Button
                            onClick={() =>
                                openDeepLink(
                                    selectedApp.urlScheme,
                                    selectedApp.isNeedBase64Encoding
                                )
                            }
                            variant="light"
                            radius="md"
                            leftSection={<IconExternalLink size={16} />}
                            size="sm"
                        >
                            {t('installation-guide.widget.add-subscription-button')}
                        </Button>
                    )}
                </StepCard>

                {selectedApp && selectedApp.additionalAfterAddSubscriptionStep && (
                    <StepCard
                        isMobile={isMobile}
                        icon={<IconStar size={20} />}
                        title={getStepTitle(
                            selectedApp.additionalAfterAddSubscriptionStep,
                            'Additional step title is not set'
                        )}
                        description={
                            selectedApp.additionalAfterAddSubscriptionStep.description[
                                currentLang
                            ] || selectedApp.additionalAfterAddSubscriptionStep.description.en
                        }
                        color="yellow"
                    >
                        <Group gap="xs" wrap="wrap">
                            {selectedApp.additionalAfterAddSubscriptionStep.buttons.map(
                                (button, index) => (
                                    <Button
                                        component="a"
                                        href={button.buttonLink}
                                        key={index}
                                        target="_blank"
                                        variant="light"
                                        radius="md"
                                        size="sm"
                                    >
                                        {getButtonText(button)}
                                    </Button>
                                )
                            )}
                        </Group>
                    </StepCard>
                )}

                <StepCard
                    isMobile={isMobile}
                    icon={<IconCheck size={20} />}
                    title={t('installation-guide.widget.connect-and-use')}
                    description={
                        selectedApp
                            ? getAppDescription(selectedApp, 'connectAndUseStep')
                            : 'Connect and use description is not set'
                    }
                    color="green"
                />
            </Stack>
        </Box>
    )
}
