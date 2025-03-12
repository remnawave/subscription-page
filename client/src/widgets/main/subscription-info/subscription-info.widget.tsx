import { IconArrowsUpDown, IconCalendar, IconCheck, IconUser } from '@tabler/icons-react'
import { Grid, Group, Paper, Text, ThemeIcon } from '@mantine/core'
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
    <Paper p="md" radius="lg">
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
    const { remnawaveSubscription } = useSubscriptionInfoStoreInfo()

    if (!remnawaveSubscription) return null

    const { user } = remnawaveSubscription

    const formatDate = (dateStr: Date | string) => {
        return dayjs(dateStr).format('DD.MM.YYYY')
    }

    return (
        <Grid>
            <Grid.Col span={{ sm: 6, xs: 12 }}>
                <InfoBlock
                    color="blue"
                    icon={<IconUser size={20} />}
                    title="Имя"
                    value={user.username}
                />
            </Grid.Col>
            <Grid.Col span={{ sm: 6, xs: 12 }}>
                <InfoBlock
                    color="green"
                    icon={<IconCheck size={20} />}
                    title="Статус"
                    value={user.userStatus === 'ACTIVE' ? 'Активна' : 'Неактивна'}
                />
            </Grid.Col>
            <Grid.Col span={{ sm: 6, xs: 12 }}>
                <InfoBlock
                    color="red"
                    icon={<IconCalendar size={20} />}
                    title="Срок"
                    value={`До ${formatDate(user.expiresAt)}`}
                />
            </Grid.Col>
            <Grid.Col span={{ sm: 6, xs: 12 }}>
                <InfoBlock
                    color="yellow"
                    icon={<IconArrowsUpDown size={20} />}
                    title="Трафик"
                    value={`${user.trafficUsed} / ${user.trafficLimit === '0' ? '∞' : user.trafficLimit}`}
                />
            </Grid.Col>
        </Grid>
    )
}
