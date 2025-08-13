import {
    IconBrandDiscord,
    IconBrandTelegram,
    IconBrandVk,
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
            color: 'teal'
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
            : { icon: IconMessageChatbot, color: 'teal' }

        return (
            <ActionIcon
                c={color}
                component="a"
                href={supportUrl}
                rel="noopener noreferrer"
                size="xl"
                target="_blank"
                variant="default"
            >
                <Icon />
            </ActionIcon>
        )
    }

    return (
        <Group gap="xs">
            <ActionIcon
                onClick={() => {
                    const subscriptionQrCode = renderSVG(subscriptionUrl, {
                        whiteColor: '#161B22',
                        blackColor: '#3CC9DB'
                    })

                    modals.open({
                        centered: true,
                        title: t('subscription-link.widget.get-link'),
                        children: (
                            <>
                                <Stack align="center">
                                    <Image
                                        src={`data:image/svg+xml;utf8,${encodeURIComponent(subscriptionQrCode)}`}
                                    />
                                    <Text fw={600} size="lg" ta="center">
                                        {t('subscription-link.widget.scan-qr-code')}
                                    </Text>
                                    <Text c="dimmed" size="sm" ta="center">
                                        {t('subscription-link.widget.line-1')}
                                    </Text>

                                    <Button fullWidth onClick={handleCopy} variant="filled">
                                        {t('subscription-link.widget.copy-link')}
                                    </Button>
                                </Stack>
                            </>
                        )
                    })
                }}
                size="xl"
                variant="default"
            >
                <IconLink />
            </ActionIcon>
            {supportUrl && renderSupportLink(supportUrl)}
        </Group>
    )
}
