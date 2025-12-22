import { IconArrowsUpDown, IconCalendar, IconCheck, IconUserScan, IconX } from '@tabler/icons-react'
import { Box, Group, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core'

import { useSubscription } from '@entities/subscription-info-store'
import { formatDate } from '@shared/utils/config-parser'
import { useTranslation } from '@shared/hooks'

import classes from './subscription-info-cards.module.css'

type ColorVariant = 'blue' | 'cyan' | 'green' | 'orange' | 'red' | 'teal' | 'violet' | 'yellow'

const iconColorClasses: Record<ColorVariant, string> = {
    blue: classes.iconBlue,
    cyan: classes.iconCyan,
    green: classes.iconGreen,
    teal: classes.iconTeal,
    red: classes.iconRed,
    yellow: classes.iconYellow,
    orange: classes.iconOrange,
    violet: classes.iconViolet
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
                    <Text c="white" className={classes.value} fw={600} size="sm">
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
    const { t, currentLang, baseTranslations } = useTranslation()
    const subscription = useSubscription()

    const { user } = subscription

    const isActive = user.userStatus === 'ACTIVE'
    const statusText = isActive ? t(baseTranslations.active) : t(baseTranslations.inactive)

    const bandwidthValue =
        user.trafficLimit === '0'
            ? `${user.trafficUsed} / ∞`
            : `${user.trafficUsed} / ${user.trafficLimit}`

    return (
        <SimpleGrid cols={{ base: 1, xs: 1, sm: 2 }} spacing="xs" verticalSpacing="xs">
            <CardItem
                color="blue"
                icon={<IconUserScan size={18} />}
                label={t(baseTranslations.name)}
                value={user.username}
            />

            <CardItem
                color={isActive ? 'green' : 'red'}
                icon={isActive ? <IconCheck size={18} /> : <IconX size={18} />}
                label={t(baseTranslations.status)}
                value={statusText}
            />

            <CardItem
                color="orange"
                icon={<IconCalendar size={18} />}
                label={t(baseTranslations.expires)}
                value={formatDate(user.expiresAt, currentLang, baseTranslations)}
            />

            <CardItem
                color="cyan"
                icon={<IconArrowsUpDown size={18} />}
                label={t(baseTranslations.bandwidth)}
                value={bandwidthValue}
            />
        </SimpleGrid>
    )
}
