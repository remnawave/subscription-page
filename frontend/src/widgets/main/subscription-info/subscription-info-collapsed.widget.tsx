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
import { useState } from 'react'

import {
    formatDate,
    getColorGradientSolid,
    getExpirationTextUtil
} from '@shared/utils/config-parser'
import { InfoBlockShared } from '@shared/ui/info-block/info-block.shared'
import { useSubscription } from '@entities/subscription-info-store'
import { vibrate } from '@shared/utils/vibrate'
import { useTranslation } from '@shared/hooks'

interface IProps {
    isMobile: boolean
}

export const SubscriptionInfoCollapsedWidget = ({ isMobile }: IProps) => {
    const { t, currentLang, baseTranslations } = useTranslation()
    const subscription = useSubscription()
    const [isExpanded, setIsExpanded] = useState(false)

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
    const gradientColor = getColorGradientSolid(status.color)

    return (
        <Card className="glass-card" p={0} radius="lg" style={{ overflow: 'hidden' }}>
            <UnstyledButton
                onClick={() => {
                    vibrate('tap')
                    setIsExpanded(!isExpanded)
                }}
                p={{ base: 'xs', sm: 'sm' }}
                style={{ width: '100%' }}
            >
                <Group gap="sm" justify="space-between" wrap="nowrap">
                    <Group gap="xs" style={{ minWidth: 0, flex: 1 }} wrap="nowrap">
                        <ThemeIcon
                            color={status.color}
                            radius="xl"
                            size={isMobile ? 28 : 32}
                            style={{
                                background: gradientColor.background,
                                border: gradientColor.border,
                                boxShadow: gradientColor.boxShadow,
                                flexShrink: 0
                            }}
                            variant="light"
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
                                {getExpirationTextUtil(
                                    user.expiresAt,
                                    currentLang,
                                    baseTranslations
                                )}
                            </Text>
                        </Stack>
                    </Group>

                    <Group gap="xs" style={{ flexShrink: 0 }} wrap="nowrap">
                        <IconChevronDown
                            color="var(--mantine-color-dimmed)"
                            size={18}
                            style={{
                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 150ms ease'
                            }}
                        />
                    </Group>
                </Group>
            </UnstyledButton>

            <Collapse in={isExpanded} keepMounted>
                <Stack gap="xs" pb={{ base: 'xs', sm: 'sm' }} px={{ base: 'xs', sm: 'sm' }}>
                    <SimpleGrid cols={2} spacing="xs" verticalSpacing="xs">
                        <InfoBlockShared
                            color="blue"
                            icon={<IconUserScan size={16} />}
                            title={t(baseTranslations.name)}
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
                            title={t(baseTranslations.status)}
                            value={
                                user.userStatus === 'ACTIVE'
                                    ? t(baseTranslations.active)
                                    : t(baseTranslations.inactive)
                            }
                        />

                        <InfoBlockShared
                            color="red"
                            icon={<IconCalendar size={16} />}
                            title={t(baseTranslations.expires)}
                            value={formatDate(user.expiresAt, currentLang, baseTranslations)}
                        />

                        <InfoBlockShared
                            color="yellow"
                            icon={<IconArrowsUpDown size={16} />}
                            title={t(baseTranslations.bandwidth)}
                            value={`${user.trafficUsed} / ${user.trafficLimit === '0' ? '∞' : user.trafficLimit}`}
                        />
                    </SimpleGrid>
                </Stack>
            </Collapse>
        </Card>
    )
}
