import { IconBrandAndroid, IconBrandApple, IconDeviceDesktop } from '@tabler/icons-react'
import { Box, Group, Select, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

import { useSubscriptionInfoStoreInfo } from '@entities/subscription-info-store'
import { appList } from '@shared/constants/apps/app-list'

import { InstallationGuideAndroidWidget } from './installation-guide.android.widget'
import { InstallationGuideIosWidget } from './installation-guide.ios.widget'
import { InstallationGuidePcWidget } from './installation-guide.pc.widget'

export const InstallationGuideWidget = () => {
    const { t } = useTranslation()
    const { subscription } = useSubscriptionInfoStoreInfo()

    const [defaultTab, setDefaultTab] = useState(() => {
        const userAgent = window?.navigator?.userAgent?.toLowerCase() || ''
        if (userAgent.includes('android')) return 'android'
        if (userAgent.includes('iphone') || userAgent.includes('ipad')) return 'ios'
        return 'pc'
    })

    if (!subscription) return null

    const { subscriptionUrl } = subscription

    const openDeepLink = (urlScheme: string, isNeedBase64Encoding: boolean | undefined) => {
        if (isNeedBase64Encoding) {
            const encoded = btoa(`${subscriptionUrl}`)
            const encodedUrl = `${urlScheme}${encoded}`
            window.open(encodedUrl, '_blank')
        } else {
            window.open(`${urlScheme}${subscriptionUrl}`, '_blank')
        }
    }

    const deviceOptions = [
        {
            value: 'android',
            label: 'Android',
            icon: <IconBrandAndroid />
        },
        {
            value: 'ios',
            label: 'iOS',
            icon: <IconBrandApple />
        },
        {
            value: 'pc',
            label: t('installation-guide.widget.pc'),
            icon: <IconDeviceDesktop />
        }
    ]

    const getAppsForPlatform = (platform: 'android' | 'ios' | 'pc') => {
        return appList
            .filter((app) => app.platform === platform)
            .sort((a, b) => a.viewPosition - b.viewPosition)
    }

    const getSelectedAppForPlatform = (platform: 'android' | 'ios' | 'pc') => {
        const apps = getAppsForPlatform(platform)
        if (apps.length === 0) return null
        return apps[0]
    }

    return (
        <Box>
            <Group justify="space-between" mb="md">
                <Text fw={700} size="xl">
                    {t('installation-guide.widget.installation')}
                </Text>

                <Select
                    allowDeselect={false}
                    data={deviceOptions.map((opt) => ({
                        value: opt.value,
                        label: opt.label
                    }))}
                    leftSection={deviceOptions.find((opt) => opt.value === defaultTab)?.icon}
                    onChange={(value) => setDefaultTab(value || '')}
                    placeholder={t('installation-guide.widget.select-device')}
                    radius="md"
                    size="sm"
                    style={{ width: 130 }}
                    value={defaultTab}
                />
            </Group>
            {defaultTab === 'ios' && (
                <InstallationGuideIosWidget
                    getAppsForPlatform={getAppsForPlatform}
                    getSelectedAppForPlatform={getSelectedAppForPlatform}
                    openDeepLink={openDeepLink}
                />
            )}
            {defaultTab === 'android' && (
                <InstallationGuideAndroidWidget
                    getAppsForPlatform={getAppsForPlatform}
                    getSelectedAppForPlatform={getSelectedAppForPlatform}
                    openDeepLink={openDeepLink}
                />
            )}
            {defaultTab === 'pc' && (
                <InstallationGuidePcWidget
                    getAppsForPlatform={getAppsForPlatform}
                    getSelectedAppForPlatform={getSelectedAppForPlatform}
                    openDeepLink={openDeepLink}
                />
            )}
        </Box>
    )
}
