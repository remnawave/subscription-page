import {
    IconAlertCircle,
    IconArrowsUpDown,
    IconCalendar,
    IconCheck,
    IconChevronDown,
    IconUserScan,
    IconX
} from '@tabler/icons-react'
import {
    Card,
    Collapse,
    Group,
    SimpleGrid,
    Stack,
    Text,
    ThemeIcon,
    UnstyledButton
} from '@mantine/core'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import dayjs from 'dayjs'

import {
    formatDate,
    getExpirationTextUtil
} from '@shared/utils/time-utils/get-expiration-text/get-expiration-text.util'
import { useSubscriptionInfoStoreInfo } from '@entities/subscription-info-store'
import { InfoBlockShared } from '@shared/ui/info-block/info-block.shared'
import { vibrate } from '@shared/utils/vibrate'

dayjs.extend(relativeTime)

export const SubscriptionInfoCollapsedWidget = ({ isMobile }: { isMobile: boolean }) => {
    const { t, i18n } = useTranslation()
    const { subscription } = useSubscriptionInfoStoreInfo()
    const [isExpanded, setIsExpanded] = useState(false)

    if (!subscription) return null

    const { user } = subscription

    const getStatusConfig = () => {
        if (user.userStatus === 'ACTIVE' && user.daysLeft > 3) {
            return { color: 'teal', icon: <IconCheck size={14} /> }
        }
        if (user.userStatus === 'ACTIVE' && user.daysLeft > 0) {
            return { color: 'orange', icon: <IconAlertCircle size={14} /> }
        }
        return { color: 'red', icon: <IconX size={14} /> }
    }

    const status = getStatusConfig()

    return (
        <Card p={0} radius="lg" className="glass-card" style={{ overflow: 'hidden' }}>
            <UnstyledButton
                onClick={() => {
                    vibrate('tap')
                    setIsExpanded(!isExpanded)
                }}
                style={{ width: '100%' }}
                p={{ base: 'xs', sm: 'sm' }}
            >
                <Group gap="sm" wrap="nowrap" justify="space-between">
                    <Group gap="xs" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
                        <ThemeIcon
                            color={status.color}
                            size={isMobile ? 28 : 32}
                            radius="xl"
                            variant="light"
                            style={{
                                background: `linear-gradient(135deg, var(--mantine-color-${status.color}-filled) 0%, var(--mantine-color-${status.color}-light) 100%)`,
                                border: `1px solid var(--mantine-color-${status.color}-4)`,
                                flexShrink: 0
                            }}
                        >
                            {status.icon}
                        </ThemeIcon>

                        <Stack gap={0} style={{ minWidth: 0, flex: 1 }}>
                            <Text
                                c="white"
                                fw={600}
                                size={isMobile ? 'sm' : 'md'}
                                style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {user.username}
                            </Text>
                            <Text c="dimmed" size="xs" style={{ whiteSpace: 'nowrap' }}>
                                {getExpirationTextUtil(user.expiresAt, t, i18n)}
                            </Text>
                        </Stack>
                    </Group>

                    <Group gap="xs" wrap="nowrap" style={{ flexShrink: 0 }}>
                        <IconChevronDown
                            size={18}
                            color="var(--mantine-color-dimmed)"
                            style={{
                                transition: 'transform 200ms ease',
                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                            }}
                        />
                    </Group>
                </Group>
            </UnstyledButton>

            <Collapse in={isExpanded}>
                <Stack gap="xs" px={{ base: 'xs', sm: 'sm' }} pb={{ base: 'xs', sm: 'sm' }}>
                    <SimpleGrid cols={2} spacing="xs" verticalSpacing="xs">
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
            </Collapse>
        </Card>
    )
}
