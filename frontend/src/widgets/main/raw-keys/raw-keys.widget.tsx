import { IconCheck, IconCopy, IconKey, IconQrcode } from '@tabler/icons-react'
import {
    ActionIcon,
    Badge,
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
import { modals } from '@mantine/modals'
import { renderSVG } from 'uqr'

import { useSubscription } from '@entities/subscription-info-store'
import { useTranslation } from '@shared/hooks'
import { vibrate } from '@shared/utils/vibrate'

import classes from './raw-keys.module.css'

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

interface IProps {
    isMobile: boolean
}

export const RawKeysWidget = ({ isMobile }: IProps) => {
    const { t, baseTranslations } = useTranslation()
    const subscription = useSubscription()

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
            classNames: {
                content: classes.modalContent,
                header: classes.modalHeader,
                title: classes.modalTitle
            },
            children: (
                <Stack align="center">
                    <Image
                        src={`data:image/svg+xml;utf8,${encodeURIComponent(qrCode)}`}
                        style={{ borderRadius: 'var(--mantine-radius-md)' }}
                    />
                    <Text c="dimmed" size="sm" ta="center">
                        {t(baseTranslations.scanToImport)}
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
                        {t(baseTranslations.connectionKeysHeader)}
                    </Title>
                    {parsedLinks.length > 1 && (
                        <Badge color="cyan" variant="light" size="lg">
                            {parsedLinks.length}
                        </Badge>
                    )}
                </Group>

                <ScrollArea.Autosize mah={300} scrollbars="y">
                    <Stack gap="xs">
                        {parsedLinks.map((link, index) => (
                            <Box key={index} p="xs" className={classes.keyBox}>
                                <Box className={classes.keyRow}>
                                    <Box className={classes.keyInfo}>
                                        <IconKey
                                            size={isMobile ? 16 : 18}
                                            style={{
                                                color: 'var(--mantine-color-cyan-4)',
                                                flexShrink: 0
                                            }}
                                        />
                                        <Box className={classes.keyName}>
                                            <Text
                                                size={isMobile ? 'xs' : 'sm'}
                                                c="white"
                                                fw={500}
                                                span
                                            >
                                                {link.name}
                                            </Text>
                                        </Box>
                                    </Box>

                                    <Group gap={4} wrap="nowrap">
                                        <CopyButton value={link.fullLink}>
                                            {({ copied, copy }) => (
                                                <ActionIcon
                                                    color={copied ? 'teal' : 'gray'}
                                                    variant="subtle"
                                                    size={isMobile ? 'sm' : 'md'}
                                                    onClick={() => {
                                                        vibrate('drop')
                                                        copy()
                                                    }}
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
                                            onClick={() => {
                                                vibrate('tap')
                                                handleShowQr(link)
                                            }}
                                        >
                                            <IconQrcode size={isMobile ? 14 : 16} />
                                        </ActionIcon>
                                    </Group>
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                </ScrollArea.Autosize>
            </Stack>
        </Card>
    )
}
