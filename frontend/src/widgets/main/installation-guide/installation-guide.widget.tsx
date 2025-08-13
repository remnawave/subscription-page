import {
    IconBrandAndroid,
    IconBrandApple,
    IconBrandWindows,
    IconDeviceDesktop,
    IconExternalLink
} from '@tabler/icons-react'
import { Box, Button, Group, Select, Text } from '@mantine/core'
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
    enabledLocales
}: {
    appsConfig: ISubscriptionPageAppConfig['platforms']
    enabledLocales: TEnabledLocales[]
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
            icon: <IconBrandAndroid />
        },
        hasPlatformApps.ios && {
            value: 'ios',
            label: 'iOS',
            icon: <IconBrandApple />
        },
        hasPlatformApps.macos && {
            value: 'macos',
            label: 'macOS',
            icon: <IconBrandApple />
        },
        hasPlatformApps.windows && {
            value: 'windows',
            label: 'Windows',
            icon: <IconBrandWindows />
        },
        hasPlatformApps.linux && {
            value: 'linux',
            label: 'Linux',
            icon: <IconDeviceDesktop />
        },
        hasPlatformApps.androidTV && {
            value: 'androidTV',
            label: 'Android TV',
            icon: <IconBrandAndroid />
        },
        hasPlatformApps.appleTV && {
            value: 'appleTV',
            label: 'Apple TV',
            icon: <IconBrandApple />
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
                <Group>
                    {app.installationStep.buttons.map((button, index) => {
                        const buttonText = button.buttonText[currentLang] || button.buttonText.en

                        return (
                            <Button
                                component="a"
                                href={button.buttonLink}
                                key={index}
                                leftSection={<IconExternalLink size={16} />}
                                target="_blank"
                                variant="light"
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

    const getPlatformTitle = (platform: TPlatform) => {
        if (platform === 'android') {
            return t('installation-guide.android.widget.install-and-open-app', {
                appName: '{appName}'
            })
        }
        if (platform === 'ios') {
            return t('installation-guide.ios.widget.install-and-open-app', {
                appName: '{appName}'
            })
        }
        if (
            platform === 'windows' ||
            platform === 'androidTV' ||
            platform === 'appleTV' ||
            platform === 'linux' ||
            platform === 'macos'
        ) {
            return t('installation-guide.windows.widget.download-app', {
                appName: '{appName}'
            })
        }

        return 'Unknown platform'
    }

    return (
        <Box>
            <Group justify="space-between" mb="md">
                <Text fw={700} size="xl">
                    {t('installation-guide.widget.installation')}
                </Text>

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
                        style={{ width: 160 }}
                        value={defaultTab}
                        withScrollArea={false}
                    />
                )}
            </Group>

            {hasPlatformApps[defaultTab as keyof typeof hasPlatformApps] && (
                <BaseInstallationGuideWidget
                    appsConfig={appsConfig}
                    currentLang={currentLang}
                    firstStepTitle={getPlatformTitle(defaultTab as TPlatform)}
                    getAppsForPlatform={getAppsForPlatform}
                    getSelectedAppForPlatform={getSelectedAppForPlatform}
                    openDeepLink={openDeepLink}
                    platform={defaultTab as TPlatform}
                    renderFirstStepButton={renderFirstStepButton}
                />
            )}
        </Box>
    )
}
