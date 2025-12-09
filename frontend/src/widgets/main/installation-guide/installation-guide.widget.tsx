import {
    IconBrandAndroid,
    IconBrandApple,
    IconBrandWindows,
    IconDeviceDesktop,
    IconExternalLink
} from '@tabler/icons-react'
import { Box, Button, Card, Group, Select, Stack, Text, Title } from '@mantine/core'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOs } from '@mantine/hooks'

import {
    IAppConfig,
    ISubscriptionPageAppConfig,
    TEnabledLocales,
    TPlatform
} from '@shared/constants/apps-config/interfaces/app-list.interface'
import { constructSubscriptionUrl } from '@shared/utils/construct-subscription-url'
import { useSubscriptionInfoStoreInfo } from '@entities/subscription-info-store'

import { BaseInstallationGuideWidget } from './installation-guide.base.widget'

export const InstallationGuideWidget = ({
    appsConfig,
    enabledLocales,
    isMobile
}: {
    appsConfig: ISubscriptionPageAppConfig['platforms']
    enabledLocales: TEnabledLocales[]
    isMobile: boolean
}) => {
    const { t, i18n } = useTranslation()
    const { subscription } = useSubscriptionInfoStoreInfo()

    const os = useOs()

    const [currentLang, setCurrentLang] = useState<TEnabledLocales>('en')
    const [defaultTab, setDefaultTab] = useState('windows')

    useEffect(() => {
        const lang = i18n.language

        if (lang.startsWith('en')) {
            setCurrentLang('en')
        } else if (lang.startsWith('fa') && enabledLocales.includes('fa')) {
            setCurrentLang('fa')
        } else if (lang.startsWith('ru') && enabledLocales.includes('ru')) {
            setCurrentLang('ru')
        } else if (lang.startsWith('zh') && enabledLocales.includes('zh')) {
            setCurrentLang('zh')
        } else {
            setCurrentLang('en')
        }
    }, [i18n.language])

    useLayoutEffect(() => {
        switch (os) {
            case 'android':
                setDefaultTab('android')
                break
            case 'ios':
                setDefaultTab('ios')
                break
            case 'linux':
                setDefaultTab('linux')
                break
            case 'macos':
                setDefaultTab('macos')
                break
            case 'windows':
                setDefaultTab('windows')
                break
            default:
                setDefaultTab('windows')
                break
        }
    }, [os])

    if (!subscription) return null

    const subscriptionUrl = constructSubscriptionUrl(
        window.location.href,
        subscription.user.shortUuid
    )

    const hasPlatformApps = {
        ios: appsConfig.ios && appsConfig.ios.length > 0,
        android: appsConfig.android && appsConfig.android.length > 0,
        linux: appsConfig.linux && appsConfig.linux.length > 0,
        macos: appsConfig.macos && appsConfig.macos.length > 0,
        windows: appsConfig.windows && appsConfig.windows.length > 0,
        androidTV: appsConfig.androidTV && appsConfig.androidTV.length > 0,
        appleTV: appsConfig.appleTV && appsConfig.appleTV.length > 0
    }

    if (
        !hasPlatformApps.ios &&
        !hasPlatformApps.android &&
        !hasPlatformApps.linux &&
        !hasPlatformApps.macos &&
        !hasPlatformApps.windows &&
        !hasPlatformApps.androidTV &&
        !hasPlatformApps.appleTV
    ) {
        return null
    }

    const openDeepLink = (urlScheme: string, isNeedBase64Encoding: boolean | undefined) => {
        if (isNeedBase64Encoding) {
            const encoded = btoa(`${subscriptionUrl}`)
            const encodedUrl = `${urlScheme}${encoded}`
            window.open(encodedUrl, '_blank')
        } else {
            window.open(`${urlScheme}${subscriptionUrl}`, '_blank')
        }
    }

    const availablePlatforms = [
        hasPlatformApps.android && {
            value: 'android',
            label: 'Android',
            icon: <IconBrandAndroid size={20} />
        },
        hasPlatformApps.ios && {
            value: 'ios',
            label: 'iOS',
            icon: <IconBrandApple size={20} />
        },
        hasPlatformApps.macos && {
            value: 'macos',
            label: 'macOS',
            icon: <IconBrandApple size={20} />
        },
        hasPlatformApps.windows && {
            value: 'windows',
            label: 'Windows',
            icon: <IconBrandWindows size={20} />
        },
        hasPlatformApps.linux && {
            value: 'linux',
            label: 'Linux',
            icon: <IconDeviceDesktop size={20} />
        },
        hasPlatformApps.androidTV && {
            value: 'androidTV',
            label: 'Android TV',
            icon: <IconBrandAndroid size={20} />
        },
        hasPlatformApps.appleTV && {
            value: 'appleTV',
            label: 'Apple TV',
            icon: <IconBrandApple size={20} />
        }
    ].filter(Boolean) as {
        icon: React.ReactNode
        label: string
        value: string
    }[]

    if (
        !hasPlatformApps[defaultTab as keyof typeof hasPlatformApps] &&
        availablePlatforms.length > 0
    ) {
        setDefaultTab(availablePlatforms[0].value)
    }

    const getAppsForPlatform = (platform: TPlatform) => {
        return appsConfig[platform] || []
    }

    const getSelectedAppForPlatform = (platform: TPlatform) => {
        const apps = getAppsForPlatform(platform)
        if (apps.length === 0) return null
        return apps[0]
    }

    const renderFirstStepButton = (app: IAppConfig) => {
        if (app.installationStep.buttons.length > 0) {
            return (
                <Group gap="xs" wrap="wrap">
                    {app.installationStep.buttons.map((button, index) => {
                        const buttonText = button.buttonText[currentLang] || button.buttonText.en

                        return (
                            <Button
                                component="a"
                                href={button.buttonLink}
                                key={index}
                                leftSection={<IconExternalLink size={14} />}
                                target="_blank"
                                variant="light"
                                radius="md"
                                size="sm"
                            >
                                {buttonText}
                            </Button>
                        )
                    })}
                </Group>
            )
        }

        return null
    }

    return (
        <Card p={{ base: 'sm', xs: 'md', sm: 'lg', md: 'xl' }} radius="lg" className="glass-card">
            <Stack gap="md">
                <Group justify="space-between" gap="sm">
                    <Title order={4} c="white" fw={600}>
                        {t('installation-guide.widget.installation')}
                    </Title>

                    {availablePlatforms.length > 1 && (
                        <Select
                            allowDeselect={false}
                            data={availablePlatforms.map((opt) => ({
                                value: opt.value,
                                label: opt.label
                            }))}
                            leftSection={
                                availablePlatforms.find((opt) => opt.value === defaultTab)?.icon
                            }
                            onChange={(value) => setDefaultTab(value || '')}
                            placeholder={t('installation-guide.widget.select-device')}
                            radius="md"
                            size="sm"
                            style={{ width: 140 }}
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

                {hasPlatformApps[defaultTab as keyof typeof hasPlatformApps] && (
                    <BaseInstallationGuideWidget
                        appsConfig={appsConfig}
                        isMobile={isMobile}
                        currentLang={currentLang}
                        firstStepTitle={t('installation-guide.widget.install-app')}
                        getAppsForPlatform={getAppsForPlatform}
                        getSelectedAppForPlatform={getSelectedAppForPlatform}
                        openDeepLink={openDeepLink}
                        platform={defaultTab as TPlatform}
                        renderFirstStepButton={renderFirstStepButton}
                    />
                )}
            </Stack>
        </Card>
    )
}
