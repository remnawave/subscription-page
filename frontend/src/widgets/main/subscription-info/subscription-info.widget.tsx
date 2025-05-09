import {
    IconAlertCircle,
    IconArrowsUpDown,
    IconCalendar,
    IconCheck,
    IconUser,
    IconX
} from '@tabler/icons-react'
import { Accordion, rgba, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core'
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
export const SubscriptionInfoWidget = () => {
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
                icon: <IconCheck size={20} />,
                status: t('subscription-info.widget.active')
            }
        }
        if (
            (user.userStatus === 'ACTIVE' && user.daysLeft === 0) ||
            (user.daysLeft >= 0 && user.daysLeft <= 3)
        ) {
            return {
                color: 'orange',
                icon: <IconAlertCircle size={20} />,
                status: t('subscription-info.widget.active')
            }
        }

        return {
            color: 'red',
            icon: <IconX size={20} />,
            status: t('subscription-info.widget.inactive')
        }
    }

    return (
        <Accordion
            styles={(theme) => ({
                item: {
                    boxShadow: `0 4px 12px ${rgba(theme.colors.gray[5], 0.1)}`
                }
            })}
            variant="separated"
        >
            <Accordion.Item value="subscription-info">
                <Accordion.Control
                    icon={
                        <ThemeIcon color={getStatusAndIcon().color} size="lg" variant="light">
                            {getStatusAndIcon().icon}
                        </ThemeIcon>
                    }
                >
                    <Stack gap={3}>
                        <Text fw={500} size="md" truncate>
                            {user.username}
                        </Text>
                        <Text c={user.daysLeft === 0 ? 'red' : 'dimmed'} size="xs">
                            {getExpirationTextUtil(user.expiresAt, t, i18n)}
                        </Text>
                    </Stack>
                </Accordion.Control>
                <Accordion.Panel>
                    <SimpleGrid cols={{ base: 1, sm: 2, xs: 2 }} spacing="xs" verticalSpacing="sm">
                        <InfoBlockShared
                            color="blue"
                            icon={<IconUser size={20} />}
                            title={t('subscription-info.widget.name')}
                            value={user.username}
                        />

                        <InfoBlockShared
                            color={user.userStatus === 'ACTIVE' ? 'green' : 'red'}
                            icon={
                                user.userStatus === 'ACTIVE' ? (
                                    <IconCheck size={20} />
                                ) : (
                                    <IconX size={20} />
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
                            icon={<IconCalendar size={20} />}
                            title={t('subscription-info.widget.expires')}
                            value={formatDate(user.expiresAt, t, i18n)}
                        />

                        <InfoBlockShared
                            color="yellow"
                            icon={<IconArrowsUpDown size={20} />}
                            title={t('subscription-info.widget.bandwidth')}
                            value={`${user.trafficUsed} / ${user.trafficLimit === '0' ? '∞' : user.trafficLimit}`}
                        />
                    </SimpleGrid>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
}
