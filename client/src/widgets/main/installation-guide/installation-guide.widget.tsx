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

import { useSubscriptionInfoStoreInfo } from '@entities/subscription-info-store'

export const InstallationGuideWidget = () => {
    const { remnawaveSubscription } = useSubscriptionInfoStoreInfo()

    if (!remnawaveSubscription) return null

    const { subscriptionUrl } = remnawaveSubscription

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const openInClient = (platform: string) => {
        window.open(`happ://add/${subscriptionUrl}`, '_blank')

        if (platform === 'desktop') {
            window.open(`hiddify://import/${subscriptionUrl}`, '_blank')
        }
    }

    return (
        <Tabs defaultValue="android">
            <Group mb="md">
                <Text fw={700} size="xl">
                    Инструкция
                </Text>
                <Tabs.List>
                    <Tabs.Tab leftSection={<IconBrandAndroid />} value="android">
                        Android
                    </Tabs.Tab>
                    <Tabs.Tab leftSection={<IconBrandApple />} value="ios">
                        iOS
                    </Tabs.Tab>
                    <Tabs.Tab leftSection={<IconDeviceDesktop />} value="desktop">
                        ПК
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
                        title="Установите и откройте Happ"
                    >
                        <Text c="dimmed" mb={16} size="sm">
                            Откройте страницу в Google Play и установите приложение.
                        </Text>
                        <Button
                            component="a"
                            href="https://play.google.com/store/apps/details?id=com.happproxy"
                            leftSection={<IconExternalLink size={16} />}
                            target="_blank"
                            variant="light"
                        >
                            Открыть в Google Play
                        </Button>
                    </Timeline.Item>

                    <Timeline.Item
                        bullet={
                            <ThemeIcon color="teal.5" radius="xl" size={26}>
                                <IconCloudDownload size={16} />
                            </ThemeIcon>
                        }
                        title="Добавьте подписку"
                    >
                        <Text c="dimmed" mb={16} size="sm">
                            Нажмите кнопку ниже — приложение откроется, и подписка добавится
                            автоматически.
                        </Text>
                        <Button onClick={() => openInClient('android')} variant="filled">
                            Добавить подписку
                        </Button>
                    </Timeline.Item>

                    <Timeline.Item
                        bullet={
                            <ThemeIcon color="teal.5" radius="xl" size={26}>
                                <IconCheck size={16} />
                            </ThemeIcon>
                        }
                        title="Подключитесь и пользуйтесь"
                    >
                        <Text c="dimmed" size="sm">
                            В главном разделе нажмите большую кнопку включения в центре для
                            подключения к VPN. Не забудьте выбрать сервер в списке серверов. При
                            необходимости выберите другой сервер в списке серверов.
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
                        title="Установите и откройте Happ"
                    >
                        <Text c="dimmed" mb={16} size="sm">
                            Откройте страницу в App Store и установите приложение. Запустите его, в
                            окне разрешения на добавление конфигураций VPN нажмите Разрешить и
                            введите свой код-пароль.
                        </Text>
                        <Button
                            component="a"
                            href="https://apps.apple.com/us/app/happ-proxy-utility/id6504287215"
                            leftSection={<IconExternalLink size={16} />}
                            target="_blank"
                            variant="light"
                        >
                            Открыть в App Store
                        </Button>
                    </Timeline.Item>

                    <Timeline.Item
                        bullet={
                            <ThemeIcon color="teal.5" radius="xl" size={26}>
                                <IconCloudDownload size={16} />
                            </ThemeIcon>
                        }
                        title="Добавьте подписку"
                    >
                        <Text c="dimmed" mb={16} size="sm">
                            Нажмите на кнопку ниже — откроется приложение, и подписка добавится
                            автоматически.
                        </Text>
                        <Button onClick={() => openInClient('ios')} variant="filled">
                            Добавить подписку
                        </Button>
                    </Timeline.Item>

                    <Timeline.Item
                        bullet={
                            <ThemeIcon color="teal.5" radius="xl" size={26}>
                                <IconCheck size={16} />
                            </ThemeIcon>
                        }
                        title="Подключитесь и пользуйтесь"
                    >
                        <Text c="dimmed" size="sm">
                            В главном разделе нажмите большую кнопку включения в центре для
                            подключения к VPN. Не забудьте выбрать сервер в списке серверов. При
                            необходимости выберите другой сервер в списке серверов.
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
                        title="Установите и откройте Hiddify"
                    >
                        <Text c="dimmed" mb={16} size="sm">
                            Установите приложение. Запустите его, выберите регион Россия, затем
                            нажмите Старт.
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
                        title="Добавьте подписку"
                    >
                        <Text c="dimmed" mb={16} size="sm">
                            Нажмите кнопку ниже — приложение откроется, и подписка добавится
                            автоматически. Если это не произошло, закройте приложение и попробуйте
                            снова.
                        </Text>
                        <Button onClick={() => openInClient('desktop')} variant="filled">
                            Добавить подписку
                        </Button>
                    </Timeline.Item>

                    <Timeline.Item
                        bullet={
                            <ThemeIcon color="teal.5" radius="xl" size={26}>
                                <IconCheck size={16} />
                            </ThemeIcon>
                        }
                        title="Подключитесь и пользуйтесь"
                    >
                        <Text c="dimmed" size="sm">
                            В главном разделе нажмите большую кнопку включения в центре для
                            подключения к VPN. При необходимости выберите другой сервер в разделе
                            Прокси.
                        </Text>
                    </Timeline.Item>
                </Timeline>
            </Tabs.Panel>
        </Tabs>
    )
}
