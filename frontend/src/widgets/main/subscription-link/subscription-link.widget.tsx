import { Button, Image, Stack, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { withoutFragment } from 'ufo'
import { renderSVG } from 'uqr'

import { useSubscriptionInfoStoreInfo } from '@entities/subscription-info-store'

export const SubscriptionLinkWidget = () => {
    const { t } = useTranslation()
    const { subscription } = useSubscriptionInfoStoreInfo()
    const clipboard = useClipboard({ timeout: 10000 })

    if (!subscription) return null

    const { origin, pathname } = window.location
    const segments = pathname.split('/').filter(Boolean)
    const baseSegments = segments.slice(0, -1)
    const base = baseSegments.length > 0 ? `${origin}/${baseSegments.join('/')}` : origin
    const subscriptionUrl = withoutFragment(`${base}/${subscription.user.shortUuid}`)

    const handleCopy = () => {
        notifications.show({
            title: t('subscription-link.widget.link-copied'),
            message: t('subscription-link.widget.link-copied-to-clipboard'),
            color: 'teal'
        })
        clipboard.copy(subscriptionUrl)
    }

    return (
        <>
            <Button
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
                variant="outline"
            >
                {t('subscription-link.widget.get-link')}
            </Button>
        </>
    )
}
