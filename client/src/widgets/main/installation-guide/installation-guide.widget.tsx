import {
    IconBrandAndroid,
    IconBrandApple,
    IconCheck,
    IconCloudDownload,
    IconDeviceDesktop,
    IconDownload,
    IconExternalLink
} from '@tabler/icons-react'
import { Button, Group, Tabs, Text, ThemeIcon, Timeline } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

import { useSubscriptionInfoStoreInfo } from '@entities/subscription-info-store'

export const InstallationGuideWidget = () => {
    const { t } = useTranslation()
    const { remnawaveSubscription } = useSubscriptionInfoStoreInfo()

    const [defaultTab, setDefaultTab] = useState(() => {
        try {
            if (typeof window !== 'undefined' && window.navigator) {
                const userAgent = window.navigator.userAgent.toLowerCase()
                if (userAgent.indexOf('android') !== -1) {
                    return 'android'
                } else if (
                    userAgent.indexOf('iphone') !== -1 || 
                    userAgent.indexOf('ipad') !== -1
                ) {
                    return 'ios'
                }
            }
            return 'desktop'
        } catch (error) {
            return 'desktop'
        }
    })

    if (!remnawaveSubscription) return null

    const { subscriptionUrl } = remnawaveSubscription

    const openHapp = () => {
        window.open(`happ://add/${subscriptionUrl}`, '_blank')
    }

    const openHiddify = () => {
        window.open(`hiddify://import/${subscriptionUrl}`, '_blank')
    }

    return (
        <Tabs defaultValue={defaultTab}>
            <Group mb="md">
                <Text fw={700} size="xl">
                    {t('installation-guide.widget.instrukciya')}
                </Text>
                <Tabs.List>
                    <Tabs.Tab leftSection={<IconBrandAndroid />} value="android">
                        Android
                    </Tabs.Tab>
                    <Tabs.Tab leftSection={<IconBrandApple />} value="ios">
                        iOS
                    </Tabs.Tab>
                    <Tabs.Tab leftSection={<IconDeviceDesktop />} value="desktop">
                        {t('installation-guide.widget.pk')}
                    </Tabs.Tab>
                </Tabs.List>
            </Group>

            <Tabs.Panel value="android">
                <Timeline active={1} bulletSize={32} color="teal" lineWidth={2}>
                    <Timeline.Item
                        bullet={
                            <ThemeIcon color="teal.5" radius="xl" size={26}>
                                <IconDownload size={16} />
                            </ThemeIcon>
                        }
                        title={t('installation-guide.widget.ustanovite-i-otkroite-happ')}
                    >
                        <Text c="dimmed" mb={16} size="sm">
                            {t('installation-guide.widget.open-google-play')}
                        </Text>
                        <Button
                            component="a"
                            href="https://play.google.com/store/apps/details?id=com.happproxy"
                            leftSection={<IconExternalLink size={16} />}
                            target="_blank"
                            variant="light"
                        >
                            {t('installation-guide.widget.open-in-google-play')}
                        </Button>
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
                            {t('installation-guide.widget.add-subscription-description')}
                        </Text>
                        <Button onClick={openHapp} variant="filled">
                            {t('installation-guide.widget.add-subscription-button')}
                        </Button>
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
                            {t('installation-guide.widget.connect-and-use-description')}
                        </Text>
                    </Timeline.Item>
                </Timeline>
            </Tabs.Panel>

            <Tabs.Panel value="ios">
                <Timeline active={1} bulletSize={32} color="teal" lineWidth={2}>
                    <Timeline.Item
                        bullet={
                            <ThemeIcon color="teal.5" radius="xl" size={26}>
                                <IconDownload size={16} />
                            </ThemeIcon>
                        }
                        title={t('installation-guide.widget.ustanovite-i-otkroite-happ')}
                    >
                        <Text c="dimmed" mb={16} size="sm">
                            {t('installation-guide.widget.install-app-store-description')}
                        </Text>
                        <Button
                            component="a"
                            href="https://apps.apple.com/us/app/happ-proxy-utility/id6504287215"
                            leftSection={<IconExternalLink size={16} />}
                            target="_blank"
                            variant="light"
                        >
                            {t('installation-guide.widget.open-app-store')}
                        </Button>
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
                            {t('installation-guide.widget.add-ios-subscription-description')}
                        </Text>
                        <Button onClick={openHapp} variant="filled">
                            {t('installation-guide.widget.add-subscription-button')}
                        </Button>
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
                            {t('installation-guide.widget.connect-and-use-description')}
                        </Text>
                    </Timeline.Item>
                </Timeline>
            </Tabs.Panel>

            <Tabs.Panel value="desktop">
                <Timeline active={1} bulletSize={32} color="teal" lineWidth={2}>
                    <Timeline.Item
                        bullet={
                            <ThemeIcon color="teal.5" radius="xl" size={26}>
                                <IconDownload size={16} />
                            </ThemeIcon>
                        }
                        title={t('installation-guide.widget.install-hiddify')}
                    >
                        <Text c="dimmed" mb={16} size="sm">
                            {t('installation-guide.widget.install-hiddify-description')}
                        </Text>
                        <Group>
                            <Button
                                component="a"
                                href="https://github.com/hiddify/hiddify-app/releases/download/v2.5.7/Hiddify-Windows-Setup-x64.exe"
                                leftSection={<IconExternalLink size={16} />}
                                target="_blank"
                                variant="light"
                            >
                                Windows
                            </Button>
                            <Button
                                component="a"
                                href="https://github.com/hiddify/hiddify-app/releases/download/v2.5.7/Hiddify-MacOS.dmg"
                                leftSection={<IconExternalLink size={16} />}
                                target="_blank"
                                variant="light"
                            >
                                macOS
                            </Button>
                            <Button
                                component="a"
                                href="https://github.com/hiddify/hiddify-app/releases/download/v2.5.7/Hiddify-Linux-x64.AppImage"
                                leftSection={<IconExternalLink size={16} />}
                                target="_blank"
                                variant="light"
                            >
                                Linux
                            </Button>
                        </Group>
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
                            {t('installation-guide.widget.add-subscription-pc-description')}
                        </Text>
                        <Button onClick={openHiddify} variant="filled">
                            {t('installation-guide.widget.add-subscription-button')}
                        </Button>
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
                            {t('installation-guide.widget.select-server-hiddify')}
                        </Text>
                    </Timeline.Item>
                </Timeline>
            </Tabs.Panel>
        </Tabs>
    )
}
