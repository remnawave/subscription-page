import { Button, Image, Stack, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useClipboard } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { renderSVG } from 'uqr'

import { useSubscriptionInfoStoreInfo } from '@entities/subscription-info-store'

export const SubscriptionLinkWidget = () => {
    const { remnawaveSubscription } = useSubscriptionInfoStoreInfo()
    const clipboard = useClipboard({ timeout: 10000 })

    if (!remnawaveSubscription) return null

    const handleCopy = () => {
        notifications.show({
            title: 'Ссылка скопирована',
            message: 'Ссылка скопирована в буфер обмена',
            color: 'teal'
        })
        clipboard.copy(remnawaveSubscription.subscriptionUrl)
    }

    return (
        <>
            <Button
                onClick={() => {
                    const subscriptionQrCode = renderSVG(remnawaveSubscription.subscriptionUrl, {
                        whiteColor: '#161B22',
                        blackColor: '#3CC9DB'
                    })

                    modals.open({
                        centered: true,
                        title: 'Получить ссылку',
                        children: (
                            <>
                                <Stack align="center">
                                    <Image
                                        src={`data:image/svg+xml;utf8,${encodeURIComponent(subscriptionQrCode)}`}
                                    />
                                    <Text fw={600} size="lg" ta="center">
                                        Отсканируйте QR-код выше в клиенте
                                    </Text>
                                    <Text c="dimmed" size="sm" ta="center">
                                        Простое добавление подписки в любой клиент. Есть и другой
                                        вариант: скопируйте ссылку ниже и вставьте в клиент
                                    </Text>

                                    <Button fullWidth onClick={handleCopy} variant="filled">
                                        Скопировать ссылку
                                    </Button>
                                </Stack>
                            </>
                        )
                    })
                }}
                variant="outline"
            >
                Получить ссылку
            </Button>
        </>
    )
}
