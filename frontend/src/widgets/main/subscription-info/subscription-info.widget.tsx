import {
    IconAlertCircle,
    IconArrowsUpDown,
    IconCalendar,
    IconCheck,
    IconUserScan,
    IconX
} from '@tabler/icons-react'
import { Card, Group, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

import {
    formatDate,
    getExpirationTextUtil
} from '@shared/utils/time-utils/get-expiration-text/get-expiration-text.util'
import { useSubscriptionInfoStoreInfo } from '@entities/subscription-info-store'
import { InfoBlockShared } from '@shared/ui/info-block/info-block.shared'

dayjs.extend(relativeTime)
export const SubscriptionInfoWidget = ({ isMobile }: { isMobile: boolean }) => {
    const { t, i18n } = useTranslation()
    const { subscription } = useSubscriptionInfoStoreInfo()

    if (!subscription) return null

    const { user } = subscription

    const getStatusAndIcon = (): {
        color: string
        icon: React.ReactNode
        status: string
    } => {
        if (user.userStatus === 'ACTIVE' && user.daysLeft > 0) {
            return {
                color: 'teal',
                icon: <IconCheck size={isMobile ? 18 : 22} />,
                status: t('subscription-info.widget.active')
            }
        }
        if (
            (user.userStatus === 'ACTIVE' && user.daysLeft === 0) ||
            (user.daysLeft >= 0 && user.daysLeft <= 3)
        ) {
            return {
                color: 'orange',
                icon: <IconAlertCircle size={isMobile ? 18 : 22} />,
                status: t('subscription-info.widget.active')
            }
        }

        return {
            color: 'red',
            icon: <IconX size={isMobile ? 18 : 22} />,
            status: t('subscription-info.widget.inactive')
        }
    }

    const statusInfo = getStatusAndIcon()

    return (
        <Card p={{ base: 'sm', xs: 'md', sm: 'lg', md: 'xl' }} radius="lg" className="glass-card">
            <Stack gap={isMobile ? 'sm' : 'md'}>
                <Group justify="space-between" gap="sm">
                    <Group
                        gap={isMobile ? 'xs' : 'sm'}
                        wrap="nowrap"
                        style={{ minWidth: 0, flex: 1 }}
                    >
                        <ThemeIcon
                            color={statusInfo.color}
                            size={isMobile ? 36 : 44}
                            radius="xl"
                            variant="light"
                            style={{
                                background: `linear-gradient(135deg, var(--mantine-color-${statusInfo.color}-filled) 0%, var(--mantine-color-${statusInfo.color}-light) 100%)`,
                                border: `1px solid var(--mantine-color-${statusInfo.color}-4)`,
                                flexShrink: 0
                            }}
                        >
                            {statusInfo.icon}
                        </ThemeIcon>
                        <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
                            <Title
                                order={5}
                                c="white"
                                fw={600}
                                style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {user.username}
                            </Title>
                            <Text
                                c={user.daysLeft === 0 ? 'red' : 'dimmed'}
                                size={isMobile ? 'xs' : 'sm'}
                                fw={600}
                            >
                                {getExpirationTextUtil(user.expiresAt, t, i18n)}
                            </Text>
                        </Stack>
                    </Group>
                </Group>

                <SimpleGrid cols={{ base: 2, xs: 2, sm: 2 }} spacing="xs" verticalSpacing="xs">
                    <InfoBlockShared
                        color="blue"
                        icon={<IconUserScan size={16} />}
                        title={t('subscription-info.widget.name')}
                        value={user.username}
                    />

                    <InfoBlockShared
                        color={user.userStatus === 'ACTIVE' ? 'green' : 'red'}
                        icon={
                            user.userStatus === 'ACTIVE' ? (
                                <IconCheck size={16} />
                            ) : (
                                <IconX size={16} />
                            )
                        }
                        title={t('subscription-info.widget.status')}
                        value={
                            user.userStatus === 'ACTIVE'
                                ? t('subscription-info.widget.active')
                                : t('subscription-info.widget.inactive')
                        }
                    />

                    <InfoBlockShared
                        color="red"
                        icon={<IconCalendar size={16} />}
                        title={t('subscription-info.widget.expires')}
                        value={formatDate(user.expiresAt, t, i18n)}
                    />

                    <InfoBlockShared
                        color="yellow"
                        icon={<IconArrowsUpDown size={16} />}
                        title={t('subscription-info.widget.bandwidth')}
                        value={`${user.trafficUsed} / ${user.trafficLimit === '0' ? '∞' : user.trafficLimit}`}
                    />
                </SimpleGrid>
            </Stack>
        </Card>
    )
}
