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
import { IconCheck, IconCopy, IconKey, IconQrcode } from '@tabler/icons-react'
import { modals } from '@mantine/modals'
import { renderSVG } from 'uqr'

import { useSubscription } from '@entities/subscription-info-store'
import { vibrate } from '@shared/utils/vibrate'
import { useTranslation } from '@shared/hooks'

import classes from './raw-keys.module.css'

interface ParsedLink {
    fullLink: string
    name: string
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
        <Card p={{ base: 'sm', xs: 'md', sm: 'lg', md: 'xl' }} radius="lg">
            <Stack gap="md">
                <Group gap="sm" justify="space-between">
                    <Title c="white" fw={600} order={4}>
                        {t(baseTranslations.connectionKeysHeader)}
                    </Title>
                    {parsedLinks.length > 1 && (
                        <Badge color="cyan" size="lg" variant="light">
                            {parsedLinks.length}
                        </Badge>
                    )}
                </Group>

                <ScrollArea.Autosize mah={300} scrollbars="y">
                    <Stack gap="xs">
                        {parsedLinks.map((link, index) => (
                            <Box className={classes.keyBox} key={index} p="xs">
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
                                                c="white"
                                                fw={500}
                                                size={isMobile ? 'xs' : 'sm'}
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
                                                    onClick={() => {
                                                        vibrate('drop')
                                                        copy()
                                                    }}
                                                    size={isMobile ? 'sm' : 'md'}
                                                    variant="subtle"
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
                                            onClick={() => {
                                                vibrate('tap')
                                                handleShowQr(link)
                                            }}
                                            size={isMobile ? 'sm' : 'md'}
                                            variant="subtle"
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
