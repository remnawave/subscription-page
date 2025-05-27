import {
    IconBrandAndroid,
    IconBrandApple,
    IconDeviceDesktop,
    IconExternalLink
} from '@tabler/icons-react'
import { Box, Button, Group, Select, Text } from '@mantine/core'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOs } from '@mantine/hooks'
import { withoutFragment } from 'ufo'

import {
    IAppConfig,
    IPlatformConfig
} from '@shared/constants/apps-config/interfaces/app-list.interface'
import { useSubscriptionInfoStoreInfo } from '@entities/subscription-info-store'

import { BaseInstallationGuideWidget } from './installation-guide.base.widget'

export const InstallationGuideWidget = ({ appsConfig }: { appsConfig: IPlatformConfig }) => {
    const { t, i18n } = useTranslation()
    const { subscription } = useSubscriptionInfoStoreInfo()

    const os = useOs()

    const [currentLang, setCurrentLang] = useState<'en' | 'fa' | 'ru'>('en')
    const [defaultTab, setDefaultTab] = useState('pc')

    useEffect(() => {
        const lang = i18n.language
        if (lang.startsWith('en')) {
            setCurrentLang('en')
        } else if (lang.startsWith('fa')) {
            setCurrentLang('fa')
        } else if (lang.startsWith('ru')) {
            setCurrentLang('ru')
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
            case 'macos':
            case 'windows':
                setDefaultTab('pc')
                break
            default:
                setDefaultTab('pc')
                break
        }
    }, [os])

    if (!subscription) return null

    const hasPlatformApps = {
        ios: appsConfig.ios && appsConfig.ios.length > 0,
        android: appsConfig.android && appsConfig.android.length > 0,
        pc: appsConfig.pc && appsConfig.pc.length > 0
    }

    if (!hasPlatformApps.ios && !hasPlatformApps.android && !hasPlatformApps.pc) {
        return null
    }

    const subscriptionUrl = withoutFragment(window.location.href)

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
        hasPlatformApps.pc && {
            value: 'pc',
            label: t('installation-guide.widget.pc'),
            icon: <IconDeviceDesktop />
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

    const getAppsForPlatform = (platform: 'android' | 'ios' | 'pc') => {
        return appsConfig[platform] || []
    }

    const getSelectedAppForPlatform = (platform: 'android' | 'ios' | 'pc') => {
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

    const getPlatformTitle = (platform: 'android' | 'ios' | 'pc') => {
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
        return t('installation-guide.pc.widget.download-app', {
            appName: '{appName}'
        })
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
                        style={{ width: 130 }}
                        value={defaultTab}
                    />
                )}
            </Group>

            {hasPlatformApps[defaultTab as keyof typeof hasPlatformApps] && (
                <BaseInstallationGuideWidget
                    appsConfig={appsConfig}
                    currentLang={currentLang}
                    firstStepTitle={getPlatformTitle(defaultTab as 'android' | 'ios' | 'pc')}
                    getAppsForPlatform={getAppsForPlatform}
                    getSelectedAppForPlatform={getSelectedAppForPlatform}
                    openDeepLink={openDeepLink}
                    platform={defaultTab as 'android' | 'ios' | 'pc'}
                    renderFirstStepButton={renderFirstStepButton}
                />
            )}
        </Box>
    )
}
