import { Box, List, Modal, Stack, Text } from '@mantine/core'

import classes from './video-guide.module.css'

interface IProps {
    onClose: () => void
    opened: boolean
    steps?: string[]
    subtitle?: string
    title?: string
    videoSrc: string
}

/**
 * PoletVPN on-demand video guide. A Mantine modal holding a 16:9 video
 * player plus a short numbered step list. Pure presentation — the video is
 * a bundled static asset, independent of the panel-driven app config.
 */
export const VideoGuide = ({
    opened,
    onClose,
    title = 'Как подключиться',
    subtitle,
    videoSrc,
    steps = []
}: IProps) => {
    return (
        <Modal
            centered
            classNames={{
                content: classes.modalContent,
                header: classes.modalHeader,
                title: classes.modalTitle
            }}
            onClose={onClose}
            opened={opened}
            radius="lg"
            size="lg"
            title={title}
        >
            <Stack gap="md">
                {subtitle && (
                    <Text c="dimmed" size="sm">
                        {subtitle}
                    </Text>
                )}

                <Box className={classes.videoFrame}>
                    <video
                        className={classes.video}
                        controls
                        playsInline
                        preload="metadata"
                        src={videoSrc}
                    >
                        <track kind="captions" />
                    </video>
                </Box>

                {steps.length > 0 && (
                    <List className={classes.steps} listStyleType="none" spacing="xs">
                        {steps.map((step, index) => (
                            <List.Item
                                icon={<span className={classes.stepNumber}>{index + 1}</span>}
                                key={index}
                            >
                                <Text c="dark.7" size="sm">
                                    {step}
                                </Text>
                            </List.Item>
                        ))}
                    </List>
                )}
            </Stack>
        </Modal>
    )
}
