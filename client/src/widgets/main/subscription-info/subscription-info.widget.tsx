import { IconArrowsUpDown, IconCalendar, IconCheck, IconUser, IconX } from '@tabler/icons-react'
import { Group, Paper, SimpleGrid, Text, ThemeIcon } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

import { useSubscriptionInfoStoreInfo } from '@entities/subscription-info-store'

const InfoBlock = ({
    icon,
    title,
    value,
    color
}: {
    color: string
    icon: React.ReactNode
    title: string
    value: string
}) => (
    <Paper p="xs" radius="lg">
        <Group mb={4}>
            <ThemeIcon color={color} size="lg" variant="light">
                {icon}
            </ThemeIcon>
            <Text fw={500} size="lg">
                {title}
            </Text>
        </Group>
        <Text c="dimmed" truncate>
            {value}
        </Text>
    </Paper>
)

export const SubscriptionInfoWidget = () => {
    const { t } = useTranslation()
    const { subscription } = useSubscriptionInfoStoreInfo()

    if (!subscription) return null

    const { user } = subscription

    const formatDate = (dateStr: Date | string) => {
        return dayjs(dateStr).format('DD.MM.YYYY')
    }

    return (
        <SimpleGrid cols={{ base: 1, sm: 2, xs: 2 }} spacing="xs" verticalSpacing="sm">
            <InfoBlock
                color="blue"
                icon={<IconUser size={20} />}
                title={t('subscription-info.widget.name')}
                value={user.username}
            />

            <InfoBlock
                color={user.userStatus === 'ACTIVE' ? 'green' : 'red'}
                icon={user.userStatus === 'ACTIVE' ? <IconCheck size={20} /> : <IconX size={20} />}
                title={t('subscription-info.widget.status')}
                value={
                    user.userStatus === 'ACTIVE'
                        ? t('subscription-info.widget.active')
                        : t('subscription-info.widget.inactive')
                }
            />

            <InfoBlock
                color="red"
                icon={<IconCalendar size={20} />}
                title={t('subscription-info.widget.expires')}
                value={`${t('subscription-info.widget.at')} ${formatDate(user.expiresAt)}`}
            />

            <InfoBlock
                color="yellow"
                icon={<IconArrowsUpDown size={20} />}
                title={t('subscription-info.widget.bandwidth')}
                value={`${user.trafficUsed} / ${user.trafficLimit === '0' ? '∞' : user.trafficLimit}`}
            />
        </SimpleGrid>
    )
}
