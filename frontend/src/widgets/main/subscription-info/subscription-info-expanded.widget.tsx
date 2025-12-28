import {
    IconAlertCircle,
    IconArrowsUpDown,
    IconCalendar,
    IconCheck,
    IconUserScan,
    IconX
} from '@tabler/icons-react'
import { Card, Group, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core'

import {
    formatDate,
    getColorGradientSolid,
    getExpirationTextUtil
} from '@shared/utils/config-parser'
import { InfoBlockShared } from '@shared/ui/info-block/info-block.shared'
import { useSubscription } from '@entities/subscription-info-store'
import { useTranslation } from '@shared/hooks'

interface IProps {
    isMobile: boolean
}

export const SubscriptionInfoExpandedWidget = ({ isMobile }: IProps) => {
    const { t, currentLang, baseTranslations } = useTranslation()
    const subscription = useSubscription()

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
                status: t(baseTranslations.active)
            }
        }
        if (
            (user.userStatus === 'ACTIVE' && user.daysLeft === 0) ||
            (user.daysLeft >= 0 && user.daysLeft <= 3)
        ) {
            return {
                color: 'orange',
                icon: <IconAlertCircle size={isMobile ? 18 : 22} />,
                status: t(baseTranslations.active)
            }
        }
        return {
            color: 'red',
            icon: <IconX size={isMobile ? 18 : 22} />,
            status: t(baseTranslations.inactive)
        }
    }

    const statusInfo = getStatusAndIcon()
    const gradientColor = getColorGradientSolid(statusInfo.color)

    return (
        <Card p={{ base: 'sm', xs: 'md', sm: 'lg', md: 'xl' }} radius="lg">
            <Stack gap={isMobile ? 'sm' : 'md'}>
                <Group gap="sm" justify="space-between">
                    <Group
                        gap={isMobile ? 'xs' : 'sm'}
                        style={{ minWidth: 0, flex: 1 }}
                        wrap="nowrap"
                    >
                        <ThemeIcon
                            color={statusInfo.color}
                            radius="xl"
                            size={isMobile ? 36 : 44}
                            style={{
                                background: gradientColor.background,
                                border: gradientColor.border,
                                boxShadow: gradientColor.boxShadow,
                                flexShrink: 0
                            }}
                            variant="light"
                        >
                            {statusInfo.icon}
                        </ThemeIcon>

                        <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
                            <Title
                                c="white"
                                fw={600}
                                order={5}
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
                                fw={600}
                                size={isMobile ? 'xs' : 'sm'}
                            >
                                {getExpirationTextUtil(
                                    user.expiresAt,
                                    currentLang,
                                    baseTranslations
                                )}
                            </Text>
                        </Stack>
                    </Group>
                </Group>

                <SimpleGrid cols={{ base: 2, xs: 2, sm: 2 }} spacing="xs" verticalSpacing="xs">
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
        </Card>
    )
}
