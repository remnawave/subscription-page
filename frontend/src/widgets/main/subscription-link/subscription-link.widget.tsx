import {
    IconBrandDiscord,
    IconBrandTelegram,
    IconBrandVk,
    IconCopy,
    IconLink,
    IconMessageChatbot
} from '@tabler/icons-react'
import { ActionIcon, Button, Group, Image, Stack, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { renderSVG } from 'uqr'

import { constructSubscriptionUrl } from '@shared/utils/construct-subscription-url'
import { useSubscriptionInfoStoreInfo } from '@entities/subscription-info-store'

export const SubscriptionLinkWidget = ({ supportUrl }: { supportUrl?: string }) => {
    const { t } = useTranslation()
    const { subscription } = useSubscriptionInfoStoreInfo()
    const clipboard = useClipboard({ timeout: 10000 })

    if (!subscription) return null

    const subscriptionUrl = constructSubscriptionUrl(
        window.location.href,
        subscription.user.shortUuid
    )

    const handleCopy = () => {
        notifications.show({
            title: t('subscription-link.widget.link-copied'),
            message: t('subscription-link.widget.link-copied-to-clipboard'),
            color: 'cyan'
        })
        clipboard.copy(subscriptionUrl)
    }

    const renderSupportLink = (supportUrl: string) => {
        const iconConfig = {
            't.me': { icon: IconBrandTelegram, color: '#0088cc' },
            'discord.com': { icon: IconBrandDiscord, color: '#5865F2' },
            'vk.com': { icon: IconBrandVk, color: '#0077FF' }
        }

        const matchedPlatform = Object.entries(iconConfig).find(([domain]) =>
            supportUrl.includes(domain)
        )

        const { icon: Icon, color } = matchedPlatform
            ? matchedPlatform[1]
            : { icon: IconMessageChatbot, color: 'cyan' }

        return (
            <ActionIcon
                c={color}
                component="a"
                href={supportUrl}
                rel="noopener noreferrer"
                size="xl"
                radius="md"
                target="_blank"
                variant="default"
                style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.2s ease'
                }}
            >
                <Icon />
            </ActionIcon>
        )
    }

    const handleGetLink = () => {
        const subscriptionQrCode = renderSVG(subscriptionUrl, {
            whiteColor: '#161B22',
            blackColor: '#22d3ee'
        })

        modals.open({
            centered: true,
            title: t('subscription-link.widget.get-link'),
            styles: {
                content: {
                    background: 'rgba(22, 27, 35, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                },
                header: {
                    background: 'transparent'
                },
                title: {
                    fontWeight: 600,
                    color: 'white'
                }
            },
            children: (
                <Stack align="center">
                    <Image
                        src={`data:image/svg+xml;utf8,${encodeURIComponent(subscriptionQrCode)}`}
                        style={{ borderRadius: 'var(--mantine-radius-md)' }}
                    />
                    <Text fw={600} size="lg" ta="center" c="white">
                        {t('subscription-link.widget.scan-qr-code')}
                    </Text>
                    <Text c="dimmed" size="sm" ta="center">
                        {t('subscription-link.widget.line-1')}
                    </Text>

                    <Button
                        fullWidth
                        onClick={handleCopy}
                        variant="light"
                        radius="md"
                        leftSection={<IconCopy />}
                    >
                        {t('subscription-link.widget.copy-link')}
                    </Button>
                </Stack>
            )
        })
    }
    return (
        <Group gap="xs">
            <ActionIcon
                onClick={handleGetLink}
                size="xl"
                radius="md"
                variant="default"
                style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.2s ease'
                }}
            >
                <IconLink />
            </ActionIcon>

            {supportUrl && renderSupportLink(supportUrl)}
        </Group>
    )
}
