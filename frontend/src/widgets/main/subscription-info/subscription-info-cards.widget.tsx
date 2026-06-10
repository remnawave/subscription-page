import { Box, Group, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconCalendar, IconCheck, IconX } from '@tabler/icons-react'

import { useSubscription } from '@entities/subscription-info-store'
import { formatDate } from '@shared/utils/config-parser'
import { useTranslation } from '@shared/hooks'

import classes from './subscription-info-cards.module.css'

type ColorVariant =
    | 'blue'
    | 'brand'
    | 'cyan'
    | 'green'
    | 'orange'
    | 'red'
    | 'teal'
    | 'violet'
    | 'yellow'

const iconColorClasses: Record<ColorVariant, string> = {
    blue: classes.iconBlue,
    brand: classes.iconCyan,
    cyan: classes.iconCyan,
    green: classes.iconGreen,
    teal: classes.iconTeal,
    red: classes.iconRed,
    yellow: classes.iconYellow,
    orange: classes.iconOrange,
    violet: classes.iconViolet
}

// Русские подписи статуса подписки (енумы Remnawave → текст для пользователя)
const STATUS_RU: Record<string, string> = {
    ACTIVE: 'Активна',
    EXPIRED: 'Истекла',
    LIMITED: 'Ограничена',
    DISABLED: 'Отключена'
}

interface CardItemProps {
    color: ColorVariant
    icon: React.ReactNode
    label: string
    value: string
}

const CardItem = ({ icon, label, value, color }: CardItemProps) => {
    return (
        <Box className={classes.cardItem}>
            <Group gap="xs" wrap="nowrap">
                <ThemeIcon
                    className={iconColorClasses[color]}
                    color={color}
                    radius="md"
                    size={36}
                    style={{ flexShrink: 0 }}
                    variant="light"
                >
                    {icon}
                </ThemeIcon>
                <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
                    <Text
                        c="dimmed"
                        className={classes.label}
                        fw={500}
                        lh={1}
                        size="xs"
                        tt="uppercase"
                    >
                        {label}
                    </Text>
                    <Text c="dark.8" className={classes.value} fw={600} size="sm">
                        {value}
                    </Text>
                </Stack>
            </Group>
        </Box>
    )
}

interface IProps {
    isMobile: boolean
}

export const SubscriptionInfoCardsWidget = ({ isMobile: _ }: IProps) => {
    const { currentLang, baseTranslations } = useTranslation()
    const subscription = useSubscription()

    const { user } = subscription

    const isActive = user.userStatus === 'ACTIVE'
    const statusText = STATUS_RU[user.userStatus] ?? 'Неизвестно'

    return (
        <SimpleGrid cols={{ base: 1, xs: 1, sm: 2 }} spacing="xs" verticalSpacing="xs">
            <CardItem
                color={isActive ? 'green' : 'red'}
                icon={isActive ? <IconCheck size={18} /> : <IconX size={18} />}
                label="Статус"
                value={statusText}
            />

            <CardItem
                color="orange"
                icon={<IconCalendar size={18} />}
                label="Истекает"
                value={formatDate(user.expiresAt, currentLang, baseTranslations)}
            />
        </SimpleGrid>
    )
}
