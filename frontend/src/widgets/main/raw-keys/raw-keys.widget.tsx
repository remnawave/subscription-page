import { IconCheck, IconCopy, IconKey, IconQrcode } from '@tabler/icons-react'
import {
    ActionIcon,
    Box,
    Card,
    CopyButton,
    Group,
    Image,
    ScrollArea,
    Stack,
    Text,
    Title
} from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'
import { renderSVG } from 'uqr'

import { useSubscriptionInfoStoreInfo } from '@entities/subscription-info-store'

interface ParsedLink {
    name: string
    fullLink: string
}

const parseLinks = (links: string[]): ParsedLink[] => {
    return links.map((link) => {
        const hashIndex = link.lastIndexOf('#')
        let name = 'Unknown'

        if (hashIndex !== -1) {
            const encodedName = link.substring(hashIndex + 1)
            try {
                name = decodeURIComponent(encodedName)
            } catch {
                name = encodedName
            }
        }

        return {
            name,
            fullLink: link
        }
    })
}

export const RawKeysWidget = ({ isMobile }: { isMobile: boolean }) => {
    const { t } = useTranslation()
    const { subscription } = useSubscriptionInfoStoreInfo()

    if (!subscription) return null
    if (subscription.links.length === 0) return null

    const parsedLinks = parseLinks(subscription.links)

    const handleShowQr = (link: ParsedLink) => {
        const qrCode = renderSVG(link.fullLink, {
            whiteColor: '#161B22',
            blackColor: '#22d3ee'
        })

        modals.open({
            centered: true,
            title: link.name,
            styles: {
                content: {
                    background: 'rgba(22, 27, 35, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                },
                header: {
                    background: 'transparent'
                },
                title: {
                    fontWeight: 600,
                    color: 'white'
                }
            },
            children: (
                <Stack align="center">
                    <Image
                        src={`data:image/svg+xml;utf8,${encodeURIComponent(qrCode)}`}
                        style={{ borderRadius: 'var(--mantine-radius-md)' }}
                    />
                    <Text c="dimmed" size="sm" ta="center">
                        {t('raw-keys.widget.scan-to-import')}
                    </Text>
                </Stack>
            )
        })
    }

    return (
        <Card p={{ base: 'sm', xs: 'md', sm: 'lg', md: 'xl' }} radius="lg" className="glass-card">
            <Stack gap="md">
                <Group justify="space-between" gap="sm">
                    <Title order={4} c="white" fw={600}>
                        {t('raw-keys.widget.title')}
                    </Title>
                    <Text size="xs" c="dimmed">
                        {parsedLinks.length} {t('raw-keys.widget.keys-count')}
                    </Text>
                </Group>

                <ScrollArea.Autosize mah={300}>
                    <Stack gap="xs">
                        {parsedLinks.map((link, index) => (
                            <Box
                                key={index}
                                p="xs"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid rgba(255, 255, 255, 0.06)',
                                    borderRadius: 'var(--mantine-radius-md)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <Group justify="space-between" wrap="nowrap" gap="xs">
                                    <Group gap="xs" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
                                        <IconKey
                                            size={isMobile ? 16 : 18}
                                            style={{
                                                color: 'var(--mantine-color-cyan-4)',
                                                flexShrink: 0
                                            }}
                                        />
                                        <Text
                                            size={isMobile ? 'xs' : 'sm'}
                                            c="white"
                                            fw={500}
                                            style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {link.name}
                                        </Text>
                                    </Group>

                                    <Group gap={4} wrap="nowrap">
                                        <CopyButton value={link.fullLink}>
                                            {({ copied, copy }) => (
                                                <ActionIcon
                                                    color={copied ? 'teal' : 'gray'}
                                                    variant="subtle"
                                                    size={isMobile ? 'sm' : 'md'}
                                                    onClick={copy}
                                                >
                                                    {copied ? (
                                                        <IconCheck size={isMobile ? 14 : 16} />
                                                    ) : (
                                                        <IconCopy size={isMobile ? 14 : 16} />
                                                    )}
                                                </ActionIcon>
                                            )}
                                        </CopyButton>

                                        <ActionIcon
                                            color="cyan"
                                            variant="subtle"
                                            size={isMobile ? 'sm' : 'md'}
                                            onClick={() => handleShowQr(link)}
                                        >
                                            <IconQrcode size={isMobile ? 14 : 16} />
                                        </ActionIcon>
                                    </Group>
                                </Group>
                            </Box>
                        ))}
                    </Stack>
                </ScrollArea.Autosize>
            </Stack>
        </Card>
    )
}
