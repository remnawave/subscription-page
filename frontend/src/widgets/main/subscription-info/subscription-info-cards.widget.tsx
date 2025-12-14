import { IconArrowsUpDown, IconCalendar, IconCheck, IconUserScan, IconX } from '@tabler/icons-react'
import { Box, Group, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

import { formatDate } from '@shared/utils/time-utils/get-expiration-text/get-expiration-text.util'
import { useSubscriptionInfoStoreInfo } from '@entities/subscription-info-store'

import classes from './subscription-info-cards.module.css'

dayjs.extend(relativeTime)

type ColorVariant = 'blue' | 'cyan' | 'green' | 'teal' | 'red' | 'yellow' | 'orange' | 'violet'

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
    icon: React.ReactNode
    label: string
    value: string
    color: ColorVariant
}

const CardItem = ({ icon, label, value, color }: CardItemProps) => {
    return (
        <Box className={classes.cardItem}>
            <Group gap="xs" wrap="nowrap">
                <ThemeIcon
                    color={color}
                    size={36}
                    radius="md"
                    variant="light"
                    className={iconColorClasses[color]}
                    style={{ flexShrink: 0 }}
                >
                    {icon}
                </ThemeIcon>
                <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
                    <Text
                        size="xs"
                        c="dimmed"
                        tt="uppercase"
                        fw={500}
                        lh={1}
                        className={classes.label}
                    >
                        {label}
                    </Text>
                    <Text size="sm" c="white" fw={600} className={classes.value}>
                        {value}
                    </Text>
                </Stack>
            </Group>
        </Box>
    )
}

export const SubscriptionInfoCardsWidget = ({ isMobile }: { isMobile: boolean }) => {
    const { t, i18n } = useTranslation()
    const { subscription } = useSubscriptionInfoStoreInfo()

    if (!subscription) return null

    const { user } = subscription

    const isActive = user.userStatus === 'ACTIVE'
    const statusText = isActive
        ? t('subscription-info.widget.active')
        : t('subscription-info.widget.inactive')

    const bandwidthValue =
        user.trafficLimit === '0'
            ? `${user.trafficUsed} / ∞`
            : `${user.trafficUsed} / ${user.trafficLimit}`

    return (
        <SimpleGrid cols={{ base: 1, xs: 1, sm: 2 }} spacing="xs" verticalSpacing="xs">
            <CardItem
                icon={<IconUserScan size={18} />}
                label={t('subscription-info.widget.name')}
                value={user.username}
                color="blue"
            />

            <CardItem
                icon={isActive ? <IconCheck size={18} /> : <IconX size={18} />}
                label={t('subscription-info.widget.status')}
                value={statusText}
                color={isActive ? 'green' : 'red'}
            />

            <CardItem
                icon={<IconCalendar size={18} />}
                label={t('subscription-info.widget.expires')}
                value={formatDate(user.expiresAt, t, i18n)}
                color="orange"
            />

            <CardItem
                icon={<IconArrowsUpDown size={18} />}
                label={t('subscription-info.widget.bandwidth')}
                value={bandwidthValue}
                color="cyan"
            />
        </SimpleGrid>
    )
}
