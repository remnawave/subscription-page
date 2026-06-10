import { Button, Card, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconPlayerPlayFilled } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'

import { VideoGuide } from '@shared/ui'

const VIDEO_SRC = '/assets/guide-bot-step1.mp4'

const STEPS = [
    'Откройте Telegram-бота PoletVPN и нажмите «Старт»',
    'Получите ключ и вернитесь на эту страницу',
    'Добавьте ключ в приложение и выберите сервер'
]

export const VideoGuideCardWidget = () => {
    const [opened, { open, close }] = useDisclosure(false)

    return (
        <>
            <Card p={{ base: 'md', sm: 'lg' }} radius="lg">
                <Group gap="md" justify="space-between" wrap="nowrap">
                    <Group gap="md" wrap="nowrap">
                        <ThemeIcon color="brand" radius="md" size={44} variant="light">
                            <IconPlayerPlayFilled size={20} />
                        </ThemeIcon>
                        <Stack gap={2}>
                            <Text c="dark.8" fw={600} size="sm">
                                Не знаете, как подключиться?
                            </Text>
                            <Text c="dimmed" size="sm">
                                Видео-инструкция — меньше минуты
                            </Text>
                        </Stack>
                    </Group>
                    <Button
                        leftSection={<IconPlayerPlayFilled size={16} />}
                        onClick={open}
                        radius="xl"
                        variant="filled"
                        visibleFrom="xs"
                    >
                        Смотреть
                    </Button>
                    <Button hiddenFrom="xs" onClick={open} radius="xl" size="sm" variant="filled">
                        <IconPlayerPlayFilled size={16} />
                    </Button>
                </Group>
            </Card>

            <VideoGuide
                onClose={close}
                opened={opened}
                steps={STEPS}
                subtitle="Короткое видео — подключение займёт меньше минуты"
                title="Как подключиться"
                videoSrc={VIDEO_SRC}
            />
        </>
    )
}
